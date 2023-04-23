<template>
  <div>
    <!-- DEFAULT -->
    <VueFaqAccordion
      :items="myItems"
    />
  </div>
</template>

<script lang="ts">
import VueFaqAccordion from './vue-faq-accordion.vue';

export default {
  components: {
    VueFaqAccordion
  },
  data () {
    return {
      myItems: [
          {
            questionProperty: 'How many time zones are there in all?',
            answerProperty: 'Given a 24-hour day and 360 degrees of longitude around the Earth',
            tabName: 'Tab-1'
          },
          {
            questionProperty: 'How long is a day and year on Venus?',
            answerProperty: 'Venus takes 224.7 Earth days to complete one orbit around the Sun.',
            tabName: 'Tab-2'
          },
          {
            questionProperty: 'What animal smells like popcorn?',
            answerProperty: 'Binturongs smell like popcorn.',
            tabName: 'Tab-2'
          }
        ]
    }
  },
  methods: {
    onCategorySelect (args) {
      console.log('onCategorySelect', args)
    },
    onItemSelect (args) {
      console.log('onItemSelect', args)
    }
  },
}
</script>