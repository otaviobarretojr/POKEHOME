/* F12.26 — consolidated canonical router: Home / Pokedex / Box only */
(()=>{
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const VALID=new Set(['home','dex','box']);
  let route=sessionStorage.getItem('f12.route')||'home';
  if(!VALID.has(route)) route='home';

  const ICON={
    home:'<svg viewBox="0 0 24 24" fill="none"><path d="M3.5 10.5 12 3l8.5 7.5v9A1.5 1.5 0 0 1 19 21h-5v-6h-4v6H5a1.5 1.5 0 0 1-1.5-1.5v-9Z" stroke="currentColor" stroke-width="1.8"/></svg>',
    dex:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 12h17M9 12a3 3 0 0 0 6 0" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/></svg>',
    box:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" stroke="currentColor" stroke-width="1.8"/><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12.1V21" stroke="currentColor" stroke-width="1.8"/></svg>'
  };

  function ensureHeader(){
    const w=$('.wrap'); if(!w) return;
    let h=$('.f12-shellbar',w);
    if(!h){ h=document.createElement('header'); h.className='f12-shellbar'; w.prepend(h); }
    h.innerHTML='<div class="f12-ball" aria-hidden="true"></div><div class="f12-title"><b>POKEHOME</b><small>Sua coleção Pokémon • Pokédex unificada</small></div><button class="f12-searchbtn" data-canon-search aria-label="Pesquisar">⌕</button>';
  }

  function ensureSurfaces(){
    const home=$('#home'); if(!home) return false;
    let dex=$('#f12Dex');
    if(!dex){ dex=document.createElement('section'); dex.id='f12Dex'; dex.className='f12-dex-placeholder f12-dex-v2'; home.after(dex); }
    let box=$('#f12Box');
    if(!box){ box=document.createElement('section'); box.id='f12Box'; box.className='f12-box'; dex.after(box); }
    return true;
  }

  function ensureNav(){
    let n=$('.mnav.ld79-nav')||$('.mnav');
    if(!n){ n=document.createElement('nav'); document.body.appendChild(n); }
    n.className='mnav ld79-nav f12-canonical-nav';
    n.innerHTML=`<button data-canon="home">${ICON.home}<span>Início</span></button><button data-canon="dex">${ICON.dex}<span>Pokédex</span></button><button data-canon="box">${ICON.box}<span>Box</span></button>`;
    n.onclick=e=>{const b=e.target.closest('[data-canon]');if(b) open(b.dataset.canon);};
  }

  function sanitizeLegacy(){
    document.body.classList.add('f12-consolidated');
    const home=$('#home');
    if(home){
      home.removeAttribute('inert'); home.setAttribute('aria-hidden','false'); home.style.pointerEvents='auto';
      [...home.children].forEach(ch=>{ if(ch.id!=='f12Home') ch.classList.add('f12-legacy-home-child'); });
    }
    ['games','global','missing','families','planner','forms','storage','settings'].forEach(id=>{const el=$('#'+id);if(el){el.removeAttribute('inert');el.setAttribute('aria-hidden','true');}});
    const modal=$('#modal'); if(modal&&!modal.classList.contains('show')) modal.style.pointerEvents='none';
    const music=$('#ldh712MusicModal'); if(music&&!music.classList.contains('open')) music.style.pointerEvents='none';
    const selector=$('.ld82-selector'); if(selector&&!selector.classList.contains('open')) selector.style.pointerEvents='none';
  }

  function syncNav(){
    $$('.f12-canonical-nav [data-canon]').forEach(b=>b.classList.toggle('active',b.dataset.canon===route));
  }

  function renderCurrent(){
    try{
      if(route==='home') window.f12HomeSync?.();
      if(route==='dex') window.F12Pokedex?.render?.();
      if(route==='box') window.f12BoxRender?.();
    }catch(err){ console.error('F12 route render',err); }
  }

  function open(next,opt={}){
    if(!VALID.has(next)) next='home';
    if(document.body.classList.contains('f12-detail-open') && !opt.keepDetail){ try{window.F12Detail?.close?.();}catch(e){} }
    route=next;
    try{sessionStorage.setItem('f12.route',route);sessionStorage.setItem('f12.shell.page',route);}catch(e){}
    document.body.dataset.f12Route=route;
    document.body.classList.toggle('f12-dex-open',route==='dex');
    document.body.classList.toggle('f12-box-open',route==='box');
    sanitizeLegacy(); syncNav(); renderCurrent();
    if(!opt.keepScroll){ try{scrollTo(0,0);}catch(e){} }
    window.dispatchEvent(new CustomEvent('f12:route-change',{detail:{route}}));
    return route;
  }

  function bindGlobal(){
    if(window.__f12ConsolidatedBound) return;
    window.__f12ConsolidatedBound=true;
    document.addEventListener('click',e=>{
      const search=e.target.closest('[data-canon-search],.f12-searchbtn');
      if(search){e.preventDefault();open('dex');setTimeout(()=>$('#f12DexSearch')?.focus(),30);return;}
      const legacyGame=e.target.closest('[data-home-game]');
      if(legacyGame){e.preventDefault();window.f12BoxSelectGame?.(legacyGame.dataset.homeGame);open('box');return;}
    },true);
  }

  window.f12Open=open;
  window.F12Router={open,current:()=>route,audit:()=>({version:'12.26',route,home:!!$('#f12Home'),dex:!!$('#f12Dex'),box:!!$('#f12Box'),legacyViewsHidden:document.body.classList.contains('f12-consolidated')})};
  window.F12Shell={open,current:()=>route};
  window.f12HandleAndroidBack=function(){
    try{
      if(document.body.classList.contains('f12-add-open')){const c=$('[data-add-close],[data-f12-add-close],[data-sheet-close]');if(c){c.click();return true;}}
      if(document.body.classList.contains('f12-detail-open')){if(window.F12Detail?.back) return !!window.F12Detail.back();}
      if(route!=='home'){open('home');return true;}
    }catch(e){console.warn('F12 back',e)}
    return false;
  };

  function boot(){
    ensureHeader(); ensureSurfaces(); ensureNav(); sanitizeLegacy(); bindGlobal(); open(route,{keepScroll:true});
    [250,900,1800,3200].forEach(ms=>setTimeout(()=>{ensureSurfaces();sanitizeLegacy();syncNav();renderCurrent();},ms));
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();
})();
