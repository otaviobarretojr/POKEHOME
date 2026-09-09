/* F12.2 — Universal Pokédex powered by mapped DataDex art/index */
(()=>{
 const D=()=>window.F12_POKEDEX_DATA||{entries:[],versionGroups:[]};
 let mode='all',gen='all',game='all',query='',renderToken=0;
 const stateKey='f12.pokedex.view.v1';
 try{const x=JSON.parse(sessionStorage.getItem(stateKey)||'{}');mode=x.mode||mode;gen=x.gen||gen;game=x.game||game;query=x.query||query}catch(e){}
 const save=()=>{try{sessionStorage.setItem(stateKey,JSON.stringify({mode,gen,game,query,scroll:window.scrollY||0}))}catch(e){}};
 const MODES=new Set(['all','generation','game','caught','missing']);
 function applyPending(){const m=window.__f12DexFilter;if(MODES.has(m)){mode=m;window.__f12DexFilter=null}const g=window.__f12DexGame;if(g!=null&&g!=='all'){game=String(g);if(mode==='game')window.__f12DexGame=game}else if(mode!=='game')window.__f12DexGame='all'}
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const title=s=>String(s||'').split('-').map(x=>x?x[0].toUpperCase()+x.slice(1):x).join(' ');
 function root(){return $('#f12Dex')}
 function shell(){const r=root(); if(!r)return null; r.className='f12-dex-placeholder f12-dex-v2'; r.innerHTML=`
  <div class="f12dex-head"><div><small>POKÉDEX NACIONAL</small><h2>Pokédex</h2><p id="f12DexCount"></p></div><div class="f12dex-progress"><b id="f12DexOwned">0</b><span>/ 1025</span></div></div>
  <div class="f12dex-tools"><label class="f12dex-search"><span>⌕</span><input id="f12DexSearch" type="search" placeholder="Buscar Pokémon ou número" autocomplete="off"></label>
  <div class="f12-segments" id="f12DexModes"><button data-mode="all" class="active">Todos</button><button data-mode="generation">Geração</button><button data-mode="game">Jogo</button><button data-mode="caught">Capturados</button><button data-mode="missing">Faltando</button></div>
  <div id="f12DexSubfilters" class="f12dex-subfilters"></div></div>
  <div id="f12DexGrid" class="f12dex-grid"></div><div id="f12DexEmpty" class="f12dex-empty" hidden>Nenhum Pokémon encontrado.</div>`;
  $('#f12DexSearch',r).value=query; $('#f12DexSearch',r).addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();save();render()});
  $('#f12DexModes',r).addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(!b)return;mode=b.dataset.mode;save();if(mode!=='game'){window.__f12DexGame='all';}$$('[data-mode]',r).forEach(x=>x.classList.toggle('active',x===b)); subfilters();render()});
  $('#f12DexGrid',r).addEventListener('click',e=>{const c=e.target.closest('[data-f12-pokemon]');if(!c)return;openPokemon(+c.dataset.f12Pokemon,c.dataset.name||'',+c.dataset.f12Asset||undefined)});
  applyPending(); syncControls(); subfilters(); render(); return r;
 }
 function syncControls(){const r=root();if(!r)return;$$('[data-mode]',r).forEach(x=>x.classList.toggle('active',x.dataset.mode===mode));const input=$('#f12DexSearch',r);if(input&&input.value!==query)input.value=query;window.__f12DexGame=mode==='game'?game:'all'}
 function ownedIds(){const c=window.F12Collection;if(c)return new Set(c.ownedIds());const out=new Set();return out}
 function subfilters(){
  const h=$('#f12DexSubfilters'); if(!h)return;
  if(mode==='generation'){
    h.innerHTML=`<div class="f12dex-chips"><button data-gen="all" class="${gen==='all'?'active':''}">Todas</button>${Array.from({length:9},(_,i)=>`<button data-gen="${i+1}" class="${String(gen)===String(i+1)?'active':''}">G${i+1}</button>`).join('')}</div>`;
    h.onclick=e=>{const b=e.target.closest('[data-gen]');if(!b)return;gen=b.dataset.gen;save();$$('[data-gen]',h).forEach(x=>x.classList.toggle('active',x===b));render()};
  } else if(mode==='game'){
    const gs=D().versionGroups;
    h.innerHTML='<select id="f12GameSelect"><option value="all">Todos os jogos</option>'+gs.map(g=>`<option value="${g.id}">${title(g.name)}</option>`).join('')+'</select>';
    $('#f12GameSelect',h).value=game;
    $('#f12GameSelect',h).onchange=e=>{game=e.target.value;window.__f12DexGame=game;save();render()};
  } else {h.innerHTML='';h.onclick=null}
 }
 function filtered(){const own=ownedIds(), seen=new Set();return D().entries.filter(p=>{if(seen.has(p.asset_id))return false;seen.add(p.asset_id);if(query&&!(`${p.pokemon_id} ${p.name_en} ${p.slug}`.toLowerCase().includes(query)))return false;if(mode==='generation'&&gen!=='all'&&+p.generation_id!==+gen)return false;if(mode==='game'&&game!=='all'&&!p.version_groups.includes(+game))return false;if(mode==='caught'&&!own.has(+p.pokemon_id))return false;if(mode==='missing'&&own.has(+p.pokemon_id))return false;return true})}
 function render(){const my=++renderToken,g=$('#f12DexGrid');if(!g)return;const rows=filtered(),own=ownedIds();$('#f12DexCount').textContent=`${rows.length} espécies e formas exibidas`;$('#f12DexOwned').textContent=own.size;$('#f12DexEmpty').hidden=!!rows.length;const frag=document.createDocumentFragment();rows.forEach(p=>{const a=document.createElement('button');a.className='f12mon '+(own.has(+p.pokemon_id)?'owned':'');a.dataset.f12Pokemon=p.pokemon_id;a.dataset.f12Asset=p.asset_id;a.dataset.f12Origin='pokedex';a.dataset.f12Game=mode==='game'?game:'all';a.dataset.name=p.name_en;a.innerHTML=`<span class="f12mon-num">#${String(p.pokemon_id).padStart(4,'0')}</span><span class="f12mon-art"><img loading="lazy" src="f12-datadex-art/${p.asset_id}.png" alt=""></span><b>${p.name_en}</b>${p.kind!=='base'?`<em>${p.kind==='mega'?'Mega':'Forma'}</em>`:''}<i>${own.has(+p.pokemon_id)?'✓':''}</i>`;frag.appendChild(a)});if(my!==renderToken)return;g.replaceChildren(frag)}
 function openPokemon(id,name,assetId){save();try{window.f12OpenPokemon?.(+id,{origin:'pokedex',game:mode==='game'?game:'all',assetId:+assetId||undefined});window.dispatchEvent(new CustomEvent('f12:pokemon-open',{detail:{pokemonId:+id,assetId:+assetId||undefined,origin:'pokedex',mode,gen,game}}))}catch(e){}}
 window.addEventListener('f12:collection-change',render);
 function audit(){const d=D();return{version:'12.22',entries:d.entries.length,arts:d.entries.filter(x=>x.art).length,generations:new Set(d.entries.map(x=>x.generation_id)).size,versionGroups:d.versionGroups.length,grid:!!$('#f12DexGrid'),singlePokedex:true,datadexArt:true}}
 window.f12PokedexAudit=audit; window.f12PokedexRender=render; window.F12Pokedex={render,setMode:(m,opt={})=>{if(MODES.has(m))mode=m;if(opt.gen!=null)gen=String(opt.gen);if(opt.game!=null){game=String(opt.game);window.__f12DexGame=game}save();syncControls();subfilters();render()},state:()=>({mode,gen,game,query})};
 function boot(){if(!root())return setTimeout(boot,100);shell();setTimeout(()=>{try{const x=JSON.parse(sessionStorage.getItem(stateKey)||'{}');if(x.scroll)scrollTo(0,x.scroll)}catch(e){}},60)}
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot):setTimeout(boot,0)
})();
