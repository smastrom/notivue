import type { Position, ThemeNames } from 'notivue'

export const store = reactive({
   position: 'top-center' as Position,
   maxWidth: '100%',
   theme: 'lightTheme' as ThemeNames,
   renderTitles: false,
   outlinedIcons: false,
   rtl: false,
   centerOnMobile: false,
   enableSwipe: true,
})

export const messages = computed(
   () =>
      ({
         success: {
            title: getTitle(store.rtl ? 'نجاح' : 'Success'),
            message: getMsg(
               'Your message has been successfully sent to Maria.',
               'تم إرسال رسالتك بنجاح. لو سمحت.'
            ),
         },
         error: {
            title: getTitle(store.rtl ? 'خطأ' : 'Error'),
            message: getMsg(
               'An error occurred while sending your message.',
               'لقد حدث خطأ أثناء إرسال رسالتك. لو سمحت.'
            ),
         },
         warning: {
            title: getTitle(store.rtl ? 'تحذير' : 'Warning'),
            message: getMsg(
               'You have only 290 messages left on your account. Please top up.',
               'لديك 290 رسالة فقط متبقية على حسابك. يرجى شحن الرصيد.'
            ),
         },
         info: {
            title: getTitle(store.rtl ? 'معلومات' : 'Info'),
            message: getMsg(
               'Did you know you can directly send a message using the keyboard?',
               'هل تعلم أنك يمكنك إرسال رسالة باستخدام لوحة المفاتيح؟ اضغط على Enter للإرسال.'
            ),
         },
         promise: {
            title: getTitle(store.rtl ? 'وعد' : 'Promise'),
            message: getMsg(
               `We're sending your message, please wait...`,
               'نحن نرسل رسالتك. سيستغرق ذلك لحظة أو اثنتين ...'
            ),
         },
      } as const)
)

export function setFullWidth() {
   store.maxWidth = store.maxWidth === '100%' ? '900px' : '100%'
}

export function toggleRenderTitles() {
   store.renderTitles = !store.renderTitles
}

export function setTheme(themeName: ThemeNames) {
   document.documentElement.setAttribute('data-theme', themeName.replace('Theme', ''))
   store.theme = themeName
}

export function toggleOutlinedIcons() {
   store.outlinedIcons = !store.outlinedIcons
}

export function toggleRTL() {
   store.rtl = !store.rtl
   document.documentElement.setAttribute('dir', store.rtl ? 'rtl' : 'ltr')
}

export function toggleCenterOnMobile() {
   store.centerOnMobile = !store.centerOnMobile
}

export function toggleSwipe() {
   store.enableSwipe = !store.enableSwipe
}

function getTitle(title: string) {
   return store.renderTitles ? title : ''
}

function getMsg(msg: string, rtlMsg: string) {
   return store.rtl ? rtlMsg : msg
}
