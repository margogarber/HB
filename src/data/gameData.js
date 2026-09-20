/**
 * Централизованные данные игры.
 * Весь персональный контент редактируется ТОЛЬКО здесь.
 */

export const gameData = {
  title: 'Поздравления для Виктории',
  heroine: 'Виктория',
  nickname: 'Бусинка',
  companion: {
    name: 'Филя',
    description: 'Маленький чёрный шпиц — серьёзный, неуклюжий, саркастичный и очень милый.',
  },

  intro: {
    text: 'Сегодня для тебя приготовлен особенный букет. Но каждый его цветок спрятан в одном из наших воспоминаний.',
    cta: 'Начать путешествие',
  },

  stages: [
    {
      id: 'hearts',
      number: 1,
      title: 'Сердечки',
      subtitle: 'Поймай семь летающих сердечек',
      flower: 'rose',
      filiaHint: 'Семь сердечек. Не больше, не меньше. Я считал.',
    },
    {
      id: 'findItems',
      number: 2,
      title: 'Поиск',
      subtitle: 'Найди четыре спрятанных предмета',
      flower: 'peony',
      filiaHint: 'Если не видишь — это не значит, что я спрятал плохо.',
    },
    {
      id: 'quiz',
      number: 3,
      title: 'Викторина',
      subtitle: 'Три важных вопроса',
      flower: 'tulip',
      filiaHint: 'Отвечай честно. Я всё равно сделаю вид, что не слушаю.',
    },
    {
      id: 'memory',
      number: 4,
      title: 'Воспоминания',
      subtitle: 'Найди четыре пары карточек',
      flower: 'lily',
      filiaHint: 'Память — дело тонкое. Особенно когда две дуры.',
    },
    {
      id: 'puzzle',
      number: 5,
      title: 'Пазл',
      subtitle: 'Собери фотопазл 3×3',
      flower: 'daisy',
      filiaHint: 'Кусочки сами не сложатся. Я проверял.',
    },
    {
      id: 'bouquet',
      number: 6,
      title: 'Букет',
      subtitle: 'Собери виртуальный букет',
      flower: 'orchid',
      filiaHint: 'Финал близко. Даже я немного волнуюсь. Совсем чуть-чуть.',
    },
  ],

  hearts: {
    target: 7,
  },

  findItems: {
    photo: 'photo6',
    idleHintMs: 9000,
    items: [
      { id: 'heart', label: 'Сердечко', x: 16, y: 58 },
      { id: 'star', label: 'Звезда', x: 74, y: 24 },
      { id: 'bow', label: 'Бантик', x: 38, y: 76 },
      { id: 'letter', label: 'Письмо', x: 82, y: 62 },
    ],
  },

  quiz: {
    questions: [
      {
        id: 'q1',
        text: 'Кто первый поцеловал?',
        options: ['я', 'эта дура', 'обе'],
        correct: 'обе',
      },
      {
        id: 'q2',
        text: 'Свет мой, зеркальце, скажи: кто на свете всех милее и красивее?',
        options: ['я', 'обе', 'эта дура'],
        correct: 'я',
      },
      {
        id: 'q3',
        // Не изменяй регистр вариантов — визуальное сходство часть шутки
        text: 'Как правильно называть человека, который тебе очень нравится?',
        options: ['дура', 'ДУРА', 'ДуРа'],
        correct: 'ДУРА',
      },
    ],
  },

  memoryPairs: [
    {
      id: 'm1',
      photo: 'photo1.jpg',
      caption: '5 мая 2026 — день, когда две дуры встретились',
      objectPosition: '50% 28%',
    },
    {
      id: 'm2',
      photo: 'photo2.jpg',
      caption: '3 сентября 2026 — просто сходили в клуб… ага',
      objectPosition: '50% 35%',
    },
    {
      id: 'm3',
      photo: 'photo3.jpg',
      caption: '9 сентября 2026 — официальный день Бусинки',
      objectPosition: '48% 30%',
    },
    {
      id: 'm4',
      photo: 'photo4.jpg',
      caption: 'Главный вопрос отношений: что есть будем?',
      objectPosition: '50% 40%',
    },
  ],

  puzzle: {
    photo: 'photo5',
    size: 3,
    hintMs: 2800,
    completeLine: 'Даже если всё перемешается, я всё равно выберу тебя.',
  },

  bouquet: {
    completeLine: 'Букет готов. Я ничего не съел. Почти.',
    mains: [
      { id: 'rose', label: 'Роза' },
      { id: 'peony', label: 'Пион' },
      { id: 'tulip', label: 'Тюльпан' },
    ],
    extras: [
      { id: 'daisy', label: 'Ромашка' },
      { id: 'lily', label: 'Лилия' },
      { id: 'orchid', label: 'Орхидея' },
      { id: 'baby', label: 'Гипсофила' },
    ],
    ribbons: [
      { id: 'burgundy', label: 'Бордовая', color: '#781F35' },
      { id: 'powder', label: 'Пудровая', color: '#E8BCC5' },
      { id: 'blush', label: 'Розовая', color: '#F5DDE2' },
    ],
  },

  photos: {
    photo1: 'assets/photos/photo1.jpg',
    photo2: 'assets/photos/photo2.jpg',
    photo3: 'assets/photos/photo3.jpg',
    photo4: 'assets/photos/photo4.jpg',
    photo5: 'assets/photos/photo5.jpg', // пазл
    photo6: 'assets/photos/photo6.jpg', // поиск предметов
  },

  phrases: {
    dura: 'ДУРА',
    dontUnderstand: 'я не понимаю',
    whatToEat: 'что есть будем',
    birthdayPass: 'Неправильно, но именинницам сегодня можно всё.',
    filiaPretends: 'Филя сделал вид, что ничего не заметил.',
    twoVersions: 'Кажется, у нас появились две версии этой истории.',
  },

  filiaLines: {
    welcome: 'Я Филя. Письмо у меня. Но сначала — букет. Правила есть правила.',
    stageComplete: [
      'Ещё один цветок. Неплохо для человека.',
      'Прогресс есть. Я почти впечатлён.',
      'Букет растёт. Я продолжаю делать серьёзное лицо.',
    ],
    nudge: 'Если застряла — это не я виноват. Но я рядом.',
    delivery:
      'Кажется, теперь всё готово. Я нёс это письмо очень осторожно… почти не погрыз его.',
  },

  letterTitle: 'Бусинка, с днём рождения!',

  // ==================================================
  // ВСТАВЬ ГОТОВОЕ ПОЗДРАВЛЕНИЕ МЕЖДУ ОБРАТНЫМИ КАВЫЧКАМИ
  // ==================================================
  finalLetter: `Дорогая Бусинка,

Это временная заглушка письма.
Скоро здесь появится настоящее поздравление — тёплое, личное и только для тебя.

Пока Филя бережно держит конверт и делает вид, что не волнуется.

С любовью,
твои дуры и один серьёзный шпиц`,
  // ==================================================
  // КОНЕЦ ПОЛЯ finalLetter
  // ==================================================

  storageKey: 'victoria-birthday-card-v1',
}

export default gameData
