import { reactive } from 'vue'
import type { Position, Themes } from '../src/types'

export const store = reactive({
   position: 'top-center' as Position,
   maxWidth: '100%',
   theme: 'light' as Themes,
   pauseOnHover: true,
   renderTitles: true,
   isDisabled: false,
   customIcons: false,
})

export function setPosition(position: Position) {
   store.position = position
}

export function setFullWidth() {
   store.maxWidth = store.maxWidth === '100%' ? '1280px' : '100%'
}

export function setPauseOnHover() {
   store.pauseOnHover = !store.pauseOnHover
}

export function setRenderTiles() {
   store.renderTitles = !store.renderTitles
}

export function setCustomIcons() {
   store.customIcons = !store.customIcons
}

export function setTheme(theme: Themes) {
   store.theme = theme
   document.documentElement.setAttribute('data-theme', theme)
}
