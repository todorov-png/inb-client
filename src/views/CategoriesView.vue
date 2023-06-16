<template>
  <div class="card p-fluid">
    <DataTable
      v-model:filters="filters"
      :value="categories"
      :loading="loading"
      :globalFilterFields="['name']"
      :rows="10"
      scrollable
      paginator
    >
      <template #empty>{{ $t('CATEGORIES.TABLE.EMPTY') }}</template>
      <template #loading>{{ $t('CATEGORIES.TABLE.LOADING') }}</template>
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between">
          <div class="flex align-items-center gap-2">
            <span class="text-xl text-900 font-bold">{{ $t('CATEGORIES.TABLE.TITLE') }}</span>
            <Button
              v-if="userPermissions.createCategory"
              icon="pi pi-plus"
              rounded
              raised
              @click="openCreateModal"
            />
          </div>
          <div class="p-input-icon-left w-auto">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              class="max-w-12rem"
              :placeholder="$t('CATEGORIES.TABLE.SEARCH')"
            />
          </div>
        </div>
      </template>
      <Column field="name" :header="$t('CATEGORIES.COLUMN.NAME')" sortable />
      <Column>
        <template #body="slotProps">
          <div class="flex align-items-center justify-content-end gap-2">
            <Button
              v-if="userPermissions.createCategory"
              icon="pi pi-pencil"
              severity="info"
              rounded
              @click="openChangeModal(slotProps)"
            />
            <Button
              v-if="userPermissions.deleteCategory"
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
      v-model:visible="createDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('CATEGORIES.CREATE_CATEGORY.HEADER')"
      :modal="true"
    >
      <div class="field">
        <label for="create_name">{{
          $t('CATEGORIES.CREATE_CATEGORY.NAME')
        }}</label>
        <InputText
          id="create_name"
          v-model.trim="newCategory.name"
          :class="{ 'p-invalid': submitted && !newCategory.name }"
        />
        <small class="p-error" v-if="submitted && !newCategory.name">
          {{ $t('CATEGORIES.CREATE_CATEGORY.EMPTY_NAME') }}
        </small>
      </div>
      <template #footer>
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.CANCEL')"
          icon="pi pi-times"
          text
          @click="hideCreateModal"
        />
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.CREATE')"
          icon="pi pi-check"
          text
          @click="createCategory"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="changeDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('CATEGORIES.CHANGE_CATEGORY.HEADER')"
      :modal="true"
    >
      <div class="field">
        <label for="change_name">{{
          $t('CATEGORIES.CHANGE_CATEGORY.NAME')
        }}</label>
        <InputText
          id="change_name"
          v-model.trim="selectCategory.name"
          :class="{ 'p-invalid': submitted && !selectCategory.name }"
        />
        <small class="p-error" v-if="submitted && !selectCategory.name">
          {{ $t('CATEGORIES.CHANGE_CATEGORY.EMPTY_NAME') }}
        </small>
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
          @click="changeCategory"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('CATEGORIES.DELETE_CATEGORY.HEADER')"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span
          v-if="selectCategory"
          v-html="$t('CATEGORIES.DELETE_CATEGORY.CATEGORY', { name: selectCategory.name })"
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
          @click="deleteCategory"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
  import CategoryService from '@/services/CategoryService';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import InputText from 'primevue/inputtext';
  import { FilterMatchMode } from 'primevue/api';
  import { showCatchMessage } from '@/helpers/showCatch.js';

  export default {
    components: { DataTable, Column, InputText, Button, Dialog },
    data() {
      return {
        submitted: false,
        createDialog: false,
        changeDialog: false,
        deleteDialog: false,
        loading: false,
        filters: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } },
        selectCategoryIndex: null,
        selectCategory: {},
        newCategory: {},
        categories: [],
      };
    },

    async created() {
      await this.getData();
    },

    computed: {
      userPermissions() {
        return this.$store.state.user.permissions || {};
      },
    },

    methods: {
      async getData() {
        this.loading = true;
        try {
          const response = await CategoryService.getAll();
          this.categories = response.data || [];
        } catch (e) {
          showCatchMessage.call(this, e);
        } finally {
          this.loading = false;
        }
      },

      openCreateModal() {
        this.submitted = false;
        this.newCategory = {};
        this.createDialog = true;
      },

      hideCreateModal() {
        this.createDialog = false;
      },

      async createCategory() {
        if (this.newCategory.name?.trim()) {
          try {
            const response = await CategoryService.create(this.newCategory);
            this.$toast.add({
              severity: 'success',
              summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
              detail: this.$t('CATEGORIES.CREATE_CATEGORY.SUCCESSFUL'),
              life: 3000,
            });
            this.newCategory._id = response.data._id;
            this.newCategory.name = this.newCategory.name.toLowerCase();
            this.categories.unshift(this.newCategory);
            this.hideCreateModal();
          } catch (e) {
            showCatchMessage.call(this, e);
          }
        } else {
          this.submitted = true;
        }
      },

      openChangeModal(event) {
        const data = JSON.parse(JSON.stringify(event.data));
        this.submitted = false;
        this.selectCategory = data;
        this.selectCategoryIndex = event.index;
        this.changeDialog = true;
      },

      hideChangeModal() {
        this.changeDialog = false;
      },

      async changeCategory() {
        if (this.selectCategory.name?.trim()) {
          try {
            await CategoryService.update(this.selectCategory);
            this.$toast.add({
              severity: 'success',
              summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
              detail: this.$t('CATEGORIES.CHANGE_CATEGORY.SUCCESSFUL'),
              life: 3000,
            });
            const data = this.selectCategory;
            this.selectCategory.name = this.selectCategory.name.toLowerCase();
            this.categories[this.selectCategoryIndex] = data;
            this.hideChangeModal();
          } catch (e) {
            showCatchMessage.call(this, e);
          }
        } else {
          this.submitted = true;
        }
      },

      openDeleteModal(event) {
        this.selectCategory = event.data;
        this.selectCategoryIndex = event.index;
        this.deleteDialog = true;
      },

      hideDeleteModal() {
        this.deleteDialog = false;
      },

      async deleteCategory() {
        try {
          await CategoryService.delete({ category: this.selectCategory._id });
          this.$toast.add({
            severity: 'success',
            summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
            detail: this.$t('CATEGORIES.DELETE_CATEGORY.SUCCESSFUL'),
            life: 3000,
          });
          this.categories.splice(this.selectCategoryIndex, 1);
          this.hideDeleteModal();
        } catch (e) {
          showCatchMessage.call(this, e);
        }
      },
    },
  };
</script>

