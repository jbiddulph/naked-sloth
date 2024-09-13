<template>
  <MainLayout>
    <div id="indexPage" class="w-full overflow-auto">
      <div class="mx-auto max-w-[1200px] overflow-hidden">
        <div id="posts" class="px-4 max-w-[1200px] mx-auto">
          <div v-if="isPosts" v-for="post in posts" :key="post">
            {{ post }}
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "~/layouts/MainLayout.vue";
import { useUserStore } from "~/stores/user";

const userStore = useUserStore()
// const user = useSupabaseUser()

let posts = ref([]);
let isPosts = ref(false);
let isLoading = ref(false);

onBeforeMount(() => {
  posts.value = [
    {
      name: "",
      image: "",
      text: "",
      picture: "",
    }
  ]
})

</script>
