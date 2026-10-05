// Progressive enhancement only. Every page is complete before this script runs.
(() => {
 const english=document.documentElement.lang==='en';
 const fallbackUrl=new URL('assets/fallback/yeshui-2005-2026.jpg',document.currentScript.src).href;
 const pending=new WeakSet();
 function attach(img){
  let retries=0,finished=false,timer;
  let originalWidth=Number(img.getAttribute('width')),originalHeight=Number(img.getAttribute('height'));
  const loaded=()=>{if(img.naturalWidth){
   clearTimeout(timer);pending.delete(img);img.dataset.loadState='loaded';
   if(!originalWidth||!originalHeight){originalWidth=img.naturalWidth;originalHeight=img.naturalHeight;}
  }};
  const failed=()=>{
   if(finished||pending.has(img)||!img.isConnected)return;
   if(retries===0){
    retries=1;pending.add(img);img.dataset.loadState='retry-pending';
    timer=setTimeout(()=>{
     pending.delete(img);if(!img.isConnected)return;
     img.closest('picture')?.querySelectorAll('source').forEach(source=>source.remove());
     img.removeAttribute('srcset');img.removeAttribute('sizes');
     const retry=new URL(img.dataset.retrySrc||img.src,location.href);
     retry.searchParams.set('retry','1');img.dataset.loadState='retrying';img.src=retry.href;
    },1500);
    return;
   }
   finished=true;clearTimeout(timer);pending.delete(img);
   img.removeEventListener('load',loaded);img.removeEventListener('error',failed);
   const box=img.getBoundingClientRect();
   if(originalWidth&&originalHeight)img.style.aspectRatio=originalWidth+'/'+originalHeight;
   else if(box.width&&box.height)img.style.aspectRatio=box.width+'/'+box.height;
   img.style.objectFit='contain';img.style.objectPosition='center';
   img.closest('picture')?.querySelectorAll('source').forEach(source=>source.remove());
   img.removeAttribute('srcset');img.removeAttribute('sizes');
   img.alt=english?'Ye Shui, 2005–2026':'野水，2005—2026';
   img.dataset.loadState='fallback';
   img.addEventListener('error',()=>{img.dataset.loadState='fallback-failed';img.style.visibility='hidden';},{once:true});
   img.src=fallbackUrl;
  };
  img.addEventListener('load',loaded);img.addEventListener('error',failed);
  if(img.complete){if(img.naturalWidth)loaded();else failed();}
 }
 document.querySelectorAll('main img').forEach(attach);
 // Language controls are ordinary links, so both languages work without JS.
 document.querySelectorAll('[data-lang]').forEach(a=>a.addEventListener('click',()=>{
  try{localStorage.setItem('yeshui-language',a.dataset.lang);}catch{}
 }));
 document.querySelectorAll('a[data-document]').forEach(a=>a.addEventListener('click',async event=>{
  const url=new URL(a.href);if(!/^https?:$/.test(location.protocol)||url.origin!==location.origin)return;
  event.preventDefault();let ok=false;
  try{ok=(await fetch(url,{method:'HEAD',signal:AbortSignal.timeout(5000)})).ok;}catch{}
  if(ok){const link=document.createElement('a');link.href=url.href;if(a.hasAttribute('download'))link.download='';document.body.append(link);link.click();link.remove();return;}
  let status=a.parentElement.querySelector('[role=status]');if(!status){status=document.createElement('p');status.className='pending';status.setAttribute('role','status');a.parentElement.append(status);}
  status.textContent=english?'This file is unavailable. Please try again later.':'文件暂不可用，请稍后再试。';
 }));
})();
