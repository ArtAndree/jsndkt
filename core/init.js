// Проверка JWT перед всеми защищёнными маршрутами /admin.
module.exports = eshop => (req, res, next) => {
  if (req.path === '/login') return next();
  // Первого администратора можно создать без входа.
  if (req.path === '/save_user' && eshop.users.length === 0) return next();
  if (!eshop.isAdmin(req)) return res.redirect('/admin/login');
  next();
};
