<template>
  <div class="card p-fluid surface-border border-x-1">
    <DataTable
      v-model:filters="filters"
      v-model:editingRows="editingRows"
      v-model:selection="selectedRoles"
      v-model="balanceFrozen"
      :value="roles"
      :loading="loading"
      :globalFilterFields="['name']"
      editMode="row"
      dataKey="name"
      scrollable
      @row-edit-save="onRowEditSave"
    >
      <template #empty>{{ $t('ROLES.TABLE.EMPTY') }}</template>
      <template #loading>{{ $t('ROLES.TABLE.LOADING') }}</template>
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between">
          <div class="flex align-items-center gap-2">
            <span class="text-xl text-900 font-bold">{{ $t('ROLES.TABLE.TITLE') }}</span>
            <Button icon="pi pi-plus" rounded raised @click="openNewRole" />
            <Button
              icon="pi pi-trash"
              rounded
              raised
              severity="danger"
              @click="confirmDeleteSelected"
              :disabled="!selectedRoles || !selectedRoles.length"
            />
          </div>
          <div class="p-input-icon-left w-auto">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              class="max-w-12rem"
              :placeholder="$t('ROLES.TABLE.SEARCH')"
            />
          </div>
        </div>
      </template>
      <Column selectionMode="multiple" frozen style="width: 3rem" :exportable="false"></Column>
      <Column field="name" :header="$t('ROLES.PERMISSIONS.NAME')" sortable frozen>
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column field="createTeam" :header="$t('ROLES.PERMISSIONS.CREATE_TEAM')">
        <template #editor="{ data, field }">
          <Checkbox v-model="data[field]" :binary="true" />
        </template>
      </Column>
      <Column field="assignTeam" :header="$t('ROLES.PERMISSIONS.ASSIGN_TEAM')">
        <template #editor="{ data, field }">
          <Checkbox v-model="data[field]" :binary="true" />
        </template>
      </Column>
      <Column field="createRole" :header="$t('ROLES.PERMISSIONS.CREATE_ROLE')">
        <template #editor="{ data, field }">
          <Checkbox v-model="data[field]" :binary="true" />
        </template>
      </Column>
      <Column field="assignRole" :header="$t('ROLES.PERMISSIONS.ASSIGN_ROLE')">
        <template #editor="{ data, field }">
          <Checkbox v-model="data[field]" :binary="true" />
        </template>
      </Column>
      <Column
        :rowEditor="true"
        style="width: 10%; min-width: 8rem"
        headerStyle="justify-content: center;"
        bodyStyle="text-align: center;"
      ></Column>
    </DataTable>

    <Dialog
      v-model:visible="roleDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('ROLES.CREATE_ROLE.HEADER')"
      :modal="true"
    >
      <div class="field">
        <label for="name">{{ $t('ROLES.CREATE_ROLE.NAME') }}</label>
        <InputText
          id="name"
          v-model.trim="role.name"
          :class="{ 'p-invalid': submitted && !role.name }"
        />
        <small class="p-error" v-if="submitted && !role.name">
          {{ $t('ROLES.CREATE_ROLE.EMPTY_NAME') }}
        </small>
      </div>
      <div class="field">
        <label class="mb-3">{{ $t('ROLES.CREATE_ROLE.PERMISSIONS') }}</label>
        <div class="formgrid grid">
          <div v-for="(item, index) in permissions" :key="index" class="field-checkbox col-6">
            <Checkbox :inputId="item" v-model="role[item]" :binary="true" />
            <label :for="item">{{ item }}</label>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" text @click="saveRole" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteRoleDialog"
      :style="{ width: '450px' }"
      :header="$t('ROLES.DELETE_ROLE.HEADER')"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="role" v-html="$t('ROLES.DELETE_ROLE.ROLE', { name: role.name })"></span>
      </div>
      <template #footer>
        <Button
          icon="pi pi-times"
          text
          :label="$t('ROLES.DELETE_ROLE.NO')"
          @click="deleteRoleDialog = false"
        />
        <Button :label="$t('ROLES.DELETE_ROLE.YES')" icon="pi pi-check" text @click="deleteRole" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteRolesDialog"
      :style="{ width: '450px' }"
      :header="$t('ROLES.DELETE_ROLE.HEADER')"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="role">{{ $t('ROLES.DELETE_ROLE.ROLES') }}</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteRolesDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteselectedRoles" />
      </template>
    </Dialog>
  </div>
