const express = require("express");
const morgan = require("morgan");

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const idGenerator = () => {
  return Math.floor(Math.random() * 1000000000).toString();
};

const app = express();
app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (request, response) => {
  response.send("<h1>Welcome to the persons API</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<div><p>persons has information for ${
      persons.length
    } people</p><p>${new Date()}</p></div>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => id === person.id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).send({ error: "Person not found" });
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => id !== person.id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "content missing" });
  } else if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  } else if (persons.find((person) => person.number === body.number)) {
    return response.status(400).json({ error: "number must be unique" });
  }

  const person = {
    id: idGenerator(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
