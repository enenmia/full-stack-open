const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  const multipleBlogs = [
    {
      _id: '1',
      title: 'React Patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '2',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      url: 'https://cleancode.com/',
      likes: 10,
      __v: 0
    },
    {
      _id: '3',
      title: 'Refactoring',
      author: 'Martin Fowler',
      url: 'https://refactoring.com/',
      likes: 3,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(5)
  })

  test('when list has multiple blogs, returns the sum of likes', () => {
    expect(listHelper.totalLikes(multipleBlogs)).toBe(7 + 10 + 3)  // 20
  })

  test('when list is empty, returns zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })
})
