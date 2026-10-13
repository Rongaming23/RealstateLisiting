const startBtn=document.getElementById('startBtn');
startBtn.addEventListener('click',()=>document.getElementById('note1').scrollIntoView({behavior:'smooth'}));
document.querySelectorAll('[data-next]').forEach(btn=>btn.addEventListener('click',()=>{
  const current=btn.closest('.screen');
  const next=current.nextElementSibling;
  if(next) next.scrollIntoView({behavior:'smooth'});
}));
document.getElementById('heartBtn').addEventListener('click',()=>{
  const reply=document.getElementById('reply');
  reply.textContent='A little heart just for you, Prachii ❤️💗✨';
  for(let i=0;i<14;i++){
    const heart=document.createElement('span');
    heart.textContent=['💗','💖','💕','✨'][Math.floor(Math.random()*4)];
    heart.style.position='fixed';heart.style.left=(10+Math.random()*80)+'vw';
    heart.style.top=(65+Math.random()*25)+'vh';heart.style.zIndex='99';
    heart.style.fontSize=(18+Math.random()*18)+'px';heart.style.pointerEvents='none';
    document.body.appendChild(heart);
    heart.animate([{transform:'translateY(0) scale(.7)',opacity:0},{transform:'translateY(-120px) scale(1.3)',opacity:1},{transform:'translateY(-220px) scale(.8)',opacity:0}],{duration:1600+Math.random()*900,easing:'ease-out'});
    setTimeout(()=>heart.remove(),2700);
  }
});


// Browsers often block audio autoplay until the visitor taps; the music button starts it.
const bgMusic = document.getElementById('bgMusic');
const soundBtn = document.getElementById('soundBtn');
if (bgMusic) {
  bgMusic.volume = 0.55;
  const attemptPlay = bgMusic.play();
  if (attemptPlay && typeof attemptPlay.catch === 'function') {
    attemptPlay.catch(() => { if (soundBtn) soundBtn.textContent = '▶️'; });
  }
}
if (soundBtn && bgMusic) {
  soundBtn.addEventListener('click', async () => {
    try {
      if (bgMusic.paused) { await bgMusic.play(); soundBtn.textContent = '🎵'; }
      else { bgMusic.pause(); soundBtn.textContent = '▶️'; }
    } catch (e) { soundBtn.textContent = '▶️'; }
  });
}
