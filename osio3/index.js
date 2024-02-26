require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

const { validatePhoneNumber, Person: PersonModel } = require('./models/person');


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

app.use(cors())
app.use(morgan('tiny'))
app.use(morgan(':method :url :status :response-time ms - :req[content-type] :res[content-length]'))

app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)


const errorHandler = (error, request, response, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message 
    })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
  response.send('<h1>Tervetuloa puhelinluetteloon!</h1>')
})

app.get('/api/people', (request, response) => {
    Person.find({})
    .then(people =>{
        response.json(people)
    })
})

app.get('/api/people/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end
        }
      })
      .catch(error => next(error))
})

  app.put('/api/people/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

app.delete('/api/people/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      response.status(500).json({ error: 'Internal Server Error' })
    })
  })


app.post('/api/people', (request, response, next) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ error: 'invalid or missing name or number' })
  } else {
      const person = new Person({
          name: body.name,
          number: body.number
      })
      
      person.save()
      .then(savedPerson => {
        response.json(savedPerson)
      })
      .catch(error => {
        if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map(err => err.message)
          return response.status(400).json({ error: validationErrors })
        }
  
        console.error('Error adding person:', error)
        response.status(500).json({ error: 'Internal Server Error' })
      })
    }
})
  



app.get('/info', (request, response) => {
    const currentTime = new Date()
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const seconds = currentTime.getSeconds()
  
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds
  
    Person.countDocuments()
      .then((count) => {
        const textResponse = `
          Current time: ${hours}:${formattedMinutes}:${formattedSeconds}\n
          Phonebook has info for ${count} people
        `
        response.send(textResponse)
    })
  })
  
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})