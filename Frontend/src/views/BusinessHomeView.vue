<template>
  <div class="product-form p-5 bg-white rounded-lg shadow-lg w-1/3 mx-auto my-10">
    <h2 class="text-2xl font-bold mb-6 text-center">Add Product</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group mb-4">
        <label for="business_id" class="block text-sm font-medium text-gray-700">Business ID:</label>
        <input id="business_id" v-model="product.business_id" type="text" required class="input input-bordered w-full"/>
      </div>
      <div class="form-group mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
        <input id="name" v-model="product.name" type="text" required class="input input-bordered w-full"/>
      </div>
      <div class="form-group mb-4">
        <label for="description" class="block text-sm font-medium text-gray-700">Description:</label>
        <input id="description" v-model="product.description" type="text" class="input input-bordered w-full"/>
      </div>
      <div class="form-group mb-4">
        <label for="price" class="block text-sm font-medium text-gray-700">Prix:</label>
        <input id="price" v-model="product.price" type="number" required step="0.01" class="input input-bordered w-full"/>
      </div>
      <div class="form-group mb-4">
        <label for="stock" class="block text-sm font-medium text-gray-700">Stock:</label>
        <input id="stock" v-model="product.stock" type="number" required class="input input-bordered w-full"/>
      </div>
<!--      <div class="form-group mb-4">-->
<!--        <label for="material_id" class="block text-sm font-medium text-gray-700">Material ID:</label>-->
<!--        <input id="material_id" v-model="product.material_id" type="text" required class="input input-bordered w-full"/>-->
<!--      </div>-->
      <div class="form-group mb-4">
        <label for="material_id" class="block text-sm font-medium text-gray-700">Material:</label>
        <select id="material_id" v-model="product.material_id" required class="input input-bordered w-full">
          <option disabled value="">Please select one</option>
          <option v-for="material in materials" :key="material.id" :value="material.id">
            {{ material.name }}
          </option>
        </select>
      </div>
      <div class="form-group mb-4">
        <label for="size" class="block text-sm font-medium text-gray-700">Size:</label>
        <input id="size" v-model="product.size" type="text" required class="input input-bordered w-full"/>
      </div>
      <div class="form-group mb-4">
        <label for="weight" class="block text-sm font-medium text-gray-700">Poids:</label>
        <input id="weight" v-model="product.weight" type="number" required step="0.10" class="input input-bordered w-full"/>
      </div>
      <div class="form-group mb-4">
        <label for="color_id" class="block text-sm font-medium text-gray-700">Color ID:</label>
        <input id="color_id" v-model="product.color_id" type="text" required class="input input-bordered w-full"/>
      </div>
      <div class="form-group mb-4">
        <label for="customisable" class="flex items-center space-x-2 text-sm font-medium text-gray-700">
          <input id="customisable" type="checkbox" v-model="product.customisable" class="checkbox"/>
          <span>Customisable</span>
        </label>
      </div>
      <div class="form-group mb-6">
        <label for="image_path" class="block text-sm font-medium text-gray-700">Image Path:</label>
        <input id="image_path" v-model="product.image_path" type="text" class="input input-bordered w-full"/>
      </div>
      <button type="submit" class="btn btn-primary w-full">Add Product</button>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '@/services/api.js'

onMounted(async () => {
  try {
    const response = await api.get('materials');
    console.log(response)
    materials.value = response.data;
  } catch (error) {
    console.error('Failed to fetch materials:', error.response);
  }
});

const materials = ref([]);
const product = ref({
  business_id: '9bd858b8-845c-48ad-b8f0-d466ad6a96d5',
  name: '',
  description: '',
  price: null,
  stock: null,
  material_id: '9bd85560-2d87-4dc1-a5e5-9825b1125d46',
  size: 'M',
  weight: null,
  color_id: '9bd85560-186a-4a3e-9d09-74af204414fb',
  customisable: false,
  image_path: 'assiette.png',
});

const submitForm = async () => {
  try {
    const response = await api.post('products', product.value);
    console.log('Product Created:', response.data);
    alert('Product added successfully!');
    resetForm();
  } catch (error) {
    console.error('There was an error posting the product:', error.response);
    alert('Failed to add product.');
  }
};

const resetForm = () => {
  product.value = {
    business_id: '',
    name: '',
    description: '',
    price: null,
    stock: null,
    material_id: '',
    size: '',
    weight: null,
    color_id: '',
    customisable: false,
    image_path: '',
  };
};
</script>

<style scoped>
.form-group label {
  display: block;
}
</style>
