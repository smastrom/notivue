export const exports = {
   functions: [
      'createNotivue',
      'notify',
      'push',
      'updateConfig',
      'startInstance',
      'stopInstance',

      'useNotify',
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
      'NotificationSwipe',
      'NotivueSwipe', // Alias
      'NotivueKeyboard',

      'Notification',
      'Notifications', // Alias
      'NotificationProgress',
      'NotificationsProgress', // Alias
   ],
   astro: ['NotivueAstro', 'notifyAstro', 'pushAstro', 'createNotivueAstro'],
}

const getExports = (type, omit) => exports[type].filter((name) => !omit.includes(name))

export const getFunctions = ({ omit } = { omit: [] }) => getExports('functions', omit)
export const getObjects = ({ omit } = { omit: [] }) => getExports('objects', omit)
export const getComponents = ({ omit } = { omit: [] }) => getExports('components', omit)
