<template>
  {{ roles }}
  <div class="card p-fluid surface-border border-x-1">
    <DataTable
      v-model:filters="filters"
      v-model:editingRows="editingRows"
      v-model:selection="selectedRoles"
      :value="roles"
      :loading="loading"
      :globalFilterFields="['name']"
      editMode="row"
      dataKey="name"
      @row-edit-save="onRowEditSave"
    >
      <template #empty> Roles not found. </template>
      <template #loading> Loading role data. Please wait. </template>
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between">
          <div class="flex align-items-center gap-2">
            <span class="text-xl text-900 font-bold">Roles</span>
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
            <InputText v-model="filters['global'].value" class="max-w-12rem" placeholder="Search" />
          </div>
        </div>
      </template>
      <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
      <Column field="name" header="Name" sortable>
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column field="adminMenu" header="AdminMenu">
        <template #editor="{ data, field }">
          <Checkbox v-model="data[field]" :binary="true" />
        </template>
      </Column>
      <Column field="createTeam" header="CreateTeam">
        <template #editor="{ data, field }">
          <Checkbox v-model="data[field]" :binary="true" />
        </template>
      </Column>
      <Column field="createRole" header="CreateRole">
        <template #editor="{ data, field }">
          <Checkbox v-model="data[field]" :binary="true" />
        </template>
      </Column>
      <Column field="roleAssignment" header="RoleAssignment">
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
      header="Create role"
      :modal="true"
      class="p-fluid w-full max-w-30rem"
    >
      <div class="field">
        <label for="name">Name</label>
        <InputText
          id="name"
          v-model.trim="role.name"
          :class="{ 'p-invalid': submitted && !role.name }"
        />
        <small class="p-error" v-if="submitted && !role.name">Name is required.</small>
      </div>
      <div class="field">
        <label class="mb-3">Permissions</label>
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
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="role">
          Are you sure you want to delete the role <b>{{ role.name }}</b
          >?
        </span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteRoleDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteRole" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteRolesDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="role">Are you sure you want to delete the selected roles?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteRolesDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteselectedRoles" />
      </template>
    </Dialog>
  </div>
</template>

<script>
  // import { mapGetters } from 'vuex';

  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import InputText from 'primevue/inputtext';
  import Checkbox from 'primevue/checkbox';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import { FilterMatchMode } from 'primevue/api';

  export default {
    components: { DataTable, Column, InputText, Checkbox, Button, Dialog },
    data() {
      return {
        editingRows: [],
        selectedRoles: null,
        submitted: false,
        roleDialog: false,
        deleteRoleDialog: false,
        deleteRolesDialog: false,
        role: {},
        loading: false,
        filters: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } },
        permissions: [],
        roles: [],
      };
    },
    async created() {
      await this.getData();
    },

    computed: {
      // ...mapGetters(['getUser']),
    },
    methods: {
      async getData() {
        this.loading = true;
        const initRoles = [
          {
            name: 'name role',
            permissions: {
              adminMenu: false,
              createRole: true,
              roleAssignment: false,
            },
          },
          {
            name: 'name role2',
            permissions: {
              adminMenu: true,
              createTeam: true,
              createRole: false,
              roleAssignment: false,
            },
          },
        ];
        //TODO Тут запрос на получение данных
        this.loading = false;
        this.permissions = ['adminMenu', 'createTeam', 'createRole', 'roleAssignment'];
        this.roles.push(...initRoles.map((role) => this.formattingRole(role, this.permissions)));
      },

      formattingRole(role, permissions) {
        const data = { name: role.name };
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

      saveRole() {
        this.submitted = true;
        if (this.role.name?.trim()) {
          const data = { name: this.role.name, permissions: [] };
          this.permissions.forEach((item) => (this.role[item] ? (data.permissions[item] = true) : null));
          //TODO Тут запрос на добавление продукта и ответ, если добавлен то закрываем модалку, если ошибка то выводим ее
          this.roles.unshift(this.formattingRole(data, this.permissions));
          this.roleDialog = false;
          this.role = {};
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
          summary: 'Successful',
          detail: 'Role removed',
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
          summary: 'Successful',
          detail: 'Roles removed',
          life: 3000,
        });
      },

      onRowEditSave(event) {
        const { newData, index } = event;
        const newDataFormat = { name: newData.name, permission: {} };

        this.roles[index] = newData;
        this.permissions.forEach((permission) =>
          newData[permission] ? (newDataFormat.permission[permission] = true) : null
        );

        //TODO Тут отправляем данные на сервер с изменениями в роли
        console.log('onRowEditSave', newDataFormat);
      },
    },
  };
</script>

