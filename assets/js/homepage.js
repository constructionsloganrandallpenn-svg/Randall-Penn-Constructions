(()=>{"use strict";
const $=(id)=>document.getElementById(id);
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!reduced && "IntersectionObserver" in window)document.documentElement.classList.add("motion-ready");
const body=document.body;
const intro=$("intro");
const finishIntro=()=>{if(!intro||intro.classList.contains("is-done"))return;intro.classList.add("is-done");try{sessionStorage.setItem("rp_intro_seen","1")}catch(e){}window.setTimeout(()=>body.classList.add("hero-enter"),380);window.setTimeout(()=>{intro.hidden=true},740)};
if(intro){if(document.documentElement.classList.contains("skip-intro")){intro.hidden=true;body.classList.add("hero-enter")}else{intro.classList.add("intro-ready");$("introSkip")?.addEventListener("click",finishIntro);window.setTimeout(finishIntro,5700)}}
const backdrop=$("menuBackdrop"),drawer=$("menuDrawer"),floatButton=$("floatMenu"),mobileButton=$("mobileNavToggle"),backTop=$("backTop");
let lastFocus=null;
function openMenu(){lastFocus=document.activeElement;backdrop.classList.add("open");backdrop.setAttribute("aria-hidden","false");body.classList.add("menu-open");floatButton?.setAttribute("aria-expanded","true");mobileButton?.setAttribute("aria-expanded","true");$("drawerClose")?.focus()}
function closeMenu(){backdrop.classList.remove("open");backdrop.setAttribute("aria-hidden","true");body.classList.remove("menu-open");floatButton?.setAttribute("aria-expanded","false");mobileButton?.setAttribute("aria-expanded","false");if(lastFocus?.focus)lastFocus.focus()}
[floatButton,mobileButton].forEach(btn=>btn?.addEventListener("click",openMenu));
$("drawerClose")?.addEventListener("click",closeMenu);
backdrop?.addEventListener("click",e=>{if(e.target===backdrop)closeMenu()});
document.querySelectorAll(".drawer-links a,.drawer-foot a").forEach(a=>a.addEventListener("click",closeMenu));
const hero=$("home"),heroMedia=$("heroMedia"),featuredBox=$("featuredParallax"),featuredPhoto=$("featuredPhoto");
let ticking=false;
function updateScroll(){
 if(!hero)return;
 const rect=hero.getBoundingClientRect();
 const left=rect.bottom<=60;
 floatButton?.classList.toggle("show",left);
 backTop?.classList.toggle("show",window.scrollY>650);
 if(!reduced&&heroMedia&&rect.bottom>0&&rect.top<window.innerHeight){
   const progress=Math.min(1,Math.max(0,-rect.top/Math.max(1,rect.height)));
   const travel=window.innerWidth<=700?70:95;
   heroMedia.style.transform="translate3d(0,"+Math.round(-26+progress*travel)+"px,0) scale("+(window.innerWidth<=700?"1.03":"1.045")+")";
 }
 if(!reduced&&featuredBox&&featuredPhoto){
   const box=featuredBox.getBoundingClientRect();
   if(box.bottom>0&&box.top<window.innerHeight){
     const progress=Math.min(1,Math.max(0,(window.innerHeight-box.top)/(window.innerHeight+box.height)));
     featuredPhoto.style.transform="translate3d(0,"+Math.round((progress-.5)*112)+"px,0)";
   }
 }
 ticking=false;
}
window.addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(updateScroll)}},{passive:true});window.addEventListener("resize",updateScroll);updateScroll();
backTop?.addEventListener("click",()=>window.scrollTo({top:0,behavior:reduced?"instant":"smooth"}));
const projects=[
 {title:"A home, reimagined.",kind:"Residential renovation",number:"01",image:"assets/images/project-01.jpg",description:"A closer look at residential transformation, from considered building details to beautifully finished spaces."},
 {title:"The outdoor connection",kind:"Outdoor living",number:"02",image:"assets/images/project-02.jpg",description:"Outdoor living that brings the home and its surroundings together, with attention to construction quality and the details that make spaces work."},
 {title:"Room to come together",kind:"Interior construction",number:"03",image:"assets/images/project-03.jpg",description:"The craftsmanship behind finished interiors — from built-in joinery to the lines, materials and practical details that bring spaces together."},
 {title:"More space, naturally",kind:"Residential extensions",number:"04",image:"assets/images/project-04.jpg",description:"Well-considered extensions that create room to live while bringing new and existing spaces into balance."}
];
let featuredIndex=-1;
const elements={img:$("featuredPhoto"),heading:$("featuredTitle"),desc:$("featuredDesc"),idx:$("featuredIndex"),cards:$("supportingCards")};
const createTile=(p,i)=>{const b=document.createElement("button");b.className="project-tile";b.type="button";b.setAttribute("aria-label","Preview: "+p.title);b.innerHTML='<div class="project-photo"><img loading="lazy" alt="Architectural project photography illustrating '+p.kind+'" src="'+p.image.replace("w=1800","w=800")+'"></div><h3></h3><div class="type"></div>';b.querySelector("h3").textContent=p.title;b.querySelector(".type").textContent=p.kind;b.addEventListener("click",()=>openProject(i));return b};
function sydneyDay(){const parts=new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());const obj={};parts.forEach(part=>{if(part.type!=="literal")obj[part.type]=+part.value});return Math.floor((Date.UTC(obj.year,obj.month-1,obj.day)-Date.UTC(2026,9,2))/86400000)}
function renderFeatured(force=false){const day=sydneyDay();const selected=((day%4)+4)%4;if(!force&&selected===featuredIndex)return;featuredIndex=selected;const p=projects[selected];if(elements.img){elements.img.src=p.image;elements.img.alt="Illustrative finished residential architecture photograph for "+p.kind}if(elements.heading)elements.heading.textContent=p.title;if(elements.desc)elements.desc.textContent=p.description;if(elements.idx)elements.idx.textContent=p.number+" / FEATURED WORK";if(elements.cards){elements.cards.replaceChildren();for(let k=1;k<4;k++){const idx=(selected+k)%4;elements.cards.appendChild(createTile(projects[idx],idx))}}}
$("featuredView")?.addEventListener("click",()=>{window.location.href="/projects"});renderFeatured(true);window.setInterval(renderFeatured,60000);
const modal=$("infoModal"),modalTitle=$("modalTitle"),modalEyebrow=$("modalEyebrow"),modalCopy=$("modalCopy"),modalPhoto=$("modalPhoto"),modalTags=$("modalTags"),modalSocials=$("modalSocials"),modalAction=$("modalAction");
function openModal({title,eyebrow,copy,img,tags,contact=false}){if(!modal)return;modalTitle.textContent=title;modalEyebrow.textContent=eyebrow;modalCopy.textContent=copy;if(img){modalPhoto.src=img;modalPhoto.alt="Illustrative project photography";modalPhoto.hidden=false}else{modalPhoto.hidden=true;modalPhoto.removeAttribute("src")}modalTags.replaceChildren();(tags||[]).forEach(t=>{const el=document.createElement("span");el.className="modal-tag";el.textContent=t;modalTags.appendChild(el)});modalSocials.hidden=!contact;modalAction.hidden=contact;modal.showModal();body.classList.add("modal-open");$("modalClose")?.focus()}
function openProject(i){const p=projects[i];openModal({title:p.title,eyebrow:p.kind+" / CONTENT PREVIEW",copy:p.description+" Images shown here are illustrative placeholders, not a completed Randall-Penn project. The full project page will be built when actual photography and project details are supplied.",img:p.image,tags:["Concept imagery","Individual project page pending"]})}
const serviceText={
 "Residential construction":"A dedicated service section for Randall-Penn's confirmed residential construction capabilities and examples of completed work will be added when Logan approves the full service copy.",
 "Renovations & upgrades":"A dedicated service section outlining Randall-Penn's confirmed renovations and upgrade services, with actual project examples, will be prepared for the Services page.",
 "Extensions & additions":"A dedicated service section detailing confirmed extensions and additions, supported by real project imagery and scope, will be prepared for the Services page.",
 "Outdoor living & carpentry":"A dedicated service section for confirmed outdoor living and carpentry work, illustrated by Logan's real projects, will be prepared for the Services page."
};
document.querySelectorAll("[data-service]").forEach(el=>el.addEventListener("click",()=>{const title=el.dataset.service;openModal({title,eyebrow:"WHAT WE DO / SERVICE PREVIEW",copy:serviceText[title]||"Detailed service content is being prepared.",tags:["Full Services page pending"]})}));
function openAbout(){openModal({title:"About Randall-Penn",eyebrow:"THE PERSON BEHIND THE WORK",copy:"Get to know the person behind Randall-Penn Constructions and his approach to residential building. The dedicated About page will include Logan's approved background, work and real on-site photography once supplied.",tags:["Full About page pending"]})}
document.querySelectorAll("[data-about]").forEach(el=>el.addEventListener("click",openAbout));
function openContact(){openModal({title:"Talk to Randall-Penn",eyebrow:"GET IN TOUCH",copy:"The dedicated Contact page and enquiry form are being prepared. For this homepage preview, use Randall-Penn's published social profiles to make contact.",tags:["Contact page pending"],contact:true})}
document.querySelectorAll("[data-contact]").forEach(el=>el.addEventListener("click",openContact));
$("modalClose")?.addEventListener("click",()=>modal.close());
modal?.addEventListener("close",()=>{body.classList.remove("modal-open")});
modal?.addEventListener("click",e=>{if(e.target===modal)modal.close()});
modalAction?.addEventListener("click",()=>{modal.close();window.location.href="/contact"});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&backdrop?.classList.contains("open"))closeMenu();if(e.key==="Tab"&&backdrop?.classList.contains("open")){const f=[...drawer.querySelectorAll('a[href],button:not([disabled])')].filter(x=>x.offsetParent!==null);const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});

