<script setup lang="ts">
import { defineProps, computed } from 'vue';
import type { BossPin } from '@/types/map';
import { useMapStore } from '@/stores/mapStore';
import Check from './Check.vue';
import WikiLink from './WikiLink.vue';
import Notes from './Notes.vue';

const props = defineProps<{
  pin: BossPin;
}>();

const mapStore = useMapStore();

const isChecked = computed(() => mapStore.getItemState(props.pin.label));
const id = computed(() => `${props.pin.label}_boss_check`);

const handleCheckedUpdate = (newCheckedState: boolean) => {
  mapStore.updateItemState(props.pin.label, newCheckedState);
};

const getDifficultyClass = (difficulty: string | undefined): string => {
  if (!difficulty) return '';
  return `difficulty-${difficulty.toLowerCase()}`;
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-xl text-amber-500 flex items-center">
        <span>{{ pin.label }}</span>
        <WikiLink v-if="pin.wiki" :url="pin.wiki" />
      </h2>

      <Check :id="id" :checked="isChecked" @update:checked="handleCheckedUpdate" />
    </div>

    <Notes v-if="pin.notes" :notes="pin.notes" class="mb-3" />

    <div v-if="pin.info" class="text-sm text-zinc-300 mb-2">
      <p>{{ pin.info }}</p>
    </div>

    <div v-if="pin.difficulty" class="text-sm">
      <span class="font-semibold text-zinc-300">Difficulty:</span> <span :class="getDifficultyClass(pin.difficulty)">{{ pin.difficulty }}</span>
    </div>
  </div>
</template>
