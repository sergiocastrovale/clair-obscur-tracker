<script setup lang="ts">
import { toast } from '@/components/ui/toast/use-toast';
import type { ToastProps } from '@/components/ui/toast/use-toast';

interface ShowToastParams {
  itemType: 'location' | 'boss';
  itemName: string;
  newState: boolean;
}

const show = (params: ShowToastParams) => {
  const { itemType, itemName, newState } = params;
  let toastMessage = '';
  let toastVariant: ToastProps['variant'] = 'success';

  if (itemType === 'location') {
    if (newState) {
      toastMessage = `Location "${itemName}" completed!`;
      toastVariant = 'success';
    } else {
      toastMessage = `Location "${itemName}" reset!`;
      toastVariant = 'warning';
    }
  } else if (itemType === 'boss') {
    if (newState) {
      toastMessage = `Boss "${itemName}" killed!`;
      toastVariant = 'success';
    } else {
      toastMessage = `Boss "${itemName}" reset!`;
      toastVariant = 'warning';
    }
  }

  if (toastMessage) {
    toast({ title: toastMessage, variant: toastVariant });
  }
};

defineExpose({
  show,
});
</script>

<template>
  <div></div>
</template>