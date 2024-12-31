<script setup>

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

useHead({
  title: "My App",
  titleTemplate: `%s | Product Details`,
});
 

</script>


<template>
  <div>
    <Breadcrumb title="Product Details" :links="['products', 'productDetails']"></Breadcrumb>
    <Product-Details :productId="useRoute().params?.product_id" ></Product-Details>   
  </div>
</template>

