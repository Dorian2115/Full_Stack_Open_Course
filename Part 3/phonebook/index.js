require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./modules/person.js");
const mongoose = require("mongoose");

const PORT = process.env.PORT;
const staticFiles = __dirname + "/dist/";

const app = express();
app.use(express.json());
app.use(express.static("dist"));

morgan.token("body", (request) => {
  return request.body ? JSON.stringify(request.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (request, response) => {
  response.send(staticFiles + "index.html");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  response.send(
    `<div><p>persons has information for ${
      Person.length
    } people</p><p>${new Date()}</p></div>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  //findByIdAndRemove is deprecated - use findByIdAndDelete instead
  Person.findByIdAndDelete(id).then(() => {
    response.status(204).end();
  });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "content missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
