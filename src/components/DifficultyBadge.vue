<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { getDifficultyStyles } from '@/utils/difficultyStyles';

defineProps({
  value: {
    type: String,
    required: false
  },
});
</script>

<template>
  <Badge :class="getDifficultyStyles('badge', value)" class="text-xs shadow-none">
    {{ value }}
  </Badge>
</template>
