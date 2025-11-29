# X5 Tech Career Day - Backend

FastAPI backend с асинхронной поддержкой PostgreSQL через SQLAlchemy 2.0.

## Технологии

- **FastAPI** - современный веб-фреймворк
- **SQLAlchemy 2.0** - ORM с асинхронной поддержкой
- **PostgreSQL** - база данных (asyncpg драйвер)
- **Alembic** - миграции БД
- **JWT** - аутентификация (access + refresh tokens)
- **Docker** - контейнеризация

## Быстрый старт с Docker

```bash
# Скопировать конфигурацию
cp env.example .env

# Запустить сервисы
docker-compose up -d

# Применить миграции
docker-compose exec backend alembic upgrade head

# Загрузить начальные данные
docker-compose exec backend python -m app.services.seed
```

После запуска:
- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- pgAdmin: http://localhost:5050 (admin@x5.ru / admin) - запуск с профилем tools

```bash
# Запуск с pgAdmin
docker-compose --profile tools up -d
```

## Локальная разработка

```bash
# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
.\venv\Scripts\activate  # Windows

# Установить зависимости
pip install -r requirements.txt

# Настроить переменные окружения
cp env.example .env
# Отредактировать .env

# Создать миграции (после изменения моделей)
alembic revision --autogenerate -m "description"

# Применить миграции
alembic upgrade head

# Загрузить начальные данные
python -m app.services.seed

# Запустить сервер
uvicorn app.main:app --reload
```

## Структура проекта

```
backend/
├── alembic/                # Миграции БД
│   ├── versions/           # Файлы миграций
│   └── env.py              # Конфигурация Alembic
├── app/
│   ├── api/
│   │   ├── deps.py         # Зависимости (auth, db session)
│   │   └── v1/             # API v1 эндпоинты
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── test.py
│   │       ├── games.py
│   │       ├── prizes.py
│   │       ├── applications.py
│   │       └── admin.py
│   ├── core/
│   │   ├── config.py       # Pydantic Settings
│   │   ├── database.py     # Async SQLAlchemy
│   │   └── security.py     # JWT, bcrypt
│   ├── models/             # SQLAlchemy модели
│   ├── schemas/            # Pydantic схемы
│   ├── services/           # Бизнес-логика
│   └── main.py             # FastAPI приложение
├── uploads/                # Загруженные файлы
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/login` - Логин (form-data)
- `POST /api/v1/auth/login/json` - Логин (JSON)
- `POST /api/v1/auth/refresh` - Обновление токена

### Users
- `GET /api/v1/users/me` - Профиль
- `GET /api/v1/users/me/progress` - Прогресс
- `GET /api/v1/users/me/claimed-prizes` - Полученные призы

### Test
- `GET /api/v1/test/questions` - Вопросы теста
- `POST /api/v1/test/complete` - Завершить тест
- `POST /api/v1/test/skip` - Пропустить тест
- `POST /api/v1/test/set-direction` - Установить направление

### Games
- `POST /api/v1/games/complete` - Завершить игру

### Prizes
- `GET /api/v1/prizes` - Список призов
- `POST /api/v1/prizes/{id}/claim` - Получить приз

### Applications
- `POST /api/v1/applications` - Подать заявку
- `GET /api/v1/applications/me` - Моя заявка

### Admin (требует is_admin=true)
- `GET /api/v1/admin/analytics` - Аналитика
- `GET /api/v1/admin/users` - Список пользователей
- `GET /api/v1/admin/applications` - Все заявки
- `GET/PATCH /api/v1/admin/settings` - Настройки
- `GET/POST/PUT/DELETE /api/v1/admin/prizes` - CRUD призов
- `GET/POST/PUT/DELETE /api/v1/admin/questions` - CRUD вопросов

## Учетные данные по умолчанию

После выполнения seed-скрипта:
- **Admin**: admin@x5.ru / admin

## Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| DATABASE_URL | URL подключения к PostgreSQL | postgresql+asyncpg://postgres:postgres@localhost:5432/x5_career |
| SECRET_KEY | Секретный ключ для JWT | your-super-secret-key |
| ALGORITHM | Алгоритм JWT | HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Время жизни access токена | 30 |
| REFRESH_TOKEN_EXPIRE_DAYS | Время жизни refresh токена | 7 |
| CORS_ORIGINS | Разрешенные origins | http://localhost:5173,http://localhost:3000 |
| UPLOAD_DIR | Директория для загрузок | ./uploads |
| MAX_UPLOAD_SIZE | Макс. размер файла | 5242880 (5MB) |
| DEBUG | Режим отладки | True |

