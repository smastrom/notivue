<div align="center">

![notivue](https://i.ibb.co/CJCG2Hq/readme-header.png)

<br />

# Notivue

### Fully-featured notification system for Vue and Nuxt

[Live Demo](https://notivue.smastrom.dev) - [Documentation](https://notivuedocs.netlify.app)

---

**Examples:** [Custom Components](https://stackblitz.com/edit/vitejs-vite-9jkh73?file=src%2Fcomponents%2FPage.vue) -
[Nuxt](https://stackblitz.com/edit/nuxt-starter-fnhcmx?file=pages%2Findex.vue)

<br />

</div>

<br />

## Features

**🧬 JS and CSS modular**  
_Granularly include only the features you need_

**💊 Drop-in components to enhance notifications**  
_NotivueSwipe, NotivueKeyboard, all optional and customizable_

**🎢 Slick transitions and animations**  
_Customize any animation with CSS_

**🧩 Custom Components API**  
_Use your own components while Notivue handles the rest_

**🌀 Promise API**  
_Update pending notifications with ease_

**🔰 Includes a ready-made component with anything you need**  
_Themes, icons, rtl support and much more_

**♿️ Fully accessible**  
_Built-in screen reader, reduced motion, and keyboard support_

**🧚‍♂️ Zero dependencies**  
_From ~4.5 KB (gzipped)_

<br />

## Installation

```bash
pnpm add notivue

# npm i notivue
# yarn add notivue
# bun install notivue
```

<br />

## Vite (Single-page app)

> :bulb: See [↓ below](#nuxt) for **Nuxt**

**main.js/ts**

```ts
import { createApp } from 'vue'
import { createNotivue } from 'notivue'

import App from './App.vue'

import 'notivue/notifications.css' // Only needed if using built-in notifications
import 'notivue/animations.css' // Only needed if using built-in animations

const app = createApp(App)

// app.use(...), app.use(...), ...

// Place it at THE END of the app.use() chain, just right before app.mount()
export const push = createNotivue(app /*, options */)

app.mount('#app')
```

**App.vue**

```vue
<script setup>
import { Notivue, Notifications } from 'notivue'
import { push } from './main'
</script>

<template>
  <button @click="push.success('This is your first notification!')">Push</button>

  <Notivue v-slot="item">
    <Notifications :item="item" />
  </Notivue>

  <!-- RouterView, etc. -->
</template>
```

<details>
<summary><strong>With custom components</strong></summary>

```vue
<script setup>
import { Notivue } from 'notivue'
</script>

<template>
  <button @click="push.success('This is your first notification!')">Push</button>

  <Notivue v-slot="item">
    <div class="rounded-full flex py-2 pl-3 bg-slate-700 text-slate-50 text-sm">
      <p :role="item.ariaRole" :aria-live="item.ariaLive">
        {{ item.message }}
      </p>

      <button
        @click="item.clear"
        aria-label="Dismiss"
        class="pl-3 pr-2 hover:text-red-300 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-5 h-5"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          />
        </svg>
      </button>
    </div>
  </Notivue>

  <!-- RouterView, etc. -->
</template>
```

</details>

<br />

## Nuxt

**nuxt.config.ts**

```ts
export default defineNuxtConfig({
  modules: ['notivue/nuxt'],
  css: [
    'notivue/notifications.css', // Only needed if using built-in notifications
    'notivue/animations.css' // Only needed if using built-in animations
  ],
  notivue: {
    // Options
  }
})
```

**app.vue**

```vue
<script setup>
const push = usePush()
</script>

<template>
  <button @click="push.success('This is your first notification!')">Push</button>

  <Notivue v-slot="item">
    <Notifications :item="item" />
  </Notivue>

  <!-- NuxtLayout, NuxtPage, etc. -->
</template>
```

<br />

## Thanks

- [Ionic Team](https://ionic.io/) for the icon sets
- [Uktash Verna](https://github.com/n3r4zzurr0) for the SVG spinner

<br />

## License

MIT Licensed - Simone Mastromattei © 2023
