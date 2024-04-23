<template>
  <div class="open-sans-regular text-sm">
    <h2 class="pb-2 font-bold ">Catégories</h2>
    <div class="flex flex-col gap-2">
      <label>
        <input v-model="selectedCategory " name="category" type="radio" value="">
        Tout afficher
      </label>
      <label>
        <input v-model="selectedCategory " name="category" type="radio" value="vaisselle">
        Vaisselle
      </label>
      <label>
        <input v-model="selectedCategory" name="category" type="radio" value="ceramique">
        Céramique
      </label>
      <label>
        <input v-model="selectedCategory" name="category" type="radio" value="meubles">
        Meubles
      </label>
      <label>
        <input v-model="selectedCategory" name="category" type="radio" value="vetements">
        Vetements
      </label>
      <label>
        <input v-model="selectedCategory" name="category" type="radio" value="jouets">
        Jouets
      </label>
      <label>
        <input v-model="selectedCategory" name="category" type="radio" value="nourriture">
        Nourriture
      </label>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedCategory: ''
    };
  },
  watch: {
    selectedCategory(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('categoryChanged', newVal);
      }
    }
  }
};
</script>

<!--<script setup>-->
<!--import { ref, watch, defineEmits } from 'vue';-->

<!--const selectedCategory = ref('');-->

<!--// eslint-disable-next-line vue/valid-define-emits-->
<!--const { emit } = defineEmits();-->

<!--watch(selectedCategory, (newVal, oldVal) => {-->
<!--  if (newVal !== oldVal) {-->
<!--    emit('categoryChanged', newVal);-->
<!--  }-->
<!--});-->
<!--</script>-->


<style scoped>

</style>
