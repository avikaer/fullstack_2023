const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())

app.use(cors())
app.use(morgan('tiny'));
app.use(express.static('dist'))

morgan.token('postData', (request, response) => {
    return JSON.stringify(request.body);
  });

app.use(morgan(':method :url :status :response-time ms - :postData'));


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

app.use(requestLogger)

let persons = [
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

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
  
    if (person) {
      response.json(person);
    } else {
      response.status(404).json({ error: 'Person not found' });
    }
  });

app.delete('/api/persons/:id', (request, response) => {
const id = Number(request.params.id);
persons = persons.filter(person => person.id !== id);

response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const body = request.body;
  
    if (!body.name || !body.number) {
      return response.status(400).json({ error: 'Name or number is missing' });
    }
  
    const newPerson = {
      id: Math.floor(Math.random() * 1000000),
      name: body.name,
      number: body.number
    };
  
    persons = persons.concat(newPerson);
  
    response.json(newPerson);
});

app.post('/api/persons', (request, response) => {
    const body = request.body;
  
    if (!body.name || !body.number) {
      return response.status(400).json({ error: 'Name or number is missing' });
    }
  
    const isDuplicateName = persons.some(person => person.name === body.name);
  
    if (isDuplicateName) {
      return response.status(400).json({ error: 'Name must be unique' });
    }
  
    const newPerson = {
      id: Math.floor(Math.random() * 1000000),
      name: body.name,
      number: body.number
    };
  
    persons = persons.concat(newPerson);
  
    response.json(newPerson);
  });

app.get('/info', (request, response) => {
    const currentTime = new Date()
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const seconds = currentTime.getSeconds()
  
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds
  
    const textResponse = `
    Current time: ${hours}:${formattedMinutes}:${formattedSeconds}\n
    Phonebook has info for ${persons.length} people
  `

  response.send(textResponse)
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})