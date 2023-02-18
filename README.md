# Vuenotify

Lightweight, simple and powerful toast notifications for Vue 3.

<br />

## Installation

```bash
pnpm add vuenotify
```

<br />

## Your first notification

**main.js**

```js
import { notify } from 'vuenotify'

createApp(App).use(notify).mount('#app')
```

**App.vue**

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

**Page.vue**

```vue
<script setup>
const push = useNotify()
</script>

<template>
   <button @click="push({ message: 'Something good has been pushed!' })">Push</button>
</template>
```

<br />

## Usage

### Success

```js
const success = push({ message: 'This is a success message.' })
// { type: 'success' } can be omitted as it's the default

success.clear()
```

### Error

```js
const error = push.error({ message: 'Something went wrong.' })

error.clear()
```

### Warning

```js
const info = push.warning({ message: 'This is a custom message.' })

info.clear()
```

### Info

```js
const info = push.info({ message: 'This is a custom message.' })

info.clear()
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
```

### Clear all

```js
push.clearAll()
```

<br />

# API

## \<Notify />

| Prop                | Description | Default       | Type |
| ------------------- | ----------- | ------------- | ---- |
| method              | -           | `unshift`     | -    |
| limit               | -           | 10            | -    |
| pauseOnHover        | -           | true          | -    |
| position            | -           | `top-center`  | -    |
| key                 | -           | `vue_notify`  | -    |
| transitionName      | -           | `VNRoot`      | -    |
| transitionGroupName | -           | `VNList`      | -    |
| options             | -           | [See below]() | -    |

## push()

### Options

| Prop     | Description | Default                         |
| -------- | ----------- | ------------------------------- |
| render   | -           | null                            |
| type     | -           | `success`                       |
| title    | -           | Defined in `<Notify />` options |
| message  | -           | Defined in `<Notify />` options |
| duration | -           | Defined in `<Notify />` options |
| method   | -           | Defined in `<Notify />` options |
| ariaLive | -           | Defined in `<Notify />` options |
| ariaRole | -           | Defined in `<Notify />` options |

<br />

## Edit Default Options

```vue
<!-- SuccessIcon.vue -->

<template>
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
   >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
   </svg>
</template>

<!-- Source: https://feathericons.com/?query=info -->
```

**App.vue**

```vue
<script setup>
import SuccessIcon from './SuccessIcon.vue'
</script>

<template>
   <Notify
      :options="{
         success: {
            icon: SuccessIcon, // Or false to not render an icon
            title: true, // Or false to not render or 'My Title' to enable and also assign a default title
            close: false,
            duration: 3000,
            ariaLive: 'polite',
            ariaRole: 'status'
         }
      }"
   />
</template>
```

<details><summary><strong>Default values</strong></details></summary>

<br />

## Styling

| Class                         | Block                  | Tag      |
| ----------------------------- | ---------------------- | -------- |
| `.VueNotify__container`       | Notification container | `div`    |
| `.VueNotify__icon`            | SVG Icon               | `svg`    |
| `.VueNotify__content`         | Text Container         | `div`    |
| `.VueNotify__content-title`   | Title                  | `h3`     |
| `.VueNotify__content-message` | Message                | `p`      |
| `.VueNotify__button`          | Button                 | `button` |

Each type (`success`, `error`, `promise`, `promise-resolve`, `promise-reject`, `<custom>`) can be styled using `data-vuenotify` attribute.

For example to change background and text color of the success notification:

```css
[data-vuenotify='success'] .VueNotify__container {
   background-color: green;
}

[data-vuenotify='error'] .VueNotify__content-message {
   color: white;
}
```

<br/>

## Custom Components

While Vuenotify will still take care of rendering the ARIA region and the root component which handle transitions/positioning; it exposes a simple API to render your own components in place of the default ones.

```vue
<!-- CustomNotification.vue -->

<script setup>
defineProps([
   // 👇 Vuenotify context
   'type',
   'title',
   'close',
   'message',
   // 👇 Your own props
   'avatarUrl',
   'postUrl'
])
</script>

<template>
   <div class="Container">
      <img :src="avatarUrl" />
      <p>{{ message }}</p>
      <nav>
         <a v-if="type !== 'error'" :href="postUrl">View</a>
         <button @click="close" class="Button">Dismiss</button>
      </nav>
   </div>
</template>

<style scoped>
.Container {
   width: 300px;
   display: grid;
   align-items: center;
   grid-template-columns: auto 1fr auto;
   background-color: white;
}

[data-vuenotify='success'] .Container {
   background-color: green;
}

[data-vuenotify='success'] .Container {
   background-color: red;
}
</style>
```

```js
import { markRaw } from 'vue'
import Notification from './CustomNotification.vue'
import { useUserStore } from '@/stores/useUserStore'

const push = useNotify()
const userStore = useUserStore()

push({
   // Set 'type' so that duration and aria attributes are retained.
   type: 'error',
   // Define 'title' and/or 'message', will be used to render the content of the ARIA live region.
   title: 'New Error',
   message: 'There has been a critical error.',
   // 👇 Render your own component
   render: {
      component: markRaw(Notification),
      props: ({ notifyProps }) => ({
         ...notifyProps, // 'title', 'message', 'type' and 'close'
         // Your props
         avatarUrl: userStore.avatarUrl
      })
   }
})
```

### Async

```js
import { markRaw } from 'vue'
import Notification from './CustomNotification.vue'

const push = useNotify()
const userStore = useUserStore()

const promise = push.promise({
   message: 'Publishing your post...',
   render: {
      promise: {
         component: markRaw(Notification),
         props: ({ notifyProps }) => ({
            ...notifyProps, // 'title', 'message', 'type' or 'close'
            avatarUrl: userStore.avatarUrl
         })
      }
   }
})

promise.resolve({
   message: 'Your post has been published!',
   component: markRaw(Notification), // Or add a new one
   props: ({ notifyProps, prevProps }) => ({
      ...notifyProps,
      ...prevProps, // avatarUrl
      postUrl: userStore.posts[0].url
   })
})

// Or omit 'component' to use the same of the promise with new props

promise.reject({
   message: 'There was an issue publishing your post.',
   props: ({ notifyProps, prevProps }) => ({
      ...notifyProps,
      ...prevProps,
      profileUrl: userStore.profileUrl
   })
})
```

<br />

## Additional Receivers

**main.js**

```js
import { createApp } from 'vue'
import { notify } from 'vuenotify'

const app = createApp(App).mount('#app')

app.use(notify, {
   addtionalReceivers: ['topbar', 'sidebar']
})
```

**App.vue**

```vue
<template>
   <div>
      <Notify />
      <!-- ... -->
   </div>
</template>
```

**TopBar.vue**

```vue
<template>
   <div>
      <Notify key="topbar" />
      <!-- ... -->
   </div>
</template>
```

**Sidebar.vue**

```vue
<template>
   <div>
      <Notify key="sidebar" position="relative" />
      <!-- ... -->
   </div>
</template>
```

**Page.vue**

Get the correspondent push function from `useNotify`:

```js
const push = useNotify() // Main receiver

const pushTopbar = useNotify('topbar')

const pushSidebar = useNotify('sidebar')
```
