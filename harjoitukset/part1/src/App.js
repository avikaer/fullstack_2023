const Hello = (props) => {
  return (
    <div>
      <p>Hello {props.name}, you nare {props.age} years old</p>
    </div>
  )
}

const App = () => {

  const nimi = 'Erika'
  const ika = 27
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name ="ope" age={26+10}/>
      <Hello name ={nimi} age={ika}/>
    </div>
  )
}

export default App