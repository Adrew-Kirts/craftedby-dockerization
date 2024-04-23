import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Header from './components/HeaderComponent.vue';
import Footer from './components/FooterComponent.vue';

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.use(router)

app.mount('#app')

app.component('HeaderComponent', Header);
app.component('FooterComponent', Footer);
