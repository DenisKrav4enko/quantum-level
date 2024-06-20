import { defineStore } from 'pinia';
import axios from 'axios';

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
    showLoadMore(state, getters) {
      const endIndex = state.currentPage * state.itemsPerPage;

      if (state.filteredItems) {
        return endIndex < state.filteredItems.length;
      }

      return false;
    },
    displayedItems(state, getters) {
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
      const response = await axios.get(`https://api.restful-api.dev/objects`);
      this.items = response.data;
    },
    loadMore() {
      this.itemsPerPage = 20
    },
    updateSearch(search) {
      this.search = search;
    },
    async fetchItemById(id) {
      const response = await axios.get(`https://api.restful-api.dev/objects/${id}`);

      return response.data;
    },
    async updateItem(item) {
      await axios.put(`https://api.restful-api.dev/objects/${item.id}`, item);
    },
    async deleteItem(id) {
      await axios.delete(`https://api.restful-api.dev/objects/${id}`);
      this.items = this.items.filter(item => item.id !== id);
    },
  },
});