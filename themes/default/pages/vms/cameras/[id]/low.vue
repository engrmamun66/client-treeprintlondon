<template>
    <div>
      <div class="camera-box" v-if="siteStore.siteCamerasLiveFeed.camera_een_id">
        <ClientOnly>
          <VideoStream :data="siteStore.siteCamerasLiveFeed"> </VideoStream>
        </ClientOnly>
    </div>
  </div>
  </template>
  
  <script setup>
  // import LivePlayer from '@een/live-video-web-sdk'
  import { useSitesStore } from '~/stores/vms/sites';
  const siteStore = useSitesStore();

  definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

  onMounted(async () => {
    let cameraId = useRoute().params.id;
    await siteStore.getSiteCamerasLiveFeed(cameraId);
    const baseUrl = siteStore.siteCamerasLiveFeed.een_base_url;
    const deviceId = siteStore.siteCamerasLiveFeed.camera_een_id;
    const accessToken = siteStore.siteCamerasLiveFeed.access_token;
  });
  </script>
  