<template>
  <div class="form-control">
    <input id="search-bar" v-model="searchInput" class="input input-bordered text-ellipsis text-sm overflow-hidden w-24 max-h-8 md:w-auto" placeholder="Chercher produit" type="text"
           @input="updateSearchKeyword">
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchInput = ref(null)
// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits()

const updateSearchKeyword = () => {
  emit('searchByKeyword', searchInput)
}
</script>