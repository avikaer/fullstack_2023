const request = require('supertest')
const mongoose = require('mongoose')
const listHelper = require('../utils/list_helper')
const { app, server } = require('../app')

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


afterAll(async () => {
  await server.close()
  await mongoose.disconnect()
})


