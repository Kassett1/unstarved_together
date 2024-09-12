<template>
    <select class="filtre" v-model="ressourceFiltre">
        <option value="">Toutes les ressources</option>
        <option value="Fer">Fer</option>
        <option value="Carbone">Carbone</option>
        <option value="Magnesium">Magnésium</option>
        <option value="Eau">Eau</option>
        <option value="Carburant">Carburant</option>
    </select>
    <div id="map" class="map"></div>
    <div v-if="isArrived" class="end-popup">Bravo, vous êtes arrivés !</div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "vue-router";

const planetes = ref([]);
const vaisseau = ref([]);
const coordonnees_vaisseau = ref({ X: 0, Y: 0 });
const router = useRouter();
const ressourceFiltre = ref("");
let map = null;
let marqueurs = [];

// Supposons que la vitesse de déplacement du vaisseau soit de 1 unité par jour (ajustez selon votre cas)
const vitesseVaisseau = 4; // Unités par jour

function calculerDistance(x1, y1, x2, y2) {
    // Calcul de la distance euclidienne
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

onMounted(async () => {
    try {
        const response = await fetch(
            "http://localhost:1339/api/planetes?populate=*"
        );
        if (!response.ok) throw new Error("Erreur de réponse de l'API");
        const data = await response.json();
        planetes.value = data;
        console.log("Données des planètes:", planetes.value.data);
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

    const latitude = -30;
    const longitude = 0;
    const zoomLevel = 2;
    const latMin = -90;
    const lonMin = -200;
    const latMax = 90;
    const lonMax = 200;

    const bounds = [
        [latMin, lonMin], // Coin inférieur gauche
        [latMax, lonMax], // Coin supérieur droit
    ];

    map = L.map("map", {
        center: [latitude, longitude],
        zoom: zoomLevel,
        maxBounds: [
            [latMin, lonMin],
            [latMax, lonMax],
        ],
        maxBoundsViscosity: 1.0,
    });

    L.tileLayer("", {
        attribution: "",
        maxZoom: 4,
        minZoom: 2,
    }).addTo(map);

    const vaisseauIcon = L.icon({
        iconUrl: "../src/assets/img/Vector_1.png",
        iconSize: [50, 50],
        iconAnchor: [25, 25],
    });

    vaisseauIcon.options.className = 'custom-vaisseau-icon';

    const isArrived = computed(() => {
  return (
    coordonnees_vaisseau.value.X === 75 && coordonnees_vaisseau.value.Y === 150
  );
});

    // Créer le marqueur du vaisseau sur la carte avec ses coordonnées
    const marker = L.marker(
        [coordonnees_vaisseau.value.X, coordonnees_vaisseau.value.Y],
        { icon: vaisseauIcon }
    )
        .addTo(map)
        .bindPopup('<b style="text-align: center;">Vaisseau Spatial</b>');

    planetes.value.data.forEach((planete) => {
        const iconUrl = `http://localhost:1339${planete.attributes.icone.data.attributes.url}`;

        // Crée un objet L.Icon personnalisé avec l'icône de la planète
        const customIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [25 * map.getZoom(), 25 * map.getZoom()],
            iconAnchor: [25, 25],
            popupAnchor: [180, 200],
        });

        const { x, y } = planete.attributes.coordonnees;

        let coutTrajet = 10000;

        let gainFer =
            ((planete.attributes.ressources_planete.data.attributes.Fer -
                coutTrajet) /
                vaisseau.value.data.attributes.Fer) *
            100;

        let gainCarbone =
            ((planete.attributes.ressources_planete.data.attributes.Carbone -
                coutTrajet) /
                vaisseau.value.data.attributes.Carbone) *
            100;

        let gainMagnesium =
            ((planete.attributes.ressources_planete.data.attributes.Magnesium -
                coutTrajet) /
                vaisseau.value.data.attributes.Magnesium) *
            100;

       

        console.log('distance x',coordonnees_vaisseau.value.X-x)
        console.log('distance y',coordonnees_vaisseau.value.Y-y)
        const distance = calculerDistance(
            coordonnees_vaisseau.value.X,
            coordonnees_vaisseau.value.Y/2,
            x,
            y/2
        );

        let gainCarbu =
            ((planete.attributes.ressources_planete.data.attributes.Carburant -
                distance*100) /
                vaisseau.value.data.attributes.Carburant) *
            100;
        const tempsJours = distance / vitesseVaisseau; // Calcul du temps nécessaire pour atteindre la planète

        const marqueur = L.marker([x, y], { icon: customIcon }).addTo(map)
            .bindPopup(`<h2>Trajet : ${tempsJours.toFixed(0)} jours</h2>
            <b style="font-size:3rem">${planete.attributes.nom}</b>
            
            <ul class="listpop">
                <li ${gainCarbu.toFixed(2) < 0 ? 'class="negatif"' : 'class="positif"'}>Carburant : ${gainCarbu.toFixed(2)}%</li>
                <li ${gainFer.toFixed(2) < 0 ? 'class="negatif"' : 'class="positif"'}>Fer : ${gainFer.toFixed(2)}%</li>
                <li ${gainCarbone.toFixed(2) < 0 ? 'class="negatif"' : 'class="positif"'}>Carbone : ${gainCarbone.toFixed(2)}%</li>
                <li ${gainMagnesium.toFixed(2) < 0 ? 'class="negatif"' : 'class="positif"'}>Magnesium : ${gainMagnesium.toFixed(2)}%</li>

            </ul>
            <button class="bouton-go" data-planet='${JSON.stringify(
                planete
            )}'>VOIR PLUS</button>`);

        marqueurs.push(marqueur);

        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("bouton-go")) {
                const planet = JSON.parse(event.target.getAttribute("data-planet"));
                navigateToDestination(planet);
            }
        });

        const navigateToDestination = (planet) => {
            router.push({ name: "destination", params: { id: planet.id } });
        };
    });

    console.log("test", coordonnees_vaisseau.value);
});

