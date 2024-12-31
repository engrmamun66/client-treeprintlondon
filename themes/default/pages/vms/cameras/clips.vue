<template>
    <div>
    <Breadcrumb title="Camera List" :links="['cameras']"></Breadcrumb>
    <div class="ionic-card">
      <div
        class="ionic-card-header m-card-header card-header-border"
      >
        <h4 class="fs-18">Clips</h4>
        <div class="card-header-rightside d-flex align-items-center justify-content-between">
          <select style="width: 200px" class="form-control mt-1" v-model="selectedCamera" @change="getClipListByCameraId">
            <option value="null">Select Camera </option>
            <option
                v-for="(
                camera, index
                ) in cameraStore.cameraListBySiteId"
                :key="index"
                :value="camera.id"
            >
            
                {{ camera.name }}
            </option>
        </select>
        <button 
            type="button" 
            @click="openClipsDownloadModal()" 
            class="ionic-btn ionic-theme-btn2">
            <i class="la la-plus"></i>Clips
        </button>
      </div>
        
      </div>
     
      <div class="ionic-card-body">
        <div class="table-responsive">
          <table class="table table-borderless">
            <thead>
              <tr>
                <th>Download Availability	</th>
                <th>Details</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="empty-tr">
                <td colspan="4"></td>
              </tr>
            
              <template
                v-if="
                  showEffect 
                "
              >
                <tr
                  v-for="(clip, index) in galleryStore.filteredVideoClips?.length ||
                  10"
                  :key="index"
                >
                  <td>
                    <ShimmerEffect
                      bg="light"
                      height="35px"
                      radius="10px"
                    ></ShimmerEffect>
                  </td>
                  <td>
                    <ShimmerEffect
                      bg="light"
                      height="35px"
                      radius="10px"
                    ></ShimmerEffect>
                  </td>
                  <td>
                    <ShimmerEffect
                      bg="light"
                      height="35px"
                      radius="10px"
                    ></ShimmerEffect>
                  </td>
                </tr>
              </template>

              <template v-else>
                <tr v-for="(clip, index) in galleryStore.filteredVideoClips" :key="index" >
                  <td>
                    <p>Expires {{ moment(JSON.parse(clip.options).expireTimestamp).format('YYYY-MM-DD hh:mm:ss A') }} </p>
                  </td>

                  <td>
                    <p>{{JSON.parse(clip.options).arguments.originalRequest.name}}<br> 
                        {{moment(JSON.parse(clip.options).arguments.originalRequest.startTimestamp, 'YYYYMMDDHHmmss').format('YYYY-MM-DD')}}&nbsp;
                        {{moment.utc(JSON.parse(clip.options).arguments.originalRequest.startTimestamp, 'YYYYMMDDHHmmss').tz(clip?.camera?.timezone ?? 'US/Central').format('hh:mm:ss A')}} -
                        {{moment.utc(JSON.parse(clip.options).arguments.originalRequest.endTimestamp, 'YYYYMMDDHHmmss').tz(clip?.camera?.timezone ?? 'US/Central').format('hh:mm:ss A')}}
                      ( {{getTimeDifferences(JSON.parse(clip.options).arguments.originalRequest.endTimestamp, JSON.parse(clip.options).arguments.originalRequest.startTimestamp )}} )
                                             
                    </p>
                  </td>

                  <td>
                    <div
                      class="d-flex justify-content-center tableaction-td pt-2"
                    >
                      <p
                       @click="downloadsClipsAsZip(clip)" 
                        tooltip="Download clip"
                        flow="up"
                      >
                          <i class="las la-cloud-download-alt size-sm ms-2 cp"></i>
                      </p>
                      <!-- <p
                        tooltip="Copy to clip board"
                        flow="up"
                      >
                        <i class="las la-check-square size-sm ms-2 cp"></i>
                      </p>
                      <p tooltip="Edit notes" flow="up">
                        <i class="las la-edit size-sm ms-2 cp"></i>
                      </p> -->
                    </div>
                  </td>
                </tr>
                <tr class="empty-tr" v-if="!galleryStore.exportedClipsFromEEN && !showEffect">
                  <td colspan="5" class="text-center">No data available</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <template v-if="showEffect">
            <div class="d-flex justify-content-end align-items-center my-3">
              <ShimmerEffect
                bg="dark"
                width="64px"
                height="12px"
                class="me-4"
                speed="1s"
                radius="2px"
                :stopAnimaiton="false"
              ></ShimmerEffect>
              <ShimmerEffect
                bg="dark"
                width="64px"
                height="12px"
                class="me-4"
                speed="1s"
                radius="2px"
                :stopAnimaiton="false"
              ></ShimmerEffect>
              <ShimmerEffect
                bg="dark"
                width="64px"
                height="12px"
                class="me-4"
                speed="1s"
                radius="2px"
                :stopAnimaiton="false"
              ></ShimmerEffect>

              <ShimmerEffect
                bg="dark"
                width="32px"
                height="32px"
                class="me-2"
                speed="1s"
                :stopAnimaiton="false"
              >
              </ShimmerEffect>
              <ShimmerEffect
                bg="dark"
                width="32px"
                height="32px"
                class="me-2"
                speed="1s"
                :stopAnimaiton="false"
              >
              </ShimmerEffect>
              <ShimmerEffect
                bg="dark"
                width="32px"
                height="32px"
                class="me-2"
                speed="1s"
                :stopAnimaiton="false"
              >
              </ShimmerEffect>
              <ShimmerEffect
                bg="dark"
                width="32px"
                height="32px"
                class="me-2"
                speed="1s"
                :stopAnimaiton="false"
              >
              </ShimmerEffect>
            </div>
          </template>
          <template v-else>
            <div class="d-flex justify-content-end align-items-center my-3">
              <p class="me-4">
                <strong class="text-white-50">
                  Total: {{ galleryStore?.filteredVideoClipsPaginateData?.total }}
                  <span class="mx-3">|</span>
                  Page: {{ galleryStore?.filteredVideoClipsPaginateData?.current_page }}
                  <span class="mx-3">|</span>
                  Showing: {{ galleryStore?.filteredVideoClips?.length || 0 }}
                </strong>
              </p>
              <PaginationRentMy
                v-model="galleryStore.filteredVideoClipsPaginateData"
                @jumpToPage="
                  (page) => {
                    galleryStore.jumpTofilteredVideoClipsPage(page);
                  }
                "
              ></PaginationRentMy>
            </div>
          </template>
      </div>

    </div>
    <section
        v-if="showClipsDownloadModal"
        class="modal fade addnew-product-modal"
        tabindex="-1"
       
        style="display: block; opacity: unset"
        >
            <div class="modal-dialog modal-dialog-centered" @click.stop="closeClipsDownloadModal()">
                <div class="modal-content" @click.stop="false">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Add clips</h1>
                    <button
                    @click.stop="closeClipsDownloadModal()"
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    >
                    <i class="la la-close"></i>
                    </button>
                </div>
                <div class="modal-body" @click.stop="false">
                    <div class="modal-body-inner ionic-form-area">
                      <div class="row">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label class="form-label">Company</label>
                            <template v-if="modelEffect">
                              <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                            </template>
                            <template v-else>
                              <select
                                class="form-control"
                                @change="onChangeCompany"
                                 v-model="downloadClipsFormData.company_id"
                              >
                                <option
                                  v-for="(value, index) in companyStore.companies"
                                  :key="index"
                                  :value="value.id"
                                >
                                  {{ value.company_name }}
                                </option>
                              </select>
                            </template>
                          </div>
                      </div>
                  <!-- Site -->
                      <div class="col-md-12">
                        <div class="form-group">
                          <label class="form-label">Site</label>
                          <template v-if="modelEffect">
                            <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                          </template>
                          <template v-else>
                            <select
                              class="form-control"
                               v-model="downloadClipsFormData.site_id"
                              @change="onChangeSite"
                            >
                            <option value="null">Select Site </option>
                              <option
                                v-for="(
                                  value, index
                                ) in companyStore.companySiteList"
                                :key="index"
                                :value="value.id"
                              >
                                {{ value.title }}
                              </option>
                            </select>
                          </template>
                        </div>
                      </div>
                    <!-- Camera -->
                      <div class="col-md-12">
                          <div class="form-group">
                              <label class="form-label">Camera</label>
                                  <select
                                      class="form-control"
                                          v-model="downloadClipsFormData.camera_id"
                                          @change="onchangeCamera"
                                      >
                                      <option value="null">Select Camera </option>
                                      <option
                                          v-for="(
                                          camera, index
                                          ) in cameraStore.cameraListBySiteId"
                                          :key="index"
                                          :value="camera.id"
                                      >
                                          {{ camera.name }}
                                      </option>
                                      </select>
                          </div>
                      </div>
                        <div class="col-md-6">
                            <label class="form-label mb-2">Start :</label>
                            <div class="time-period">
                                <Picker-EmDateTimePicker
                                v-model="startDateTime"
                                ref="startDateTimePicker"
                                @change="
                                    (data) => {
                                        endDateTime.startDate = data.startDate
                                        endDateTimePicker.setDate(data.startDate)
                                    }
                                "
                                :nextIcon="false"
                                :options="{...globalData.datePickerOptions,  timePicker: true, displayIn: 'modal', adjustX: 0, adjustY: 12}"
                                />
                            </div>
                        </div>
                        <div class="col-md-6">
                                <div class="ionic-form-area">
                                    <div class="row">
                                        <label class="form-label">Stop:</label>
                                        <div class="col-md-12">
                                        <div class="form-group">
                                            <div class="time-box">
                                                <div class="time-box-input">
                                                    <Picker-EmDateTimePicker
                                                    ref="endDateTimePicker"
                                                    v-model="endDateTime"
                                                    @change="
                                                        (data) => {
                                                            startDateTime.startDate = data.startDate
                                                            startDateTimePicker.setDate(data.startDate)
                                                        }
                                                    "
                                                    :nextIcon="false"
                                                    :options="{...globalData.datePickerOptions,  timePicker: true, displayIn: 'modal', adjustX: 0, adjustY: 12}"
                                                    />
                                                </div>
                    
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                       
                        <div class="row">
                            <label class="form-label">Description :</label>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <input type="text" v-model="downloadClipsFormData.info.name" class="form-control">
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <label class="form-label">Note :</label>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <textarea row="3" v-model="downloadClipsFormData.info.notes" class="form-control">
                                    </textarea>
                                </div>
                            </div>
                        </div>
                             
                             
                    </div>
                </div>
                <div class="modal-footer justify-content-between ps-0 pe-0">
                    <template v-if="modelEffect">
                    <ShimmerEffect
                        bg="dark"
                        height="52px"
                        width="140px"
                        radius="20px"
                    ></ShimmerEffect>
                    <ShimmerEffect
                        bg="dark"
                        height="52px"
                        width="140px"
                        radius="20px"
                    ></ShimmerEffect>
                    </template>
                    <template v-else>
                    <button
                        type="button"
                        class="ionic-btn ionic-border-btn cancel-btn"
                        @click="closeClipsDownloadModal()"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        class="ionic-btn ionic-theme-btn2 save-btn"
                        @click="saveClipsDownloadForm()"

                    >
                    Save
                    <BtnLoader :show="H.isPendingAnyApi('Gallery:downloadClipsFromEEN')" ></BtnLoader>
                </button>
                    </template>
                </div>
                </div>
            </div>
        </section>

  </div>
  </template>
  <script setup>
  import moment from "moment-timezone";
  import { useGalleryStore} from '~/stores/vms/gallery'
  import { useCompaniesStore } from "~/stores/vms/company";
  import { useCameraStore } from '~/stores/vms/camera';
  import { useSitesStore } from "~/stores/vms/sites";
  const cameraStore  = useCameraStore();
  const commonStore = useCommonStore();
  const companyStore = useCompaniesStore();
  const siteStore = useSitesStore();
  //reactive data import
  const galleryStore = useGalleryStore()
  const modelEffect = ref(false)
  definePageMeta({
    keepalive: false,
    middleware: ["auth"],
    key: (route) => route.fullPath,
  });
  useHead({
    titleTemplate: "%s | Clip list",
  });

  onMounted(async () => {
    showEffect.value = true
    if(useCookie('header_company').value == 'all'){
        await companyStore.getCompanyList();
        let company_id = companyStore.companies[0]?.id;
        useCookie("header_company").value = company_id;
        companyStore.headerSelectedCompany =  company_id;
        await companyStore.showCompanySite(company_id);
    }
    if( useCookie("header_site").value && useCookie("header_site").value !='all'){
      await cameraStore.getCameraListBySiteId(useCookie("header_site").value)
    }
    await galleryStore.filterDownloadedVideoClipsFromEEN(queryParams.value)
    setTimeout(()=>{
      showEffect.value = false
    })
  });
  let showEffect = ref(false)
  let queryParams = ref({
    company_id : useCookie('header_company').value & useCookie('header_company').value != 'all' ? useCookie('header_company').value : null,
    site_id : useCookie('header_site').value & useCookie('header_site').value != 'all' ? useCookie('header_site').value : null,
    camera_id : null
  })
  //clips download
  let startDatePicker  = ref(null)
  let showClipsDownloadModal = ref(false)
  let startDateTimePicker = ref(null)
  let endDateTimePicker = ref(null)
  let startDate = ref({
      startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
      endDate: H.formatDate(new Date(), "YYYY-MM-DD"),
  });
  let startTime = ref({
    startTime: H.formatDate(new Date(), "hh:mm A"),
    endTime: H.formatDate(new Date(), "hh:mm A"),
  });
  let startDateTime = ref({
      startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
      startTime: H.formatDate(new Date(), "hh:mm A"),
  });
  let endDateTime = ref({
      startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
      startTime: H.formatDate(new Date(), "hh:mm A"),
  });
  let downloadClipsFormData = ref({
      company_id: null,
      site_id: null,
      camera_id: null,
      deviceId: null,
      autoDelete: true,
      type: 'video',
      info: {
          directory: "/",
          name: null,
          notes: null
      },
      period: {
          startTimestamp: null,
          endTimestamp: null
      }
  })
  let selectedCamera = ref(null)
  watch(() => startDateTime.value.startDate, (newVal, oldVal)=>{
    
       
  
    if(newVal != oldVal){
      if(downloadClipsFormData.value.camera_id){
        let filteredCamera = cameraStore.cameraListBySiteId.filter(item=>{
          return item.id ==   downloadClipsFormData.value.camera_id
        })
        downloadClipsFormData.value.info.name =  `Video ${filteredCamera[0]?.name} ${newVal}  ${startDateTime.value.startTime}`
        // Parse the date and time in the format 'YYYY-MM-DD hh-mm-ss A'
      }
    }
})
watch(() => startDateTime.value.startTime, (newVal, oldVal)=>{
    if(newVal != oldVal){
      if(downloadClipsFormData.value.camera_id){
        let filteredCamera = cameraStore.cameraListBySiteId.filter(item=>{
          return item.id ==   downloadClipsFormData.value.camera_id
        })
        downloadClipsFormData.value.info.name =  `Video ${filteredCamera[0]?.name} ${startDateTime.value.startDate}  ${newVal}`
      }
    }
})
async function saveClipsDownloadForm(){
    if(!downloadClipsFormData.value.camera_id){
      Toaster.error("Please select a camera")
      return
    }
    const parsedStartDateTime = moment(`${startDateTime.value.startDate} ${startDateTime.value.startTime}`, 'YYYY-MM-DD hh-mm-ss A');
    downloadClipsFormData.value.period.startTimestamp = parsedStartDateTime.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const parsedEndDateTime = moment(`${endDateTime.value.startDate} ${endDateTime.value.startTime}`, 'YYYY-MM-DD hh-mm-ss A');
    downloadClipsFormData.value.period.endTimestamp = parsedEndDateTime.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    let payload = {
        camera_id: downloadClipsFormData.value.camera_id,
        device_id: downloadClipsFormData.value.deviceId,
        name:   downloadClipsFormData.value.info.name,
        notes:  downloadClipsFormData.value.info.notes,
        start_timestamp: downloadClipsFormData.value.period.startTimestamp,
        end_timestamp:   downloadClipsFormData.value.period.endTimestamp
    }
    await galleryStore.downloadClipsFromEEN(payload)
    startDate.value.startDate = startDateTime.value.startDate
    await galleryStore.filterDownloadedVideoClipsFromEEN(queryParams.value)
    showClipsDownloadModal.value = false
    await resetDownloadClipForm()
    setTimeout(async ()=>{
      await galleryStore.filterDownloadedVideoClipsFromEEN(queryParams.value)
    }, 1000*60)
    
    // setTimeout(async ()=>{
    //   await galleryStore.filterDownloadedVideoClipsFromEEN(queryParams.value)
    // }, 1000*60*60)

}
async function resetDownloadClipForm(){
    startDateTimePicker.value.setDate = {
        startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
    };
    startDateTimePicker.value.setTime = {
        startTime: H.formatDate(new Date(), "hh:mm A"),
    };

    endDateTimePicker.value.setDate = {
        startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
    };
    endDateTimePicker.value.setTime = {
        startTime: H.formatDate(new Date(), "hh:mm A"),
    };
    
    startDateTime.value = {
        startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
        startTime: H.formatDate(new Date(), "hh:mm A"),
    };
    endDateTime.value = {
        startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
        startTime: H.formatDate(new Date(), "hh:mm A"),
    }

    downloadClipsFormData.value = {
        company_id: null,
        site_id: null,
        camera_id: null,
        deviceId: null,
        autoDelete: true,
        type: 'video',
        info: {
            directory: "/",
            name: null,
            notes: null
        },
        period: {
            startTimestamp: null,
            endTimestamp: null
        }
    }
}
function getTimeDifferences(time2, time1){
    // Parse the timestamps
    const momentTime1 = moment(time1, 'YYYYMMDDHHmmss');
    const momentTime2 = moment(time2, 'YYYYMMDDHHmmss');
    //  const momentTime1 = moment(time1, 'YYYYMMDDHHmmss').tz(timezone);
    //  const momentTime2 = moment(time2, 'YYYYMMDDHHmmss').tz(timezone);
    // Calculate the difference in milliseconds
    const diffInMilliseconds = momentTime2.diff(momentTime1);
    // Convert milliseconds to duration
    const duration = moment.duration(diffInMilliseconds);
    // Extract hours, minutes, and seconds
    const hours = Math.floor(duration.hours()); // Extract hours
    const minutes = duration.minutes(); // Extract minutes
    const seconds = duration.seconds(); // Extract seconds
    let timeString = '';
    if (hours > 0) {
        timeString += `${hours} h `;
    }
    if (minutes > 0) {
        timeString += `${minutes} m `;
    }
    if (seconds > 0) {
        timeString += `${seconds} s`;
    }
    // Trim any extra space from the result
    return timeString.trim();
}

