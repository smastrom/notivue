<script setup lang="ts">
import { unref, watch, shallowRef } from 'vue'

import { Classes as Cx, DEFAULT_NOTIFICATIONS_PROPS } from './constants'

import type { NotificationsProps } from 'notivue'

const props = withDefaults(defineProps<NotificationsProps>(), DEFAULT_NOTIFICATIONS_PROPS)

const Icon = shallowRef(props.icons[props.item.type])
const Close = props.icons.close

watch(
   () => props.item.type,
   (t) => (Icon.value = props.icons[t]),
   { flush: 'sync' }
)
</script>

<template>
   <div
      :class="Cx.NOTIFICATION"
      :data-notivue="item.type"
      :data-notivue-has-title="Boolean(item.title)"
      :style="theme"
   >
      <template v-if="Icon">
         <Transition :name="Cx.TRANSITION" v-if="typeof Icon === 'object'" mode="out-in">
            <Component
               v-if="typeof Icon === 'object'"
               :is="Icon"
               :class="Cx.ICON"
               aria-hidden="true"
            />
         </Transition>
         <div v-else-if="typeof Icon === 'string'" :class="Cx.ICON" aria-hidden="true">
            {{ Icon }}
         </div>
      </template>

      <div :class="Cx.CONTENT" :aria-live="item.ariaLive" :role="item.ariaRole" aria-atomic="true">
         <h3 v-if="item.title" :class="Cx.TITLE" v-text="unref(item.title)" />
         <p :class="Cx.MESSAGE" v-text="unref(item.message)" />
      </div>

      <button
         v-if="!props.hideClose && Close && item.type !== 'promise'"
         :class="Cx.CLOSE"
         :aria-label="closeAriaLabel"
         type="button"
         tabindex="-1"
         @click="item.clear"
      >
         <Component v-if="typeof Close === 'object'" :is="Close" :class="Cx.CLOSE_ICON" />
         <div v-else-if="typeof Close === 'string'" aria-hidden="true" v-text="Close" />
      </button>
   </div>
</template>
