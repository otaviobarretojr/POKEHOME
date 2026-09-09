/* F12.24 — capture toast, micro-feedback and optional native haptic */
(()=>{
 const $=(s,r=document)=>r.querySelector(s);
 function host(){let h=$('#f12ToastHost');if(!h){h=document.createElement('div');h.id='f12ToastHost';h.setAttribute('aria-live','polite');document.body.appendChild(h)}return h}
 function pokemonName(id){const e=(window.F12_POKEDEX_DATA?.entries||[]).find(x=>x.kind==='base'&&+x.pokemon_id===+id);return e?.name_en||`#${id}`}
 function gameName(id){if(id==='all')return 'todos os jogos';const g=(window.F12_POKEDEX_DATA?.versionGroups||[]).find(x=>String(x.id)===String(id));return String(g?.name||'jogo').split('-').map(x=>x?x[0].toUpperCase()+x.slice(1):x).join(' ')}
 function toast(text){const el=document.createElement('div');el.className='f12toast';el.textContent=text;host().appendChild(el);setTimeout(()=>el.classList.add('out'),1700);setTimeout(()=>el.remove(),1950)}
 function haptic(kind='confirm'){try{if(window.LivingDexNative?.haptic)window.LivingDexNative.haptic(kind)}catch(e){}}
 function pop(){const el=$('[data-f12-add]')||$('.f12addsheet [data-add-game]:focus');if(!el)return;el.classList.remove('f12-capture-pop');void el.offsetWidth;el.classList.add('f12-capture-pop');setTimeout(()=>el.classList.remove('f12-capture-pop'),340)}
 window.addEventListener('f12:collection-feedback',e=>{const d=e.detail||{},name=pokemonName(d.pokemonId);if(d.removedAll)toast(`${name} removido de todos os jogos`);else toast(d.owned?`${name} registrado em ${gameName(d.gameId)}`:`${name} removido de ${gameName(d.gameId)}`);pop();haptic(d.owned?'confirm':'tick')});
 window.F12AppFeel={toast,haptic,audit:()=>({version:'12.24',toast:true,hapticBridge:!!window.LivingDexNative?.haptic,reducedMotion:matchMedia?.('(prefers-reduced-motion: reduce)').matches||false})};
})();
