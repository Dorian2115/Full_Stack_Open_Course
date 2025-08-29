import { useState, useEffect } from "react";
import axios from "axios";
import phoneService from "./services/phonebook";
import "./App.css";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="notification">{message}</div>;
};

const ErrorMessage = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

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

const Persons = ({ persons, filter, handleDelete }) => {
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
          <button onClick={() => handleDelete(person.id)}>delete</button>
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
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    phoneService.getNumbers().then((initialNumbers) => {
      setPersons(initialNumbers);
    });
  }, []);

  const handleFilter = (event) => {
    console.log(event.target.value);
    setFilter(event.target.value);
  };

  const handleDelete = (id) => {
    window.confirm("Delete this person?") &&
      phoneService.deleteNumber(id).then(() => {
        setNotification(`${persons.find((p) => p.id === id).name} deleted`);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
        setPersons(persons.filter((person) => person.id !== id));
        console.log("deleted person: " + id);
      });
  };

  const changeNumber = (newObject) => {
    const id = persons.find((person) => person.name === newName).id;
    phoneService
      .changeNumber(id, newObject)
      .then((returnedPerson) => {
        setPersons(
          persons.map((person) => (person.id === id ? returnedPerson : person))
        );
      })
      .catch(() => {
        setErrorMessage(
          `Information of ${newName} has already been removed from the server`
        );
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      });
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
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      ) && changeNumber(personObject);
      console.log("number updated");
    } else if (newName === "") {
      alert("Name cannot be empty");
    } else if (newNumber === "") {
      alert("Number cannot be empty");
    } else {
      phoneService.addNumber(personObject).then((returnedPerson) => {
        setNotification(`Added ${returnedPerson.name}`);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      });
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
      <Notification message={notification} />
      <ErrorMessage message={errorMessage} />
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
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
