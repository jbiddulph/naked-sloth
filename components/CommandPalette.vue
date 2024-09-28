<template>
  <div>
    <UButton label="Add Keywords" @click="isOpen = true" />

    <UModal v-model="isOpen">
      <!-- Display the command palette -->
      <UCommandPalette
        v-model="selected"
        multiple
        nullable
        :ui="ui"
        :autoselect="false"
        :groups="[{ key: 'items', commands: items }]"
        :fuse="{ resultLimit: 100, fuseOptions: { threshold: 0.1 } }"
      />

      <!-- Input and button to add a new keyword -->
      <div class="mt-4 p-4">
        <UInput
          v-model="newKeyword"
          placeholder="Enter a new keyword"
          class="w-full"
        />
        <UButton
          @click="addKeyword"
          label="Add Keyword"
          color="green"
          class="mt-2"
        />
      </div>
      <!-- <div>
        Selected Keywords: {{ selected }}
      </div> -->
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const ui = {
  group: {
    container: 'text-md text-gray-700 dark:text-gray-200 max-h-[200px] overflow-scroll-y',
  },
};

const isOpen = ref(false);
const selected = ref([]);

// Emit events to the parent component
const emit = defineEmits(['add-new-keyword', 'updateSelected']);
const newKeyword = ref('');

// Function to add a new keyword
const addKeyword = () => {
  const trimmedKeyword = newKeyword.value.trim().toLowerCase();

  // Emit the new keyword to the parent component if it's valid
  if (trimmedKeyword && !props.items.some(item => item.label.toLowerCase() === trimmedKeyword)) {
    emit('add-new-keyword', trimmedKeyword); // Emit the event to the parent
    newKeyword.value = ''; // Reset the input field
  } else {
    alert('Keyword is either empty or already exists.');
  }
};

// Watch for changes in selected and emit updated selection to the parent
watch(selected, (newSelected) => {
  emit('updateSelected', newSelected);
});
</script>

<style scoped>
.UCommandPalette {
  border: 1px solid red;
  background-color: pistachio-500;
}
/* Optional styling for better UI */
.mt-4 {
  margin-top: 1rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.w-full {
  width: 100%;
}

#headlessui-combobox-options-v-52 {
  overflow: scroll;
  max-height: 300px;
}
</style>
