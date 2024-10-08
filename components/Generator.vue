<template>
  <div class="flex flex-col mx-6">
    <div class="min-h-[346px] p-6 my-6 mx-auto max-w-[1200px] overflow-hidden flex md:flex-row flex-col dark:bg-slate-700 bg-white w-full rounded-md border-slate-200 border-2 justify-evenly">
      <!-- <div class="flex flex-row">
        <UInput type="text" v-model="help" />
        <UButton @click="sendHelp" label="Ask" />
      </div> -->
      {{ helpRes.content }}
      <div id="controls">
        <div class="h-auto w-[300px] my-6 mx-auto">
          <USelectMenu v-model="selectedTopic" class="h-auto z-1" :options="topic" />
          <small class="text-xs">personal allows you to add keywords</small>
          <div v-if="selectedTopic === 'Personal'" class="flex w-25">
            <CommandPalette :items="keywords" @updateSelected="handleSelectedUpdate" @add-new-keyword="addNewKeyword" />
          </div>
        </div>
        <div class="mb-6 flex w-full justify-center w-[300px]">
          <UTabs :items="tabItems" orientation="vertical" :ui="{ wrapper: 'flex items-center gap-4 justify-center w-auto', list: { width: 'flex items-center justify-center flex-col' } }" @change="onChange" />
        </div>
        <UInput 
          disabled 
          :icon="selectedIcon"
          :color="isDarkMode ? 'gray' : 'pistachio'"
          :ui="inputui"
          size="xl"
          variant="outline"
          v-model="message" 
          :placeholder="message"
        />    
      </div>
      <div id="generated" class="h-100 flex justify-evenly flex-col">
        <div class="w-full border-b-2 md:pb-4 pb-0 md:pt-0 pt-4">
          <ul class="flex flex-row justify-evenly md:text-2xl text-lg list-disc m-0 p-0">
            <li class="mx-6">Generate</li>
            <li class="mx-6">Design</li>
            <li class="mx-6">Post</li>
          </ul>
        </div>
        <div class="flex h-auto flex-col">
          <div class="m-auto w-auto pb-6 text-center h-auto overflow-scroll">
            <div v-html="rapRes.content"></div>
          </div>
          <div class="w-full text-center mb-6">
            <UButton
              class="text-center"
              color="pistachio"
              :loading="isLoading" 
              icon="i-heroicons-sparkles-20-solid" 
              @click="sendMessage" 
              label="Generate" 
              size="xl"
            />
          </div>
        </div>
        <!-- Canvas -->
        <!-- <div v-if="rapStore.rapText !== ''"> -->
        <div class="w-full text-center">
          <DesignModal 
            class="text-center"
          />
        </div>
        <!-- END Canvas -->
        <div v-if="rapStore.rapText !== ''">
          <CreatePost :message="rapRes.content" />
        </div>
      </div>
    </div>
    <div id="posts" class="px-4 max-w-[1200px] mx-auto flex flex-col md:flex-row md:flex-wrap">
        <div v-if="isPosts" v-for="post in posts" :key="post" class="md:w-[25%]">
          <Post :post="post" @isDeleted="posts = userStore.getAllPosts" />
        </div>
        <div v-else>
          <client-only>
            <div v-if="isLoading" class="mt-20 w-full flex items-center justify-center mx-auto">
              <div class="mx-auto flex flex-col items-center justify-center">
                <Icon name="eos-icons:bubble-loading" color="white" size="50" />
                <div class="w-full mt-1">Loading...</div>
              </div>
            </div>
            <div v-if="!isLoading" class="mt-20 w-full flex items-center justify-center  mx-auto">
              <div class="mx-auto flex flex-col items-center justify-center">
                <Icon name="tabler:mood-empty" color="white" size="50" />
                <div class="w-full mt-1">Make the first post!</div>
              </div>
            </div>
          </client-only>
        </div>
        <!-- <CreatePost 
          :class="[
            {'max-h-[100vh] transition-all duration-200 ease-in visible': userStore.isMenuOverlay },
            {'max-h-0 transition-all duration-200 ease-out invisible': !userStore.isMenuOverlay },
          ]"
        /> -->
        <Modal 
          :class="[
            {'max-h-[100vh] transition-all duration-200 ease-in visible': userStore.isLogoutOverlay },
            {'max-h-0 transition-all duration-200 ease-out invisible': !userStore.isLogoutOverlay },
          ]"
        />
      </div>
      {{ selected }}
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "~/stores/user";
import { useCanvasStore } from "~/stores/canvas";
import { useRapStore } from "~/stores/rap";
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const canvasStore = useCanvasStore()
const rapStore = useRapStore()
const user = useSupabaseUser()
const router = useRouter()

