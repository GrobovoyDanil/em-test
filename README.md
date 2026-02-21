# Тестовое задание: User Management API

### Запуск проекта

1. Подготовить окружение: Создайте файл .env на основе .env.example
2. Поднять базу данных: `docker-compose up -d`
3. Установить зависимости: `npm install`
4. Выполнить миграции: `npx prisma migrate dev`
5. Запустить сервер: `npm run dev`

### Технологии

- Node.js + Express
- TypeScript
- Prisma (PostgreSQL)
- JWT (Access & Refresh tokens)
- Zod (Validation)
- Bcrypt (Hashing)

### Основные эндпоинты

- POST /api/register — регистрация.
- POST /api/login — вход и получение токенов.
- POST /api/refresh — обновление токенов.
- GET /api/users — список пользователей (только для админов).
- GET /api/users/:id — профиль пользователя (админ или владелец).
- PATCH /api/users/:id/toggle — блокировка (админ или сам пользователь).
