import axios from "../config/axios";

const fetchCoordonneesVaisseau = () => {
  return axios.get("/coordonnees-vaisseau").then((response) => response.data);
};

const fetchPopulation = () => {
  return axios.get("/population").then((response) => response.data);
};

const fetchRessourcesVaisseau = () => {
  return axios.get("/ressource-vaisseau").then((response) => response.data);
};

const putPopulation = (data) => {
  return axios.put('/population', {data})
}



export default {
  fetchCoordonneesVaisseau,
  fetchPopulation,
  fetchRessourcesVaisseau,
  putPopulation
};
