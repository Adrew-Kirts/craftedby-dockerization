<template>
  <div class="admin-panel p-4">
    <h2 class="text-2xl font-bold my-4">User Management</h2>
    <div class="flex justify-between items-center mb-4">
      <button class="btn btn-primary" @click="fetchUsers">Refresh Users</button>
      <button class="btn btn-primary" @click="toggleCreateUserModal">Create User</button>
    </div>
    <div v-if="createUserModalVisible" class="bg-white p-4 rounded shadow-md mb-4">
      <h3 class="text-lg font-bold mb-2">Nouveau utilisateur</h3>
      <a>Email</a>
      <input v-model="newUser.email" placeholder="Email" class="input mb-2">
      <a>Mot de passe</a>
      <input type="password" v-model="newUser.password" placeholder="Mot de passe" class="input mb-2">
      <a>Confirmation</a>
      <input type="password" v-model="newUser.password_confirmation" name="password_confirmation" placeholder="Mot de passe" class="input mb-2" required minlength="6"/>
      <button class="btn btn-primary" @click="createUser">Submit</button>

    </div>
    <ul class="list-disc">
      <li v-for="user in users" :key="user.id" class="flex items-center justify-between bg-white p-4 rounded shadow-md mb-2">
        <span>{{ user.email }}</span>
        <div>
          <button @click="showEditUserModal(user)" class="btn btn-secondary mr-2">Edit</button>
          <button @click="deleteUser(user.id)" class="btn btn-danger">Delete</button>
        </div>
      </li>
    </ul>
    <div v-if="editUserModalVisible" class="bg-white p-4 rounded shadow-md mt-4">
      <h3 class="text-lg font-bold mb-2">Edit User</h3>
      <input v-model="editUserData.email" placeholder="Email" class="input mb-2">
      <input type="password" v-model="editUserData.password" placeholder="Password" class="input mb-2">
      <button @click="updateUser" class="btn btn-primary">Update User</button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const users = ref([]);
const newUser = ref({ email: '', password: '' });
const editUserData = ref({});
const createUserModalVisible = ref(false);
const editUserModalVisible = ref(false);

const fetchUsers = async () => {
  try {
    const response = await api.get('users');
    users.value = response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};

const createUser = async () => {
  try {
    await api.post('users', newUser.value);
    newUser.value = { email: '', password: '' };
    createUserModalVisible.value = false;
    await fetchUsers();
  } catch (error) {
    console.error("Failed to create user:", error);
  }
};

const showEditUserModal = (user) => {
  editUserData.value = { ...user };
  editUserModalVisible.value = true;
};

const updateUser = async () => {
  try {
    await api.patch(`users/${editUserData.value.id}`, editUserData.value);
    editUserModalVisible.value = false;
    await fetchUsers();
  } catch (error) {
    console.error("Failed to update user:", error);
  }
};

const deleteUser = async (id) => {
  try {
    await api.delete(`users/${id}`);
    await fetchUsers();
  } catch (error) {
    console.error("Failed to delete user:", error);
  }
};

const toggleCreateUserModal = () => {
  createUserModalVisible.value = !createUserModalVisible.value;
};

onMounted(fetchUsers);
</script>

<style scoped>
/* Add your styles here */
</style>
