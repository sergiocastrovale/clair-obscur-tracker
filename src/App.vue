<script setup>
import Header from './components/Header.vue';
</script>

<template>
  <div class="h-full overflow-hidden relative">
    <Header />
    <router-view />
  </div>
</template>
