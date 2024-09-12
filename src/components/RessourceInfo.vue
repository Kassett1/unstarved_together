<template>
  <div
    style="position: relative"
    :class="`ressource ${props.typeRessource}`"
    :style="ressourceStyle"
  >
    <h2 class="ressource__name">{{ typeRessource }}</h2>

    <div
      class="svg-container"
      v-tooltip="{
        content: MessageTooltip,
        disabled: displayPercentage > 30,
        html: true
      }"
    >
      <svg
        v-if="displayPercentage < 30"
        class="button-alert"
        width="54"
        height="55"
        viewBox="0 0 54 55"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M42.4575 16.8623L43.2678 18.3014C45.6631 22.5599 46.8599 24.6886 46.8347 27.04C46.8086 29.3933 45.5655 31.5464 43.0753 35.8596L42.2341 37.3165C39.7449 41.628 38.4997 43.7847 36.4759 44.9821C34.451 46.1814 32.0101 46.2076 27.1255 46.2606L25.4731 46.2802C20.5886 46.3332 18.1467 46.3612 16.1479 45.2072C14.1492 44.0532 12.9514 41.9263 10.556 37.6678L9.74683 36.227C7.34944 31.9721 6.15371 29.8416 6.17883 27.4901C6.20499 25.1369 7.44805 22.9838 9.93832 18.6706L10.7795 17.2137C13.2697 12.9004 14.5138 10.7455 16.5377 9.54804C18.5626 8.34876 21.0035 8.32263 25.8891 8.2678L27.5405 8.24997C32.425 8.19694 34.8669 8.16901 36.8657 9.32299C38.8644 10.477 40.0622 12.6039 42.4575 16.8623Z"
          fill="#FF0000"
        />
        <path
          d="M32.4632 16.9484C32.82 17.1544 33.0805 17.4938 33.1871 17.8919C33.2938 18.2899 33.2379 18.714 33.0319 19.0709L26.8166 29.8362C26.6105 30.1931 26.2711 30.4535 25.8731 30.5602C25.475 30.6668 25.0509 30.611 24.694 30.4049C24.3371 30.1989 24.0767 29.8595 23.97 29.4614C23.8634 29.0634 23.9192 28.6393 24.1253 28.2824L30.3406 17.5171C30.5466 17.1602 30.886 16.8998 31.2841 16.7931C31.6821 16.6865 32.1063 16.7423 32.4632 16.9484ZM21.3274 36.2361C21.8032 36.5109 22.3687 36.5853 22.8995 36.4431C23.4302 36.3009 23.8827 35.9537 24.1575 35.4778C24.4322 35.0019 24.5066 34.4364 24.3644 33.9057C24.2222 33.375 23.875 32.9224 23.3991 32.6477C22.9233 32.373 22.3578 32.2985 21.827 32.4407C21.2963 32.5829 20.8438 32.9302 20.569 33.406C20.2943 33.8819 20.2199 34.4474 20.3621 34.9781C20.5043 35.5089 20.8515 35.9614 21.3274 36.2361Z"
          fill="black"
        />
      </svg>
    </div>

    <p class="ressource__percentage">{{ displayPercentage }}%</p>
    <p v-if="props.typeRessource !== 'Nourriture'" class="ressource__ratio">
      {{ Number(ressources[props.typeRessource]).toFixed(0) }}/{{
        maxStock[props.typeRessource]
      }}
      <span class="unite">{{ unites[props.typeRessource] }}</span>
    </p>
    <p v-else class="ressource__ratio">{{ consommation }} jours restants</p>
    <p class="ressource__icon">
      <img :src="`src/assets/img/${icons[props.typeRessource]}`" />
    </p>
  </div>
</template>

<script setup>
import { useVaisseauStore } from "@/stores/vaisseauStore";
import { computed, onMounted, defineProps, ref } from "vue";

const props = defineProps({
  typeRessource: String,
  ration: Boolean,
});

const vaisseauStore = useVaisseauStore();

const maxStock = {
  Nourriture: 800,
  Fer: 30000,
  Carbone: 30000,
  Magnesium: 30000,
  Eau: 60000,
  Oxygene: 10000,
  Carburant: 5000,
};

