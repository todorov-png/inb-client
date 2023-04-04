<template>
  <header class="fixed top-0 right-0 left-0">
    <div class="container py-3 flex align-items-center justify-content-between">
      <img
        src="@/assets/img/logo.webp"
        alt="logo"
        class="w-3rem sm:w-4rem border-circle cursor-pointer"
        @click="clickLogo"
      />
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-semibold uppercase px-4">{{ titleName }}</h1>
      <Button
        rounded
        severity="info"
        aria-label="User"
        aria-haspopup="true"
        aria-controls="user_menu"
        class="p-0 w-3rem sm:w-4rem h-3rem sm:h-4rem cursor-pointer flex align-items-center justify-content-center"
        @click="toggleUserMenu"
      >
        <i class="pi pi-user sm:text-2xl"></i>
      </Button>
      <Menu
        ref="user_menu"
        id="user_menu"
        class="p-0 mt-3 border-round-2xl overflow-hidden text-2xl"
        :model="userItems"
        :popup="true"
      ></Menu>
      <Menu ref="admin_menu" id="admin_menu" :model="adminItems" :popup="true"></Menu>
    </div>
  </header>
</template>

<script>
  import Menu from 'primevue/menu';
  import Button from 'primevue/button';
  import { mapGetters, mapActions } from 'vuex';
  // import { deleteCookie } from '@/lib/cookie.js';

  export default {
    components: { Menu, Button },
    data() {
      return {
        userItems: [
          {
            label: 'Profile',
            icon: 'pi pi-fw pi-user text-1xl sm:text-2xl',
            class: 'text-2xl sm:text-3xl white-space-nowrap',
          },
          {
            label: 'Settings',
            icon: 'pi pi-fw pi-cog text-1xl sm:text-2xl',
            class: 'text-2xl sm:text-3xl white-space-nowrap',
          },
          { separator: true },
          {
            label: 'Log Out',
            icon: 'pi pi-fw pi-sign-out text-1xl sm:text-2xl',
            class: 'text-2xl sm:text-3xl white-space-nowrap',
            command: this.logoutUser,
          },
        ],
        adminItems: [
          {
            label: 'Users',
            icon: 'pi pi-fw pi-user text-1xl sm:text-2xl',
            class: 'text-2xl sm:text-3xl white-space-nowrap',
          },
          {
            label: 'Tasks',
            icon: 'pi pi-fw pi-cog text-1xl sm:text-2xl',
            class: 'text-2xl sm:text-3xl white-space-nowrap',
          },
        ],
      };
    },
    computed: {
      ...mapGetters(['getUser']),
      titleName() {
        switch (this.$route.name) {
          case 'home':
            return 'home';
          case 'land':
            return 'landing information';
          default:
            return '404';
        }
      },
    },
    methods: {
      ...mapActions(['logout']),
      async logoutUser() {
        const response = await this.logout();
        if (response.success) {
          this.$router.push({ name: 'login' });
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: response.messageError,
            life: 3000,
          });
        }
      },
      clickLogo(event) {
        const role = this.getUser.role || 'user';
        if (role === 'admin') {
          this.$refs.admin_menu.toggle(event);
        } else {
          this.$router.push({ name: 'home' });
        }
      },
      toggleUserMenu(event) {
        this.$refs.user_menu.toggle(event);
      },
    },
  };
</script>
