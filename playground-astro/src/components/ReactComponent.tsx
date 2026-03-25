import { notify } from 'notivue/astro'

function notifyStatic() {
   notify.info({
      title: 'React Notification',
      message: 'Notification from React!',
   })
}

function notifyDynamic() {
   const pending = notify.promise({
      title: 'Updating…',
      message: 'This dynamic notification is still updating.',
   })

   setTimeout(() => {
      pending.resolve({
         title: 'React notification',
         message: 'Update finished — notification from React.',
      })
   }, 2000)
}

export function ReactComponent() {
   return (
      <div>
         <h3>From React</h3>

         <button onClick={notifyStatic}>Push</button>
         <button onClick={notifyDynamic}>Push dynamic</button>
         <button onClick={notify.clearAll}>Clear All</button>
         <button onClick={notify.destroyAll}>Destroy All</button>
      </div>
   )
}
