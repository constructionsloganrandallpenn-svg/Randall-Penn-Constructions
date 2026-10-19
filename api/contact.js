const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, max = 2000) {
  return String(value ?? "").trim().slice(0, max);
}

function escapeHtml(value) {
  return clean(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const {
    RESEND_API_KEY,
    CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL
  } = process.env;

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    return res.status(503).json({
      error: "Online enquiries are not available yet. Please book a consultation instead."
    });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const name = clean(body.name, 120);
  const email = clean(body.email, 254);
  const phone = clean(body.phone, 80);
  const projectType = clean(body.projectType, 120);
  const suburb = clean(body.suburb, 120);
  const message = clean(body.message, 4000);
  const companyWebsite = clean(body.companyWebsite, 200);

  // Honeypot: return success without sending.
  if (companyWebsite) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !message || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Please complete your name, email and project details." });
  }

  const subject = `New website enquiry — ${name}`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#171a17">
      <h2>New Randall-Penn website enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone) || "—"}</p>
      <p><strong>Project type:</strong> ${escapeHtml(projectType) || "—"}</p>
      <p><strong>Project suburb:</strong> ${escapeHtml(suburb) || "—"}</p>
      <p><strong>Project details:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    </div>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject,
        html
      })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Resend error:", result);
      return res.status(502).json({ error: "Unable to send your enquiry right now. Please try again." });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({ error: "Unable to send your enquiry right now. Please try again." });
  }
}
