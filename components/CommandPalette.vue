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
      <div class="mt-4">
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
      <div>
        Selected Keywords:{{ selected }}
      </div>
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
  wrapper: 'flex flex-col flex-1 min-h-0 divide-y divide-gray-100 dark:divide-gray-800',
  container: 'relative flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 scroll-py-2',
  input: {
    wrapper: 'relative flex items-center',
    base: 'w-full placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 text-gray-900 dark:text-white focus:ring-0 focus:outline-none ',
    padding: 'px-4',
    height: 'h-12',
    size: 'sm:text-sm',
    icon: {
      base: 'pointer-events-none absolute start-4 text-gray-400 dark:text-gray-500',
      loading: 'animate-spin',
      size: 'h-5 w-5',
      padding: 'ps-11',
    },
    closeButton: {
      base: 'absolute end-4',
      padding: 'pe-10',
    },
  },
  emptyState: {
    wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14',
    label: 'text-sm text-center text-gray-900 dark:text-white',
    queryLabel: 'text-sm text-center text-gray-900 dark:text-white',
    icon: 'w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-4',
  },
  group: {
    wrapper: 'p-2',
    label: 'px-2.5 my-2 text-xs font-semibold text-gray-900 dark:text-white',
    container: 'text-sm text-gray-700 dark:text-gray-200 max-h-[200px] overflow-scroll-y',
    command: {
      base: 'flex justify-between select-none items-center rounded-md px-2.5 py-1.5 gap-2 relative',
      active: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white',
      inactive: '',
      label: 'flex items-center gap-1.5 min-w-0',
      prefix: 'text-gray-400 dark:text-gray-500',
      suffix: 'text-gray-400 dark:text-gray-500',
      container: 'flex items-center gap-1.5 min-w-0',
      icon: {
        base: 'flex-shrink-0 w-5 h-5',
        active: 'text-gray-900 dark:text-white',
        inactive: 'text-gray-400 dark:text-gray-500',
      },
      selectedIcon: {
        base: 'h-5 w-5 text-gray-900 dark:text-white flex-shrink-0',
      },
      avatar: {
        base: 'flex-shrink-0',
        size: '2xs',
      },
      chip: {
        base: 'flex-shrink-0 w-2 h-2 mx-1 rounded-full',
      },
      disabled: 'opacity-50',
      shortcuts: 'hidden md:inline-flex flex-shrink-0 gap-0.5',
    },
    active: 'flex-shrink-0 text-gray-500 dark:text-gray-400',
    inactive: 'flex-shrink-0 text-gray-500 dark:text-gray-400',
  },
  default: {
    icon: 'i-heroicons-magnifying-glass-20-solid',
    loadingIcon: 'i-heroicons-arrow-path-20-solid',
    emptyState: {
      icon: 'i-heroicons-magnifying-glass-20-solid',
      label: "We couldn't find any items.",
      queryLabel: "We couldn't find any items with that term. Please try again.",
    },
    closeButton: null,
    selectedIcon: 'i-heroicons-check-20-solid',
  },
}
const isOpen = ref(false)
const selected = ref([])
// Log to check if items are being passed correctly
console.log('Command Items in Child Component:', props.items);
const emit = defineEmits(['add-new-keyword']);
const newKeyword = ref('');

// Function to add a new keyword
const addKeyword = () => {
  const trimmedKeyword = newKeyword.value.trim().toLowerCase();

  // Emit the new keyword to the parent component if it's valid
  if (trimmedKeyword && !props.items.includes(trimmedKeyword)) {
    emit('add-new-keyword', trimmedKeyword); // Emit the event to the parent
    newKeyword.value = ''; // Reset the input field
  } else {
    alert('Keyword is either empty or already exists.');
  }
};
</script>


<style scoped>
.UCommandPalette {
  border: 1px solid red;
  background-color: lightyellow;
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
