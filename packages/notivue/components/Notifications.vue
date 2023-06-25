<script setup lang="ts">
import { computed } from 'vue'

import { StoreItem } from '../types'
import { useConfig } from '../composables/useStore'

import { Classes as Cx } from '../core/constants'

const config = useConfig()

const props = defineProps<{
   item: StoreItem
}>()

const icon = computed(() => config.icons.value[props.item.type])
const closeIcon = computed(() => config.icons.value.close)
</script>

<template>
   <div
      :class="`${Cx.NOTIFICATION} ${item.class}`"
      :data-notivue="item.type"
      :data-notivue-icon="item.icon"
   >
      <Component v-if="item.icon && typeof icon === 'object'" :is="icon" :class="Cx.ICON" />
      <div v-else-if="item.icon && typeof icon === 'string'" :class="Cx.ICON" aria-hidden="true">
         {{ icon }}
      </div>

      <div :class="Cx.CONTENT">
         <h3 v-if="item.title" :class="Cx.TITLE" v-text="item.title" />
         <p :class="Cx.MESSAGE" v-text="item.message" />
      </div>

      <button
         v-if="item.close"
         :class="Cx.CLOSE"
         @click="item.clear"
         :aria-label="item.closeAriaLabel"
      >
         <Component
            v-if="item.close && typeof closeIcon === 'object'"
            :is="closeIcon"
            :class="Cx.CLOSE_ICON"
         />
         <div
            v-else-if="item.close && typeof closeIcon === 'string'"
            aria-hidden="true"
            v-text="closeIcon"
         />
      </button>
   </div>
</template>
