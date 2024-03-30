const express = require('express')
const Blog = require('../models/blog')

const router = express.Router()

router.get('/api/blogs', (request, response) => {
    console.log('Getting blogs...')

    Blog.find({})
        .then(blogs => {
            const blogsData = blogs.map(blog => blog.toJSON())
            response.json(blogsData)
            console.log('Blogs:', blogs)

        })
        .catch(error => {
            console.error(error)
            response.status(500).json({ error: 'Internal Server Error' })
        })
})

router.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)

    blog.save()
        .then(savedBlog => response.status(201).json(savedBlog.toJSON()))
        .catch(error => {
            console.error(error)
            response.status(500).json({ error: 'Internal Server Error' })
        })
})

module.exports = router
