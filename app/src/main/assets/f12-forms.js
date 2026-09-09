/* POKEHOME F12.25 - forms and Mega registry adapter */
(function(){
 'use strict';
 const Forms={
   records:[],
   set(records){this.records=Array.isArray(records)?records:[];},
   forPokemon(id){return this.records.filter(x=>String(x.pokemonId||x.pokemon_id)===String(id));},
   compatible(record,gameId){if(!gameId)return true;const games=record&&record.games;return !Array.isArray(games)||games.length===0||games.map(String).includes(String(gameId));},
   contextual(id,gameId){return this.forPokemon(id).filter(x=>this.compatible(x,gameId));}
 };
 window.F12Forms=Forms;
})();