watch(ressourceFiltre, mettreAJourCarte);

function mettreAJourCarte() {
    console.log("Mise à jour de la carte avec le filtre :", ressourceFiltre.value);
    if (!map) return;

    // Supprimez tous les marqueurs existants
    marqueurs.forEach(marqueur => map.removeLayer(marqueur));
    marqueurs = []; // Réinitialisez le tableau des marqueurs
    console.log("Marqueurs supprimés")
    console.log("Planètes :", planetes.value)

    const planetesFiltrees = ressourceFiltre.value !== ""
        ? planetes.value.data.filter(planete =>
            planete.attributes.ressources_planete.data.attributes[ressourceFiltre.value] > 0)
        : planetes.value.data;

    planetesFiltrees.forEach(planete => {
        const iconUrl = `http://localhost:1339${planete.attributes.icone.data.attributes.url}`;

        // Crée un objet L.Icon personnalisé avec l'icône de la planète
        const customIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [25 * map.getZoom(), 25 * map.getZoom()],
            iconAnchor: [25, 25],
            popupAnchor: [180, 200],
        });

        const { x, y } = planete.attributes.coordonnees;

        let coutTrajet = 10000;

        let gainFer =
            ((planete.attributes.ressources_planete.data.attributes.Fer -
                coutTrajet) /
                vaisseau.value.data.attributes.Fer) *
            100;

        let gainCarbone =
            ((planete.attributes.ressources_planete.data.attributes.Carbone -
                coutTrajet) /
                vaisseau.value.data.attributes.Carbone) *
            100;

        let gainMagnesium =
            ((planete.attributes.ressources_planete.data.attributes.Magnesium -
                coutTrajet) /
                vaisseau.value.data.attributes.Magnesium) *
            100;

        const distance = calculerDistance(
            coordonnees_vaisseau.value.X,
            coordonnees_vaisseau.value.Y,
            x,
            y
        );


        let gainCarbu =
            ((planete.attributes.ressources_planete.data.attributes.Carburant -
                distance*100) /
                vaisseau.value.data.attributes.Carburant) *
            100;
        const tempsJours = distance / vitesseVaisseau; // Calcul du temps nécessaire pour atteindre la planète


        const marqueur = L.marker([x, y], { icon: customIcon }).addTo(map)
            .bindPopup(`<h2>Trajet : ${tempsJours.toFixed(0)} jours</h2>
            <b style="font-size:3rem">${planete.attributes.nom}</b>
            
            <ul class="listpop">
                <li ${gainCarbu.toFixed(2) < 0 ? 'class="negatif"' : 'class="positif"'}>Carburant : ${gainCarbu.toFixed(2)}%</li>
                <li ${gainFer.toFixed(2) < 0 ? 'class="negatif"' : 'class="positif"'}>Fer : ${gainFer.toFixed(2)}%</li>
                <li ${gainCarbone.toFixed(2) < 0 ? 'class="negatif"' : 'class="positif"'}>Carbone : ${gainCarbone.toFixed(2)}%</li>
                <li ${gainMagnesium.toFixed(2) < 0 ? 'class="negatif"' : 'class="positif"'}>Magnesium : ${gainMagnesium.toFixed(2)}%</li>

            </ul>
            <button class="bouton-go" data-planet='${JSON.stringify(
                planete
            )}'>VOIR PLUS</button>`);

        marqueurs.push(marqueur);

        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("bouton-go")) {
                const planet = JSON.parse(event.target.getAttribute("data-planet"));
                navigateToDestination(planet);
            }
        });

        const navigateToDestination = (planet) => {
            router.push({ name: "destination", params: { id: planet.id } });
        };
    });
}


