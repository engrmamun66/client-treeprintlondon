<template>
  <div>
    <Breadcrumb title="Camera Wall Gallery" :links="['companies', 'companyCamWallGallery']"></Breadcrumb>
    <div class="row">
        <div class="col-md-4">
            <div class="ionic-card ionic-card-textnumber">
                <div class="ionic-card-body">
                    <span>Total Camera Online</span>
                    <h3>{{ galleryStore.cameraStatus?.company?.total_online_camera }}</h3>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="ionic-card ionic-card-textnumber">
                <div class="ionic-card-body">
                    <span>Total Camera Offline</span>
                    <h3>{{ galleryStore.cameraStatus?.company?.total_offline_camera }}</h3>
                </div>
            </div>
        </div>
        <!-- <div class="col-md-3">
            <div class="ionic-card ionic-card-textnumber">
                <div class="ionic-card-body">
                    <span>Total Alert</span>
                    <h3>0</h3>
                </div>
            </div>
        </div> -->
        <div class="col-md-4">
            <div class="ionic-card ionic-card-textnumber">
                <div class="ionic-card-body">
                    <span>Total Sites</span>
                    <h3>{{ galleryStore.cameraStatus?.company?.total_sites }}</h3>
                </div>
            </div>
        </div>
    </div>
    <template v-if="companyStore.mergedArray?.length">
      <section
        v-for="(site, index) in companyStore.mergedArray"
        :key="index"
      >
        <div class="ionic-card">
          <div class="ionic-card-header">
            <a class="cp" @click="goToSiteCamerasPage(site)">
            <h4 class="fs-22">
              {{ site.title }} <img src="/img/siteicon.png" width="15px" height="15px" class="img-fluid" />
            </h4>
          </a>
            <!-- <div class="card-header-rightside">
            <div class="random-math">
              <div class="random-math-text-math">
                <span>Random Math</span>
                <h3 class="fs-22">4+3 =</h3>
              </div>
              <div class="random-math-field">
                <input type="text" class="form-control" />
                <button
                  type="button"
                  class="ionic-btn ionic-theme-btn2 ionic-btnlg"
                >
                  Submit
                </button>
              </div>
            </div>
          </div> -->
          </div>

          <!-- <div v-for="(index) in galleryStore.list.sites">
                  <div v-for="(indexs) in index.cameras">
                            {{ indexs.name }}
                  </div>
                </div> -->

          <div class="ionic-card-body">
            <div class="row">
              <div class="col-md-8">
                  <div class="row">
                    <div
                      v-for="(camera, cameraIndex) in site.cameras.filter(camera => camera.status === 1).slice(0, 4)"
                      :key="cameraIndex"
                      class="col-md-3"
                    >
                      <template v-if="siteStore.cameraWithPreviewImage[camera?.id]"> 
                        <div class="camera-box" @click.stop="navigateTo(`/vms/cameras/${camera?.id}/timeline`)" @mouseenter="isHovered = true; hoveredCamera = camera"
                             @mouseleave="isHovered = false; hoveredCamera = null">
                            <img 
                              :src="siteStore.cameraWithPreviewImage[camera.id]"
                              class="img-fluid" alt="camera img" />
                            <!-- <div v-if="isHovered && hoveredCamera?.id == camera?.id && !streamLoader"> 
                                <div v-if="camera?.__liveSnapShot && selectedCamera?.id == camera?.id" @click.stop="stopGettingLiveSnap(); camera.__liveSnapShot = null" class="camera-playicon">
                                  <i class="las la-pause-circle cp"></i>
                                </div>
                                <div v-else class="camera-playicon" @click.stop="getLiveSnap(camera)">
                                  <i class="las la-play-circle cp"></i>
                                </div>
                            </div>
                            <div v-if="selectedCamera?.id == camera?.id  && streamLoader" class="camera-playicon"> 
                              <btn-loader size="sm" :show="streamLoader" color="green"></btn-loader>
                            </div> -->
                          <div class="camera-bottom bottom-between">
                            <h5 class="fs-12">{{ camera?.name }} {{ camera?.is_fav }}</h5>
                            <div class="camera-bottom-right d-flex">
                                  <i @click.stop="async()=>{await siteStore.cameraMakeAsFavourite(site?.id, camera?.id);mergedTwoArray(true)}"
                                      class='las la-star' :class="camera?.is_fav  ? 'is_favourite': ''"></i>
                                  <!-- <i @click.stop="
                                  withDelete.camera = camera;
                                  withDelete.showConfirmation = true;" class='las la-trash'></i> -->
                                  <!-- <i v-if="camera?.__liveSnapShot && selectedCamera?.id == camera?.id" @click.stop="stopGettingLiveSnap(); camera.__liveSnapShot = null" class='las la-pause-circle'></i> -->
                                  <i  class="bx bx-wifi wifi-icon" :class="siteStore.cameraWithOfflineOnlineStatus.includes(camera?.id) ? 'is_online': 'is_offline'"></i>
                                  <signalBar v-if="showSignalBars" :signal="camera?.cellular_signals?.rssi" size="14px" color="limegreen" class="mx-1 mt-1" ></signalBar>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-else> 
                        <ShimmerEffect bg="dark" width="150px" height="150px" class="mb-3" radius="2px" ></ShimmerEffect>    
                      </template>
                    </div>
                    <div class="d-flex justify-content-end"> 
                        <div @click="navigateTo(`/vms/sites/${site.id}/cameras`)" v-if="site.cameras.length > 4" class="checkoutbox-btn-column text-center mx-2 d-flex justify-content-between">
                            <button  class="ionic-btn ionic-theme-btn2">See more cameras  <i class="las la-arrow-right ms-1"></i></button>
                        </div>
                      </div>
                  </div>
                <!-- <div class="row">
          <div class="col-md-12">
            <button
              type="button"
              class="ionic-btn ionic-border-btn ionic-btnlg ionic-btn-block ms-0 mt-4"
            >
              Load More
              <i class="las la-long-arrow-alt-right ms-3 fs-25"></i>
            </button>
          </div>
        </div> -->
              </div>
              <div class="col-md-4">
                <div class="row">
                  <div class="col-md-6">
                    <div
                      class="ionic-card onlineoffline-card ionic-card-textnumber"
                    >
                      <div class="ionic-card-body">
                        <span>Camera Online</span>
                        <h3>{{ site.total_online_camera || 0 }}</h3>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div
                      class="ionic-card onlineoffline-card ionic-card-textnumber"
                    >
                      <div class="ionic-card-body">
                        <span>Camera Offline</span>
                        <h3>{{ site.total_offline_camera || 0 }}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- <div class="ionic-card alert-card ionic-card-textnumber">
          <div class="ionic-card-body">
            <div class="alert-leftside">
              <div class="camera-erroricon">
                <i class="bx bx-error"></i>
              </div>
              <span>Alert</span>
            </div>
            <h3>9</h3>
          </div>
        </div> -->
              </div>
            </div>

          </div>
        </div>
      </section>
    </template>
    <template v-else> 
      <section
      v-for="(site, index) in  galleryStore?.list?.sites"
      :key="index"
    >
      <div class="ionic-card">
        <div class="ionic-card-header">
          <a class="cp" @click="goToSiteCamerasPage(site)">
          <h4 class="fs-22">
            {{ site?.title }} <img src="/img/siteicon.png" width="15px" height="15px" class="img-fluid" />
          </h4>
        </a>
          <!-- <div class="card-header-rightside">
          <div class="random-math">
            <div class="random-math-text-math">
              <span>Random Math</span>
              <h3 class="fs-22">4+3 =</h3>
            </div>
            <div class="random-math-field">
              <input type="text" class="form-control" />
              <button
                type="button"
                class="ionic-btn ionic-theme-btn2 ionic-btnlg"
              >
                Submit
              </button>
            </div>
          </div>
        </div> -->
        </div>

        <!-- <div v-for="(index) in galleryStore.list.sites">
                <div v-for="(indexs) in index.cameras">
                          {{ indexs.name }}
                </div>
              </div> -->

        <div class="ionic-card-body">
          <div class="row">
            <div class="col-md-8">
                <div class="row">
                  <div
                    v-for="(camera, cameraIndex) in site.cameras.filter(camera => camera.status === 1).slice(0, 4)"
                    :key="cameraIndex"
                    class="col-md-3"
                  >
                    <template v-if="siteStore.cameraWithPreviewImage[camera.id]"> 
                      <div class="camera-box" @click.stop="navigateTo(`/vms/cameras/${camera?.id}/timeline`)" @mouseenter="isHovered = true; hoveredCamera = camera" @mouseleave="isHovered = false; hoveredCamera = null">
                          <img  :src="siteStore.cameraWithPreviewImage[camera.id]" class="img-fluid" alt="camera img" />
                          <!-- <div v-if="isHovered && hoveredCamera?.id == camera?.id && !streamLoader"> 
                              <div v-if="camera?.__liveSnapShot && selectedCamera?.id == camera?.id" @click.stop="stopGettingLiveSnap(); camera.__liveSnapShot = null" class="camera-playicon">
                                <i class="las la-pause-circle cp"></i>
                              </div>
                              <div v-else class="camera-playicon" @click.stop="getLiveSnap(camera)">
                                <i class="las la-play-circle cp"></i>
                              </div>
                          </div>
                          <div v-if="selectedCamera?.id == camera?.id  && streamLoader" class="camera-playicon"> 
                            <btn-loader size="sm" :show="streamLoader" color="green"></btn-loader>
                          </div> -->
                        <div class="camera-bottom bottom-between">
                          <h5 class="fs-12">{{ camera?.name }} {{ camera?.is_fav }}</h5>
                          <div class="camera-bottom-right d-flex">
                                <i @click.stop="async()=>{await siteStore.cameraMakeAsFavourite(site?.id, camera?.id);mergedTwoArray(true)}"
                                    class='las la-star' :class="camera?.is_fav  ? 'is_favourite': ''"></i>
                                <!-- <i @click.stop="
                                withDelete.camera = camera;
                                withDelete.showConfirmation = true;" class='las la-trash'></i> -->
                                <!-- <i v-if="camera?.__liveSnapShot && selectedCamera?.id == camera?.id" @click.stop="stopGettingLiveSnap(); camera.__liveSnapShot = null" class='las la-pause-circle'></i> -->
                                <i  class="bx bx-wifi wifi-icon" :class="siteStore.cameraWithOfflineOnlineStatus.includes(camera?.id) ? 'is_online': 'is_offline'"></i>
                                <signalBar v-if="showSignalBars" :signal="camera?.cellular_signals?.rssi" size="14px" color="limegreen" class="mx-1 mt-1" ></signalBar>
                          </div>
                        </div>
                      </div>
                    </template>
                    <template v-else> 
                      <ShimmerEffect bg="dark" width="150px" height="150px" class="mb-3" radius="2px" ></ShimmerEffect> 
                    </template>
                  </div>
                  <div class="d-flex justify-content-end"> 
                      <div @click="navigateTo(`/vms/sites/${site.id}/cameras`)" v-if="site.cameras.length > 4" class="checkoutbox-btn-column text-center mx-2 d-flex justify-content-between">
                          <button  class="ionic-btn ionic-theme-btn2">See more cameras  <i class="las la-arrow-right ms-1"></i></button>
                      </div>
                    </div>
                </div>
              <!-- <div class="row">
        <div class="col-md-12">
          <button
            type="button"
            class="ionic-btn ionic-border-btn ionic-btnlg ionic-btn-block ms-0 mt-4"
          >
            Load More
            <i class="las la-long-arrow-alt-right ms-3 fs-25"></i>
          </button>
        </div>
      </div> -->
            </div>
            <div class="col-md-4">
              <div class="row">
                <div class="col-md-6">
                  <div
                    class="ionic-card onlineoffline-card ionic-card-textnumber"
                  >
                    <div class="ionic-card-body">
                      <span>Camera Online</span>
                      <h3>{{ site.total_online_camera || 0 }}</h3>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div
                    class="ionic-card onlineoffline-card ionic-card-textnumber"
                  >
                    <div class="ionic-card-body">
                      <span>Camera Offline</span>
                      <h3>{{ site.total_offline_camera || 0 }}</h3>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="ionic-card alert-card ionic-card-textnumber">
        <div class="ionic-card-body">
          <div class="alert-leftside">
            <div class="camera-erroricon">
              <i class="bx bx-error"></i>
            </div>
            <span>Alert</span>
          </div>
          <h3>9</h3>
        </div>
      </div> -->
            </div>
          </div>

        </div>
      </div>
      </section>
    </template>
   
    <Modal-Confirm v-if="withDelete.showConfirmation" v-model="withDelete.showConfirmation" :skipAutoClose="true"
            @yes="async () => {
                await companyStore.deleteCamera(withDelete.camera.id);
                withDelete.showConfirmation = false;
            }
            ">
            Are you sure want to delete?
            <template #btn-yes>
                <BtnLoader :show="H.isPendingAnyApi('Company:deleteCamera')" />
            </template>
        </Modal-Confirm>
