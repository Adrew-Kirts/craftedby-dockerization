import { defineStore } from 'pinia'
import api from '@/services/api.js'
import router from '@/router/index.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    storedUser: localStorage.getItem('user') || null,
    userObject: JSON.parse(localStorage.getItem('user') || 'null')
  }),

  actions: {
    async signUp(userData) {
      const res = await api.post(`/users`, userData)
      this.storeUser(res.data.user)
      this.storeToken(res.data.token)
    },

    async createBusiness(businessData) {
      await api.post(`/businesses`, businessData)
    },

    async signIn(email, password, rememberMe) {
      const res = await api.post('/login', { email, password, rememberMe })
      this.storeUser(res.data.user)
      this.storeToken(res.data.token)
    },

    async passwordReset(email) {
      await api.post('/password/reset-link', { email })
    },

    async newPassword(userData) {
      await api.post('/password/reset', userData)
    },

    async getCurrentUser (userObject) {
      try {
        const response = await api.get(`/users/${userObject.id}`)
        if (response.data) {
          return response.data.user
        }
      } catch (error) {
        console.error(error)
      }
    },

    // async fetchCurrentUser() {
    //   try {
    //     const res = await api.get('/current-user')
    //     // this.userObject = res.data.user;
    //     this.token = localStorage.getItem('token');
    //     return true;
    //   } catch (error) {
    //     console.error("Failed to fetch user:", error);
    //     // this.logout();
    //     return false;
    //   }
    // },

    //
    // storeUser(token, user) {
    //   // Update the store state
    //   this.token = token;
    //   // this.storedUser = user;
    //   this.storedUser = JSON.stringify(user);
    //   this.userObject = user;
    //
    //   // Save the token to localStorage
    //   localStorage.setItem('token', token);
    //   // Save the user to localStorage
    //   localStorage.setItem('user', JSON.stringify(user));
    // },

    storeUser(user) {
      this.storedUser = JSON.stringify(user)
      this.userObject = user
      localStorage.setItem('user', JSON.stringify(user))
    },

    storeToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },

    logout() {
      // Reset the store state
      this.token = null
      this.storedUser = null
      this.userObject = null

      // Clear the token and user from localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }

  }
})