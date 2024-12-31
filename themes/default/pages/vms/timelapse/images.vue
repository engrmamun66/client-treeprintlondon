<template>
    <div>
        <Breadcrumb title="Timelapse Images" :links="['timelapseImage']" :page="{title: timelapseStore?.selectedCameraDetails?.name, path: `/vms/cameras/${timelapseStore?.selectedCameraDetails?.id}/timeline`}"></Breadcrumb>
        <div class="ionic-admin-subheader header-image-date">
            <div class="ionic-admin-subheader-inner">
                <div class="ionic-subheader-rightside">

                </div>
                <div class="ionic-subheader-rightside">
                    <!-- <button type="button" class="ionic-btn ionic-theme-btn2 ionic-btnlg fetch-btn">Fetch Missing
                        Images</button> -->
                    <div class="date-box">
                        <div class="time-period">
                            <Picker-EmDateTimePicker ref="startDatePicker" v-model="startDate" @change="
                                async (data) => {
                                  startDate = data;
                                  getTimelapseImage(timelapseStore.selectedCamera)
                                }
                              "
                                :options="{...globalData.datePickerOptions, displayIn: 'bottom_left', adjustX: -200, adjustY: 12}" />
                        </div>
                        <button type="button" class="ionic-btn"><i class="la la-calendar"></i></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-if="siteStore?.site?.cameras">
            <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12 folder_div timelapse-image-content">
                <div class="ionic-card">
                    <div class="ionic-card-body">
                        <div class="left_folders">
                            <div class="folder-div-content">
                                <ul class="timelapse-listview" id="myUL">
                                    <li class="companies pt-1">
                                        <h5 class="ms-1 fs-18 mb-2">{{ siteStore?.site?.title }}</h5>
                                        <ul class="nested child active pt-1">
                                            <template v-if="siteStore?.site?.cameras.length > 0"> 
                                                <template v-for="(camera, index) in siteStore?.site?.cameras" :key="index">
                                                    <li @click="async()=>{await getTimelapseImage(camera.id);getTimelapseCalendarData(camera.id);   timelapseStore.selectedCameraDetails = camera}"
                                                        class="ms-3 pt-1 folder cp ">
                                                        <span class="caret mr-1 bx"
                                                            :class="timelapseStore.selectedCamera == camera.id ? 'bx-minus color-active' : 'bx-plus'  "><span
                                                                class="ps-2 file-text"
                                                                :class="timelapseStore.selectedCamera == camera.id ? 'color-active' : ''">{{
                                                                camera.name }}</span></span>
                                                    </li>
                                                </template>
                                            </template>
                                            <template v-else> 
                                                <li ass="ms-3 pt-1 folder cp ">
                                                    <span class="ps-2 file-text color-active">No cameras found</span>
                                                </li>
                                            </template>
                                           
                                        </ul>
                                    </li>
                                    <!-- <li class="companies pt-1">
                                    <span class="caret bx bx-plus" id="media/reports/company_acs-northern-california/site_e-evelyn-mtn-ca">
                                                    <span class="ms-1 file-text">site_e-evelyn-mtn-ca</span>
                                    </span>
                                </li>
                                <li class="companies pt-1">
                                    <span class="caret bx bx-plus" id="media/reports/company_acs-northern-california/site_ecr">
                                                    <span class="ms-1 file-text">site_ecr</span>
                                    </span>
                                </li>
                                <li class="companies pt-1">
                                    <span class="caret bx bx-plus" id="media/reports/company_acs-northern-california/site_ecr-santa-clara-ca">
                                                    <span class="ms-1 file-text">site_ecr-santa-clara-ca</span>
                                    </span>
                                </li>
                                <li class="companies pt-1">
                                    <span class="caret bx bx-plus" id="media/reports/company_acs-northern-california/site_tillery-mtn-view-ca">
                                                    <span class="ms-1 file-text">site_tillery-mtn-view-ca</span>
                                    </span>
                                </li> -->
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-9 col-lg-9 col-md-9 col-sm-12 file_div timelapse-image-content" v-if="timelapseStore.timelapseImageList.length">
                <div class="ionic-card">
                    <div class="ionic-card-body">
                        <div id="asset_div" style="">
                            <div class="header-buttons clearfix col-12 mb-3">
                                <div style="float: left;">

                                    <label for="cb_del_all">
                                        <button @click="isGridView=true" type="button"
                                            class="btn btn-success grid-view active" title="grid">
                                            <i class="bx bx-grid"></i>
                                        </button>
                                        <button @click="isGridView=false" type="button"
                                            class="btn btn-info list-view text-white" title="list">
                                            <i class="bx bx-list-ul"></i>
                                        </button>
                                    </label>

                                </div>
                                <div style="float: right;">
                                    <label class="checkbox checkbox-pos-inline image-checkbox-btn"><input
                                            type="checkbox" :value="isAllSelected" v-model="isAllSelected"
                                            @click="checkOrUncheckedAll()"><span></span></label>

                                    <button @click="downloadImage()" type="button" id="btn-download" class="btn btn-primary" title="Download">
                                        <i class="bx bx-download"></i>
                                    </button>
                                    <!-- <button type="button" id="btn-upload" class="btn btn-warning" title="Upload">
                                    <i class="bx bx-upload"></i>
                                </button>
                                <button type="button" id="btn-rename" class="btn btn-primary" style="display: none;" title="Rename">
                                    <i class="bx bx-pencil"></i>
                                </button> -->
                                    <button @click="deleteTimelapseImage()" type="button" id="btn-delete"
                                        class="btn btn-danger" title="Delete" style="">
                                        <i class="bx bx-trash"></i>
                                    </button>

                                </div>
                            </div>



                            <div class="col-12 file-list-area">
                                <ul class="grid-list clearfix" v-if="isGridView">
                                    <li class="row file-row clearfix">
                                        <template v-for="(image, index) in timelapseStore.timelapseImageList"
                                            :key="index">
                                            <div class="col-xl-3 col-lg-3 col-md-3 col-sm-4 file-colm">
                                                <a class="file-box position-relative" href="javascript:void(0)">
                                                    <div class="filebox-icon preview-file" @click="imageIndex = index; showPreviewer=true">
                                                        <img :src=" image?.image_small_path_url  ?? image?.image_path_url ?? '/img/empty_img_small.jpg'"  @error="handleImgError">
                                                    </div>
                                                    <span class="report-file" title="dji-0749e5I.jpeg">{{
                                                        moment(image?.image, 'YYYYMMDDHHmmss').format('MM-DD-YYYY HH:mm A')}}
                                                    </span>
                                                    <label class="checkbox checkbox-pos-inline grid-img-checkbox"><input
                                                            type="checkbox" :value="image.id"
                                                            v-model="timelapseStore.image_ids"><span></span></label>
                                                </a>
                                            </div>
                                        </template>
                                    </li>
                                </ul>
                                <ul class="file-list clearfix" v-else>
                                    <template v-for="(image, index) in timelapseStore.timelapseImageList" :key="index">
                                        <li class="row">
                                            <div class="image-list-Item listImage-box">
                                                <label class="checkbox checkbox-pos-inline checkbox-list-view"><input
                                                        type="checkbox" :value="image.id"
                                                        v-model="timelapseStore.image_ids"><span></span></label>
                                                <a class="ms-2 listImage-boxZ" href="javascript:void(0)"
                                                    data-bs-toggle="modal" data-bs-target="#file-modalview">
                                                    <img :src=" image?.image_small_path_url  ?? image?.image_path_url ??  '/img/empty_img_small.jpg'" class="img-fluid"  @error="handleImgError"
                                                    @click="imageIndex = index; showPreviewer=true">
                                                    <span class="report-file" data-type="img"
                                                        title="dji-0749e5I.jpeg">{{  moment(image?.image, 'YYYYMMDDHHmmss').format('MM-DD-YYYY HH:mm A')}}</span>
                                                </a>
                                            </div>
                                        </li>
                                    </template>
                                </ul>
                                <template v-if="showEffect">
                                    <div class="d-flex justify-content-end align-items-center my-3">
                                        <ShimmerEffect bg="dark" width="64px" height="12px" class="me-4" speed="1s"
                                            radius="2px" :stopAnimaiton="false"></ShimmerEffect>
                                        <ShimmerEffect bg="dark" width="64px" height="12px" class="me-4" speed="1s"
                                            radius="2px" :stopAnimaiton="false"></ShimmerEffect>
                                        <ShimmerEffect bg="dark" width="64px" height="12px" class="me-4" speed="1s"
                                            radius="2px" :stopAnimaiton="false"></ShimmerEffect>

                                        <ShimmerEffect bg="dark" width="32px" height="32px" class="me-2" speed="1s"
                                            :stopAnimaiton="false">
                                        </ShimmerEffect>
                                        <ShimmerEffect bg="dark" width="32px" height="32px" class="me-2" speed="1s"
                                            :stopAnimaiton="false">
                                        </ShimmerEffect>
                                        <ShimmerEffect bg="dark" width="32px" height="32px" class="me-2" speed="1s"
                                            :stopAnimaiton="false">
                                        </ShimmerEffect>
                                        <ShimmerEffect bg="dark" width="32px" height="32px" class="me-2" speed="1s"
                                            :stopAnimaiton="false">
                                        </ShimmerEffect>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="d-flex justify-content-end align-items-center my-3"
                                        v-if="timelapseStore.timelapseImageList.length >= 1">
                                        <p class="me-4"> <strong class="text-white-50">
                                                Total: {{ timelapseStore?.paginateData?.data?.total }}
                                                <span class="mx-3">|</span>
                                                Page: {{ timelapseStore?.paginateData?.data?.current_page }}
                                                <span class="mx-3">|</span>
                                                Showing: {{ timelapseStore?.timelapseImageList?.length || 0 }}
                                            </strong> </p>
                                        <PaginationRentMy v-model="timelapseStore.paginateData.data" @jumpToPage="jumpPage" :prevent="true"> </PaginationRentMy>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-9 col-lg-9 col-md-9 col-sm-12 file_div timelapse-image-content" v-else>
                <div class="ionic-card">
                    <div class="ionic-card-body">
                        <h6 class="text-center mt-5" style="font-size: 18px;">No images found</h6>
                    </div>
                </div>
            </div>
        </div>
        <Picker-EmDateTimePicker  ref="multiMonthDatePicker" v-model="multiCalendarDateTime" @change="
                async (data) => {
                    startDate = data;
                    $refs.startDatePicker.setDate(data.startDate)
                    multiCalendarDateTime.startDate = pickers.startDate
                    multiCalendarDateTime.endDate = pickers.endDate
                    getTimelapseImage(timelapseStore.selectedCamera)
                }" 
                @nextPrevious="(data) => {
                    // let currentMonthLastDate = moment(new Date()).startOf('month').format('YYYY-MM-DD')
                    // if (currentMonthLastDate < data.startDate ) {
                    //     log($refs.multiMonthDatePicker.previous())
                    //     $refs.multiMonthDatePicker.previous()
                    //    log('currentMonthLastDate', currentMonthLastDate, data.startDate)
                    // }else{
                    //     log('currentMonthLastDate222', currentMonthLastDate, data.startDate)
                    //     multiCalendarDateTime.startDate = moment(data.startDate).startOf('month').format('YYYY-MM-DD');
                    //     multiCalendarDateTime.endDate = moment(data.endDate).endOf('month').format('YYYY-MM-DD');
                    //     getTimelapseCalendarData()
                    // }
                    multiCalendarDateTime.startDate = moment(data.startDate).startOf('month').format('YYYY-MM-DD');
                    multiCalendarDateTime.endDate = moment(data.endDate).endOf('month').format('YYYY-MM-DD');
                    pickers.startDate = multiCalendarDateTime.startDate
                    pickers.endDate = multiCalendarDateTime.endDate
                    getTimelapseCalendarData()
                   
                   
                }"
                :availableInDates="availableInDates"
                :invisible="true"
                :skipHighlighterDefaultClassess="true" :autoOpen="true" :sticky="true" :row="5" :calendarQuantity="calendarqty"
                :options="{...globalData.datePickerOptions, displayIn: 'inline', adjustX: 0, adjustY: 12}" />
        <imagePreview v-model="showPreviewer" v-model:imageUrls="timelapseStore.imageURLs" v-model:index="imageIndex" :dateTimes="timelapseStore.imageDateTimes"/>
    </div>
