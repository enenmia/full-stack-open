// const reverse = (string) => {
//     return string
//       .split('')
//       .reverse()
//       .join('')
//   }
  
//   const average = (array) => {
//     const reducer = (sum, item) => {
//       return sum + item
//     }
  
//     return array.reduce(reducer, 0) / array.length
//   }

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  const mostLikedBlog = blogs.reduce((max, blog) =>
    blog.likes > max.likes ? blog : max
  );

  return {
    title: mostLikedBlog.title,
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes
  };
};


const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authorCount = {};
  blogs.forEach(blog=> {
    authorCount[blog.author]=(authorCount[blog.author] || 0)+1;
  });

  const topAuthor=Object.keys(authorCount).reduce((max, blog) =>
    authorCount[max]>authorCount[blog]? max:blog
  );

  return {
    author: topAuthor,
    blogs: authorCount[topAuthor]
  };
}

const mostLikes=(blogs)=>{
  if (blogs.length === 0) return null;
  const authorLikes = {};
  blogs.forEach(blog=> {
    authorLikes[blog.author]=(authorLikes[blog.author] || 0)+1;
  });

  const topAuthor = Object.keys(authorLikes).reduce((maxAuthor, author) =>
    authorLikes[author] > authorLikes[maxAuthor] ? author : maxAuthor
  );

  return {
    author: topAuthor,
    likes: authorLikes[topAuthor]
  };
}

  const dummy = (blogs) => {
    return 1
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }
  