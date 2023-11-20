import React from 'react'

const Persons = ({ persons , handleDelete}) => (
  <div>
    <ul>
      {persons.map(person => (
        <li key={person.id}>
          {person.name}: {person.number}
          <button onClick={() => handleDelete(person.id)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
)

export default Persons
