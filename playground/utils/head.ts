const description = 'Notivue is a powerful toast notification system for Vue and Nuxt.'

export function getHead() {
   return {
      title: 'Notivue - Powerful toast notification system for Vue and Nuxt',
      link: [
         {
            rel: 'icon',
            href: '/icon.svg',
         },
      ],
      htmlAttrs: {
         lang: 'en',
      },
      meta: [
         {
            name: 'description',
            content: description,
         },
         {
            property: 'og:title',
            content: 'Notivue - ' + description,
         },
         {
            property: 'og:description',
            content: description,
         },
         {
            property: 'og:image',
            content: '/og-image.jpg',
         },
         {
            property: 'og:url',
            content: 'https://notivue.smastrom.io',
         },
         {
            name: 'twitter:title',
            content: 'Notivue - ' + description,
         },
         {
            name: 'twitter:description',
            content: description,
         },
         {
            name: 'twitter:image',
            content: '/og-image.jpg',
         },
         {
            name: 'twitter:card',
            content: 'summary_large_image',
         },
      ],
   }
}
