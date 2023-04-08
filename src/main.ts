import { createApp } from 'vue';
// import { createSSRApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primeicons/primeicons.css';
import './assets/scss/style.scss';

// const app = createSSRApp(App);
const app = createApp(App);
app.use(store);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);
app.mount('#app');
// router.isReady().then(() => {
//   app.mount('#app')
// })