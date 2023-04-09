<template>
  <div class="h-full flex align-items-center justify-content-center">
    <Card class="max-w-30rem text-center">
      <template #header>
        <img class="w-11rem h-11rem pt-4 px-4 mx-auto" alt="profile" :src="PathProfileSvg" />
      </template>
      <template #content>
        <div class="flex justify-content-center gap-3 mb-4">
          <SelectButton
            :modelValue="theme"
            :options="themeOptions"
            :unselectable="true"
            @change="changeTheme($event.value)"
          />
          <SelectButton
            :modelValue="lang"
            :options="langOptions"
            :unselectable="true"
            @change="changeLang($event.value)"
          />
        </div>
        <div class="p-inputgroup mb-2">
      <span class="p-inputgroup-addon">
        <i class="pi pi-user"></i>
      </span>
      <InputText v-model="username" type="text" name="name" placeholder="Username" />
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
    <div class="p-inputgroup">
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
      </template>
      <template #footer>
        <Button
          type="button"
          class="w-full mb-3"
          label="Sign In"
          icon="pi pi-sign-in"
          :loading="loadingSubmit"
          @click="submitForm"
        ></Button>
        <router-link :to="{ name: 'home' }" custom v-slot="{ navigate }">
          <Button
            class="w-full"
            label="Registration"
            severity="secondary"
            role="link"
            outlined
            icon="pi pi-user-plus"
            @click="navigate"
          ></Button>
        </router-link>
      </template>
    </Card>
  </div>
</template>

<script>
  import Card from 'primevue/card';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import SelectButton from 'primevue/selectbutton';
  import ProfileSvg from '@/assets/img/svg/profile.svg';
  import { getCookie, setCookie } from '@/lib/cookie.js';
  // import UserService from '@/services/UserService';

  export default {
    components: { Card, Button, SelectButton, InputText, Password },

    data() {
      return {
        PathProfileSvg: ProfileSvg,
        theme: null,
        themeOptions: ['Light', 'Dark'],
        lang: null,
        langOptions: ['EN', 'RU', 'UK'],
      };
    },

    created() {
      this.theme = getCookie('theme') || 'Light';
      this.lang = getCookie('lang') || 'RU';
    },

    methods: {
      changeTheme(value) {
        setCookie('theme', value);
        this.theme = value;
      },
      changeLang(value) {
        setCookie('lang', value);
        this.lang = value;
      },
    },
  };
</script>
