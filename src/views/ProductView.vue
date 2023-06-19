<template>
  <Fieldset v-if="product" :legend="product.name">
    <div class="flex flex-column sm:flex-row gap-4">
      <Image
        :src="product.photo"
        imageClass="max-w-16rem max-h-16rem sm:max-w-8rem sm:max-h-8rem md:max-w-16rem md:max-h-16rem mx-auto sm:m-0"
        preview
      />
      <ul class="max-w-full text-xl md:text-2xl">
        <li>
          <span class="font-semibold">{{ $t('PRODUCT.INFO.COUNTRY') }}:</span> {{ product.country }}
        </li>
        <li>
          <span class="font-semibold">{{ $t('PRODUCT.INFO.CATEGORY') }}:</span>
          {{ product.category }}
        </li>
        <li>
          <span class="font-semibold">{{ $t('PRODUCT.INFO.LANG') }}:</span> {{ product.lang }}
        </li>
        <li>
          <span class="font-semibold">{{ $t('PRODUCT.INFO.PRICE') }}:</span> {{ price }}
        </li>
        <li v-if="product.payout">
          <span class="font-semibold">{{ $t('PRODUCT.INFO.PAYOUT') }}:</span> {{ product.payout }}
        </li>
        <li v-if="product.ageGroup">
          <span class="font-semibold">{{ $t('PRODUCT.INFO.AGE_GROUP') }}:</span>
          {{ product.ageGroup }}
        </li>
        <li v-if="product.callCenterSchedule">
          <span class="font-semibold">{{ $t('PRODUCT.INFO.CALL_CENTER_SCHEDULE') }}:</span>
          {{ product.callCenterSchedule }}
        </li>
        <li>
          <span class="font-semibold">{{ $t('PRODUCT.INFO.UUID') }}:</span> {{ product.uuid }}
        </li>
      </ul>
    </div>
  </Fieldset>
</template>

<script>
  import Fieldset from 'primevue/fieldset';
  import Image from 'primevue/image';
  // import { mapGetters, mapMutations  } from 'vuex';
  import { mapActions } from 'vuex';

  export default {
    components: { Fieldset, Image },

    data() {
      return {
        product: null,
      };
    },

    async created() {
      await this.getData();
    },

    computed: {
      price() {
        const currencySymbol =
          this.product.currencySymbol && this.product.currency !== this.product.currencySymbol
            ? `(${this.product.currencySymbol})`
            : null;
        return `${this.product.price} ${this.product.currency}${currencySymbol}`;
      },
    },

    methods: {
      ...mapActions(['getProduct']),

      async getData() {
        const response = await this.getProduct(this.$route.params.id);
        if (!response.success) {
          this.$router.push({ name: '404' });
        } else {
          this.product = response.data;
        }
      },
    },
  };
</script>
