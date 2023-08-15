const description = 'Notivue is a fully-featured toast notification system for Vue and Nuxt.'

export function getHead() {
   return {
      title: 'Notivue - Fully-featured toast notification system for Vue and Nuxt',
      link: [
         {
            rel: 'icon',
            href: '/icon.svg',
         },
      ],
      meta: [
         { lang: 'en' },
         {
            hid: 'description',
            name: 'description',
            content: description,
         },
         {
            hid: 'og:title',
            property: 'og:title',
            content: 'Notivue - ' + description,
         },
         {
            hid: 'og:description',
            property: 'og:description',
            content: description,
         },
         {
            hid: 'og:image',
            property: 'og:image',
            content: '/og-image.jpg',
         },
         {
            hid: 'og:url',
            property: 'og:url',
            content: 'https://notivue.pages.dev',
         },
         {
            hid: 'twitter:title',
            name: 'twitter:title',
            content: 'Notivue - ' + description,
         },
         {
            hid: 'twitter:description',
            name: 'twitter:description',
            content: description,
         },

         {
            hid: 'twitter:image',
            name: 'twitter:image',
            content: '/og-image.jpg',
         },
         {
            hid: 'twitter:card',
            name: 'twitter:card',
            content: 'summary_large_image',
         },
      ],
   }
}
