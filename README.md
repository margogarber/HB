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

## Как вставить фотографии

### 1. Какую папку открыть

Точный путь в проекте:

`public/assets/photos/`

Полный путь на диске (пример):

`HappyBD/public/assets/photos/`

### 2. Как назвать каждый файл

Имена должны быть **точно** такими (регистр важен):

| Файл | Этап / назначение |
| --- | --- |
| `photo1.jpg` | Карточки воспоминаний — знакомство, 5 мая 2026 |
| `photo2.jpg` | Карточки воспоминаний — клуб, 3 сентября 2026 |
| `photo3.jpg` | Карточки воспоминаний — начало отношений, 9 сентября 2026 |
| `photo4.jpg` | Карточки воспоминаний — «что есть будем» |
| `photo5.jpg` | Фотопазл 3×3 |
| `photo6.jpg` | Фон этапа «Поиск предметов» |

Компоненты читают пути через `import.meta.env.BASE_URL` + `assets/photos/...`, поэтому на GitHub Pages (`/HB/`) всё работает без правки кода. Достаточно положить файлы с этими именами.

### 3. Форматы

- Рекомендуется: **JPEG** (`.jpg`)
- Допустимо: `.jpeg`, `.png`, `.webp` — но тогда нужно либо сохранить как `.jpg`, либо попросить обновить имена в `gameData.js`
- **HEIC нельзя** просто переименовать в `.jpg`. Сначала экспортируй/конвертируй в JPEG (На Mac: Превью → Файл → Экспортировать → JPEG)

### 4. Размеры и ориентация

- `photo1`–`photo4`: вертикальные или квадратные, желательно от **1000px** по короткой стороне
- `photo5`: квадрат, желательно **1200×1200** или больше
- `photo6`: вертикаль/квадрат со свободным местом для спрятанных предметов
- Вес файла: примерно **300–800 КБ**
- Не искажай пропорции; кадрирование лиц можно подправить через `objectPosition` в `src/data/gameData.js` → `memoryPairs`

### 5. Как добавить через Cursor (перетаскивание)

1. В боковой панели Cursor открой папку `public` → `assets` → `photos`
2. Перетащи туда шесть файлов из Finder
3. Убедись, что имена совпадают с таблицей выше (`photo1.jpg` … `photo6.jpg`)
4. Если файлы уже лежат в другой папке — переименуй их перед перетаскиванием

### 6. Проверка локально

```bash
npm run dev
```

Пройди этапы: Воспоминания (1–4), Пазл (5), Поиск (6). Если файла нет — будет градиентная заглушка; после добавления `.jpg` фото подставится само.

### 7. Отправка фото на GitHub

```bash
git add public/assets/photos/photo1.jpg public/assets/photos/photo2.jpg public/assets/photos/photo3.jpg public/assets/photos/photo4.jpg public/assets/photos/photo5.jpg public/assets/photos/photo6.jpg
git status
git commit -m "Add birthday photos for Victoria card"
git push origin main
```

Не используй `git push --force`.

## Финальное письмо

- файл: `src/data/gameData.js`
- поле: `finalLetter`

Между обратными кавычками после комментария  
`ВСТАВЬ ГОТОВОЕ ПОЗДРАВЛЕНИЕ МЕЖДУ ОБРАТНЫМИ КАВЫЧКАМИ`.

## Production build

```bash
npm run build
npm run preview
```

## Публикация на GitHub Pages

1. Push в `main` (workflow соберёт сайт).
2. Settings → Pages → Source → **GitHub Actions**.
3. Дождись успешного Deploy.

`vite.config.js`: `base: "/HB/"`.

## Сброс прогресса

Настройки (шестерёнка) → **Начать сначала** → подтверждение.  
Очищается только ключ `victoria-birthday-card-v1` в `localStorage`.
