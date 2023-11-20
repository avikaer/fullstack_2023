const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('postData', (req) => {
    const { name, number, ...rest } = req.body;
    return JSON.stringify({ name, number, ...rest });
  });

app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :postData'));

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const {name, number} = request.body

  if (!name  || !number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  if (persons.some((person) => person.name === name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const newPerson = {
    name: name,
    number: number,
    id: generateId()
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
      response.status(404).end()
  }

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/info', (req, res) => {
    const infoMessage = `<p>Phonebook has info for ${persons.length} people</p>`;
    const currentDate = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      })
      res.send(`${infoMessage}<p>${currentDate}</p>`);
      })

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})