const express = require('express')
const morgan = require('morgan')
const path = require('path');
const app = express()
const cors = require('cors')

morgan.token('postData', (req) => {
    const { name, number, ...rest } = req.body;
    return JSON.stringify({ name, number, ...rest });
  });

app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :postData'));
app.use(cors())
app.use(express.static('dist'));


/*let persons = [
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
]*/

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: 'name or number missing' });
  }

  const newPerson = new Person({
    name: name,
    number: number,
  });

  newPerson.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error));
});


const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Give password as an argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://palmarier:${encodeURIComponent(password)}@cluster0.qz86wh1.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema);

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndRemove(id)
    .then(deletedPerson => {
      if (deletedPerson) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
});


app.get('/info', (request, response) => {
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
      response.send(`${infoMessage}<p>${currentDate}</p>`);
      })     

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})