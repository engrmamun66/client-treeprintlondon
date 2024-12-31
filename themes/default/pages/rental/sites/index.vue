<template>
    <div>
      <Breadcrumb title="Sites" :links="['sites']"></Breadcrumb>
      <asPage-siteList :inVms="false" ></asPage-siteList>
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
  