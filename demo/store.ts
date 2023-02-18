import { reactive } from 'vue'
import type { Position } from '../src/types'

type Settings = {
   position: Position
   maxWidth: number
   disabled: boolean
}

export const settings = reactive<Settings>({
   position: 'top-center',
   maxWidth: 0,
   disabled: false,
})
