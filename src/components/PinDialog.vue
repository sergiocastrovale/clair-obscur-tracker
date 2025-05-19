<script setup lang="ts">
import { Dialog, DialogContent, DialogFooter, DialogClose, DialogTitle } from '@/components/ui/dialog';
import type { MapPin, LocationPin, BossPin } from '@/types/map';
import { isLocationPin, isBossPin } from '@/utils/pins';
import { PropType } from 'vue';
import Location from './Location.vue';
import Boss from './Boss.vue';

defineProps({
  pin: {
    type: Object as PropType<MapPin>,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'close']);

const handleOpenChange = (isOpen: boolean) => {
  emit('update:visible', isOpen);

  if (!isOpen) {
    emit('close');
  }
};
</script>

<template>
  <Dialog :open="visible" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[600px] bg-zinc-900 border-zinc-700 text-zinc-50">
      <DialogTitle class="sr-only">Pin Details</DialogTitle>
      <template v-if="isLocationPin(pin)">
        <Location :location="pin as LocationPin" />
      </template>
      <template v-else-if="isBossPin(pin)">
        <Boss :pin="pin as BossPin" />
      </template>
      <DialogFooter class="border-t border-zinc-700 pt-4">
        <DialogClose as-child>
          <button
            class="py-2 px-4 text-sm font-medium rounded-md border border-zinc-600 bg-zinc-700 text-zinc-50 cursor-pointer transition-colors duration-200 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            Close
          </button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
