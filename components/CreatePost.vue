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
              <p v-if="!designStore.fileDisplay">
                you need to Design your Rapr, click the button above
              </p>
            </div>
          </div>
          <div class="relative flex items-center w-full">
            <div class="w-[42px] mx-auto">
              <div class="absolute ml-4 mt-1 top-0 w-[1px] h-full"></div>
            </div>
            <div class="w-[calc(100%-50px)] text w-full">
              <div class="pt-2 w-full">
                <textarea
                  v-model="truncatedText"
                  style="resize: none;"
                  placeholder="Start a thread"
                  id="textarea"
                  @input="adjustTextAreaHeight"
                  class="hidden w-full border-1 outline"
                ></textarea>
              </div>
              <div class="w-full">
                <div class="flex flex-col gap-2 py-1">
                  <!-- <div v-if="fileDisplay">
                    <img class="mx-auto w-full mt-2 mr-2 rounded-lg" :src="fileDisplay" alt="">
                  </div> -->
                  <div v-if="designStore.fileDisplay">
                    <small>Please check your preview and then post</small>
                    <img class="mx-auto w-full mt-2 rounded-lg border-2" :src="designStore.fileDisplay" alt="Canvas Image" />
                  </div>
                  <!-- <label for="fileInput">
                    <Icon class="cursor-pointer" name="clarity:paperclip-line" color="white" size="25" />
                    <input 
                      ref="file"
                      type="file"
                      id="fileInput"
                      @input="onChange"
                      hidden
                      accept=".jpg,jpeg,.png"
                    />
                  </label> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UButton
        v-if="designStore.fileDisplay"
        :disabled="isLoading"
        @click="createPost"
        class="font-bold px-4 flex mx-auto"
        size="md"
      >
        <div v-if="!isLoading">Post my Rapr</div>
        <div v-else class="flex items-center gap-2 justify-center">
          <Icon name="eos-icons:bubble-loading" size="25" />
          Please wait...
        </div>
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { useDesignStore } from '@/stores/design'; // Pinia store for image data
import { useUserStore } from '@/stores/user';
import { useRapStore } from '@/stores/rap';
import { ref, watch } from 'vue';

const userStore = useUserStore();
const designStore = useDesignStore();
const rapStore = useRapStore();
const runtimeConfig = useRuntimeConfig();
const props = defineProps({ message: String });
const client = useSupabaseClient();
const user = useSupabaseUser();

const userDetails = reactive({
  userId: '',
  name: '',
  avatarUrl: ''
});

const cleanMessage = ref('');
let text = ref(null);
let isLoading = ref(false);

const truncatedText = computed({
  get() {
    return text.value || ""; // Simply return the text value, no truncation
  },
  set(value) {
    text.value = value; // Updates the original text
  }
});

const adjustTextAreaHeight = () => {
  var textarea = document.getElementById('textarea');
  textarea.style.height = 'auto';
  textarea.style.height = textarea?.scrollHeight + 'px';
};

function removeHtmlTags(message) {
  return message.replace(/<\/?[^>]+(>|$)/g, '');
}

// Watch for changes in fileData from Pinia store
watch(
  () => designStore.fileData,
  (newFileData) => {
    if (newFileData) {
      console.log('New file data detected, preparing for upload.');
      // Perform any action you need here when fileData changes, like an upload
    }
  },
  { immediate: true } // Run the watcher immediately upon component load
);

onMounted(() => {
  if (user.value && user.value.identities && user.value.identities[1]) {
    console.log('User: ', user.value.identities[1].identity_data.full_name);
    // Assign the values to userDetails
    userDetails.name = user.value.identities[1].identity_data.full_name;
    userDetails.userId = user.value.identities[1].user_id;
    userDetails.avatarUrl = user.value.identities[1].identity_data.avatar_url;
  }
  if (props.message) {
    cleanMessage.value = removeHtmlTags(props.message);
    text.value = cleanMessage.value; // Setting text.value here
  }
});

watch(
  () => props.message,
  (newMessage) => {
    if (newMessage) {
      cleanMessage.value = removeHtmlTags(newMessage);
      text.value = cleanMessage.value; // Reactively set text.value when props.message changes
    }
  },
  { immediate: true }
);

const clearData = () => {
  text.value = null;
  designStore.clearImageData(); // Clear Pinia store data
};

const onChange = () => {
  console.log('File input clicked');
  const file = file.value.files[0];
  if (file) {
    const fileURL = URL.createObjectURL(file);
    designStore.setImageData(fileURL, file); // Update Pinia store with file data
  }
};

const createPost = async () => {
  let dataOut = null;
  let errorOut = null;

  isLoading.value = true;

  if (designStore.fileData) {
    const file = designStore.fileData;

    // Log to confirm it's a Blob with the correct type
    console.log('File in createPost (Blob):', file);

    // Hardcode the file type if necessary (should be 'image/jpeg' by now)
    const fileType = file.type || 'image/jpeg';

    console.log('Final file type:', fileType);

    // Upload the image Blob with the correct MIME type
    const { data, error } = await client
      .storage
      .from('rapr-files')
      .upload(`${uuidv4()}.jpg`, file, {
        contentType: fileType, // Correct MIME type for the Blob
      });

    dataOut = data;
    errorOut = error;
  }

  if (errorOut) {
    console.log(errorOut);
    return errorOut;
  }

  let pic = '';
  if (dataOut) {
    pic = dataOut.path ? dataOut.path : '';
  }

  try {
    await useFetch(`/api/create-post/`, {
      method: 'POST',
      body: {
        userId: userDetails.userId,
        name: userDetails.name,
        image: userDetails.avatarUrl || "", // Optional
        text: text.value,
        picture: pic, // Uploaded file path
      },
    });

    console.log('Post created:', text.value);
    clearData();
    isLoading.value = false;
  } catch (error) {
    console.log(error);
    isLoading.value = false;
  }
};


</script>

