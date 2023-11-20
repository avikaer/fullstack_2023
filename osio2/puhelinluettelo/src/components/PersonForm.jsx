import React from 'react';

const PersonsForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addName}) => (
  <div>
    <form onSubmit={addName}>
      <div>
        name: <input 
                value={newName}
                onChange={handleNameChange}
              />
      </div>
      <div>
        number: <input 
                value={newNumber}
                onChange={handleNumberChange}
              />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </div>
)

export default PersonsForm
