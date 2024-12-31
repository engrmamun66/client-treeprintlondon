<template>
    <div>
      <div class="row">
          <!-- <div class="col-md-12 col-12 sitecamera-map-column"> -->
          <div class="col-md-12 col-12">
              <div class="ionic-card">
                  <div class="ionic-card-body">
                      <div class="invoice-map pt-0">
                         
                          <GoogleMap-PickLatLong v-if="siteStore?.site?.latitude && siteStore?.site?.longitude"
                          :lat="siteStore.site.latitude ? Number(siteStore.site.latitude) : null"
                          :lng="siteStore.site.longitude ? Number(siteStore.site.longitude) : null"
                          :isUpdateMode=true
                              @pick-latlong="
                              (latLog) => {
                                  siteStore.site.latitude = latLog.lat.toString();
                                  siteStore.site.longitude = latLog.lng.toString();
                              }
                              "
                              @pick-address="(addr) => (siteStore.site.address = addr)"
                              height="480px"
                          />
                          <div class="invoice-mapmore-menu">
                              <a href="#"><i class="las la-ellipsis-v"></i></a>
                              <div class="invoice-mapmore-menubody">
  
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <!-- <div class="col-md-7 sitecamera-chart-column">
              <div class="ionic-card">
                  <div class="ionic-card-header pt-3">
                      <div class="ionic-card-rightside">
                          <div class="ionic-tab">
                              <ul class="ionic-tab">
                                  <li>
                                      <a class="tab-active">Human Detection</a>
                                  </li>
                                  <li class="tab-devided"></li>
                                  <li>
                                      <a class="">Site hours</a>
                                  </li>
                              </ul>
                          </div>
                      </div>
                      <div class="card-header-rightside">
                          <div class="time-period">
                              <span>Time Peroid</span>
                              <div class="time-date fs-22">2024/06/23</div>
                              <a href="#" class="time-period-dateicon"><i class="bx bx-calendar"></i></a>
                          </div>
                      </div>
  
                  </div>
                  <div class="ionic-card-body">
                      <div class="site-specifiq-chart">
                          <h3>Chart</h3>
                      </div>
                  </div>
              </div>
          </div> -->
      </div>
  
      <div class="ionic-card">
          <div class="ionic-card-header">
            <div class="d-flex justify-content-between"> 
                <h6 class="fs-22 me-3">Site : {{ siteStore?.site?.title }} </h6>
                <h6 class="fs-22">Camera : {{ selectedCameraDetails?.name }} </h6>
            </div>
              <div class="card-header-rightside">
                  <div class="random-math">
                      <div class="random-math-text-math">
                          <span>Total Camera:</span>
                          <h3 class="fs-22">{{ siteStore?.site?.cameras.length }}</h3>
                      </div>
                  </div>
              </div>
          </div>
          <div class="ionic-card-body" v-if="siteStore?.site?.cameras.length">
              <div class="row">
                  <div class="col-md-12">
                  <div class="camera-box mb-4" v-if="siteStore.siteCamerasLiveFeed.camera_een_id && siteStore.siteCamerasLiveFeed.access_token">
                     <ClientOnly>
                            <VideoStream :data="siteStore.siteCamerasLiveFeed"/>
                    </ClientOnly>
                  </div>
                      <div v-else class="camera-box camera-large-box mb-4">
                          <img src="/img/camera.png" class="img-fluid" alt="camera img" />
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
              <div class="row mt-3">
                  <template v-for="(camera, index) in siteStore?.site?.cameras" :key="index">
                      <div class="col-md-2" @click="loadVideoStream(camera); selectedCamera = camera.id">
                          <div class="camera-box cp" :class="selectedCamera == camera.id ? 'camera-box-active' : ''">
                              <img  :src="camera.preview_url ? camera.preview_url : '/img/camera.png'" class="img-fluid" alt="camera img" />
                              <div class="camera-playicon">
                                  <i class="las la-play-circle"></i>
                              </div>
                              <div class="camera-bottom bottom-between">
                                  <h5 class="fs-12">{{ camera?.name }}</h5>
                                  <div class="camera-bottom-right">
                                      <i class='bx bx-error error-icon'></i>
                                      <i class="bx bx-wifi wifi-icon"></i>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </template>
              </div>
          </div>
          <div class="ionic-card-body text-center" v-else>
              <h6>No cameras found</h6>
          </div>
          
         
          
              
        
  
          
      </div>
  </div>
  </template>
  <script setup>
  import { useSitesStore } from '~/stores/vms/sites';
  //reactive data import
  const siteStore = useSitesStore();
  let selectedCamera = ref(null)
  let selectedCameraDetails = ref(null)
  onMounted(async () => {
    let siteId = useRoute().params.id;
    await siteStore.getSite(siteId);
      loadVideoStream(siteStore?.site?.cameras[0]);
      selectedCamera.value = siteStore?.site?.cameras[0].id
      selectedCameraDetails.value = siteStore?.site?.cameras[0]
  });
  
  async function loadVideoStream(camera){
    selectedCameraDetails.value = camera
      await siteStore.getSiteCamerasLiveFeed(camera.id)
  }
  
  definePageMeta({
    keepalive: false,
    middleware: ["auth"],
    key: (route) => route.fullPath,
  });
  useHead({
    titleTemplate: "%s | Site's cameras",
  });
  </script>
  