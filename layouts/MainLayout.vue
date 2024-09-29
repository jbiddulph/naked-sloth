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
