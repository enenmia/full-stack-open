const listHelper = require('../utils/list_helper');

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '1',
      title: 'React Patterns',
      author: 'Michael Chan',
      likes: 7
    },
    {
      _id: '2',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 12
    },
    {
      _id: '3',
      title: 'Refactoring',
      author: 'Martin Fowler',
      likes: 5
    }
  ];

  test('finds the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 12
    });
  });

  test('returns null for an empty list', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBeNull();
  });

  test('returns the only blog when list has one blog', () => {
    const singleBlog = [
      {
        _id: '1',
        title: 'Solo Blog',
        author: 'John Doe',
        likes: 9
      }
    ];
    const result = listHelper.favoriteBlog(singleBlog);
    expect(result).toEqual({
      title: 'Solo Blog',
      author: 'John Doe',
      likes: 9
    });
  });
});
