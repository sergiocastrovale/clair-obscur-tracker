<script setup lang="ts">
import { Info } from 'lucide-vue-next';
import type { PropType } from 'vue';

defineProps({
  notes: {
    type: String as PropType<string>,
    required: true
  }
});
</script>

<template>
  <div v-if="notes" class="notes-container p-0">
    <div class="bg-amber-800/30 border border-amber-700/50 text-amber-300 text-sm p-3 rounded-md flex items-start gap-3">
      <Info class="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
      <p class="leading-relaxed flex-grow">{{ notes }}</p>
    </div>
  </div>
</template>
