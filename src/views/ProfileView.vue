<template>
  <div class="h-full flex align-items-center justify-content-center">
    <Card class="max-w-30rem text-center">
      <template #header>
        <img class="w-11rem h-11rem pt-4 px-4 mx-auto" alt="profile" :src="PathProfileSvg" />
      </template>
      <template #content>
        <div class="flex justify-content-center gap-3 mb-4" style="margin-top: -1.25rem">
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
          <InputText v-model="newUsername" type="text" name="username" :placeholder="getUsername" />
        </div>
        <div class="p-inputgroup mb-2">
          <span class="p-inputgroup-addon">
            <i class="pi pi-at"></i>
          </span>
          <InputText v-model="newEmail" name="email" type="email" :placeholder="getEmail" />
        </div>
        <div class="p-inputgroup mb-2">
          <span class="p-inputgroup-addon">
            <i class="pi pi-key"></i>
          </span>
          <Password
            v-model="newPassword"
            name="new-password"
            type="password"
            class="flex"
            placeholder="New password"
            :feedback="false"
            toggleMask
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="pi pi-key"></i>
          </span>
          <Password
            v-model="currentPassword"
            name="password"
            type="password"
            class="flex"
            placeholder="Current password"
            :feedback="false"
            toggleMask
          />
        </div>
      </template>
      <template #footer>
        <Button
          type="button"
          class="w-full mb-3"
          label="Save"
          icon="pi pi-save"
          :loading="loadingSubmit"
          @click="submitForm"
        ></Button>
        <router-link :to="{ name: 'home' }" custom v-slot="{ navigate }">
          <Button
            class="w-full"
            label="Home"
            severity="secondary"
            role="link"
            outlined
            icon="pi pi-home"
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
  import { mapGetters } from 'vuex';
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
        newUsername: '',
        newEmail: '',
        currentPassword: '',
        newPassword: '',
      };
    },

    created() {
      this.theme = localStorage.getItem('theme') || 'Light';
      this.lang = localStorage.getItem('lang') || 'EN';
    },

    computed: { ...mapGetters(['getUsername', 'getEmail']) },

    methods: {
      changeTheme(value) {
        localStorage.setItem('theme', value);
        this.theme = value;
        const themeElement = document.getElementById('theme-link');
        if (themeElement) {
          const themeName = value === 'Light' ? 'lara-light-blue' : 'arya-blue';
          const href = `${window.location.origin}/themes/${themeName}/theme.css`;
          themeElement.setAttribute('href', href);
        }
      },
      changeLang(value) {
        localStorage.setItem('lang', value);
        this.lang = value;
      },
      saveData() {
        //TODO Тут отправка запроса на сервер для обновления данных
      },
    },
  };
</script>
