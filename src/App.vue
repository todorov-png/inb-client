<template>
  <div
    v-if="getStatusLoading"
    class="absolute top-0 bottom-0 left-0 right-0 flex flex-wrap align-content-center"
  >
    <ProgressSpinner strokeWidth="5" />
  </div>
  <template v-else>
    <ConfirmPopup class="m-auto w-max max-w-30rem h-content-max top-0 right-0 bottom-0 left-0" />
    <Toast />
    <RouterView />
  </template>
</template>

<script>
  import Toast from 'primevue/toast';
  import ConfirmPopup from 'primevue/confirmpopup';
  import ProgressSpinner from 'primevue/progressspinner';
  import { mapGetters } from 'vuex';

  export default {
    components: { ConfirmPopup, Toast, ProgressSpinner },
    created() {
      document.body.scrollTop = 0;
      window.addEventListener('resize', this.onResize, true);
      window.addEventListener('touchmove', this.onResize, true);
      this.onResize();
    },
    unmounted() {
      window.removeEventListener('resize', this.onResize, true);
      window.removeEventListener('touchmove', this.onResize, true);
    },
    computed: {
      ...mapGetters(['getStatusLoading']),
    },
    methods: {
      onResize() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      },
    },
  };
</script>
