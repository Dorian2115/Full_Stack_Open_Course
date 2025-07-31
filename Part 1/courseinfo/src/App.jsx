const Header = (course) => {
  return (
    <>
      <h1>{course.name}</h1>
    </>
  );
};

const Part = (part) => {
  return (
    <div>
      <p>
        {part.name} {part.exercises}{" "}
      </p>
    </div>
  );
};

const Content = (part) => {
  console.log(part);
  const parts = part.parts;
  return (
    <div>
      <Part name={parts[0].name} exercises={parts[0].exercises} />
      <Part name={parts[1].name} exercises={parts[1].exercises} />
      <Part name={parts[2].name} exercises={parts[2].exercises} />
    </div>
  );
};

const Total = (part) => {
  const parts = part.parts;
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return <p>Number of exercises: {total}</p>;
};

const App = () => {
  const course = "Half Stack application development";
  const parts = [
    {
      name: "Fundamentals of React",
      exercises: 10,
    },
    {
      name: "Using props to pass data",
      exercises: 7,
    },
    {
      name: "State of a component",
      exercises: 14,
    },
  ];

  return (
    <div>
      <Header name={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  );
};

export default App;
