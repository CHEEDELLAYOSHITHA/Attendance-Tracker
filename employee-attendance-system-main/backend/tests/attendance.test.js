require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Attendance = require('../src/models/Attendance');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let server, token, userId;

describe('Attendance Endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const password = await bcrypt.hash('attendpass', 10);
    const user = await User.create({ username: 'attenduser', password, role: 'employee' });
    userId = user._id;
    token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    server = app.listen(4001);
  });

  afterAll(async () => {
    await Attendance.deleteMany({ user: userId });
    await User.deleteMany({ username: 'attenduser' });
    await mongoose.connection.close();
    server.close();
  });

  it('should check in', async () => {
    const res = await request(app)
      .post('/attendance/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.attendance).toHaveProperty('checkIn');
  });

  it('should not allow multiple check-ins per day', async () => {
    const res = await request(app)
      .post('/attendance/checkin')
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(res.statusCode).toBe(400);
  });

  it('should check out', async () => {
    const res = await request(app)
      .post('/attendance/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.attendance).toHaveProperty('checkOut');
  });

  it('should get own logs', async () => {
    const res = await request(app)
      .get('/attendance/me')
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
}); 