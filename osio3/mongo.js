const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Give password as an argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://palmarier:${password}@cluster0.qz86wh1.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  // If only password is provided, print all entries
  Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  // If three parameters are provided, add a new entry
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log('Invalid number of parameters!');
  mongoose.connection.close();
}

/*const person = new Person({
  name: 'uusiHenkilo',
  number: 123,
});

person.save().then(result => {
  console.log('Person saved!');
  mongoose.connection.close();
});

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})*/


