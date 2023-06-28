<script setup lang="ts">
import { computed } from 'vue'

import { useConfig } from '@/core/useStore'
import { Classes as Cx } from './constants'

import type { NotivueSlot } from '@/types'

const config = useConfig()

const props = defineProps<{
   item: NotivueSlot
}>()

const icon = computed(() => config.icons.value[props.item.type])
const closeIcon = computed(() => config.icons.value.close)
</script>

<template>
   <div :class="`${Cx.NOTIFICATION} ${item.class}`" :data-notivue="item.type">
      <template v-if="item.icon">
         <Component v-if="typeof icon === 'object'" :is="icon" :class="Cx.ICON" />
         <div v-else-if="typeof icon === 'string'" :class="Cx.ICON" aria-hidden="true">
            {{ icon }}
         </div>
      </template>

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
         <Component v-if="typeof closeIcon === 'object'" :is="closeIcon" :class="Cx.CLOSE_ICON" />
         <div v-else-if="typeof closeIcon === 'string'" aria-hidden="true" v-text="closeIcon" />
      </button>
   </div>
</template>
