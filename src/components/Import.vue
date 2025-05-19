<script setup>
import { Upload } from 'lucide-vue-next';
import { MAP_STORAGE_KEY } from '@/utils/constants';

const importPins = (event) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const pins = JSON.parse(e.target.result);
        localStorage.setItem(MAP_STORAGE_KEY, JSON.stringify(pins));
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Failed to import pin data.');
      }
    };

    reader.onerror = () => {
      console.error('Error reading the file.');
      alert('Failed to read the file.');
    };

    try {
      reader.readAsText(file);
    } catch (error) {
      console.error('Error initiating file read:', error);
      alert('Failed to read the file. Are you sure it is a JSON file and the format is correct?');
    } finally {
      window.location.reload();
    }
  }
};
</script>

<template>
  <div class="text-stone-300" title="Import saved data">
    <label for="file-input">
      <Upload :size="18" class="cursor-pointer" />
    </label>
    <input id="file-input" type="file" @change="importPins" accept=".json" class="hidden" />
  </div>
</template>
