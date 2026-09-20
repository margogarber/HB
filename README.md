# Поздравления для Виктории

Интерактивная мобильная открытка ко дню рождения (React + Vite).

Репозиторий: [margogarber/HB](https://github.com/margogarber/HB)  
Сайт: [https://margogarber.github.io/HB/](https://margogarber.github.io/HB/)

## Локальный запуск

```bash
npm install
npm run dev
```

Открой адрес из терминала (обычно `http://localhost:5173/HB/`).

## Фотографии

Положи файлы в папку `public/assets/photos/`:

| Файл | Назначение |
| --- | --- |
| `photo1.jpg` | Карточка воспоминания 1 |
| `photo2.jpg` | Карточка воспоминания 2 |
| `photo3.jpg` | Карточка воспоминания 3 |
| `photo4.jpg` | Карточка воспоминания 4 |
| `photo5.jpg` | Фотопазл |
| `photo6.jpg` | Поиск предметов |

Если файлов нет, приложение покажет градиентные заглушки и продолжит работать.

## Финальное письмо

Вставь текст сюда:

- файл: `src/data/gameData.js`
- поле: `finalLetter`

Между обратными кавычками после комментария  
`ВСТАВЬ ГОТОВОЕ ПОЗДРАВЛЕНИЕ МЕЖДУ ОБРАТНЫМИ КАВЫЧКАМИ`.

## Production build

```bash
npm run build
```

Результат — папка `dist/`. Для проверки локально:

```bash
npm run preview
```

## Публикация на GitHub Pages

1. Push в ветку `main` (workflow `.github/workflows/deploy.yml` соберёт и опубликует сайт).
2. В GitHub: **Settings → Pages → Source → GitHub Actions**.
3. Дождись успешного завершения workflow.

`vite.config.js` использует `base: "/HB/"`.

## Сброс прогресса

В приложении: кнопка настроек (шестерёнка) → **Начать сначала** → подтверждение.

Это очищает только ключ этой игры в `localStorage` (`victoria-birthday-card-v1`).
