<template>
  <div class="h-full flex align-items-center justify-content-center">
    <Card class="max-w-30rem text-center">
      <template #header>
        <img class="w-11rem h-11rem pt-4 px-4 mx-auto" alt="email" :src="PathEmailSvg" />
      </template>
      <template #title><h2 class="text-4xl">Your account has not been activated!</h2></template>
      <template #subtitle><h3 class="text-2xl">Check your email.</h3></template>
      <template #content>
        <p class="text-xl">If you didn't receive your email, please click the button below to resend.</p>
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
  import UserService from '@/services/UserService';

  export default {
    components: { Card, Button },

    data() {
      return {
        PathEmailSvg: EmailSvg,
      };
    },

    methods: {
      async sendNewActivationCode() {
        try {
          await UserService.sendActivationCode();
          this.$toast.add({
            severity: 'success',
            summary: 'Check your email',
            detail: 'New activation code sent successfully',
            life: 3000,
          });
        } catch (e) {
          let messageError = 'Error, try again!';
          if (e.response?.data?.message) {
            messageError = e.response.data.message;
          }
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: messageError,
            life: 3000,
          });
        }
      },

      confirmSendEmail(event) {
        this.$confirm.require({
          target: event.currentTarget,
          message: 'Are you sure you want to send a new activation code?',
          icon: 'pi pi-exclamation-triangle',
          accept: this.sendNewActivationCode,
        });
      },
    },
  };
</script>
