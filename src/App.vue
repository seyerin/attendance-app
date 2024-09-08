<template>
  <div id="app">
    <router-view></router-view>
    <div v-if="$route.path !== '/face-camera' && $route.path !== '/face-comparison'" class="nav-container">
      <router-link to="/face-camera" class="nav-button" :class="{ active: $route.path === '/face-camera' }">Face Camera</router-link>
      <router-link to="/face-comparison" class="nav-button" :class="{ active: $route.path === '/face-comparison' }">Face Comparison</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
.nav-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.nav-button {
  display: inline-block;
  padding: 10px 20px;
  margin: 5px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.3s;
}

.nav-button:hover {
  background-color: #45a049;
  transform: scale(1.1);
}

.nav-button.active {
  background-color: #f44336;
  color: white;
  font-weight: bold;
}
</style>
