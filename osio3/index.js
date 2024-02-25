require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('dist'))

//morgan.token('postData', (request, response) => 
//JSON.stringify(request.body))

//app.use(morgan(':method :url :status :response-time ms - :postData'))
app.use(morgan(':method :url :status :response-time ms - :req[content-type] :res[content-length]'));


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

app.use(requestLogger)

let people = [
  {
    id: 1,
    name: "Aatu",
    number: "040-000000"
    },
  {
    id: 2,
    name: "Bertta",
    number: "050-000000"
  },
]

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
    const id = request.params.id;
    Person.findById(id)
      .then(person => {
        if (person) {
          response.json(person);
        } else {
          response.status(404).json({ error: 'person not found' });
        }
      })
  });

app.delete('/api/people/:id', (request, response) => {
    const id = request.params.id;
    Person.findByIdAndRemove(id)
      .then(() => {
        response.status(204).end();
      })
  });


app.post('/api/people', (request, response) => {
    const body = request.body;
  
    if (!body.name || !body.number) {
      return response.status(400).json({ error: 'name or number missing' });
    }
    const person = new Person({
        name: body.name,
        number: body.number
      })
    
    person.save()
    .then(savedPerson => {
    response.json(savedPerson)
    })
  })

app.get('/info', (request, response) => {
    const currentTime = new Date()
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const seconds = currentTime.getSeconds()
  
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds
  
    Person.countDocuments({}, (err, count) => {
        const textResponse = `
        Current time: ${hours}:${formattedMinutes}:${formattedSeconds}\n
        Phonebook has info for ${count} people
      `
        response.send(textResponse)
  })
})

  const PORT = process.env.PORT
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})