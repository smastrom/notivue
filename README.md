# Notivue

### Powerful toast notification system for Vue

[Live Demo](https://notivue.smastrom.io) - [Documentation](https://docs.notivue.smastrom.io)

---

**Examples:** [Custom Components](https://stackblitz.com/edit/vitejs-vite-9jkh73?file=src%2Fcomponents%2FPage.vue) -
[Nuxt](https://stackblitz.com/edit/nuxt-starter-fnhcmx?file=pages%2Findex.vue) -
[Astro](https://stackblitz.com/edit/withastro-astro-qyesvk?file=src%2Fcomponents%2FVueComponent.vue)

## Features

**🧬 Fully modular with zero dependencies**  
_Granularly include only the features you need_

**✅ Beautiful, ready-made notifications included**  
_Themes, icons, progress bar, and native RTL support_

**🧩 Headless API**  
_Use your own components while Notivue handles the rest_

**💊 Drop-in components to enhance notifications**  
_NotificationSwipe_ (alias `NotivueSwipe`), _NotivueKeyboard_, all optional and customizable

**🌀 Dynamic Notifications**  
_Update pending notifications with a breeze_

**🎢 Slick transitions and animations**  
_Customize animations with CSS classes_

**♿️ Fully accessible**  
_Built-in announcements, reduced-motion and keyboard support_

**💫 Nuxt and Astro modules**  
_Built-in Nuxt and Astro ad-hoc modules_

## Installation

```shell
pnpm add notivue

# npm i notivue
# yarn add notivue
# bun i notivue
```

> :bulb: Beyond this quick start — Nuxt/Astro setup, **`notify`** / callbacks, stream config, built-in styling, headless mode, full API — lives in the [documentation](https://docs.notivue.smastrom.io). The legacy **`push`** name remains exported as an alias.

## Quick start (Vite)

> :bulb: See [↓ below](#nuxt) for **Nuxt** and [↓ Astro](#astro).

**main.js/ts**

```ts
import { createApp } from 'vue'
import { createNotivue } from 'notivue'

import App from './App.vue'

import 'notivue/notification.css' // Only needed if using built-in <Notification />
import 'notivue/animations.css' // Only needed if using default animations

const notivue = createNotivue({
   position: 'bottom-right',
   pauseOnHover: true,
   pauseOnTabChange: true,
   limit: 4,
   enqueue: true,
   // ... other options
})
const app = createApp(App)

app.use(notivue)
app.mount('#app')
```

**App.vue**

```vue
<script setup>
import { Notivue, Notification, notify } from 'notivue'
</script>

<template>
   <button
      type="button"
      @click="notify.success('Changes saved. They will sync when you are back online.')"
   >
      Save changes
   </button>

   <Notivue v-slot="item">
      <Notification :item="item" />
   </Notivue>

   <!-- RouterView, etc. -->
</template>
```

### Swipe to dismiss

Wrap the notification in **`NotificationSwipe`** so toasts can be cleared with a horizontal swipe. Use the same wrapper around the built-in **`Notification`** or around a **custom component** (see the `<Toast>` example below). Alias: `NotivueSwipe`.

```vue
<script setup>
import { Notivue, Notification, NotificationSwipe, notify } from 'notivue'
</script>

<template>
   <button
      type="button"
      @click="notify.success('Changes saved. They will sync when you are back online.')"
   >
      Save changes
   </button>

   <Notivue v-slot="item">
      <NotificationSwipe :item="item">
         <Notification :item="item" />
      </NotificationSwipe>
   </Notivue>

   <!-- RouterView, etc. -->
</template>
```

### Custom components — your own markup

**components/Toast.vue**

```vue
<script setup lang="ts">
import type { NotivueItem } from 'notivue'

// Custom props
export interface ToastProps {
   from: string
}

defineProps<{
   item: NotivueItem<ToastProps>
}>()
</script>

<template>
   <div class="Toast">
      <div class="Toast-body">
         <p :role="item.ariaRole" :aria-live="item.ariaLive" aria-atomic="true">
            {{ item.message }}
         </p>
         <p class="Toast-meta">{{ item.props.from }}</p>
      </div>

      <button type="button" class="Toast-dismiss" @click="item.clear" aria-label="Dismiss">
         ×
      </button>
   </div>
</template>
```

**App.vue**

```vue
<script setup lang="ts">
import { Notivue, NotificationSwipe, notify } from 'notivue'

import Toast, { type ToastProps } from './components/Toast.vue'

function showNotification(message: string, from: string) {
   notify.success<ToastProps>({
      message,
      props: { from },
   })
}
</script>

<template>
   <button
      type="button"
      @click="
         showNotification(
            'Payment recorded. We emailed a receipt to the customer.',
            'Product Management'
         )
      "
   >
      Record payment
   </button>

   <Notivue v-slot="item">
      <NotificationSwipe :item="item">
         <Toast :item="item" />
      </NotificationSwipe>
   </Notivue>

   <!-- RouterView, etc. -->
</template>
```

## Nuxt

**nuxt.config.ts**

```ts
export default defineNuxtConfig({
   modules: ['notivue/nuxt'],
   css: [
      'notivue/notification.css', // Only needed if using built-in <Notification />
      'notivue/animations.css', // Only needed if using default animations
   ],
   notivue: {
      position: 'bottom-right',
      pauseOnHover: true,
      pauseOnTabChange: true,
      limit: 4,
      enqueue: true,
      // ... other options
   },
})
```

**app.vue**

```vue
<template>
   <button
      type="button"
      @click="notify.success('Changes saved. They will sync when you are back online.')"
   >
      Save changes
   </button>

   <Notivue v-slot="item">
      <Notification :item="item" />
   </Notivue>

   <!-- NuxtLayout, NuxtPage, etc. -->
</template>
```

## Astro

> :bulb: Import from **`notivue/astro`** (not `notivue`). CSS: **`notivue/astro/notification.css`** and **`notivue/astro/animations.css`** when you use the built-in UI and default animations.

> **Note:** Astro **6** is not supported yet.

[Installation → Astro](https://docs.notivue.smastrom.io/installation/astro.html) — `createNotivue` in the Vue app entry, Notivue island, `client:only`, view transitions.

## Thanks

- [Ionic Team](https://ionic.io/) for the icons
- [Uktash Verna](https://github.com/n3r4zzurr0) for the animated spinner

## License

MIT
