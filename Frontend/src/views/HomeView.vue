<template>
  <div class="flex-1">
<BannerComponent></BannerComponent>
    <!-- PERSONALISABLE Section -->
    <div class="mt-10 md:mt-20 mb-10 mx-auto max-w-7xl">
      <h2 class="text-center text-3xl open-sans-semibold mb-10">PERSONALISABLE</h2>
      <div class="product-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mx-5 md:mx-0"
           v-if="slicedCustomProducts && slicedCustomProducts.length">
        <div v-for="product in slicedCustomProducts" :key="product.id" class="card w-full">
          <router-link :to="`/products/${product.id}`">
            <figure><img src="/src/assets/images/assiette.png" alt="Product image" class="object-cover w-full"></figure>
            <div class="card-body pl-2">
              <h2 class="card-title open-sans-semibold uppercase">{{ product.name }}</h2>
              <p class="price-text pb-3">€ {{ product.price }}</p>
              <p class="description line-clamp-2">{{ product.description }}</p>
            </div>
          </router-link>
          <div>
            <CTAButtonBase v-if="product.stock > 0" @click="cartStore.addToCart(product)" text="AJOUTER AU PANIER" />
            <CTAButtonBase v-else-if="product.stock <= 0" text="PLUS DISPONIBLE" />
          </div>
        </div>
      </div>
    </div>

    <!-- Artisan Profile Block with Centered Text -->
    <div class="py-10 mx-auto max-w-4xl">
      <div class="grid grid-cols-1 md:grid-cols-2">

        <div class="aspect-square flex flex-col justify-center items-center bg-gray-50 text-black p-5 space-y-4">
          <p class="px-4 py-2 text-lg">PROFIL ARTISAN</p>
          <p class="px-4 py-2">Lorem ipsum dolor sit amet...</p>
          <a href="#" class="px-4 py-2 open-sans-regular underline text-sm">CONTINUER LECTURE</a>
        </div>
        <div class="aspect-square flex justify-center items-center md:max-w-80">
          <img src="@/assets/images/flat-lay-plates.webp" alt="Artisan Profile" class="object-cover w-full h-full">
        </div>

        <div class="aspect-square flex justify-center items-center md:max-w-80">
          <img src="@/assets/images/tools-pottery-table.webp" alt="Artisan Products" class="object-cover w-full h-full">
        </div>
        <div class="aspect-square flex flex-col justify-center items-center bg-gray-50 text-black p-5 space-y-4">
          <p class="px-4 py-2 text-lg">PRODUITS DE L'ARTISAN</p>
          <p class="px-4 py-2">Lorem ipsum dolor sit amet...</p>
          <a href="#" class="px-4 py-2 open-sans-regular underline text-sm">CONTINUER LECTURE</a>
        </div>
      </div>
    </div>

    <!-- DECOUVRIR DES CREATIONS Section -->
    <div class="mt-10 md:mt-20 mb-10 mx-auto max-w-7xl">
      <h2 class="text-center text-3xl open-sans-semibold mb-10">DECOUVRIR DES CREATIONS</h2>
      <div class="product-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mx-5 md:mx-0"
           v-if="randomProducts && randomProducts.length">

          <!-- Product Cards for Random Products -->
          <div v-for="product in randomProducts" :key="product.id" class="card w-full">
            <router-link :to="`/products/${product.id}`">
              <figure><img src="/src/assets/images/assiette.png" alt="Product image" class="object-cover w-full"></figure>

              <!--            put back to get img from backend:-->
              <!--            <figure>-->
              <!--              <img :src="getFullImagePath(product.image_path)" alt="Product image" class="object-cover w-full" />-->
              <!--            </figure>-->

              <div class="card-body pl-2">
                <h2 class="card-title open-sans-semibold uppercase">{{ product.name }}</h2>
                <p class="price-text pb-3">€ {{ product.price }}</p>
                <p class="description line-clamp-2">{{ product.description }}</p>
              </div>
            </router-link>
            <div>
              <CTAButtonBase v-if="product.stock > 0" @click="cartStore.addToCart(product)" text="AJOUTER AU PANIER" />
              <CTAButtonBase v-else-if="product.stock <= 0" text="PLUS DISPONIBLE" />
            </div>
          </div>
        </div>
      </div>
    </div>
<!--  </div>-->
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '@/services/api'
import CTAButtonBase from '@/components/CTAButtonBase.vue'
import { useCartStore } from '@/stores/cart.js'
import BannerComponent from '@/components/BannerComponent.vue'

const customisableProducts = ref([])
const allProducts = ref([])

// Fetch all products and filter for customizable ones
onMounted(async () => {
  try {
    const response = await api.get('products', { params: { page: 1 } })
    allProducts.value = response.data.data
    customisableProducts.value = allProducts.value.filter(product => product.customisable === 1)
    shuffleProducts(allProducts.value)
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
})

// function to shuffle products
function shuffleProducts(products) {
  for (let i = products.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [products[i], products[j]] = [products[j], products[i]]
  }
}

// Get a slice of random products
const randomProducts = computed(() => allProducts.value.slice(0, 4))

// Get a slice of random products
const slicedCustomProducts = computed(() => customisableProducts.value.slice(0, 8))

const cartStore = useCartStore()

</script>

<style scoped>

.price-text, .description {
  font-size: 16px;
  color: #807F86;
}

.card-body {
  min-height: 200px;
}
</style>
