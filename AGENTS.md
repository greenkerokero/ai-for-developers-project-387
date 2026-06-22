# AGENTS.md — Booking API (Full-Stack)

> Инструкции для AI-агентов. Единый источник правды: TypeSpec (`.tsp`) → `tsp-output/openapi/openapi.yaml`.

---

## 1. Design-First (TypeSpec) — КРИТИЧЕСКИ ВАЖНО

Проект разрабатывается по методологии **Design-First**. Любое изменение API начинается с TypeSpec.

- **Порядок изменений в API:**
  1. Внеси правки в `.tsp`-файлы (`models/`, `routes/`).
  2. `npm run compile` (корень проекта) → генерирует `tsp-output/openapi/openapi.yaml`.
  3. `npm run generate:api` (папка `frontend/`) → обновляет `src/api/generated/openapi.d.ts`.
  4. Реализуй логику на бэкенде и фронтенде.
- **Ручные правки в `openapi.yaml` и `openapi.d.ts` запрещены** — будут перезаписаны.
- **Перед написанием кода** опиши план. Если задача затрагивает API — начни с TypeSpec.

## 2. Общие правила

- Не делай коммит, пока об этом явно не укажут
- Исправляй причину, а не следствие
- Минимум ручной реализации — используй готовые библиотеки (в проекте и на GitHub)
- Минимум ручных типов — максимум из API (генерируемые типы/схемы)
- Код должен быть **статически типизированным** (TypeScript `strict`, Python type hints)
- Пиши тесты только когда просят; только позитивные сценарии, интеграционные; проверяй код возврата и данные
- Нельзя создавать обычные методы (не экшены) в контроллерах / views — выноси в сервис
- Разделяй получение и использование: получил → записал в переменную → передал дальше
- Если видишь изменения, которые ты не делал, игнорируй их
- Переменные окружения через `.env` / `os.environ` / `import.meta.env`. Никаких захардкоженных секретов

## 3. Стек

### Фронтенд

TypeScript (strict) · Vite · React 18 · React Router v6 · shadcn/ui (Radix + Tailwind CSS) ·
TanStack Query v5 · openapi-typescript + openapi-fetch · Zod + react-hook-form ·
Prism + concurrently · Vitest + RTL + MSW · ESLint + Prettier · sonner

### Бэкенд

Python 3.10+ · uv · Django 5 · Django REST Framework · django-cors-headers ·
In-memory storage (dict/list) · uuid · `ruff` + `black`

Сервер бэкенда: `http://localhost:3000` (зафиксировано в TypeSpec).
Сервер фронтенда: `http://localhost:5173` (Vite dev).

## 4. Структура проекта

### `frontend/src/`

```
src/
├── api/
│   ├── generated/openapi.d.ts   # НЕ редактировать — генерируется скриптом
│   ├── client.ts                # настроенный openapi-fetch
│   ├── query-keys.ts            # фабрика ключей TanStack Query
│   ├── *.queries.ts             # useQuery-хуки (booking, event-type, slot…)
│   └── *.mutations.ts           # useMutation-хуки
├── components/
│   ├── ui/                      # shadcn/ui (устанавливать через CLI)
│   └── layout/                  # PublicLayout, OwnerLayout
├── hooks/                       # use-pagination.ts, use-debounce.ts
├── lib/                         # utils.ts, formatters.ts, validators.ts (Zod)
└── pages/
    ├── public/                  # event-types-page, event-type-detail-page, booking-page
    └── owner/                   # dashboard-page, event-types-page, event-type-form-page,
                                 # event-type-edit-page, availability-page
```

### `backend/`

```
backend/
├── manage.py
├── config/                      # Django-проект (settings, urls, wsgi)
│   ├── settings.py
│   └── urls.py
├── booking_api/                 # Django-приложение
│   ├── views/                   # Тонкие views — только маппинг запрос/ответ
│   │   ├── owner_availability.py
│   │   ├── owner_bookings.py
│   │   ├── owner_event_types.py
│   │   ├── public_bookings.py
│   │   └── public_event_types.py
│   ├── services/                # Бизнес-логика
│   │   ├── availability_service.py
│   │   ├── booking_service.py
│   │   ├── event_type_service.py
│   │   └── slot_service.py
│   ├── storage.py               # In-memory хранилище (единственный модуль данных)
│   ├── serializers.py           # DRF-сериализаторы — валидация по контракту
│   └── urls.py                  # Маршрутизация API
├── pyproject.toml               # Зависимости и настройки проекта (uv)
└── uv.lock                      # Lockfile (uv) — коммитится в git
```

## 5. Контракт API — соответствие СТРОГО

Реализация (и бэкенд, и фронтенд) должна **один-в-один** соответствовать `openapi.yaml`:

| Аспект | Требование |
|---|---|
| **Пути** | Точные пути из спецификации: `/owner/...`, `/public/...` |
| **HTTP-методы** | GET, POST, PUT, DELETE — как в TypeSpec-интерфейсах |
| **Статус-коды** | `200` (чтение/обновление), `201` (создание), `204` (удаление), `default` (ошибки) |
| **Тело ответа** | Структура, имена полей (**camelCase**), типы — из `components.schemas` |
| **Тело ошибки** | `ApiError { code, message, details? }` — единая модель |
| **Пагинация** | `PaginatedList { items, totalCount, offset, limit }` — для owner-листингов |
| **Query-параметры** | `offset`, `limit`, `status`, `date` — как в spec |

