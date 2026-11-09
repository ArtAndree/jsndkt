const { randomUUID } = require('node:crypto');

// password содержит хеш, а не открытый пароль.
class User {
  constructor({ login, password, email }) {
    this.id = randomUUID();
    this.login = login;
    this.password = password;
    this.email = email;
    this.created = new Date().toISOString();
  }
}
module.exports = User;
