const Header = (course) => {
  return (<>
    <h1>{course.name}</h1>
  </>)
}

const Part = (part) => {
  return (
    <div>
      <p>{part.name} {part.exercises} </p>
    </div>
  )
}

const Content = (part) => {
  return (
    <div>
      <Part name={part.names[0]} exercises={part.exercises[0]} />
      <Part name={part.names[1]} exercises={part.exercises[1]} />
      <Part name={part.names[2]} exercises={part.exercises[2]} />
    </div>
  )
}

const Total = (exercises) => {
  return <p>Number of exercises: {exercises.exercises1 + exercises.exercises2 + exercises.exercises3}</p>
}


const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header name={course} />
      <Content names={[part1, part2, part3]} exercises={[exercises1, exercises2, exercises3]} />
      <br />
      <Total exercises1={exercises1} exercises2={exercises2} exercises3={exercises3} />
    </div>
  )
}

export default App