### Эндпоинты

| Метод | Путь | Operation ID |
|---|---|---|
| GET | `/owner/availability` | `OwnerAvailability_get` |
| PUT | `/owner/availability` | `OwnerAvailability_update` |
| GET | `/owner/bookings` | `OwnerBookings_list` |
| GET | `/owner/bookings/{id}` | `OwnerBookings_read` |
| POST | `/owner/bookings/{id}` | `OwnerBookings_cancel` |
| GET | `/owner/event-types` | `OwnerEventTypes_list` |
| POST | `/owner/event-types` | `OwnerEventTypes_create` |
| GET | `/owner/event-types/{slug}` | `OwnerEventTypes_read` |
| PUT | `/owner/event-types/{slug}` | `OwnerEventTypes_update` |
| DELETE | `/owner/event-types/{slug}` | `OwnerEventTypes_delete` |
| GET | `/public/event-types` | `PublicEventTypes_list` |
| GET | `/public/event-types/{slug}` | `PublicEventTypes_read` |
| GET | `/public/event-types/{slug}/slots` | `PublicEventTypes_listSlots` |
| POST | `/public/event-types/{slug}/bookings` | `PublicBookings_create` |

### Валидация (из TypeSpec — дублируется на бэкенде и фронтенде)

| Поле | Ограничение |
|---|---|
| `slug` | `@pattern("^[a-z0-9]+(?:-[a-z0-9]+)*$")` |
| `email` | `@format("email")` |
| `id` | `@format("uuid")` |
| `name` (EventType) | `@maxLength(100)` |
| `description` (EventType) | `@maxLength(500)` |
| `durationMinutes` | `@minValue(5)`, `@maxValue(480)` |
| `guestName` | `@maxLength(100)` |
| `guestComment` | `@maxLength(500)` |

При невалидных данных — ответ `ApiError` с `code` и `message`.

## 6. Бэкенд — архитектура и правила

### Thin Views, Fat Services

- Views отвечают **только** за маппинг HTTP-запроса на вызов сервиса и формирование HTTP-ответа.
- Бизнес-логика — в `services/`. Один view-файл = один интерфейс из TypeSpec.

### In-memory хранилище

- Данные хранятся в `storage.py` как глобальные структуры (dict/list). Django ORM и миграции **не используются**.
- После перезапуска сервера данные сбрасываются — ожидаемое поведение.
- Потокобезопасность: `threading.Lock` для мутаций при необходимости.

```python
# storage.py
event_types: dict[str, dict] = {}       # slug → EventType
bookings: dict[str, dict] = {}           # id (uuid) → Booking
availability_rules: list[dict] = []      # AvailabilityRule[]
```

### Бизнес-правила бронирования (реализуются в `services/`)

1. **Слот уже занят:** При `PublicBookings_create` проверяй, что `startTime` не пересекается с существующим `confirmed`-бронированием. Слот занят при перекрытии с **любым** бронированием (независимо от event type). Конфликт → `ApiError { code: "slot_unavailable" }`.
2. **Вычисление слотов:** `PublicEventTypes_listSlots` — на лету из `AvailabilitySchedule` минус существующие бронирования. Период — 14 дней вперёд. Поддержка `?date=YYYY-MM-DD`.
3. **Отмена:** `OwnerBookings_cancel` — статус → `cancelled`, слот снова доступен.
4. **Не найдено:** Несуществующий `slug` или `id` → `ApiError` с HTTP 404.

### Интеграция с фронтендом

- **CORS:** `django-cors-headers` разрешает `http://localhost:5173`.
- **JSON camelCase:** Ответы в camelCase (как в OpenAPI). Использовать `djangorestframework-camel-case` или маппинг в сериализаторах.
- **Аутентификация:** На текущем этапе **отсутствует** (в TypeSpec нет `@useAuth`). CSRF отключён для API. Когда потребуется auth — сначала добавить в TypeSpec.

### Стиль кода Python

- **PEP 8**, совместимость с `black` (line length 88) и `ruff`
- **Type hints обязательны** для всех аргументов и возвращаемых значений
- **Без `Any`** — используй `Union`, `Optional`, `TypedDict`, `dict[str, ...]`
- **Docstrings** для публичных функций сервисов

## 7. Фронтенд — кодогенерация и клиент

После изменений TypeSpec → OpenAPI: `npm run generate:api`
(`openapi-typescript ../tsp-output/openapi/openapi.yaml -o src/api/generated/openapi.d.ts`).

API-клиент: `createClient<paths>({ baseUrl: import.meta.env.VITE_API_URL ?? "" })`.
`VITE_API_URL` — пусто при `dev:mock` (Vite proxy), URL бэкенда в остальных режимах.

### Mock-сервер (Prism)

