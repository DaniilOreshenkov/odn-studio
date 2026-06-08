function toggleTheme(){
    const root=document.documentElement;const dark=root.getAttribute('data-theme')==='dark';
    root.setAttribute('data-theme',dark?'light':'dark');
    document.getElementById('themeBtn').textContent=dark?'🌙':'☀️';
  }
  if(window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches){
    document.documentElement.setAttribute('data-theme','dark');
    document.addEventListener('DOMContentLoaded',()=>document.getElementById('themeBtn').textContent='☀️');
  }
  function setLang(lang){
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-ru]').forEach(el=>{el.textContent=lang==='ru'?el.dataset.ru:el.dataset.en;});
    document.getElementById('ruBtn').classList.toggle('active',lang==='ru');
    document.getElementById('enBtn').classList.toggle('active',lang==='en');
    const r=document.getElementById('rotator');if(r)r.textContent=curWords()[wi%curWords().length];
  }
  function toggleMenu(){document.getElementById('navLinks').classList.toggle('open');}
  document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=>document.getElementById('navLinks').classList.remove('open')));

  window.addEventListener('load',()=>setTimeout(()=>document.getElementById('loader').classList.add('done'),500));

  const prog=document.getElementById('progress');
  window.addEventListener('scroll',()=>{const h=document.documentElement;prog.style.width=(h.scrollTop)/(h.scrollHeight-h.clientHeight)*100+'%';});

  const io=new IntersectionObserver((e)=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}})},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  function countUp(el){const target=+el.dataset.count,suf=el.dataset.suffix||'';let t0=performance.now();(function tick(now){const p=Math.min((now-t0)/1300,1);el.textContent=Math.round((1-Math.pow(1-p,3))*target)+suf;if(p<1)requestAnimationFrame(tick);})(t0);}
  const cio=new IntersectionObserver((e)=>{e.forEach(x=>{if(x.isIntersecting){countUp(x.target);cio.unobserve(x.target);}})},{threshold:.5});
  document.querySelectorAll('.num[data-count]').forEach(el=>cio.observe(el));

  const sp=document.getElementById('spotlight');
  window.addEventListener('mousemove',e=>{sp.style.opacity='1';sp.style.left=e.clientX+'px';sp.style.top=e.clientY+'px';});
  document.addEventListener('mouseleave',()=>sp.style.opacity='0');

  /* Terminal */
  const term=document.getElementById('termBody');
  const intro=[
    {t:'prompt',txt:'➜ '},{t:'path',txt:'~/odn '},{t:'cmd',txt:'./welcome --studio ODN',type:true},{t:'br'},
    {t:'ok',txt:'● Минимализм · анимации · внимание к деталям'},{t:'br'},
    {t:'out',txt:'Сайты · Telegram Mini Apps · Мобильные приложения'},{t:'br'},{t:'br'},
    {t:'hint',txt:'Подсказка: напишите команду и нажмите Enter. Попробуйте: help'},{t:'br'},
  ];
  function appendLine(cls,text){const s=document.createElement('span');s.className=cls;s.textContent=text;term.appendChild(s);if(cls!=='prompt'&&cls!=='path'&&cls!=='cmd')term.appendChild(document.createElement('br'));return s;}
  let started=false;
  function runIntro(){
    if(started)return;started=true;let i=0;
    (function step(){
      if(i>=intro.length){showInput();return;}
      const it=intro[i];
      if(it.t==='br'){term.innerHTML+='<br>';i++;step();return;}
      const span=document.createElement('span');span.className=it.t;term.appendChild(span);
      if(it.type){let c=0;(function tc(){span.textContent=it.txt.slice(0,c++);if(c<=it.txt.length+1)setTimeout(tc,36);else{i++;setTimeout(step,240);}})();}
      else{span.textContent=it.txt;i++;setTimeout(step,it.t==='ok'||it.t==='out'?320:60);}
    })();
  }
  const cmds={
    help(){return['out','Доступно: услуги · контакты · whoami · clear'];},
    'услуги'(){return['ok','🌐 Сайты · ✈️ Telegram Mini Apps · 📱 Приложения · ⚙️ Веб-сервисы'];},
    services(){return this['услуги']();},
    'контакты'(){return['ok','Telegram · WhatsApp · Email — кнопки в секции «Контакты» ниже ↓'];},
    contact(){return this['контакты']();},
    whoami(){return['out','ODN — студия разработки цифровых продуктов 🚀'];},
    clear(){term.innerHTML='';showInput(true);return null;}
  };
  function showInput(skip){
    const p=document.createElement('span');p.className='prompt';p.textContent='➜ ';
    const pa=document.createElement('span');pa.className='path';pa.textContent='~/odn ';
    const inp=document.createElement('input');inp.id='termInput';inp.setAttribute('autocomplete','off');inp.setAttribute('spellcheck','false');
    term.appendChild(p);term.appendChild(pa);term.appendChild(inp);
    if(!skip)term.appendChild(document.createElement('br'));
    inp.focus();
    inp.addEventListener('keydown',e=>{
      if(e.key==='Enter'){
        const val=inp.value.trim().toLowerCase();
        inp.removeAttribute('id');inp.disabled=true;
        const shown=document.createElement('span');shown.className='cmd';shown.textContent=inp.value;
        inp.replaceWith(shown);term.appendChild(document.createElement('br'));
        if(val){const fn=cmds[val];if(fn){const r=fn.call(cmds);if(r)appendLine(r[0],r[1]);}else appendLine('err','command not found: '+val+'  →  напишите help');}
        showInput();term.scrollIntoView({block:'nearest'});
      }
    });
  }
  document.getElementById('terminal').addEventListener('click',()=>{const i=document.getElementById('termInput');if(i)i.focus();});
  const tio=new IntersectionObserver((e)=>{e.forEach(x=>{if(x.isIntersecting){runIntro();tio.disconnect();}})},{threshold:.3});
  tio.observe(term);

  /* ===== Rotating headline word ===== */
  const wordsRU=["цифровые продукты","сайты","Telegram Mini Apps","приложения","веб-сервисы"];
  const wordsEN=["digital products","websites","Telegram Mini Apps","mobile apps","web services"];
  let wi=0;
  function curWords(){return document.documentElement.lang==='en'?wordsEN:wordsRU;}
  const rot=document.getElementById('rotator');
  function cycle(){
    rot.classList.add('out');
    setTimeout(()=>{
      wi=(wi+1)%curWords().length;
      rot.textContent=curWords()[wi];
      rot.classList.remove('out');rot.classList.add('prep');
      requestAnimationFrame(()=>{rot.classList.remove('prep');rot.classList.add('in');
        setTimeout(()=>rot.classList.remove('in'),520);});
    },470);
  }
  setInterval(cycle,2600);

  /* ===== Seamless marquee (duplicate content) ===== */
  const mt=document.getElementById('mtrack');
  if(mt)mt.innerHTML+=mt.innerHTML;

  /* ===== Modern interactions (desktop) ===== */
  if(window.matchMedia('(min-width:761px)').matches){
    // Magnetic primary buttons
    document.querySelectorAll('.btn-primary').forEach(b=>{
      b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();const x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;b.style.transform=`translate(${x*.28}px,${y*.4}px) scale(1.04)`;});
      b.addEventListener('mouseleave',()=>{b.style.transform='';});
    });
    // 3D tilt on portfolio cards
    document.querySelectorAll('.port').forEach(p=>{
      p.addEventListener('mousemove',e=>{const r=p.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;p.style.transform=`perspective(900px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`;});
      p.addEventListener('mouseleave',()=>{p.style.transform='';});
    });
  }
