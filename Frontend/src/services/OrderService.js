import api from './api';

export default {
  async createOrder(orderData) {
    try {
      const response = await api.post('orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};