<script setup>
import { Analytics } from '@vercel/analytics/vue';
import Header from './components/Header.vue';
</script>

<template>
  <div class="h-full overflow-hidden relative">
    <Analytics />
    <Header />
    <router-view />
  </div>
</template>
