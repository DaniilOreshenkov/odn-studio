# Подключение Git и GitHub

## 1. Открыть проект в терминале

```bash
cd odn-landing-project
```

## 2. Инициализировать Git

```bash
git init
git add .
git commit -m "Initial ODN landing project"
```

## 3. Создать репозиторий на GitHub

1. Зайди на GitHub.
2. Нажми **New repository**.
3. Название: `odn-landing-project`.
4. Выбери **Public** или **Private**.
5. Не ставь галочки на README / .gitignore / license, потому что они уже есть в проекте.
6. Нажми **Create repository**.

## 4. Подключить локальный проект к GitHub

Скопируй ссылку репозитория и выполни:

```bash
git remote add origin https://github.com/USERNAME/odn-landing-project.git
git branch -M main
git push -u origin main
```

Вместо `USERNAME` вставь свой GitHub username.

## 5. Дальше работать так

После любых изменений:

```bash
git status
git add .
git commit -m "Описание изменений"
git push
```

## 6. Если проект будет деплоиться на Vercel

1. Зайди в Vercel.
2. Нажми **Add New Project**.
3. Выбери репозиторий `odn-landing-project`.
4. Framework Preset можно оставить **Other** или **Vite**, если позже переведёшь проект на Vite/React.
5. Нажми **Deploy**.
