import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router

// Create and mount the Vue app with the router
createApp(App)
  .use(router)
  .mount('#app');