const express = require('express');
const cookieParser = require('cookie-parser');
const Eshop = require('./models/Eshop');
const init = require('./core/init');
const app = express();
const eshop = new Eshop();
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(cookieParser());
app.use('/admin', (req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
app.use('/admin', init(eshop));

const page = body => '<!doctype html><html lang="ru"><meta charset="utf-8"><title>Администраторы</title><body>' + body + '</body></html>';
const form = (action, email = false) => `<form method="post" action="${action}"><p><input name="login" placeholder="Логин" required maxlength="100"></p><p><input name="password" type="password" placeholder="Пароль" required maxlength="200"></p>${email ? '<p><input name="email" type="email" placeholder="Email" required></p>' : ''}<button>Отправить</button></form>`;
app.get('/', (req, res) => res.redirect('/admin'));
app.get('/admin/login', (req, res) => res.send(page('<h1>Вход</h1>' + form('/admin/login') + (eshop.users.length === 0 ? '<a href="/admin/save_user">Создать первого администратора</a>' : ''))));
app.post('/admin/login', (req, res) => {
  const { login, password } = req.body || {};
  if (typeof login !== 'string' || typeof password !== 'string' || password.length > 200) return res.status(400).send('Некорректные данные');
  if (!eshop.logIn({ login: login.trim(), password }, res)) return res.status(401).send(page('<p>Неверный логин или пароль</p><a href="/admin/login">Вернуться ко входу</a>'));
  res.redirect('/admin');
});
app.get('/admin/save_user', (req, res) => res.send(page('<h1>Создать администратора</h1>' + form('/admin/save_user', true))));
app.post('/admin/save_user', (req, res) => {
  const { login, password, email } = req.body || {};
  if (![login, password, email].every(value => typeof value === 'string') || !login.trim() || login.length > 100 || !password || password.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).send('Заполните логин, пароль и корректный email');
  if (eshop.userCheck({ login: login.trim() })) return res.status(409).send('Логин уже занят');
  eshop.userAdd({ login: login.trim(), password, email });
  res.redirect('/admin/login');
});
app.get('/admin', (req, res) => res.send(page('<h1>Панель администратора</h1><a href="/admin/save_user">Добавить администратора</a><form method="post" action="/admin/logout"><button>Выйти</button></form>')));
app.post('/admin/logout', (req, res) => { eshop.logOut(res); res.redirect('/admin/login'); });
app.listen(process.env.PORT || 3000, '127.0.0.1', () => console.log('Откройте http://localhost:' + (process.env.PORT || 3000)));