async function openClipsDownloadModal(){
    if(useCookie('header_site').value != 'all' & useCookie('header_site').value){
        await cameraStore.getCameraListBySiteId(useCookie('header_site').value)
    }
    downloadClipsFormData.value.company_id = useCookie('header_company').value
    downloadClipsFormData.value.site_id = useCookie('header_site').value
    downloadClipsFormData.value.camera_id = selectedCamera.value
    showClipsDownloadModal.value = true;
    if(selectedCamera.value){
      let filteredCamera = cameraStore.cameraListBySiteId.filter(item=>{
        return item.id == selectedCamera.value
      })
      downloadClipsFormData.value.info.name =  `Video ${filteredCamera[0]?.name} ${startDate.value.startDate} ${startTime.value.startTime}`
      downloadClipsFormData.value.deviceId = filteredCamera[0]?.een_camera_id
    }
    
}
async function closeClipsDownloadModal(){
    await resetDownloadClipForm()
    showClipsDownloadModal.value = false
}
async function onChangeCompany(event){
   
    useCookie('header_company').value = event.target.value
    companyStore.headerSelectedCompany = event.target.value
    downloadClipsFormData.value.company_id = event.target.value
    downloadClipsFormData.value.site_id = null
    downloadClipsFormData.value.camera_id = null
    cameraStore.cameraListBySiteId = []
    useCookie('header_site').value = 'all'
    siteStore.headerSelectedSite = 'all'
    await companyStore.showCompanySite(event.target.value)
    await galleryStore.filterDownloadedVideoClipsFromEEN({company_id: event.target.value})
    downloadClipsFormData.value.info.name = null

}
async function onChangeSite(event){
    downloadClipsFormData.value.camera_id = null
    useCookie('header_site').value = event.target.value
    siteStore.headerSelectedSite = event.target.value
    await cameraStore.getCameraListBySiteId(event.target.value)
    await galleryStore.filterDownloadedVideoClipsFromEEN({company_id: downloadClipsFormData.value.company_id, site_id: event.target.value})
    downloadClipsFormData.value.info.name = null
}
async function onchangeCamera(event){
  let cameraId = event.target.value
  let filteredCamera = cameraStore.cameraListBySiteId.filter(item=>{
    return item.id == cameraId
  })
  downloadClipsFormData.value.info.name =  `Video ${filteredCamera[0]?.name} ${startDate.value.startDate} ${startTime.value.startTime}`
  downloadClipsFormData.value.deviceId = filteredCamera[0]?.een_camera_id
}
async function getClipListByCameraId(event){
  selectedCamera.value = event.target.value
  queryParams.value.camera_id = event.target.value
  downloadClipsFormData.value.camera_id =  event.target.value
  await galleryStore.filterDownloadedVideoClipsFromEEN(queryParams.value)

}
async function downloadsClipsAsZip(clip){
    await siteStore.getSiteCamerasLiveFeed(clip.camera_id)
    const url = `${siteStore.siteCamerasLiveFeed.een_base_url}/api/v3.0/downloads/${clip.job_id}:download`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/octet-stream',
        authorization: `Bearer ${siteStore.siteCamerasLiveFeed.access_token}`
      }
    };

    fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error('error:' + err));
}
</script>
  