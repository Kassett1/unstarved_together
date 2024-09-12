<script setup>
import { computed, onMounted, ref } from "vue";
import RessourceInfo from "../components/RessourceInfo.vue";
import { useVaisseauStore } from "@/stores/vaisseauStore";

const vaisseauStore = useVaisseauStore();

const showPopup = ref(false);
const progressBarValue = ref(0);
const population = computed(() => vaisseauStore.population);
const totalPopulation = computed(() => {
  const activePopulation = parseInt(vaisseauStore.population.NB_Actifs);
  const cryoPopulation = parseInt(vaisseauStore.population.NB_Cryo);
  return activePopulation + cryoPopulation;
});

const ration = ref(false);

const openPopup = () => {
  progressBarValue.value = vaisseauStore.population.NB_Cryo;
  showPopup.value = true;
};

const closePopup = async () => {
  await vaisseauStore.updatePopulation(
    progressBarValue.value,
    totalPopulation.value
  );
  fetchPopulation();
  showPopup.value = false;
};

const fetchPopulation = () => {
  vaisseauStore.fetchPopulation();
};

const cryoStyle = computed(() => {
  const cryoPercentage =
    (population.value.NB_Cryo / totalPopulation.value) * 100;
  return {
    background: `linear-gradient(to right, #00F0FF ${cryoPercentage}%, white ${cryoPercentage}%)`,
  };
});

onMounted(() => {
  fetchPopulation();
});
</script>

<template>
  <div class="home-container">
    <section class="votre-vaisseau">
      <h1 class="vaisseau-titre">VOTRE VAISSEAU</h1>
      <img class="vaisseau-img" src="../assets/img/vaisseau.png" />
      <h2 class="vaisseau-subtitle">Arcadie</h2>
      <div class="cryogenisation">
        <p class="cryogenisation__title">Population Cryogénisée</p>
        <p class="cryogenisation__status" :style="cryoStyle"></p>
        <p class="cryogenisation__ratio">
          {{ population.NB_Cryo }}/{{ totalPopulation }}
        </p>
        <div class="cryogenisation__container">
          <button class="ration__button" @click="ration = !ration">
            {{ ration ? "Désactiver Mode Ration" : "Activer Mode Ration" }}
          </button>
          <button class="cryo__button" @click="openPopup">
            Modifier les cryogénisés
          </button>
          <div class="popup" v-if="showPopup">
            <div class="popup-content">
              <h2 class="popup-title">Personnes Cryogénisées</h2>
              <input
                class="barre"
                type="range"
                min="0"
                :max="totalPopulation"
                v-model="progressBarValue"
              />
              <button class="validate" @click="closePopup">Valider</button>
              <p class="progress-ratio">
                {{ progressBarValue }} / {{ totalPopulation }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ressources-container">
      <h2 class="ressources-titre">vos ressources</h2>
      <div class="infosRessources">
        <RessourceInfo typeRessource="Nourriture" :ration="ration" />
        <div class="ressources-1">
          <RessourceInfo typeRessource="Eau" />
          <RessourceInfo typeRessource="Carburant" />
        </div>
        <div class="ressources-2">
          <RessourceInfo typeRessource="Fer" />
          <RessourceInfo typeRessource="Carbone" />
          <RessourceInfo typeRessource="Magnesium" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  gap: 1vw;
}

/* vaisseau -------------------------------------------------------------------- */
.votre-vaisseau {
  flex: 2;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vh;
}

.vaisseau-titre {
  font-family: Revolution;
  font-weight: bold;
  font-size: 64px;
}

.vaisseau-img {
  max-height: 390px;
}

.vaisseau-subtitle {
  font-family: Futurist;
  font-size: 32px;
}

/* Cryogenisation -------------------------------------------------------------------- */

.cryogenisation {
  width: 75%;
  display: flex;
  flex-direction: column;
  gap: 1vh;
}

.cryogenisation__title {
  font-family: Revolution;
  font-size: 32px;
  font-weight: bold;
}

.cryogenisation__status {
  padding: 0.5vh 0;
  width: 100%;
}

.cryogenisation__ratio {
  align-self: flex-end;
  font-family: Revolution;
  font-size: 20px;
}

.cryogenisation__container {
  display: flex;
  flex-direction: row;
  gap: 1vw;
}

.ration__button,
.cryo__button {
  font-family: Revolution;
  font-weight: bold;
  font-size: 24px;
  padding: 0.5vh 1vw;
  cursor: pointer;
  border-radius: 15px;
  background-color: #ff0000;
  border-style: none;
  color: white;
  transition: transform 0.1s ease; /* Pour une transition douce hors de l'animation */
}

.ration__button:active,
.cryo__button:active,
 .validate:active{
  /* Quand le bouton est cliqué */
  animation: squish 0.2s ease; /* Applique l'animation */
}

.validate{
  cursor: pointer;
}

@keyframes squish {
  0% {
    padding-block: scale(1); /* État initial du bouton */
  }
  50% {
    transform: scale(
      0.9
    ); /* État "écrasé" du bouton, ajustez selon l'effet désiré */
  }
  100% {
    transform: scale(1); /* Retour à l'état initial */
  }
}

/* popup -------------------------------------------------------------------- */
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 39, 62, 0.9);
  padding: 15vh 20vw;
  border-radius: 25px;
  border: 2px solid white;
  z-index: 3;
}

.popup-title {
  font-family: Futurist;
  font-size: 32px;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3vh;
  text-align: center;
  color: white;
}

.progress-ratio {
  font-family: Revolution;
  font-size: 32px;
}

.validate {
  font-family: Revolution;
  font-weight: bold;
  font-size: 24px;
  padding: 0.5vh 1vw;
  border-radius: 15px;
  background-color: #5cd5eb;
  border-style: none;
  color: white;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  width: 40vw;
}
input[type="range"]::after,
input[type="range"]::before {
  content: "";
  height: 2rem;
  width: 3px;
  background: white;
  border-radius: 2px;
  display: block;
}
input[type="range"]::after {
  transform: translateX(-50%);
}
input[type="range"]::before {
  transform: translateX(50%);
}
/* Removes default focus */
input[type="range"]:focus {
  outline: none;
}

/***** Chrome, Safari, Opera and Edge Chromium styles *****/
/* slider track */
input[type="range"]::-webkit-slider-runnable-track {
  background-color: #ffffff;
  border-radius: 0.5rem;
  height: 3px;
}

/* slider thumb */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  margin-top: -12px; /* Centers thumb on the track */

  /*custom styles*/
  background-color: #ffffff;
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
}

/******** Firefox styles ********/
/* slider track */
input[type="range"]::-moz-range-track {
  background-color: #ffffff;
  border-radius: 0.5rem;
  height: 0.5rem;
}

/* slider thumb */
input[type="range"]::-moz-range-thumb {
  border: none; /*Removes extra border that FF applies*/
  border-radius: 50%; /*Removes default border-radius that FF applies*/

  /*custom styles*/
  background-color: #5cd5eb;
  height: 2rem;
  width: 2rem;
}

/* ressources -------------------------------------------------------------------- */
.ressources-container {
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

.ressources-1 > * {
  flex: 1;
}

.ressources-2 {
  gap: 1vw;
}
</style>
