# Vuenotify

Lightweight, simple and powerful toast notifications for Vue 3.

[Documentation]() - [Live Demo](https://vuenotify.netlify.app/) - [StackBlitz]()

<br />

## Features

-  Ships with **everything** you need
-  Three-shakable and modular CSS (only bundle what you use)
-  Doesn't require a build step
-  4 cool themes included
-  Supports multiple receivers
-  Enable/disable notifications
-  Custom components API
-  Promise API
-  Uses Vue Transition API (customizable as per official docs)
-  ARIA compliant
-  Lightweight with no dependencies
-  Fully typed

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
import 'vuenotify/notifications.css'

const app = createApp(App).mount('#app')

app.use(notify)
```

### 2. Anywhere in your app

> :bulb: **App.vue** might be a good place for global notifications

```vue
<script setup>
import { VueNotify } from 'vuenotify'
</script>

<template>
   <div>
      <VueNotify />
      <RouterView />
   </div>
</template>
```

### 3. In any component

> :bulb: Get the push function **once** and call it how many times you want

**Composition API**

```vue
<script setup>
import { usePush } from 'vuenotify'

const push = usePush()
</script>

<template>
   <button @click="push('Something good has been pushed!')">Push</button>
</template>
```

**Options API**

```vue
<script>
import { usePush } from 'vuenotify'

export default {
   setup() {
      const push = usePush()
      return { push }
   }
}
</script>

<template>
   <button @click="push('Something good has been pushed!')">Push</button>
</template>
```

<br />

## Usage

### Success

```js
const success = push({ message: 'This is a success message.' })
// or push.success({ message: 'This is a success message.' })

success.clear()
success.destroy()
```

### Error

```js
const error = push.error({ message: 'Something went wrong.' })

error.clear()
error.destroy()
```

### Warning

```js
const warning = push.warning({ message: 'This is a custom message.' })

warning.clear()
warning.destroy()
```

### Info

```js
const info = push.info({ message: 'This is a custom message.' })

info.clear()
info.destroy()
```

### Promise

```js
try {
   const promise = push.promise({ message: 'Loading...' })
   await new Promise((resolve) => setTimeout(resolve, 1000))
   promise.resolve({ message: 'Resolved!' })
} catch (error) {
   promise.reject({ message: 'Rejected!' }) // or promise.clear() to manually clear
}

promise.clear()
promise.destroy()
```

### Clear all / Destroy all

```js
push.clearAll()
push.destroyAll()
```
