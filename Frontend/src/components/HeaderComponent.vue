<template>

  <div class="border-t navbar sticky top-0 z-50 bg-accent md:min-h-[50px]">
    <!-- Burger menu button for mobile screens only -->
    <div class="navbar-start" style="margin-left: 5%;">
      <div ref="menuDropdownRef" class="dropdown md:hidden">
        <button class="btn btn-ghost btn-circle md:hidden" @click.stop="toggleMenuDropdown">
          <img alt="Menu Icon" src="../assets/icons/menu.svg">
        </button>
        <div class="hidden md:flex">
          <img alt="Vue logo" class="h-10 w-10" src="@/assets/CB_logo.svg" />
          <a class="btn btn-ghost normal-case text-xl logo-text">CraftedBy</a>
        </div>
        <ul v-if="showMenuDropdown" class="text-xl menu absolute mt-3 p-2 shadow bg-base-100 w-52" tabindex="0">
          <!-- Menu items -->
          <li>
            <RouterLink to="/">Accueil</RouterLink>
          </li>
          <li>
            <Router-link to="/boutique">Boutique</Router-link>
          </li>
          <li>
            <RouterLink to="/about">A propos</RouterLink>
          </li>
          <li>
            <RouterLink to="/contact">Contact</RouterLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="navbar-center hidden md:flex">
      <ul class="menu menu-horizontal p-0">
        <!-- Menu items for desktop -->
        <li>
          <RouterLink to="/">Accueil</RouterLink>
        </li>
        <li>
          <Router-link to="/boutique">Boutique</Router-link>
        </li>
        <li>
          <RouterLink to="/about">A propos</RouterLink>
        </li>
        <li>
          <RouterLink to="/contact">Contact</RouterLink>
        </li>
      </ul>
    </div>

    <!-- Navbar end buttons -->
    <div class="navbar-end" style="margin-right: 5%;">

<!--      Search button-->
      <button aria-label="Search button" class="btn btn-ghost btn-circle" @click.stop="toggleSearchDropdown">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="2" />
        </svg>
      </button>

      <div v-if="showSearchDropdown" ref="searchDropdownRef">
<!--        <SearchInputComponent @keyup.enter="searchByInput"></SearchInputComponent>-->
        <SearchInputComponent></SearchInputComponent>
<!--        <input type="text" placeholder="Chercher produit" v-model="searchInput" @input="updateSearchKeyword" @keyup.enter="submitSearch" class="input input-bordered text-ellipsis overflow-hidden w-24 max-h-8 md:w-auto">-->

      </div>

<!--      Profile button-->
      <RouterLink class="btn btn-ghost btn-circle" to="/profile">
        <img alt="Icon profile" src="../assets/icons/avatar.svg">
      </RouterLink>

<!--      Cart button-->
      <div class="relative">
        <button class="btn btn-ghost btn-circle" @click.stop="toggleCartDropdown">
          <img alt="Cart Icon" src="../assets/icons/shopping_cart.svg">
          <span v-if="itemCount > 0"
                class="indicator bg-red-500 text-white rounded-full w-4 h-4 flex justify-center items-center text-xs absolute top-1.5 right-1.5">{{ itemCount
            }}</span>
        </button>
        <div v-if="showCartDropdown" ref="dropdownRef"
             class="cart-dropdown absolute right-0 z-50 w-72 max-h-96 bg-white shadow-md overflow-y-auto">
          <CartContentComponent />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { computed, onMounted, ref, watch } from 'vue'
import CartContentComponent from '@/components/CartContentDropdownComponent.vue'
import SearchInputComponent from '@/components/SearchInputComponent.vue'
import router from '@/router/index.js'

const itemCount = computed(() => useCartStore().items.length)

const showCartDropdown = ref(false)
const dropdownRef = ref(null)

const showMenuDropdown = ref(false)
const menuDropdownRef = ref(null)

const showSearchDropdown = ref(false)
const searchDropdownRef = ref(null)

function toggleMenuDropdown() {
  showMenuDropdown.value = !showMenuDropdown.value
}

// Click outside menu to close
function handleClickOutsideMenu(event) {
  if (menuDropdownRef.value && !menuDropdownRef.value.contains(event.target) && showMenuDropdown.value) {
    toggleMenuDropdown()
  }
}

function toggleCartDropdown() {
  showCartDropdown.value = !showCartDropdown.value
}

// Click outside cart to close
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showCartDropdown.value = false
  }
}

function toggleSearchDropdown() {
  showSearchDropdown.value = !showSearchDropdown.value
}

// Click outside search to close
function handleClickOutsideSearch(event) {
  if (searchDropdownRef.value && !searchDropdownRef.value.contains(event.target)) {
    showSearchDropdown.value = false
  }
}

const route = useRoute();

watch(route, () => {
  showMenuDropdown.value = false;
  showCartDropdown.value = false;
  showSearchDropdown.value = false;
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('click', handleClickOutsideMenu)
  document.addEventListener('click', handleClickOutsideSearch)
})

</script>