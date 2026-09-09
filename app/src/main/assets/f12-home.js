/* POKEHOME F12.25 - Home command center */
(function(){
 'use strict';
 const Home={
   snapshot(){
     const c=window.F12Collection; const rows=c&&typeof c.list==='function'?c.list():[];
     const unique=new Set(rows.map(x=>String(x.pokemonId)));
     return {captured:unique.size,total:1025,records:rows.length,missing:Math.max(0,1025-unique.size)};
   },
   render(){
     const s=this.snapshot();
     document.querySelectorAll('[data-f12-captured]').forEach(e=>e.textContent=s.captured);
     document.querySelectorAll('[data-f12-missing]').forEach(e=>e.textContent=s.missing);
     document.querySelectorAll('[data-f12-total]').forEach(e=>e.textContent=s.total);
     document.querySelectorAll('[data-f12-records]').forEach(e=>e.textContent=s.records);
     const p=document.querySelector('[data-f12-progress]'); if(p)p.style.setProperty('--f12-progress',`${(s.captured/s.total)*100}%`);
   }
 };
 window.F12Home=Home;
 document.addEventListener('DOMContentLoaded',()=>Home.render());
 window.addEventListener('f12:collection-changed',()=>Home.render());
})();
