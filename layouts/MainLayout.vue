<template>
  <div id="mainLayout" class="h-screen">
    <div class="
      dark:bg-slate-800 
      bg-slate-500 
      dark:text-pistachio-500 
      text-pistachio-500 
      flex 
      w-full 
      justify-between 
      p-2 
      border-b-2 
      dark:border-slate-700
      ">
      <button @click="toggleTheme">
        <template v-if="isDarkMode">
          <UIcon name="mdi:moon-waning-crescent" color="pistachio" />
        </template>
        <template v-else>
          <UIcon name="mdi:white-balance-sunny" color="pistachio" />
        </template>
      </button>
      <div class="w-full mx-auto max-w-[1200px]">
        <div id="topMenu" class="w-full flex items-center justify-center px-2 h-10 my-2">
          <img src="/threads-logo.png" class="w-[35px]" alt="">
        </div>
      </div>
      <div class="flex items-center" v-if="user">
        <img class="rounded-full h-[35px]" :src="user.user_metadata.avatar_url" alt="">
        <div class="hidden md:flex text-xs dark:text-white text-slate-700 ml-2 font-semibold text-[18px]">{{ initials }}</div>
        <button  
          @click="userStore.isLogoutOverlay = true"
          class="ml-2"
        >
          <UIcon name="i-heroicons:arrow-right-end-on-rectangle" class="w-6 h-6" />
        </button>
      </div>
    </div>

    <div class="flex w-full max-w-[1200px] mx-auto h-screen">
      <slot />
    </div>

    <!-- <div id="bottomNav" class="fixed z-50 bottom-0 flex w-full h-[70px] border-t border-t-gray-700 bg-black">
      <div class="flex w-full max-w-[1200px] mx-auto flex items-center justify-around">
        <button  
          @click="navigateTo('/john')"
          class="w-full h-full"
        >
          <UIcon name="i-heroicons-light-bulb" class="text-white w-10 h-10" />
        </button>
        <button  
          @click="userStore.isMenuOverlay = true"
          class="w-full h-full"
        >
          <UIcon name="i-heroicons:pencil-square-solid" class="text-white w-10 h-10" />
        </button>
        <button  
          @click="userStore.isLogoutOverlay = true"
          class="w-full h-full"
        >
          <UIcon name="i-heroicons:arrow-right-end-on-rectangle" class="text-white w-10 h-10" />
        </button>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router'; // To handle redirection
const userStore = useUserStore();
const user = useSupabaseUser();
const router = useRouter();
const isDarkMode = ref(false);

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Computed property to extract initials from user's full name
const initials = computed(() => {
  if (user.value?.user_metadata?.full_name) {
    return user.value.user_metadata.full_name
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('');
  }
  return '';
});

// Redirect to /auth if no user is logged in
onMounted(() => {
  if (!user.value) {
    router.push('/auth'); // Redirect to /auth
  }
});
</script>

<style scoped>
body {
  background-color: white;
  color: black;
}

/* Dark mode styles */
.dark body {
  background-color: black;
  color: white;
}
</style>