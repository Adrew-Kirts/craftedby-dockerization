<template>
  <div class="about">
    <h1>Welcome, {{ userStore.token }}</h1>
    <h2>This is an about page</h2>
  </div>
</template>

<style>

</style>

<script setup>
import { useUserStore } from "../stores/user";

  const userStore = useUserStore;

</script>