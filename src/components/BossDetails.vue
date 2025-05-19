<script setup lang="ts">
import { PropType } from 'vue';
import type { LocationBossEntry } from '@/types/map';
import DifficultyBadge from './DifficultyBadge.vue';
import Check from './Check.vue';
import { ExternalLink } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';

defineProps({
  boss: {
    type: Object as PropType<LocationBossEntry>,
    required: true,
  },
  initialCheckedState: {
    type: Boolean as PropType<boolean>,
    default: false,
  }
});

const emit = defineEmits(['update:checked']);
</script>

<template>
  <div class="flex items-center justify-between p-3 bg-zinc-800 rounded-md border border-zinc-700 relative">
    <div class="flex-grow flex flex-col mr-4">
      <div class="flex items-center space-x-2 mb-1">
        <h4 class="text-zinc-100 text-lg gap-2 flex items-center">
          <a :href="boss.wiki" target="_blank" rel="noopener noreferrer" class="flex items-baseline gap-1 hover:underline">
            {{ boss.name }}
            <ExternalLink class="w-3 h-3 inline-block" />
          </a>
        </h4>

        <DifficultyBadge v-if="boss.difficulty" :value="boss.difficulty" />
      </div>

      <div class="flex items-center gap-2">
        <Badge variant="outline" class="text-xs border-0 p-0 font-normal text-zinc-400">
          {{ boss.optional ? 'Optional' : 'Mandatory' }}
        </Badge>
      </div>

      <div v-if="boss.notes" class="text-sm text-zinc-400 mt-3">
        {{ boss.notes }}
      </div>
    </div>

    <div class="flex-shrink-0">
      <Check
        :checked="initialCheckedState"
        @update:checked="(isChecked) => emit('update:checked', isChecked)"
      />
    </div>
  </div>
</template>
