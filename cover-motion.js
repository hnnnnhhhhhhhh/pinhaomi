(()=>{
 const cover=document.querySelector('#cover'),title=document.querySelector('#cover-title');
 if(!cover||!title)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const characters=[...cover.querySelectorAll('.fur-character')];
 const layer=document.createElement('span');layer.className='title-cat-layer';layer.setAttribute('aria-hidden','true');title.append(layer);
 // Fixed, art-directed cats: each character always reveals the same collage.
 const slots=[17,50,83].map((anchor,i)=>{
  const el=document.createElement('span'),inner=document.createElement('span');
  el.className='title-mii';inner.className='title-mii-inner';
  el.style.setProperty('--anchor',anchor+'%');el.style.setProperty('--tilt',[-4,3,-3][i]+'deg');
  el.style.setProperty('--phase',-i*.9+'s');
  const cat=characters[i]?.cloneNode(true);
  if(cat){cat.classList.remove('is-blinking');inner.append(cat)}
  el.append(inner);layer.append(el);return el;
 });
 let inView=true,running=false,current=-1,hideTimer=null,frame=0,pendingX=null;
 const blinkTimers=new Map(),blinkEnds=new Map();
 const canRun=()=>!cover.hidden&&!document.hidden&&inView;
 function hide(){slots.forEach(s=>s.classList.remove('is-on'));current=-1}
 function show(index){if(!canRun())return;clearTimeout(hideTimer);current=index;slots.forEach((s,i)=>s.classList.toggle('is-on',i===index))}
 function scheduleBlink(cat,index){
  clearTimeout(blinkTimers.get(cat));if(!canRun()||reduced.matches)return;
  blinkTimers.set(cat,setTimeout(()=>{
   if(!canRun()||reduced.matches)return;
   cat.classList.remove('is-blinking');void cat.offsetWidth;cat.classList.add('is-blinking');
   blinkEnds.set(cat,setTimeout(()=>{cat.classList.remove('is-blinking');blinkEnds.delete(cat)},310));
   scheduleBlink(cat,index);
  },3200+Math.random()*2500+index*240));
 }
 function suspend(){
  running=false;clearTimeout(hideTimer);blinkTimers.forEach(clearTimeout);blinkEnds.forEach(clearTimeout);
  blinkTimers.clear();blinkEnds.clear();cancelAnimationFrame(frame);frame=0;
  characters.forEach(c=>c.classList.remove('is-blinking'));hide();cover.classList.add('cover-motion-paused');
 }
 function sync(){
  if(!canRun()||reduced.matches){suspend();return}
  if(running)return;
  running=true;cover.classList.remove('cover-motion-paused');characters.forEach(scheduleBlink);
 }
 function nearest(x){const r=title.getBoundingClientRect();return Math.max(0,Math.min(2,Math.floor((x-r.left)/r.width*3)))}
 title.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch'||!canRun())return;
  pendingX=e.clientX;if(frame)return;
  frame=requestAnimationFrame(()=>{frame=0;const index=nearest(pendingX);if(index!==current)show(index)});
 },{passive:true});
 title.addEventListener('pointerleave',()=>{clearTimeout(hideTimer);hideTimer=setTimeout(hide,180)});
 title.addEventListener('pointerup',e=>{
  if(e.pointerType!=='touch')return;show(nearest(e.clientX));hideTimer=setTimeout(hide,1300);
 },{passive:true});
 document.addEventListener('visibilitychange',sync);
 new MutationObserver(sync).observe(cover,{attributes:true,attributeFilter:['hidden']});
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync()},{threshold:.08}).observe(title);
 reduced.addEventListener('change',sync);window.addEventListener('pagehide',suspend);window.addEventListener('pageshow',sync);
 sync();
})();
