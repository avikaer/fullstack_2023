const request = require('supertest')
const mongoose = require('mongoose')
const listHelper = require('../utils/list_helper')
const { app, server } = require('../app')
const Blog = require('../models/blog')

test('dummy returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const listWithMultipleBlogs = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Blog 1',
        author: 'Author 1',
        url: 'http://example.com/blog1',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Blog 2',
        author: 'Author 2',
        url: 'http://example.com/blog2',
        likes: 15,
        __v: 0
    }
]

test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
})

test('of multiple blogs is calculated correctly', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    expect(result).toBe(25)
})

describe('favoriteBlog', () => {
    test('of empty list is zero', () => {
        const result = listHelper.favoriteBlog([])
        expect(result).toBe(null)
    })

    test('when list has one blog equals the likes of that', () => {
        const blogs = [
            {
                title: 'Canonical string reduction',
                author: 'Edsger W. Dijkstra',
                likes: 12,
            }
        ]

        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual({
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            likes: 12,
        })
    })

    test('of a bigger list is calculated right', () => {
        const blogs = [
            {
                title: 'Blog 1',
                author: 'Author 1',
                likes: 10,
            },
            {
                title: 'Blog 2',
                author: 'Author 2',
                likes: 15,
            }
        ]

        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual({
            title: 'Blog 2',
            author: 'Author 2',
            likes: 15,
        })
    })
})

describe('GET /api/blogs', () => {
    test('returns the correct number of JSON formatted blogs', async () => {
        const response = await request(app)
            .get('/api/blogs')

            console.log(response.status)
            console.log(response.body)

            expect(response.status).toBe(200)

            const expectedNumberOfBlogs = response.body.length
            expect(response.body).toHaveLength(expectedNumberOfBlogs)

            response.body.forEach(blog => {
                expect(blog).toHaveProperty('_id')
              })
        })
    })

let initialNumberOfBlogs;

beforeAll(async () => {
  const initialBlogsResponse = await request(app)
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  initialNumberOfBlogs = initialBlogsResponse.body.length
})

describe('POST /api/blogs', () => {
  test('adds a new blog', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://example.com/test-blog',
      likes: 5
    }

    const response = await request(app)
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toMatchObject(newBlog)

    const blogsAfterPost = await request(app)
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(blogsAfterPost.body).toHaveLength(initialNumberOfBlogs + 1)
  })
})


describe('POST /api/blogs', () => {
  test('adds a new blog with likes defaulted to 0 if not provided', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'John Doe',
      url: 'https://example.com/new-blog'
    }

    const response = await request(app)
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    expect(response.body.title).toBe('New Blog')
    expect(response.body.likes).toBe(0)

    const addedBlog = await Blog.findById(response.body._id)
    expect(addedBlog.likes).toBe(0)
  })
})

const testBlog = {
  title: 'Test Blog',
  author: 'Test Author',
  url: 'https://example.com/test-blog',
  likes: 5
}

afterEach(async () => {
  await Blog.deleteMany({});
})

afterAll(async () => {
  await mongoose.connection.close();
})

describe('DELETE /api/blogs/:id', () => {
  test('deletes a blog successfully', async () => {
      const createdBlog = await Blog.create(testBlog)
      const response = await request(app)
          .delete(`/api/blogs/${createdBlog._id}`)
          .expect(204); // delete onnistuu
            const deletedBlog = await Blog.findById(createdBlog._id)
      expect(deletedBlog).toBeNull()
  })

  test('returns 404 if blog not found', async () => {
      await request(app)
          .delete('/api/blogs/660b02ba03a02ec53fe6d8a8')
          .expect(404)
  })

  test('returns 500 if server error occurs', async () => {
      // case: väärä ID
      await request(app)
          .delete('/api/blogs/invalidid')
          .expect(500)
  })
})

afterAll(async () => {
  await server.close()
  await mongoose.disconnect()
})