</template>
<script setup>
import moment from "moment-timezone";
import { useCompaniesStore } from "~/stores/vms/company";
import { useTimelapseStore } from "~/stores/vms/timelapse";
import { useSitesStore } from "~/stores/vms/sites";
import { useGalleryStore} from '~/stores/vms/gallery'
import { useCommonStore } from  "~/stores/Common";
const commonStore  = useCommonStore();
const timelapseStore = useTimelapseStore();
const siteStore = useSitesStore();
const galleryStore = useGalleryStore()
const companyStore = useCompaniesStore();
let calendarqty = ref(3)
definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
    titleTemplate: "%s | Timelapse Image ",
});
onMounted(async()=>{
    commonStore.preloader = true
   if(useRoute().query.camera_id && useRoute().query.date){
        await galleryStore.getCameraDetails(useRoute().query.camera_id)
        useCookie('header_company').value = galleryStore.cameraDetails.company_id
        companyStore.headerSelectedCompany = galleryStore.cameraDetails.company_id
        await companyStore.showCompanySite(  galleryStore.cameraDetails.company_id );
        await siteStore.getSite(useCookie('header_site').value, only_timelapse)
        siteStore.headerSelectedSite =  galleryStore.cameraDetails.site.id
        timelapseStore.selectedCameraDetails = galleryStore.cameraDetails
        timelapseStore.selectedCamera = galleryStore.cameraDetails.id
        setTimeout(async()=>{
            await getTimelapseImage(useRoute().query.camera_id)
            await getTimelapseCalendarData(useRoute().query.camera_id);
        }, 100)
   }else{
        await asMounted()
   }
   commonStore.preloader = false
   
    window.addEventListener('resize', handleResize);
    useNuxtApp().$on("mountTimeLapseImage", (site) => {
        globalLoader(true)
        useCookie("header_site").value =  site
        setTimeout(()=>{
            asMounted()
            globalLoader(false)
        }, 100)
    });
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    useNuxtApp().$off("mountTimeLapseImage"); // Clean up the event listener
});

