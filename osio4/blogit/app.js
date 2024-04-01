const express = require('express')
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const blogController = require('./controllers/blogs')
const Blog = require('./models/blog')

require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.set('strictQuery', true)

const connectDatabase = async () => {
  try {
      await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      console.log('Connected to MongoDB')
  } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      process.exit(1)
  }
}

connectDatabase()
const blogRouter = express.Router()

blogRouter.get('/api/blogs', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

app.use(blogRouter)

app.post('/api/blogs', async (request, response, next) => {
  try {
    await blogController(request, response)
  } catch (error) {
    next(error)
  }
})

app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error: 'Internal server error' })
})

app.delete('/api/blogs/:id', async (request, response) => {
  try {
      const blogId = request.params.id;
      const deletedBlog = await Blog.findByIdAndDelete(blogId) // Changed from findByIdAndRemove
      if (!deletedBlog) {
          return response.status(404).json({ error: 'Blog not found' })
      }
      response.status(204).json({ message: 'Blog deleted successfully' })  } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'Error' })
  }
})

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server, mongoose }