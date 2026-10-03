
const data=window.SITE_CONTENT;
let lang='zh';try{lang=localStorage.getItem('yeshui-language')==='en'?'en':'zh'}catch{}
const page=document.body.dataset.page;
const labels={zh:{index:'首页',works:'作品',about:'关于',cv:'简历',contact:'联系',draft:'© 野水',selected:'作品选页',practice:'绘画、综合材料、文本与影像',note:'',view:'浏览全部作品 ↗',closing:'图像之间，留有余地。',back:'← 返回作品',next:'下一件 →',aboutNote:'关于艺术家',bioNote:'现居武汉，中国',pending:'待补充',cvNote:'教育、展览、项目与出版',cvDownload:'下载履历 PDF（中文） ↗',cvPending:'完整 CV 待提供',contactNote:'展览、项目与其他联系',emailPending:'联系邮箱待补充',contactText:'确认公开联系方式后，将在此处提供邮件链接。',workNote:'2025—2026',missing:'未找到此作品'},en:{index:'Home',works:'Works',about:'About',cv:'CV',contact:'Contact',draft:'© Ye Shui',selected:'Selected works',practice:'Painting, mixed media, text & moving image',note:'',view:'View all works ↗',closing:'Room between images.',back:'← Back to works',next:'Next work →',aboutNote:'About the artist',bioNote:'Based in Wuhan, China',pending:'To be added',cvNote:'Education, exhibitions, projects & publications',cvDownload:'Download CV (Chinese PDF) ↗',cvPending:'Full CV to be supplied',contactNote:'Exhibitions, projects & correspondence',emailPending:'Contact email to be added',contactText:'A direct email link will appear here once public contact details are confirmed.',workNote:'2025–2026',missing:'Work not found'}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t=v=>typeof v==='object'&&v!==null?(v[lang]??''):v;
// Allow only normal web links or relative asset paths; reject executable schemes.
const cleanUrl=(value,external=false)=>{
 if(typeof value!=='string'||!value.trim())return '';
 const raw=value.trim();if(/[\u0000-\u001f\u007f\\]/.test(raw))return '';
 try{const u=new URL(raw,location.href);if(external)return /^https?:$/.test(u.protocol)?u.href:'';
 if(/^[a-z][a-z0-9+.-]*:/i.test(raw)||raw.startsWith('//'))return /^https?:$/.test(u.protocol)?u.href:'';
 return raw;}catch{return '';}
};
const safe=s=>esc(cleanUrl(s));
const field=(item,key)=>String(item[key+(lang==='zh'?'Zh':'En')]??'').trim();
const textTitle=item=>field(item,'title')||String(item.titleZh||item.titleEn||labels[lang].untitled);
const titleLang=item=>field(item,'title')?lang:(item.titleZh?'zh-CN':'en');
function imageHTML(src,alt,width,height,optional=false){
 const url=cleanUrl(src);if(!url)return optional?'':`<div class="image-unavailable" role="img" aria-label="${esc(alt)}">${labels[lang].imageMissing}</div>`;
 const dims=Number(width)>0&&Number(height)>0?` width="${Number(width)}" height="${Number(height)}"`:'';
 return `<img src="${esc(url)}" alt="${esc(alt)}"${dims} ${optional?'data-optional="true"':''} loading="lazy">`;
}
function bindResources(){
 document.querySelectorAll('main img').forEach(img=>{
  const failed=()=>{if(!img.isConnected)return;if(img.dataset.optional){img.closest('.text-cover')?.remove();return;}
   const fallback=document.createElement('div');fallback.className='image-unavailable';fallback.setAttribute('role','img');fallback.setAttribute('aria-label',img.alt);fallback.textContent=labels[lang].imageMissing;img.replaceWith(fallback);};
  img.addEventListener('error',failed,{once:true});if(img.complete&&!img.naturalWidth)failed();
 });
 // A missing local document should leave the reader on this page with a clear status.
 document.querySelectorAll('a[data-document]').forEach(a=>a.addEventListener('click',async event=>{
  const url=new URL(a.href);if(!/^https?:$/.test(location.protocol)||url.origin!==location.origin)return;
  event.preventDefault();let ok=false;try{const r=await fetch(url,{method:'HEAD',signal:AbortSignal.timeout(5000)});ok=r.ok;}catch{}
  if(!a.isConnected)return;
  if(ok){if(a.hasAttribute('download')){const download=document.createElement('a');download.href=url.href;download.download='';document.body.append(download);download.click();download.remove();}else{location.href=url.href;}return;}
  let status=a.parentElement.querySelector('[role="status"]');if(!status){status=document.createElement('p');status.setAttribute('role','status');status.className='pending';a.parentElement.append(status);}status.textContent=labels[lang].documentMissing;
 }));
}
Object.assign(labels.zh,{photography:'摄影',texts:'文本',text:'文本',photoNote:'版式预览 · 摄影作品待加入',photoPlaceholder:'摄影占位 · 非真实作品',imageMissing:'图像暂不可用',documentMissing:'文件暂不可用，请稍后再试。',textsNote:'文本与出版目录',titleLabel:'标题',yearLabel:'年份',categoryLabel:'分类',backTexts:'← 返回文本',untitled:'标题待补充',textMissing:'未找到此文本',introLabel:'简介',formatLabel:'形式',externalLabel:'外部链接 ↗',pdfLabel:'阅读文档 ↗',emptyTexts:'文本作品待加入',emptyPhotos:'摄影作品待加入',coverLabel:'封面'});
Object.assign(labels.en,{photography:'Photography',texts:'Texts',text:'Text',photoNote:'Layout preview · photographs to be added',photoPlaceholder:'Photography placeholder · not an actual work',imageMissing:'Image unavailable',documentMissing:'This file is unavailable. Please try again later.',textsNote:'Writing & publication index',titleLabel:'Title',yearLabel:'Year',categoryLabel:'Category',backTexts:'← Back to texts',untitled:'Title to be added',textMissing:'Text not found',introLabel:'Introduction',formatLabel:'Format',externalLabel:'External link ↗',pdfLabel:'Read document ↗',emptyTexts:'Texts to be added',emptyPhotos:'Photographs to be added',coverLabel:'Cover'});
function render(){
 document.querySelector('.skip').textContent=lang==='zh'?'跳至内容 / Skip to content':'Skip to content';
 document.querySelector('meta[name=description]').content=lang==='zh'?'野水 Ye Shui — 绘画、综合材料、文本与影像 / Painting, mixed media, text and moving image':'Ye Shui — Painting, mixed media, text and moving image';
 const l=labels[lang],name=esc(t(data.name));document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.title=name+' — '+(l[page]||l.works);
 document.querySelector('#header').innerHTML=`<a class="brand" href="index.html">${name}<small>${lang==='zh'?'YE SHUI':'YE SHUI'}</small></a><div class="nav-wrap"><nav aria-label="${lang==='zh'?'主导航':'Main navigation'}">${['index','works','photography','texts','about','cv','contact'].map(p=>`<a href="${p}.html" ${p===(page==='work'?'works':page==='text'?'texts':page)?'aria-current="page"':''}>${l[p]}</a>`).join('')}</nav><div class="languages" aria-label="Language"><button type="button" data-lang="zh" aria-pressed="${lang==='zh'}" lang="zh">${lang==='zh'?'中文':'ZH'}</button><button type="button" data-lang="en" aria-pressed="${lang==='en'}" lang="en">EN</button></div></div>`;
 document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{const focus=b.dataset.lang;lang=focus;try{localStorage.setItem('yeshui-language',lang)}catch{}render();document.querySelector(`[data-lang="${focus}"]`).focus()});
 const card=w=>`<figure class="piece"><a href="work.html?id=${encodeURIComponent(w.id)}"><img src="${safe(w.image)}" alt="${esc(t(w.alt))}" width="${w.width}" height="${w.height}" ${w===data.works[0]?'fetchpriority="high"':'loading="lazy"'}><figcaption><span>${esc(t(w.title))}</span><span class="meta">${esc(w.year||t(w.category))} ↗</span></figcaption></a>${page==='works'?`<div class="piece-facts"><p>${esc(t(w.medium))}</p><p>${esc(t(w.dimensions))}</p></div>`:''}</figure>`;
 const heading=(title,note)=>`<div class="page-heading"><h1>${title}</h1><p>${note}</p></div>`;
 let html='';
 if(page==='index')html=`<div class="home-intro"><p>${l.selected}<br><span class="eyebrow">YE SHUI — PORTFOLIO</span></p><p class="right">${l.practice}</p></div><div class="home-gallery">${data.works.map(card).join('')}</div><div class="home-bottom category-links">${['works','photography','texts'].map(p=>`<a class="text-link" href="${p}.html">${l[p]} ↗</a>`).join('')}</div>`;
 if(page==='works')html=heading(l.works,l.workNote)+`<div class="home-gallery works-gallery">${data.works.map(card).join('')}</div>`;
 if(page==='photography'){
 const photos=Array.isArray(data.photography)?data.photography:[];
 html=heading(l.photography,photos.some(p=>p.placeholder)?l.photoNote:'')+`<div class="photo-gallery">${photos.length?photos.map(p=>{
 const images=Array.isArray(p.images)&&p.images.length?p.images:[p];
 const original=(key)=>{const value=field(p,key)||p[key+'Zh']||p[key+'En']||'';const language=field(p,key)?lang:(p[key+'Zh']?'zh-CN':'en');return value?`<span lang="${language}">${esc(value)}</span>`:'';};
 const metadata=[original('location'),original('category')].filter(Boolean).join('<span aria-hidden="true"> · </span>');
 return `<figure class="photograph ${images.length>1?'photo-series':''}"><div class="photo-images">${images.map(img=>imageHTML(img.image,field(img,'alt')||(p.placeholder?l.photoPlaceholder:textTitle(p)),img.width,img.height)).join('')}</div>${p.placeholder||p.titleZh||p.titleEn||p.year||metadata?`<figcaption>${p.placeholder?esc(l.photoPlaceholder):`<div class="photo-caption-title">${original('title')}${p.year?`<span>${esc(p.year)}</span>`:''}</div>${metadata?`<div class="photo-caption-meta">${metadata}</div>`:''}`}</figcaption>`:''}</figure>`;
 }).join(''):`<p class="pending">${l.emptyPhotos}</p>`}</div>`;
 }
 if(page==='texts'){
 const texts=Array.isArray(data.texts)?data.texts:[],hasCategories=texts.some(item=>field(item,'category'));
 html=heading(l.texts,l.textsNote)+`<div class="text-index ${hasCategories?'':'without-categories'}">${texts.length?`<div class="text-index-head" aria-hidden="true"><span>${l.titleLabel}</span><span>${l.yearLabel}</span>${hasCategories?`<span>${l.categoryLabel}</span>`:''}</div><ol>${texts.map(item=>`<li class="text-row"><a href="text.html?slug=${encodeURIComponent(item.slug)}" lang="${titleLang(item)}">${esc(textTitle(item))}</a><span class="text-year">${esc(item.year||'')}</span>${field(item,'category')?`<span class="text-category">${esc(field(item,'category'))}</span>`:''}</li>`).join('')}</ol>`:`<p class="pending">${l.emptyTexts}</p>`}${data.email?`<div class="text-purchase"><p>${lang==='zh'?'电子版可通过邮件付费获取。':'Digital editions are available for a fee by email.'}</p><p>${lang==='zh'?'购买咨询：':'Purchase inquiries: '}<a href="mailto:${encodeURIComponent(data.email)}">${esc(data.email)}</a></p></div>`:''}</div>`;
 }
 if(page==='text'){
 const item=(data.texts||[]).find(item=>item.slug===new URLSearchParams(location.search).get('slug'));
 const back=`<div class="detail-top"><a class="text-link" href="texts.html">${l.backTexts}</a></div>`;
 if(!item){html=back+heading(l.textMissing,'');}
 else{
 const title=textTitle(item),intro=field(item,'intro'),format=field(item,'format'),category=field(item,'category');
 const cover=cleanUrl(item.cover),pdf=cleanUrl(item.pdf),external=cleanUrl(item.externalUrl,true);
 document.title=title+' — '+t(data.name);
 html=back+`<article class="text-detail"><div class="text-detail-body"><h1 lang="${titleLang(item)}">${esc(title)}</h1>${item.year||category?`<div class="text-meta">${item.year?`<span>${esc(item.year)}</span>`:''}${category?`<span>${esc(category)}</span>`:''}</div>`:''}${intro?`<section class="text-intro"><h2>${l.introLabel}</h2><p>${esc(intro)}</p></section>`:''}${format?`<section class="text-format"><h2>${l.formatLabel}</h2><p>${esc(format)}</p></section>`:''}${external||pdf?`<div class="text-resources">${external?`<a class="text-link" href="${esc(external)}" target="_blank" rel="noopener noreferrer">${l.externalLabel}</a>`:''}${pdf?`<a class="text-link" href="${esc(pdf)}" data-document>${l.pdfLabel}</a>`:''}</div>`:''}</div>${cover?`<figure class="text-cover">${imageHTML(cover,title+' — '+l.coverLabel,null,null,true)}</figure>`:''}</article>`;
 }
 }
 if(page==='about')html=heading(l.about,l.aboutNote)+`<div class="editorial"><aside class="margin-note">${esc(t(data.fullName))}<br>${esc(t(data.location))}</aside><div class="prose"><p class="lead">${esc(t(data.bio))}</p><a class="text-link" href="cv.html">${l.cv} ↗</a></div></div>`;
 if(page==='cv')html=heading(l.cv,l.cvNote)+`<div class="editorial"><aside class="margin-note">${data.cvPdf?`<a class="text-link" href="${safe(data.cvPdf)}" download data-document>${l.cvDownload}</a>`:l.cvPending}</aside><div>${data.cv.map(s=>`<section class="cv-row"><h2>${esc(t(s.title))}</h2>${s.entries.length?s.entries.map(e=>`<div class="cv-entry"><span>${esc(t(e.year))}</span><span>${esc(t(e.text))}</span></div>`).join(''):`<p class="pending">${l.pending}</p>`}</section>`).join('')}</div></div>`;
 if(page==='contact')html=heading(l.contact,l.contactNote)+`<div class="editorial"><aside class="margin-note">${esc(t(data.fullName))}<br>${esc(t(data.location))}</aside><div class="contact-space"><h2 class="contact-title">${data.email?`<a href="mailto:${encodeURIComponent(data.email)}">${esc(data.email)} ↗</a>`:l.emailPending}</h2>${data.email?'':`<p class="pending">${l.contactText}</p>`}</div></div>`;
 if(page==='work'){
 const w=data.works.find(w=>w.id===new URLSearchParams(location.search).get('id'));
 if(w){document.title=t(w.title)+' — '+name;const next=data.works[(data.works.indexOf(w)+1)%data.works.length];html=`<div class="detail-top"><a class="text-link" href="works.html">${l.back}</a></div><article class="detail"><img src="${safe(w.image)}" alt="${esc(t(w.alt))}" width="${w.width}" height="${w.height}"><div><h1>${esc(t(w.title))}</h1><div class="work-facts"><p>${esc(w.year)}</p><p>${esc(t(w.medium))}</p><p>${esc(t(w.dimensions))}</p></div></div></article><div class="detail-nav"><a class="text-link" href="works.html">${l.works}</a><a class="text-link" href="work.html?id=${encodeURIComponent(next.id)}">${l.next}</a></div>`}
 else html=heading(l.missing,'')+`<div class="detail-top"><a class="text-link" href="works.html">${l.back}</a></div>`;
 }
 document.querySelector('#main').innerHTML=html;bindResources();document.querySelector('#footer').innerHTML=`<span>${name}</span><span>${l.draft}</span><a href="contact.html">${l.contact} ↗</a>`;
}
render();
