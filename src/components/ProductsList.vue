<template>
  <DataTable
    v-model:filters="filters"
    :value="products"
    :loading="loading"
    :globalFilterFields="['name', 'country', 'category']"
    scrollable
  >
    <template #empty>{{ $t('PRODUCTS.TABLE.EMPTY') }}</template>
    <template #loading>{{ $t('PRODUCTS.TABLE.LOADING') }}</template>
    <template #header>
      <div class="flex flex-wrap align-items-center justify-content-between">
        <div class="flex align-items-center gap-2">
          <span class="text-xl text-900 font-bold">{{ $t('PRODUCTS.TABLE.TITLE') }}</span>
        </div>
        <div class="p-input-icon-left w-auto">
          <i class="pi pi-search" />
          <InputText
            v-model="filters['global'].value"
            class="max-w-12rem"
            :placeholder="$t('PRODUCTS.TABLE.SEARCH')"
          />
        </div>
      </div>
    </template>
    <Column :header="$t('PRODUCTS.COLUMN.PHOTO')">
      <template #body="slotProps">
        <img :src="slotProps.data.photo" :alt="slotProps.data.name" class="w-6rem border-round" />
      </template>
    </Column>
    <Column field="name" :header="$t('PRODUCTS.COLUMN.NAME')" sortable></Column>
    <Column field="price" :header="$t('PRODUCTS.COLUMN.PRICE')"></Column>
    <Column field="country" :header="$t('PRODUCTS.COLUMN.COUNTRY')" sortable></Column>
    <Column field="category" :header="$t('PRODUCTS.COLUMN.CATEGORY')" sortable></Column>
    <Column>
      <template #body="slotProps">
        <router-link
          :to="{ name: 'product', params: { id: slotProps.data._id } }"
          custom
          v-slot="{ navigate }"
        >
          <Button icon="pi pi-eye" severity="info" rounded @click="navigate" />
        </router-link>
      </template>
    </Column>
  </DataTable>
</template>

<script>
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import { FilterMatchMode } from 'primevue/api';
  import { mapActions } from 'vuex';

  export default {
    components: {
      DataTable,
      Column,
      InputText,
      Button,
    },
    data() {
      return {
        loading: false,
        filters: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } },
      };
    },

    async created() {
      await this.getData();
    },

    computed: {
      products() {
        return this.$store.state.products;
      },
    },

    methods: {
      ...mapActions(['getProducts']),

      async getData() {
        this.loading = true;
        const response = await this.getProducts();
        if (!response.success) {
          this.$toast.add({
            severity: 'error',
            summary: this.$t('TOAST.SUMMARY.ERROR'),
            detail: response.messageError,
            life: 3000,
          });
        }
        this.loading = false;
      },
    },
  };
</script>
