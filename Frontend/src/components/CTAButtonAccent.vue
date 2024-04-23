<template>
  <button class="btn bg-accent btn-wide rounded-none text-black border-black hover:bg-accent open-sans-semibold">
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
