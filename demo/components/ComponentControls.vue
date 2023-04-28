<script setup lang="ts">
import {
   store,
   setPauseOnHover,
   setPauseOnTouch,
   setCustomIcons as _setCustomIcons,
   setRenderTiles as _setRenderTiles,
   setOutlineIcons as _setOutlineIcons,
   setRTL as _setRTL,
} from '../store'
import { usePush } from '../../src'

const push = usePush()

function pushSuccess() {
   if (store.rtl) {
      push({
         title: store.renderTitles ? 'نجاح' : false,
         message: 'تم إرسال رسالتك بنجاح. لو سمحت.',
      })
   } else {
      push({
         title: store.renderTitles ? 'Success' : false,
         message: 'Your message has been successfully sent.',
      })
   }
}

function setRTL() {
   push.destroyAll()
   _setRTL()
   pushSuccess()
}

function setOutlineIcons() {
   push.destroyAll()
   _setOutlineIcons()
   pushSuccess()
}

function setRenderTiles() {
   push.destroyAll()
   _setRenderTiles()
   pushSuccess()
}

function setCustomIcons() {
   push.destroyAll()
   _setCustomIcons()
   pushSuccess()
}

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
</script>

<template>
   <div class="Controls">
      <div
         v-if="isMobile"
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.pauseOnTouch"
         aria-label="Pause on Touch"
         @click="setPauseOnTouch"
      >
         Pause on Touch
      </div>
      <div
         v-else
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.pauseOnHover"
         aria-label="Pause on Hover"
         @click="setPauseOnHover"
      >
         Pause on Hover
      </div>
      <div
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.renderTitles"
         aria-label="Render Titles"
         @click="setRenderTiles"
      >
         Render Titles
      </div>
      <div
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.outlineIcons"
         aria-label="Outline Icons"
         @click="setOutlineIcons"
      >
         Outline Icons
      </div>
      <div
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.rtl"
         aria-label="RTL Direction"
         @click="setRTL"
      >
         RTL Direction
      </div>
      <div
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.customIcons"
         aria-label="Use Emojis"
         @click="setCustomIcons"
      >
         Use Emojis
      </div>
   </div>
</template>

<style scoped>
.Controls {
   display: grid;
   gap: 10px;
   grid-auto-flow: row;
}
</style>
