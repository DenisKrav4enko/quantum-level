<template>
  <div class="item-details">
    <h3>Edit Item</h3>
    <div class="input-group">
      <label :for="item.name">Name:</label>
      <input :id="item.name" v-model="item.name" @input="checkChanges" />
    </div>
    <div v-for="(value, key) in item.data" :key="key" class="input-group">
      <label :for="key">{{ key }}:</label>
      <input :id="key" v-model="item.data[key]" @input="checkChanges" />
    </div>
    <button @click="saveChanges" :disabled="!hasChanges">Save  ✔️</button>
    <button @click="discardChanges" :disabled="!hasChanges">Discard ❌</button>
    <button @click="confirmDelete">Delete Item</button>

    <div v-if="showConfirmation" class="modal-overlay">
      <div class="modal">
        <p>You want to delete this item?</p>
        <p>Are you sure?</p>
        <div class="btns-block">
          <button @click="deleteItem">Yes ✔️</button>
          <button @click="closeConfirmation">No ❌</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useItemsStore } from '../stores/items';
import {ref, watch, onMounted, getCurrentInstance} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isEqual } from 'lodash';


export default {
  setup() {
    const store = useItemsStore();
    const route = useRoute();
    const router = useRouter();
    const item = ref({});
    const originalItem = ref({});
    const hasChanges = ref(false);
    const showConfirmation = ref(false);
    const { proxy } = getCurrentInstance()

    const fetchItem = async () => {
      const fetchedItem = await store.fetchItemById(route.params.id);
      item.value = fetchedItem;
      originalItem.value = JSON.parse(JSON.stringify(fetchedItem));
    };

    const checkChanges = () => {
      hasChanges.value = !isEqual(item.value, originalItem.value);
    };

    const saveChanges = async () => {
      await store.updateItem(item.value);
      originalItem.value = JSON.parse(JSON.stringify(item.value));
      hasChanges.value = false;
      proxy.$router.push('/')
    };

    const discardChanges = () => {
      item.value = JSON.parse(JSON.stringify(originalItem.value));
      hasChanges.value = false;
    };

    const confirmDelete = () => {
      showConfirmation.value = true;
    };

    const deleteItem = async () => {
      try {
        await store.deleteItem(item.value.id);
        proxy.$router.push('/');
      } catch (error) {
        alert(error);
      }
    };

    const closeConfirmation = () => {
      showConfirmation.value = false;
    };

    watch(() => route.params.id, fetchItem);
    onMounted(() => {
      store.fetchItemsIfNeeded();
      fetchItem();
    });


    return {
      item,
      hasChanges,
      deleteItem,
      saveChanges,
      checkChanges,
      confirmDelete,
      discardChanges,
      showConfirmation,
      closeConfirmation

    };
  },
};
</script>

<style>
.item-details {
  max-width: 100%;
  margin: 10px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.item-details h3 {
  margin-bottom: 15px;
  font-size: 20px;
  color: #222222;
}

.item-details label {
  display: block;
  font-weight: bold;
  color: #222222;
}

.input-group {
  margin-bottom: 10px;
}

.item-details input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.item-details button {
  padding: 10px 20px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.item-details button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.item-details button:not(:disabled) {
  background-color: #007BFF;
  color: #fff;
}

.item-details button:not(:disabled):hover {
  background-color: #0056b3;
}

.item-details button:not(:disabled):active {
  background-color: #004085;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal p {
  font-size: 18px;
  text-align: center;
  padding: 0;
}

.btns-block {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-top: 15px;
}

.modal button {
  margin-right: 10px;
}

@media (min-width: 600px) {
  .item-details {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
  }

  .item-details h3 {
    font-size: 22px;
  }

  .modal {
    padding: 30px;
  }

  .modal p {
    font-size: 20px;
  }
}

@media (min-width: 900px) {
  .item-details {
    max-width: 600px;
  }

  .item-details h3 {
    font-size: 24px;
  }
}
</style>