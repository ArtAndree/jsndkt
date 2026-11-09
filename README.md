# Манипуляции с пользователями (админами)

Самостоятельный минимальный учебный проект Express + JWT. Исходный магазин прошлых занятий не предоставлен. Классы и middleware можно перенести в него, подключив middleware перед защищёнными маршрутами.

## Запуск

Установите Node.js 22 или новее. Откройте терминал в папке проекта:

```sh
npm install
npm start
```

Откройте http://localhost:3000. На странице входа нажмите «Создать первого администратора», заполните форму и войдите. Следующих администраторов может создавать только вошедший администратор. Выход — кнопкой «Выйти» (POST /admin/logout).

Пользователи сохраняются в автоматически создаваемом users.json; пароли хешируются scrypt с индивидуальной солью. Все пользователи этого учебного проекта — администраторы. JWT хранится в HttpOnly cookie и действует один час. Выход удаляет cookie браузера; уже скопированный токен сохраняет силу до истечения срока. По умолчанию секрет генерируется при запуске, поэтому перезапуск сбрасывает вход. Для постоянного секрета задайте переменную окружения JWT_SECRET. Это локальный учебный вариант, сервер слушает только 127.0.0.1.

## Файлы и методы

- models/User.js — поля id, login, password (хеш), email, created.
- models/Eshop.js — userAdd(user): сохранить пользователя; userCheck(user): проверить наличие; userGet(user): найти по id или login; createHash(password): хеш; isAdmin(req): проверить JWT; logIn(user, res): проверить пароль и установить cookie; logOut(res): удалить cookie.
- core/init.js — проверка доступа и редирект на /admin/login. Исключения: вход и создание самого первого администратора.
- app.js — формы и маршруты GET/POST /admin/login, GET/POST /admin/save_user, POST /admin/logout и защищённая панель /admin.

## Загрузка в GitHub

Создайте пустой репозиторий GitHub без README. В терминале из папки проекта выполните, заменив URL своим:

```sh
git init
git add .
git commit -m "Add minimal admin authentication"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

.gitignore исключает зависимости, локальные аккаунты и .env. После npm install загрузите также созданный package-lock.json: он фиксирует версии зависимостей.

Документация: https://expressjs.com/ и https://github.com/auth0/node-jsonwebtoken.

