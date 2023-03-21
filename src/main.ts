import type { App } from 'vue';
import component from './vue-faq-accordion.vue';

export default {
  install: (app: App) => {
    app.component('FaqAccordion', component);
  }
};

export { component };