const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

const validatePhoneNumber = (value) => {
  const phoneNumberRegex = /^(0\d|\+\d{1,2})?(\d{2,3}-\d{5,})$/
  return phoneNumberRegex.test(value)
};

console.log('connecting to', url)
mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: true
    },
    number: {
      type: String,
      required: true,
      validate:{
        validator: validatePhoneNumber,
        message: 'invalid phonenumber format',
      }
    },
  })
  
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)  

module.exports = Person