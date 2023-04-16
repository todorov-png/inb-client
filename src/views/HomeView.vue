<template>
  <NotActivated v-if="isActivated" />
  <NotTeam v-else />
</template>

<script>
  import NotActivated from '@/components/NotActivated.vue';
  import NotTeam from '@/components/NotTeam.vue';

  export default {
    components: { NotActivated, NotTeam },
    data() {
      return {};
    },
    computed: {
      isActivated() {
        return this.$store.state.user.isActivated || false;
      },
    },
    methods: {},
  };
</script>