</script>

<style>
.positif {
    color: rgb(51, 255, 51);
}

.negatif {
    color: rgb(255, 45, 45);
}


.map {
    width: 100vw;
    height: 100vh;
    background-image: url("../assets/bg.jpg");
    background-size: cover;
}



.leaflet-container .leaflet-marker-icon {
    margin-left: -12px;
    margin-top: -24px;
}

.leaflet-container .leaflet-marker-shadow {
    display: none;
}

.leaflet-popup-content-wrapper {
    background-color: rgba(30, 30, 30, 0.8);
    border: solid white 3px;
    color: white;
    font-size: 1.3rem;

    li {
        list-style: none;
    }

    ul {
        padding: 0 !important;
        display: flex;
        flex-direction: column;
        gap: 1vh;
        margin-top: 2vh;
    }
}

.leaflet-popup-tip {
    display: none;
}

.custom-vaisseau-icon {
    z-index: 1000 !important; /* Définissez ici votre valeur de z-index */
}

#map>div.leaflet-pane.leaflet-map-pane>div.leaflet-pane.leaflet-popup-pane>div>div.leaflet-popup-content-wrapper>div {
    width: fit-content !important;
    min-width: 200px;
    display: flex;
    justify-content: center;
    height: fit-content;
    padding: 1vh 0;
    display: flex;
    flex-direction: column;
    font-family: "Revolution";
}

#map>div.leaflet-pane.leaflet-map-pane>div.leaflet-pane.leaflet-popup-pane>div>a {
    display: none;
}

.bouton-go {
    margin: 0;
    padding: 0;
    border: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    outline: none;
    /* Remove default focus outline */
    background-color: red;
    width: fit-content;
    padding: 0.6vh 1.5vw;
    margin-top: 2vh;
    margin-left: auto;
    font-family: "Revolution bold";
    border-radius: 16px;
}

.filtre {
    position: absolute;
    top: 5%;
    left: 5%;
    z-index: 1000;
}

.filtre {
    position: absolute;
    top: 5%;
    left: 5%;
    z-index: 1000;
    color: white; /* Couleur du texte */
    background-color: transparent; /* Fond transparent */
    border: 2px solid white; /* Bordure blanche */
    padding: 10px; /* Espacement interne pour le confort visuel */
    border-radius: 5px; /* Bords arrondis pour l'esthétique */
    font-size: 1rem; /* Taille de police ajustable selon vos besoins */
}

/* Styles pour changer l'apparence du menu déroulant lui-même */
.filtre option {
    background-color: #000000; /* Fond des options, ici noir pour contraste */
    color: white; /* Couleur du texte pour les options */
}

.end-popup {
  position: fixed; /* Ou 'absolute' selon le contexte */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: rgb(4, 170, 4);
  border: 1px solid #cccccc;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000; /* S'assurer qu'elle est au-dessus des autres éléments */
  text-align: center;
  font-family: Futurist;
  font-size: 40px;
  color: white;
}
</style>
