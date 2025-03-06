const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const middleware = require('../utils/middleware');
const config = require('../utils/config');
// 获取所有博客（GET /api/blogs）
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

// 创建新博客（POST /api/blogs）
// blogsRouter.post('/', async (req, res) => {
//   const { title, author, url, likes } = req.body;

//   if (!title || !url) {
//     return res.status(400).json({ error: 'title and url are required' });
//   }

//   const blog = new Blog({
//     title,
//     author,
//     url,
//     likes: likes || 0  // 确保 `likes` 默认值为 0
//   });

//   const savedBlog = await blog.save();
//   res.status(201).json(savedBlog);
// });
// 4.13: 删除博客（DELETE /api/blogs/:id）
// blogsRouter.delete('/:id', async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) {
//       return res.status(404).json({ error: 'blog not found' });
//     }

//     await Blog.findByIdAndDelete(req.params.id);
//     res.status(204).end();
//   } catch (error) {
//     res.status(400).json({ error: 'malformatted id' });
//   }
// });

// 4.14: 更新博客点赞数（PUT /api/blogs/:id）
blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body;

  if (likes === undefined) {
    return res.status(400).json({ error: 'likes value is required' });
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: 'blog not found' });
    }

    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ error: 'malformatted id' });
  }
});

// 获取 Token
const getTokenFrom = request => {
  const authorization = request.get('authorization');
  return authorization && authorization.startsWith('Bearer ') ? authorization.replace('Bearer ', '') : null;
};

// 创建博客（需要 Token）
blogsRouter.post('/', async (req, res) => {
  const token = getTokenFrom(req);
  if (!token) {
    return res.status(401).json({ error: 'token missing or invalid' });  // ✅ 确保没有 Token 时，返回 401
  }
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes || 0,
    user: user._id
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});
// 删除博客（仅创建者可删除）
blogsRouter.delete('/:id', async (req, res) => {
  const token = getTokenFrom(req);
  if (!token) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const decodedToken = jwt.verify(token, config.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const blog = await Blog.findById(req.params.id).populate('user');
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' });
  }

  if (!blog.user || !blog.user._id) {
    return res.status(400).json({ error: 'blog does not have an associated user' });
  }

  if (blog.user._id.toString() !== decodedToken.id) {
    return res.status(403).json({ error: 'only the creator can delete this blog' });
  }

  await Blog.findByIdAndDelete(req.params.id);
  return res.status(204).end(); // ✅ 确保返回响应
});


// blogsRouter.put('/:id', async (req, res) => {
//   const { likes } = req.body;
  
//   if (likes === undefined) {
//     return res.status(400).json({ error: 'likes value is required' });
//   }

//   try {
//     const updatedBlog = await Blog.findByIdAndUpdate(
//       req.params.id,
//       { likes },
//       { new: true, runValidators: true }
//     );

//     if (!updatedBlog) {
//       return res.status(404).json({ error: 'blog not found' });
//     }

//     res.json(updatedBlog);
//   } catch (error) {
//     res.status(400).json({ error: 'malformatted id' });
//   }
// });


module.exports = blogsRouter;
