import React from 'react';

const Filter = ({ searchName, handleSearchName }) => (
    <div>
      filter shown with<input 
        value={searchName}
        onChange={handleSearchName}
      />
    </div>
  )

export default Filter