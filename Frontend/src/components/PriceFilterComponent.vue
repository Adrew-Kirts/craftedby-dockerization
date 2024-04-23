<template>
  <div class="text-sm open-sans-regular">
    <h2 class="pb-2 font-bold">Prix</h2>
    <div class="flex gap-2">
      <input name="minPrice" type="number" placeholder="min." v-model.number="minPrice" @input="updatePriceFilter" class="price-input w-full px-2 py-1">
      <input name="maxPrice" type="number" placeholder="max." v-model.number="maxPrice" @input="updatePriceFilter" class="price-input w-full px-2 py-1">
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';

const minPrice = ref(null);
const maxPrice = ref(null);
// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits();

const updatePriceFilter = () => {
  emit('priceChanged', {min: minPrice.value, max: maxPrice.value});
};
</script>

<style scoped>
.price-input {
  font-family: 'Open Sans', sans-serif;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
