import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PersonsForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import Filter from './components/Filter'
import personsService from './services/persons'
import './index.css'
const baseUrl = 'api/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [notification, setNotification] = useState(null)

  const hook = () => {
    console.log('effect')
    axios
      .get('baseUrl')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }
  
  useEffect(hook, []) 

  useEffect(() => {
    personsService
      .getAll()
      .then(response => {
        setPersons(response)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      const confirmMessage = `${newName} is already added to the phonebook, replace the old number with a new one?`
  
      if (window.confirm(confirmMessage)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
  
        personsService
          .update(existingPerson.id, updatedPerson)
          .then(updated => {
            setPersons(persons.map(person => (person.id !== existingPerson.id ? person : updated)));
            setNewName('')
            setNewNumber('')
          
            setNotification(`New number for '${existingPerson.name}'`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
          .catch(error => {
            console.error('Error updating person:', error)
            setNotification(`Contact '${existingPerson.name}' has already been removed from server`)
            setTimeout(() => {
            setNotification(null)
          }, 5000)
          })
      }
      return
    }
    
  const personObject = {
      name: newName,
      number: newNumber
    }

    personsService
    .create(personObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
    .then(returnedPerson => {
      setNotification(`Added '${personObject.name}'`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    })
    .catch(error => {
      console.error('Error adding person:', error)
    })
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchName = (event) => {
    setSearchName(event.target.value);
  }

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personsService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotification(`Deleted '${personToDelete.name}'`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {
          console.error('Error deleting person:', error)
        })
    }
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification} />
      <Filter
          searchName={searchName}
          handleSearchName={handleSearchName}
          />
      <h2>Add a new</h2>
      <PersonsForm
          newName={newName}
          newNumber={newNumber}
          handleNameChange={handleNameChange}
          handleNumberChange={handleNumberChange}
          addName={addName}
          />
      <h2>Numbers</h2>
      <Persons 
          persons={filteredPersons} handleDelete={handleDelete}
          />  
      </div>
  )

}

export default App