/* Portrait build film: one automatic play per page visit; ended films remain on their final frame. */
const buildVideo=$("buildVideo"),buildPlay=$("buildPlay"),buildSound=$("buildSound");
if(buildVideo){
  buildVideo.pause();
  buildVideo.autoplay=false;
  buildVideo.loop=false;
  buildVideo.muted=true;
  let videoInView=false,autoStarted=false,userPaused=false,completed=false;
  const syncVideo=()=>{
    const playing=!buildVideo.paused&&!buildVideo.ended;
    if(buildPlay){
      const label=completed?"Replay video":playing?"Pause video":"Play video";
      buildPlay.innerHTML=completed?"↻ <span>REPLAY</span>":playing?"Ⅱ <span>PAUSE</span>":"▶ <span>PLAY</span>";
      buildPlay.setAttribute("aria-pressed",String(playing));
      buildPlay.setAttribute("aria-label",label);
    }
    if(buildSound){
      buildSound.innerHTML=buildVideo.muted?"♪ <span>SOUND OFF</span>":"♫ <span>SOUND ON</span>";
      buildSound.setAttribute("aria-pressed",String(!buildVideo.muted));
      buildSound.setAttribute("aria-label",buildVideo.muted?"Unmute video":"Mute video");
    }
  };
  const attemptPlay=()=>{
    if(!videoInView||document.hidden||completed||userPaused)return;
    const pending=buildVideo.play();
    if(pending?.catch)pending.catch(()=>{userPaused=true;syncVideo()});
    syncVideo();
  };
  buildVideo.addEventListener("play",syncVideo);
  buildVideo.addEventListener("pause",syncVideo);
  buildVideo.addEventListener("ended",()=>{completed=true;userPaused=true;syncVideo()});
  buildVideo.addEventListener("error",()=>{
    const box=buildVideo.closest(".build-video-wrap");
    if(box&&!box.querySelector(".build-error")){
      const message=document.createElement("div");message.className="build-error";
      message.textContent="The Build video could not be loaded.";
      message.style.cssText="position:absolute;inset:38% 18px auto;text-align:center;color:#fff;font-weight:700;font-size:14px;z-index:3";
      box.appendChild(message);
    }
  });
  if(!reduced)buildVideo.removeAttribute("controls");
  else buildVideo.setAttribute("controls","");
  buildPlay?.addEventListener("click",()=>{
    if(!buildVideo.paused&&!buildVideo.ended){
      userPaused=true;buildVideo.pause();syncVideo();return;
    }
    if(completed||buildVideo.ended){buildVideo.currentTime=0;completed=false;}
    userPaused=false;videoInView=true;attemptPlay();
  });
  buildSound?.addEventListener("click",()=>{buildVideo.muted=!buildVideo.muted;syncVideo()});
  if("IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>{
      videoInView=entries[0].isIntersecting;
      if(videoInView){
        if(!autoStarted&&!reduced)autoStarted=true;
        if(autoStarted&&!completed&&!userPaused)attemptPlay();
      }else if(!buildVideo.paused){
        buildVideo.pause();
      }
    },{threshold:.3});
    observer.observe(buildVideo);
  }else{
    videoInView=true;
    if(!reduced){autoStarted=true;attemptPlay();}
  }
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden)buildVideo.pause();
    else if(videoInView&&autoStarted&&!completed&&!userPaused)attemptPlay();
  });
  syncVideo();
}
/* Scroll-triggered editorial reveals, never applied to daily content rotation. */
if(!reduced && "IntersectionObserver" in window){
  const revealObserver=new IntersectionObserver(entries=>{
    for(const e of entries){if(e.isIntersecting){e.target.classList.add("is-visible");revealObserver.unobserve(e.target)}}
  },{threshold:.09,rootMargin:"0px 0px -25px 0px"});
  document.querySelectorAll(".motion-reveal").forEach(el=>revealObserver.observe(el));
}
$("year").textContent=String(new Date().getFullYear());
})();