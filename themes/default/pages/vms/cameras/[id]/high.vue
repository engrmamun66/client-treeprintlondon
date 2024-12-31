<template>
    <div>
        <div class="row">
            <div class="col-md-12 col-12">
              <div class="ionic-card">
                  <div class="ionic-card-body">
                    <div class="ionic-card">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="camera-box" v-if="siteStore.siteCamerasLiveFeed.camera_een_id && hlsUrl">
                                    <!-- <VideoStream :data="siteStore.siteCamerasLiveFeed"> </VideoStream> -->
                                    <HLS :accessToken="siteStore.siteCamerasLiveFeed.access_token" :videoSrc="hlsUrl" />
                                </div>
                                <div v-else class="camera-box camera-large-box mb-4">
                                    <img src="/img/empty_img_small.jpg" class="img-fluid" alt="camera img" />
                                    <div class="camera-playicon">
                                        <i class="las la-play-circle"></i>
                                    </div>
                                    <div class="camera-bottom bottom-between">
                                        <h5 class="fs-12">{{ siteStore?.site?.cameras[0]?.name }}</h5>
                                        <div class="camera-bottom-right">
                                            <i class="bx bx-wifi wifi-icon"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                           
                        </div>
                    </div>
                  </div>
              </div>
            </div>
        </div>
  
        
  </div>
  </template>
  <script setup>
import { useSitesStore } from '~/stores/vms/sites';
  //reactive data import
  const siteStore = useSitesStore();
  definePageMeta({
    keepalive: false,
    middleware: ["auth"],
    key: (route) => route.fullPath,
  });
  useHead({
    titleTemplate: "%s | Camera details",
  });

  onMounted(async () => {
    let cameraId = useRoute().params.id;
    loadVideoStream(cameraId);
  });

 let hlsUrl = ref(null)
 let multipartUrl = ref(null)
 let previewImageUrl = ref(null)
 let isSessionAuthenticated = ref(false)
 
async function loadVideoStream(cameraId){
    await siteStore.getSiteCamerasLiveFeed(cameraId)
    const baseUrl = siteStore.siteCamerasLiveFeed.een_base_url; // Replace <baseUrl> with your actual base URL
    const deviceId =  siteStore.siteCamerasLiveFeed.camera_een_id;
    const accessToken = siteStore.siteCamerasLiveFeed.access_token; // Replace <access_token> with your actual access token

    fetchStreamUrls(baseUrl, deviceId, accessToken)
        .then(data => {
        // Process the data as needed
        data.results.forEach((feed, index) => {
            
            if (index == 0) {
                hlsUrl.value =  feed.hlsUrl ?  feed.hlsUrl : null
                multipartUrl.value = feed.multipartUrl  ?  feed.multipartUrl : null
            }
            if (index == 1) {
                previewImageUrl.value = feed.multipartUrl ?  feed.multipartUrl : null
                console.log('previewImage:', feed.multipartUrl);
            }
        });
        })
        .catch(error => {
            console.error('Error fetching stream URLs:', error);
        });
    authenticateSession(baseUrl, accessToken)
}
async function fetchStreamUrls(baseUrl, deviceId, accessToken) {
    const url = `${baseUrl}/api/v3.0/feeds?deviceId=${deviceId}&include=hlsUrl,multipartUrl`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

const authenticateSession = async (baseUrl, accessToken) => {
    const url = `${baseUrl}/api/v3.0/media/session`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        isSessionAuthenticated.value = true
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
      // Scroll to the top of the modal
  
};

  </script>
  