<template>
    <section class="faq" ref="rootEl">
        <div class="faq-wrapper">
            <nav v-if="hasNavigation" class="faq__nav">
                <div
                    v-for="(category, i) in categories"
                    :key="`category-${i}`"
                    v-html="category"
                    :class="generateCategoryClasses(category)"
                    @click="makeActiveCategory(category, i)"
                ></div>
            </nav>

            <Transition name="accordion-fade-slide" mode="out-in">
                <div v-if="showAccordion" class="accordion">
                    <div
                      class="accordion__item"
                      v-for="(item, i) in categoryItems"
                      :key="`accordion-item-${i}`"
                    >
                    <div :class="generateQuestionClasses(i)" @click="makeActive(i)">
                        <p class="accordion__title-text" v-html="item[questionProperty]"></p>
                        <button :class="generateButtonClasses(i)"></button>
                    </div>
                        <collapse-transition>
                          <div v-if="i === activeQuestionIndex">
                              <div class="accordion__value">
                                  <slot v-bind="item">
                                  <div v-html="item[answerProperty]"></div>
                                  </slot>
                              </div>
                          </div>
                        </collapse-transition>
                    </div>
                </div>
            </Transition>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

// @ts-ignore - pkg doesn't have types
import { CollapseTransition } from '@ivanv/vue-collapse-transition'

const rootEl = ref<HTMLElement>();
const activeTab = ref("");
const activeQuestionIndex = ref(0);
const showAccordion = ref(true);

const emit = defineEmits(["itemSelect", "categorySelect"])

interface Items {
    questionProperty: string;
    answerProperty: string;
    tabName: string;
}

const props = withDefaults(defineProps<{
    /**
     * Array of items
     * Object style {questionProperty: string, answerProperty: string, tabName: string}
     * You can change object keys names using other props (questionProperty, answerProperty, tabName)
     */
    items?: Items[];
    /**
     * Key name of object in items array for specifying title of question
    */
    questionProperty?: string;
    /**
     * Key name of object in items array for specifying content text of open question
    */
    answerProperty?: string;
    /**
     * Key name of object in items array for specifying navigation tab name
    */
    tabName?: string;
    /**
     * Color for hover and active tab/question
     * possible values: 'red', '#F00', 'rgb(255, 0, 0)'
     */
    activeColor?: string;
     /**
     * Color for borders
     */
    borderColor?: string;
    /**
     * Color for fonts
     */
    fontColor?: string;
    /**
     * Opened by default tabName (category)
     */
    initialTab?: string | null;
    /**
     * Opened by default question
     * All closed by default
     */
    initialQuestionIndex?: number;
}>(), {
    questionProperty: "title",
    answerProperty: "value",
    tabName: "category",
    activeColor: "D50000",
    borderColor: "#9E9E9E",
    fontColor: "#000000",
    initialTab: null,
    initialQuestionIndex: 0
});

const categories = computed(() => {
    const uniqueCategories = props.items
        .map(item => item[props.tabName])
        .filter((category, index, categories) => categories.indexOf(category) === index)
        activeTab.value = props.initialTab || uniqueCategories[0]
        activeQuestionIndex.value = props.initialQuestionIndex || 0
    return uniqueCategories
});

const categoryItems = computed(() => {
  return props.items
  .filter(item => item[props.tabName] === activeTab.value)
});

const hasNavigation = computed(() => {
    return !!categories[0]
});

const makeActive = (itemIndex: number) => {
    activeQuestionIndex.value = activeQuestionIndex.value === itemIndex ? null : itemIndex;
    emit("itemSelect", { itemIndex });
};

const generateButtonClasses = (buttonIndex: number) => {
    return [
        'accordion__toggle-button',
        activeQuestionIndex.value === buttonIndex
            ? 'accordion__toggle-button_active'
            : null
    ]
};

const generateQuestionClasses = (questionIndex: number) => {
    return [
        'accordion__title',
        activeQuestionIndex.value === questionIndex
            ? 'accordion__title_active'
            : null
    ]
};

const makeActiveCategory = (category: string, categoryIndex: number) => {
    if (activeTab.value === category) return
    showAccordion.value = false
    activeTab.value = category
    activeQuestionIndex.value = null
    setTimeout(() => {
        emit('categorySelect', { categoryIndex })
        showAccordion.value = true
    }, 300)
};

const generateCategoryClasses = (category: string) => {
    return [
        'faq__nav-item',
        activeTab.value === category
            ? 'faq__nav-item_active'
            : null
    ]
};

onMounted(() => {
  rootEl.value?.style.setProperty('--active-color', props.activeColor);
  rootEl.value?.style.setProperty('--border-color', props.borderColor);
  rootEl.value?.style.setProperty('--font-color', props.fontColor);
});

</script>

<style lang="scss" scoped>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  button {
    border: none;
    background: none;
    outline: none;
  }
  .faq {
    width: 100%;
    padding: 0 10px;
    &-wrapper {
      max-width: 825px;
    }
    &__title {
      text-align: center;
      margin-bottom: 25px;
    }
    &__nav {
      display: flex;
      justify-content: space-between;
      border: 2px solid var(--border-color);
      border-radius: 5px;
    }
    &__nav-item {
      height: 60px;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 2px solid var(--border-color);
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
      text-align: center;
      user-select: none;
      color: var(--font-color);
      &_active {
        color: var(--active-color);
      }
      &:hover {
        color: var(--active-color);
      }
      &:last-child {
        border-right: none;
      }
    }
    &__accordion {
      min-height: 250px;
    }
  }
  .accordion-fade-slide {
    &-enter-active,
    &-leave-active {
      transition: all 0.3s;
    }
    &-enter {
      transform: translateY(-25px);
      opacity: 0;
    }
    &-leave-to {
      transform: translateY(25px);
      opacity: 0;
    }
  }
  .accordion {
    border: 2px solid var(--border-color);
    border-radius: 5px;
    margin-top: 15px;
    &__item {
      border-bottom: 2px solid var(--border-color);
      &:last-child {
        border-bottom: none;
      }
    }
    &__title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 25px;
      cursor: pointer;
      transition: all 0.3s;
      color: var(--font-color);
      &_active {
        color: var(--active-color);
      }
      &:hover {
        color: var(--active-color);
        .accordion__toggle-button {
          &::before,
          &::after {
            background: var(--active-color);
          }
        }
      }
      &-text {
        margin-right: 10px;
      }
    }
    &__value {
      padding: 0 25px 25px 25px;
      text-align: left;
      color: var(--font-color);
    }
    &__toggle-button {
      position: relative;
      width: 16px;
      height: 16px;
      transition: all 0.3s;
      transform-origin: 50% 50%;
      padding-left: 16px;
      cursor: pointer;
      &::before,
      &::after {
        content: '';
        position: absolute;
        left: 0;
        width: 100%;
        height: 2px;
        transition: all 0.3s;
        background: black;
      }
      &::before {
        transform: rotate(90deg);
      }
      &_active {
        transform: rotate(45deg);
        &::before,
        &::after {
          background: var(--active-color);
        }
      }
    }
  }
</style>