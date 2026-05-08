import { getDb } from './db.js';

class UserManager {
  findUserByEmail(email) {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email) || null;
  }

  findUserByPhone(phone) {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE phone = ?').get(phone) || null;
  }

  createUser(userData) {
    const db = getDb();
    const user = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };

    db.prepare(`
      INSERT INTO users (id, nickname, grade, school, major, email, phone, password, createdAt)
      VALUES (@id, @nickname, @grade, @school, @major, @email, @phone, @password, @createdAt)
    `).run(user);

    return user;
  }

  validateUser(identifier, password) {
    // 管理员测试账号：账号密码均为 123
    if (identifier === '123' && password === '123') {
      return {
        id: 'admin',
        nickname: '管理员',
        grade: '研究生',
        school: '北京大学',
        major: '计算机科学与技术',
        email: 'admin@example.com',
        phone: '13800138000',
        createdAt: new Date().toISOString(),
      };
    }

    const user = this.findUserByEmail(identifier) || this.findUserByPhone(identifier);
    if (!user) return null;
    if (user.password !== password) return null;
    return user;
  }
}

export default UserManager;
