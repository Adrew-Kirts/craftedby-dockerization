<template>
  <transition name="fade" @after-enter="autoClose">
    <div v-if="visible" :key="key" class="fixed inset-0 flex items-center justify-center">
      <div :class="notificationClasses">
        <span>{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  type: String,
  message: String,
  duration: { type: Number, default: 800 }
})

const visible = ref(false)
const key = ref(0)

const notificationClasses = computed(() => ({
  'rounded-lg': true,
  'text-black text-medium': true,
  'bg-success': props.type === 'success',
  'bg-error': props.type === 'error',
  'px-6 py-4': true,
  'flex items-center': true,
  'shadow-lg': true,
  'animate-bounce': visible.value,
  'bg-opacity-80': true
}))

function autoClose() {
  setTimeout(() => {
    visible.value = false
  }, props.duration)
}

// watch(() => props.message, (newVal, oldVal) => {
//   if (newVal !== oldVal && newVal !== '') {
//     visible.value = true
//   }
// })

watch(() => props.message, async (newVal) => {
  if (newVal !== '') {
    visible.value = false
    await nextTick()
    key.value++
    visible.value = true
  }
})


</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>