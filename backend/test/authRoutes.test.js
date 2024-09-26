import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js'; // Adjust the import based on your file structure
import userModel from '../models/userModel.js'; // Adjust the import based on your file structure
import { DB_NAME } from '../constants.js';

describe('Auth Routes', () => {
  beforeAll(async () => {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    jest.advanceTimersByTime(5000); // Simulate the passage of time to avoid timeout issues
    await userModel.deleteMany({});
  });

  const testUser = {
    username: 'testuser10',
    email: 'testuse10r@example.com',
    password: 'TestPassword123!',
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register a user with an existing email', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  it('should login an existing user', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should return validation errors for registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email', // Invalid email format
        password: '123', // Password too short
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toHaveLength(2); // Expecting two validation errors
  });

  it('should return validation errors for login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'notfound@example.com', // Non-existent email
        password: '123456', // Any password
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});