</template>

<script>
  import RoleService from '@/services/RoleService';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import InputText from 'primevue/inputtext';
  import Checkbox from 'primevue/checkbox';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import { FilterMatchMode } from 'primevue/api';
  import { showCatchMessage } from '@/helpers/showCatch.js';

  export default {
    components: { DataTable, Column, InputText, Checkbox, Button, Dialog },
    data() {
      return {
        editingRows: [],
        selectedRoles: null,
        submitted: false,
        balanceFrozen: false,
        roleDialog: false,
        deleteRoleDialog: false,
        deleteRolesDialog: false,
        role: {},
        loading: false,
        filters: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } },
        permissions: ['createTeam', 'assignTeam', 'createRole', 'assignRole'],
        roles: [],
      };
    },

    async created() {
      await this.getData();
    },

    methods: {
      async getData() {
        this.loading = true;
        try {
          const response = await RoleService.fetchRoles();
          const roles = response.data || [];
          this.roles.push(...roles.map((role) => this.formattingRole(role, this.permissions)));
        } catch (e) {
          showCatchMessage.call(this, e);
        } finally {
          this.loading = false;
        }
      },

      formattingRole(role, permissions) {
        const data = { _id: role._id, name: role.name };
        permissions.forEach(
          (permission) => (data[permission] = role.permissions[permission] || false)
        );
        return data;
      },

      openNewRole() {
        this.role = {};
        this.submitted = false;
        this.roleDialog = true;
      },

      hideDialog() {
        this.roleDialog = false;
      },

      async saveRole() {
        this.submitted = true;
        if (this.role.name?.trim()) {
          const data = { name: this.role.name, permissions: {} };
          this.permissions.forEach((item) =>
            this.role[item] ? (data.permissions[item] = true) : null
          );
          try {
            const response = await RoleService.createRole(data);
            this.$toast.add({
              severity: 'success',
              summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
              detail: this.$t('ROLES.CREATE_ROLE.SUCCESSFUL'),
              life: 3000,
            });
            data._id = response.data._id;
            this.roles.unshift(this.formattingRole(data, this.permissions));
            this.roleDialog = false;
            this.role = {};
          } catch (e) {
            showCatchMessage.call(this, e);
          }
        }
      },

      confirmDeleteSelected() {
        this.selectedRoles.length === 1
          ? (this.deleteRoleDialog = true)
          : (this.deleteRolesDialog = true);
      },

      deleteRole() {
        this.roles = this.roles.filter((val) => val.id !== this.role.id);
        this.deleteRoleDialog = false;
        this.role = {};
        //TODO Запрос на удаление одной роли
        this.$toast.add({
          severity: 'success',
          summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
          detail: this.$t('ROLES.DELETE_ROLE.ONE'),
          life: 3000,
        });
      },

      deleteselectedRoles() {
        this.roles = this.roles.filter((val) => !this.selectedRoles.includes(val));
        this.deleteRolesDialog = false;
        this.selectedRoles = null;
        //TODO Запрос на удаление нескольких ролей
        this.$toast.add({
          severity: 'success',
          summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
          detail: this.$t('ROLES.DELETE_ROLE.MANU'),
          life: 3000,
        });
      },

      async onRowEditSave(event) {
        const { newData, index } = event;
        const newDataFormat = { _id: newData._id, name: newData.name, permissions: {} };

        this.permissions.forEach((permission) =>
          newData[permission] ? (newDataFormat.permissions[permission] = true) : null
        );
        try {
          await RoleService.updateRole(newDataFormat);
          this.$toast.add({
            severity: 'success',
            summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
            detail: this.$t('ROLES.UPDATE_ROLE.SUCCESSFUL'),
            life: 3000,
          });
          this.roles[index] = newData;
        } catch (e) {
          showCatchMessage.call(this, e);
        }
      },
    },
  };
</script>

