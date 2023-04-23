<template>
  <div class="card p-fluid">
    <DataTable
      v-model:filters="filters"
      v-model="balanceFrozen"
      :value="users"
      :loading="loading"
      :globalFilterFields="['username', 'email', 'role.name', 'team.name']"
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
      <Column field="email" :header="$t('USERS.COLUMN.EMAIL')" sortable></Column>
      <Column field="role.name" :header="$t('USERS.COLUMN.ROLE')" sortable></Column>
      <Column field="team.name" :header="$t('USERS.COLUMN.TEAM')" sortable></Column>
      <Column>
        <template #body="slotProps">
          <div class="flex align-items-center justify-content-end gap-2">
            <Button
              icon="pi pi-pencil"
              severity="info"
              rounded
              @click="openChangeModal(slotProps)"
            />
            <Button
              icon="pi pi-trash"
              rounded
              raised
              severity="danger"
              @click="openDeleteModal(slotProps)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="changeDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('USERS.CHANGE_USER.HEADER')"
      :modal="true"
    >
      <div class="field">
        <label for="username">{{ $t('USERS.CHANGE_USER.USERNAME') }}</label>
        <InputText id="username" :placeholder="selectedUser.username" disabled />
      </div>
      <div class="field">
        <label for="email">{{ $t('USERS.CHANGE_USER.EMAIL') }}</label>
        <InputText id="email" :placeholder="selectedUser.email" disabled />
      </div>
      <div class="field">
        <label for="role">{{ $t('USERS.CHANGE_USER.ROLE.LABEL') }}</label>
        <Dropdown
          id="role"
          v-model="selectedRole"
          :options="roles"
          :placeholder="$t('USERS.CHANGE_USER.ROLE.DROPDOWN')"
          optionLabel="name"
          class="w-full"
          filter
        >
        </Dropdown>
      </div>
      <div class="field">
        <label for="team">{{ $t('USERS.CHANGE_USER.TEAM.LABEL') }}</label>
        <Dropdown
          id="team"
          v-model="selectedTeam"
          :options="teams"
          :placeholder="$t('USERS.CHANGE_USER.TEAM.DROPDOWN')"
          optionLabel="name"
          class="w-full"
          filter
        >
        </Dropdown>
      </div>
      <template #footer>
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.CANCEL')"
          icon="pi pi-times"
          text
          @click="hideChangeModal"
        />
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.UPDATE')"
          icon="pi pi-check"
          text
          @click="updateUser"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('USERS.DELETE_USER.HEADER')"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span
          v-if="selectedUser"
          v-html="$t('USERS.DELETE_USER.USER', { name: selectedUser.username })"
        ></span>
      </div>
      <template #footer>
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.NO')"
          icon="pi pi-times"
          text
          @click="deleteDialog = false"
        />
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.YES')"
          icon="pi pi-check"
          text
          @click="deleteUser"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
  import UserService from '@/services/UserService';
  import RoleService from '@/services/RoleService';
  import TeamService from '@/services/TeamService';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import InputText from 'primevue/inputtext';
  import Dropdown from 'primevue/dropdown';
  import { FilterMatchMode } from 'primevue/api';
  import { showCatchMessage } from '@/helpers/showCatch.js';

  export default {
    components: { DataTable, Column, InputText, Button, Dialog, Dropdown },
    data() {
      return {
        balanceFrozen: false,
        loading: false,
        filters: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } },
        users: [],
        changeDialog: false,
        deleteDialog: false,
        selectedUser: null,
        selectedRole: null,
        selectedTeam: null,
        selectedUserIndex: null,
        roles: [{ name: '------', _id: null }],
        teams: [{ name: '------', _id: null }],
      };
    },

    async created() {
      await this.getData();
    },

    methods: {
      async getData() {
        this.loading = true;
        try {
          const responseRoles = await RoleService.fetchRolesList();
          const roles = responseRoles.data || [];
          this.roles.push(...roles);

          const responseTeams = await TeamService.fetchTeamsList();
          const teams = responseTeams.data || [];
          this.teams.push(...teams);

          const responseUsers = await UserService.fetchUsers();
          const users = responseUsers.data || [];
          this.users.push(...users.map((user) => this.formattingUser(user)));
        } catch (e) {
          showCatchMessage.call(this, e);
        } finally {
          this.loading = false;
        }
      },

      formattingUser(user) {
        user.role ? null : user.role = { name: '------', _id: null };
        user.team ? null : user.team = { name: '------', _id: null };
        return user;
      },

      openChangeModal(event) {
        this.changeDialog = true;
        this.selectedUser = event.data;
        this.selectedUserIndex = event.index;
        this.selectedRole = event.data.role;
        this.selectedTeam = event.data.team;
      },

      hideChangeModal() {
        this.changeDialog = false;
      },

      async updateUser() {
        const data = {
          userId: this.selectedUser._id,
          roleId: this.selectedRole._id,
          teamId: this.selectedTeam._id,
        };
        try {
          const response = await UserService.editUser(data);
          this.$toast.add({
            severity: 'success',
            summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
            detail: this.$t('USERS.CHANGE_USER.SUCCESSFUL'),
            life: 3000,
          });
          this.users[this.selectedUserIndex] = response.data;
          this.hideChangeModal();
        } catch (e) {
          showCatchMessage.call(this, e);
        }
      },

      openDeleteModal(event) {
        this.selectedUser = event.data;
        this.selectedUserIndex = event.index;
        this.deleteDialog = true;
      },

      hideDeleteModal() {
        this.deleteDialog = false;
      },

      async deleteUser() {
        try {
          await UserService.deleteUser({ user: this.selectedUser._id });
          this.$toast.add({
            severity: 'success',
            summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
            detail: this.$t('USERS.DELETE_USER.SUCCESSFUL'),
            life: 3000,
          });
          this.users.splice(this.selectedUserIndex, 1);
          this.hideDeleteModal();
        } catch (e) {
          showCatchMessage.call(this, e);
        }
      },
    },
  };
</script>

