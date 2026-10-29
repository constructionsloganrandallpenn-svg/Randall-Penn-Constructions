(()=>{"use strict";
document.documentElement.classList.add("reveal-ready");
const body=document.body,header=document.querySelector('.site-header'),menu=document.querySelector('.mobile-menu'),openBtn=document.querySelector('.menu-toggle'),closeBtn=document.querySelector('.menu-close');
const closeMenu=()=>{menu?.classList.remove('open');menu?.setAttribute('aria-hidden','true');openBtn?.setAttribute('aria-expanded','false');body.classList.remove('menu-open')};
const openMenu=()=>{menu?.classList.add('open');menu?.setAttribute('aria-hidden','false');openBtn?.setAttribute('aria-expanded','true');body.classList.add('menu-open');closeBtn?.focus()};
openBtn?.addEventListener('click',openMenu);
closeBtn?.addEventListener('click',closeMenu);
menu?.addEventListener('click',e=>{if(e.target===menu)closeMenu()});
document.querySelectorAll('.mobile-links a').forEach(a=>a.addEventListener('click',closeMenu));
const syncHeader=()=>header?.classList.toggle('scrolled',window.scrollY>24);
window.addEventListener('scroll',syncHeader,{passive:true});syncHeader();
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced&&'IntersectionObserver'in window){
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -25px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}else{
  document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
}
const form=document.querySelector('[data-enquiry-form]');
if(form){
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const status=form.querySelector('.form-status');
    const button=form.querySelector('button[type="submit"]');
    const data=Object.fromEntries(new FormData(form).entries());
    if(status)status.textContent='Sending…';
    if(button)button.disabled=true;
    try{
      const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(result.error||'Unable to send your enquiry.');
      form.reset();
      if(status)status.textContent='Thanks — your enquiry has been sent.';
    }catch(err){
      if(status)status.textContent=err.message||'Unable to send your enquiry. Please try again.';
    }finally{
      if(button)button.disabled=false;
    }
  });
}
})();

// Project media tabs + Site Journal progressive reveal + shared lightbox
const projectTabs=[...document.querySelectorAll('[data-project-tab]')];
const projectPanels=[...document.querySelectorAll('[data-project-panel]')];
const loadPanelImages=panel=>panel?.querySelectorAll('img[data-src]').forEach(img=>{img.src=img.dataset.src;img.removeAttribute('data-src');});
const selectProjectMedia=(slug,updateUrl=false)=>{
  if(!projectPanels.length)return;
  const valid=projectPanels.some(panel=>panel.dataset.projectPanel===slug);
  const activeSlug=valid?slug:'paddington';
  projectTabs.forEach(tab=>tab.setAttribute('aria-selected',String(tab.dataset.projectTab===activeSlug)));
  projectPanels.forEach(panel=>{
    const active=panel.dataset.projectPanel===activeSlug;
    panel.hidden=!active;
    if(active)loadPanelImages(panel);
  });
  if(updateUrl){
    const url=new URL(window.location.href);
    url.searchParams.set('project',activeSlug);
    url.hash='project-media';
    history.replaceState({},'',url);
  }
};
if(projectPanels.length){
  const requested=new URLSearchParams(window.location.search).get('project')||'paddington';
  selectProjectMedia(requested,false);
  projectTabs.forEach(tab=>tab.addEventListener('click',()=>selectProjectMedia(tab.dataset.projectTab,true)));
}

const journal=document.querySelector('[data-media-gallery]');
const journalItems=journal?[...journal.querySelectorAll('[data-media-item]')]:[];
const mediaMore=document.querySelector('[data-media-more]');
let mediaVisible=journalItems.filter(item=>!item.classList.contains('is-hidden')).length;
const syncMediaMore=()=>{if(!mediaMore)return;mediaMore.hidden=mediaVisible>=journalItems.length;};
mediaMore?.addEventListener('click',()=>{
  journalItems.slice(mediaVisible,mediaVisible+12).forEach(el=>{
    const img=el.querySelector('img[data-src]');
    if(img){img.src=img.dataset.src;img.removeAttribute('data-src');}
    el.classList.remove('is-hidden');
  });
  mediaVisible+=12;
  syncMediaMore();
});
syncMediaMore();

const allMediaItems=[...document.querySelectorAll('[data-media-item]')];
const lightbox=document.querySelector('[data-lightbox-dialog]');
const lightboxImage=document.querySelector('[data-lightbox-image]');
allMediaItems.forEach(item=>item.addEventListener('click',()=>{
  if(!lightbox||!lightboxImage)return;
  lightboxImage.src=item.dataset.src||item.querySelector('img')?.src||'';
  lightbox.showModal();
}));
document.querySelector('[data-lightbox-close]')?.addEventListener('click',()=>lightbox?.close());
lightbox?.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});

