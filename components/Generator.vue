<template>
  <div>
    <div class="h-auto w-[200px] my-6">
      <USelectMenu v-model="selectedTopic" :options="topic" />
    </div>
    <div v-if="selectedTopic === 'Personal'" class="flex w-25">
      <command-palette :items="keywords" @add-new-keyword="addNewKeyword" />
    </div>
    <UTabs :items="tabItems" @change="onChange" />
    
    <div class="mx-auto max-w-[1200px] overflow-hidden">
      <UInput type="text" v-model="help" />
      <UButton @click="sendHelp" label="Ask" />
      
      {{ helpRes.content }}
      
      <hr class="my-8">
      <div>
        <UInput  
          :icon="selectedIcon"
          color="yellow"
          size="xl"
          variant="outline"
          v-model="message" 
          :placeholder="message"
          class="custom-placeholder"
        />  
      </div>
      <div class="m-auto w-auto text-white py-6 text-center">
        <div v-html="rapRes.content"></div>
      </div>
      <div class="w-full text-center">
        <UButton
          class="text-center"
          :loading="isLoading" 
          icon="i-heroicons-sparkles-20-solid" 
          @click="sendMessage" 
          color="white" 
          label="Generate" 
          size="xl"
        />
      </div>
      
      <div id="posts" class="px-4 max-w-[1200px] mx-auto">
        <div v-if="isPosts" v-for="post in posts" :key="post">
          {{ post }}
        </div>
      </div>
      {{ selected }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "~/stores/user";

const userStore = useUserStore()
// const user = useSupabaseUser()

import CommandPalette from "../components/CommandPalette.vue" // Import the child component

const keywords = ref([
  { id: 1, label: 'family' },
  { id: 2, label: 'friends' },
  { id: 3, label: 'mum & dad' },
  { id: 4, label: 'brother' },
  { id: 5, label: 'sister' },
  { id: 6, label: 'Keir Starmer' },
  { id: 7, label: 'Liam Gallagher' },
  { id: 8, label: 'Jarvis Cocker' },
  { id: 9, label: 'King Charles' },
  { id: 10, label: 'Fleetwood Mac' },
  { id: 11, label: 'sexy' },
  { id: 12, label: 'rockin' },
  { id: 13, label: 'addiction' },
  { id: 14, label: 'respect' },
  { id: 15, label: 'money' },
  { id: 16, label: 'success' },
  { id: 17, label: 'love' },
  { id: 18, label: 'emptiness' },
  { id: 19, label: 'ambition' },
  { id: 20, label: 'London' },
]);

// Keywords and commandItems setup
// const keywords = ref(['Nuxt', 'Vue', 'JavaScript', 'Tailwind']);
// const commandItems = computed(() => {
//   const items = keywords.value.map((keyword) => ({
//     label: keyword.label.toLowerCase(),
//     value: keyword.label.toLowerCase(),
//   }));
//   console.log('Command Items in Parent Component:', items);
//   return items;
// });

// Handle new keyword addition
const addNewKeyword = (newKeyword) => {
  const trimmedKeyword = newKeyword.trim().toLowerCase(); // Ensure no leading/trailing spaces and convert to lowercase

  // Check if the keyword already exists in the list
  if (!keywords.value.some(keyword => keyword.label.toLowerCase() === trimmedKeyword)) {
    // Generate a new unique ID
    const newId = keywords.value.length > 0 ? keywords.value[keywords.value.length - 1].id + 1 : 1;

    // Add the new keyword as an object with id and label
    keywords.value.push({ id: newId, label: newKeyword });

    console.log('Keyword added:', { id: newId, label: newKeyword });
  } else {
    console.log('Keyword already exists');
  }
};

const tabItems = [
  { label: 'Rap', icon: 'i-heroicons-megaphone-20-solid' },
  { label: 'Poetry', icon: 'i-heroicons-musical-note-20-solid' },
  { label: 'Song', icon: 'i-heroicons-microphone-20-solid' },
  { label: 'Slogan', icon: 'i-heroicons-light-bulb-20-solid' }
];

const topic = ['Happy', 'Love', 'Sad', 'Anger', 'Emotional', 'Hatred', 'Jealousy', 'Funny', 'Thoughtful', 'Celebrational', 'Personal'];
const selectedTopic = ref(topic[0]);
const selectedType = ref(tabItems[0].label);
const selectedIcon = ref(tabItems[0].icon);
const help = ref("What can you help me with?");
const helpRes = ref("");
const rapRes = ref("");
const isLoading = ref(false);
let posts = ref([]);
let isPosts = ref(false);

onBeforeMount(() => {
  posts.value = [
    { name: "", image: "", text: "", picture: "" }
  ];
});

// Computed property that updates the message based on selected topic and type
const message = computed(() => `Create a ${selectedTopic.value} ${selectedType.value}`);

function onChange(index: any) {
  const item = tabItems[index];
  selectedType.value = item.label;
  selectedIcon.value = item.icon;
}

const sendHelp = async () => {
  helpRes.value = await $fetch('/api/ai', {
    method: 'POST',
    body: { message: help.value }
  });
  console.log("Help: ", helpRes);
};

const sendMessage = async () => {
  isLoading.value = true;
  rapRes.value = await $fetch('/api/ai', {
    method: 'POST',
    body: { message: message.value }  // Use computed message here
  });
  isLoading.value = false;
  console.log("Message: ", message.value);
};

// Watch for changes in selectedTopic and update the placeholder message
watch(selectedTopic, (newValue, oldValue) => {
  console.log(`Topic changed from ${oldValue} to ${newValue}`);
});
</script>

<style>
.custom-placeholder input::placeholder {
  color: yellow;
  opacity: 1; /* Ensures full opacity for the placeholder */
}
</style>