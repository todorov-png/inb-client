<template>
  <div class="h-full flex align-items-center justify-content-center">
    <Card class="max-w-30rem text-center">
      <template #header>
        <img class="w-11rem h-11rem pt-4 px-4 mx-auto" alt="team" :src="PathTeamSvg" />
      </template>
      <template #title><h2 class="text-4xl">No team is assigned to you!</h2></template>
      <template #content>
        <p class="text-xl">
          To join a team, write to the administrator your team name and current username. After
          joining, you will have access to materials for active products
        </p>
      </template>
      <template #footer>
        <Button
          icon="pi pi-send"
          label="Contact administrator"
          outlined
          @click="openTgAdmin"
        ></Button>
      </template>
    </Card>
  </div>
</template>

<script>
  import Card from 'primevue/card';
  import Button from 'primevue/button';
  import TeamSvg from '@/assets/img/svg/team.svg';

  export default {
    components: { Card, Button },

    data() {
      return {
        PathTeamSvg: TeamSvg,
      };
    },

    methods: {
      openTgAdmin() {
        window.location.href = process.env.VUE_APP_ADMIN_TG;
      },
    },
  };
</script>
