import { reactive } from 'vue'
import type { Position } from '../src/types'

export const store = reactive({
   position: 'topCenter' as Position,
   maxWidth: '100%',
   disabled: false,
   theme: 'light',
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

export function setDisabled() {
   store.isDisabled = !store.isDisabled
}

export function setCustomIcons() {
   store.customIcons = !store.customIcons
}
