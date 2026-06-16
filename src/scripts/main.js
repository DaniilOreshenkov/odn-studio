function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
}

function setLang(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-ru]').forEach((el) => {
    el.textContent = lang === 'ru' ? el.dataset.ru : el.dataset.en;
  });

  const ruBtn = document.getElementById('ruBtn');
  const enBtn = document.getElementById('enBtn');

  if (ruBtn) ruBtn.classList.toggle('active', lang === 'ru');
  if (enBtn) enBtn.classList.toggle('active', lang === 'en');

  const rotator = document.getElementById('rotator');
  if (rotator) {
    const words = curWords();
    rotator.textContent = words[wi % words.length];
  }

  // re-render AI feed on lang switch
  if (window._aiwRestartScenario) window._aiwRestartScenario();
}

function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.classList.toggle('open');
  }
}

window.toggleTheme = toggleTheme;
window.setLang = setLang;
window.toggleMenu = toggleMenu;

document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    if (loader) {
      setTimeout(() => loader.classList.add('done'), 500);
    }
  });

  const progress = document.getElementById('progress');
  if (progress) {
    let scrollRaf;
    window.addEventListener('scroll', () => {
      cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        const page = document.documentElement;
        const maxScroll = page.scrollHeight - page.clientHeight;
        progress.style.width =
          maxScroll > 0 ? `${(page.scrollTop / maxScroll) * 100}%` : '0%';
      });
    }, { passive: true });
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });

  function countUp(el) {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const start = performance.now();

    function tick(now) {
      const progressValue = Math.min((now - start) / 1300, 1);
      const value = Math.round((1 - Math.pow(1 - progressValue, 3)) * target);

      el.textContent = value + suffix;

      if (progressValue < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.num[data-count]').forEach((el) => {
    countObserver.observe(el);
  });

  const spotlight = document.getElementById('spotlight');
  const isTouch = window.matchMedia('(hover:none)').matches;
  if (spotlight && !isTouch) {
    let rafId;
    window.addEventListener('mousemove', (event) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        spotlight.style.opacity = '1';
        spotlight.style.left = `${event.clientX}px`;
        spotlight.style.top = `${event.clientY}px`;
      });
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      spotlight.style.opacity = '0';
    });
  }

  const term = document.getElementById('termBody');

  if (term) {
    const intro = [
      { t: 'prompt', txt: '➜ ' },
      { t: 'path', txt: '~/odn ' },
      { t: 'cmd', txt: './welcome --studio ODN Studio', type: true },
      { t: 'br' },
      { t: 'ok', txt: '● Минимализм · анимации · внимание к деталям' },
      { t: 'br' },
      { t: 'out', txt: 'Сайты · Telegram Mini Apps · Мобильные приложения · AI-системы' },
      { t: 'br' },
      { t: 'br' },
      {
        t: 'hint',
        txt: 'Подсказка: напишите команду и нажмите Enter. Попробуйте: help',
      },
      { t: 'br' },
    ];

    function appendLine(className, text) {
      const span = document.createElement('span');
      span.className = className;
      span.textContent = text;
      term.appendChild(span);

      if (className !== 'prompt' && className !== 'path' && className !== 'cmd') {
        term.appendChild(document.createElement('br'));
      }

      return span;
    }

    const cmds = {
      help() {
        return ['out', 'Доступно: услуги · контакты · whoami · ai · clear'];
      },
      услуги() {
        return [
          'ok',
          '🌐 Сайты · ✈️ Telegram Mini Apps · 📱 Приложения · 🤖 AI-системы · ⚙️ Веб-сервисы',
        ];
      },
      services() {
        return this.услуги();
      },
      ai() {
        return ['ok', 'AI-агенты, Telegram-боты, автоматизация заявок, контента и продаж.'];
      },
      контакты() {
        return [
          'ok',
          'Telegram · WhatsApp · Email — кнопки в секции «Контакты» ниже ↓',
        ];
      },
      contact() {
        return this.контакты();
      },
      whoami() {
        return ['out', 'ODN Studio — студия разработки цифровых продуктов 🚀'];
      },
      clear() {
        term.innerHTML = '';
        showInput(true);
        return null;
      },
    };

    function showInput(skipLineBreak = false) {
      const prompt = document.createElement('span');
      prompt.className = 'prompt';
      prompt.textContent = '➜ ';

      const path = document.createElement('span');
      path.className = 'path';
      path.textContent = '~/odn ';

      const input = document.createElement('input');
      input.id = 'termInput';
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('spellcheck', 'false');

      term.appendChild(prompt);
      term.appendChild(path);
      term.appendChild(input);

      if (!skipLineBreak) {
        term.appendChild(document.createElement('br'));
      }

      input.focus();

      input.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;

        const value = input.value.trim().toLowerCase();

        input.removeAttribute('id');
        input.disabled = true;

        const shown = document.createElement('span');
        shown.className = 'cmd';
        shown.textContent = input.value;

        input.replaceWith(shown);
        term.appendChild(document.createElement('br'));

        if (value) {
          const command = cmds[value];

          if (command) {
            const result = command.call(cmds);

            if (result) {
              appendLine(result[0], result[1]);
            }
          } else {
            appendLine('err', `command not found: ${value}  →  напишите help`);
          }
        }

        showInput();
      });
    }

    let started = false;

    function runIntro() {
      if (started) return;

      started = true;
      let index = 0;

      function step() {
        if (index >= intro.length) {
          showInput();
          return;
        }

        const item = intro[index];

        if (item.t === 'br') {
          term.appendChild(document.createElement('br'));
          index += 1;
          step();
          return;
        }

        const span = document.createElement('span');
        span.className = item.t;
        term.appendChild(span);

        if (item.type) {
          let charIndex = 0;

          function typeText() {
            span.textContent = item.txt.slice(0, charIndex);
            charIndex += 1;

            if (charIndex <= item.txt.length + 1) {
              setTimeout(typeText, 36);
            } else {
              index += 1;
              setTimeout(step, 240);
            }
          }

          typeText();
        } else {
          span.textContent = item.txt;
          index += 1;
          setTimeout(step, item.t === 'ok' || item.t === 'out' ? 320 : 60);
        }
      }

      step();
    }

    const terminal = document.getElementById('terminal');
    if (terminal) {
      terminal.addEventListener('click', () => {
        const input = document.getElementById('termInput');
        if (input) input.focus();
      });
    }

    const terminalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runIntro();
            terminalObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    terminalObserver.observe(term);
  }

  const rotator = document.getElementById('rotator');

  if (rotator) {
    setInterval(() => {
      rotator.classList.add('out');

      setTimeout(() => {
        wi = (wi + 1) % curWords().length;
        rotator.textContent = curWords()[wi];

        rotator.classList.remove('out');
        rotator.classList.add('prep');

        requestAnimationFrame(() => {
          rotator.classList.remove('prep');
          rotator.classList.add('in');

          setTimeout(() => {
            rotator.classList.remove('in');
          }, 520);
        });
      }, 470);
    }, 2600);
  }

  const marqueeTrack = document.getElementById('mtrack');
  if (marqueeTrack) {
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
  }

  const pintNav = document.getElementById('pintNav');
  const pintPanels = document.getElementById('pintPanels');

  if (pintNav && pintPanels) {
    const steps = Array.from(pintNav.querySelectorAll('.pint-step'));
    const panels = Array.from(pintPanels.querySelectorAll('.pint-panel'));
    let current = 0;
    let autoTimer = null;
    let paused = false;

    function startTick(idx) {
      const fill = steps[idx] && steps[idx].querySelector('.pint-prog-fill');
      if (!fill) return;
      fill.style.transition = 'none';
      fill.style.height = '0%';
      fill.offsetHeight; // reflow
      steps[idx].classList.add('is-ticking');
    }

    function stopAllTicks() {
      steps.forEach((s) => {
        s.classList.remove('is-ticking');
        const fill = s.querySelector('.pint-prog-fill');
        if (fill) { fill.style.transition = 'none'; fill.style.height = '0%'; }
      });
    }

    function goTo(idx) {
      stopAllTicks();
      steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      panels.forEach((p, i) => p.classList.toggle('is-active', i === idx));
      current = idx;
      clearTimeout(autoTimer);
      if (!paused) scheduleAuto();
    }

    function scheduleAuto() {
      clearTimeout(autoTimer);
      startTick(current);
      autoTimer = setTimeout(() => {
        goTo((current + 1) % steps.length);
      }, 5000);
    }

    steps.forEach((step, i) => step.addEventListener('click', () => goTo(i)));

    const procSection = document.getElementById('process');
    if (procSection) {
      procSection.addEventListener('mouseenter', () => {
        paused = true;
        clearTimeout(autoTimer);
        stopAllTicks();
      });
      procSection.addEventListener('mouseleave', () => {
        paused = false;
        scheduleAuto();
      });
    }

    // ── Reveal nav on scroll into view, then start auto ──
    const pintObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            pintNav.classList.add('pint-in');
            scheduleAuto();
            pintObs.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    pintObs.observe(pintNav);
  }

  if (window.matchMedia('(min-width: 761px)').matches) {
    document.querySelectorAll('.btn-primary').forEach((button) => {
      button.addEventListener('mousemove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.28}px, ${y * 0.4}px) scale(1.04)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
      });
    });

    document.querySelectorAll('.port').forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

  }

  // ── AI Feed animation ─────────────────────────────────────────
  const aiwFeed = document.getElementById('aiwFeed');
  if (aiwFeed) {
    const L = () => document.documentElement.lang === 'en' ? 'en' : 'ru';

    const scenarios = [
      [
        { type:'in',  srcRu:'Telegram', srcEn:'Telegram', time:'09:14',
          ru:'Иван М.: «Хочу заказать лендинг, сколько стоит и как быстро?»',
          en:'Ivan M.: «I want a landing page, how much and how fast?»' },
        { type:'ai',  srcRu:'AI', srcEn:'AI', time:'09:14',
          ru:'Классификация: запрос на цену · категория: Сайт · намерение: покупка',
          en:'Classification: price inquiry · category: Website · intent: purchase' },
        { type:'ai',  srcRu:'AI', srcEn:'AI', time:'09:14',
          ru:'Извлечены параметры: тип → лендинг, срок → не указан, бюджет → не указан',
          en:'Extracted params: type → landing, deadline → not stated, budget → not stated',
          srcClass:'aiw-event-src--ai' },
        { type:'out', srcRu:'CRM', srcEn:'CRM', srcClass:'aiw-event-src--out', time:'09:14',
          ru:'Лид создан: Иван М. · источник: Telegram · статус: Новый · этап: Квалификация',
          en:'Lead created: Ivan M. · source: Telegram · status: New · stage: Qualification' },
        { type:'out', srcRu:'Ответ', srcEn:'Reply', srcClass:'aiw-event-src--reply', time:'09:14',
          ru:'«Привет, Иван! Лендинг — от 7 дней, от 60 000 ₽. Расскажите подробнее?»',
          en:'«Hi Ivan! Landing page — from 7 days, from 60,000 ₽. Tell us more?»' },
        { type:'out', srcRu:'Менеджер', srcEn:'Manager', srcClass:'aiw-event-src--notify', time:'09:14',
          ru:'Уведомление отправлено: горячий лид, Telegram, ответ дан',
          en:'Notification sent: hot lead, Telegram, reply delivered' },
      ],
      [
        { type:'in',  srcRu:'Форма', srcEn:'Form', time:'11:02',
          ru:'Анна С.: «Нужен AI-бот для поддержки клиентов в Telegram, бюджет ~150к»',
          en:'Anna S.: «Need AI support bot for Telegram, budget ~150k»' },
        { type:'ai',  srcRu:'AI', srcEn:'AI', srcClass:'aiw-event-src--ai', time:'11:02',
          ru:'Классификация: AI Systems · приоритет: HIGH · бюджет: квалифицирован',
          en:'Classification: AI Systems · priority: HIGH · budget: qualified' },
        { type:'ai',  srcRu:'AI', srcEn:'AI', srcClass:'aiw-event-src--ai', time:'11:02',
          ru:'Подобраны кейсы: AI-поддержка × 3 · сформирован персональный ответ',
          en:'Matched cases: AI support × 3 · personalised reply generated' },
        { type:'out', srcRu:'CRM', srcEn:'CRM', srcClass:'aiw-event-src--out', time:'11:02',
          ru:'Лид: Анна С. · сегмент: Enterprise · тег: ai-bot · этап: Презентация',
          en:'Lead: Anna S. · segment: Enterprise · tag: ai-bot · stage: Presentation' },
        { type:'out', srcRu:'Ответ', srcEn:'Reply', srcClass:'aiw-event-src--reply', time:'11:02',
          ru:'«Анна, привет! Мы делаем именно такие системы. Созвонимся завтра в 12:00?»',
          en:'«Anna, hi! We build exactly this. Can we call tomorrow at 12:00?»' },
        { type:'out', srcRu:'Менеджер', srcEn:'Manager', srcClass:'aiw-event-src--notify', time:'11:03',
          ru:'🔥 VIP-лид · Анна С. · бюджет 150к · ждёт звонка',
          en:'🔥 VIP lead · Anna S. · budget 150k · awaiting call' },
      ],
      [
        { type:'in',  srcRu:'WhatsApp', srcEn:'WhatsApp', time:'14:37',
          ru:'Клиент: «Напишите 3 поста про наш новый продукт — CRM для агентств»',
          en:'Client: «Write 3 posts about our new product — CRM for agencies»' },
        { type:'ai',  srcRu:'AI', srcEn:'AI', srcClass:'aiw-event-src--ai', time:'14:37',
          ru:'Тип задачи: контент · платформа: Instagram · тональность: анализируется',
          en:'Task type: content · platform: Instagram · tone: analysing' },
        { type:'ai',  srcRu:'AI', srcEn:'AI', srcClass:'aiw-event-src--ai', time:'14:37',
          ru:'Тональность бренда определена · генерирую 3 варианта постов…',
          en:'Brand tone identified · generating 3 post variants…' },
        { type:'out', srcRu:'Контент', srcEn:'Content', srcClass:'aiw-event-src--content', time:'14:38',
          ru:'Готово: 3 поста сгенерированы · хэштеги добавлены · отправлено в чат',
          en:'Done: 3 posts generated · hashtags added · sent to chat' },
        { type:'out', srcRu:'Ответ', srcEn:'Reply', srcClass:'aiw-event-src--reply', time:'14:38',
          ru:'«Готово! Вот 3 варианта постов с хэштегами. Скорректировать тон?»',
          en:'«Done! Here are 3 posts with hashtags. Want to adjust the tone?»' },
        { type:'out', srcRu:'CRM', srcEn:'CRM', srcClass:'aiw-event-src--out', time:'14:38',
          ru:'Задача закрыта · тип: контент · время выполнения: 58 сек',
          en:'Task closed · type: content · completion time: 58 sec' },
      ],
    ];

    let scenarioIdx = 0;
    let gen = 0; // increment to cancel current run

    function makeEvent(ev) {
      const el = document.createElement('div');
      el.className = `aiw-event aiw-event--${ev.type} aiw-event--new`;
      const srcClass = ev.srcClass || '';
      const src = L() === 'en' ? ev.srcEn : ev.srcRu;
      const text = L() === 'en' ? ev.en : ev.ru;
      el.innerHTML = `<span class="aiw-event-src ${srcClass}">${src}</span>`
        + `<span class="aiw-event-text">${text}</span>`
        + `<span class="aiw-event-time">${ev.time}</span>`;
      return el;
    }

    function makeTyping() {
      const el = document.createElement('div');
      el.className = 'aiw-event aiw-event--ai aiw-event--new';
      el.innerHTML = '<span class="aiw-event-src aiw-event-src--ai">AI</span>'
        + '<span class="aiw-event-text"><span class="aiw-typing"><span></span><span></span><span></span></span></span>';
      return el;
    }

    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

    async function runScenario(events, myGen) {
      aiwFeed.innerHTML = '';
      for (let i = 0; i < events.length; i++) {
        if (gen !== myGen) return;
        if (events[i].type === 'ai') {
          const t = makeTyping();
          aiwFeed.appendChild(t);
          aiwFeed.scrollTop = aiwFeed.scrollHeight;
          await delay(900);
          if (gen !== myGen) return;
          t.remove();
        }
        if (gen !== myGen) return;
        const el = makeEvent(events[i]);
        aiwFeed.appendChild(el);
        aiwFeed.scrollTop = aiwFeed.scrollHeight;
        setTimeout(() => el.classList.remove('aiw-event--new'), 400);
        await delay(i < 2 ? 700 : 850);
      }
    }

    async function loop() {
      while (true) {
        const myGen = gen;
        await runScenario(scenarios[scenarioIdx % scenarios.length], myGen);
        if (gen !== myGen) {
          // was restarted — re-run same scenario index
          continue;
        }
        scenarioIdx++;
        await delay(2800);
      }
    }

    // called from setLang — restart current scenario in new language
    window._aiwRestartScenario = () => { gen++; };

    const aiwObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { loop(); aiwObs.disconnect(); }
    }, { threshold: 0.1 });
    aiwObs.observe(aiwFeed);
  }

});

const wordsRU = [
  'цифровые продукты',
  'сайты',
  'Telegram Mini Apps',
  'AI-системы',
  'веб-сервисы',
];

const wordsEN = [
  'digital products',
  'websites',
  'Telegram Mini Apps',
  'AI systems',
  'web services',
];

let wi = 0;

function curWords() {
  return document.documentElement.lang === 'en' ? wordsEN : wordsRU;
}