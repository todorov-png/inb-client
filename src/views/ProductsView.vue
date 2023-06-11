<template>
  <div class="card p-fluid">
    <DataTable
      v-model:filters="filters"
      v-model="balanceFrozen"
      :value="products"
      :loading="loading"
      :globalFilterFields="[
        'nameCRM',
        'nameSoftware',
        'price',
        'country.nameSoftware',
        'category.nameRU',
      ]"
      :rows="10"
      scrollable
      paginator
    >
      <template #empty>{{ $t('PRODUCTS.TABLE.EMPTY') }}</template>
      <template #loading>{{ $t('PRODUCTS.TABLE.LOADING') }}</template>
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between">
          <div class="flex align-items-center gap-2">
            <span class="text-xl text-900 font-bold">{{ $t('PRODUCTS.TABLE.TITLE') }}</span>
            <Button
              v-if="userPermissions.createProduct"
              icon="pi pi-plus"
              rounded
              raised
              @click="openNewProduct"
            />
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
      <Column field="nameCRM" :header="$t('PRODUCTS.COLUMN.NAME_CRM')" sortable />
      <Column field="nameSoftware" :header="$t('PRODUCTS.COLUMN.NAME_SOFTWARE')" sortable />
      <Column field="price" :header="$t('PRODUCTS.COLUMN.PRICE')" sortable />
      <Column field="country.nameSoftware" :header="$t('PRODUCTS.COLUMN.COUNTRY')" sortable />
      <Column field="category.nameRU" :header="$t('PRODUCTS.COLUMN.CATEGORY')" sortable />
      <Column field="ageGroup" :header="$t('PRODUCTS.COLUMN.AGE_GROUP')" />
      <Column>
        <template #body="slotProps">
          <div class="flex align-items-center justify-content-end gap-2">
            <Button
              v-if="userPermissions.assignCountry || userPermissions.assignCategory"
              icon="pi pi-pencil"
              severity="info"
              rounded
              @click="openChangeModal(slotProps)"
            />
            <Button
              v-if="userPermissions.deleteProduct"
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
      :header="$t('PRODUCTS.CREATE_PRODUCT.HEADER')"
      :modal="true"
    >
      <div class="field">
        <label for="create_name_crm">{{ $t('PRODUCTS.CREATE_PRODUCT.NAME_CRM') }}</label>
        <InputText
          id="create_name_crm"
          v-model.trim="product.nameCRM"
          :class="{ 'p-invalid': submitted && !product.nameCRM }"
        />
        <small class="p-error" v-if="submitted && !product.nameCRM">
          {{ $t('PRODUCTS.CREATE_PRODUCT.EMPTY_NAME') }}
        </small>
      </div>
      <div class="field">
        <label for="create_name_software">{{ $t('PRODUCTS.CREATE_PRODUCT.NAME_SOFTWARE') }}</label>
        <InputText
          id="create_name_software"
          v-model.trim="product.nameSoftware"
          :class="{ 'p-invalid': submitted && !product.nameSoftware }"
        />
        <small class="p-error" v-if="submitted && !product.nameSoftware">
          {{ $t('PRODUCTS.CREATE_PRODUCT.EMPTY_NAME') }}
        </small>
      </div>
      <div class="field">
        <label for="create_price">{{ $t('PRODUCTS.CREATE_PRODUCT.PRICE') }}</label>
        <InputNumber
          id="create_price"
          v-model.trim="product.price"
          inputId="minmax-buttons"
          mode="decimal"
          showButtons
          :min="0"
          :class="{ 'p-invalid': submitted && !product.price }"
        />
        <small class="p-error" v-if="submitted && !product.price">
          {{ $t('PRODUCTS.CREATE_PRODUCT.EMPTY_PRICE') }}
        </small>
      </div>
      <div class="field" v-if="userPermissions.assignCountry">
        <label for="create_country">{{ $t('PRODUCTS.CREATE_PRODUCT.COUNTRY.LABEL') }}</label>
        <Dropdown
          id="create_country"
          v-model="selectedCountry"
          :options="countries"
          :placeholder="$t('PRODUCTS.CREATE_PRODUCT.COUNTRY.DROPDOWN')"
          optionLabel="nameSoftware"
          class="w-full"
          filter
        />
      </div>
      <div class="field" v-if="userPermissions.assignCategory">
        <label for="create_category">{{ $t('PRODUCTS.CREATE_PRODUCT.CATEGORY.LABEL') }}</label>
        <Dropdown
          id="create_category"
          v-model="selectedCategory"
          :options="categories"
          :placeholder="$t('PRODUCTS.CREATE_PRODUCT.CATEGORY.DROPDOWN')"
          optionLabel="nameRU"
          class="w-full"
          filter
        />
      </div>
      <div class="field">
        <label for="create_age_group">{{ $t('PRODUCTS.CREATE_PRODUCT.AGE_GROUP') }}</label>
        <InputText id="create_age_group" v-model.trim="product.ageGroup" />
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
          @click="createProduct"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="changeDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('PRODUCTS.CHANGE_PRODUCT.HEADER')"
      :modal="true"
    >
      <div class="field">
        <label for="change_name_crm">{{ $t('PRODUCTS.CHANGE_PRODUCT.NAME_CRM') }}</label>
        <InputText
          id="change_name_crm"
          v-model.trim="selectedProduct.nameCRM"
          :class="{ 'p-invalid': submitted && !selectedProduct.nameCRM }"
        />
        <small class="p-error" v-if="submitted && !selectedProduct.nameCRM">
          {{ $t('PRODUCTS.CHANGE_PRODUCT.EMPTY_NAME') }}
        </small>
      </div>
      <div class="field">
        <label for="change_name_software">{{ $t('PRODUCTS.CHANGE_PRODUCT.NAME_SOFTWARE') }}</label>
        <InputText
          id="change_name_software"
          v-model.trim="selectedProduct.nameSoftware"
          :class="{ 'p-invalid': submitted && !selectedProduct.nameSoftware }"
        />
        <small class="p-error" v-if="submitted && !selectedProduct.nameSoftware">
          {{ $t('PRODUCTS.CHANGE_PRODUCT.EMPTY_NAME') }}
        </small>
      </div>
      <div class="field">
        <label for="change_price">{{ $t('PRODUCTS.CHANGE_PRODUCT.PRICE') }}</label>
        <InputNumber
          id="change_price"
          v-model.trim="selectedProduct.price"
          inputId="minmax-buttons"
          mode="decimal"
          showButtons
          :min="0"
          :class="{ 'p-invalid': submitted && !selectedProduct.price }"
        />
        <small class="p-error" v-if="submitted && !selectedProduct.price">
          {{ $t('PRODUCTS.CHANGE_PRODUCT.EMPTY_PRICE') }}
        </small>
      </div>
      <div class="field" v-if="userPermissions.assignCountry">
        <label for="change_country">{{ $t('PRODUCTS.CHANGE_PRODUCT.COUNTRY.LABEL') }}</label>
        <Dropdown
          id="change_country"
          v-model="selectedCountry"
          :options="countries"
          :placeholder="$t('PRODUCTS.CHANGE_PRODUCT.COUNTRY.DROPDOWN')"
          optionLabel="nameSoftware"
          class="w-full"
          filter
        />
      </div>
      <div class="field" v-if="userPermissions.assignCategory">
        <label for="change_category">{{ $t('PRODUCTS.CHANGE_PRODUCT.CATEGORY.LABEL') }}</label>
        <Dropdown
          id="change_category"
          v-model="selectedCategory"
          :options="categories"
          :placeholder="$t('PRODUCTS.CHANGE_PRODUCT.CATEGORY.DROPDOWN')"
          optionLabel="nameRU"
          class="w-full"
          filter
        />
      </div>
      <div class="field">
        <label for="change_age_group">{{ $t('PRODUCTS.CHANGE_PRODUCT.AGE_GROUP') }}</label>
        <InputText id="change_age_group" v-model.trim="selectedProduct.ageGroup" />
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
          @click="updateProduct"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('PRODUCTS.DELETE_PRODUCT.HEADER')"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span
          v-if="selectedProduct"
          v-html="$t('PRODUCTS.DELETE_PRODUCT.PRODUCT', { name: selectedProduct.nameSoftware })"
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
          @click="deleteProduct"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
  import ProductService from '@/services/ProductService';
  import CountryService from '@/services/CountryService';
  import CategoryService from '@/services/CategoryService';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import InputText from 'primevue/inputtext';
  import InputNumber from 'primevue/inputnumber';
  import Dropdown from 'primevue/dropdown';
  import { FilterMatchMode } from 'primevue/api';
  import { showCatchMessage } from '@/helpers/showCatch.js';

  export default {
    components: { DataTable, Column, InputText, InputNumber, Button, Dialog, Dropdown },
    data() {
      return {
        balanceFrozen: false,
        loading: false,
        filters: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } },
        products: [],
        product: {},
        submitted: false,
        createDialog: false,
        changeDialog: false,
        deleteDialog: false,
        selectedProduct: null,
        selectedCountry: null,
        selectedCategory: null,
        selectedProductIndex: null,
        countries: [{ nameSoftware: '------', _id: null }],
        categories: [{ nameRU: '------', _id: null }],
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
          if (this.userPermissions.assignCountry) {
            const responseCountries = await CountryService.getList();
            const countries = responseCountries.data || [];
            this.countries.push(...countries);
          }

          if (this.userPermissions.assignCategory) {
            const responseCategories = await CategoryService.getList();
            const categories = responseCategories.data || [];
            this.categories.push(...categories);
          }

          const responseProducts = await ProductService.getAll();
          const products = responseProducts.data || [];
          this.products.push(
            ...products.reverse().map((product) => this.formattingProduct(product))
          );
        } catch (e) {
          showCatchMessage.call(this, e);
        } finally {
          this.loading = false;
        }
      },

      formattingProduct(product) {
        product.country ? null : (product.country = { nameSoftware: '------', _id: null });
        product.category ? null : (product.category = { nameRU: '------', _id: null });
        product.price ? null : (product.price = 0);
        return product;
      },

      openNewProduct() {
        this.product = {};
        this.selectedCountry = this.countries[0];
        this.selectedCategory = this.categories[0];
        this.submitted = false;
        this.createDialog = true;
      },

      hideCreateModal() {
        this.product = {};
        this.createDialog = false;
      },

      async createProduct() {
        if (
          this.product.nameCRM?.trim() &&
          this.product.nameSoftware?.trim() &&
          this.product.price > 0
        ) {
          const data = {
            nameCRM: this.product.nameCRM,
            nameSoftware: this.product.nameSoftware,
            price: this.product.price,
            country: this.selectedCountry._id,
            category: this.selectedCategory._id,
            ageGroup: this.product.ageGroup,
          };
          try {
            const response = await ProductService.create(data);
            this.$toast.add({
              severity: 'success',
              summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
              detail: this.$t('PRODUCTS.CREATE_PRODUCT.SUCCESSFUL'),
              life: 3000,
            });
            this.products.unshift({
              _id: response.data._id,
              nameCRM: this.product.nameCRM,
              nameSoftware: this.product.nameSoftware,
              price: this.product.price,
              country: this.selectedCountry,
              category: this.selectedCategory,
              ageGroup: this.product.ageGroup,
            });
            this.createDialog = false;
            this.product = {};
          } catch (e) {
            showCatchMessage.call(this, e);
          }
        } else {
          this.submitted = true;
        }
      },

      openChangeModal(event) {
        const data = JSON.parse(JSON.stringify(event.data));
        this.changeDialog = true;
        this.selectedProduct = data;
        this.selectedProductIndex = event.index;
        this.selectedCountry = data.country;
        this.selectedCategory = data.category;
      },

      hideChangeModal() {
        this.product = {};
        this.changeDialog = false;
      },

      async updateProduct() {
        if (
          this.selectedProduct.nameCRM?.trim() &&
          this.selectedProduct.nameSoftware?.trim() &&
          this.selectedProduct.price > 0
        ) {
          const data = {
            _id: this.selectedProduct._id,
            nameCRM: this.selectedProduct.nameCRM,
            nameSoftware: this.selectedProduct.nameSoftware,
            price: this.selectedProduct.price,
            country: this.selectedCountry._id,
            category: this.selectedCategory._id,
            ageGroup: this.selectedProduct.ageGroup,
          };
          try {
            await ProductService.update(data);
            this.$toast.add({
              severity: 'success',
              summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
              detail: this.$t('PRODUCTS.CHANGE_PRODUCT.SUCCESSFUL'),
              life: 3000,
            });
            this.products[this.selectedProductIndex] = {
              _id: this.selectedProduct._id,
              nameCRM: this.selectedProduct.nameCRM,
              nameSoftware: this.selectedProduct.nameSoftware,
              price: this.selectedProduct.price,
              country: this.selectedCountry,
              category: this.selectedCategory,
              ageGroup: this.selectedProduct.ageGroup,
            };
            this.hideChangeModal();
          } catch (e) {
            showCatchMessage.call(this, e);
          }
        } else {
          this.submitted = true;
        }
      },

      openDeleteModal(event) {
        this.selectedProduct = event.data;
        this.selectedProductIndex = event.index;
        this.deleteDialog = true;
      },

      hideDeleteModal() {
        this.deleteDialog = false;
      },

      async deleteProduct() {
        try {
          await ProductService.delete({ product: this.selectedProduct._id });
          this.$toast.add({
            severity: 'success',
            summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
            detail: this.$t('PRODUCTS.DELETE_PRODUCT.SUCCESSFUL'),
            life: 3000,
          });
          this.products.splice(this.selectedProductIndex, 1);
          this.hideDeleteModal();
        } catch (e) {
          showCatchMessage.call(this, e);
        }
      },
    },
  };
</script>

