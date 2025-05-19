<script setup lang="ts">
import { ref, watch } from 'vue';

const searchQuery = ref('');
const emit = defineEmits(['update:searchQuery']);

let debounceTimer: number | undefined = undefined;

watch(searchQuery, (newValue) => {
  clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(() => {
    if (newValue.length > 2 || newValue.length === 0) {
      emit('update:searchQuery', newValue);
    }
  }, 300);
});

</script>

<template>
  <div class="flex items-center">
    <label for="search" class="sr-only">Search pins:</label>
    <input
      type="text"
      id="search"
      v-model="searchQuery"
      placeholder="Search locations or bosses..."
      class="bg-stone-800 border border-stone-700 text-stone-300 text-sm rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 block w-full p-3 md:p-2 placeholder-stone-500 transition-colors duration-150"
    />
  </div>
</template>