</div>
</template>

<script setup>
import { useGalleryStore } from '~/stores/vms/gallery';
import { useCompaniesStore } from "~/stores/vms/company";
import { useSitesStore } from '~/stores/vms/sites';
import { useCommonStore } from  "~/stores/Common";
import { useCameraStore } from "~/stores/vms/camera";
import { cancelAllRequests } from '~/utils/requestManager';
const commonStore  = useCommonStore();
const galleryStore = useGalleryStore();
const companyStore = useCompaniesStore();
const cameraStore = useCameraStore()
const siteStore = useSitesStore();
let withDelete = reactive({
    camera: null,
    showConfirmation: false,
});
let selectedCamera = ref(null)
let intervalId = null
let isHovered = ref(false)
let streamLoader = ref(false)
let hoveredCamera = ref(null)
let isFirstInterval = ref(false)
let showSignalBars = ref(true)
let intervalIdForOnlineCameras = ref(null)
definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});


onMounted(async () => {
  console.log("hlllllwww")
  commonStore.preloader = true
  cameraStore.allowApi = true
    await galleryStore.getGallery(useRoute().params.id);
    await galleryStore.getCameraStatus(useRoute().params.id);
    commonStore.preloader = false
    if( galleryStore.camera_ids.length>0){
      await siteStore.getCameraPreviewImage({camera_ids: galleryStore.camera_ids})
      await siteStore.getCameraOfflineOnlineStatus({ camera_ids: galleryStore.camera_ids })
      // Create a map of id to objects from the first array
      setTimeout(async ()=>{
        await mergedTwoArray(false)

        // Getting signals
        for (const site of companyStore.mergedArray || []) {
          try {
            let cameras = site.cameras;
            if(cameras?.length){
              let ids = cameras.map(c => c.id).join(',');
              const signals = await siteStore.getSiteCamerasSignals(ids);
              if(signals?.length){
                signals.forEach(item => {
                  let { camera, cellular_signals } = item;
                  site.cameras.forEach(cam => {
                    if(cam.id == camera.id){
                      cam.cellular_signals = cellular_signals;
                    }
                  })
                })
              }
              // log({signals});

            }
          } catch (error) {
            
          }
        }

        showSignalBars.value = false;
        H.delay(()=>{
          showSignalBars.value = true;
        })

      }, 100)
    }
    if(siteStore?.cameraWithOfflineOnlineStatus.length){
        loadVideoStreamForOnlineCameras()
    }
      // Access the current route
    const route = useRoute();
    // Regular expression to match the pattern
    const cameraWallGalleryPattern = /^\/vms\/companies\/\d+\/camera-wall\/gallery$/;
    const cameraWallListPattern = /^\/vms\/companies\/\d+\/camera-wall\/list$/;


    if(cameraWallGalleryPattern.test(route.fullPath)){
      companyStore.isCameraWallGalleryPattern = true
    }
    if(cameraWallListPattern.test(route.fullPath)){
      companyStore.isCameraWallListPattern = true
    }
   

});

