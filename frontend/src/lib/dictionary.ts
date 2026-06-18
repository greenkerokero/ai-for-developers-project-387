export const UI = {
  nav: {
    home: "Главная",
    events: "События",
    management: "Управление",
    dashboard: "Дашборд",
    eventTypes: "Типы событий",
    availability: "Доступность",
  },
  buttons: {
    selectTime: "Выбрать время",
    adminLogin: "Вход для администратора",
    book: "Записаться",
    cancel: "Отмена",
    confirm: "Подтвердить",
    confirming: "Подтверждение...",
    save: "Сохранить изменения",
    saving: "Сохранение...",
    create: "Создать",
    creating: "Создание...",
    back: "Назад",
    edit: "Редактировать",
    delete: "Удалить",
    newEvent: "Новое событие",
  },
  labels: {
    name: "Название",
    slug: "URL ссылка",
    slugDisabled: "URL ссылка (нельзя изменить)",
    duration: "Длительность (в минутах)",
    description: "Описание",
    guestName: "Ваше Имя",
    guestEmail: "Email",
    guestComment: "Дополнительная информация (необязательно)",
    chooseDate: "Выберите дату",
  },
  messages: {
    loading: "Загрузка...",
    notFound: "Событие не найдено",
    noEvents: "Нет доступных событий для записи.",
    noEventsOwner: "Событий не найдено. Создайте новое, чтобы начать.",
    noUpcomingBookings: "У вас нет предстоящих встреч.",
    noTimeSlots: "Нет доступного времени в этот день.",
    selectDateFirst: "Выберите дату слева, чтобы увидеть доступное время.",
    loadingSlots: "Загрузка слотов...",
    confirmCancel: "Вы уверены, что хотите отменить это бронирование?",
    confirmDelete: "Вы уверены, что хотите удалить этот тип события?",
  },
  toast: {
    bookingSuccess: "Бронирование успешно подтверждено!",
    bookingCancelled: "Бронирование успешно отменено",
    eventCreated: "Событие создано",
    eventUpdated: "Событие обновлено",
    eventDeleted: "Тип события удален",
    scheduleUpdated: "Расписание обновлено",
  },
  pages: {
    home: {
      title: "Назначение встреч стало проще",
      subtitle: "Удобный сервис для бронирования времени. Забудьте о бесконечных переписках — выберите удобный слот и запланируйте звонок в пару кликов.",
    },
    catalog: {
      title: "Каталог событий",
    },
    booking: {
      title: "Подтверждение бронирования",
    },
    dashboard: {
      title: "Дашборд",
      upcomingBookings: "Предстоящие встречи",
    },
    ownerEventTypes: {
      title: "Типы событий",
    },
    ownerEventForm: {
      titleNew: "Новое событие",
      titleEdit: "Редактировать событие",
    },
    availability: {
      title: "Доступность",
      cardTitle: "Рабочие часы по неделям",
    }
  }
};
