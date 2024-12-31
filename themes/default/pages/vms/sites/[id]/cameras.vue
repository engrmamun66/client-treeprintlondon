<template>
    <div>
        <div class="m-subheader d-flex justify-content-between"> 
            <!-- <Breadcrumb title="Site's Cameras" :links="['sites', 'siteCameras']"></Breadcrumb> -->
            <Breadcrumb title="Site's Cameras" :links="['companies','siteCameras']"></Breadcrumb>
            <!-- <button @click="navigateTo('/vms/companies')" class="ionic-btn ionic-theme-btn camera-back-btn"><i class="las la-arrow-left size-sm cp"></i></button> -->
        </div>
        
        <div class="row">
            <!-- <div class="col-md-12 col-12 sitecamera-map-column"> -->
            <!-- <div :class="cameraSelectedForDigramData?.is_vehicle_detection || cameraSelectedForDigramData?.is_person_detection ? 'col-xl-4 col-md-12 col-12' : 'col-xl-12 col-md-12 col-12'"> -->
            <div class="col-xl-4 col-md-12 col-12" >
                <div class="ionic-card">
                    <div class="ionic-card-body  min-height-md">
                        <div class="invoice-map pt-0" v-if="siteStore?.site?.latitude && siteStore?.site?.longitude">

                            <GoogleMap-PickLatLong 
                                :lat="siteStore.site.latitude ? Number(siteStore.site.latitude) : null"
                                :lng="siteStore.site.longitude ? Number(siteStore.site.longitude) : null"
                                :isUpdateMode=true @pick-latlong="
                            (latLog) => {
                                siteStore.site.latitude = latLog.lat.toString();
                                siteStore.site.longitude = latLog.lng.toString();
                            }
                            " @pick-address="(addr) => (siteStore.site.address = addr)" height="440px" />
                            <div class="invoice-mapmore-menu">
                                <a href="#"><i class="las la-ellipsis-v"></i></a>
                                <div class="invoice-mapmore-menubody">

                                </div>
                            </div>
                        </div>
                        <template v-else>
                                <ShimmerEffect
                                    bg="dark"
                                    width="100%"
                                    height="420px"
                                    class="mb-3"
                                    radius="15px"
                                ></ShimmerEffect> 
                        </template>

                    </div>
                </div>
            </div>
            <!-- <div class="col-xl-8 col-md-12 col-12" v-if="cameraSelectedForDigramData?.is_vehicle_detection || cameraSelectedForDigramData?.is_person_detection"> -->
            <div class="col-xl-8 col-md-12 col-12">
                <div class="ionic-tab">
                    <ul class="ionic-tab">
                        <li @click="barDiagramFormData.detection_type = 'person'; getBarDigramData()">
                            <a :class="barDiagramFormData.detection_type == 'person' ? 'tab-active' : ''">Human Detection</a>
                        </li>
                        <li class="tab-devided mt-3"></li>
                        <li @click="barDiagramFormData.detection_type = 'vehicle'; getBarDigramData()">
                            <a :class="barDiagramFormData.detection_type == 'vehicle' ? 'tab-active' : ''">Vehicle Detection</a>
                        </li>
                    </ul>
                </div>
                <div class="ionic-card ionic-tab-card">
                        <div class="card-header-rightside select-camera-datepicker">
                            <select
                                class="form-control"
                                v-model="barDiagramFormData.camera_id"  
                                @change="getBarDigramData()"
                                style="width: 180px;height: 35px;"
                            >
                                <option :value="null">-Select camera-</option>
                                <option  v-for="(camera, index) in siteStore?.site?.cameras" :key="index" :value="camera.id">
                                    {{ camera?.name }}
                                </option>
                                
                            </select>
                            <div class="time-period">
                                <div class="date-box" style="height: 35px;width:180px">
                                    <div class="time-period">
                                        <Picker-EmDateTimePicker ref="startDatePicker" v-model="startDate" @change="
                                            async (data) => {
                                                startDate = data;
                                                barDiagramFormData.date = startDate.startDate
                                                
                                                getBarDigramData()
                                            }
                                        "
                                            :options="{...globalData.datePickerOptions, displayIn: 'bottom_left', adjustX: -200, adjustY: 12}" />
                                    </div>
                                    <button type="button" class="ionic-btn"><i class="la la-calendar"></i></button>
                                </div>
                            </div>
                        </div>
                      
                    <div class="ionic-card-body  min-height-md">
                        <template v-if="!isMounted && !hasLength">
                            <div class="text-white-50">
                                <div v-if="siteStore?.loadingDiagramData" class="text-white-50">
                                    <p class="mb-3" >Loading....... </p>
                                    <ShimmerEffect :count="10" :bg="'dark'" class="mb-1" bg="light" width="100%" height="20px" radius="0px" ></ShimmerEffect>                    
                                </div>
                                
                            </div>
                           
                        </template>
                        <template v-else>
                          
                            <template v-if="!siteStore?.loadingDiagramData && !hasLength">
                                <div class="text-center text-white-50">
                                    {{ 'Chart Data Not Available'  }}          
                                </div>
                            </template>
                            <template v-else>
                                <div class="diagram site-cameras-digram">
                                    <BarChart :labels="siteStore?.diagramLabels" xAxisPosition="bottom" :step-size="5" :showPinPoint="true" legendPosition="top" :data="siteStore?.diagramData" :datasets="[
                                        {
                                        label: 'No of detections',
                                        data: siteStore?.diagramData,
                                        backgroundColor: '#35D416',
                                        borderColor: 'rgba(75, 192, 192, 1)',
                                        borderWidth: 1,
                                        hitRadius: 10,
                                        },
                                    ]" />
                                </div>
                            </template>
                      </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="ionic-card">
            <div class="ionic-card-header m-camera-card-header">
                <div class="d-flex align-items-center">
                    <h4 class="fs-20">Site : &nbsp; <span class="me-3 fs-15">{{ siteStore?.site?.title }}</span></h4>
                    <h6 class=" fs-20">Camera : &nbsp; <span class="cp fs-15" @click="navigateTo(`/vms/cameras/${selectedCamera.id}/timeline`)">{{ selectedCamera?.name }} <img src="/img/siteicon.png" width="20px" height="20px" class="img-fluid" /></span></h6>
                    <div class="ionic-tab bg-color">
                        <ul class="ionic-tab">
                            <li @click="loadHighResolutionStream(selectedCamera.id)">
                                <a class="my-1" :class="showIframe ? 'tab-active' : ''">HD</a>
                            </li>
                            <li class="tab-devided mt-4"></li>
                            <li @click="loadLowResolutionStream(false)">
                                <a class="my-1" :class="!showIframe ? 'tab-active' : ''">SD</a>
                            </li>
                        </ul>
                    </div>
                </div>
                    
                
                <div class="card-header-rightside">

                    <div class="random-math">
                        <div class="random-math-text-math">
                            <h4 class="fs-20">Total Camera : &nbsp;</h4>
                            <h4 class="fs-20">{{ siteStore?.site?.cameras.length }}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ionic-card-body" v-if="siteStore?.site?.cameras.length">
                <div class="row">
                    <div class="col-md-12">
                        <template v-if="showIframe">
                            <template  v-if="siteStore.siteCamerasLiveFeed?.camera_een_id && iframeSrc"> 
                                <div class="camera-box mb-4" style="background-color: #2f3644 !important;"
                                    @mouseenter="mouseentered=true" @mouseleave="mouseentered=false" >
                                    <iframe class="camera-iframe" id="test-iframe" height="500" width="1000"
                                        title="History Browser" :src="iframeSrc" scrolling="no"></iframe>
                                </div>
                            </template>
                            <template v-else>
                                    <ShimmerEffect
                                        bg="dark"
                                        width="100%"
                                        height="500px"
                                        class="mb-3"
                                        radius="15px"
                                    ></ShimmerEffect> 
                            </template> 
                            
                        </template>
                        <template v-else> 
                            <template v-if="cameraStore?.liveSnapShot"> 
                                <div class="camera-box camera-large-box mb-4">
                                    <img v-if="cameraStore?.liveSnapShot" :src="cameraStore?.liveSnapShot ? cameraStore?.liveSnapShot : `/img/empty_img_small.jpg`"
                                        class="img-fluid" alt="camera img" style="width: 100%;;height: auto">
                                    <!-- <div class="camera-playicon">
                                        <i class="las la-play-circle"></i>
                                    </div> -->
                                    <div class="camera-bottom bottom-between">
                                        <h5 class="fs-12">{{ selectedCamera?.name }}</h5>
                                        <div class="camera-bottom-right d-flex">
                                            <i class="bx bx-wifi wifi-icon"></i>
                                            <signalBar v-if="showSignalBars" :signal="selectedCamera?.cellular_signals?.rssi" size="14px" color="limegreen" class="mx-1 mt-1" ></signalBar>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                    <ShimmerEffect
                                        bg="dark"
                                        width="100%"
                                        height="500px"
                                        class="mb-3"
                                        radius="15px"
                                    ></ShimmerEffect> 
                            </template>
                        </template>
                    </div>
                </div>
                <div class="row mt-3">
                    <template v-for="(camera, index) in siteStore?.site?.cameras" :key="index">
                        <div class="col-xl-2 col-lg-3 col-md-4 col-sm-4 site-camera-video-column" @click.stop="loadVideoStream(camera?.id); selectedCamera = camera">
                            <div class="camera-box cp"
                                :class="selectedCamera?.id == camera?.id ? 'camera-box-active' : ''">
                                <img :src="siteStore.cameraWithPreviewImage[camera?.id] ? siteStore.cameraWithPreviewImage[camera?.id] : `/img/empty_img_small.jpg`"
                                    class="img-fluid" alt="camera img" />
                                <!-- 
                                <div class="camera-box-top">
                                   {{ H.formatDate(siteStore.cameraWithPreviewImageCreatedDate[camera?.id], 'MM-DD-YYYY hh:mm a') }}
                                </div>
                                <div class="camera-playicon">
                                    <i class="las la-play-circle"></i>
                                </div> -->
                                <div @click.stop="navigateTo(`/vms/cameras/${camera?.id}/timeline`)"
                                    class="camera-bottom bottom-between">
                                    <h5 class="fs-12">{{ camera?.name }}</h5>
                                    <div class="camera-bottom-right d-flex">
                                        <i @click.stop="siteStore.cameraMakeAsFavourite(siteStore?.site?.id, camera?.id)"
                                            class='las la-star' :class="camera.is_fav  ? 'is_favourite': ''"></i>
                                        <!-- <i @click.stop="
                                        withDelete.camera = camera;
                                        withDelete.showConfirmation = true;" class='las la-trash'></i> -->
                                        <i @contextmenu="log(H.clone(camera))" class="bx bx-wifi wifi-icon" :class="siteStore.cameraWithOfflineOnlineStatus.includes(camera?.id) ? 'is_online': 'is_offline'"></i>
                                        <signalBar v-if="showSignalBars" :signal="camera?.cellular_signals?.rssi" size="14px" color="limegreen" class="mx-1 mt-1" ></signalBar>
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
            <!-- <ClientOnly>
            <template v-if="siteStore.siteCamerasLiveFeed.access_token">
                <VideoStream  :data="siteStore.siteCamerasLiveFeed"/>
            </template>
        </ClientOnly> -->






        </div>
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

    <section v-if="openDetectionImageModal" class="modal fade addnew-product-modal camera-modal" tabindex="-1" style="display: block; opacity: unset">
        <div class="modal-dialog modal-dialog-centered" @click.stop="true">
          <div class="modal-content" @click.stop="false">
            <div class="modal-header">
              <h3 class="modal-title">{{ barDiagramFormData.detection_type == 'person' ? ' Human detection' : ' Vehicle detection' }} thumbnail images  {{barDiagramFormData.date}} ({{firstMinuteOfHour}} - {{lastMinuteOfHour}}) </h3>
              <button @click.stop="openDetectionImageModal = false" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <i class="la la-close"></i>
              </button>
            </div>
            <div class="modal-body" @click.stop="false">
                <div class="modal-body-inner ionic-form-area">
                    <div class="row">
                        <template v-for="(clip, index) in clickedDigramClips" :key="index">
                            <div class="col-xl-3 col-lg-3 col-md-4 col-sm-4 site-camera-video-column" @click="openImagePreviewer(clip, index)">
                                <div class="camera-box camera-large-box mb-4">
                                    <img :src="clip.image_url ? clip.image_url : `/img/empty_img_small.jpg`" class="img-fluid" alt="camera img">
                                    <div class="camera-bottom bottom-between" style="justify-content: center">
                                        <h5 class="fs-12">{{ moment(clip?.startTimestamp).tz("UTC").format('hh:mm:ss A') }}</h5>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
          </div>
        </div>
    </section>
    <imageAndVideoPreview v-model="showPreviewer" :imageUrls="detectionImages" :descriptions="detectionImagesTimes" v-model:index="mediaCurrentIndex" />
