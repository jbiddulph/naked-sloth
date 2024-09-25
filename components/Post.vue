<template>
  <div class="z-50 bottom-0 h-full w-full">
    <div py-2 w-full>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <img :src="post.image" class="rounded-full h-[35px] " alt="">
          <div class="ml-2 font-semibold text-[18px]">{{ post.name }}</div>
        </div>

        <div 
          v-if="user && user.identities && user.identities[0].user_id == post.userId"
          @click="isMenu = !isMenu" class="relative"
        >
          <button :disabled="isDeleting" class="flex items-center p-1 h-[24px] w-[24px] hover:bg-gray-800 rounded-full cursor-pointer" :class="isMenu ? 'bg-gray-800' : ''">
            <!-- <UIcon v-if="!isDeleting" name="i-heroicons-light-bulb" class="text-white w-10 h-10" />
            <UIcon v-else name="i-heroicons-light-bulb" class="text-white w-10 h-10" /> -->
            <UIcon v-if="!isDeleting" name="i-heroicons-ellipsis-vertical-16-solid" size="18" />
            <UIcon v-else name="i-heroicons-ellipsis-horizontal-circle-16-solid" size="18" />
          </button>
          <div v-if="isMenu" class="absolute border bordr-gray-600 right-0 z-20 mt-1 rounded">
            <button @click="deletePost(post.id, post.picture)" class="flex items-center rounded gap-2 text-red-500 justify-between bg-black w-full pl-4 pr-3 py-1 hover:bg-gray-900">
              <div>Delete</div>
              <Icon name="solar:trash-bin-trash-broken" size="20" />
            </button>
          </div>
        </div>
      </div>
      <div class="relative flex items-center w-full mb-12">
        <div class="w-[42px] mx-auto">
          <div class="absolute ml-4 mt-0 top-0 w-[1px] bg-gray-700 h-full" />
        </div>
        <div class="bg-gray-700 rounded-lg w-[calc(100%-50px)] text-sm w-full font-light">
          <div class="px-4 py-4 text-gray-300">
            {{ post.text }}
          </div>
          <img 
            v-if="post && post.picture"
            class="mx-auto w-full mt-2 px-4 pb-4 rounded border-1 border-bg-black"
            :src="runtimeConfig.public.bucketUrl + post.picture" alt="">
            <div class="absolute mt-2 w-full ml-2">
              <button
                :disabled="isLike"
                @click="likesFunc()"
                class="flex items-center gap-1"
              >
                <Icon 
                    v-if="!hasLikedComputed"
                    class="p-1 hover:bg-gray-800 rounded-full cursor-pointer" 
                    name="mdi:cards-heart-outline" 
                    size="28"
                />
                <Icon 
                    v-else
                    class="p-1 text-red-500 hover:bg-gray-800 rounded-full cursor-pointer" 
                    name="mdi:cards-heart" 
                    size="28"
                />
              </button>
              <!-- <div class="relative text-sm text-gray-500">
                <div>
                  <span v-if="!isLike">{{ post.likes.length }}</span>
                  <span v-else>
                    <Icon name="eos-icons:bubble-loading" size="13" color="white" />
                  </span>
                  likes
                </div>
              </div> -->
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const runtimeConfig = useRuntimeConfig()
let isMenu = ref(false)
let isLike = ref(false)
let isDeleting = ref(false)

const emit = defineEmits(['isDeleted'])
const props = defineProps({post: Object})

const client = useSupabaseClient()
const user = useSupabaseUser()

const hasLikedComputed = computed(() => {
    if (!user.value) return 
    let res = false
    props.post.likes.forEach(like => {
        if (like.userId == user.value.identities[0].user_id && like.postId == props.post.id) {
            res = true
        }
    });

    return res
})

const deletePost = async (id, picture) => {
  let res = confirm("are you sure you want to delete this post?")

  if(!res) return 

  try {
    isMenu.value = false
    isDeleting.value = true
    const {data, error} = await client
        .storage
        .from('rapr-files')
        .remove([picture])

    await useFetch(`/api/delete-post/${id}`, { method: 'DELETE' })
    emit('isDeleted', true)
    isDeleting.value = false
  } catch (error) {
    console.log(error)
    isDeleting.value = false
  }
}

const likePost = async (id) => {
  isLike.value = true
  try {
    await useFetch(`/api/like-post`, {
      method: 'POST',
      body: {
        userId: user.value.identities[0].user_id,
        postId: id,
      }
    })
    await userStore.getAllPosts()
    isLike.value = false 
  } catch (error) {
    console.log(error)
    isLike.value = false
  }
}

const unlikePost = async (id) => {
  isLike.value = true
  try {
    await useFetch(`/api/unlike-post/${id}`, { method: 'DELETE'})
    await userStore.getAllPosts()
    isLike.value = false
  } catch (error) {
    console.log(error)
    isLike.value = false
  }
}

const likesFunc = () => {
  let likePostObj = null

  if (props.post.likes.length < 1) {
    likePost(props.post.id)
    return null
  } else {
    props.post.likes.forEach(like => {
      if (like.userId == user.value.identities[0].user_id && like.postId == props.post.id) {
        likePostObj = like
      }
    })
  }
  if(likePostObj) {
    unlikePost(likePostObj.id)
    return null
  }
  likePost(props.post.id)
}
</script>
