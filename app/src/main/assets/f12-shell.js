/* F12.1 — canonical shell: Inicio / Pokedex / Box */
(()=>{
 const HOME='<svg class="ld79-icon" viewBox="0 0 24 24" fill="none"><path d="M3.5 10.5 12 3l8.5 7.5v9A1.5 1.5 0 0 1 19 21h-5v-6h-4v6H5a1.5 1.5 0 0 1-1.5-1.5v-9Z" stroke="currentColor" stroke-width="1.8"/></svg>';
 const DEX='<svg class="ld79-icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 12h17M9 12a3 3 0 0 0 6 0" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/></svg>';
 const BOX='<svg class="ld79-icon" viewBox="0 0 24 24" fill="none"><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" stroke="currentColor" stroke-width="1.8"/><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12.1V21" stroke="currentColor" stroke-width="1.8"/></svg>';
 let page=sessionStorage.getItem('f12.shell.page')||'home';
 function ensureHeader(){if(document.querySelector('.f12-shellbar'))return;const w=document.querySelector('.wrap');if(!w)return;const b=document.createElement('div');b.className='f12-shellbar';b.innerHTML='<div class="f12-ball"></div><div class="f12-title"><b>Living Dex Hub</b><small>Pokédex unificada • F12 DataDex Rework</small></div><button class="f12-searchbtn" aria-label="Pesquisar">⌕</button>';w.prepend(b)}
 function ensureDex(){if(document.getElementById('f12Dex'))return;const home=document.getElementById('home');if(!home)return;const d=document.createElement('section');d.id='f12Dex';d.className='f12-dex-placeholder';d.innerHTML='<div class="f12-dex-hero"><h2>Pokédex</h2><p>Uma única base para espécies, formas, gerações e jogos. Esta tela será alimentada pelo índice DataDex mapeado na F12.0.</p><div class="f12-segments"><button class="active">Todos</button><button>Geração</button><button>Jogo</button><button>Capturados</button><button>Faltando</button></div><div class="f12-dex-note"><b>F12.1 • Shell ativo</b><br>A navegação agora possui três destinos canônicos: Início, Pokédex e Box. A próxima fase conecta a grade universal e o Pokémon Detail a esta mesma pilha.</div></div>';home.parentNode.insertBefore(d,home.nextSibling)}
 function nav(){let n=document.querySelector('.mnav.ld79-nav')||document.querySelector('.mnav');if(!n){n=document.createElement('nav');document.body.appendChild(n)}n.className='mnav ld79-nav';n.innerHTML=`<button class="ld79-item" data-f12="home">${HOME}<span class="ld79-label">Início</span></button><button class="ld79-item" data-f12="dex">${DEX}<span class="ld79-label">Pokédex</span></button><button class="ld79-item" data-f12="box">${BOX}<span class="ld79-label">Box</span></button>`;n.querySelector('[data-f12="home"]').onclick=()=>open('home');n.querySelector('[data-f12="dex"]').onclick=()=>open('dex');n.querySelector('[data-f12="box"]').onclick=()=>open('box');sync()}
 function sync(){document.querySelectorAll('.mnav.ld79-nav [data-f12]').forEach(b=>b.classList.toggle('active',b.dataset.f12===page))}
 function open(p){page=p;try{sessionStorage.setItem('f12.shell.page',p)}catch(e){};document.body.classList.toggle('f12-dex-open',p==='dex');document.body.classList.toggle('f12-box-open',p==='box');if(p==='home'){try{window.ld71Close?.()}catch(e){};try{window.ld7Home?.()}catch(e){try{window.go?.('home')}catch(_){}}}else if(p==='box'){document.body.classList.remove('f12-dex-open');try{window.ld71Close?.()}catch(e){};try{window.go?.('home')}catch(e){};try{window.f12BoxRender?.()}catch(e){}}else{try{window.ld71Close?.()}catch(e){};try{window.go?.('home')}catch(e){};document.body.classList.add('f12-dex-open')}sync()}
 window.f12Open=open;window.F12Shell={open,current:()=>page};window.f12ShellAudit=()=>({version:'12.22',nav:[...document.querySelectorAll('.mnav.ld79-nav [data-f12]')].map(x=>x.dataset.f12),page,header:!!document.querySelector('.f12-shellbar'),dex:!!document.getElementById('f12Dex')});
 function boot(){ensureHeader();ensureDex();nav(); if(page!=='home') setTimeout(()=>open(page),0)}
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot):boot();setTimeout(boot,350);setTimeout(boot,1200)
})();

/* F12.15 Android native back bridge — detail stack first, then canonical shell */
window.f12HandleAndroidBack = function(){
  try {
    if(document.body.classList.contains('f12-add-open')){
      const close=document.querySelector('[data-add-close],[data-f12-add-close],[data-sheet-close]'); if(close){close.click();return true;}
    }
    const detail=document.getElementById('f12PokemonDetail');
    if(detail && !detail.hidden && document.body.classList.contains('f12-detail-open')){
      if(window.F12Detail?.back) return !!window.F12Detail.back();
      const btn=detail.querySelector('[data-f12-back]'); if(btn){btn.click(); return true;}
    }
    if(document.body.classList.contains('f12-dex-open')||document.body.classList.contains('f12-box-open')){
      window.f12Open?.('home'); return true;
    }
  } catch(e) { console.warn('F12 native back bridge',e); }
  return false;
};
