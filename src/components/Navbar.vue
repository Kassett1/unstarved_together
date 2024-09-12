<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
const isActive = (routeName) => {
  return route.path === routeName;
};
</script>

<template>
  <ul class="navbar">
    <li>
      <router-link to="/vaisseau">
        <img
          :src="
            isActive('/vaisseau')
              ? '/src/assets/img/Home_blue.svg'
              : '/src/assets/img/Home_white.svg'
          "
          alt=""
        />
        <p :style="{ color: isActive('/vaisseau') ? '#55C6E5' : '' }">HOME</p>
      </router-link>
    </li>
    <li>
      <router-link to="/map">
        <img
          :src="
            isActive('/map')
              ? '/src/assets/img/Map_blue.svg'
              : '/src/assets/img/Map_white.svg'
          "
          alt=""
        />
        <p :style="{ color: isActive('/map') ? '#55C6E5' : '' }">MAP</p>
      </router-link>
    </li>
    <li>
      <router-link to="/destination">
        <img
          :src="
            isActive('/destination')
              ? '/src/assets/img/Destination_blue.svg'
              : '/src/assets/img/Destination_white.svg'
          "
          alt=""
        />
        <p :style="{ color: isActive('/destination') ? '#55C6E5' : '' }">
          DESTINATION
        </p>
      </router-link>
    </li>
  </ul>
</template>

<style scoped>
.navbar {
  z-index: 2;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  border-top: 2px solid white;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: fit-content;
  gap: 2vh;
}

.navbar li {
  width: 100%;
}

.navbar li a {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: "Inter";
  gap: 1vh;
}
</style>
