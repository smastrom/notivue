export const exports = {
   functions: [
      'createNotivue',
      'push',
      'updateConfig',
      'startInstance',
      'stopInstance',

      'usePush',
      'useNotivue',
      'useNotivueInstance',
      'useNotifications',
      'useNotivueKeyboard',
   ],
   objects: [
      'DEFAULT_CONFIG',

      'lightTheme',
      'pastelTheme',
      'materialTheme',
      'darkTheme',
      'slateTheme',

      'filledIcons',
      'outlinedIcons',
   ],
   components: [
      'Notivue',
      'NotivueSwipe',
      'NotivueKeyboard',

      'Notification',
      'Notifications', // Alias
      'NotificationProgress',
      'NotificationsProgress', // Alias
   ],
   astro: ['NotivueAstro', 'pushAstro'],
}

const getExports = (type, omit) => exports[type].filter((name) => !omit.includes(name))

export const getFunctions = ({ omit } = { omit: [] }) => getExports('functions', omit)
export const getObjects = ({ omit } = { omit: [] }) => getExports('objects', omit)
export const getComponents = ({ omit } = { omit: [] }) => getExports('components', omit)
