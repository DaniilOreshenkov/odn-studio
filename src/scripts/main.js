function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.getAttribute('data-theme') === 'dark';

  root.setAttribute('data-theme', isDark ? 'light' : 'dark');

  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.textContent = isDark ? '🌙' : '☀️';
  }
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
  const themeBtn = document.getElementById('themeBtn');

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');

    if (themeBtn) {
      themeBtn.textContent = '☀️';
    }
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
    window.addEventListener('scroll', () => {
      const page = document.documentElement;
      const maxScroll = page.scrollHeight - page.clientHeight;

      progress.style.width =
        maxScroll > 0 ? `${(page.scrollTop / maxScroll) * 100}%` : '0%';
    });
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
  if (spotlight) {
    window.addEventListener('mousemove', (event) => {
      spotlight.style.opacity = '1';
      spotlight.style.left = `${event.clientX}px`;
      spotlight.style.top = `${event.clientY}px`;
    });

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