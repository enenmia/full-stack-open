// const express = require('express')
// const app = express()
// const cors = require('cors')
const mongoose = require('mongoose')
// require('dotenv').config()
// mongoose.set('strictQuery', false)
// const mongoUrl = process.env.MONGODB_URI
// mongoose.connect(mongoUrl)

// const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // ✅ 添加 `user` 关联
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Blog = mongoose.model('Blog', blogSchema)



module.exports = Blog