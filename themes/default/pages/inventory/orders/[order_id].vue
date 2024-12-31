<template>
  <div>
    <lazy-Order-Details :orderId="useRoute().params?.order_id" ></lazy-Order-Details>
  </div>
</template>
<script setup>

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: "%s | Order details",
});

</script>
