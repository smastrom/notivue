import { resolve } from 'path'

export const alias = {
   '@/support': resolve(__dirname, './cypress/support'),
   '@/tests': resolve(__dirname, './'),
   '@/core': resolve(__dirname, '../packages/notivue/core'),
   '@/Notivue': resolve(__dirname, '../packages/notivue/Notivue'),
   '@/NotivueSwipe': resolve(__dirname, '../packages/notivue/NotivueSwipe'),
   '@/Notifications': resolve(__dirname, '../packages/notivue/Notifications'),
}
