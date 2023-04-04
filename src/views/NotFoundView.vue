<template>
  <div class="main-container container flex align-items-center justify-content-center">
    <div class="not-found scalein animation-duration-400">
      <h1 class="not-found__title mb-4">Oops!</h1>
      <h2 class="not-found__subtitle mb-4">404 - Page not found</h2>
      <router-link :to="{ name: 'home' }" custom v-slot="{ navigate }">
        <Button
          label="Go To Homepage"
          role="link"
          size="large"
          rounded
          raised
          icon="pi pi-home"
          @click="navigate"
        ></Button>
      </router-link>
    </div>
  </div>
</template>

<script>
  import Button from 'primevue/button';

  export default {
    components: { Button },
  };
</script>
