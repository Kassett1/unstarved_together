import { defineStore } from "pinia";
import apiServices from "../services/api.services";

export const useVaisseauStore = defineStore("store", {
  state: () => ({
    population: [],
    ressources: [],
    coordonnees: [],
  }),
  getters: {},
  actions: {
    fetchCoordonneesVaisseau() {
      apiServices
        .fetchCoordonneesVaisseau()
        .then((coordonnees) => {
          console.log(coordonnees.data.attributes.X);
          this.coordonnees = coordonnees.data.attributes;
        })
        .catch((error) => console.error(error));
    },
    fetchPopulation() {
      apiServices
        .fetchPopulation()
        .then((population) => {
          this.population = population.data.attributes;
        })
        .catch((error) => console.error(error));
    },
    fetchRessourcesVaisseau() {
      apiServices
        .fetchRessourcesVaisseau()
        .then((ressources) => {
          this.ressources = ressources.data.attributes;
        })
        .catch((error) => console.error(error));
    },
    updatePopulation(nbCryo, nbTotal) {
      return apiServices.putPopulation({
        NB_Cryo: nbCryo,
        NB_Actifs: nbTotal - nbCryo
      })
    },
    setCoordonnees(nouvellesCoordonnees) {
      this.coordonnees = nouvellesCoordonnees;
    },
    deduireRessources(quantites) {
      this.ressources.Eau -= quantites.Eau;
      this.ressources.Carburant -= quantites.Carburant;
      this.ressources.Carbone -= quantites.Carbone;
      this.ressources.Magnesium -= quantites.Magnesium;
      this.ressources.Fer -= quantites.Fer;
    },
  },
});
