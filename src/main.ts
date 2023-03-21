import type { App } from 'vue';
import FaqAccordion from "./faq-accordion.vue";

export default {
  install: (app: App) => {
    app.component('FaqAccordion', FaqAccordion);
  }
};

export { FaqAccordion };