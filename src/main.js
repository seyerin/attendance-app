import { createApp } from 'vue';
import App from './App.vue';
import store from '../store/index.js';
import router from '../router/index.js'; // Pastikan router diimpor
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

app.use(store);  
app.use(router); // Tambahkan ini untuk menggunakan router
app.use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 5000,
});
app.mount('#app');
