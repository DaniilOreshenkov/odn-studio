# ODN Landing Project

Готовая структура проекта для лендинга ODN на Vite + Vanilla HTML/CSS/JS.

## Как запустить

```bash
npm install
npm run dev
```

После запуска открой локальный адрес, который покажет терминал.

## Структура

```text
odn-landing-project/
├─ index.html
├─ package.json
├─ public/
├─ src/
│  ├─ styles/
│  │  └─ main.css
│  └─ scripts/
│     └─ main.js
└─ README.md
```

## Где что менять

- `index.html` — структура сайта, тексты, блоки, ссылки Telegram/WhatsApp/Email.
- `src/styles/main.css` — дизайн, цвета, адаптив, анимации.
- `src/scripts/main.js` — переключение темы/языка, терминал, анимации, меню.

## Что уже подготовлено

- Проект можно открыть в VS Code.
- Разделены HTML, CSS и JavaScript.
- Добавлены команды для разработки и сборки.
- Добавлен `.gitignore` для GitHub/Vercel.

## Деплой на Vercel

1. Залей проект на GitHub.
2. Подключи репозиторий в Vercel.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
