<template>
  <div id="AuthPage" class="w-full h-[100%] h-screen pt-32">
    <div class="w-full">
      <div class="w-full flex items-center justify-center gap-2.5 p-2">
        <img class="w-[35px]" src="/threads-logo.png" alt="">
        <span class="font-bold text-2xl">Rap generator</span>
      </div>
      <div class="max-w-[350px] mx-auto px-2">
        <div class="text-center mb-6 mt-4">
          Login / Register
        </div>
        <button
          @click="login('github')"
          class="
            flex
            items-center
            justify-center
            gap-3
            p-1.5
            w-full
            border
            rounded-full
            text-lg
            font-semibold
          "
        >
          <div class="flex items-center gap-2 justify-center">
            <img class="w-full max-w-[30px] rounded-full" src="/github-logo.png" alt="">
            Github
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useRouter } from 'vue-router'

const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

watchEffect(() => {
  if (user.value) {
    // Ensure the redirect only happens if not already on the intended route
    if (router.currentRoute.value.path !== '/') {
      router.push('/')
    }
  }
})

const login = async (prov: string) => {
  try {
    const { data, error } = await client.auth.signInWithOAuth({
      provider: prov,
      // options: {
      //   redirectTo: window.location.origin
      // }
      options: {
        redirectTo: `http://localhost:3000`,
      },
    })

    if (error) {
      console.error('OAuth login error:', error)
    }
  } catch (error) {
    console.error('Unexpected error during login:', error)
  }
}
</script>
