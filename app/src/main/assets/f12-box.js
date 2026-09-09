/* POKEHOME F12.25 - unified Box */
(function(){
  'use strict';
  const Box={
    gameId:null,
    setGame(gameId){ this.gameId=gameId||null; this.render(); },
    entries(){
      const c=window.F12Collection;
      if(!c||typeof c.list!=='function') return [];
      const all=c.list();
      return this.gameId?all.filter(x=>String(x.gameId)===String(this.gameId)):all;
    },
    open(pokemonId,formId){
      if(window.F12Detail&&typeof window.F12Detail.open==='function') window.F12Detail.open(pokemonId,{gameId:this.gameId,formId:formId||null,origin:'box'});
    },
    render(){
      const root=document.querySelector('[data-f12-box-grid]'); if(!root)return;
      const data=this.entries();
      root.innerHTML=data.map(x=>`<button class="f12-box-card" data-pokemon-id="${x.pokemonId}" data-form-id="${x.formId||''}"><span>#${String(x.pokemonId).padStart(4,'0')}</span><strong>${x.name||'Pokémon'}</strong></button>`).join('')||'<div class="f12-empty">Nenhum Pokémon nesta Box.</div>';
      root.querySelectorAll('[data-pokemon-id]').forEach(el=>el.addEventListener('click',()=>this.open(el.dataset.pokemonId,el.dataset.formId)));
    }
  };
  window.F12Box=Box;
  window.addEventListener('f12:collection-changed',()=>Box.render());
})();
