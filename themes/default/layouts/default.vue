<template>
  <div class="frontend">
    <Toaster></Toaster>
    <Navbar></Navbar>
    <div class="all-page-contents">
      <slot></slot>
    </div>
  </div>
   
</template>

<script setup> 

useHead({
  title: "Ionic Rental",
  titleTemplate: "%s",
  script: [
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
    { type: "text/css", rel: "stylesheet", href: "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" }, 
    { type: "text/css", rel: "stylesheet", href: "https://unpkg.com/ionicons@4.5.10-0/dist/css/ionicons.min.css" }, 
    { type: "text/css", rel: "stylesheet", href: "/css/fontend/module.fontend.css" },  
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


});


</script>


<style>
.all-page-contents{
  margin-top: 70px;
}

@media screen and (max-width: 767px) {
  .all-page-contents{
    margin-bottom: 75px;
  }
}
</style>
 