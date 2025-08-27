import { useState, useEffect } from "react";
import axios from "axios";

const Filter = ({ filter, handleFilter }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilter} />
    </div>
  );
};

const PersonForm = ({
  newName,
  handleNewName,
  newNumber,
  handleNewNumber,
  addPerson,
}) => {
  return (
    <form>
      <h2>Add a new</h2>
      <div>
        name: <input value={newName} onChange={handleNewName} />
      </div>
      <div>
        number:{" "}
        <input value={newNumber} type="tel" onChange={handleNewNumber} />
      </div>
      <div>
        <button type="submit" onClick={addPerson}>
          add
        </button>
      </div>
    </form>
  );
};

const Persons = ({ persons, filter }) => {
  if (filter !== "") {
    persons = persons.filter((person) =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  return (
    <ul>
      {persons.map((person) => (
        <li key={person.name}>
          {person.name} {person.number}
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  }, []);

  const handleFilter = (event) => {
    console.log(event.target.value);
    setFilter(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    if (
      persons.some((person) => person.name === newName) ||
      persons.some((person) => person.number === newNumber)
    ) {
      alert(`${newName} is already added to phonebook`);
    } else if (newName === "") {
      alert("Name cannot be empty");
    } else if (newNumber === "") {
      alert("Number cannot be empty");
    } else {
      setPersons(persons.concat(personObject));
      setNewName("");
      setNewNumber("");
    }
  };

  const handleNewName = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNewNumber = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilter={handleFilter} />
      <PersonForm
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} />
    </div>
  );
};

export default App;
