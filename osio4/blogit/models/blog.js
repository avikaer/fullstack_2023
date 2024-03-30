const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes:    {
        type: Number,
        default: 0,
    },
})

module.exports = mongoose.model('Blog', blogSchema)


