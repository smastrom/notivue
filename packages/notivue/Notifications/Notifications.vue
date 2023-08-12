<script setup lang="ts">
import { computed } from 'vue'

import { Classes as Cx } from './constants'
import { filledIcons } from './icons'
import { lightTheme } from './themes'

import type { NotivueIcons, NotivueSlot, NotivueTheme } from 'notivue'

const props = withDefaults(
   defineProps<{
      item: NotivueSlot
      icons?: NotivueIcons
      theme?: NotivueTheme
   }>(),
   { icons: () => filledIcons, theme: () => lightTheme, closeAriaLabel: 'Close' }
)

const icon = computed(() => props.icons[props.item.type])
const closeIcon = computed(() => props.icons.close)
</script>

<template>
   <div :class="Cx.NOTIFICATION" :data-notivue="item.type" :style="theme" tabindex="-1">
      <template v-if="icon">
         <Component
            v-if="typeof icon === 'object'"
            :is="icon"
            :class="Cx.ICON"
            aria-hidden="true"
         />
         <div v-else-if="typeof icon === 'string'" :class="Cx.ICON" aria-hidden="true">
            {{ icon }}
         </div>
      </template>

      <div :class="Cx.CONTENT" :aria-live="item.ariaLive" :role="item.ariaRole">
         <h3 v-if="item.title" :class="Cx.TITLE" v-text="item.title" />
         <p :class="Cx.MESSAGE" v-text="item.message" />
      </div>

      <button
         v-if="closeIcon && item.type !== 'promise'"
         :class="Cx.CLOSE"
         tabindex="-1"
         @click="item.clear"
      >
         <Component v-if="typeof closeIcon === 'object'" :is="closeIcon" :class="Cx.CLOSE_ICON" />
         <div v-else-if="typeof closeIcon === 'string'" aria-hidden="true" v-text="closeIcon" />
      </button>
   </div>
</template>
