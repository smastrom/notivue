# Vuenotify

Fully-fledged, flexible notification system for Vue 3.

---

[Live Demo](https://vuenotify.netlify.app/) - [Documentation]() - [StackBlitz]()

<br />

## Features

**🧬 100% JS and CSS modular**  
_Granularly bundle only what you use_

**🧚‍♂️ Zero deps and lightweight**  
_From 2.8 to 5 KB including styles_

**🔰 Ships with anything you need**  
_Themes, icons, animations and much more_

**💅 Theming API**  
_Create your own theme with a breeze_

**🌀 Promise API**  
_Update peding notifications with ease_

**🧩 Custom Components API**  
_Use your own components while VueNotify handles the rest_

**🎢 Slick transitions and animations**  
_Customize enter/leave animations_

**♿️ Accessible and WAI ARIA compliant**  
_Notifications are accessible to screen readers_

**🕉 Out-of-the box native RTL support**  
_No need to write custom CSS_

<br />

## Installation

```bash
pnpm add vuenotify
```

<br />

## Your first notification

### 1. main.js

```js
import { notify } from 'vuenotify'

import 'vuenotify/notification.css'
import 'vuenotify/animations.css'

createApp(App).use(notify).mount('#app')
```

### 2. Anywhere in your app

```vue
<script setup>
import { VueNotify, notification, icons } from 'vuenotify'
</script>

<template>
   <VueNotify :component="notification" :icons="icons" />
</template>
```

### 3. Anywhere in your app

```vue
<template>
   <button @click="$push('Something good has been pushed!')">Push</button>
</template>
```

<br />

## Links

[Live Demo](https://vuenotify.netlify.app/) - [Documentation]() - [StackBlitz]()

<br />

## License

MIT Licensed - Simone Mastromattei © 2023
