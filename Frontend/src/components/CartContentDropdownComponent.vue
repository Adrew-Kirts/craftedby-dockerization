<!--<template>-->
<!--  <div v-for="item in cart.items" :key="item.id" class="cart-item p-2 border-b border-gray-200">-->
<!--    <div class="flex items-center space-x-2">-->
<!--      <button class="ml-auto btn btn-ghost btn-xs text-primary" @click="removeFromCart(item.id, $event)">X</button>-->
<!--      <div class="flex-shrink-0">-->
<!--        <img :src="`${imageBaseUrl}/images/products/${item.image_path}`" alt="Image du produit"-->
<!--             class="w-16 h-16 object-cover">-->
<!--        &lt;!&ndash;          <img :src="${import.meta.env.VITE_IMAGE_BASE_URL} + item.image_path" alt="Product image" class="w-16 h-16 object-cover">&ndash;&gt;-->
<!--        &lt;!&ndash;          <img :src="imageUrl" alt="Product image" class="w-16 h-16 object-cover">&ndash;&gt;-->
<!--      </div>-->
<!--      <div class="flex-grow">-->
<!--        <p class="text-sm font-semibold">{{ item.name }}</p>-->
<!--        <p class="text-xs">€{{ item.price }}</p>-->
<!--      </div>-->
<!--      <div class="flex items-center">-->
<!--        <button class="btn btn-ghost btn-xs" @click="decreaseQuantity(item)">-</button>-->
<!--        <span class="text-sm">{{ item.quantity }}</span>-->

<!--        <button class="btn btn-ghost btn-xs" @click="increaseQuantity(item)">+</button>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--  <div>-->
<!--    <div class="always-visible">-->
<!--      <div class="mt-4 p-2 border-t border-gray-200">-->
<!--        <p class="text-sm font-semibold">Prix total: €{{ cart.totalPrice }}</p>-->
<!--      </div>-->
<!--      <CTAButtonBase class="w-full mt-2" label="Voir le panier" text="Voir le panier" @click="goToCheckout" />-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<template>
  <div class="flex flex-col h-full"> <!-- Container for the full height -->
    <div class="flex-grow overflow-auto"> <!-- Scrollable area for cart items -->
      <div v-for="item in cart.items" :key="item.id" class="p-2 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <button @click="removeFromCart(item.id, $event)" class="ml-auto btn btn-ghost btn-xs text-primary">X</button>
          <div class="flex-shrink-0">
            <img :src="`${imageBaseUrl}/images/products/${item.image_path}`" alt="Product Image" class="w-16 h-16 object-cover">
          </div>
          <div class="flex-grow">
            <p class="text-sm font-semibold">{{ item.name }}</p>
            <p class="text-xs">€{{ item.price }}</p>
          </div>
          <div class="flex items-center">
            <button @click="decreaseQuantity(item)" class="btn btn-ghost btn-xs">-</button>
            <span class="text-sm px-3">{{ item.quantity }}</span>
            <button @click="increaseQuantity(item)" class="btn btn-ghost btn-xs">+</button>
          </div>
        </div>
      </div>
    </div>
    <div class="sticky bottom-0 bg-white w-full shadow-top"> <!-- Sticky bottom bar with shadow -->
      <div class="mt-4 p-2 border-t border-gray-200">
        <p class="text-sm font-semibold">Prix total: €{{ cart.totalPrice }}</p>
      </div>
<!--      <CTAButtonBase class="w-full mt-2" label="Voir le panier" text="Voir le panier" @click="goToCheckout" />-->
      <CTAButtonBase class="w-full mt-2" label="Voir le panier" text="Voir le panier" @click="goToCart" />
    </div>
  </div>
</template>


<script setup>
import { useCartStore } from '@/stores/cart.js'
import CTAButtonBase from '@/components/CTAButtonBase.vue'
import router from '@/router/index.js'
import { ref } from 'vue'

const cart = useCartStore()

function imageUrl() {
  return `${import.meta.env.VITE_IMAGE_BASE_URL}${this.item.image_path}`
}

const imageBaseUrl = ref(import.meta.env.VITE_IMAGE_BASE_URL)


function removeFromCart(id) {
  event.stopPropagation() //prevent click from bubbling up
  cart.removeFromCart(id)
}

function increaseQuantity(item) {
  cart.addToCart({ ...item, quantity: 1 })
}

function decreaseQuantity(item) {
  if (item.quantity > 1) {
    cart.updateQuantity(item.id, item.quantity - 1)
  } else {
    removeFromCart(item.id)
  }
}

// function goToCheckout() {
//   router.push('/checkout')
// }

function goToCart() {
  router.push('/cart')
}

</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}

@media (max-width: 640px) {
  .btn {
    padding: 0.375rem 0.75rem;
  }

  .btn-xs {
    padding: 0.25rem 0.5rem;
    font-size: 1rem;
  }
}

</style>
