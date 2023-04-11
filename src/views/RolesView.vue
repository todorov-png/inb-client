<template>
  {{ roles }}
  <div class="card p-fluid">
    <DataTable
      v-model:filters="filters"
      v-model:editingRows="editingRows"
      v-model:selection="selectedProduct"
      :value="roles"
      :loading="loading"
      :globalFilterFields="['name']"
      editMode="row"
      dataKey="name"
      @row-edit-save="onRowEditSave"
      tableClass="editable-cells-table"
      tableStyle="min-width: 50rem"
    >
      <template #empty> Roles not found. </template>
      <template #loading> Loading role data. Please wait. </template>
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">Roles</span>
          <Button icon="pi pi-plus" rounded raised />
          <Button icon="pi pi-trash" rounded raised severity="danger" />
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </span>
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
  </div>
</template>

<script>
  // import NotActivated from '@/components/NotActivated.vue';
  // import NotTeam from '@/components/NotTeam.vue';
  // import { mapGetters } from 'vuex';

  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import InputText from 'primevue/inputtext';
  import Checkbox from 'primevue/checkbox';
  import Button from 'primevue/button';
  import { FilterMatchMode } from 'primevue/api';

  export default {
    components: { DataTable, Column, InputText, Checkbox, Button },
    data() {
      return {
        editingRows: [],
        selectedProduct: null,
        metaKey: true,
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

        initRoles.forEach((role) => {
          const data = { name: role.name };
          this.permissions.forEach(
            (permission) => (data[permission] = role.permissions[permission] || false)
          );
          this.roles.push(data);
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

