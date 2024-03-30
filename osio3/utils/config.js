require('dotenv').config()
const process = require('process')


let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

module.exports = {
	MONGODB_URI,
	PORT
}