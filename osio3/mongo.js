const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://palmarier:${password}@cluster0.qz86wh1.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {

    Person.find({}).then((result) => {
      console.log('phonebook:');
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    });
  } else if (process.argv.length === 5) {

    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    });
  
    person.save().then(() => {
      console.log(`added ${person.name} number ${person.number} to phonebook`);
      mongoose.connection.close();
    });
  } else {
    console.log('invalid number of arguments');
    process.exit(1);
  }