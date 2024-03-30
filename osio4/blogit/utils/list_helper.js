const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length == 0) {
        return null
    }

    const favorite = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0])

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes,
    }
}

// tehtävä 4.6 - 4.7.
// conts mostBlogs = blog

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}
