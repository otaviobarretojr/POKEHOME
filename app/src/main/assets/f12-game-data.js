/* POKEHOME F12.25 - game/location provider registry */
(function(){
 'use strict';
 const providers=new Map();
 const GameData={
  register(gameId,provider){providers.set(String(gameId),provider||{});},
  provider(gameId){return providers.get(String(gameId))||null;},
  async locations(pokemonId,gameId,formId){const p=this.provider(gameId);if(!p||typeof p.locations!=='function')return[];return (await p.locations(pokemonId,formId))||[];},
  async evolution(pokemonId,gameId,formId){const p=this.provider(gameId);if(!p||typeof p.evolution!=='function')return[];return (await p.evolution(pokemonId,formId))||[];}
 };
 window.F12GameData=GameData;
})();
