<template>
  <div class="h-full flex align-items-center justify-content-center">
    <Card class="max-w-30rem text-center">
      <template #header>
        <img class="w-11rem h-11rem pt-4 px-4 mx-auto" alt="email" :src="PathEmailSvg" />
      </template>
      <template #title>Your account has not been activated!</template>
      <template #subtitle>Check your email.</template>
      <template #content>
        If you didn't receive your email, please click the button below to resend.
      </template>
      <template #footer>
        <Button
          @click="confirmSendEmail($event)"
          icon="pi pi-send"
          label="Submit a new activation code"
        ></Button>
      </template>
    </Card>
  </div>
</template>

<script>
  import Card from 'primevue/card';
  import Button from 'primevue/button';
  import EmailSvg from '@/assets/img/svg/email.svg';
  import AuthService from '@/services/AuthService';

  export default {
    components: { Card, Button },
    data() {
      return {
        PathEmailSvg: EmailSvg,
      };
    },
    methods: {
      async sendNewActivationCode() {
        console.log(111, await AuthService.sendActivationCode());
      },
      confirmSendEmail(event) {
        this.$confirm.require({
          target: event.currentTarget,
          message: 'Are you sure you want to send a new activation code?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {



            this.$toast.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: 'You have accepted',
              life: 3000,
            });
          },
        });
      },
    },
  };
</script>

<style lang="scss"></style>
