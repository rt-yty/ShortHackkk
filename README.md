# X5 Tech Career Day

Интерактивная платформа для карьерного дня X5 Tech. Включает тестирование, мини-игры, систему призов и подачу заявок.

## 🛠 Технологии

**Backend:**
- FastAPI + SQLAlchemy 2.0 (async)
- PostgreSQL + Alembic
- JWT аутентификация
- Docker

**Frontend:**
- React 18 + Vite
- React Router 6
- Zustand (state management)
- Framer Motion (анимации)

## 🚀 Быстрый старт (Docker)

Самый простой способ запустить весь проект:

```bash
# 1. Клонировать репозиторий
git clone <repository-url>
cd ShortHackkk

# 2. Перейти в backend и настроить окружение
cd backend
cp env.example .env

# 3. Запустить backend + PostgreSQL через Docker
docker-compose up -d

# 4. Применить миграции БД
docker-compose exec backend alembic upgrade head

# 5. Загрузить начальные данные (призы, вопросы, админ)
docker-compose exec backend python -m app.services.seed

# 6. Вернуться в корень и запустить frontend
cd ../frontend
npm install
npm run dev
```

После запуска:
- 🌐 **Frontend:** http://localhost:5173
- 🔧 **Backend API:** http://localhost:8000
- 📚 **Swagger UI:** http://localhost:8000/docs
- 🔑 **Админ-панель:** http://localhost:5173/admin/login

## 📋 Подробная инструкция

### Backend

#### Вариант 1: Docker (рекомендуется)

```bash
cd backend

# Скопировать конфигурацию
cp env.example .env

# Запустить сервисы (PostgreSQL + Backend)
docker-compose up -d

# Применить миграции
docker-compose exec backend alembic upgrade head

# Загрузить начальные данные
docker-compose exec backend python -m app.services.seed
```

#### Вариант 2: Локальная разработка

```bash
cd backend

# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate      # Linux/Mac
# или
.\venv\Scripts\activate       # Windows

# Установить зависимости
pip install -r requirements.txt

# Настроить переменные окружения
cp env.example .env
# Отредактировать .env (указать свою БД PostgreSQL)

# Применить миграции
alembic upgrade head

# Загрузить начальные данные
python -m app.services.seed

# Запустить сервер
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend

# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev

# Или для production сборки
npm run build
npm run preview
```

## 🔑 Учетные данные по умолчанию

После выполнения seed-скрипта будет создан администратор:

| Роль | Email | Пароль |
|------|-------|--------|
| Admin | admin@x5.ru | admin |

## 🗂 Структура проекта

```
ShortHackkk/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/v1/          # API эндпоинты
│   │   ├── core/            # Конфигурация, БД, безопасность
│   │   ├── models/          # SQLAlchemy модели
│   │   ├── schemas/         # Pydantic схемы
│   │   └── services/        # Бизнес-логика
│   ├── alembic/             # Миграции БД
│   ├── uploads/             # Загруженные файлы
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── requirements.txt
│
└── frontend/                 # React frontend
    ├── src/
    │   ├── api/             # API клиент
    │   ├── components/      # UI компоненты
    │   ├── pages/           # Страницы приложения
    │   ├── stores/          # Zustand stores
    │   └── styles/          # Глобальные стили
    ├── package.json
    └── vite.config.js
```

## 🌐 API Endpoints

### Аутентификация
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/login/json` - Вход (JSON)
- `POST /api/v1/auth/refresh` - Обновление токена

### Пользователи
- `GET /api/v1/users/me` - Профиль текущего пользователя
- `GET /api/v1/users/me/progress` - Прогресс пользователя

### Тестирование
- `GET /api/v1/test/questions` - Получить вопросы теста
- `POST /api/v1/test/complete` - Завершить тест
- `POST /api/v1/test/set-direction` - Выбрать направление

### Игры
- `POST /api/v1/games/complete` - Завершить игру

### Призы
- `GET /api/v1/prizes` - Список доступных призов
- `POST /api/v1/prizes/{id}/claim` - Получить приз

### Заявки
- `POST /api/v1/applications` - Подать заявку
- `GET /api/v1/applications/me` - Моя заявка

### Админ-панель
- `GET /api/v1/admin/analytics` - Аналитика
- `GET /api/v1/admin/users` - Список пользователей
- `CRUD /api/v1/admin/prizes` - Управление призами
- `CRUD /api/v1/admin/questions` - Управление вопросами

## ⚙️ Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| DATABASE_URL | URL подключения к PostgreSQL | postgresql+asyncpg://postgres:postgres@localhost:5432/x5_career |
| SECRET_KEY | Секретный ключ для JWT | your-super-secret-key |
| CORS_ORIGINS | Разрешенные origins | http://localhost:5173,http://localhost:3000 |
| DEBUG | Режим отладки | True |

## 🛠 Полезные команды

```bash
# Остановить Docker контейнеры
cd backend && docker-compose down

# Посмотреть логи backend
docker-compose logs -f backend

# Запустить с pgAdmin (инструмент для работы с БД)
docker-compose --profile tools up -d
# pgAdmin доступен на http://localhost:5050 (admin@x5.ru / admin)

# Создать новую миграцию (после изменения моделей)
docker-compose exec backend alembic revision --autogenerate -m "description"
```

## 📝 Лицензия

MIT
