<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

# 🚀 X5 Tech Career Day

<p align="center">
  <strong>Интерактивная платформа для карьерного дня X5 Tech</strong>
</p>

<p align="center">
  Геймифицированный портал для привлечения молодых специалистов с профориентационным тестированием, мини-играми, системой призов и подачей заявок на стажировку.
</p>

---

## 📋 Содержание

- [О проекте](#-о-проекте)
- [Функциональность](#-функциональность)
- [Технологический стек](#-технологический-стек)
- [Архитектура](#-архитектура)
- [Быстрый старт](#-быстрый-старт)
- [Подробная установка](#-подробная-установка)
- [API документация](#-api-документация)
- [База данных](#-база-данных)
- [Переменные окружения](#️-переменные-окружения)
- [Полезные команды](#-полезные-команды)
- [Структура проекта](#-структура-проекта)
- [Лицензия](#-лицензия)

---

## 🎯 О проекте

**X5 Tech Career Day** — это современная веб-платформа, разработанная для проведения карьерных мероприятий X5 Tech. Платформа использует геймификацию для вовлечения потенциальных кандидатов и помогает им определиться с профессиональным направлением.

### Ключевые особенности

- 🎮 **Геймификация** — система баллов, достижений и призов
- 📊 **Профориентация** — интерактивный тест для определения направления (Developer/Designer)
- 🎲 **Мини-игры** — уникальные игры для каждого направления
- 📝 **Подача заявок** — полноценная форма с загрузкой резюме
- 👨‍💼 **Админ-панель** — управление контентом, аналитика, экспорт данных

---

## ✨ Функциональность

### Для пользователей

| Функция | Описание | Баллы |
|---------|----------|-------|
| 📝 **Профориентационный тест** | 6 вопросов для определения направления (Разработчик/Дизайнер) | +15 |
| 🎮 **Мини-игра** | Bug Catcher (для разработчиков) или Color Match (для дизайнеров) | +25 |
| 📄 **Заявка на стажировку** | Форма с ФИО, контактами, мотивацией и резюме | +35 |
| 🎁 **Получение призов** | Обмен накопленных баллов на призы | — |

### Для администраторов

| Функция | Описание |
|---------|----------|
| 📊 **Аналитика** | Статистика регистраций, тестов, игр, заявок |
| 👥 **Пользователи** | Список зарегистрированных участников |
| 📄 **Заявки** | Просмотр и скачивание заявок с резюме |
| 🎁 **Призы** | CRUD операции для управления призами |
| 📝 **Тесты** | Управление вопросами профориентационного теста |
| ⚙️ **Настройки** | Название мероприятия, приветственный текст |
| 📥 **Экспорт** | Выгрузка данных в Excel |

---

## 🛠 Технологический стек

### Backend

| Технология | Версия | Назначение |
|------------|--------|------------|
| [FastAPI](https://fastapi.tiangolo.com/) | 0.115 | Современный асинхронный веб-фреймворк |
| [SQLAlchemy](https://www.sqlalchemy.org/) | 2.0 | ORM с полной async поддержкой |
| [PostgreSQL](https://www.postgresql.org/) | 16 | Реляционная СУБД |
| [Alembic](https://alembic.sqlalchemy.org/) | 1.14 | Миграции базы данных |
| [Pydantic](https://docs.pydantic.dev/) | 2.x | Валидация данных и сериализация |
| [python-jose](https://github.com/mpdavis/python-jose) | 3.3 | JWT токены |
| [passlib](https://passlib.readthedocs.io/) | 1.7 | Хеширование паролей (bcrypt) |
| [Docker](https://www.docker.com/) | — | Контейнеризация |

### Frontend

| Технология | Версия | Назначение |
|------------|--------|------------|
| [React](https://react.dev/) | 18.3 | UI библиотека |
| [Vite](https://vitejs.dev/) | 5.4 | Сборщик и dev-сервер |
| [React Router](https://reactrouter.com/) | 6.22 | Маршрутизация |
| [Zustand](https://github.com/pmndrs/zustand) | 4.5 | State management |
| [Framer Motion](https://www.framer.com/motion/) | 11.0 | Анимации |
| [xlsx](https://sheetjs.com/) | 0.18 | Экспорт в Excel |

---

## 🏗 Архитектура

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   React SPA     │────▶│   FastAPI       │────▶│   PostgreSQL    │
│   (Frontend)    │     │   (Backend)     │     │   (Database)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
     :5173                   :8000                   :5432
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         │              │   File Storage  │
         └─────────────▶│   (uploads/)    │
                        └─────────────────┘
```

### Модели данных

```
User ──────────┬──────── UserProgress (1:1)
               ├──────── ClaimedPrize (1:N) ──── Prize
               └──────── Application (1:1)

TestQuestion ─── вопросы профориентационного теста
EventSettings ─── глобальные настройки мероприятия
```

---

## 🚀 Быстрый старт

### Предварительные требования

- [Docker](https://docs.docker.com/get-docker/) и [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) 18+ (для frontend)
- [Git](https://git-scm.com/)

### Запуск за 5 минут

```bash
# 1. Клонировать репозиторий
git clone https://github.com/your-username/ShortHackkk.git
cd ShortHackkk

# 2. Запустить backend (PostgreSQL + FastAPI)
cd backend
cp env.example .env
docker-compose up -d

# 3. Применить миграции и загрузить начальные данные
docker-compose exec backend alembic upgrade head
docker-compose exec backend python -m app.services.seed

# 4. Запустить frontend
cd ../frontend
npm install
npm run dev
```

### Доступ к приложению

| Сервис | URL | Описание |
|--------|-----|----------|
| 🌐 Frontend | http://localhost:5173 | Основной интерфейс |
| 🔧 Backend API | http://localhost:8000 | REST API |
| 📚 Swagger UI | http://localhost:8000/docs | Интерактивная документация |
| 🔑 Админ-панель | http://localhost:5173/admin-login | Вход для администраторов |

### Учетные данные по умолчанию

| Роль | Email | Пароль |
|------|-------|--------|
| Администратор | admin@x5.ru | admin |


## 📡 API документация

### Аутентификация

```http
POST /api/v1/auth/register       # Регистрация пользователя
POST /api/v1/auth/login/json     # Вход (JSON body)
POST /api/v1/auth/login          # Вход (form-data, OAuth2)
POST /api/v1/auth/refresh        # Обновление access токена
```

### Пользователи

```http
GET  /api/v1/users/me              # Профиль текущего пользователя
GET  /api/v1/users/me/progress     # Прогресс (баллы, выполненные задания)
GET  /api/v1/users/me/claimed-prizes # Полученные призы
```

### Тестирование

```http
GET  /api/v1/test/questions        # Получить вопросы теста
POST /api/v1/test/complete         # Завершить тест с ответами
POST /api/v1/test/skip             # Пропустить тест
POST /api/v1/test/set-direction    # Установить направление вручную
```

### Игры

```http
POST /api/v1/games/complete        # Завершить игру (отправить результат)
```

### Призы

```http
GET  /api/v1/prizes                # Список доступных призов
POST /api/v1/prizes/{id}/claim     # Получить приз
```

### Заявки

```http
POST /api/v1/applications          # Подать заявку на стажировку
GET  /api/v1/applications/me       # Получить свою заявку
```

### Админ-панель (требует `is_admin=true`)

```http
# Аналитика
GET  /api/v1/admin/analytics       # Статистика мероприятия
GET  /api/v1/admin/users           # Список пользователей
GET  /api/v1/admin/applications    # Все заявки
GET  /api/v1/admin/applications/{id}/resume # Скачать резюме

# Настройки
GET  /api/v1/admin/settings        # Получить настройки
PATCH /api/v1/admin/settings       # Обновить настройки

# Призы
GET    /api/v1/admin/prizes        # Список призов
POST   /api/v1/admin/prizes        # Создать приз
PUT    /api/v1/admin/prizes/{id}   # Обновить приз
DELETE /api/v1/admin/prizes/{id}   # Удалить приз

# Тестовые вопросы
GET    /api/v1/admin/questions     # Список вопросов
POST   /api/v1/admin/questions     # Создать вопрос
PUT    /api/v1/admin/questions/{id} # Обновить вопрос
DELETE /api/v1/admin/questions/{id} # Удалить вопрос
```

> 📚 Полная интерактивная документация доступна на http://localhost:8000/docs

---

## 🗄 База данных

### Схема таблиц

```sql
-- Пользователи
users
├── id (PK)
├── email (UNIQUE)
├── hashed_password
├── is_admin
├── is_active
└── created_at

-- Прогресс пользователя
user_progress
├── id (PK)
├── user_id (FK → users)
├── points
├── completed_test
├── completed_game
├── test_result (developer/designer)
└── applied_for_internship

-- Призы
prizes
├── id (PK)
├── name
├── points
├── quantity
└── description

-- Полученные призы
claimed_prizes
├── id (PK)
├── user_id (FK → users)
├── prize_id (FK → prizes)
└── claimed_at

-- Заявки на стажировку
applications
├── id (PK)
├── user_id (FK → users)
├── full_name
├── email
├── phone
├── direction
├── motivation
├── resume_path
└── created_at

-- Вопросы теста
test_questions
├── id (PK)
├── question
├── options (JSON)
└── order

-- Настройки мероприятия
event_settings
├── id (PK)
├── event_name
└── welcome_text
```

### Работа с миграциями

```bash
# Создать новую миграцию (после изменения моделей)
docker-compose exec backend alembic revision --autogenerate -m "Описание изменений"

# Применить все миграции
docker-compose exec backend alembic upgrade head

# Откатить последнюю миграцию
docker-compose exec backend alembic downgrade -1

# Посмотреть историю миграций
docker-compose exec backend alembic history
```

---

## ⚙️ Переменные окружения

### Backend (.env)

| Переменная | Описание | Значение по умолчанию |
|------------|----------|----------------------|
| `DATABASE_URL` | URL подключения к PostgreSQL | `postgresql+asyncpg://postgres:postgres@localhost:5432/x5_career` |
| `SECRET_KEY` | Секретный ключ для JWT | `your-super-secret-key` |
| `ALGORITHM` | Алгоритм подписи JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Время жизни access токена (минуты) | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Время жизни refresh токена (дни) | `7` |
| `CORS_ORIGINS` | Разрешённые origins (через запятую) | `http://localhost:5173,http://localhost:3000` |
| `UPLOAD_DIR` | Директория для загрузок | `./uploads` |
| `MAX_UPLOAD_SIZE` | Макс. размер файла (байты) | `5242880` (5MB) |
| `DEBUG` | Режим отладки | `True` |

### Пример .env файла

```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/x5_career

# Security
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Uploads
UPLOAD_DIR=/app/uploads
MAX_UPLOAD_SIZE=5242880

# Debug
DEBUG=false
```

---

## 🔧 Полезные команды

### Docker

```bash
# Запустить все сервисы
docker-compose up -d

# Остановить все сервисы
docker-compose down

# Остановить и удалить volumes (⚠️ удалит данные БД)
docker-compose down -v

# Посмотреть логи
docker-compose logs -f              # все сервисы
docker-compose logs -f backend      # только backend
docker-compose logs -f postgres     # только postgres

# Перезапустить сервис
docker-compose restart backend

# Войти в контейнер
docker-compose exec backend bash
docker-compose exec postgres psql -U postgres -d x5_career

# Запустить с pgAdmin
docker-compose --profile tools up -d
```


## 📁 Структура проекта

```
ShortHackkk/
├── backend/                        # 🔧 FastAPI Backend
│   ├── alembic/                    # Миграции базы данных
│   │   ├── versions/               # Файлы миграций
│   │   └── env.py                  # Конфигурация Alembic
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py             # Зависимости (auth, db session)
│   │   │   └── v1/                 # API версии 1
│   │   │       ├── admin.py        # Админ эндпоинты
│   │   │       ├── applications.py # Заявки
│   │   │       ├── auth.py         # Аутентификация
│   │   │       ├── games.py        # Игры
│   │   │       ├── prizes.py       # Призы
│   │   │       ├── test.py         # Тестирование
│   │   │       └── users.py        # Пользователи
│   │   ├── core/
│   │   │   ├── config.py           # Pydantic Settings
│   │   │   ├── database.py         # Async SQLAlchemy
│   │   │   └── security.py         # JWT, bcrypt
│   │   ├── models/                 # SQLAlchemy модели
│   │   │   ├── user.py
│   │   │   ├── user_progress.py
│   │   │   ├── prize.py
│   │   │   ├── claimed_prize.py
│   │   │   ├── application.py
│   │   │   ├── test_question.py
│   │   │   └── event_settings.py
│   │   ├── schemas/                # Pydantic схемы
│   │   ├── services/               # Бизнес-логика
│   │   │   └── seed.py             # Начальные данные
│   │   └── main.py                 # FastAPI приложение
│   ├── uploads/                    # Загруженные файлы (резюме)
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── requirements.txt
│   └── README.md
│
├── frontend/                       # 🎨 React Frontend
│   ├── public/                     # Статические файлы
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js              # API клиент
│   │   ├── components/
│   │   │   ├── layout/             # Header, Layout
│   │   │   ├── ui/                 # Button, Card, Input, Modal
│   │   │   ├── AdminRoute.jsx      # Protected route для админов
│   │   │   └── ProtectedRoute.jsx  # Protected route для юзеров
│   │   ├── pages/
│   │   │   ├── admin/              # Админ-панель
│   │   │   ├── application/        # Форма заявки
│   │   │   ├── auth/               # Авторизация
│   │   │   ├── dashboard/          # Главная страница
│   │   │   ├── games/              # Мини-игры
│   │   │   ├── rewards/            # Призы
│   │   │   └── test/               # Профориентационный тест
│   │   ├── stores/                 # Zustand stores
│   │   │   ├── adminStore.js       # Состояние админ-панели
│   │   │   ├── analyticsStore.js   # Аналитика
│   │   │   └── userStore.js        # Состояние пользователя
│   │   ├── styles/
│   │   │   ├── global.css          # Глобальные стили
│   │   │   └── variables.css       # CSS переменные
│   │   ├── App.jsx                 # Главный компонент
│   │   └── main.jsx                # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md                       # 📖 Этот файл
```

---

## 🎮 Мини-игры

### Bug Catcher (для разработчиков)

Игра на ловкость, где нужно «ловить» баги (жуков), появляющиеся на экране. Чем больше багов поймано за отведённое время — тем выше результат.

### Color Match (для дизайнеров)

Игра на внимательность к цветам. Нужно правильно сопоставить цвета или угадать оттенки. Тренирует цветовосприятие и развивает навыки, важные для дизайнера.

---

## 🔐 Безопасность

- **Пароли** хешируются с использованием bcrypt
- **JWT токены** с коротким временем жизни access токена (30 мин) и долгим refresh токена (7 дней)
- **CORS** настроен на конкретные origins
- **Валидация** всех входящих данных через Pydantic
- **SQL-инъекции** предотвращаются через SQLAlchemy ORM
- **Загрузки файлов** ограничены по размеру (5MB) и хранятся в отдельной директории

---

## 📝 Лицензия

MIT License