const isGridView = ref(true)
let imageIndex = ref(0)
let isAllSelected = ref(false)
let startDate = ref({
    startDate: useRoute().query.date ?  moment(useRoute().query.date).format('YYYY-MM-DD') : H.formatDate(new Date(), "YYYY-MM-DD"),
    endDate: useRoute().query.date ?  moment(useRoute().query.date).format('YYYY-MM-DD') : H.formatDate(new Date(), "YYYY-MM-DD"),
});
let screenWidth = ref(null)
let multiCalendarDateTime = ref({
    startDate: calendarqty.value == 3 ? moment(useRoute().query.date ?? new Date()).subtract(2 , 'month').startOf('month').format("YYYY-MM-DD") : moment(useRoute().query.date ?? null).startOf('month').format('YYYY-MM-DD') ,
    endDate: useRoute().query.date ?  moment(useRoute().query.date).format('YYYY-MM-DD') : H.formatDate(new Date(), "YYYY-MM-DD") ,
})
let pickers = ref({...multiCalendarDateTime.value})
let availableInDates = ref({
    aiasesKey: {
        available: 'available',
        date: 'date'
    },
    data: [
       
    ]
})
let files = ref([])
let showPreviewer= ref(false)
let showEffect = ref(false)
let showCalendar = ref(true)
let only_timelapse = 1

