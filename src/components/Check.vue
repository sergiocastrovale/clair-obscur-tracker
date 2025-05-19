<script setup lang="ts">
import { ref, PropType, watch } from 'vue';
import { Square, CheckSquare } from 'lucide-vue-next';

const props = defineProps({
  checked: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  size: {
    type: Number as PropType<number>,
    default: 7,
  }
});

const emit = defineEmits(['update:checked']);

const isChecked = ref(props.checked);

watch(() => props.checked, (newValue) => {
  isChecked.value = newValue;
});

const toggleCheckedState = () => {
  isChecked.value = !isChecked.value;
  emit('update:checked', isChecked.value);
};
</script>


<template>
  <div class="flex items-center">
    <button
      @click="toggleCheckedState"
      class="text-zinc-400 rounded-md transition-colors duration-150 group w-auto"
    >
      <component
        :is="isChecked ? CheckSquare : Square"
        :class="[
          `w-${props.size} h-${props.size}`,
          isChecked ? 'text-green-400 group-hover:text-green-300' : 'group-hover:text-yellow-400'
        ]"
      />
    </button>
  </div>
</template>
