<template>
<!--  <button class="btn bg-base-100 btn-wide rounded-none border-neutral text-black open-sans-regular hover:bg-base-100">-->
  <button class="btn bg-base-100 w-full lg:max-w-xs mx-auto rounded-none border-neutral text-black open-sans-regular hover:bg-base-100">
  {{ text }}
  </button>
</template>

<script setup>
// import { defineProps } from 'vue';

const props = defineProps({
  text: {
    type: String,
  },
});
</script>

<style scoped>

</style>
