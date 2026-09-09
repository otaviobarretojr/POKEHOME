/* F12.25 interaction repair — keeps canonical Home/Pokedex/Box clickable inside Android WebView */
(()=>{
  const $=(s,r=document)=>r.querySelector(s);
  const all=(s,r=document)=>[...r.querySelectorAll(s)];

  function unlock(){
    const home=$('#home');
    const nav=$('.mnav.ld79-nav')||$('.mnav');
    if(home){ home.removeAttribute('inert'); home.setAttribute('aria-hidden','false'); home.style.pointerEvents='auto'; }
    if(nav){ nav.removeAttribute('inert'); nav.style.pointerEvents='auto'; }
    all('#home button,#home [role="button"],.mnav button,.f12-shellbar button').forEach(el=>{
      el.removeAttribute('inert');
      el.style.pointerEvents='auto';
      el.style.touchAction='manipulation';
    });
    // Legacy layers must never sit invisibly over the canonical UI.
    const modal=$('#modal');
    if(modal && !modal.classList.contains('show')) modal.style.pointerEvents='none';
    const music=$('#ldh712MusicModal');
    if(music && !music.classList.contains('open')) music.style.pointerEvents='none';
    const selector=$('.ld82-selector');
    if(selector && !selector.classList.contains('open') && selector.getAttribute('aria-hidden')!=='false') selector.style.pointerEvents='none';
  }

  function restoreCanonical(){
    unlock();
    try{ window.f12HomeSync?.(); }catch(e){ console.warn('f12HomeSync repair',e); }
    try{
      if(!document.body.classList.contains('f12-dex-open') && !document.body.classList.contains('f12-box-open') && !document.body.classList.contains('f12-detail-open')){
        window.F12Shell?.open?.('home');
      }
    }catch(e){ console.warn('F12 shell repair',e); }
    unlock();
  }

  // Fallback delegation for the canonical surfaces, independent of legacy inline handlers.
  document.addEventListener('click',ev=>{
    const t=ev.target.closest('button,[role="button"]');
    if(!t) return;
    if(t.matches('[data-f12="home"]')){ ev.preventDefault(); window.f12Open?.('home'); return; }
    if(t.matches('[data-f12="dex"],[data-home-dex]')){ ev.preventDefault(); window.f12Open?.('dex'); return; }
    if(t.matches('[data-f12="box"],[data-home-box],[data-home-box2]')){ ev.preventDefault(); window.f12Open?.('box'); return; }
    if(t.matches('[data-home-game]')){ ev.preventDefault(); const g=t.dataset.homeGame; window.f12BoxSelectGame?.(g); window.f12Open?.('box'); return; }
  },true);

  document.addEventListener('DOMContentLoaded',()=>{ restoreCanonical(); setTimeout(restoreCanonical,350); setTimeout(restoreCanonical,1200); setTimeout(restoreCanonical,2200); });
  if(document.readyState!=='loading'){ restoreCanonical(); setTimeout(restoreCanonical,350); setTimeout(restoreCanonical,1200); setTimeout(restoreCanonical,2200); }

  window.F12InteractionRepair={run:restoreCanonical,audit:()=>({version:'12.25.1',home:!!$('#home'),homeInert:$('#home')?.hasAttribute('inert')||false,nav:!!($('.mnav.ld79-nav')||$('.mnav')),navInert:($('.mnav.ld79-nav')||$('.mnav'))?.hasAttribute('inert')||false,f12Home:!!$('#f12Home')})};
})();
