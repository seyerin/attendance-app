<template>
  <div id="app">
    <router-view></router-view>
    <div v-if="$route.path !== '/face-camera' && $route.path !== '/face-comparison'">
      <router-link to="/face-camera">Go to Face Camera</router-link>
      <router-link to="/face-comparison">Go to Face Comparison</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>
<style>
/* Your styles here */
</style>
