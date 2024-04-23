<template>
  <div>
<!--    <router-link to="/boutique" class="back-button">Retour</router-link>-->
    <BackButtonComponent></BackButtonComponent>
    <div v-if="loading" class="flex justify-center items-center h-screen loading loading-infinity loading-lg">
      Loading...
    </div>
    <div v-else-if="error" class="text-red-500 text-center mt-4">
      {{ error }}
    </div>
    <div v-else-if="product" class="container mx-auto p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<!--        image-->
        <div class="product-image">
          <figure><img src="/src/assets/images/assiette.png" alt="Product image" class="h-auto rounded-lg shadow-md" ></figure>
        </div>
<!--        product info-->
        <div class="product-content">
          <h1 class="text-3xl font-bold mb-3 uppercase">{{ product.name }}</h1>
          <div class="product-meta mb-4">
            <div class="badge badge-secondary badge-outline price">€{{ product.price }}</div>
            <div class="badge badge-info badge-outline">Matériel: {{ product.material }}</div>
            <div class="badge badge-accent badge-outline">Couleur: {{ product.color }}</div>
            <div class="badge badge-accent badge-outline">{{ product.stock > 0 ? 'En stock' : 'Plus en stock' }}</div>
          </div>
          <div class="product-description mb-4">
            <p>{{ product.description }}</p>
          </div>
          <div class="flex items-center">
            <button @click="decreaseQuantity(item)" class="btn btn-ghost btn-xs">-</button>
            <span class="text-sm">1</span>

            <button @click="increaseQuantity(item)" class="btn btn-ghost btn-xs">+</button>
          </div>
          <div class="pt-8">
            <CTAButtonBase v-if="product.stock > 0" @click="addToCart(product)" text="AJOUTER AU PANIER" />
            <CTAButtonBase v-else-if="product.stock <= 0" text="PLUS DISPONIBLE" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';
import CTAButtonBase from '@/components/CTAButtonBase.vue'
import { useCartStore } from '@/stores/cart.js'
import BackButtonComponent from '@/components/BackButtonComponent.vue'

const route = useRoute();
const product = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await api.get(`products/${route.params.id}`);
    product.value = response.data.product;
  } catch (err) {
    console.error("Failed to fetch product details:", err);
    error.value = "Failed to load product details.";
  } finally {
    loading.value = false;
  }
});

const cartStore = useCartStore();
function addToCart(productToAdd) {
  cartStore.addToCart(productToAdd);
}

function increaseQuantity(item) {
  cartStore.addToCart({ ...item, quantity: 1 });
}

function decreaseQuantity(item) {
    cartStore.updateQuantity(item.id, item.quantity - 1);
}
</script>

<style scoped>

</style>
