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
          <InputText v-model="newUsername" type="text" name="username" :placeholder="username" />
        </div>
        <div class="p-inputgroup mb-2">
          <span class="p-inputgroup-addon">
            <i class="pi pi-at"></i>
          </span>
          <InputText v-model="newEmail" name="email" type="email" :placeholder="email" />
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
            :placeholder="$t('PROFILE.FORM.NEW_PASSWORD')"
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
            :placeholder="$t('PROFILE.FORM.CURRENT_PASSWORD')"
            :feedback="false"
            toggleMask
          />
        </div>
      </template>
      <template #footer>
        <Button
          type="button"
          class="w-full mb-3"
          icon="pi pi-save"
          :loading="loadingSubmit"
          :label="$t('PROFILE.BUTTONS.SAVE')"
          @click="saveData"
        ></Button>
        <router-link :to="{ name: 'home' }" custom v-slot="{ navigate }">
          <Button
            class="w-full"
            severity="secondary"
            role="link"
            outlined
            icon="pi pi-home"
            :label="$t('PROFILE.BUTTONS.HOME')"
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
  // import UserService from '@/services/UserService';

  export default {
    components: { Card, Button, SelectButton, InputText, Password },

    data() {
      return {
        PathProfileSvg: ProfileSvg,
        theme: null,
        lang: null,
        langOptions: ['EN', 'RU', 'UK'],
        newUsername: '',
        newEmail: '',
        currentPassword: '',
        newPassword: '',
        loadingSubmit: false,
      };
    },

    created() {
      this.setTheme();
      this.setLang();
    },

    computed: {
      themeOptions() {
        return [this.$t('PROFILE.THEME.LIGHT'), this.$t('PROFILE.THEME.DARK')];
      },

      username() {
        return this.$store.state.user.username || this.$t('PROFILE.FORM.USERNAME');
      },

      email() {
        return this.$store.state.user.email || this.$t('PROFILE.FORM.EMAIL');
      },
    },

    methods: {
      setTheme() {
        this.theme =
          localStorage.getItem('theme') && localStorage.getItem('theme') === 'Dark'
            ? this.$t('PROFILE.THEME.DARK')
            : this.$t('PROFILE.THEME.LIGHT');
      },

      setLang() {
        this.lang = localStorage.getItem('lang').toUpperCase() || 'EN';
      },

      changeTheme(value) {
        this.theme = value;
        const themeName = value === this.$t('PROFILE.THEME.LIGHT') ? 'Light' : 'Dark';
        const themeElement = document.getElementById('theme-link');
        localStorage.setItem('theme', themeName);
        if (themeElement) {
          const href = `${window.location.origin}/themes/${themeName.toLowerCase()}.css`;
          themeElement.setAttribute('href', href);
        }
      },

      changeLang(value) {
        this.lang = value;
        const lowValue = value.toLowerCase();
        localStorage.setItem('lang', lowValue);
        this.$i18n.locale = lowValue;
        this.setTheme();
      },

      saveData() {
        //TODO Тут отправка запроса на сервер для обновления данных
      },
    },
  };
</script>
