import { push } from 'notivue/astro'

function pushStatic() {
   const notification = push.info({
      title: 'React Notification',
      message: 'Notification from React!',
   })

   // console.log('React - Push Result', notification)
}

function pushPromise() {
   const promise = push.promise({
      title: 'Loading React Notification...',
      message: 'Loading notification from React...',
   })

   setTimeout(() => {
      promise.resolve({
         title: 'React Notification',
         message: 'Loaded notification from React!',
      })
   }, 2000)
}

export function ReactComponent() {
   return (
      <div>
         <h3>From React</h3>
         <button onClick={pushStatic}>Push</button>
         <button onClick={pushPromise}>Push Promise</button>
         <button onClick={push.clearAll}>Clear All</button>
         <button onClick={push.destroyAll}>Destroy All</button>
      </div>
   )
}
