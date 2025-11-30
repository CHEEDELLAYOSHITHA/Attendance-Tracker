require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Attendance = require('../src/models/Attendance');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let server, token, adminId;

describe('Admin Endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const password = await bcrypt.hash('adminpass', 10);
    const admin = await User.create({ username: 'adminuser', password, role: 'admin' });
    adminId = admin._id;
    token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET);
    // Create a dummy attendance record
    await Attendance.create({ user: admin._id, checkIn: new Date() });
    server = app.listen(4002);
  });

  afterAll(async () => {
    await Attendance.deleteMany({ user: adminId });
    await User.deleteMany({ username: 'adminuser' });
    await mongoose.connection.close();
    server.close();
  });

  it('should allow admin to view all attendance records', async () => {
    const res = await request(app)
      .get('/admin/attendance')
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should forbid non-admin users', async () => {
    // Create a non-admin user
    const password = await bcrypt.hash('notadmin', 10);
    const user = await User.create({ username: 'notadmin', password, role: 'employee' });
    const userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    const res = await request(app)
      .get('/admin/attendance')
      .set('Authorization', `Bearer ${userToken}`)
      .send();
    expect(res.statusCode).toBe(403);
    await User.deleteOne({ _id: user._id });
  });
}); 