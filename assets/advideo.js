(function(){
  function mount(){
    var main=document.getElementById('main'); if(!main||document.getElementById('ad-video')) return !!main;
    var hero=main.querySelector('.hero'); if(!hero) return false;
    var s=document.createElement('section'); s.className='ad-video'; s.id='ad-video'; s.setAttribute('aria-label','FreshDrop video ad');
    s.innerHTML='<div class="wrap"><div class="ad-video__frame">'+
      '<video muted autoplay loop playsinline preload="metadata" width="720" height="720" poster="assets/video/freshdrop-ad-poster.jpg" aria-label="FreshDrop video ad: cosy pet and home products, delivered fast">'+
      '<source src="assets/video/freshdrop-ad.mp4" type="video/mp4"></video>'+
      '<button type="button" class="ad-video__sound" aria-pressed="false">🔇 Tap for sound</button></div>'+
      '<div class="ad-video__copy"><h2>Comfort, delivered.</h2><p>Bestsellers for your home, car and pets, picked for everyday comfort.</p>'+
      '<a class="btn btn-primary btn-xl" href="#bestsellers">Shop now</a></div></div>';
    main.insertBefore(s,hero);
    var v=s.querySelector('video'), b=s.querySelector('.ad-video__sound');
    v.muted=true; var p=v.play(); if(p&&p.catch)p.catch(function(){});
    function unmute(){ if(!v.muted) return; v.muted=false; v.play().catch(function(){}); b.textContent='🔊 Sound on'; b.setAttribute('aria-pressed','true'); off(); }
    function toggle(e){ e.stopPropagation(); v.muted=!v.muted; if(!v.muted)v.play().catch(function(){}); b.textContent=v.muted?'🔇 Tap for sound':'🔊 Sound on'; b.setAttribute('aria-pressed',String(!v.muted)); off(); }
    function off(){ document.removeEventListener('pointerdown',unmute,true); document.removeEventListener('keydown',unmute,true); }
    b.addEventListener('click',toggle);
    document.addEventListener('pointerdown',function(e){ if(e.target!==b) unmute(); },{capture:true,once:true});
    document.addEventListener('keydown',unmute,{capture:true,once:true});
    if('IntersectionObserver' in window) new IntersectionObserver(function(es){es.forEach(function(en){ if(en.isIntersecting) v.play().catch(function(){}); else v.pause(); });},{threshold:.25}).observe(v);
    s.querySelector('a.btn').addEventListener('click',function(e){
      var t=document.getElementById('bestsellers')||[].slice.call(main.querySelectorAll('section.block')).filter(function(x){var h=x.querySelector('h2');return h&&/bestseller/i.test(h.textContent);})[0];
      if(t){ e.preventDefault(); t.id=t.id||'bestsellers'; t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}); }
    });
    var u=document.querySelector('.usp-bar > .wrap'); if(u&&u.scrollWidth>u.clientWidth&&!u.hasAttribute('tabindex')){u.tabIndex=0;u.setAttribute('role','region');u.setAttribute('aria-label','Store benefits');}
    return true;
  }
  function tryMount(n){ if(!mount()&&n>0) setTimeout(function(){tryMount(n-1)},50); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){tryMount(60)}); else tryMount(60);
})();
