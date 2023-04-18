<template>
  <div class="card p-fluid">
    <DataTable
      v-model:filters="filters"
      v-model="balanceFrozen"
      :value="users"
      :loading="loading"
      :globalFilterFields="['username']"
      :rows="10"
      scrollable
      paginator
    >
      <template #empty>{{ $t('USERS.TABLE.EMPTY') }}</template>
      <template #loading>{{ $t('USERS.TABLE.LOADING') }}</template>
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between">
          <div class="flex align-items-center gap-2">
            <span class="text-xl text-900 font-bold">{{ $t('USERS.TABLE.TITLE') }}</span>
          </div>
          <div class="p-input-icon-left w-auto">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              class="max-w-12rem"
              :placeholder="$t('USERS.TABLE.SEARCH')"
            />
          </div>
        </div>
      </template>
      <Column
        field="username"
        :header="$t('USERS.COLUMN.USERNAME')"
        sortable
        frozen
        class="z-1"
      ></Column>
      <Column field="email" :header="$t('USERS.COLUMN.EMAIL')"></Column>
      <Column field="role" :header="$t('USERS.COLUMN.ROLE')"></Column>
      <Column field="team" :header="$t('USERS.COLUMN.TEAM')"></Column>
      <Column field="view" :header="$t('USERS.COLUMN.VIEW')">
        <!-- //TODO тут должна быть кнопка со ссылкой на профиль пользователя -->
        <!-- <template #editor="{ data, field }">
          <InputText v-model="data[field]" :binary="true" />
        </template>-->
        <Button icon="pi pi-user" severity="info" rounded aria-label="User" /> 
      </Column>
    </DataTable>
  </div>
</template>

<script>
  import UserService from '@/services/UserService';
  import Button from 'primevue/button';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import InputText from 'primevue/inputtext';
  import { FilterMatchMode } from 'primevue/api';
  import { showCatchMessage } from '@/helpers/showCatch.js';

  export default {
    components: { DataTable, Column, InputText, Button },
    data() {
      return {
        submitted: false,
        balanceFrozen: false,
        loading: false,
        filters: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } },
        users: [],
      };
    },

    async created() {
      await this.getData();
    },

    methods: {
      async getData() {
        this.loading = true;
        try {
          const response = await UserService.fetchUsers();
          const users = response.data || [];
          this.users.push(...users.map((user) => this.formattingUser(user)));
        } catch (e) {
          showCatchMessage.call(this, e);
        } finally {
          this.loading = false;
        }
      },

      formattingUser(user) {
        user.role = user.role || '------';
        user.team = user.team || '------';
        user.view = user._id;
        return user;
      },
    },
  };
</script>

