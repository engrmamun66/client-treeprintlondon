<template>
  <div>
    <Breadcrumb title="Sites" :links="['companies']"></Breadcrumb>
    <asPage-siteList></asPage-siteList>
  </div>
</template>

<script setup>
 
 definePageMeta({
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

useHead({
  titleTemplate: "%s | Sites",
});

 
</script>
