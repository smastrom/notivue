<div align="center">

![notivue](https://i.ibb.co/CJCG2Hq/readme-header.png)

<br />

# Notivue

### Fully-featured notification system for Vue and Nuxt

[Live Demo](https://notivue.smastrom.dev) - [Documentation](https://notivuedocs.netlify.app)

---

**Examples:** [Custom Components](https://stackblitz.com/edit/vitejs-vite-9jkh73?file=src%2Fcomponents%2FPage.vue) -
[Nuxt](https://stackblitz.com/edit/nuxt-starter-fnhcmx?file=pages%2Findex.vue) -
[Astro](https://stackblitz.com/edit/withastro-astro-qyesvk?file=src%2Fcomponents%2FVueComponent.vue)

<br />

</div>

<br />

## Features

**🧬 Fully modular with zero dependencies**  
_Granularly include only the features you need_

**💊 Drop-in components to enhance notifications**  
_NotivueSwipe, NotivueKeyboard, all optional and customizable_

**🧩 Headless API**  
_Use your own notifications while Notivue handles the rest_

**🌀 Dynamic Notifications**  
_Update pending notifications with ease_

**🔰 Ready-made notifications included**  
_Themes, icons, RTL support and much more_

**🎢 Slick transitions and animations**  
_Customize any animation with plain CSS_

**♿️ Fully accessible**  
_Built-in screen reader, reduced motion, and keyboard support_

**💫 Nuxt and Astro modules**  
_Buit-in Nuxt and Astro modules_

<br />

## Installation

```bash
pnpm add notivue

# npm i notivue
# yarn add notivue
# bun install notivue
```

<br />

## Vite

> :bulb: See [↓ below](#nuxt) for **Nuxt**

**main.js/ts**

```ts
import { createApp } from 'vue'
import { createNotivue } from 'notivue'

import App from './App.vue'

import 'notivue/notifications.css' // Only needed if using built-in notifications
import 'notivue/animations.css' // Only needed if using built-in animations

const notivue = createNotivue(/* Options */)
const app = createApp(App)

app.use(notivue)
app.mount('#app')
```

**App.vue**

```vue
<script setup>
import { Notivue, Notifications, push } from 'notivue'
</script>

<template>
  <button @click="push.success('Hello from your first notification!')">Push</button>

  <Notivue v-slot="item">
    <Notifications :item="item" />
  </Notivue>

  <!-- RouterView, etc. -->
</template>
```

<details>
<summary><strong>Headless, with custom components</strong></summary>

```vue
<script setup>
import { Notivue, push } from 'notivue'
</script>

<template>
  <button @click="push.success('This is your first notification!')">Push</button>

  <Notivue v-slot="item">
    <!-- Your custom notification 👇 -->
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
<template>
  <button @click="push.success('Hello from your first notification!')">Push</button>

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

MIT
