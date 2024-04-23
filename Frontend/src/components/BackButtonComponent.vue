<template>
  <button @click="toPreviousPage" class="btn btn-ghost">Retour</button>
</template>

<script setup>

import router from '@/router/index.js'

function toPreviousPage() {
  router.back()
}
</script>