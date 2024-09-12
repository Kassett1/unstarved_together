<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import RessourcePlanete from "../components/RessourcePlanete.vue";
import { useVaisseauStore } from "@/stores/vaisseauStore";
import router from "@/router";

const route = useRoute();
const planete = ref(null);
const planetId = route.params.id;
const iconUrl = ref(null);

const vaisseauStore = useVaisseauStore();

const coordonnees_vaisseau = computed(() => vaisseauStore.coordonnees);

const ressources = computed(() => vaisseauStore.ressources);

console.log("Coordonnées vaisseau:", coordonnees_vaisseau.value);

const fetchCoordonneesVaisseau = () => {
  vaisseauStore.fetchCoordonneesVaisseau();
};

const fetchRessources = () => {
  vaisseauStore.fetchRessourcesVaisseau();
};

const population = computed(() => vaisseauStore.population);

const fetchPopulation = () => {
  vaisseauStore.fetchPopulation();
};

onMounted(async () => {

  fetchCoordonneesVaisseau();
  fetchRessources();
  fetchPopulation();

  try {
    const response = await fetch(
      `http://localhost:1339/api/planetes/${planetId}?populate=*`
    );
    if (!response.ok) throw new Error("Erreur de réponse de l'API");
    const data = await response.json();
    planete.value = data;
    iconUrl.value = `http://localhost:1339${planete.value.data.attributes.icone.data.attributes.url}`;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données des planètes:",
      error
    );
  }

  // Supposons que la vitesse de déplacement du vaisseau soit de 1 unité par jour (ajustez selon votre cas)
  const vitesseVaisseau = 4; // Unités par jour

  function calculerDistance(x1, y1, x2, y2) {
    // Calcul de la distance euclidienne
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  console.log("Coordonnées planete:", planete.value.data.attributes.coordonnees.x);

  const distance = calculerDistance(coordonnees_vaisseau.value.X, coordonnees_vaisseau.value.Y/2, planete.value.data.attributes.coordonnees.x, planete.value.data.attributes.coordonnees.y/2);
  const tempsJours = distance / vitesseVaisseau;

  console.log("Temps de voyage en jours:", tempsJours.toFixed(0));

  


});

const consommation = computed(() => {
  // Quantité disponible de la ressource avec le minimum disponible
  const minimumRessource = ressources.value[minFoodResourceName.value];
  // Consommation totale de cette ressource par la population active par jour
  const consommationTotaleParJour = population.value.NB_Actifs * 3;
  // Nombre de jours avant que la ressource ne soit épuisée
  const joursAvantEpuisement = minimumRessource / consommationTotaleParJour;

  return Math.floor(joursAvantEpuisement);

});

const minFoodResourceName = computed(() => {

  const resourcesWithPercentages = ["Fer", "Magnesium", "Carbone"].map(food => ({
    name: food,
    percentage: Math.floor((ressources.value[food] / maxStock[food]) * 100)
  }));

  const minResource = resourcesWithPercentages.reduce((min, current) => {
    return current.percentage < min.percentage ? current : min;
  }, { name: "", percentage: Infinity });

  return minResource.name;

});

const maxStock = {
  Nourriture: 800,
  Fer: 30000,
  Carbone: 30000,
  Magnesium: 30000,
  Eau: 60000,
  Oxygene: 10000,
  Carburant: 1000,
};

function calculerJoursRestants(quantiteDisponible, consommationParJour) {
  return Math.floor(quantiteDisponible / consommationParJour);
}

const joursRestantsEau = computed(() => {

  // Consommation totale de cette ressource par la population active par jour
  const consommationTotaleParJour = population.value.NB_Actifs * 2;
  // Nombre de jours avant que la ressource ne soit épuisée
  const joursAvantEpuisement = ressources.value.Eau / consommationTotaleParJour;

  return Math.floor(joursAvantEpuisement);

});

const joursRestantsCarburant = computed(() => {

// Consommation totale de cette ressource par la population active par jour
const consommationTotaleParJour = 100;
// Nombre de jours avant que la ressource ne soit épuisée
const joursAvantEpuisement = ressources.value.Carburant / consommationTotaleParJour;

return Math.floor(joursAvantEpuisement);

});

console.log("Eau disponible:", ressources.value.Eau);
console.log("Carburant disponible:", ressources.value.Carburant);
console.log("Nombre d'actifs:", population.value.NB_Actifs);
console.log("Consommation d'eau par personne par jour:", consommationEauParPersonneParJour);
console.log("Consommation de carburant par jour:", consommationCarburantParJour);


const consommationCarburantParJour = 100;

const consommationEauParPersonneParJour = 2;

const vitesseVaisseau = 4; // Unités par jour

