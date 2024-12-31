<script setup>
definePageMeta({
    keepalive: false,
    middleware: ["auth"],
    key: (route) => route.fullPath,
});
useHead({
    titleTemplate: '%s | Dashboard',
}); 
</script>

<template>
    <div>
        <Breadcrumb title="Dashboard" :links="['dashboard']"></Breadcrumb>
    </div>

</template>