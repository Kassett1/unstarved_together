import { createRouter, createWebHashHistory } from "vue-router";
import Vaisseau from "./pages/PageVaisseau.vue";
import Destination from "./pages/PageDestination.vue";
import DestinationFinale from "./pages/PageDestinationFinale.vue";
import Carte from "./components/Carte.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      alias: "/vaisseau",
      name: "vaisseau",
      component: Vaisseau,
    },
    {
      path: "/destination/:id",
      name: "destination",
      component: Destination,
    },
    {
      path: "/destination",
      name: "destinationFinal",
      component: DestinationFinale,
    },
    {
      path: "/map",
      name: "map",
      component: Carte,
    },
    {
      // Redirige toutes les autres URL vers Vaisseau (ou "/")
      path: "/:catchAll(.*)",
      redirect: { name: "vaisseau" },
    },
  ],
});

export default router;
