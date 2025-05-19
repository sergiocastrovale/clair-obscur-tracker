<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import type { LocationPin } from '@/types/map';
import BossDetails from '@/components/BossDetails.vue';
import Notes from '@/components/Notes.vue';
import WikiLink from '@/components/WikiLink.vue';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Check from './Check.vue';
import { useMapStore } from '@/stores/mapStore';

const props = defineProps<{
  location: LocationPin;
}>();

const mapStore = useMapStore();

const locationIsChecked = ref(false);
const bossCheckedStates = ref<Record<string, boolean>>({});

onMounted(() => {
  locationIsChecked.value = mapStore.getLocationSelfState(props.location.label);
  props.location.details?.bosses?.forEach(boss => {
    bossCheckedStates.value[boss.name] = mapStore.getBossState(props.location.label, boss.name);
  });
});

watch(() => props.location.label, (newLabel) => {
  locationIsChecked.value = mapStore.getLocationSelfState(newLabel);
  const newBossStates: Record<string, boolean> = {};
  props.location.details?.bosses?.forEach(boss => {
    newBossStates[boss.name] = mapStore.getBossState(newLabel, boss.name);
  });
  bossCheckedStates.value = newBossStates;
});

watch(() => props.location.details?.bosses, (newBosses) => {
  const newBossStates: Record<string, boolean> = {};
  newBosses?.forEach(boss => {
    newBossStates[boss.name] = mapStore.getBossState(props.location.label, boss.name);
  });
  bossCheckedStates.value = newBossStates;
}, { deep: true });

const handleLocationCheckedUpdate = (isChecked: boolean) => {
  locationIsChecked.value = isChecked;
  mapStore.updateLocationSelfState(props.location.label, isChecked);
};

const handleBossCheckedUpdate = (bossName: string, isChecked: boolean) => {
  bossCheckedStates.value[bossName] = isChecked;
  mapStore.updateBossState(props.location.label, bossName, isChecked);
};

const getBossCheckedState = (bossName: string) => mapStore.getBossState(props.location.label, bossName);
</script>

<template>
  <DialogHeader>
    <DialogTitle class="text-amber-500 text-xl flex items-center">
      <span>{{ location.label }}</span>
      <WikiLink v-if="location.wiki" :url="location.wiki" class="mt-1 ml-1" />
      <div class="ml-auto">
        <Check
          :checked="locationIsChecked"
          @update:checked="handleLocationCheckedUpdate"
        />
      </div>
    </DialogTitle>
    <DialogDescription v-if="location.info" class="text-sm text-zinc-300 text-left mt-1">
      {{ location.info }}
    </DialogDescription>
  </DialogHeader>

  <div class="flex flex-col pb-4 max-h-[60vh] overflow-y-auto dialog-scroll-content pr-3">
    <Notes v-if="location.notes" :notes="location.notes" class="mb-4" />

    <div v-if="location.details?.bosses?.length">
      <h3 class="font-semibold text-amber-500 mb-2">Bosses</h3>
      <ul class="space-y-2">
        <li v-for="(boss) in location.details.bosses" :key="boss.name">
          <BossDetails
            :boss="boss"
            :initialCheckedState="bossCheckedStates[boss.name] || false"
            @update:checked="(isChecked) => handleBossCheckedUpdate(boss.name, isChecked)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
