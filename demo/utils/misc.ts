export function getRandomInt(min: number, max: number) {
   min = Math.ceil(min)
   max = Math.floor(max)
   return Math.floor(Math.random() * (max - min) + min)
}

export const isSSR = typeof window === 'undefined'

export const isDesktop =
   isSSR ||
   /(Windows NT|Mac OS X|Linux|Ubuntu|Firefox|Chrome|Safari|Trident|MSIE)/i.test(
      navigator.userAgent
   )
