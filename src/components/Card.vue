<template>
  <div class="card">
    <h3 @click="goToItem">{{ item?.name ?? 'No name' }}</h3>
    <h4><span>id: </span>{{ item?.id ?? 'No id' }}</h4>
    <ul>
      <li v-for="(value, key) in item.data" :key="key">
        <span>{{ key }}:</span> {{ value }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  methods: {
    goToItem() {
      this.$emit('click');
    },
  },
};
</script>

<style>
.card {
  width: 100%;
  height: auto;
  color: #2c3e50;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 10px;
}

h3 {
  cursor: pointer;
  font-weight: 600;
  padding-bottom: 8px;
}

ul {
  list-style-type: none;
  padding: 0;
}

span {
  font-weight: 600;
}

@media (min-width: 600px) {
  .card {
    width: calc((100vw - 50px) / 2);
  }
}

@media (min-width: 900px) {
  .card {
    width: calc((100vw - 140px) / 3);
    height: 186px;
    border-radius: 14px;
  }
}

@media (min-width: 1024px) {
  .card {
    width: calc((100vw - 180px) / 4);
    height: 186px;
    border-radius: 14px;
  }
}
</style>