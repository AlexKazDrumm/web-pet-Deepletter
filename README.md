# Deepletter

Веб-инструменты для анализа документов, преобразования текста, работы с
Markdown и генерации случайных данных.

![Главная страница](docs/screenshots/home.png)

## Инструменты

| Раздел | Возможности |
| --- | --- |
| Анализ документа | статистика для `.docx`, `.txt` и `.md`, частотный список и время чтения |
| Преобразование текста | регистр, пробелы, строки, транслитерация и slug |
| Markdown → HTML | HTML, предпросмотр и копирование результата |
| Случайные данные | числа, даты и пароли с поддержкой `seed` |

Файлы анализируются в памяти. В истории сохраняются формат, размер и
рассчитанная статистика.

## Интерфейс

![Анализ документа](docs/screenshots/document-analyzer.png)

| Преобразование текста | Markdown → HTML | Случайные данные |
| --- | --- | --- |
| ![Преобразование текста](docs/screenshots/text-transform.png) | ![Markdown в HTML](docs/screenshots/markdown.png) | ![Случайные данные](docs/screenshots/randomizer.png) |

## Стек

- Next.js 16, React 19, Tailwind CSS 4, TypeScript;
- Express 5, PostgreSQL 16, `node-pg-migrate`;
- Zod, Mammoth, Helmet, Pino;
- Vitest, Testing Library, Supertest, Playwright;
- Docker Compose.

## Структура

```text
shared   типы, схемы и функции обработки текста
server   API, миграции и PostgreSQL
web      интерфейс
```

## Запуск

```powershell
Copy-Item .env.example .env
docker compose up --build
```

- приложение: http://localhost:3000
- API: http://localhost:3030

## Локальная разработка

Требуются Node.js 24 и PostgreSQL 16+.

```powershell
Copy-Item .env.example .env
npm ci
npm run build:shared
npm run migrate
npm run seed
npm run dev
```

## Конфигурация

| Переменная | Назначение |
| --- | --- |
| `DATABASE_URL` | подключение к PostgreSQL |
| `PORT` | порт API |
| `WEB_ORIGIN` | адрес клиента для CORS |
| `MAX_UPLOAD_BYTES` | максимальный размер документа |
| `NEXT_PUBLIC_API_BASE_URL` | адрес API в браузере |
| `API_BASE_URL` | адрес API для Next.js |

Полный список находится в `.env.example`.

## API

| Метод | Путь |
| --- | --- |
| `GET` | `/api/health` |
| `GET` | `/api/tools` |
| `POST` | `/api/documents/analyze` |
| `GET` | `/api/documents/analyses?limit=N` |

## Команды

```powershell
npm test
npm run format:check
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```