function calculerDistance(x1, y1, x2, y2) {
  // Calcul de la distance euclidienne
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

const peutVoyager = computed(() => {
  // Assurez-vous d'avoir calculé le tempsJours pour le voyage actuel
  const tempsJours = calculerDistance(coordonnees_vaisseau.value.X, coordonnees_vaisseau.value.Y/2, planete.value.data.attributes.coordonnees.x, planete.value.data.attributes.coordonnees.y/2) / vitesseVaisseau;

  const assezDeau = joursRestantsEau.value >= tempsJours;
  const assezDeCarburant = joursRestantsCarburant.value >= tempsJours;
  const assezDeNourriture = consommation.value >= tempsJours;

  console.log(joursRestantsEau,joursRestantsEau,consommation.value)
  return assezDeau && assezDeCarburant && assezDeNourriture;
});

const consommationNourritureParJour = computed(() => population.value.NB_Actifs * 3);

const voyager = async () => {
  // Vérifier si le bouton est activé avant de continuer
  if (!peutVoyager.value) {
    console.warn("Le voyage n'est pas possible avec les ressources actuelles.");
    return;
  }

  try {
    await fetch('http://localhost:1339/api/coordonnees-vaisseau', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "data": {
          "X": planete.value.data.attributes.coordonnees.x,
          "Y": planete.value.data.attributes.coordonnees.y
        }
      })
    });

    console.log("Voyage effectué avec succès !");

    setTimeout(() => {
  router.push({ name: "map" });
}, 300);
    
  } catch (error) {
    console.error("Erreur lors de la mise à jour des coordonnées du vaisseau:", error);
  }

  const tempsJours = calculerDistance(coordonnees_vaisseau.value.X, coordonnees_vaisseau.value.Y/2, planete.value.data.attributes.coordonnees.x, planete.value.data.attributes.coordonnees.y*2) / vitesseVaisseau;

  const capacitesMax = {
    Eau: 60000,
    Fer: 30000,
    Carbone: 30000,
    Magnesium: 30000,
    Carburant: 5000,
  };
  console.log("eau",planete.value.data.attributes.ressources_planete.data.attributes.Eau)
// Calcul de la consommation d'eau
let consommationEau = parseInt(planete.value.data.attributes.ressources_planete.data.attributes.Eau) > 0 
                        ? capacitesMax.Eau 
                        : consommationEauParPersonneParJour * population.value.NB_Actifs * tempsJours;

// Calcul de la consommation de fer
let consommationFer = planete.value.data.attributes.ressources_planete.Fer 
                        ? capacitesMax.Fer 
                        : consommationNourritureParJour.value * tempsJours;

// Calcul de la consommation de carbone
let consommationCarbone = parseInt(planete.value.data.attributes.ressources_planete.data.attributes.Carbone) > 0 
                            ? capacitesMax.Carbone 
                            : consommationNourritureParJour.value * tempsJours;

// Calcul de la consommation de magnésium
let consommationMagnesium = parseInt(planete.value.data.attributes.ressources_planete.data.attributes.Carbone) > 0 
                                ? capacitesMax.Magnesium 
                                : consommationNourritureParJour.value * tempsJours;

// Calcul de la consommation de carburant
let consommationCarburant = parseInt(planete.value.data.attributes.ressources_planete.data.attributes.Carbone) > 0 
                                ? capacitesMax.Carburant 
                                : consommationCarburantParJour * tempsJours;

  try {
    await fetch('http://localhost:1339/api/ressource-vaisseau', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "data": {
          "Fer": consommationFer.toString(),
          "Carbone": consommationCarbone.toString(),
          "Magnesium": consommationMagnesium.toString(),
          "Eau": consommationEau.toString(),
          "Oxygene": "10000",
          "Carburant": consommationCarburant.toString()
        }
      })
    });

    console.log("Les ressources du vaisseau ont été mises à jour avec succès.");
  } catch (error) {
    console.error("Erreur lors de la mise à jour des ressources du vaisseau:", error);
  }

};




</script>

<template>
  <div v-if="planete" class="destination">
    <section class="planete">
      <h1>Vous voyagez vers :</h1>
      <img class="rotation" :src="iconUrl" alt="" />
      <h2>{{ planete.data.attributes.nom }}</h2>
    </section>
    <button class="button-GO" :class="{ 'disabled': !peutVoyager }" :disabled="!peutVoyager" @click="voyager">GO</button>
    <section class="ressources">
      <h2 class="ressources-titre">Ressources de la planete</h2>
      
      <div class="infosRessources">
        <div class="ressources-1">
          <RessourcePlanete typeRessource="Eau" />
          <RessourcePlanete typeRessource="Carburant" />
        </div>
        
        <div class="ressources-2">
          <RessourcePlanete typeRessource="Fer" />
          <RessourcePlanete typeRessource="Carbone" />
          <RessourcePlanete typeRessource="Magnesium" />
        </div>
      </div>
    </section>
    
  </div>
</template>

<style scoped>
.destination {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  gap: 1vw;
  background-color: black;
  color: white;
}

.planete {
  flex: 2;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vh;
}

.planete h1 {
  font-family: Revolution;
  font-weight: bold;
  font-size: 64px;
}

.planete img {
  width: 45%;
}
.rotation {

animation: rotate 100s linear infinite;
}

@keyframes rotate {
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
}

.button-GO{
  width: 10vw;
  font-size: 8rem;
  background-color: red;
  position: absolute;
  left: 50%;
  height: 15vh;
  color: white;
  border: 5px solid rgb(88, 0, 0);
  font-family: 'Revolution Bold';
  -webkit-text-stroke: 2px black;
}

.disabled{
  background-color: grey !important;
  color: grey !important;
  border: 5px solid rgb(53, 53, 53);
}

.planete h2 {
  font-family: Futurist;
  font-size: 32px;
}

.ressources {
  flex: 1;
  margin-right: 1vw;
}

.ressources-titre {
  color: white;
  font-size: 20px;
  text-align: center;
  text-transform: uppercase;
  font-family: Futurist;
  margin-bottom: 1vh;
}

.infosRessources {
  border: 2px solid white;
  border-radius: 28px;
  padding: 3vh 1vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3vh;
}

.ressources-1,
.ressources-2 {
  display: flex;
}

.ressources-1 {
  padding-left: 2vw;
  padding-right: 2vw;
  width: 100%;
  justify-content: center;
  gap: 2vw;
}

.ressources-1>* {
  flex: 1;
}

.ressources-2 {
  gap: 1vw;
}
</style>
