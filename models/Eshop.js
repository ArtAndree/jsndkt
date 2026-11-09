const fs = require('node:fs');
const path = require('node:path');
const { randomBytes, scryptSync, timingSafeEqual } = require('node:crypto');
const jwt = require('jsonwebtoken');
const User = require('./User');

class Eshop {
  constructor() {
    this.file = path.join(__dirname, '..', 'users.json');
    this.users = fs.existsSync(this.file) ? JSON.parse(fs.readFileSync(this.file, 'utf8')) : [];
    this.secret = process.env.JWT_SECRET || randomBytes(32).toString('hex');
  }
  userGet(user) {
    return this.users.find(item => user.id ? item.id === user.id : item.login === user.login);
  }
  userCheck(user) {
    return Boolean(this.userGet(user));
  }
  createHash(password) {
    const salt = randomBytes(16).toString('hex');
    return salt + ':' + scryptSync(password, salt, 64).toString('hex');
  }
  userAdd(user) {
    if (this.userCheck(user)) throw new Error('Логин уже занят');
    const created = new User({ ...user, password: this.createHash(user.password) });
    const users = [...this.users, created];
    fs.writeFileSync(this.file, JSON.stringify(users, null, 2));
    this.users = users;
    return created;
  }
  isAdmin(req) {
    try {
      const payload = jwt.verify(req.cookies.token, this.secret, { algorithms: ['HS256'] });
      return this.userCheck({ id: payload.sub });
    } catch {
      return false;
    }
  }
  logIn(user, res) {
    const saved = this.userGet(user);
    if (!saved) return false;
    const [salt, hash] = saved.password.split(':');
    if (!timingSafeEqual(Buffer.from(hash, 'hex'), scryptSync(user.password, salt, 64))) return false;
    const token = jwt.sign({}, this.secret, { subject: saved.id, expiresIn: '1h', algorithm: 'HS256' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 3600000 });
    return true;
  }
  logOut(res) {
    res.clearCookie('token', { httpOnly: true, sameSite: 'strict', path: '/' });
  }
}
module.exports = Eshop;
