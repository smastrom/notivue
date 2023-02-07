# Vuenotify

Powerful and simple toast notifications for Vue 3.

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

const app = createApp(App).mount('#app')

app.use(notify)
```

**App.vue**

```vue
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
const error = push({ type: 'error', message: 'Something went wrong.' })

error.clear()
```

### Custom

```js
const info = push({ type: 'info', message: 'This is a custom message.' })

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

<br />

# API

## \<Notify />

| Prop           | Description | Default          | Type |
| -------------- | ----------- | ---------------- | ---- |
| method         | -           | `unshift`        | -    |
| limit          | -           | 10               | -    |
| pauseOnHover   | -           | true             | -    |
| placement      | -           | `top-center`     | -    |
| position       | -           | `fixed`          | -    |
| key            | -           | `vue_notify`     | -    |
| customClass    | -           | `<empty-string>` | -    |
| noDefaultClass | -           | false            | -    |
| transitionName | -           | `VueNotify`      | -    |
| options        | -           | [See below]()    | -    |

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

## Custom Styles

Add a custom class at your convenience:

```jsx
<Notify customClass="MyClass" />
```

And the following will be added to each notification block:

| customClass                 | Block                  | Tag      |
| --------------------------- | ---------------------- | -------- |
| `.MyClass__container`       | Notification container | `div`    |
| `.MyClass__icon`            | SVG Icon               | `svg`    |
| `.MyClass__content`         | Text Container         | `div`    |
| `.MyClass__content-title`   | Title                  | `h3`     |
| `.MyClass__content-message` | Message                | `p`      |
| `.MyClass__button`          | Button                 | `button` |

Each type (`success`, `error`, `promise`, `promise-resolve`, `promise-reject`, `<custom>`) can be styled using `data-vuenotify` attribute.

For example to change background and text color of the success notification:

```css
[data-vuenotify='success'] .MyClass__container {
  background-color: green;
}

[data-vuenotify='error'] .MyClass__content-message {
  color: white;
}
```

Custom classes are added **after** the default ones so you don't have to
re-work everything nor use `!important`.

However, you might want to style the blocks from scratch hence to remove default classes. You can do so by:

```html
<Notify :noDefaultClass="true" />
```

<br />

## Custom Notifications

Add an option with defaults:

```jsx
<Notify
  :options="{
    suggestion: {
      icon: BulbIcon,
      title: 'Did you know?'
      close: true,
      duration: 5000,
      ariaLive: 'assertive'
    }
  }"
/>
```

Edit styles using `data-vuenotify` attribute:

```css
[data-vuenotify='suggestion'] .MyClass__container {
  background-color: yellow;
}
```

Then start pushing the notification:

```js
push({
  type: 'suggestion'
  message: '...that you can press SPACE to scroll down?',
})
```

<br />

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

## Transitions

Vuenotify uses Vue Transitions internally, by defining a transition name in `transitionName` prop:

```jsx
<Notify transitionName="MyTransition" />
```

You'll be able to rewrite the transitions as usual:

```css
.MyTransition-move,
.MyTransition-enter-active,
.MyTransition-leave-active {
  /* styles... */
}

.MyTransition-enter-from,
.MyTransition-leave-to {
  /* styles... */
}
```

<details><summary><strong>Default transitions</strong></summary></details>

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
