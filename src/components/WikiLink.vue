<script setup lang="ts">
import { PropType } from 'vue';
import { ExternalLink } from 'lucide-vue-next';

defineProps({
  url: {
    type: String as PropType<string>,
    required: true
  }
});
</script>

<template>
  <a :href="url" target="_blank" rel="noopener noreferrer" class="text-amber-500 hover:text-zinc-200 text-sm flex items-center ml-2 mt-1">
    <ExternalLink class="w-5 h-5" />
  </a>
</template>