async function asMounted(isResizeEvent=false){
  
    if( useCookie("header_company").value && useCookie('header_company').value !='all'){
        companyStore.headerSelectedCompany =  useCookie("header_company").value;
        if(useCookie('header_site').value && useCookie('header_site').value !='all'){
            await siteStore.getSite(useCookie('header_site').value, only_timelapse)
            await getTimelapseImage()
            if(isResizeEvent){
                timelapseStore.selectedCamera =  useCookie('camera_details').value.id
                timelapseStore.selectedCameraDetails = useCookie('camera_details').value
                await getTimelapseCalendarData(useCookie('camera_details').value.id)
            }else{
                timelapseStore.selectedCamera = siteStore.site.cameras.length ? siteStore.site.cameras[0].id : null
                timelapseStore.selectedCameraDetails = siteStore.site.cameras[0]
                siteStore.site.cameras.length ? await getTimelapseCalendarData(siteStore.site.cameras[0].id) : ''
            }
        }else{
            await companyStore.showCompanySite(useCookie("header_company").value);
            if(companyStore.companySiteList.length){
                useCookie("header_site").value = companyStore.companySiteList[0].id 
                siteStore.headerSelectedSite = companyStore.companySiteList[0].id 
                await siteStore.getSite(companyStore.companySiteList[0].id, only_timelapse)
                await getTimelapseImage()
                if(isResizeEvent){
                    timelapseStore.selectedCamera =  useCookie('camera_details').value.id
                    timelapseStore.selectedCameraDetails = useCookie('camera_details').value
                    await getTimelapseCalendarData(useCookie('camera_details').value.id)
                }else{
                    timelapseStore.selectedCamera = siteStore.site.cameras.length ? siteStore.site.cameras[0].id : null
                    timelapseStore.selectedCameraDetails = siteStore.site.cameras[0]
                    siteStore.site.cameras.length ? await getTimelapseCalendarData(siteStore.site.cameras[0].id) : ''
                }
            }else{
                console.log("tessst")
                Toaster.error('No sites available')
            }
        }
    }
    else{
        await companyStore.getCompanyList();
        let company_id = companyStore.companies[0]?.id;
        useCookie("header_company").value = company_id;
        companyStore.headerSelectedCompany =  company_id;
        await companyStore.showCompanySite(company_id);
        if(companyStore.companySiteList.length){
            useCookie("header_site").value = companyStore.companySiteList[0].id 
            siteStore.headerSelectedSite = companyStore.companySiteList[0].id 
            await siteStore.getSite(companyStore.companySiteList[0].id, only_timelapse)
            await getTimelapseImage()
            if(isResizeEvent){
                timelapseStore.selectedCamera =  useCookie('camera_details').value.id
                timelapseStore.selectedCameraDetails = useCookie('camera_details').value
                await getTimelapseCalendarData(useCookie('camera_details').value.id)
            }else{
                timelapseStore.selectedCamera = siteStore.site.cameras.length ? siteStore.site.cameras[0].id : null
                timelapseStore.selectedCameraDetails = siteStore.site.cameras[0]
                siteStore.site.cameras.length ? await getTimelapseCalendarData(siteStore.site.cameras[0].id) : ''
            }
        }else{
            console.log("tessst")
            Toaster.error('No sites available')
        }
        // setTimeout(()=>{
        //     siteStore.headerSelectedSite = companyStore.companySiteList[0].id;
        //     companyStore.headerSelectedCompany = company_id 
        // },100)
    }
    showCalendar.value = false
    screenWidth.value = window.innerWidth;
    calendarqty.value = null
    if(screenWidth.value <= 480){
        calendarqty.value = 1
        multiCalendarDateTime.value.startDate = moment().startOf('month').format('YYYY-MM-DD');
    }else{
        calendarqty.value = 3
    }
    showCalendar.value = true
  
}
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
async function getTimelapseImage(cameraId = null){
    globalLoader(true)
    timelapseStore.selectedCamera = cameraId
    cameraId ? await timelapseStore.getTimelapseImageList(cameraId, startDate.value.startDate ): (siteStore.site.cameras.length ? await timelapseStore.getTimelapseImageList(siteStore.site.cameras[0].id, startDate.value.startDate) : "")
    globalLoader(false)

}
function deleteTimelapseImage(){
    let payload = {
        snap_ids: timelapseStore.image_ids
    }
    
    timelapseStore.deleteTimelapseImage(payload)
}
// function downloadImage() {
//     if(timelapseStore.image_ids.length == 1){
//         timelapseStore.timelapseImageList.filter((image) => {
//             if(image.id === timelapseStore.image_ids[0]) {
//                 console.log("image ", image)
//                 const link = document.createElement('a');
//                 link.href = image.image_path ?? image.image_path_url;
//                 link.download = 'downloaded_image.jpg'; // Specify the file name here
//                 link.click();
//             }
//         });
            
