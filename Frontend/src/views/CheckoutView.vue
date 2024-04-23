<template>
  <div class="flex flex-col max-w-full mx-auto md:w-3/4">
    <div class="flex flex-col">
      <div class="md:ml-0 ml-8">
    <p v-if="cart.itemCount > 1" class="mt-5 text-lg">Panier ({{ cart.itemCount }} produits)</p>
    <p v-else-if="cart.itemCount === 1" class="mt-5 text-lg">Panier ({{ cart.itemCount }} produit)</p>
      </div>
    <div class="md:mt-5">
<!--      <div v-if="notificationMessage"><notification-component :type="notificationType" :message="notificationMessage" /></div>-->

      <!--desktop view-->
      <table class="hidden md:table table-compact sm:table-normal">
      <thead class="text-white bg-black">
        <tr>
          <th><img src="../assets/icons/trash.svg" alt="Delete Icon" ></th>
          <th class="uppercase">Photo</th>
          <th class="uppercase">Produit</th>
          <th class="uppercase">Prix</th>
          <th class="uppercase">Quantité</th>
          <th class="uppercase">Total</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in cart.items" :key="item.id" class="align-middle">
          <td><button @click="cart.removeFromCart(item.id)" class="btn btn-ghost btn-sm text-primary mr-2 open-sans-regular">X</button></td>
          <td class="flex items-center">
<!--            <img :src="'http://localhost:8000/images/products/' + item.image_path" alt="Image du produit" class="w-20 h-20 object-cover">-->
<!--            <img :src="imageBaseUrl + '/images/products/' + item.image_path" alt="Image du produit" class="w-20 h-20 object-cover">-->
            <img :src="`${imageBaseUrl}/images/products/${item.image_path}`" alt="Image du produit" class="w-20 h-20 object-cover">
          </td>
          <td class="uppercase">{{ item.name }}</td>
          <td>€{{ item.price }}</td>
          <td>
            <div class="inline-block p-1 pl-2 pr-2 items-center border border-black">
              <button @click="cart.decreaseQuantity(item.id)" class="btn btn-ghost btn-xs">-</button>
              {{ item.quantity }}
              <button @click="cart.increaseQuantity(item.id)" class="btn btn-ghost btn-xs">+</button>
            </div>
          </td>
          <td class="text-secondary">€{{ item.quantity * item.price }}</td>
          <td></td>
        </tr>
        </tbody>
      </table>

<!--mobile view-->
      <div class="mt-5 block md:hidden m-5">
        <div v-for="item in cart.items" :key="item.id" class="p-2">
          <div class="flex">
            <button @click="cart.removeFromCart(item.id)" class="btn btn-ghost btn-xl text-primary open-sans-regular mb-5 text-xl">X</button>
          </div>
          <div class="flex items-center space-x-3">
            <img :src="`${imageBaseUrl}/images/products/${item.image_path}`" alt="Image du produit" class="w-24 h-24 object-cover">
            <p class="uppercase flex-grow">{{ item.name }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4 items-center"> <!-- Adjusted items-center here -->
            <p>Prix:</p>
            <p class="text-right">€{{ item.price }}</p>
            <p>Quantité:</p>
            <div class="flex justify-end">
              <div class="flex items-center border border-black"> <!-- Adjusted for flex items-center -->
                <button @click="cart.decreaseQuantity(item.id)" class="btn btn-ghost text-xl pr-6">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="cart.increaseQuantity(item.id)" class="btn btn-ghost text-xl pl-6">+</button>
              </div>
            </div>
            <p>Total:</p>
            <p class="text-right text-secondary text-lg font-bold">€{{ item.quantity * item.price }}</p>
          </div>
          <div class="divider divider-neutral"></div>
        </div>
      </div>

    </div>
      <UserInformationFieldComponent class="text-lg"></UserInformationFieldComponent>
    </div>
    <div class="price-box mt-10 mx-auto w-full p-8 border bg-black text-white md:ml-auto md:mr-0 md:w-1/3">
    <p class="text-lg">Total panier</p>
      <div class="grid grid-cols-2 mt-10">
        <p class="text-left">Prix TTC</p>
        <p class="text-right">€{{ cart.totalPrice }}</p>
      </div>
      <CTAButtonPrimary @click="submitOrder" text="PAYER" class="mt-10 w-full"/>
    </div>
    <notification-component :type="notificationType" :message="notificationMessage" />
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import OrderService from '@/services/OrderService';
import { useUserStore } from '@/stores/user.js';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import UserInformationFieldComponent from '@/components/UserInformationFieldComponent.vue'
import CTAButtonPrimary from '@/components/CTAButtonPrimary.vue'
import NotificationComponent from '@/components/NotificationComponent.vue'

const notificationMessage = ref('');
const notificationType = ref('success');

const imageBaseUrl = ref(import.meta.env.VITE_IMAGE_BASE_URL);

const user = useUserStore();
const cart = useCartStore();
const router = useRouter();

const email = ref('');
const address = ref('');
const first_name = ref('');
const last_name = ref('');

const submitOrder = async () => {
  const taxRate = 0.20;
  const totalWithoutTax = cart.totalPrice / (1 + taxRate);
  const taxAmount = cart.totalPrice - totalWithoutTax;

  const orderData = {
    user: {
      id: user.userObject.id,
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      address: address.value,
    },
    items: cart.items.map(item => ({
      id: item.id,
      quantity: item.quantity
    })),
    payment_status: 0,
    user_id: user.userObject.id,
    total_without_tax: totalWithoutTax.toFixed(2),
    tax_amount: taxAmount.toFixed(2),
    total_tax_included: cart.totalPrice.toFixed(2),
  };

  try {
    const response = await OrderService.createOrder(orderData);
    // alert(`Merci pour votre commande! Numero de commande: ${response.order.order_number}`);
    notificationMessage.value = `Merci pour votre commande! Numero de commande: ${response.order.order_number} Vous allez être dirigé vers votre profil maintenant`;
    notificationType.value = 'success';
    // cart.clearCart();
    // await router.push('/profile');

    await nextTick(); // Wait for the next DOM update to show the notification
    setTimeout(async () => {
      cart.clearCart();
      await router.push('/profile');
    }, 3000);

  } catch (error) {
    console.error('Error creating order:', error.message || 'Unknown error');
    // alert('Failed to create order.');
    notificationMessage.value = 'Failed to create order.';
    notificationType.value = 'error';
  }
};
</script>

<style scoped>

* {
  font-family: 'open-sans-regular', sans-serif;
}

.price-box {
  width: 400px;
}

.btn {
  border-width: 0;
}
</style>
