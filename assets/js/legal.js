(()=>{
  const key='rp_cookie_notice_v1';
  try{if(localStorage.getItem(key)==='dismissed')return;}catch(e){}
  const notice=document.createElement('aside');
  notice.className='cookie-notice';
  notice.setAttribute('role','status');
  notice.setAttribute('aria-label','Privacy and cookie notice');
  notice.innerHTML='<div class="cookie-copy"><strong>Privacy &amp; cookies</strong><p>We use Google Analytics to understand website use, and embedded services such as Calendly may use cookies. Read our <a href="/cookie-policy">Cookie Policy</a> and <a href="/privacy-policy">Privacy Policy</a>.</p></div><button class="cookie-dismiss" type="button">OK</button>';
  document.body.appendChild(notice);
  requestAnimationFrame(()=>notice.classList.add('is-visible'));
  notice.querySelector('.cookie-dismiss')?.addEventListener('click',()=>{
    try{localStorage.setItem(key,'dismissed');}catch(e){}
    notice.classList.remove('is-visible');
    setTimeout(()=>notice.remove(),220);
  });
})();
