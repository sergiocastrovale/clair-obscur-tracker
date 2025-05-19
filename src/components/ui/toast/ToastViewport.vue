<script setup>
import { reactiveOmit } from '@vueuse/core';
import { ToastViewport } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  hotkey: { type: Array, required: false },
  label: { type: [String, Function], required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
});

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
  <ToastViewport
    v-bind="delegatedProps"
    :class="
      cn(
        'fixed bottom-0 left-1/2 -translate-x-1/2 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col md:max-w-[420px]',
        props.class,
      )
    "
  />
</template>
