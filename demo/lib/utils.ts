export function getRandomInt(min: number, max: number) {
   min = Math.ceil(min)
   max = Math.floor(max)
   return Math.floor(Math.random() * (max - min) + min)
}

export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
