# Автоматизированная система управления заявками на обслуживание  
**«ТехПоддержка УЗ»** — Service Desk для образовательного учреждения

Современное образовательное учреждение ежедневно сталкивается с десятками хозяйственных, технических и IT-инцидентов: перегоревшие лампы в аудиториях, неисправные проекторы, протечки, проблемы с Wi-Fi, поломки мебели и сантехники.

Данная система позволяет студентам и преподавателям быстро подавать заявки, диспетчерам оперативно распределять задачи между исполнителями, а всем участникам в реальном времени отслеживать статус выполнения. Также реализованы аналитические отчёты и автоматические уведомления.

Проект полностью контейнеризирован с использованием Docker и Docker Compose — это гарантирует 100 % воспроизводимость окружения на любой машине и демонстрирует применение современных DevOps-практик.

## Стек технологий

| Компонент         | Технология                                          |
|-------------------|-----------------------------------------------------|
| Frontend          | React 18 + Vite + TypeScript + TanStack Query + Zod |
| Backend           | Node.js 20 + Express + Sequelize ORM                |
| База данных       | PostgreSQL 16                                       |
| Аутентификация    | JWT + httpOnly cookies                              |
| Кэш/очереди       | Redis (сервис заготовлен)                           |
| Контейнеризация   | Docker + Docker Compose                             |
| Документация API  | Swagger/OpenAPI                                     |

## Быстрый запуск (одна команда)

```bash
# 1. Перейти в папку с проектом
cd путь_к_проекту

# 2. Создать .env для бэкенда (делается один раз)
cp server/.env.example server/.env

# 3. Запустить всё
docker compose up -d --build
После запуска:

Frontend → http://localhost:3000
Backend API → http://localhost:7001
Swagger-документация → http://localhost:7001/api-docs

Структура проекта
text.
├── docker-compose.yml          # оркестрация всех сервисов
├── client/                     # React-фронтенд
│   └── Dockerfile
├── server/                     # Node.js-бэкенд
│   ├── Dockerfile
│   ├── .env.example            # шаблон переменных
│   └── src/.env                # реальные переменные (не коммитить!)
├── backup-db.ps1               # резервное копирование БД (Windows)
├── restore-db.ps1              # восстановление БД из дампа
├── dump.sql                    # создаётся автоматически при бэкапе
└── README.md                   # этот файл
Переменные окружения (server/.env)
envPORT=7001
NODE_ENV=development

# Подключение к PostgreSQL внутри Docker-сети
DB_HOST=db
DB_PORT=5432
DB_NAME=servicedesk
DB_USER=desk_user
DB_PASSWORD=super_secure_password_2025_change_it
DB_DIALECT=postgres

# JWT
JWT_SECRET=your_very_strong_random_secret_2025_must_be_changed
JWT_EXPIRES_IN=30d
Важно: в docker-compose.yml значение POSTGRES_PASSWORD должно совпадать с DB_PASSWORD!
Резервное копирование и восстановление (Windows PowerShell)
PowerShell# Создать бэкап (файл dump.sql появится в корне)
.\backup-db.ps1

# Восстановить из последнего дампа
.\restore-db.ps1
Часто встречающиеся проблемы и решения

ПроблемаПричинаРешениеПорты 3000 / 7001 уже занятыЛокальные приложенияОстановить их или изменить порты в docker-compose.ymlКонтейнер backend «unhealthy»Нет соединения с БДПроверить совпадение паролей и DB_HOST=dbПосле restore данные не появилисьНет файла dump.sqlСначала выполнить backup-db.ps1Ошибки CORSFrontend-домен не разрешёнCORS уже настроен на http://localhost:3000Миграции не применилисьКонтейнер запущен без пересборкиdocker compose up --build -d backend
Полезные команды
Bash# Полная пересборка и перезапуск
docker compose down -v && docker compose up -d --build

# Просмотр логов
docker compose logs -f backend
docker compose logs -f client

# Подключиться к БД
docker compose exec db psql -U desk_user -d servicedesk
Преимущества контейнеризации

Мгновенное развёртывание на любом сервере с Docker
Полная изоляция и безопасность процессов
Сохранность данных при обновлениях (тома вынесены)
Простое резервное копирование и перенос системы
Готовность к переходу на Kubernetes или облака в будущем
