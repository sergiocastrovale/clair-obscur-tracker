<script setup lang="ts">
import { useMapStore } from '@/stores/mapStore';
import { computed } from 'vue';
import Check from '@/components/Check.vue';

const mapStore = useMapStore();

const isChecked = computed(() => mapStore.hideCompletedItems);

const handleChange = (checked: boolean) => {
  mapStore.setHideCompleted(checked);
};
</script>

<template>
  <div class="flex items-center space-x-1">
    <Check id="hide-completed" :size="5" :checked="isChecked" @update:checked="handleChange" />
    <label for="hide-completed" class="text-sm text-zinc-300 select-none cursor-pointer">
      Hide Completed
    </label>
  </div>
</template>
