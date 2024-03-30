import { useState, useEffect } from 'react'
import PersonsForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import Filter from './components/Filter'
import personsService from './services/persons'
import './index.css'

//const baseUrl = '/api/people'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [notification, setNotification] = useState({ message: '', type: '' })

  useEffect(() => {
    console.log('App component mounted')

    personsService
      .getAll()
      .then(response => {
        setPersons(response)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })

    return () => {
      console.log('App component unmounted')
    }
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
            setPersons(persons.map(person => (person.id !== existingPerson.id ? person : updated)))
            setNewName('')
            setNewNumber('')

            setNotification({
              message: `New number for '${existingPerson.name}'`,
              type: 'success'
            })       

            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
          .catch(error => {
            console.error('Error updating person:', error)

            if (error.response && error.response.data && error.response.data.error) {

              setNotification({
                message: `Error updating '${existingPerson.name}': ${error.response.data.error}`,
                type: 'error'
              })
            } else {

              setNotification({
                message: 'Error updating person. Please check the input.',
                type: 'error'
              })
            }

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
      .then(() => {

        setNotification({
          message: `Added '${personObject.name}'`,
          type: 'success'
        })

        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
      .catch((error) => {
        console.error('Error adding person:', error)
    
        if (error.response && error.response.data && error.response.data.error) {

          setNotification({
            message: `Error adding '${personObject.name}': ${error.response.data.error}`,
            type: 'error',
          })
        } else {

          setNotification({
            message: `Error adding '${personObject.name}': ${error.message}`,
            type: 'error',
          })
        }


        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchName = (event) => {
    setSearchName(event.target.value)
  }

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personsService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          
          setNotification({
            message: `Deleted '${personToDelete.name}'`,
            type: 'success'
          })

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
  )

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification?.message} type={notification?.type} />
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
