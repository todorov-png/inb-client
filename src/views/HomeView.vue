<template>
  <NotActivated v-if="!isActivated" />
  <NotTeam v-else-if="!isTeam" />
  <div v-else>Тут список лендов</div>
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
      isTeam() {
        return this.$store.state.user.isTeam || false;
      },
    },
    methods: {},
  };
</script>

