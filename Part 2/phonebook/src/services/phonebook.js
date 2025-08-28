import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

const getNumbers = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const addNumber = (newObject) => {
  return axios.post(baseUrl, newObject).then((response) => response.data);
};

const changeNumber = (id, newObject) => {
  return axios
    .put(`${baseUrl}/${id}`, newObject)
    .then((response) => response.data);
};

const deleteNumber = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default {
  addNumber,
  changeNumber,
  getNumbers,
  deleteNumber,
};
