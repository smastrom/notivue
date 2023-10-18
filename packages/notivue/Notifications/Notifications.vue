<script setup lang="ts">
import { computed, unref } from 'vue'

import { Classes as Cx, DEFAULT_NOTIFICATIONS_PROPS } from './constants'

import type { NotificationsProps } from 'notivue'

const props = withDefaults(defineProps<NotificationsProps>(), DEFAULT_NOTIFICATIONS_PROPS)

const icon = computed(() => props.icons[props.item.type])
const closeIcon = computed(() => props.icons.close)
</script>

<template>
   <div :class="Cx.NOTIFICATION" :data-notivue="item.type" :style="theme">
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

      <div :class="Cx.CONTENT" :aria-live="item.ariaLive" :role="item.ariaRole" aria-atomic="true">
         <h3 v-if="item.title" :class="Cx.TITLE" v-text="unref(item.title)" />
         <p :class="Cx.MESSAGE" v-text="unref(item.message)" />
      </div>

      <button
         v-if="!props.hideClose && closeIcon && item.type !== 'promise'"
         :class="Cx.CLOSE"
         :aria-label="closeAriaLabel"
         type="button"
         tabindex="-1"
         @click="item.clear"
      >
         <Component v-if="typeof closeIcon === 'object'" :is="closeIcon" :class="Cx.CLOSE_ICON" />
         <div v-else-if="typeof closeIcon === 'string'" aria-hidden="true" v-text="closeIcon" />
      </button>
   </div>
</template>
