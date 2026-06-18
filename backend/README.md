# Backend — Booking API (Python / Django)

## Стек

- Python 3.12 · Django 6 · Django REST Framework
- **uv** — пакетный менеджер
- In-memory хранилище (сброс при рестарте)
- Сервер: `http://localhost:3000`

## Запуск

```bash
# Установить зависимости
uv sync

# Запустить сервер
uv run python manage.py runserver 3000
```

## Команды

| Команда | Назначение |
|---|---|
| `uv sync` | Установить зависимости из lockfile |
| `uv add <pkg>` | Добавить зависимость |
| `uv run python manage.py runserver 3000` | Dev-сервер |
| `uv run python manage.py check` | Проверка конфигурации |

## Структура

```
backend/
├── config/              # Django project (settings, urls, wsgi)
├── booking_api/
│   ├── views/           # Thin views — 1 файл = 1 TypeSpec-интерфейс
│   ├── services/        # Бизнес-логика
│   ├── storage.py       # In-memory хранилище
│   ├── serializers.py   # DRF serializers (валидация по контракту)
│   └── urls.py          # Маршруты, точно соответствующие OpenAPI
├── pyproject.toml
└── uv.lock
```

## API эндпоинты

Все пути строго соответствуют `tsp-output/openapi/openapi.yaml`.

| Метод | Путь | Описание |
|---|---|---|
| GET/PUT | `/owner/availability` | Расписание доступности |
| GET/POST | `/owner/event-types` | Список/создание типов событий |
| GET/PUT/DELETE | `/owner/event-types/{slug}` | Управление типом события |
| GET | `/owner/bookings` | Список бронирований |
| GET/POST | `/owner/bookings/{id}` | Детали / отмена бронирования |
| GET | `/public/event-types` | Публичный список типов событий |
| GET | `/public/event-types/{slug}` | Детали типа события |
| GET | `/public/event-types/{slug}/slots` | Доступные слоты (14 дней) |
| POST | `/public/event-types/{slug}/bookings` | Создать бронирование |

## Бизнес-правила

- Слот занят при перекрытии с **любым** confirmed-бронированием
- При конфликте → `409 Conflict` + `ApiError { code: "slot_unavailable" }`
- Отмена меняет `status` → `"cancelled"`, слот снова доступен
- Слоты вычисляются на лету из расписания доступности (не хранятся)
