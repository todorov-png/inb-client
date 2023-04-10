<template>
  <Fieldset class="w-full max-w-27rem mb-8">
    <template #legend>
      <div class="flex align-items-center text-primary">
        <span class="pi pi-user mr-2"></span>
        <span class="font-bold text-lg">Registration</span>
      </div>
    </template>
    <div class="p-inputgroup mb-2">
      <span class="p-inputgroup-addon">
        <i class="pi pi-user"></i>
      </span>
      <InputText v-model="username" type="text" name="username" placeholder="Username" />
    </div>
    <div class="p-inputgroup mb-2">
      <span class="p-inputgroup-addon">
        <i class="pi pi-at"></i>
      </span>
      <InputText v-model="email" name="email" type="email" placeholder="Email" />
    </div>
    <div class="p-inputgroup mb-2">
      <span class="p-inputgroup-addon">
        <i class="pi pi-key"></i>
      </span>
      <Password
        v-model="password"
        name="password"
        type="password"
        class="flex"
        placeholder="Password"
        :feedback="false"
        toggleMask
      />
    </div>
    <div class="p-inputgroup mb-3">
      <span class="p-inputgroup-addon">
        <i class="pi pi-key"></i>
      </span>
      <Password
        v-model="repeatPassword"
        name="repeat-password"
        type="password"
        class="flex"
        placeholder="Repeat password"
        :feedback="false"
        toggleMask
      />
    </div>
    <Button
      type="button"
      class="w-full mb-3"
      label="Sign up"
      icon="pi pi-user-plus"
      :loading="loadingSubmit"
      @click="submitForm"
    ></Button>
    <router-link :to="{ name: 'login' }" custom v-slot="{ navigate }">
      <Button
        class="w-full"
        label="Login"
        severity="secondary"
        role="link"
        outlined
        icon="pi pi-sign-in"
        @click="navigate"
      ></Button>
    </router-link>
  </Fieldset>
</template>

<script>
  import Fieldset from 'primevue/fieldset';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import Button from 'primevue/button';
  import { mapActions } from 'vuex';

  export default {
    components: {
      Fieldset,
      InputText,
      Password,
      Button,
    },
    data() {
      return {
        username: '',
        email: '',
        password: '',
        repeatPassword: '',
        loadingSubmit: false,
      };
    },
    methods: {
      ...mapActions(['registration']),
      async submitForm() {
        this.loadingSubmit = true;
        const response = await this.registration({
          username: this.username,
          email: this.email,
          password: this.password,
          repeatPassword: this.repeatPassword,
        });
        if (response.success) {
          this.$router.push({ name: 'home' });
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: response.messageError,
            life: 3000,
          });
        }
        this.loadingSubmit = false;
      },
    },
  };
</script>
