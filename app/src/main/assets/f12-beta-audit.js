/* POKEHOME F12.25 runtime beta audit */
(function(){
 'use strict';
 function check(name,pass,detail){return{name,pass:!!pass,detail:detail||''};}
 function run(){
  const tests=[
   check('shell',!!window.F12Shell),check('collection',!!window.F12Collection),check('pokedex',!!window.F12Pokedex),
   check('detail',!!window.F12Detail),check('box',!!window.F12Box),check('home',!!window.F12Home),
   check('forms',!!window.F12Forms),check('gameData',!!window.F12GameData),check('storage',(()=>{try{localStorage.setItem('__f12audit','1');localStorage.removeItem('__f12audit');return true}catch(e){return false}})())
  ];
  const report={version:'12.25',at:new Date().toISOString(),tests,pass:tests.every(x=>x.pass)};
  window.__F12_BETA_AUDIT__=report; return report;
 }
 window.F12BetaAudit={run};
 document.addEventListener('DOMContentLoaded',()=>setTimeout(run,0));
})();
