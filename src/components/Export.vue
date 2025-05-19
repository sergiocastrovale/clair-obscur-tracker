<script setup>
import { Download } from 'lucide-vue-next';
import { FILE_NAME, MAP_STORAGE_KEY } from '@/utils/constants';

const exportPins = () => {
  const pins = JSON.parse(localStorage.getItem(MAP_STORAGE_KEY)) || [];
  const jsonBlob = new Blob([JSON.stringify(pins, null, 2)], { type: 'application/json' });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${FILE_NAME}_${timestamp}.json`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(jsonBlob);
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(link.href);
};
</script>

<template>
  <div class="text-stone-300">
    <button @click="exportPins" class="cursor-pointer" title="Export data">
      <Download :size="18" />
    </button>
  </div>
</template>
