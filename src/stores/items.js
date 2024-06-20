import { defineStore } from 'pinia';
import axios from 'axios';

const BASE_URL = 'https://api.restful-api.dev/objects'

export const useItemsStore = defineStore('items', {
  state: () => ({
    items: [],
    search: '',
    currentPage: 1,
    filteredItems: [],
    itemsPerPage: 10,
  }),
  getters: {
    filteredItems(state) {
      const searchLowerCase = state.search.toLowerCase();

      return state.items
          .filter(item => item.name.toLowerCase().includes(searchLowerCase))
          .sort((a, b) => a.name.localeCompare(b.name));
    },
    showLoadMore(state) {
      const endIndex = state.currentPage * state.itemsPerPage;

      if (state.filteredItems) {
        return endIndex < state.filteredItems.length;
      }

      return false;
    },
    displayedItems(state) {
      const startIndex = (state.currentPage - 1) * state.itemsPerPage;
      const endIndex = state.currentPage * state.itemsPerPage;

      if (state.filteredItems.length >= 1) {
        return state.filteredItems.slice(startIndex, endIndex);
      }

      return [];
    }
  },
  actions: {
    async fetchItems() {
      const response = await axios.get(BASE_URL);
      this.items = response.data;
    },
    loadMore() {
      this.itemsPerPage = 20
    },
    updateSearch(search) {
      this.search = search;
    },
    async fetchItemById(id) {
      const response = await axios.get(`${BASE_URL}/${id}`);

      return response.data;
    },
    async updateItem(item) {
      try {
        const response = await axios.put(`${BASE_URL}/${item.id}`, item);

        return response.status;
      } catch (error) {
        if (error.response && error.response.data.error.includes('reserved id')) {
          const newResponse = await axios.post(`${BASE_URL}`, item);
          const newItem = newResponse.data;

          const updateResponse = await axios.put(`${BASE_URL}/${newItem.id}`, newItem);

          return updateResponse.status;
        } else {
          throw error;
        }
      }
    },
    async deleteItem(id) {
      try {
        await axios.delete(`${BASE_URL}/${id}`);
        this.items = this.items.filter(item => item.id !== id);
      } catch (error) {
        if (error.response && error.response.data.error.includes('reserved id')) {
          const response = await axios.get(`${BASE_URL}/${id}`);
          const newResponse = await axios.post(`${BASE_URL}`, response.data);
          const newItem = newResponse.data;

          await axios.delete(`${BASE_URL}/${newItem.id}`);
          this.items = this.items.filter(item => item.id !== id);
        } else {
          throw error;
        }
      }
    },
  },
});