</div>
</template>
<script setup>
import { useSitesStore } from '~/stores/vms/sites';
import { useCompaniesStore } from "~/stores/vms/company";
import { useCommonStore } from  "~/stores/Common";
import { useCameraStore } from '~/stores/vms/camera';
import { cancelAllRequests } from '~/utils/requestManager';
const commonStore  = useCommonStore();
const siteStore = useSitesStore();
const companyStore = useCompaniesStore();
const cameraStore  = useCameraStore();
definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: "%s | Site's cameras",
});
let iframeSrc = ref(' https://iframe.eagleeyenetworks.com/#/live/<esn>')
let showIframe = ref(true)
let selectedCamera = ref(null)
let barDiagramFormData = reactive({
    camera_id : null,
    camera_een_id: null,
    date: null,
    detection_type: 'person'
})
let withDelete = reactive({
    camera: null,
    showConfirmation: false,
});
let startDate = ref({
    startDate:  H.formatDate(new Date(), "YYYY-MM-DD"),
    endDate:  H.formatDate(new Date(), "YYYY-MM-DD"),
});
let showBarChat = ref(true);
let timeOut = null
let intervalId = null
let intervalIdForOnlineCameras = ref(null)
let isFirstInterval = ref(false)
let isMounted = ref(false)
let showSignalBars = ref(true)
let clickedDigramClips = ref(null)
let openDetectionImageModal = ref(false)
let detectionImages = ref([])
let detectionImagesTimes = ref([])
let showPreviewer = ref(false)
let mediaCurrentIndex = ref(0)
let firstMinuteOfHour = ref(null)
let lastMinuteOfHour = ref(null)
onMounted(async () => {
    useNuxtApp().$on('digramData:updated', ()=>{
        showBarChat.value = false;
        H.delay(() => showBarChat.value = true);
    });
    useNuxtApp().$on('onClickBarDiagram', (data)=>{
        let startTime = moment(`${barDiagramFormData.date} ${data.xAxisLabel}`, "YYYY-MM-DD hh A").format('YYYY-MM-DD HH:mm:ss')

        firstMinuteOfHour.value = moment(`${barDiagramFormData.date} ${data.xAxisLabel}`, "YYYY-MM-DD hh A")
        .startOf('hour') // Sets to the last moment of the hour
        .format('hh:mm A')
        lastMinuteOfHour.value = moment(`${barDiagramFormData.date} ${data.xAxisLabel}`, "YYYY-MM-DD hh A")
        .endOf('hour') // Sets to the last moment of the hour
        .format('hh:mm A');
        let filteredDetection = siteStore.detectionDataResponse.filter((detection)=>{
            return detection.start_time == startTime
        })
        clickedDigramClips.value = JSON.parse(filteredDetection[0].options).data.clips
       
        // showPreviewer.value = true
        detectionImages.value = []
        clickedDigramClips.value.forEach((clip)=>{
            if(clip.image_url){
                detectionImages.value.push(clip.image_url)
                detectionImagesTimes.value.push( moment(clip?.startTimestamp).tz("UTC").format('hh:mm:ss A'))
            }
        })
        if(detectionImages.value.length){
            openDetectionImageModal.value = true
        }
    });

    commonStore.preloader = true
    cameraStore.allowApi = true
    useNuxtApp().$on('changeHeaderSite', (cameraId) => { loadVideoStream(cameraId) })
    let siteId = useRoute().params.id;
    await siteStore.getSite(siteId);
    if(siteStore.site.camera_ids.length > 0){
        await siteStore.getCameraPreviewImage({ camera_ids: siteStore.site.camera_ids })
        await siteStore.getCameraOfflineOnlineStatus({ camera_ids: siteStore.site.camera_ids })
        const favoriteCameras = siteStore?.site?.cameras.filter(camera => camera.is_fav === 1)
        if(favoriteCameras.length){
            await loadVideoStream(favoriteCameras[0].id)
            commonStore.preloader = false
            selectedCamera.value = favoriteCameras[0]
            barDiagramFormData.camera_id = favoriteCameras[0].id
            barDiagramFormData.camera_een_id = favoriteCameras[0].een_camera_id
            barDiagramFormData.date = startDate.value.startDate
            getBarDigramData()
        }else{
            await loadVideoStream(siteStore?.site?.cameras[0].id)
            commonStore.preloader = false
            selectedCamera.value = siteStore?.site?.cameras[0]
            barDiagramFormData.camera_id = siteStore?.site?.cameras[0].id
            barDiagramFormData.camera_een_id= siteStore?.site?.cameras[0].een_camera_id
            barDiagramFormData.date = startDate.value.startDate
            getBarDigramData()

        }
    }else{
        commonStore.preloader = false;
    }
    if(siteStore?.cameraWithOfflineOnlineStatus.length){
        cameraStore.allowApi = true
        cameraStore.playLiveStream = true;
        cameraStore.loadSnapShotForCameraId = selectedCamera.value.id;
        await cameraStore.getLiveSnapShot(selectedCamera.value.id);
        loadVideoStreamForOnlineCameras()
    }


    // get signals (siteStore?.site?.cameras)
    // Getting signals
    if (siteStore?.site?.cameras?.length) {
        try {
            let cameras = siteStore?.site?.cameras;
            if(cameras?.length){
                let ids = cameras.map(c => c.id).join(',');
                const signals = await siteStore.getSiteCamerasSignals(ids);
                if(signals?.length){
                    signals.forEach(item => {
                        let { camera, cellular_signals } = item;
                        siteStore?.site?.cameras.forEach(cam => {
                            if(cam.id == camera.id){
                                cam.cellular_signals = cellular_signals;
                            }
                        })
                    })
                }

                showSignalBars.value = false;
                H.delay(()=>{
                showSignalBars.value = true;
                })


                // log({signals});

            }
        } catch (error) {
        
        }
    }
  

    // clearTimeout(timeOut)
    // timeOut = setTimeout(()=>{
    //    showIframe.value = false
    //    loadLowResolutionStream()
    // }, 1000 * 1 )
});
onBeforeUnmount(()=>{
  clearInterval(intervalId);
  clearInterval(intervalIdForOnlineCameras.value); // clear previous interval
  intervalIdForOnlineCameras.value = null;
  isFirstInterval.value = false;
  cameraStore.liveSnapShot = null
  cameraStore.playLiveStream = false
  iframeSrc.value = null
  showIframe.value = false
  cameraStore.allowApi = false
  siteStore.cameraWithOfflineOnlineStatus = []
  cancelAllRequests()
})
watch(() => barDiagramFormData.camera_id, async  (newValue, oldValue) => {
  // Find the selected camera from the siteStore
  const selectedCameraObj = siteStore?.site?.cameras.find(camera => camera?.id === newValue);
  if (selectedCameraObj) {
    barDiagramFormData.camera_een_id = selectedCameraObj.een_camera_id
  }
});
function onIframeMessageDataPos(event) {
    if (event.data === 'een-iframe-loaded' || event.data === "een-iframe-token-expired") {
        const iframe = document.getElementById("test-iframe").contentWindow;
        iframe.postMessage({
            type: 'een-token',
            token: siteStore.siteCamerasLiveFeed.access_token
        }, "https://iframe.eagleeyenetworks.com/");
    }
}
async function loadVideoStream(cameraId) {
    await loadHighResolutionStream(cameraId)
    clearTimeout(timeOut)
    timeOut = setTimeout(()=>{
       showIframe.value = false
       loadLowResolutionStream()
    }, 1000 * 60 * 2 )
}
async function resetIframeRelatedData(){
    iframeSrc.value = null
    showIframe.value = false;
    siteStore.siteCamerasLiveFeed =  null
}
async function loadHighResolutionStream(cameraId){
    cameraStore.allowApi = false
    await cancelAllRequests()
    iframeSrc.value = null
    await siteStore.getSiteCamerasLiveFeed(cameraId)
    if (siteStore.siteCamerasLiveFeed.access_token) {
        iframeSrc.value = `https://iframe.eagleeyenetworks.com/#/live/${siteStore.siteCamerasLiveFeed.camera_een_id}`
        setTimeout(() => {
            showIframe.value = true
        }, 1000)
        window.removeEventListener("message", onIframeMessageDataPos);
        window.addEventListener("message", onIframeMessageDataPos);
    }
    setTimeout(()=>{
        cameraStore.allowApi = true
    }, 5000)
    cameraStore.allowApi = true
    cameraStore.playLiveStream = true;
    cameraStore.loadSnapShotForCameraId =cameraId;
    await cameraStore.getLiveSnapShot(cameraId);
}
async function loadLowResolutionStream(resetLiveSnapImage = true) {
    cameraStore.allowApi = false
    await cancelAllRequests()
    clearTimeout(timeOut)
    await resetIframeRelatedData()
    cameraStore.loadSnapShotForCameraId = selectedCamera.value.id;
    cameraStore.playLiveStream = true;
    isFirstInterval.value = true;
    // cameraStore.isCallingLiveSnapShotApi = true
    clearInterval(intervalId); // clear previous settime interval id
    if(resetLiveSnapImage){
        cameraStore.liveSnapShot = null;
    }
    intervalId = setInterval(async () => {
        try {
        if (isFirstInterval.value) {
            await cameraStore.getLiveSnapShot(selectedCamera.value.id); // Await the initial API call
            if (cameraStore.liveSnapShot) {
                isFirstInterval.value = false; // Mark first call as complete
                // commonStore.preloader = false // Turn off loader after the first call completes
                // cameraStore.isCallingLiveSnapShotApi = false
            }
        } else {
            cameraStore.getLiveSnapShot(selectedCamera.value.id); // Make subsequent calls without awaiting
        }
        } catch (error) {
        console.error('Error during API call:', error);
        commonStore.preloader = false // Turn off loader if there's an error
        clearInterval(intervalId); // Stop further calls if there's an error
        }
    }, 1000);
    setTimeout(()=>{
        cameraStore.allowApi = true
    },5000)
}
// function loadVideoStreamForOnlineCameras() {
//     try {
//         intervalIdForOnlineCameras.value = setInterval(async () => {
//             try {
//                 for (const id of siteStore?.cameraWithOfflineOnlineStatus || []) {
//                     if(intervalIdForOnlineCameras.value){
//                         await cameraStore.getLiveSnapShotForOnlineCamera(id);
//                     }
//                 }
//             } catch (innerError) {
//                 console.error('Error in interval:', innerError);
//                 clearInterval(intervalIdForOnlineCameras.value); // Stop further calls if there's an error
//             }
//         }, 1000);
//     } catch (error) {
//         console.error('Error in loadVideoStreamForOnlineCameras:', error);
//         clearInterval(intervalIdForOnlineCameras.value); // Stop further calls if there's an error
//     }
// }
function loadVideoStreamForOnlineCameras() {
    try {
        intervalIdForOnlineCameras.value = setInterval(async () => {
            try {
                for (const id of siteStore?.cameraWithOfflineOnlineStatus || []) {
                    if(intervalIdForOnlineCameras.value){
                        await cameraStore.getLiveSnapShotForOnlineCameraWithoutAwait(id);
                    }
                }
            } catch (innerError) {
                console.error('Error in interval:', innerError);
                clearInterval(intervalIdForOnlineCameras.value); // Stop further calls if there's an error
            }
        }, 5000);
    } catch (error) {
        console.error('Error in loadVideoStreamForOnlineCameras:', error);
        clearInterval(intervalIdForOnlineCameras.value); // Stop further calls if there's an error
    }
}
// function loadVideoStreamForOnlineCameras() {
//     try {
//         const cameraIds = siteStore?.cameraWithOfflineOnlineStatus || [];
        