const icons = {
  Nourriture: "nourriture_icone.svg",
  Fer: "fer_icone.svg",
  Carbone: "carbone_icone.svg",
  Magnesium: "magnesium_icone.svg",
  Eau: "eau_icone.svg",
  Oxygene: "oxygene_icone.svg",
  Carburant: "carburant_icone.svg",
};

const colors = {
  Nourriture: "#2E6C35",
  Fer: "#984040",
  Carbone: "#5B6776",
  Magnesium: "#636232",
  Eau: "#15345E",
  Oxygene: "white",
  Carburant: "#1D1733",
};

const unites = {
  Nourriture: "",
  Fer: "kg",
  Carbone: "kg",
  Magnesium: "kg",
  Eau: "L",
  Oxygene: 10000,
  Carburant: "L",
};

const percentage = computed(() =>
  Math.floor(
    (ressources.value[props.typeRessource] / maxStock[props.typeRessource]) *
      100
  )
);

const MessageTooltip = computed(() => `
  <span class="warning-popup">Attention, vous manquez de cette ressource !</span>
`)

const minFoodPercentage = computed(() => {
  if (props.typeRessource === "Nourriture") {
    const percentages = ["Fer", "Magnesium", "Carbone"].map((food) => {
      return Math.floor((ressources.value[food] / maxStock[food]) * 100);
    });
    return Math.min(...percentages);
  }
  return percentage;
});

const minFoodResourceName = computed(() => {
  if (props.typeRessource === "Nourriture") {
    const resourcesWithPercentages = ["Fer", "Magnesium", "Carbone"].map(
      (food) => ({
        name: food,
        percentage: Math.floor((ressources.value[food] / maxStock[food]) * 100),
      })
    );

    const minResource = resourcesWithPercentages.reduce(
      (min, current) => {
        return current.percentage < min.percentage ? current : min;
      },
      { name: "", percentage: Infinity }
    );

    return minResource.name;
  }

  return "";
});

const displayPercentage = computed(() => {
  return props.typeRessource === "Nourriture"
    ? minFoodPercentage.value
    : percentage.value;
});

const ressources = computed(() => vaisseauStore.ressources);
const population = computed(() => vaisseauStore.population);

const consommation = computed(() => {
  // Quantité disponible de la ressource avec le minimum disponible
  const minimumRessource = ressources.value[minFoodResourceName.value];

  // Consommation totale de cette ressource par la population active par jour
  const consommationTotaleParJour = props.ration
    ? population.value.NB_Actifs * 2
    : population.value.NB_Actifs * 3;

  // Nombre de jours avant que la ressource ne soit épuisée
  const joursAvantEpuisement = minimumRessource / consommationTotaleParJour;

  return Math.floor(joursAvantEpuisement);
});

const ressourceStyle = computed(() => ({
  background: `linear-gradient(to top, ${colors[props.typeRessource]} ${
    displayPercentage.value
  }%, transparent ${displayPercentage.value}%)`,
}));

const fetchRessources = () => {
  vaisseauStore.fetchRessourcesVaisseau();
};

const fetchPopulation = () => {
  vaisseauStore.fetchPopulation();
};

onMounted(() => {
  fetchRessources();
  fetchPopulation();
});
</script>

<style scoped>
.ressource {
  border: 2px solid white;
  font-family: "Revolution";
  color: white;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  gap: 3vh;
}

.ressource__name,
.ressource__percentage,
.ressource__ratio,
.ressource__icon {
  text-align: center;
}

.button-alert {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -10%;
  right: -10px;
}

.ressource__name {
  padding-top: 4px;
  font-weight: bold;
  font-size: 24px;
}

.ressource__percentage {
  font-size: 18px;
}

.ressource__ratio {
  font-size: 16px;
  white-space: nowrap;
}

.unite {
  font-size: 12px;
}

.Nourriture,
.Fer,
.Carbone,
.Magnesium {
  padding: 1vh 1vw;
}

.Nourriture {
  padding: 1vh 5vw;
}

.Eau,
.Carburant {
  padding: 1vh 2vw;
}

.svg-container {
  position: relative;
}
</style>