import CommandPalette from "../components/CommandPalette.vue" // Import the child component
const isDarkMode = ref(false);

const checkDarkMode = () => {
  isDarkMode.value = document.documentElement.classList.contains('dark');
};

const inputui = {
  color: {
    white: {
      outline: 'shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
    },
    gray: {
      outline: 'shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
    },
    yellow: {
      outline: 'shadow-sm bg-yellow-50 dark:bg-gray-800 text-yellow-700 dark:text-white ring-1 ring-inset ring-yellow-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
    },
  },
};
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

// Handle new keyword addition
const addNewKeyword = (newKeyword: string) => {
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
const cleanRap = ref("");
const isLoading = ref(false);
let posts = ref([]);
let isPosts = ref(true);

onBeforeMount(async () => {
  try {
    isLoading.value = true
    await userStore.getAllPosts()
    isLoading.value = false
  } catch (error) {
    console.log(error)
  }
})
onMounted(() => {
  // Initial check
  checkDarkMode();

  // Watch for class changes
  watch(
    () => document.documentElement.classList.contains('dark'),
    (newVal) => {
      isDarkMode.value = newVal;
    }
  );
  watchEffect(() => {
    posts.value = userStore.posts
    if (userStore.posts && userStore.posts.length >= 1) {
      isPosts.value = true
    } else {
      isPosts.value = false
    }
  })
});
watchEffect(() => {
  if (!user.value) {
    // Avoid multiple redirects by checking the current route
    if (router.currentRoute.value.path !== '/') {
      router.push('/')
    }
  }
})
watch(() => posts.value, () => {
  posts.value = userStore.posts
  if (userStore.posts && userStore.posts.length >= 1) {
    isPosts.value = true
  } else {
    isPosts.value = false
  }
}, { deep: true })

// State in Generator for the selected keywords
const selectedKeywords = ref([]);
const handleSelectedUpdate = (newSelected: any) => {
  selectedKeywords.value = newSelected;
};
// Computed property that updates the message based on selected topic and type
// const message = computed(() => `Create a ${selectedTopic.value} ${selectedType.value}`);
const message = computed(() => {
  const keywordLabels = selectedKeywords.value.map(item => item.label).join(", ");

  return `Create ${selectedTopic.value} ${selectedType.value}${keywordLabels ? ` containing the keywords ${keywordLabels}` : ''}`;
});
function removeHtmlTags(message) {
  return message.replace(/<\/?[^>]+(>|$)/g, "");
}
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
  // console.log("Message: ", message.value);
  rapRes.value = await $fetch('/api/ai', {
    method: 'POST',
    body: { message: message.value }  // Use computed message here
  });
  isLoading.value = false;
  cleanRap.value = removeHtmlTags(rapRes.value.content)
  console.log("Clean Rap: ", cleanRap)
  canvasStore.textContent = cleanRap._value
  rapStore.setRapText(cleanRap)
};

// Watch for changes in selectedTopic and update the placeholder message
watch(selectedTopic, (newValue, oldValue) => {
  console.log(`Topic changed from ${oldValue} to ${newValue}`);
});
</script>

<style>

</style>