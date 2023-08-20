import type { Position, ThemeNames } from 'notivue'

export const storeInjectionKey = Symbol('')

const initialState = {
   position: 'top-center' as Position,
   maxWidth: '100%',
   theme: 'lightTheme' as ThemeNames,
   renderTitles: false,
   outlinedIcons: false,
   rtl: false,
   centerOnMobile: false,
   enableSwipe: true,
}

export function useStore() {
   if (isSSR) {
      return {
         state: initialState,
         actions: {},
         computed: { messages: {} },
      } as ReturnType<typeof createStore>
   }

   return inject(storeInjectionKey) as ReturnType<typeof createStore>
}

export function createStore() {
   const state = shallowReactive(initialState)

   const actions = {
      setFullWidth() {
         state.maxWidth = state.maxWidth === '100%' ? '900px' : '100%'
      },
      toggleRenderTitles() {
         state.renderTitles = !state.renderTitles
      },
      setTheme(themeName: ThemeNames) {
         document.documentElement.setAttribute('data-theme', themeName.replace('Theme', ''))
         state.theme = themeName
      },
      toggleOutlinedIcons() {
         state.outlinedIcons = !state.outlinedIcons
      },
      toggleRTL() {
         state.rtl = !state.rtl
         document.documentElement.setAttribute('dir', state.rtl ? 'rtl' : 'ltr')
      },
      toggleCenterOnMobile() {
         state.centerOnMobile = !state.centerOnMobile
      },
      toggleSwipe() {
         state.enableSwipe = !state.enableSwipe
      },
      getTitle(title: string) {
         return state.renderTitles ? title : ''
      },
      getMsg(msg: string, rtlMsg: string) {
         return state.rtl ? rtlMsg : msg
      },
   }

   const messages = computed(
      () =>
         ({
            success: {
               title: actions.getTitle(state.rtl ? 'نجاح' : 'Success'),
               message: actions.getMsg(
                  'Your message has been successfully sent to Maria.',
                  'تم إرسال رسالتك بنجاح. لو سمحت.'
               ),
            },
            error: {
               title: actions.getTitle(state.rtl ? 'خطأ' : 'Error'),
               message: actions.getMsg(
                  'An error occurred while sending your message.',
                  'لقد حدث خطأ أثناء إرسال رسالتك. لو سمحت.'
               ),
            },
            warning: {
               title: actions.getTitle(state.rtl ? 'تحذير' : 'Warning'),
               message: actions.getMsg(
                  'You have only 290 messages left on your account. Please top up.',
                  'لديك 290 رسالة فقط متبقية على حسابك. يرجى شحن الرصيد.'
               ),
            },
            info: {
               title: actions.getTitle(state.rtl ? 'معلومات' : 'Info'),
               message: actions.getMsg(
                  'Did you know you can directly send a message using the keyboard?',
                  'هل تعلم أنك يمكنك إرسال رسالة باستخدام لوحة المفاتيح؟ اضغط على Enter للإرسال.'
               ),
            },
            promise: {
               title: actions.getTitle(state.rtl ? 'إرسال...' : 'Sending...'),
               message: actions.getMsg(
                  `We're sending your message, hold on...`,
                  'نحن نرسل رسالتك. سيستغرق ذلك لحظة أو اثنتين ...'
               ),
            },
         } as const)
   )

   return {
      state,
      actions,
      computed: { messages },
   }
}
