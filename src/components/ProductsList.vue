<template>
  {{ data }}
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    data() {
      return {
        data: 1111,
      };
    },

    created() {
      this.getProducts();
    },

    methods: {
      ...mapActions(['getProducts']),
    },
  };
</script>
