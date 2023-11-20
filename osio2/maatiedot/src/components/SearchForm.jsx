import React from 'react';

const SearchForm = ({searchCountry, handleSearchChange}) => (
    <div>
    <form onSubmit={handleSearchChange}>
      <div>
        find countries
        <input
          value={searchCountry}
          onChange={handleSearchChange}
        />
      </div>
    </form>
  </div>
)

export default SearchForm