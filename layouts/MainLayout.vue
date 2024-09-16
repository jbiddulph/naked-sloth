<template>
  <div id="mainLayout" class="h-screen">
    <div class="w-full mx-auto max-w-[1200px]">
      <div id="topMenu" class="w-full flex items-center justify-center px-2 h-10 my-2">
        <img src="/threads-logo.png" class="w-[35px]" alt="">
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
const userStore = useUserStore()
</script>
