// stores/useImageStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDesignStore = defineStore('designStore', () => {
  const fileData = ref(null);
  const fileDisplay = ref(null);

  const setImageData = (dataUrl, file) => {
    fileDisplay.value = dataUrl;
    fileData.value = file;
  };

  const clearImageData = () => {
    fileDisplay.value = null;
    fileData.value = null;
  };

  return {
    fileData,
    fileDisplay,
    setImageData,
    clearImageData,
  };
});
