<div align="center">

<img src="https://i.ibb.co/DKmV9Xj/cover.png" style="border-radius: 10px;" />

### Fully-featured notification system for Vue 3.

[Live Demo](https://notivue.netlify.app) - [Documentation](https://notivuedocs.netlify.app) - [StackBlitz](https://stackblitz.com/edit/vitejs-vite-kdrtrw?file=src/components/Example.vue)

</div>

<br />

## Features

**🧬 JS and CSS modular**  
_Granularly bundle only the features you need_

**🧚‍♂️ Zero deps and lightweight**  
_From ~3.5 KB (gzipped)_

**🔰 Ships with anything you need**  
_Themes, icons, animations and much more_

**💅 Theming API**  
_Create your own theme with a breeze_

**🌀 Promise API**  
_Update pending notifications with ease_

**🧩 Custom Components API**  
_Use your own components while Notivue handles the rest_

**🎢 Slick transitions and animations**  
_Customize enter/leave animations_

**♿️ Accessible and WAI ARIA compliant**  
_Accessible notifications to everyone_

**🕉 Out-of-the box native RTL support**  
_Pure CSS RTL support_

<br />

## Installation

```bash
pnpm add notivue
```

### Vite / Vue CLI

**main.js**

```js
import { notivue } from 'notivue'

import 'notivue/notifications.css'
import 'notivue/animations.css'

createApp(App).use(notivue).mount('#app')
```

### Nuxt 3

**plugins/notivue.ts**

```ts
import { notivue } from 'notivue'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(notivue)
})
```

**nuxt.config.ts**

```ts
export default defineNuxtConfig({
  css: ['notivue/notifications.css', 'notivue/animations.css']
})
```

<br />

## Usage

**App.vue**

```vue
<script setup>
import { Notivue, notifications } from 'notivue'
</script>

<template>
  <Notivue :use="notifications" />
</template>
```

**Anywhere in your app**

```vue
<script setup>
import { usePush } from 'notivue'

const push = usePush()
</script>

<template>
  <button @click="push.success('Something good has been pushed!')">Push</button>
</template>
```

<br />

## Links

[Live Demo](https://notivue.netlify.app) - [Documentation](https://notivuedocs.netlify.app) - [StackBlitz](https://stackblitz.com/edit/vitejs-vite-kdrtrw?file=src/components/Example.vue)

<br />

## Thanks

- [Ionic Team](https://ionic.io/) for the icon sets
- [Uktash Verna](https://github.com/n3r4zzurr0) for the SVG spinner

<br />

## License

MIT Licensed - Simone Mastromattei © 2023
