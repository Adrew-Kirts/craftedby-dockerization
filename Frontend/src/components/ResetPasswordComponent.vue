<template>
  <div class="max-w-md mx-auto p-6 md:shadow-md rounded-md text-center text-balance mt-5">
    <p>Renseignez votre email et nouveau mot de passe:</p>
    <form @submit.prevent="sendEmail" class="mb-4">

      <label class="input custom-input flex items-center gap-2 mt-4">
        <input type="email" v-model="email" class="grow" placeholder="Email" />
      </label>

       <label class="input custom-input flex items-center gap-2 mt-4">
         <input type="password" v-model="password" name="password" class="grow" required minlength="6" placeholder="Nouveau mot de passe" />
        </label>

        <label class="input custom-input flex items-center gap-2 mt-4">
          <input type="password" v-model="password_confirmation" name="password_confirmation" class="grow" required minlength="6" placeholder="Confirmation du mot de passe" />
        </label>
      <p v-if="password !== password_confirmation && password_confirmation.length > 0" class="text-red-500">Les mots de passe ne correspondent pas.</p>

      <button type="submit" class="w-full mt-4 bg-primary text-white open-sans-regular py-2 px-4 focus:outline-none focus:shadow-outline">Changer mot de passe</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import router from '@/router/index.js';
import { useUserStore } from '@/stores/user.js'

const email = ref("");
const password = ref('');
const password_confirmation = ref('');
const token = router.currentRoute.value.query.token;
const userStore = useUserStore();

const sendEmail = async () => {

  const userData = {
    token: token,
    email: email.value,
    password: password.value,
    password_confirmation: password_confirmation.value,
  };

  await userStore.newPassword(userData)
  alert('Mot de passe mis à jour, veuillez vous reconnecter')
  await router.push('/login');
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