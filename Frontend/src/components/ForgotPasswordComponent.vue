<template>
  <div class="max-w-md mx-auto p-6 bg-white shadow-md rounded-md text-center text-balance">
    Renseignez votre email pour recevoir un lien de récupération:
    <form @submit.prevent="sendEmail" class="mb-4">

      <label class="input input-bordered flex items-center gap-2 mt-4">
        <input type="email" v-model="email" class="grow" placeholder="Email" />
      </label>

      <button type="submit" class="w-full mt-4 bg-primary text-white py-2 px-4 focus:outline-none focus:shadow-outline">Recevoir lien</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import router from '@/router/index.js';
import { useUserStore } from '@/stores/user.js'

const email = ref("");
const userStore = useUserStore();

const sendEmail = async () => {
  await userStore.passwordReset(email.value)
  alert('un mail a été envoyé pour changer votre mot de passe')
  await router.push('/boutique');
};
</script>

<style>
.custom-input {
  border: 1px solid black;
  border-radius: 0;
  font-family: 'open-sans-regular', sans-serif;
  font-size: 0.875rem;
}

</style>