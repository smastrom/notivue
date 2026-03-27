<img src="https://cdn.smastrom.io/notivue-readme.svg" width="800" height="auto" alt="notivue" />

# Notivue

### Toast notification system for Vue 3

Fully typed. Works with Vite, Nuxt, and Astro.

[Live Demo](https://notivue.smastrom.io) - [Documentation](https://docs.notivue.smastrom.io)

---

**Examples:** [Custom Components](https://stackblitz.com/edit/vitejs-vite-9jkh73?file=src%2Fcomponents%2FPage.vue) -
[Nuxt](https://stackblitz.com/edit/nuxt-starter-fnhcmx?file=pages%2Findex.vue) -
[Astro](https://stackblitz.com/edit/withastro-astro-qyesvk?file=src%2Fcomponents%2FVueComponent.vue)

## Features

🧬 **Modular, zero dependencies** - Only what you import reaches your bundle

✅ **Ready-made notifications** - CSS-variable themes with dark mode, progress bars, and RTL support.

🧩 **Headless API** - Bring your own components. Notivue handles the stack and lifecycle.

🌀 **Promise API** - Update a notification from _loading_ to _success_ or _error_ with a reactive handle.

♿️ **Accessible** - Live regions, reduced-motion, pause-on-hover, pause-on-focus, swipe-to-dismiss, and full keyboard navigation.

🛡️ **Battle-tested** - 160+ E2E tests

💫 **Nuxt and Astro modules** - Zero-config framework integration |

## Installation

```bash
pnpm add notivue

# npm i notivue
# yarn add notivue
# bun i notivue
```

> :bulb: Beyond this quick start — Nuxt/Astro setup, **`notify`** / callbacks, stream config, built-in styling, headless mode, full API — lives in the [documentation](https://docs.notivue.smastrom.io).

## Quick start (Vite)

> :bulb: See ↓ below for [Nuxt](#nuxt) and [Astro](#astro).

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
  // other options...
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

### Swipe to dismiss (Optional)

Wrap the notification in **`NotivueSwipe`** so toasts can be cleared with a horizontal swipe. Use the same wrapper around the built-in **`Notification`** or around a **custom component** (see the `<Toast>` example below).

```vue
<script setup>
import { Notivue, Notification, NotivueSwipe, notify } from 'notivue'
</script>

<template>
  <button
    type="button"
    @click="notify.success('Changes saved. They will sync when you are back online.')"
  >
    Save changes
  </button>

  <Notivue v-slot="item">
    <NotivueSwipe :item="item">
      <Notification :item="item" />
    </NotivueSwipe>
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

    <button type="button" class="Toast-dismiss" @click="item.clear" aria-label="Dismiss">×</button>
  </div>
</template>
```

**App.vue**

```vue
<script setup lang="ts">
import { Notivue, NotivueSwipe, notify } from 'notivue'

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
    <NotivueSwipe :item="item">
      <Toast :item="item" />
    </NotivueSwipe>
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
    // other options...
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

## Key exports

| Export             | What it does                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| `createNotivue`    | Plugin factory — pass config, install on the app                                                        |
| `notify`           | Push notifications: `notify.success()`, `.error()`, `.warning()`, `.info()`, `.promise()`, `.loading()` |
| `Notivue`          | Renderless stream component — renders the notification list                                             |
| `Notification`     | Built-in notification component with themes                                                             |
| `NotivueSwipe`     | Wrapper — adds swipe-to-dismiss                                                                         |
| `NotivueKeyboard`  | Wrapper — adds full keyboard navigation                                                                 |
| `useNotivue`       | Composable — reactive access to config                                                                  |
| `useNotifications` | Composable — reactive access to notifications                                                           |

## Thanks

- [Ionic Team](https://ionic.io/) for the icons
- [Uktash Verna](https://github.com/n3r4zzurr0) for the animated spinner

## License

MIT