`npm run dev:mock` — Prism (статика) + Vite. `npm run dev:mock:dynamic` — динамические данные.
Vite проксирует `/owner/*` и `/public/*` на `http://localhost:4010`.

### Маршруты

| Путь | Компонент |
|---|---|
| `/` | EventTypesPage |
| `/:slug` | EventTypeDetailPage |
| `/:slug/book` | BookingPage |
| `/owner` | DashboardPage |
| `/owner/event-types` | OwnerEventTypesPage |
| `/owner/event-types/new` | EventTypeFormPage |
| `/owner/event-types/:slug/edit` | EventTypeEditPage |
| `/owner/availability` | AvailabilityPage |

Публичные → `<PublicLayout>`, owner → `<OwnerLayout>`. `QueryClientProvider` в `App.tsx` (`staleTime: 5 min`, `retry: 1`).

### Паттерны API

Query-хук: `useQuery({ queryKey: queryKeys.X.list(params), queryFn: async () => { const { data, error } = await apiClient.GET("..."); if (error) throw error; return data; } })`.
Mutation-хук: `useMutation` + `queryClient.invalidateQueries` в `onSuccess`.

| Мутация | Инвалидируемые ключи |
|---|---|
| Создание/обновление/удаление EventType | `queryKeys.eventTypes.all` |
| Создание Booking | `queryKeys.slots.byEventType(slug)` + `queryKeys.bookings.all` |
| Отмена Booking | `queryKeys.bookings.all` + `queryKeys.slots.all` |
| Обновление Availability | `queryKeys.availability.all` + `queryKeys.slots.all` |

### Формы и ошибки

Формы: Zod-схема в `src/lib/validators.ts` → `useForm<T>({ resolver: zodResolver(schema) })` → shadcn `<Form>`.
Типы — `z.infer<typeof schema>`, не дублировать вручную.

Ошибки: middleware в `client.ts` — `toast.error` при `status >= 500`;
`<ErrorBoundary>` на уровне layout-групп; не подавлять ошибки TanStack Query.

### TypeScript

- `strict: true` обязателен; рекомендуется `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- Без `any` — `unknown` + narrowing; явный комментарий при исключении
- Явные return types у API-функций, хуков и утилит верхнего уровня
- `as const` для query-key кортежей; не кастовать `as T` там, где тип выводится
- Типы из `openapi.d.ts` — `components["schemas"]["X"]`, не дублировать вручную
- Discriminated unions вместо boolean-флагов и опциональных полей
- `type` для union/intersection, `interface` для расширяемых объектов
- Всегда `import type { … }` для импортов типов

## 8. Именование

| Сущность | Стиль |
|---|---|
| **Общее** | |
| URL-пути API | kebab-case (из TypeSpec) |
| Conventional commits | обязательны |
| **Фронтенд** | |
| Файлы компонентов | kebab-case `.tsx` |
| Экспорт компонентов | PascalCase, named export |
| Хуки | `use-*` файл / `use*` экспорт |
| API-файлы | `resource.queries.ts` / `.mutations.ts` |
| Страницы | `name-page.tsx` / `NamePage` |
| Zod-схемы | `camelCaseSchema` |
| Query keys | `queryKeys.scope.action()` |
| Тесты | рядом с файлом, `*.test.ts(x)` |
| **Бэкенд** | |
| Файлы Python | snake_case `.py` |
| Классы | PascalCase |
| Функции/переменные | snake_case |
| Константы | UPPER_SNAKE_CASE |
| Тесты | рядом с файлом, `test_*.py` |

Без `default export` (фронтенд) кроме lazy-страниц. Алиас `@/` → `src/`.

## 9. Команды

### Фронтенд (`frontend/`)

| Команда | Назначение |
|---|---|
| `npm run dev` | Dev-сервер |
| `npm run dev:mock` | Dev + Prism (статика) |
| `npm run dev:mock:dynamic` | Dev + Prism (динамика) |
| `npm run generate:api` | Генерация TS-типов из OpenAPI |
| `npm run build` | Сборка |
| `npm run lint` / `format` / `test` | Качество кода |
| `tsc --noEmit` | Проверка типов |

### Бэкенд (`backend/`)

| Команда | Назначение |
|---|---|
| `uv run manage.py runserver 3000` | Dev-сервер на порту 3000 |
| `uv add <package>` | Добавить зависимость |
| `uv sync` | Установить зависимости из lockfile |
| `uv run ruff check .` | Линтинг |
| `uv run black .` | Форматирование |

### Корень проекта

| Команда | Назначение |
|---|---|
| `npm run compile` | Компиляция TypeSpec → OpenAPI |
| `npm run watch` | Компиляция TypeSpec с watch-режимом |

## 10. Формат коммитов

При работе с этим репозиторием и создании коммитов ты **ОБЯЗАН** использовать формат Conventional Commits. 
Перед выполнением `git commit`, убедись, что сообщение начинается с нужного префикса:
- `feat:` — для нового функционала
- `fix:` — для исправления багов
- `refactor:` — для рефакторинга
- `chore:` — для рутинных задач
Пример правильного коммита: `feat: add user authentication layout`
