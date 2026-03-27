import type { ThemeNames } from 'notivue'

const initialState = {
   maxWidth: '100%',
   theme: 'lightTheme' as ThemeNames,
   renderTitles: false,
   outlinedIcons: false,
   rtl: false,
   centerOnMobile: false,
   enableSwipe: true,
   hasProgress: false,
   noDupes: false,
}

export function useStore() {
   return useNuxtApp().$store
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
      toggleProgress() {
         state.hasProgress = !state.hasProgress
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
                  'Your message has been sent to your friend Maria.',
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
                  'In the headless section, try the keyboard shortcuts (P or S) to fire sample notifications.',
                  'في قسم الواجهة المخصصة، جرّب اختصارات لوحة المفاتيح (P أو S) لعرض إشعارات تجريبية.'
               ),
            },
            dynamic: {
               title: actions.getTitle(state.rtl ? 'جاري التحديث...' : 'Updating…'),
               message: actions.getMsg(
                  'This notification will resolve to success or error in a moment.',
                  'سيتحول هذا الإشعار إلى نجاح أو خطأ خلال لحظات.'
               ),
            },
         }) as const
   )

   return {
      state,
      actions,
      messages,
   }
}
