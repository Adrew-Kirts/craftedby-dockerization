<template>
  <div class="input-field mt-6">
    <p class="text-lg mb-4">Informations personnelles</p>
    <div class="grid grid-cols-2 gap-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Prénom *</span>
        </label>
        <input type="text" :value="user.userObject.first_name" placeholder="Prénom" class="input input-bordered custom-input w-full" />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Nom *</span>
        </label>
        <input type="text" :value="user.userObject.last_name" placeholder="Nom" class="input input-bordered custom-input w-full" />
      </div>
      <div class="form-control col-span-2">
        <label class="label">
          <span class="label-text">Adresse *</span>
        </label>
        <input type="text" :value="user.userObject.address" placeholder="Adresse" class="input input-bordered custom-input w-full" />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Code postal *</span>
        </label>
        <input type="text" :value="user.userObject.postal_code" placeholder="Code Postal" class="input input-bordered custom-input w-full" />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Ville *</span>
        </label>
        <input type="text" :value="user.userObject.city" placeholder="Ville" class="input input-bordered custom-input w-full" />
      </div>
      <div class="form-control col-span-2">
        <label class="label">
          <span class="label-text">Email * </span>
        </label>
        <input type="email" :value="user.userObject.email" placeholder="Email" class="input input-bordered custom-input w-full" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user.js'
const user = useUserStore()
</script>

<style scoped>
.custom-input {
  border: 1px solid black;
  border-radius: 0;
  font-family: 'open-sans-regular', sans-serif;
  font-size: 0.875rem;
}
</style>
