<template>
   <nav dir="ltr">
      <div class="Container">
         <SharedButtonGroup name="Position">
            <NavNotivuePosition />
         </SharedButtonGroup>

         <SharedButtonGroup name="Config">
            <NavNotivueConfig />
         </SharedButtonGroup>

         <div class="DefaultComponent">
            <SharedButtonGroup name="Push 👇" isPush>
               <NavPushBuiltIn />
            </SharedButtonGroup>

            <SharedButtonGroup name="Theme">
               <NavNotificationsThemes />
            </SharedButtonGroup>

            <SharedButtonGroup name="Features">
               <NavNotificationsCustomization />
            </SharedButtonGroup>
         </div>

         <SharedButtonGroup name="Headless 👇" isPush>
            <NavPushHeadless />
         </SharedButtonGroup>

         <SharedButtonGroup name="Actions">
            <SharedButton @click="push.clearAll()" text="Dismiss All">
               <IconsDismissIcon />
            </SharedButton>
            <SharedButton @click="push.destroyAll()" text="Destroy All">
               <IconsDestroyIcon />
            </SharedButton>
         </SharedButtonGroup>
      </div>
   </nav>
</template>

<style scoped>
nav {
   padding: 1rem 1.25rem 1.25rem 1.25rem;
   background-color: var(--nav-bg-color);
   backdrop-filter: blur(6px);
   -webkit-backdrop-filter: blur(6px);
   border-top: 1px solid var(--nav-border-color);
   display: flex;
   justify-content: center;
   width: 100%;
   z-index: 9999;
   bottom: 0;
   left: 0;
   height: 260px;
   position: fixed;
   overflow: hidden;

   & * {
      touch-action: manipulation;
   }
}

.Container {
   position: relative;
   overflow-x: auto;
   overflow-y: hidden;
   display: grid;
   grid-auto-flow: column;
   gap: 50px;
   width: 900px;
}

.DefaultComponent {
   display: grid;
   gap: 10px;
   grid-auto-flow: column;
}
</style>
