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
    <div class="container mx-auto text-stone-400 text-sm flex flex-col gap-3">
      <div class="w-full md:flex md:items-center md:justify-between">
        <div class="w-full md:flex md:items-center md:gap-3 md:w-auto">
          <Search @update:searchQuery="handleSearch" class="w-full md:w-64" />
          <div class="hidden md:block">
            <HideCompleted @toggleHideCompleted="handleToggle" />
          </div>
        </div>
        <div class="mt-2 flex flex-row items-center justify-between w-full md:mt-0 md:w-auto md:justify-end">
          <div class="block md:hidden">
            <HideCompleted @toggleHideCompleted="handleToggle" />
          </div>
          <div class="flex items-center gap-3">
            <Export />
            <Import />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
