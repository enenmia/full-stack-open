const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'Alice',
    url: 'https://example.com/first',
    likes: 5
  },
  {
    title: 'Second Blog',
    author: 'Bob',
    url: 'https://example.com/second',
    likes: 10
  }
];

// 清空数据库并插入测试数据
beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

// 4.8: 测试 `/api/blogs` 返回 JSON 和正确的数量
test('blogs are returned as JSON', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(response.body).toHaveLength(initialBlogs.length);
});

// 4.9: 博客 `id` 属性是否正确
test('blog unique identifier is named id', async () => {
  const response = await api.get('/api/blogs');
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined();
  });
});

// 4.10: `POST /api/blogs` 创建新博客
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'Charlie',
    url: 'https://example.com/new',
    likes: 7
  };

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await Blog.find({});
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

  const titles = blogsAtEnd.map(blog => blog.title);
  expect(titles).toContain('New Blog');
});

// 4.11: 如果 `likes` 缺失，则默认 `0`
test('blog without likes defaults to 0', async () => {
  const newBlog = {
    title: 'No Likes Blog',
    author: 'David',
    url: 'https://example.com/nolikes'
  };

  const response = await api.post('/api/blogs').send(newBlog).expect(201);
  expect(response.body.likes).toBe(0);
});

// 4.12: 如果 `title` 或 `url` 缺失，返回 400
test('blog without title or url returns 400', async () => {
  const noTitleBlog = { author: 'Eve', url: 'https://example.com/notitle' };
  await api.post('/api/blogs').send(noTitleBlog).expect(400);

  const noUrlBlog = { title: 'No URL Blog', author: 'Eve' };
  await api.post('/api/blogs').send(noUrlBlog).expect(400);
});

// 4.13: 删除博客
test('a blog can be deleted', async () => {
    const blogsAtStart = await Blog.find({});
    const blogToDelete = blogsAtStart[0];
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);
  
    const blogsAtEnd = await Blog.find({});
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);
    
    const ids = blogsAtEnd.map(blog => blog.id);
    expect(ids).not.toContain(blogToDelete.id);
  });
  
  // 4.13: 删除不存在的博客返回 404
  test('deleting a non-existent blog returns 404', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
  
    await api
      .delete(`/api/blogs/${nonExistentId}`)
      .expect(404);
  });
  
  // 4.14: 更新博客点赞数
  test('a blog can have its likes updated', async () => {
    const blogsAtStart = await Blog.find({});
    const blogToUpdate = blogsAtStart[0];
  
    const updatedData = { likes: blogToUpdate.likes + 10 };
  
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  
    expect(response.body.likes).toBe(updatedData.likes);
  });
  
  // 4.14: 更新不存在的博客返回 404
  test('updating a non-existent blog returns 404', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const updatedData = { likes: 10 };
  
    await api
      .put(`/api/blogs/${nonExistentId}`)
      .send(updatedData)
      .expect(404);
  });
  
  // 4.14: 更新博客时 `likes` 不能为空
  test('updating a blog without likes value returns 400', async () => {
    const blogsAtStart = await Blog.find({});
    const blogToUpdate = blogsAtStart[0];
  
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({})
      .expect(400);
  });
  
// 关闭数据库连接
afterAll(async () => {
  await mongoose.connection.close();
});