//     }
    
// }
async function downloadImage() {
    if(timelapseStore.image_ids.length == 1){
        const image = timelapseStore.timelapseImageList.find(image => image.id === timelapseStore.image_ids[0]);
        if(image) {
            fetch(image.image_path ?? image.image_path_url)
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'downloaded_image.jpg'; // Specify the file name here
                    link.click();

                    // Clean up
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => console.error('Error downloading the image:', error));
        }
    }else{
       
        timelapseStore.timelapseImageList.forEach( (image) => {
            if( timelapseStore.image_ids.includes(image.id) ){
                files.value.push(image.image_path)
            } 
        })
        await timelapseStore.downloadTimeLapseZip({files: files.value})
        files.value = []
    }
}
function checkOrUncheckedAll(){
    console.log("isAllSelected.value", isAllSelected.value)
    setTimeout(()=>{
        if(isAllSelected.value == true){
            timelapseStore.timelapseImageList.forEach((item)=>{
                if (!timelapseStore.image_ids.includes(item)) {
                     timelapseStore.image_ids.push(item.id)
                }
            })
        }else{
            timelapseStore.image_ids = []
        }

    }, 100)
   
   
}
function jumpPage(page){
    timelapseStore.paginate.page = page;
    getTimelapseImage(timelapseStore.selectedCamera)
}
async function getTimelapseCalendarData(cameraId=null){
    globalLoader(true)
    let payload = {
        camera: cameraId ?? timelapseStore.selectedCamera,
        start_date: multiCalendarDateTime.value.startDate,
        end_date: multiCalendarDateTime.value.endDate
    }
    await timelapseStore.getTimelapseImageAvailability(payload)
    availableInDates.value.data = timelapseStore.timelapseImageAvailability
    globalLoader(false)
}

const handleResize = debounce(async () => {
    useCookie('camera_details').value = timelapseStore.selectedCameraDetails
    await asMounted(true)
}, 1000);
function handleImgError(event) {
  event.target.setAttribute("src", "/img/empty_img_small.jpg");
}
</script>
<style scoped>
.color-active{
    color: #e8b100;
}
</style>
