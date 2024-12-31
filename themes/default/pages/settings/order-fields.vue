<script setup>
import { useChargeStore } from '~/stores/rentmy/settings/Charge';
const chargeStore = useChargeStore();

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: "%s | Order fields",
});

let isMounted = ref(false);

async function asMounted(){
  
}

onMounted(async() => {  
  await asMounted();  
   
  isMounted.value = true;
})


</script>

<template>
  <div>
    <Breadcrumb title="Order Fields" :links="['settings', 'settings_order_fields']" ></Breadcrumb>

    <settings-OrderFields ></settings-OrderFields> 
    
  </div>    
</template>