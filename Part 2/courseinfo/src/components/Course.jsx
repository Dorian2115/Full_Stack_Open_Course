const Header = ({course}) => {
  return <h1>{course.name}</h1>;
};

const Part = ({course}) => {
  return (
    <div>
      <p>
        {course.name} {course.exercises}
      </p>
    </div>
  );
};

const Content = ({course}) => {
  const parts = course.parts;
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} course={part} />
      ))}
    </div>
  );
};

const Total = ({course}) => {
  const parts = course.parts;
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return <p style={{ fontWeight: 'bold' }}>total of {total} exercises</p>;
};

const Course = ({course}) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default Course;