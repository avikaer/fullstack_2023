import React from 'react';

const Course = ({ courses }) => {

  const total = courses.parts.reduce((total, part) => total + part.exercises, 0);
  return (
    <div>
      <h2>{courses.name}</h2>
      <ul>
        {courses.parts.map(part => (
          <li key={part.id}>
            {part.name} {part.exercises}
          </li>
        ))}
      </ul>
      <p><b>total of {total} exercises</b></p>
    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
    name: 'Node.js',
    id: 2,
    parts: [
      {
        name: 'Routing',
        exercises: 3,
        id: 1
      },
      {
        name: 'Middlewares',
        exercises: 7,
        id: 2
      }
    ]
    }
  ]

  return (
    <div>
      {courses.map(courses => (
        <Course key={courses.id} courses={courses} />
      ))}
    </div>
  )
}

export default App;
