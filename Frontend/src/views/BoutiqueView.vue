<template>
  <div class="container">
    <!--    <div class="main-content grid grid-cols-1 md:grid-cols-5 gap-5 md:ml-24">-->
    <div class="main-content grid grid-cols-1 md:grid-cols-5 md:gap-5 px-5 md:px-24">

      <!-- Mobile Filters Dropdown -->
      <div class="block md:hidden">
        <!--      <CTAButtonBase class="mt-2" label="Filtres" text="FILTRER" @click="toggleFiltersDropdown" />-->
        <div class="flex flex-row mt-10 ml-8 relative">
          <button @click="toggleFiltersDropdown">
            <img alt="Filter Icon" src="../assets/icons/filters.svg">
          </button>
          <p class="ml-2">FILTRER</p>
        </div>
        <div v-show="showFilters" class="filters-dropdown z-20">
          <CategoryFilterComponent @categoryChanged="fetchProductsByCategory" />
          <ColorFilterComponent @colorsChanged="fetchProductsByColor" />
          <PriceFilterComponent @priceChanged="fetchProductsByPrice" />
          <CTAButtonBase class="mt-4" text="Réinitialiser les filtres" @click="clearAllFilters" />
        </div>
        <p v-if="products.length > 1" class="mt-5 ml-8 whitespace-nowrap">Trouvé {{ products.length }} produits</p>
        <p v-else-if="products.length === 1" class="mt-5 ml-8 whitespace-nowra">Trouvé {{ products.length }} produit</p>
      </div>
      <!-- Sidebar for desktop -->
<!--      <div class="hidden md:block md:col-span-1">-->
      <div class="hidden md:block md:col-span-1 sticky top-20 h-screen overflow-auto w-full">
      <p v-if="products.length > 1" class="mt-10 text-sm">Trouvé {{ products.length }} produits</p>
        <p v-else-if="products.length === 1" class="mt-10 text-sm">Trouvé {{ products.length }} produit</p>
        <div class="divider"></div>
        <SearchInputComponent @searchByKeyword="fetchProductsBySearch"></SearchInputComponent>
        <div class="divider"></div>
        <CategoryFilterComponent @categoryChanged="fetchProductsByCategory" />
        <div class="divider"></div>
        <ColorFilterComponent @colorsChanged="fetchProductsByColor" />
        <div class="divider"></div>
        <PriceFilterComponent @priceChanged="fetchProductsByPrice" />
        <div class="divider"></div>
        <CTAButtonBase text="Réinitialiser les filtres" @click="clearAllFilters" />
      </div>

      <!-- Product grid -->
      <div
        v-if="products && products.length"
        class="product-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 md:col-span-4 col-start-2 md:mt-10 mt-36">
      <!--        class="product-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 md:col-span-4 md:ml-16 md:mt-20 mr-5 ml-5">-->

        <div v-for="product in products" :key="product.id" class="result card max-w-72">
          <router-link :to="`/products/${product.id}`">

            <!--            <figure>-->
            <!--&lt;!&ndash;              <img src="@/assets/images/flat-lay-plates.webp" alt="Product image" class="object-cover h-64 w-52" />&ndash;&gt;-->
            <!--              <img src="/assiette.png" alt="Product image" class="object-cover h-80 w-72"/>-->
            <!--            </figure>-->

            <!--            put back to get img from backend:-->
            <figure>
              <img :src="getFullImagePath(product.image_path)" alt="Product image" class="object-cover h-80 w-72" />
            </figure>

            <div class="card-body pl-2 line-clamp-4">
              <h2 class="card-title open-sans-semibold uppercase text-lg pt-3">{{ product.name }}</h2>
              <p class="price-text">€ {{ product.price }}</p>
              <p class="description pt-5">{{ product.description }}</p>
            </div>
          </router-link>
          <div>
            <!--            Show not available instead of add to cart if stock = 0 -->
            <CTAButtonBase v-if="product.stock > 0" text="AJOUTER AU PANIER" @click="addToCart(product)" />
            <CTAButtonBase v-else-if="product.stock <= 0" text="PLUS DISPONIBLE" />
          </div>
        </div>

        <notification-component :type="notificationType" :message="notificationMessage" />

        <InfiniteLoading @infinite="load">
          <template #complete>
            <div class="mt-10 w-full flex justify-center">Bravo, vous êtes arrivé au bout !</div>
          </template>
          <template #error>
            <div class="mt-10 w-full flex justify-center">Aucun produit trouvé pour cette sélection.</div>
          </template>
        </InfiniteLoading>

      </div>
      <!--      If no products found by filters-->
      <div v-else class="text-balance center-container">
        <p>Nous n'avons pas de produits pour cette selection.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import CTAButtonBase from '@/components/CTAButtonBase.vue'
