<template>
  <div class="frontend">
    <Toaster></Toaster>
    <slot></slot>
  </div>
   
</template>

<script setup> 


useHead({
  title: "Ionic Rental",
  titleTemplate: "%s",
  script: [
    {
        id: 'google_map_script',
        src: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_APIKEY}&libraries=places,drawing,marker&v=weekly`,
    },
    {
      src: "/redactor/redactor.js",
    },    
    {
      children: `
      
        // Change Theme Color
        var defaultTheme = 'dark'
     
       
        function changeTheme(event=null){
          const htmlElement = globalThis.document.documentElement;
          let theme = localStorage.getItem('theme') || defaultTheme;
          if(event){     
              theme = (theme == 'dark') ? 'light' : 'dark';
          }
          htmlElement.setAttribute('theme', theme);
          localStorage.setItem('theme', theme);           
        }

        function stopPreloader(delay=500){
          setTimeout(()=>{
            if(globalThis.preloader){
              globalThis.preloader.value = false;
            }
          }, delay)
        }

        changeTheme(null);          
        
        document.addEventListener("DOMContentLoaded", (event) => {
          console.log("DOM fully loaded and parsed");
          // stop preloader
          stopPreloader(5000);
          stopPreloader(2000); 

          let button = document.querySelector('#switch_theme');
          if(button){
          button.removeEventListener('click', changeTheme);
          button.addEventListener('click', changeTheme)
          }
        })
    `,
    },
  ],
  link: [
    { rel: "icon", type: "image/x-icon", href: "/img/ionic-favicon.png" },
    { type: "text/css", rel: "stylesheet", href: "/css/fonts.css" },
    { type: "text/css", rel: "stylesheet", href: "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" },
    { type: "text/css", rel: "stylesheet", href: "/css/bootstrap.min.css" },
    { type: "text/css", rel: "stylesheet", href: "/css/tooltip.css" },
    { type: "text/css", rel: "stylesheet", href: "/css/frontend.css" },  
    { type: "text/css", rel: "stylesheet", href: "/redactor/redactor.min.css" },
  ],
});

let preloader = ref(true);
globalThis.preloader = preloader;

provide("preloader", preloader);
useNuxtApp().$on("global_loader", (bool) => {
  preloader.value = bool;
});

let audio_player = ref(null);
onMounted(() => {
  H.delay(()=> preloader.value = false, 1000 * 8)

  useNuxtApp().$on("play-sound", (sound = "chat") => {
    let audioNode = audio_player.value;
    audioNode.volume = 0.8;
    if (sound == "pop-out") audioNode.src = "/sound/pop-out.mp3";
    if (sound == "chat") audioNode.src = "/sound/chat.mp3";
    audioNode?.play().catch((error) => {
      console.warn("May user didn't interact with the document first");
      console.error(error);
    });
  });

  useNuxtApp().$on('refresh_toaster', (bool) => {
    toast.value = false;
    H.delay(()=> toast.value = true, 0)
  })


});
</script>

<style scoped>
@media screen and (max-width: 700px) {
  :global(.hide-on-sm) {
    display: none !important;
  }
}
@media screen and (min-width: 701px) {
  :global(.hide-up-sm) {
    display: none !important;
  }
}
</style>
