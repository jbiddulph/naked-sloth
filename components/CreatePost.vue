<template>
  <div id="CreatePost">
    <div>
      <div id="Post" class="z-40 bottom-0 max-h-[100vh] w-full px-3 max-w-[500px] mx-auto">
        <div class="w-full py-2">
          <div class="flex items-center">
            <div v-if="user" class="flex items-center">
              <!-- <img class="rounded-full h-[35px]" :src="user.identities[0].identity_data.avatar_url" alt=""> -->
              <img class="rounded-full h-[35px]" :src="user.user_metadata.avatar_url" alt="">
              <div class="ml-2 font-semibold text-[18px]">{{ user.user_metadata.full_name }}</div>
            </div>
          </div>
          <div class="relative flex items-center w-full">
            <div class="w-[42px] mx-auto">
              <div class="absolute ml-4 mt-1 top-0 w-[1px] h-full"></div>
            </div>
            <div class="w-[calc(100%-50px)] text w-full">
              <div class="pt-2 w-full">
                <textarea
                  v-model="text"
                  style="resize: none;"
                  placeholder="Start a thread"
                  id="textarea"
                  @input="adjustTextAreaHeight()"
                  class="w-full border-1 outline"
                ></textarea>
              </div>
              <div class="w-full">
                <div class="flex flex-col gap-2 py-1">
                  <div v-if="fileDisplay">
                    <img class="mx-auto w-full mt-2 mr-2 rounded-lg" :src="fileDisplay" alt="">
                  </div>
                  <label for="fileInput">
                    <Icon class="cursor-pointer" name="clarity:paperclip-line" color="white" size="25" />
                    <input 
                      ref="file"
                      type="file"
                      id="fileInput"
                      @input="onChange"
                      hidden
                      accept=".jpg,jpeg,.png"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        v-if="text"
        :disabled="isLoading"
        @click="createPost"
        class="font-bold p-2 inline-block p-4"
        :class="isLoading? 'text-gray-600' : 'text-blue-600'"
      >
        <div v-if="!isLoading">Post</div>
        <div v-else class="flex items-center gap-2 justify-center">
          <Icon name="eos-icons:bubble-loading" size="25" />
          Please wait...
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
const userStore = useUserStore()
const runtimeConfig = useRuntimeConfig()
const props = defineProps({message: String})
const client = useSupabaseClient()
const user = useSupabaseUser()
const userDetails = reactive({
  userId: "",
  name: "",
  avatarUrl: ""
})
const cleanMessage = ref("");
let text = ref(null)
let isLoading = ref(false)

const adjustTextAreaHeight = () => {
  var textarea = document.getElementById("textarea");
  textarea.style.height = 'auto'
  textarea.style.height = textarea?.scrollHeight + "px"
}
function removeHtmlTags(message) {
  return message.replace(/<\/?[^>]+(>|$)/g, "");
}

let file = ref(null)
let fileDisplay = ref(null)
let fileData = ref(null)

onMounted(() => {
  if (user.value && user.value.identities && user.value.identities[1]) {
    console.log("User: ", user.value.identities[1].identity_data.full_name);
    
    // Directly assign the values to userDetails
    userDetails.name = user.value.identities[1].identity_data.full_name
    userDetails.userId = user.value.identities[1].user_id
    userDetails.avatarUrl = user.value.identities[1].identity_data.avatar_url
  }
  if (props.message) {
    cleanMessage.value = removeHtmlTags(props.message);
    text.value = cleanMessage.value; // Setting text.value here
  }
})
watch(
  () => props.message,
  (newMessage) => {
    if (newMessage) {
      cleanMessage.value = removeHtmlTags(newMessage);
      text.value = cleanMessage.value; // Reactively set text.value when props.message changes
    }
  },
  { immediate: true } // Ensure the watch runs initially
);
const clearData = () => {
  text.value = null
  file.value = null
  fileDisplay.value = null
  fileData.value = null
}

const onChange = () => {
  console.log("paperclip clicked")
  fileDisplay.value = URL.createObjectURL(file.value.files[0])
  fileData.value = file.value.files[0]
}

const createPost = async () => {
  let dataOut = null;
  let errorOut = null;

  isLoading.value = true

  if (fileData.value) {
    const { data, error } = await client
                                    .storage
                                    .from('rapr-files')
                                    .upload(`${uuidv4()}.jpg`, fileData.value)

    dataOut = data;
    errorOut = error;
  }

  if (errorOut) {
    console.log(errorOut)
    return errorOut
  }

  let pic = ''
  if (dataOut) {
    pic = dataOut.path ? dataOut.path : ''
  }
  try {
    await useFetch(`/api/create-post/`, {
      method: 'POST',
      body: {
        userId: userDetails.userId,
        name: userDetails.name,
        image: userDetails.avatarUrl,
        text: text.value,
        picture: pic,
      }
    })
    console.log("userId: ", userDetails.userId);
    console.log("name: ", userDetails.name);
    console.log("image: ", userDetails.avatarUrl);
    console.log("text: ", text.value);
    console.log("picture: ", pic);
    await userStore.getAllPosts()
    userStore.isMenuOverlay = false
    clearData()
    isLoading.value = false
  } catch (error) {
    console.log(error)
    isLoading.value = false
  }

}
</script>
