<template>
  <div id="Modal" class="absolute top-0 left-0 grid place-items-center h-screen z-50 bottom-0 bg-black bg-opacity-50 backdrop-blur-md h-screen w-full">
    <div class="bg-black w-full max-w-[300px] rounded-lg text-white border border-gray-600 p-2">
      <button
        @click="userStore.isLogoutOverlay = false"
        class="flex items-center justify-between bg-black w-full p-3"
      >
        <div>Close Modal</div>
        <Icon name="mdi:close" size="25" />
      </button>
      <div class="border-b border-b-gray-700 my-1" />
      <button @click="logout" class="flex items-center justify-between bg-black w-full p-3">
        <div>Logout</div>
        <Icon name="material-symbols:logout-rounded" size="25" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const client = useSupabaseClient()

const logout = () => {
  client.auth.signOut()
  userStore.isLogoutOverlay = false
  return navigateTo('/auth')
}
</script>
