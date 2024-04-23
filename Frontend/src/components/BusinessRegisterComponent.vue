<template>
  <div class="flex flex-row items-center gap-20">
    <form :data-theme="themePreview" class="form-control mt-8 mx-auto space-y-4 rounded-none"
          @submit.prevent="register">

      <h3 class="text-center text-balance">Renseignez les informations de votre entreprise ci-dessous:</h3>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Nom de l'entreprise<span class="text-error">*</span></span>
        </label>
        <input v-model="business_name" class="input input-bordered rounded-none w-full" type="text" />
      </div>

      <div class="md:grid grid-cols-2 gap-x-6">

        <div class="form-control">
          <label class="label">
            <span class="label-text">Adresse<span class="text-error">*</span></span>
          </label>
          <input v-model="address" class="input input-bordered rounded-none md:w-72" type="text" />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Code postal<span class="text-error">*</span></span>
          </label>
          <input v-model="postal_code" class="input input-bordered rounded-none md:w-72" type="text" />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Ville<span class="text-error">*</span></span>
          </label>
          <input v-model="city" class="input input-bordered rounded-none md:w-72" type="text" />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Pays<span class="text-error">*</span></span>
          </label>
          <input v-model="country" class="input input-bordered rounded-none md:w-72" type="text" />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Numéro de téléphone<span class="text-error">*</span></span>
          </label>
          <input v-model="phone_number" class="input input-bordered rounded-none md:w-72" type="text" />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Email <span class="text-error">*</span></span>
          </label>
          <input v-model="email" class="input input-bordered rounded-none md:w-72" required type="email" />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Siret<span class="text-error">*</span></span>
          </label>
          <input v-model="siret" class="input input-bordered rounded-none" maxlength="14" minlength="14" required
                 type="text" />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Site web</span>
          </label>
          <input v-model="website" class="input input-bordered rounded-none md:w-72" type="text" />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Choisissez votre spécialité<span class="text-error">*</span></span>
          </label>
          <select v-if="specialties && specialties.length" v-model="specialty"
                  class="select select-bordered rounded-none md:w-72">
            <option v-for="specialty in specialties" :key="specialty.id" :value="specialty.id">
              {{ specialty.name }}
            </option>
          </select>
        </div>

      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Description de votre boutique</span>
        </label>
        <input v-model="bio" class="input input-bordered rounded-none w-full" type="text" />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Histoire et informations supplémentaires de votre boutique</span>
        </label>
        <textarea v-model="history" class="input input-bordered rounded-none w-full" rows="5" type="text" />
      </div>


      <div class="form-control">
        <label class="label">
          <span class="label-text">Choisissez votre spécialité<span class="text-error">*</span></span>
        </label>
        <select v-if="specialties && specialties.length" v-model="specialty"
                class="select select-bordered rounded-none md:w-72">
          <option v-for="specialty in specialties" :key="specialty.id" :value="specialty.id">
            {{ specialty.name }}
          </option>
        </select>
      </div>

      <p class="text-center text-balance">Choisissez le theme de votre boutique (vous pouvez changer plus tard)</p>


      <div class="flex flex-row justify-around text-center">

        <div v-for="theme in themes" :key="theme.id">
          <input v-model="selectedTheme" :value="theme.id" class="radio" name="radio-theme" type="radio" />
          <label class="label">
            <span class="label-text">{{ theme.name }}</span>
          </label>
        </div>

      </div>

      <button class="btn btn-primary rounded-none text-white open-sans-regular mt-4 w-full" type="submit">
        Créer entreprise!
      </button>
    </form>

    <div :data-theme="themePreview" class="card max-w-72 rounded-none hidden md:block">
      <p class="text-center text-balance mb-5">Exemple de produit avec le thème choisi:</p>

      <figure>
        <img alt="Product image" class="object-cover h-80 w-72" src="/src/assets/images/assiette.png" />
      </figure>

      <div class="card-body pl-2 line-clamp-4">
        <h2 class="card-title open-sans-semibold uppercase text-lg pt-3">Assiette</h2>
        <p class="price-text">€ 45</p>
        <p class="description pt-5">Lorem ipsum</p>
      </div>

      <div>
        <CTAButtonBase text="PLUS DISPONIBLE" />
      </div>
    </div>

  </div>

</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import api from '@/services/api.js'
import CTAButtonBase from '@/components/CTAButtonBase.vue'

const userStore = useUserStore()
const router = useRouter()
const themePreview = ref('')

const business_name = ref('')
const address = ref('')
const postal_code = ref('')
const city = ref('')
const country = ref('')
const phone_number = ref('')
const email = ref('')
const siret = ref('')
const website = ref('')
const bio = ref('')
const history = ref('')
const specialty = ref('')
const selectedTheme = ref('' || 'artisan')
const user_id = userStore.userObject.id

const register = async () => {
  try {
    const userInput = {
      name: business_name.value,
      address: address.value,
      postal_code: postal_code.value,
      city: city.value,
      country: country.value,
      phone_number: phone_number.value,
      email: email.value,
      siret: siret.value,
      website: website.value,
      biography: bio.value,
      history: history.value,
      user_id: user_id,
      specialty_id: specialty.value,
      theme_id: selectedTheme.value
    }

    await userStore.createBusiness(userInput)
    alert('Entreprise créée -> Commencez à vendre dès maintenant!')
    const updatedUser = await userStore.getCurrentUser(userStore.userObject)
    await userStore.storeUser(updatedUser)
    await router.push('/profile')
  } catch (error) {
    alert('Failed to create business. ' + (error.message || 'Unknown error'))
  }
}

const specialties = ref([])

const fetchSpecialities = async () => {
  let endpoint = 'specialties'

  try {
    const response = await api.get(endpoint, {})
    specialties.value = response.data
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
}

const themes = ref([])

const fetchThemes = async () => {
  let endpoint = 'themes'

  try {
    const response = await api.get(endpoint, {})
    themes.value = response.data
  } catch (error) {
    console.error('Failed to fetch themes:', error)
  }
}

watch(selectedTheme, (newValue) => {
  const selectedTheme = themes.value.find(theme => theme.id === newValue)
  if (selectedTheme) {
    themePreview.value = selectedTheme.name
  }
})


onMounted(() => {
  fetchSpecialities()
  fetchThemes()
})

</script>
