<template>
  <NotActivated v-if="isActivated" />
  <NotTeam v-else/>
</template>

<script>
  import NotActivated from '@/components/NotActivated.vue';
  import NotTeam from '@/components/NotTeam.vue';
  import { mapGetters } from 'vuex';

  export default {
    components: { NotActivated, NotTeam },
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

