const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

test('create a new user', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'password123'
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const users = await User.find({});
  expect(users).toHaveLength(1);
  expect(users[0].username).toBe(newUser.username);
});

test('fail to create user if username is too short', async () => {
  const newUser = {
    username: 'ab',
    name: 'Short User',
    password: 'password123'
  };

  await api.post('/api/users').send(newUser).expect(400);
});

test('fail to create user if password is too short', async () => {
  const newUser = {
    username: 'validuser',
    name: 'Valid User',
    password: '12'
  };

  await api.post('/api/users').send(newUser).expect(400);
});

test('fail to create user if username is not unique', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'password123'
  };

  await api.post('/api/users').send(newUser);
  await api.post('/api/users').send(newUser).expect(400);
});

afterAll(async () => {
  await mongoose.connection.close();
});