//         for (let i = 0; i < cameraIds.length; i++) {
//             // if(cameraStore.allowApi){
//                 const id = cameraIds[i];
//                 cameraStore.getLiveSnapShotForOnlineCameraWithoutAwait(id);
//                 // Check if this is the last iteration
//                 if (i === cameraIds.length - 1 ) {
//                     // Call the function recursively after the last iteration
//                     loadVideoStreamForOnlineCameras();
//                 }
//             // }
         
//         }
//     } catch (error) {
//         console.error('Error in loadVideoStreamForOnlineCameras:', error);
//     }
// }

async function handleDelete(id) {
    await companyStore.deleteCamera(id);
}
let cameraSelectedForDigramData = ref(null)
async function getBarDigramData(){
    siteStore.loadingDiagramData = true
    siteStore.diagramData = []
    cameraStore.allowApi = false
    await cancelAllRequests()
    isMounted.value = false;
   
   let queryParams = {
       camera_id : barDiagramFormData.camera_id,
       date : barDiagramFormData.date,
       detection_type : barDiagramFormData.detection_type
   }
   let filteredCamera = siteStore?.site?.cameras.filter((camera)=>{
      return camera.id == barDiagramFormData.camera_id
   })
   cameraSelectedForDigramData.value = filteredCamera[0]
   await siteStore.getDetectionData(queryParams);
   useNuxtApp().$emit('digramData:updated', true);
   isMounted.value = true;
   siteStore.loadingDiagramData = false;
   setTimeout(()=>{
        cameraStore.allowApi = true
    },5000)
}
let mouseentered = ref(false);

function enableScroll() {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}
function disableScroll() {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
}

watch(mouseentered, (a, b)=>{
    if(a) disableScroll()
    else enableScroll()
})

let hasLength = computed(()=>{
    if(!siteStore?.diagramData?.length){
        return false
    }else{
        let allAreZeros = siteStore?.diagramData?.every(item=> item == 0)
        return allAreZeros === false 
    }
})

function openImagePreviewer(clip, index){
    if(clip.image_url){
        showPreviewer.value = true
        mediaCurrentIndex.value = index
    }
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
.iframe-container {
  width: 100%;
  height: 400px;
  overflow: hidden; 
}

.iframe-content {
  width: 100%;
  height: 100%;
  transform: scale(1.8);
  transform-origin: -20 -20;
  overflow: hidden;
}
.bg-color{
    background-color: #332a2a;
}

@media (min-height:500px){
    .min-height-md {
        min-height: 350px!important;
    }
    
}
</style>
