import { reactive } from 'vue'
import type { Position } from '../src/types'

type Settings = {
   position: Position
   maxWidth: string
   disabled: boolean
}

export const settings = reactive<Settings>({
   position: 'topCenter',
   maxWidth: '1280px',
   disabled: false,
})
