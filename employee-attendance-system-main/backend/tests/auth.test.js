require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

let server;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  // Create a test user
  const password = await bcrypt.hash('testpass', 10);
  await User.create({ username: 'testuser', password, role: 'employee' });
  server = app.listen(4000);
});

afterAll(async () => {
  await User.deleteMany({ username: 'testuser' });
  await mongoose.connection.close();
  server.close();
});

describe('POST /auth/login', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpass' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.username).toBe('testuser');
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'wrongpass' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('should not login with missing fields', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser' });
    expect(res.statusCode).toBe(400);
  });
}); 