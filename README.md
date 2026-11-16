![GitHub last commit](https://img.shields.io/github/last-commit/becta31/Daniil_Himik)
![GitHub repo size](https://img.shields.io/github/repo-size/becta31/Daniil_Himik)
![License](https://img.shields.io/github/license/becta31/Daniil_Himik)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fdaniil-himik.vercel.app)](https://daniil-himik.vercel.app)

# 🧪 ХИМИК — интерактивный тренажёр по химии

Образовательное веб-приложение для изучения таблицы Менделеева (118 элементов), прохождения викторин, общения с ИИ-ассистентом и таблицы лидеров на базе **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 4**, **shadcn/ui** и **Prisma ORM (SQLite)**, задеплоенное на **Vercel**.

---

## 🔗 Демо

👉 **[https://daniil-himik.vercel.app](https://daniil-himik.vercel.app)**

---

## 📌 Возможности проекта

### ⚛️ Интерактивная таблица Менделеева
- Все **118 химических элементов** с разбивкой по категориям.
- Подробные карточки элементов с основными характеристиками и свойствами.

### 📚 Режим обучения
- Удобное изучение химических элементов, их символов, атомных номеров и категорий.

### 🎯 Викторина
- Интерактивное тестирование знаний по таблице Менделеева и химии с подсчётом результатов.

### 🤖 ИИ-ассистент «ХИМИК»
- Встроенный чат-помощник на базе **Groq API** для ответов на вопросы по химии и помощи в обучении.

### 🏆 Таблица лидеров
- Рейтинг пользователей по результатам прохождения викторин.

---

## 🛠️ Технологический стек

| Категория | Технологии |
|---|---|
| **Фреймворк** | Next.js 16 (App Router), React 19 |
| **Язык** | TypeScript 5 |
| **Стилизация и UI** | Tailwind CSS 4, shadcn/ui, Framer Motion |
| **Управление состоянием и запросы** | Zustand, TanStack Query |
| **База данных и ORM** | Prisma ORM, SQLite |
| **ИИ-интеграция** | Groq API |
| **Среда выполнения и деплой** | Bun, Vercel |

---

## 📁 Структура проекта

```text
Daniil_Himik/
├── db/
│   └── custom.db            # Локальная база данных SQLite
├── prisma/
│   └── schema.prisma        # Схема базы данных Prisma
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── elements/    # API-маршрут для работы с элементами
│   │   │   ├── quiz/        # API-маршрут для викторины и результатов
│   │   │   └── chat/        # API-маршрут для ИИ-ассистента
│   │   ├── layout.tsx       # Корневой макет приложения
│   │   └── page.tsx         # Главная страница приложения
│   └── components/
│       └── ui/              # UI-компоненты shadcn/ui
└── ...
```

---

## 🚀 Как запустить локально

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/becta31/Daniil_Himik.git
   cd Daniil_Himik
   ```

2. **Установите зависимости:**
   ```bash
   bun install
   ```

3. **Настройте переменные окружения:**
   Создайте файл `.env` в корне проекта и укажите:
   ```env
   DATABASE_URL="file:./db/custom.db"
   GROQ_API_KEY="ваш_ключ_groq_api"
   ```

4. **Инициализируйте базу данных и сгенерируйте Prisma Client:**
   ```bash
   bun run db:push
   bun run db:generate
   ```

5. **Запустите сервер разработки:**
   ```bash
   bun run dev
   ```
   Приложение будет доступно по адресу `localhost:3000`.

---

## 🔌 API-маршруты

| Маршрут | Назначение |
|---|---|
| `/api/elements` | Получение списка химических элементов и их данных |
| `/api/quiz` | Работа с викториной и сохранение/получение результатов |
| `/api/chat` | Взаимодействие с ИИ-ассистентом «ХИМИК» (Groq API) |

---

## 👤 Автор

**becta31** — [GitHub](https://github.com/becta31)

---

## 📄 Лицензия

Этот проект распространяется под лицензией **MIT**. Подробности см. в файле [LICENSE](LICENSE).
