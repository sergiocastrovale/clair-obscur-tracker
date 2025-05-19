<script setup lang="ts">
import HideCompleted from '@/components/HideCompleted.vue';
import Search from '@/components/Search.vue';
import Export from '@/components/Export.vue';
import Import from '@/components/Import.vue';
import { useMapStore } from '@/stores/mapStore';

const mapStore = useMapStore();

const handleToggle = (value: boolean) => {
  mapStore.setHideCompleted(value);
};

const handleSearch = (query: string) => {
  mapStore.setSearchQuery(query);
};
</script>

<template>
  <div class="bg-stone-900 p-3">
    <div class="container mx-auto text-stone-400 flex flex-col md:flex-row md:items-center md:justify-between text-sm gap-3">
      <div class="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
        <Search @update:searchQuery="handleSearch" class="w-full md:w-64" />

        <div class="flex items-center gap-3 justify-between md:justify-start">
          <HideCompleted @toggleHideCompleted="handleToggle" />

          <div class="flex items-baseline gap-3 md:gap-1 pt-1 md:border-l md:border-stone-700 md:pl-3">
            <Export />
            <Import />
          </div>
        </div>
      </div>
      <div class="text-zinc-400 text-sm hidden md:block">Tip: shift + click to mark as completed!</div>
    </div>
  </div>
</template>
