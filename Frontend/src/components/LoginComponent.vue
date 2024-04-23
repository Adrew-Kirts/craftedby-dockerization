<template>
  <div class="max-w-md mx-auto p-6 bg-white shadow-md rounded-md min-w-full md:min-w-96">
    <form @submit.prevent="login" class="mb-4">

      <label class="input input-bordered rounded-none flex items-center gap-2 mt-4">
        <input type="email" v-model="email" class="grow" placeholder="Email" />
      </label>

      <label class="input input-bordered rounded-none flex items-center gap-2 mt-4">
        <input type="password" v-model="password" class="grow" placeholder="Mot de passe" />
      </label>

      <router-link to="/password-reset" class="">
        <p class="text-sm mt-2">Mot de passe oublié</p>
      </router-link>

      <!-- Remember Me Checkbox -->
      <div class="flex items-center mt-4">
        <label class="flex items-center">
          <input type="checkbox" v-model="rememberMe" class="checkbox checkbox-primary">
          <span class="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
        </label>
      </div>

      <button type="submit" class="w-full mt-4 bg-primary text-white py-2 px-4 focus:outline-none focus:shadow-outline">Login</button>
    </form>
    <p class="center">OU</p>
    <router-link to="/register" class="block text-center mt-2">
      <button class="w-full btn bg-secondary rounded-none">Créer un compte</button>
    </router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from "../stores/user";
import router from '@/router/index.js';
import { useRoute } from 'vue-router'

const route = useRoute()
const userStore = useUserStore();
const email = ref("");
const password = ref("");
const rememberMe = ref(false);


const login = async () => {
  await userStore.signIn(email.value, password.value, rememberMe.value);
  // await userStore.signIn(email.value, password.value);
  if (route.query.to === "new-business"){
    await router.push('/new-business');
  }
  else if (route.query.to === "checkout"){
    await router.push('/checkout');
  }
  else {
    await router.push('/boutique');
  }
};
</script>

<style>

</style>