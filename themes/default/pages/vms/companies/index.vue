<template>
  <div>
    <Breadcrumb title="Companies" :links="['companies']"></Breadcrumb>
     <asPage-companyList></asPage-companyList>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

useHead({
  titleTemplate: "%s | Companies",
});

</script>