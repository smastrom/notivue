# Notsy

Fully-fledged flexible **not**ification **sy**stem for Vue 3.

---

[Live Demo](https://notsy.netlify.app/) - [Documentation]() - [StackBlitz]()

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
_Use your own components while Notsy handles the rest_

**🎢 Slick transitions and animations**  
_Customize enter/leave animations_

**♿️ Accessible and WAI ARIA compliant**  
_Notifications are accessible to screen readers_

**🕉 Out-of-the box native RTL support**  
_No need to write custom CSS_

<br />

## Installation

```bash
pnpm add notsy
```

<br />

## Your first notification

### 1. main.js

```js
import { notsy } from 'notsy'

import 'notsy/component.css'
import 'notsy/animations.css'

createApp(App).use(notsy).mount('#app')
```

### 2. Anywhere in your app

```vue
<script setup>
import { Notsy, component, icons } from 'notsy'
</script>

<template>
   <Notsy :render="component" :icons="icons" />
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

[Live Demo](https://notsy.netlify.app/) - [Documentation]() - [StackBlitz]()

<br />

## License

MIT Licensed - Simone Mastromattei © 2023
