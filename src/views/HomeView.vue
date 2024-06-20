<template>
  <div class="container">
    <input v-model="search" placeholder="iPhone" @input="updateSearch" />
    <div class="cards">
      <Card
          v-for="item in displayedItems"
          :key="item.id"
          :item="item"
          @click="goToItem(item.id)"
      />
      <button class="btn-grid" @click="loadMore" :disabled="!showLoadMore">Load More</button>
    </div>
  </div>
</template>

<script>
import { useItemsStore } from '../stores/items';
import { storeToRefs } from 'pinia';
import { onMounted, getCurrentInstance } from 'vue';
import Card from '../components/Card.vue';

export default {
  components: {
    Card,
  },
  setup() {
    const store = useItemsStore();
    const { displayedItems, showLoadMore, search } = storeToRefs(store);
    const { proxy } = getCurrentInstance();

    const updateSearch = (event) => {
      store.updateSearch(event.target.value);
    };

    const loadMore = () => {
      store.loadMore();
    };

    const goToItem = (id) => {
      proxy.$router.push(`/item/${id}`);
    };

    onMounted(() => {
      store.fetchItems();
    });

    return {
      displayedItems,
      showLoadMore,
      search,
      updateSearch,
      loadMore,
      goToItem,
    };
  },
};
</script>

<style>
.container {
  max-width: 100vw;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

input {
  width: 100%;
  font-size: 16px;
  padding: 10px;
  border-radius: 8px;
  outline: none;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.btn-grid {
  width: 100%;
  padding: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  background-color: #007BFF;
  color: #fff;
  cursor: pointer;
}

.btn-grid:hover {
  background-color: #0056b3;
}

.btn-grid:disabled {
  display: none;
}

@media (min-width: 600px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .container {
    padding: 30px 60px;
  }

  .cards {
    grid-template-columns: repeat(3, 1fr);
  }

  .btn-grid {
    width: calc((100vw - 140px) / 3);
    height: 186px;
    font-size: 18px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 30px 60px;
  }

  .cards {
    grid-template-columns: repeat(4, 1fr);
  }

  .btn-grid {
    width: calc((100vw - 180px) / 4);
    height: 186px;
    font-size: 18px;
  }
}
</style>