<template>
  <button class="btn bg-primary btn-wide rounded-none text-white open-sans-regular hover:bg-primary">
    {{ text }}
  </button>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
  },
});
</script>

<style scoped>

</style>
