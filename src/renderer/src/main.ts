import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Initialize Vuetify with components and directives
const vuetify = createVuetify({
  components,
  directives,
});

// Create and mount the app with Vuetify
const app = createApp(App);
app.use(vuetify);
app.mount('#app');
