<template>
  <div class="color-filter-component open-sans-regular">
    <h2 class="color-title pb-2 font-bold">{{ title }}</h2>
    <div class="colors">
      <div v-for="(isSelected, color) in selectedColors" :key="color" :style="{ backgroundColor: color }"
           class="color-box" @click="toggleColor(color)">
        <div v-if="isSelected" class="color-selected-indicator"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Couleurs",
      selectedColors: {
        red: false,
        blue: false,
        green: false,
        yellow: false,
        black: false,
        white: false,
      }
    };
  },
  methods: {
    toggleColor(selectedColor) {
      // Reset all selections
      Object.keys(this.selectedColors).forEach(color => {
        this.selectedColors[color] = false;
      });
      // Set the selected color to true
      this.selectedColors[selectedColor] = true;
      this.emitColors();
    },
    emitColors() {
      // Emit the selected color
      const selected = Object.keys(this.selectedColors).filter(
        color => this.selectedColors[color]
      );
      this.$emit('colorsChanged', selected);
    }
  }
};
</script>

<!--<script setup>-->
<!--import { defineEmits, ref } from 'vue'-->

<!--// eslint-disable-next-line vue/valid-define-emits-->
<!--const emit = defineEmits()-->

<!--// const selectedColors = {-->
<!--//   red: false,-->
<!--//   blue: false,-->
<!--//   green: false,-->
<!--//   yellow: false,-->
<!--//   black: false,-->
<!--//   white: false-->
<!--// }-->

<!--const selectedColors = {-->
<!--  red: ref(false),-->
<!--  blue: ref(false),-->
<!--  green: ref(false),-->
<!--  yellow: ref(false),-->
<!--  black: ref(false),-->
<!--  white: ref(false)-->
<!--};-->

<!--function toggleColor(selectedColor) {-->
<!--  // Reset all selections-->
<!--  Object.keys(selectedColors).forEach(color => {-->
<!--    selectedColors[color].value = false-->
<!--  })-->
<!--  // Set the selected color to true-->
<!--  selectedColors[selectedColor].value = true-->
<!--  emitColors()-->
<!--}-->

<!--function emitColors() {-->
<!--  // Emit the selected color-->
<!--  const selected = Object.keys(selectedColors).filter(-->
<!--    color => selectedColors[color].value-->
<!--  )-->
<!--  // this.$emit('colorsChanged', selected);-->
<!--  emit('colorsChanged', selected)-->
<!--}-->
<!--</script>-->

<style scoped>
.color-filter-component {
  /* Component styles */
}

.color-title {
  font-size: 14px;
}

.colors {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.color-box {
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: relative;
  border: 1px solid;
}

.color-selected-indicator {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 2px solid black;
}
</style>
