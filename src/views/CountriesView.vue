<template>
  <div class="card p-fluid">
    <DataTable
      v-model:filters="filters"
      :value="countries"
      :loading="loading"
      :globalFilterFields="['name', 'currency', 'lang']"
      :rows="10"
      scrollable
      paginator
    >
      <template #empty>{{ $t('COUNTRIES.TABLE.EMPTY') }}</template>
      <template #loading>{{ $t('COUNTRIES.TABLE.LOADING') }}</template>
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between">
          <div class="flex align-items-center gap-2">
            <span class="text-xl text-900 font-bold">{{ $t('COUNTRIES.TABLE.TITLE') }}</span>
            <Button
              v-if="userPermissions.createCountry"
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
              :placeholder="$t('COUNTRIES.TABLE.SEARCH')"
            />
          </div>
        </div>
      </template>
      <Column field="name" :header="$t('COUNTRIES.COLUMN.NAME')" sortable />
      <Column field="currency" :header="$t('COUNTRIES.COLUMN.CURRENCY')" sortable />
      <Column field="lang" :header="$t('COUNTRIES.COLUMN.LANG')" sortable />
      <Column field="callCenterSchedule" :header="$t('COUNTRIES.COLUMN.CALL_CENTER')" />
      <Column>
        <template #body="slotProps">
          <div class="flex align-items-center justify-content-end gap-2">
            <Button
              v-if="userPermissions.createCountry"
              icon="pi pi-pencil"
              severity="info"
              rounded
              @click="openChangeModal(slotProps)"
            />
            <Button
              v-if="userPermissions.deleteCountry"
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
      :header="$t('COUNTRIES.CREATE_COUNTRY.HEADER')"
      :modal="true"
    >
      <div class="field">
        <label for="create_name">{{ $t('COUNTRIES.CREATE_COUNTRY.NAME') }}</label>
        <InputText
          id="create_name"
          v-model.trim="newCountry.name"
          :class="{ 'p-invalid': submitted && !newCountry.name }"
        />
        <small class="p-error" v-if="submitted && !newCountry.name">
          {{ $t('COUNTRIES.CREATE_COUNTRY.EMPTY_NAME') }}
        </small>
      </div>
      <div class="field">
        <label for="create_currency">{{ $t('COUNTRIES.CREATE_COUNTRY.CURRENCY') }}</label>
        <InputText
          id="create_currency"
          v-model.trim="newCountry.currency"
          :class="{ 'p-invalid': submitted && !newCountry.currency }"
        />
        <small class="p-error" v-if="submitted && !newCountry.currency">
          {{ $t('COUNTRIES.CREATE_COUNTRY.EMPTY_CURRENCY') }}
        </small>
      </div>
      <div class="field">
        <label for="create_lang">{{ $t('COUNTRIES.CREATE_COUNTRY.LANG') }}</label>
        <InputText
          id="create_lang"
          v-model.trim="newCountry.lang"
          :class="{ 'p-invalid': submitted && !newCountry.lang }"
        />
        <small class="p-error" v-if="submitted && !newCountry.lang">
          {{ $t('COUNTRIES.CREATE_COUNTRY.EMPTY_LANG') }}
        </small>
      </div>
      <div class="field">
        <label for="create_call_center">{{ $t('COUNTRIES.CREATE_COUNTRY.CALL_CENTER') }}</label>
        <InputText id="create_call_center" v-model.trim="newCountry.callCenterSchedule" />
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
          @click="createCountry"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="changeDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('COUNTRIES.CHANGE_COUNTRY.HEADER')"
      :modal="true"
    >
      <div class="field">
        <label for="change_name">{{ $t('COUNTRIES.CHANGE_COUNTRY.NAME') }}</label>
        <InputText
          id="change_name"
          v-model.trim="selectCountry.name"
          :class="{ 'p-invalid': submitted && !selectCountry.name }"
        />
        <small class="p-error" v-if="submitted && !selectCountry.name">
          {{ $t('COUNTRIES.CHANGE_COUNTRY.EMPTY_NAME') }}
        </small>
      </div>
      <div class="field">
        <label for="change_currency">{{ $t('COUNTRIES.CHANGE_COUNTRY.CURRENCY') }}</label>
        <InputText
          id="change_currency"
          v-model.trim="selectCountry.currency"
          :class="{ 'p-invalid': submitted && !selectCountry.currency }"
        />
        <small class="p-error" v-if="submitted && !selectCountry.currency">
          {{ $t('COUNTRIES.CHANGE_COUNTRY.EMPTY_CURRENCY') }}
        </small>
      </div>
      <div class="field">
        <label for="change_lang">{{ $t('COUNTRIES.CHANGE_COUNTRY.LANG') }}</label>
        <InputText
          id="change_lang"
          v-model.trim="selectCountry.lang"
          :class="{ 'p-invalid': submitted && !selectCountry.lang }"
        />
        <small class="p-error" v-if="submitted && !selectCountry.lang">
          {{ $t('COUNTRIES.CHANGE_COUNTRY.EMPTY_LANG') }}
        </small>
      </div>
      <div class="field">
        <label for="change_call_center">{{ $t('COUNTRIES.CHANGE_COUNTRY.CALL_CENTER') }}</label>
        <InputText id="change_call_center" v-model.trim="selectCountry.callCenterSchedule" />
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
          @click="changeCountry"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('COUNTRIES.DELETE_COUNTRY.HEADER')"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span
          v-if="selectCountry"
          v-html="$t('COUNTRIES.DELETE_COUNTRY.COUNTRY', { name: selectCountry.name })"
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
          @click="deleteCountry"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
  import CountryService from '@/services/CountryService';
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
        selectCountryIndex: null,
        selectCountry: {},
        newCountry: {},
        countries: [],
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
          const response = await CountryService.getAll();
          this.countries = response.data || [];
        } catch (e) {
          showCatchMessage.call(this, e);
        } finally {
          this.loading = false;
        }
      },

      openCreateModal() {
        this.submitted = false;
        this.newCountry = {};
        this.createDialog = true;
      },

      hideCreateModal() {
        this.createDialog = false;
      },

      async createCountry() {
        if (
          this.newCountry.name?.trim() &&
          this.newCountry.currency?.trim() &&
          this.newCountry.lang?.trim()
        ) {
          try {
            const response = await CountryService.create(this.newCountry);
            this.$toast.add({
              severity: 'success',
              summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
              detail: this.$t('COUNTRIES.CREATE_COUNTRY.SUCCESSFUL'),
              life: 3000,
            });
            this.newCountry._id = response.data._id;
            this.newCountry.name = this.newCountry.name.toLowerCase();
            this.countries.unshift(this.newCountry);
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
        this.selectCountry = data;
        this.selectCountryIndex = event.index;
        this.changeDialog = true;
      },

      hideChangeModal() {
        this.changeDialog = false;
      },

      async changeCountry() {
        if (
          this.selectCountry.name?.trim() &&
          this.selectCountry.currency?.trim() &&
          this.selectCountry.lang?.trim()
        ) {
          try {
            await CountryService.update(this.selectCountry);
            this.$toast.add({
              severity: 'success',
              summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
              detail: this.$t('COUNTRIES.CHANGE_COUNTRY.SUCCESSFUL'),
              life: 3000,
            });
            const data = this.selectCountry;
            this.selectCountry.name = this.selectCountry.name.toLowerCase();
            this.countries[this.selectCountryIndex] = data;
            this.hideChangeModal();
          } catch (e) {
            showCatchMessage.call(this, e);
          }
        } else {
          this.submitted = true;
        }
      },

      openDeleteModal(event) {
        this.selectCountry = event.data;
        this.selectCountryIndex = event.index;
        this.deleteDialog = true;
      },

      hideDeleteModal() {
        this.deleteDialog = false;
      },

      async deleteCountry() {
        try {
          await CountryService.delete({ country: this.selectCountry._id });
          this.$toast.add({
            severity: 'success',
            summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
            detail: this.$t('COUNTRIES.DELETE_COUNTRY.SUCCESSFUL'),
            life: 3000,
          });
          this.countries.splice(this.selectCountryIndex, 1);
          this.hideDeleteModal();
        } catch (e) {
          showCatchMessage.call(this, e);
        }
      },
    },
  };
</script>

