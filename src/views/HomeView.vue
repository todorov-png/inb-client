<template>
  <NotActivated v-if="!isActivated" />
</template>

<script>
  import NotActivated from '@/components/NotActivated.vue';
  import { mapGetters } from 'vuex';

  export default {
    components: { NotActivated },
    data() {
      return {};
    },
    computed: {
      ...mapGetters(['getUser']),

      isActivated() {
        return this.getUser.isActivated || false;
      },
    },
    methods: {},
  };
</script>

