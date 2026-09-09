/* F12.25 — canonical collection store + game-aware add/remove */
(()=>{
 const KEY='f12.collection.v1', D=()=>window.F12_POKEDEX_DATA||{entries:[],versionGroups:[]};
 let state=load();
 function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'{"records":[]}');return x&&Array.isArray(x.records)?x:{records:[]}}catch(e){return{records:[]}}}
 function save(){localStorage.setItem(KEY,JSON.stringify(state));emit()}
 function emit(){window.dispatchEvent(new CustomEvent('f12:collection-change',{detail:{records:[...state.records],ownedIds:ownedIds()}}))}
 function ownedIds(){return [...new Set(state.records.map(x=>+x.pokemonId).filter(Boolean))]}
 function has(pid,gid){return state.records.some(x=>+x.pokemonId===+pid&&(gid==null||String(x.gameId)===String(gid)))}
 function compatible(pid){const p=D().entries.find(x=>+x.pokemon_id===+pid&&x.kind==='base')||D().entries.find(x=>+x.pokemon_id===+pid);return (p?.version_groups||[]).map(id=>D().versionGroups.find(g=>+g.id===+id)).filter(Boolean)}
 function add(pid,gid){pid=+pid;gid=String(gid??'');if(!pid||gid==='all'||!gid)return false;const base=D().entries.find(x=>x.kind==='base'&&+x.pokemon_id===pid);if(!base||!(base.version_groups||[]).includes(+gid))return false;if(!has(pid,gid)){state.records.push({pokemonId:pid,gameId:gid,addedAt:Date.now()});save()}return true}
 function remove(pid,gid){const n=state.records.length;state.records=state.records.filter(x=>!(+x.pokemonId===+pid&&String(x.gameId)===String(gid)));if(state.records.length!==n)save();return state.records.length!==n}
 function toggle(pid,gid){return has(pid,gid)?remove(pid,gid):add(pid,gid)}
 function normalize(){const validGames=new Set(D().versionGroups.map(g=>String(g.id))),seen=new Set(),clean=[];for(const r of state.records||[]){const pid=+r.pokemonId,gid=String(r.gameId??''),base=D().entries.find(x=>x.kind==='base'&&+x.pokemon_id===pid);if(!base||!validGames.has(gid)||!(base.version_groups||[]).includes(+gid))continue;const k=pid+':'+gid;if(seen.has(k))continue;seen.add(k);clean.push({pokemonId:pid,gameId:gid,addedAt:Number(r.addedAt)||Date.now()})}state={records:clean};localStorage.setItem(KEY,JSON.stringify(state))}
 function request(detail){const pid=+detail.pokemonId,gid=detail.gameId;if(gid&&gid!=='all'){toggle(pid,gid);window.dispatchEvent(new CustomEvent('f12:collection-feedback',{detail:{pokemonId:pid,gameId:String(gid),owned:has(pid,gid)}}));return}window.F12Collection?.openSheet?.(pid,{allowedGameIds:detail.allowedGameIds})}
 window.addEventListener('f12:add-request',e=>request(e.detail||{}));
 window.F12Collection={key:KEY,records:()=>[...state.records],ownedIds,has,add,remove,toggle,compatible,openSheet:(pid,opt={})=>window.dispatchEvent(new CustomEvent('f12:collection-sheet-request',{detail:{pokemonId:+pid,...opt}}))};
 window.f12CollectionAudit=()=>({version:'12.25',key:KEY,records:state.records.length,uniquePokemon:ownedIds().length,duplicates:state.records.length-new Set(state.records.map(x=>x.pokemonId+':'+x.gameId)).size,gameAware:true,singleStore:true});
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>{normalize();emit()}):setTimeout(()=>{normalize();emit()},0);
})();
