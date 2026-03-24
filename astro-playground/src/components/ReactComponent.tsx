import { push } from 'notivue/astro'

function pushStatic() {
   push.info({
      title: 'React Notification',
      message: 'Notification from React!',
   })
}

function pushDynamic() {
   const pending = push.promise({
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

         <button onClick={pushStatic}>Push</button>
         <button onClick={pushDynamic}>Push dynamic</button>
         <button onClick={push.clearAll}>Clear All</button>
         <button onClick={push.destroyAll}>Destroy All</button>
      </div>
   )
}
