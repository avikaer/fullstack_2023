import Note from './components/Note'

const App = (props) => {
  const { notes } = props

  const Note = ({ note }) => {
    return (
      <li>{note.content}</li>
    )
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  )
}

export default App