import CategoryFilterComponent from '@/components/CategoryFilterComponent.vue'
import ColorFilterComponent from '@/components/ColorFilterComponent.vue'
import PriceFilterComponent from '@/components/PriceFilterComponent.vue'
import { useCartStore } from '@/stores/cart'
import api from '@/services/api'
import SearchInputComponent from '@/components/SearchInputComponent.vue'

import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'
import router from '@/router/index.js'
import NotificationComponent from '@/components/NotificationComponent.vue'

const notificationMessage = ref('');
const notificationType = ref('success');

function addToCart(product){
  cartStore.addToCart(product)
  notificationMessage.value = `Produit rajouté au panier !`;
  notificationType.value = 'success';
}

// State to toggle mobile filters dropdown
const showFilters = ref(false)

// Toggle mobile filters dropdown visibility
function toggleFiltersDropdown() {
  showFilters.value = !showFilters.value
}

const cartStore = useCartStore()
const products = ref([])
const hasMorePages = ref(true)

const filters = reactive({
  category: '',
  color: '',
  priceRange: { min: null, max: null },
  search: ''
})

// const endpoint = 'products'
let currentPage = 1
let lastFilter = JSON.stringify(filters)

const fetchProducts = async () => {

  const currentFilter = JSON.stringify(filters)
  const isNewSearch = lastFilter !== currentFilter
  lastFilter = currentFilter

  if (isNewSearch) {
    currentPage = 1
    products.value = []
    hasMorePages.value = true
  }

  if (!hasMorePages.value) return false

  const filteredParams = {
    ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== '' && value != null)),
    page: currentPage
  }
  try {
    const response = await api.get('products', { params: filteredParams })
    if (response.data.data.length) {
      products.value = [...products.value, ...response.data.data]
      currentPage++
    } else {
      hasMorePages.value = false
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
}

const load = async ($state) => {
  await fetchProducts()
  if (hasMorePages.value) {
    $state.loaded()
  } else {
    $state.complete()
  }
}


// Updates the filter state and calls fetchProducts
const fetchProductsBySearch = (searchTerm) => {
  filters.search = searchTerm
  fetchProducts()
}

// Updates the filter state and calls fetchProducts
const fetchProductsByPrice = (priceRange) => {
  // Spreads the min and max into the priceRange
  filters.priceRange = { ...priceRange }
  fetchProducts()
}

// Updates the filter state and calls fetchProducts
const fetchProductsByColor = (colors) => {
  // Default to empty if no color is selected
  filters.color = colors[0] || ''
  fetchProducts()
}

// Updates the filter state and calls fetchProducts
const fetchProductsByCategory = (category) => {
  filters.category = category
  fetchProducts()
}

const clearAllFilters = () => {
  // filters.category = ''
  // filters.color = ''
  // filters.priceRange = { min: null, max: null }
  // filters.search = ''
  //
  // currentPage = 1
  // products.value = []
  // showFilters.value = false
  // hasMorePages.value = true
  // fetchProducts()

  router.go(0);
}

onMounted(() => {
  fetchProducts()
})

function getFullImagePath(imagePath) {
  const apiBaseURL = `${import.meta.env.VITE_IMAGE_BASE_URL}/images/products/`
  return `${apiBaseURL}${imagePath}`
}
</script>

<style scoped>

img{
  max-width: max-content;
}

.description {
  font-size: 16px;
}

.filters-dropdown {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid #ccc;
  position: absolute;
  background-color: white;
  width: max-content;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-body {
  min-height: 200px;
  padding: 0;
}
</style>
