<div align="center">

<img src="https://cdn.smastrom.io/notivue-readme.svg" width="800" height="auto" alt="notivue" />

<br />

# Notivue

### Powerful toast notification system for Vue and Nuxt

[Live Demo](https://notivue.smastrom.io) - [Documentation](https://docs.notivue.smastrom.io)

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

**✅ Beautiful, ready-made notifications included**  
_Themes, icons, progress bar, and native RTL support_

**🧩 Headless API**  
_Use your own components while Notivue handles the rest_

**💊 Drop-in components to enhance notifications**  
_NotivueSwipe, NotivueKeyboard, all optional and customizable_

**🌀 Dynamic Notifications**  
_Update pending notifications with a breeze_

**🎢 Slick transitions and animations**  
_Customize animations with CSS classes_

**♿️ Fully accessible**  
_Built-in announcements, reduced-motion and keyboard support_

<br />

## Installation

```shell
pnpm add notivue

# npm i notivue
# yarn add notivue
# bun i notivue
```

<br />

## Usage

**nuxt.config.ts**

```ts
export default defineNuxtConfig({
  modules: ['notivue/nuxt'],
  css: [
    'notivue/notification.css', // Only needed if using built-in <Notification />
    'notivue/animations.css' // Only needed if using default animations
  ],
  notivue: {
    // Options
  }
})
```

<blockquote>

:bulb: After installing the module, any function, object and component mentioned in the [documentation](https://docs.notivue.smastrom.io) can be auto-imported except for types which must be imported manually if needed.

```ts
import type { NotivueConfig, NotivueItem /*, ... */ } from 'notivue'
```

</blockquote>

**app.vue**

```vue
<template>
  <button @click="push.success('Hi! I am your first notification!')">Push</button>

  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>

  <!-- NuxtLayout, NuxtPage, etc. -->
</template>
```

<details>
<summary><strong>Headless, with custom components</strong></summary>

```vue
<template>
  <button @click="push.success('Hi! I am your first notification!')">Push</button>

  <Notivue v-slot="item">
    <!-- Your notification 👇 -->
    <div class="rounded-full flex py-2 pl-3 bg-slate-700 text-slate-50 text-sm">
      <p :role="item.ariaRole" :aria-live="item.ariaLive" aria-atomic="true">
        {{ item.message }}
      </p>

      <button
        @click="item.clear"
        aria-label="Dismiss"
        class="pl-3 pr-2 hover:text-red-300 transition-colors"
        tabindex="-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-5 h-5"
          aria-hidden="true"
        >
          <path
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          />
        </svg>
      </button>
    </div>
  </Notivue>

  <!-- NuxtLayout, NuxtPage, etc. -->
</template>
```

</details>

<br />

## Thanks

- [Ionic Team](https://ionic.io/) for the icons
- [Uktash Verna](https://github.com/n3r4zzurr0) for the animated spinner

<br />

## License

MIT
