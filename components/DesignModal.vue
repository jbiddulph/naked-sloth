<template>
  <div>
    <UButton label="Design my Rapr" @click="isOpen = true" />

    <UModal v-model="isOpen" fullscreen>
      <UCard
        :ui="{
          base: 'h-full flex flex-col',
          rounded: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          body: {
            base: 'grow'
          }
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Design my Rapr
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <Canvas class="h-full" @downloaded="closeModal" />
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)

const closeModal = () => {
  isOpen.value = false
}
</script>


