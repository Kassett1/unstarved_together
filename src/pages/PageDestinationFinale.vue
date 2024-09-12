<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import RessourcePlaneteFinal from "../components/RessourcePlaneteFinal.vue";

//const route = useRoute();
const planete = ref(null);
const planetId = ref(41);
const iconUrl = ref(null);
const coordonnees_vaisseau = ref({ X: 0, Y: 0 });
const vaisseau = ref([]);
const vitesseVaisseau = 4; // Unités par jour



function calculerDistance(x1, y1, x2, y2) {
    // Calcul de la distance euclidienne
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}


onMounted(async () => {
  try {
    const response = await fetch(
      `http://localhost:1339/api/planetes/${planetId.value}?populate=*`
    );
    
    if (!response.ok) throw new Error("Erreur de réponse de l'API");
    const data = await response.json();
    planete.value = data;
    console.log(planete.value.data.attributes)
    iconUrl.value = `http://localhost:1339${planete.value.data.attributes.icone.data.attributes.url}`;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données des planètes:",
      error
    );
  }

    try {
        const response = await fetch(
            "http://localhost:1339/api/coordonnees-vaisseau"
        );
        if (!response.ok) throw new Error("Erreur de réponse de l'API");
        const data = await response.json();
        coordonnees_vaisseau.value = data.data.attributes;
        console.log("Coordonnées vaisseau:", coordonnees_vaisseau.value.X);
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des données des coordonnées du vaisseau:",
            error
        );
    }

    try {
        const response = await fetch(
            "http://localhost:1339/api/ressource-vaisseau?populate=*"
        );
        if (!response.ok) throw new Error("Erreur de réponse de l'API");
        const data = await response.json();
        vaisseau.value = data;
        console.log("Données du vaisseau:", vaisseau.value.data.attributes);
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des données des planètes:",
            error
        );
    }
    
    console.log('planete :'+planete.value)

    const { x, y } = planete.value.data.attributes.coordonnees;
        const distance = calculerDistance(
            coordonnees_vaisseau.value.X,
            coordonnees_vaisseau.value.Y,
            
            x,
            y
        );


// Déclaration de vos variables et hooks...




 


});
const tempsJours = computed(() => {
  if (planete.value && coordonnees_vaisseau.value) {
    const { x, y } = planete.value.data.attributes.coordonnees;
    const distance = calculerDistance(
      coordonnees_vaisseau.value.X,
      coordonnees_vaisseau.value.Y/2,
      x,
      y/2
    );
    return distance / vitesseVaisseau;
  } else {
    return 0; // Valeur par défaut si les données ne sont pas encore chargées
  }
});

console.log("test", coordonnees_vaisseau.value);
    console.log('temps : '+ tempsJours.value)
</script>


<template>
  <div v-if="planete" class="destination">
    <section class="planete">
      <h1>Vous voyagez vers :</h1>
      <img class="rotation" :src="iconUrl" alt="" />
      <h2>{{ planete.data.attributes.nom }}</h2>
      <h2 style="font-size: 1.4rem;">votre voyage durera environ {{ tempsJours.toFixed(0) }} jours</h2>
    </section>
    <section class="ressources">
      <h2 class="ressources-titre">Ressources de la planete</h2>
      <div class="infosRessources">
        <div class="ressources-1">
          <RessourcePlaneteFinal typeRessource="Eau" />
          <RessourcePlaneteFinal typeRessource="Carburant" />
        </div>
        <div class="ressources-2">
          <RessourcePlaneteFinal typeRessource="Fer" />
          <RessourcePlaneteFinal typeRessource="Carbone" />
          <RessourcePlaneteFinal typeRessource="Magnesium" />
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

.ressources-1 > * {
  flex: 1;
}

.ressources-2 {
  gap: 1vw;
}
</style>