useNuxtApp().$on("mountCompanyWithCamerasPage", () => {
  clearInterval(intervalId)
  clearInterval(intervalIdForOnlineCameras.value)
  intervalIdForOnlineCameras.value = null;
  cameraStore.allowApi = false
  siteStore.cameraWithOfflineOnlineStatus = []
  companyStore.mergedArray = []
  cancelAllRequests(); 
  setTimeout(()=>{
      asMounted()
  }, 1000)
});
async function asMounted(){
  commonStore.preloader = true
  cameraStore.allowApi = true
    await galleryStore.getGallery(useCookie("header_company").value);
    await galleryStore.getCameraStatus(useCookie("header_company").value)
    commonStore.preloader = false
    if( galleryStore.camera_ids.length>0){
      await siteStore.getCameraPreviewImage({camera_ids: galleryStore.camera_ids})
      await siteStore.getCameraOfflineOnlineStatus({ camera_ids: galleryStore.camera_ids })
      // Create a map of id to objects from the first array
      setTimeout(async ()=>{
        await mergedTwoArray(false)

        // Getting signals
        for (const site of companyStore.mergedArray || []) {
          try {
            let cameras = site.cameras;
            if(cameras?.length){
              let ids = cameras.map(c => c.id).join(',');
              const signals = await siteStore.getSiteCamerasSignals(ids);
              if(signals?.length){
                signals.forEach(item => {
                  let { camera, cellular_signals } = item;
                  site.cameras.forEach(cam => {
                    if(cam.id == camera.id){
                      cam.cellular_signals = cellular_signals;
                    }
                  })
                })
              }
              // log({signals});

            }
          } catch (error) {
            
          }
        }

        showSignalBars.value = false;
        H.delay(()=>{
          showSignalBars.value = true;
        })

      }, 100)
    }
    if(siteStore?.cameraWithOfflineOnlineStatus.length){
        loadVideoStreamForOnlineCameras()
    }
      // Access the current route
    const route = useRoute();
    // Regular expression to match the pattern
    const cameraWallGalleryPattern = /^\/vms\/companies\/\d+\/camera-wall\/gallery$/;
    const cameraWallListPattern = /^\/vms\/companies\/\d+\/camera-wall\/list$/;


    if(cameraWallGalleryPattern.test(route.fullPath)){
      companyStore.isCameraWallGalleryPattern = true
    }
    if(cameraWallListPattern.test(route.fullPath)){
      companyStore.isCameraWallListPattern = true
    }
  
}
onBeforeUnmount(()=>{
  companyStore.isCameraWallGalleryPattern = false
  companyStore.isCameraWallListPattern = false
  clearInterval(intervalId)
  clearInterval(intervalIdForOnlineCameras.value)
  intervalIdForOnlineCameras.value = null
  streamLoader.value = false; // Show loader immediately when a new stream starts
  isFirstInterval.value = false;
  cameraStore.liveSnapShot = null
  cameraStore.playLiveStream = false
  cameraStore.allowApi = false
  cancelAllRequests(); 
  useNuxtApp().$off("mountCompanyWithCamerasPage"); 
})
function loadVideoStreamForOnlineCameras() {
    try {
        clearInterval(intervalIdForOnlineCameras.value); // clear previous interval
        intervalIdForOnlineCameras.value = setInterval(async () => {
            try {
                for (const id of siteStore?.cameraWithOfflineOnlineStatus || []) {
                  if(intervalIdForOnlineCameras.value){
                    await cameraStore.getLiveSnapShotForOnlineCameraWithoutAwait(id);
                  }
                }
            } catch (innerError) {
                clearInterval(intervalIdForOnlineCameras.value); // Stop further calls if there's an error
            }
        }, 5000);
    } catch (error) {
        clearInterval(intervalIdForOnlineCameras.value); // Stop further calls if there's an error
    }
}
async function mergedTwoArray(callApi=false){
  if(callApi){
    await galleryStore.getGallery(useRoute().params.id);
  }
  if(galleryStore.list.sites){
    companyStore.mergedArray = []
      const map = new Map();
      galleryStore.list.sites.forEach(item => map.set(item.id, { ...item }));
      // Iterate over the second array and merge objects if the id matches
      galleryStore.cameraStatus.site.forEach(item => {
          if (map.has(item.id)) {
              map.set(item.id, { ...map.get(item.id), ...item });
          } else {
              map.set(item.id, { ...item });
          }
      });
      // Convert the map back to an array
    
      map.forEach(value => companyStore.mergedArray.push(value));
      
    }
}
async function goToSiteCamerasPage(site){
  useCookie('header_company').value = site.company_id
  useCookie('header_site').value = site.id
  await companyStore.showCompanySite(site.company_id);
   setTimeout(()=>{
    companyStore.headerSelectedCompany = site.company_id
    siteStore.headerSelectedSite = site.id
    navigateTo(`/vms/sites/${site?.id}/cameras`)
   }, 100)
}
async function getLiveSnap(camera){
  clearInterval(intervalId)
  streamLoader.value = true; // Show loader immediately when a new stream starts
  isFirstInterval.value = true;

  selectedCamera.value = camera
  cameraStore.liveSnapShot = null
  cameraStore.playLiveStream = true
  intervalId = setInterval(async () => {
    if (isFirstInterval.value) {
      try {
        await cameraStore.getLiveSnapShot(camera?.id, camera); // Wait until the API call is done
      } catch (error) {
        console.error('Error during first API call:', error);
      } finally {
        streamLoader.value = false; // Set loader to false after the first call completes
        isFirstInterval.value = false; // Mark as done to prevent this block from running again
      }
    } else {
      cameraStore.getLiveSnapShot(camera?.id, camera); // Continue subsequent calls
    }
  }, 1000);
}
async function stopGettingLiveSnap(){
  cameraStore.playLiveStream = false
  selectedCamera.value = null
  cameraStore.liveSnapShot = null
  streamLoader.value = false; // Set loader to false after the first call completes
  isFirstInterval.value = false;
  clearInterval(intervalId)
}
</script>
<style scoped>
.is_favourite{
    color: rgb(24, 224, 24);
}
.is_online{
    color: rgb(24, 224, 24);
}
.is_offline{
    color: rgb(224, 24, 24);
}
</style>