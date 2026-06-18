### Hexlet tests and linter status:
[![Actions Status](https://github.com/greenkerokero/ai-for-developers-project-387/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/greenkerokero/ai-for-developers-project-387/actions)

# Booking API & Frontend

Система бронирования встреч. Состоит из трёх частей:

- **TypeSpec** — API-контракт, единый источник правды (`main.tsp` → `tsp-output/openapi/openapi.yaml`)
- **Backend** — Django REST API на порту `3000` (`backend/`)
- **Frontend** — React/Vite SPA на порту `5173` (`frontend/`)

---

## Требования

| Инструмент | Версия |
|---|---|
| Node.js | 24.x (см. `.nvmrc`) |
| Python | 3.12+ |
| uv | последняя ([astral.sh/uv](https://docs.astral.sh/uv/)) |

---

## Быстрый старт (бэкенд + фронтенд)

### 1. Установка всех зависимостей

Убедитесь, что у вас установлены Node.js (v24), Python (3.12+) и uv.

```bash
# Установка зависимостей для фронтенда, бэкенда и рутового проекта
make install
```

### 2. Запуск приложения (Dev)

Для одновременного запуска бэкенда и фронтенда в режиме разработки:

```bash
make dev
```

Приложение будет доступно:
- Фронтенд: **http://localhost:5173**
- API Бэкенда: **http://localhost:3000**

---

## Запуск в Production (Docker)

Для сборки и локального запуска production-образа:

```bash
make docker-build
make docker-run
```

---

## Режимы запуска фронтенда

| Команда | Описание |
|---|---|
| `npm run dev` | Vite dev-сервер, запросы к бэкенду на `localhost:3000` |
| `npm run dev:mock` | Vite + Prism mock (статика), бэкенд не нужен |
| `npm run dev:mock:dynamic` | Vite + Prism (динамические случайные данные) |

> При `dev:mock` / `dev:mock:dynamic` — Prism запускается на порту `4010`,
> Vite проксирует на него `/owner/*` и `/public/*`.

---

## Обновление TypeScript-типов после изменения контракта

Если вы правили `.tsp`-файлы, выполните в следующем порядке:

```bash
# Перекомпилировать TypeSpec, сгенерировать типы и собрать проект
make build
```

---

## Структура проекта

```
.
├── main.tsp                  # Точка входа TypeSpec
├── models/                   # TypeSpec-модели
├── routes/                   # TypeSpec-маршруты
├── tsp-output/openapi/       # Сгенерированный openapi.yaml (не редактировать)
├── backend/                  # Django REST API
│   ├── config/               # Django-проект (settings, urls)
│   ├── booking_api/
│   │   ├── views/            # Thin views (1 файл = 1 TypeSpec-интерфейс)
│   │   ├── services/         # Бизнес-логика
│   │   ├── storage.py        # In-memory хранилище
│   │   └── serializers.py    # DRF-сериализаторы
│   ├── pyproject.toml
│   └── uv.lock
└── frontend/                 # React + Vite SPA
    └── src/
        ├── api/generated/    # TS-типы из OpenAPI (не редактировать)
        ├── pages/
        └── components/
```

---

## API эндпоинты (порт 3000)

| Метод | Путь | Описание |
|---|---|---|
| GET/PUT | `/owner/availability` | Расписание доступности |
| GET/POST | `/owner/event-types` | Типы событий |
| GET/PUT/DELETE | `/owner/event-types/{slug}` | Управление типом |
| GET | `/owner/bookings` | Список бронирований |
| GET | `/owner/bookings/{id}` | Детали бронирования |
| POST | `/owner/bookings/{id}` | Отмена бронирования |
| GET | `/public/event-types` | Публичный список типов |
| GET | `/public/event-types/{slug}` | Детали типа |
| GET | `/public/event-types/{slug}/slots` | Доступные слоты (14 дней) |
| POST | `/public/event-types/{slug}/bookings` | Создать бронирование |

Полная спецификация: [`tsp-output/openapi/openapi.yaml`](./tsp-output/openapi/openapi.yaml)

---

## E2E Тесты (Playwright)

Проект включает интеграционные тесты для проверки полного пользовательского пути:
- Создание типа события (owner)
- Настройка расписания (owner)
- Бронирование слота (public)
- Отображение и отмена брони (owner)

### Запуск E2E тестов

Вам необходимо иметь установленные Node.js и uv:
```bash
cd e2e
npm install
npx playwright install chromium

# Эта команда автоматически поднимет бэкенд на порту 3000
# и фронтенд на порту 5173, после чего запустит тесты
npx playwright test
```

> **Важно:** Бэкенд использует In-Memory хранилище. Если вы запускаете тесты локально несколько раз подряд, данные из предыдущего запуска могут привести к конфликтам (например, тип события с таким `slug` уже существует). В таком случае убедитесь, что процессы на портах `3000` и `5173` завершены:
> ```bash
> fuser -k 3000/tcp || true
> fuser -k 5173/tcp || true
> ```

---

## Conventional Commits

Все коммиты в ветку `main` (и PR) должны следовать формату [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

Допустимые типы: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `ci`, `chore`.

Это необходимо для автоматического обновления версий и создания `CHANGELOG.md` через release-please.