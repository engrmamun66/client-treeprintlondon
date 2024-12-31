<template>    
    <div class="leap-admin-body"> 
      <Preloader v-if="preloader" id="global_preloader"></Preloader>
        <Toaster v-if="toast" animation="left"></Toaster>
        <NuxtLoadingIndicator></NuxtLoadingIndicator>
        <!-- <div class="leap-admin-main-wrapper">
            <div id="leap-admin-main-container"> -->
                <div style="min-height:100vh" @touchstart="menuMethods.toggleNavBySwif($event)" @touchend="menuMethods.toggleNavBySwif($event)">
                    <div class="leap-admin-content-wrapper">
                        <div class="leap-admin-card">
                            <div class="leap-admin-card-body">
                                <slot />
                            </div>
                        </div>
                    </div>
                </div>
            <!-- </div>
        </div> -->
        <!-- <audio ref="audio_player">
          <source type="audio/mp3">
        </audio> -->
    </div>
</template>

<script setup>
useHead({
  title: "Ionic Rental ",
  titleTemplate: '%s',
  link:[
    {rel: 'icon', type: 'image/x-icon', href:'/img/ionic-favicon.png'},
    {type:'text/css', rel:'stylesheet', href:'https://www.cdnfonts.com/br-candor.font'},
    {type:'text/css', rel:'stylesheet', href:'https://fonts.cdnfonts.com/css/br-candor'},
    {type:'text/css', rel:'stylesheet', href:'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'},
    {type:'text/css', rel:'stylesheet', href:'https://cdn.lineicons.com/1.0.1/LineIcons.min.css'},
    {type:'text/css', rel:'stylesheet', href:'https://cdn.lineicons.com/2.0/LineIcons.css'},
    {type:'text/css', rel:'stylesheet', href:'https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css'},
    {type:'text/css', rel:'stylesheet', href:'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'},
    {type:'text/css', rel:'stylesheet', href:'//cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/css/flag-icons.min.css'},
    {type:'text/css', rel: 'stylesheet', href:'/css/bootstrap.min.css'},
    {type:'text/css', rel: 'stylesheet', href:'/css/tooltip.css'},
    {type:'text/css', rel: 'stylesheet', href:'/css/admin-structure.css'},
    {type:'text/css', rel: 'stylesheet', href:'/css/transition.css'},
    {type:'text/css', rel: 'stylesheet', href:'/css/google-map.css'},
  ]
});

let preloader = ref(false)
globalThis.preloader = preloader;
 
let audio_player = ref(null)
let toast = ref(true)

onMounted(() => {
  useNuxtApp().$on('play-sound', (sound='chat') => {
    let audioNode = audio_player.value
    audioNode.volume = 0.8
    if (sound == 'pop-out') audioNode.src = '/sound/pop-out.mp3'
    if (sound == 'chat')  audioNode.src = '/sound/chat.mp3'
    audioNode?.play().catch(error => {
      console.warn("May user didn't interact with the document first");
      console.error(error);
    });
  }) 
  useNuxtApp().$on('refresh_toaster', (bool) => {
    toast.value = false;
    H.delay(()=> toast.value = true, 0)
  })


})




</script>

<style scoped>
@media screen and (max-width: 700px) {
  :global(.hide-on-sm){
    display: none !important;
  }
}
@media screen and (min-width: 701px) {
  :global(.hide-up-sm){
    display: none !important;
  }
}

</style>
