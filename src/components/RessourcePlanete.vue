<script setup>
import { useVaisseauStore } from "@/stores/vaisseauStore";
import { computed, onMounted, defineProps, ref } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  typeRessource: String,
});

const route = useRoute();
const planete = ref([]);
const planetId = route.params.id;
const stock = ref(null);

onMounted(async () => {
  try {
    const response = await fetch(
      `http://localhost:1339/api/planetes/${planetId}?populate=*`
    );
    if (!response.ok) throw new Error("Erreur de réponse de l'API");
    const data = await response.json();
    planete.value = data;
    console.log(planete);
    stock.value =
      planete.value.data.attributes.ressources_planete.data.attributes[
        props.typeRessource
      ];
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données des planètes:",
      error
    );
  }
});

const vaisseauStore = useVaisseauStore();

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
    (ressources.value[props.typeRessource] / stock[props.typeRessource]) * 100
  )
);

const minFoodPercentage = computed(() => {
  if (props.typeRessource === "Nourriture") {
    const percentages = ["Fer", "Magnesium", "Carbone"].map((food) => {
      return Math.floor((ressources.value[food] / stock[food]) * 100);
    });
    return Math.min(...percentages);
  }
  return percentage;
});

const displayPercentage = computed(() => {
  return props.typeRessource === "Nourriture"
    ? minFoodPercentage.value
    : percentage.value;
});

const ressources = computed(() => vaisseauStore.ressources);

const ressourceStyle = computed(() => ({
  background: `linear-gradient(to top, ${colors[props.typeRessource]} 0%, ${
    colors[props.typeRessource]
  } 100%)`,
}));

const fetchRessources = () => {
  vaisseauStore.fetchRessourcesVaisseau();
};

onMounted(() => {
  fetchRessources();
});
</script>

<template>
  <div
    :class="`ressource ${props.typeRessource}`"
    :style="ressourceStyle"
    v-if="planete"
  >
    <h2 class="ressource__name">{{ typeRessource }}</h2>

    <p v-if="props.typeRessource !== 'Nourriture'" class="ressource__ratio">
      {{ stock }}
      <span class="unite">{{ unites[props.typeRessource] }}</span>
    </p>
    <p v-else class="ressource__ratio">10 jours restants</p>
    <p class="ressource__icon">
      <img :src="`src/assets/img/${icons[props.typeRessource]}`" />
    </p>
  </div>
</template>

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
</style>
