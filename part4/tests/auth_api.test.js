
// const supertest = require('supertest');
// const app = require('../app'); 
// const api = supertest(app);

// test('login returns token', async () => {
//     const user = {
//       username: 'testuser',
//       password: 'password123'
//     };
  
//     const response = await api.post('/api/login').send(user).expect(200);
//     expect(response.body.token).toBeDefined();
//   });

//   test('creating a blog fails if token is missing', async () => {
//     const newBlog = { title: 'No Token Blog', author: 'Test', url: 'https://example.com' };
  
//     await api.post('/api/blogs').send(newBlog).expect(401);
//   });

//   test('only the creator can delete a blog', async () => {
//     const loginResponse = await api.post('/api/login').send({ username: 'testuser', password: 'password123' });
//     const token = loginResponse.body.token;
  
//     const newBlog = { title: 'Deletable Blog', author: 'Test', url: 'https://example.com' };
  
//     const postResponse = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog);
//     const blogId = postResponse.body.id;
  
//     const anotherUser = await api.post('/api/login').send({ username: 'anotheruser', password: 'password123' });
//     const anotherToken = anotherUser.body.token;
  
//     await api.delete(`/api/blogs/${blogId}`).set('Authorization', `Bearer ${anotherToken}`).expect(403);
//   });
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');  // 导入 Express 服务器
const User = require('../models/user');
const Blog = require('../models/blog');

const api = supertest(app);  // 重要！让 Jest 可以测试 API

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);
  const testUser = new User({ username: 'testuser', passwordHash });
  const anotherUser = new User({ username: 'anotheruser', passwordHash });

  await testUser.save();
  await anotherUser.save();
});

test('login returns token', async () => {
  const user = {
    username: 'testuser',
    password: 'password123'
  };

  const response = await api.post('/api/login').send(user).expect(200);
  expect(response.body.token).toBeDefined();
});

test('creating a blog fails if token is missing', async () => {
  const newBlog = { title: 'No Token Blog', author: 'Test', url: 'https://example.com/no-token' };

  await api.post('/api/blogs').send(newBlog).expect(401);
});

// test('only the creator can delete a blog', async () => {
//   const loginResponse = await api.post('/api/login').send({ username: 'testuser', password: 'password123' });
//   const token = loginResponse.body.token;

//   const newBlog = { title: 'Deletable Blog', author: 'Test', url: 'https://example.com/deletable' };

//   const postResponse = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog);
//   const blogId = postResponse.body.id;

//   const anotherUser = await api.post('/api/login').send({ username: 'anotheruser', password: 'password123' });
//   const anotherToken = anotherUser.body.token;

//   await api.delete(`/api/blogs/${blogId}`).set('Authorization', `Bearer ${anotherToken}`).expect(403);
// });
test('only the creator can delete a blog', async () => {
    const loginResponse = await api.post('/api/login').send({ username: 'testuser', password: 'password123' });
    const token = loginResponse.body.token;
  
    const newBlog = { title: 'Deletable Blog', author: 'Test', url: 'https://example.com/deletable' };
    const postResponse = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog);
    const blogId = postResponse.body.id;
  
    const anotherUser = await api.post('/api/login').send({ username: 'anotheruser', password: 'password123' });
    const anotherToken = anotherUser.body.token;
  
    await api.delete(`/api/blogs/${blogId}`).set('Authorization', `Bearer ${anotherToken}`).expect(403);
  }, 10000); // ✅ 超时增加到 10 秒
  

afterAll(async () => {
  await mongoose.connection.close();
});

  