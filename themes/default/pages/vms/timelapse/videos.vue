<template>
    <div>
      <Breadcrumb title="Timelapse Videos" :links="['timelapseVideo']"></Breadcrumb>
      <div class="ionic-card">
        <div
          class="ionic-card-header card-header-border d-flex justify-content-between align-items-center"
        >
          <h4 class="fs-18">Videos</h4>
          <div class="card-header-rightside">
            <button
                @click="openTimelapseCreateModal"
                class="ionic-btn ionic-theme-btn2 addnew-product-btn"
                >
                <i class="las la-plus"> </i> Timelapse
                <BtnLoader v-if="showBtnLoader" :show="true"></BtnLoader>
            </button>   
          </div>
        </div>
    
        <div class="ionic-card-body">
          <div class="table-responsive">
            <table class="table table-borderless">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Company</th>
                  <th>Site</th>
                  <th>Camera</th>
                  <th>Video Time</th>
                  <th>Created By</th>
                  <th>Created On</th>
                  <th>Status</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr class="empty-tr">
                  <td colspan="4"></td>
                </tr>
                <template v-if="showEffect">
                  <tr
                    v-for="(x, index) in timelapseStore?.timelapseVideoList?.length"
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
                  <template v-if="timelapseStore?.timelapseVideoList.length">
                    <template v-for="(video, index) in timelapseStore?.timelapseVideoList" :key="index"> 
                        <tr>
                            <td>{{ index+1 }}</td>
                            <td>
                              <nuxt-link :to="`/vms/companies/${video?.company?.id}/details`"><p class="cp p-0">{{ video?.company?.company_name }}</p></nuxt-link>
                            </td>
                            <td>
                              <nuxt-link :to="`/vms/sites/${video?.site?.id}/cameras`"><p class="cp p-0">{{ video?.site?.title }}</p></nuxt-link>
                            </td>
                            <td>
                              <nuxt-link :to="`/vms/cameras/${video?.camera?.id}/timeline`"><p class="cp p-0">{{ video?.camera?.name }}</p></nuxt-link>
                            </td>
                            <td>
                              <p class="cp p-0">{{ H.formatDate(video?.start_time, 'MM-DD-YYYY hh:mm A')  }} <br> to <br> {{ H.formatDate(video?.end_time, 'MM-DD-YYYY hh:mm A') }} </p>
                            </td>
                            <td>
                              <p class="cp p-0">{{ video?.user?.first_name  }} {{ video?.user?.last_name }}</p>
                            </td>
                            <td>
                              <p class="cp p-0">{{ H.formatDate(video?.created_at, 'MM-DD-YYYY hh:mm A') }}</p>
                            </td>
                            <td>
                              <span :class="video?.status == 0 ?  'text-info' : (video?.status == 1)? 'text-success' : 'text-danger'">{{ video?.status == 0 ?  'Processing' : (video?.status == 1) ? 'Success' : 'Failed' }}</span>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center tableaction-td pt-2">
                                <p tooltip="Show video" flow="up" @click="playVideo(video)">
                                    <i-las t="view" class="size-sm cp" />
                                </p>
                                <!-- <p tooltip="Download video" flow="up" @click="download(video)">
                                  <i-las t="download"  class="size-sm cp"/>
                                </p> -->
                                <p tooltip="Delete" flow="up" @click.stop="
                                        withDelete.video = video;
                                        withDelete.showConfirmation = true;
                                    ">
                                    <i-las t="trash" class="size-sm cp"/>
                                </p>
                            </div>
                            </td>
                        </tr>
                    </template>
                  </template>
                  <template v-else>
                      <tr>
                        <td colspan="88" class="mt-1 text-center">No videos found</td>
                      </tr>
                  </template>
                </template>
              </tbody>
            </table>
    
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

              <div class="d-flex justify-content-end align-items-center my-3"
                  v-if="timelapseStore?.timelapseVideoList.length > 1">
                  <p class="me-4"> <strong class="text-white-50">       
                          Total: {{ timelapseStore?.paginateData?.total }}
                          <span class="mx-3">|</span>
                          Page: {{ timelapseStore?.paginateData?.current_page }}
                          <span class="mx-3">|</span>
                          Showing: {{ timelapseStore.timelapseVideoList?.length || 0 }}
                      </strong> </p>
                  <PaginationRentMy v-model="timelapseStore.paginateData" @jumpToPage="jumpPage"> </PaginationRentMy>
              </div>
            </template>
          </div>
        </div>
      </div>
      <!-- Modal Start -->
        <section
            v-if="showVideoPlayerModal && selectedTimelapseVideo"
            class="modal fade clips-details-modal"
            tabindex="-1"
            style="display: block; opacity: unset"
            >
            <div class="modal-dialog modal-dialog-centered" @click.stop="closeModal">
                <div class="modal-content" @click.stop="false">
                <div class="modal-header">
                    <h1 class="modal-title fs-5 me-2">
                      {{selectedTimelapseVideo?.camera?.name}}
                    </h1>
                    <span>{{ H.formatDate(selectedTimelapseVideo?.start_time, 'YYYY-MM-DD hh:mm a')  }} to {{ H.formatDate(selectedTimelapseVideo?.end_time, 'YYYY-MM-DD hh:mm a') }}</span>
                    
                    <button
                    @click.stop="closeModal"
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    >
                    <i class="la la-close"></i>
                    </button>
                </div>
                
                <div class="modal-body " @click.stop="false">
                  
                    <div class="modal-body-inner ionic-form-area">
                        <video width="600" height="400" controls autoplay>
                            <source :src="selectedTimelapseVideo?.url" type="video/mp4">
                        </video>
                    </div>
                </div>
                </div>
            </div>
        </section>
   
        <Modal-Confirm
            v-if="withDelete.showConfirmation"
            v-model="withDelete.showConfirmation"
            :skipAutoClose="true"
            @yes="
                async () => {
                    await timelapseStore.deleteTimelapseVideo(withDelete?.video?.id);
                    withDelete.showConfirmation = false;
                }
            "
            >
            Are you sure want to delete?
        </Modal-Confirm>
        <section
             v-if="timelapseStore.showTimelapseCreateModal"
             class="modal fade addnew-product-modal"
             tabindex="-1"
             style="display: block; opacity: unset"
           >
             <div class="modal-dialog modal-dialog-centered" @click.stop="closeTimelapseCreateModal">
               <div class="modal-content" @click.stop="false">
                 <div class="modal-header">
                   <h1 class="modal-title fs-5">Create Timelapse</h1>
                   <button
                    @click.stop="closeTimelapseCreateModal"
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
                          <label class="form-label">Select  Company</label>
                          <template v-if="modelEffect">
                            <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                          </template>
                          <template v-else>
                            <select
                                class="form-control"
                                @change="onChangeCompany"
                                v-model="companyStore.headerSelectedCompany"
                            >
                                <template
                                v-for="(company, index) in companyStore.companies"
                                :key="index"
                                >
                                <option :value="company.id">
                                    {{ company.company_name }}
                                </option>
                                </template>
                            </select>
                          </template>
                        </div>
                      </div>
                      <!-- Site -->
                      <div class="col-md-12">
                        <div class="form-group">
                          <label class="form-label">Select  Site</label>
                          <template v-if="modelEffect">
                            <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                          </template>
                          <template v-else>
                            <select
                                class="form-control"
                                v-model="siteStore.headerSelectedSite"
                                @change="
                                  (event) => {
                                    onChangeSite(event.target.value);
                                  }
                                "
                              >
                                <option
                                  v-for="(value, index) in companyStore.companySiteList"
                                  :key="index"
                                  :value="value.id"
                                >
                                  {{ value?.title }}
                                </option>
                              </select>
                          </template>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <label class="form-label">Select Camera</label>
                          <template v-if="modelEffect">
                            <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                          </template>
                          <template v-else>
                            <select
                                class="form-control"
                                v-model="timelapseStore.timelapseVideoForm.camera_id"
                                @change="submitTimeLapseVideoForm('check')"
                              >
                                <option
                                  v-for="(camera, index) in siteStore.site.cameras"
                                  :key="index"
                                  :value="camera.id"
                                >
                                  {{ camera?.name }}
                                </option>
                              </select>
                          </template>
                        </div>
                      </div>
                        <div class="col-md-12 my-2"> 
                          <div class="product-typeradio">
                            <label class="checkbox checkbox-pos-inline">
                              Entire Timeline
                              <input
                                type="checkbox"
                                name="product_type"
                                value="1"
                                @change="onSelectEntireTimeline()"
                                v-model="timelapseStore.timelapseVideoForm.entire_timeline"
                              />
                              <span></span>
                            </label>
                          </div>
                        </div>
                       
                       <div class="d-flex justify-content-between my-2" v-if="timelapseStore.timelapseVideoForm.entire_timeline == 0">
                         <div> 
                            <label class="form-label">Start Time</label> 
                            <div class="date-box me-3">
                                <div class="time-period">
                                    <Picker-EmDateTimePicker ref="startDatePicker" v-model="timelapseStore.timelapseVideoForm.start_time" @change="
                                        async (data) => {
                                            timelapseStore.timelapseVideoForm.start_time = data.startDate;
                                            if(timelapseStore.timelapseVideoForm.end_time){
                                              timelapseStore.timelapseVideoForm.request_type = 'check'
                                              submitTimeLapseVideoForm('check')
                                            }
                                        }
                                      "
                                        :options="{...globalData.datePickerOptions, displayIn: 'modal', adjustX: -200, adjustY: 12}" />
                                </div>
                                <button type="button" @click.stop="$refs.startDatePicker.toggle()" class="ionic-btn"><i class="la la-calendar"></i></button>
                            </div>
                         </div>
                         <div> 
                          <label class="form-label">End Time</label>
                          <div class="date-box">
                              <div class="time-period">
                                  <Picker-EmDateTimePicker ref="endDatePicker" v-model="timelapseStore.timelapseVideoForm.end_time" @change="
                                      async (data) => {
                                        timelapseStore.timelapseVideoForm.end_time = data.startDate;
                                        timelapseStore.timelapseVideoForm.request_type = 'check'
                                        submitTimeLapseVideoForm('check')
                                      }
                                    "
                                    :options="{...globalData.datePickerOptions, displayIn: 'modal',adjustX: -200,  adjustY: 12}" />
                              </div>
                              <button type="button" @click.stop="$refs.endDatePicker.toggle()"  class="ionic-btn"><i class="la la-calendar"></i></button>
                          </div>

                         </div>
                       </div>
                   
                       <!-- <div class="d-flex justify-content-between my-2">
                         <label>Total Footage Recorded
                         </label>
                         <label>{{ timelapseStore?.timelapseVideoInfoBeforeProcess ? timelapseStore?.timelapseVideoInfoBeforeProcess?.days +'days '+ timelapseStore?.timelapseVideoInfoBeforeProcess?.hours +'hours' :  'N/A' }}</label> 
                       </div> -->
                       <div class="d-flex justify-content-between my-3">
                         <label>Frame Rate Increase Video Length</label>
                         <label>{{ timelapseStore?.timelapseVideoForm?.video_duration ?? 'N/A' }}</label> 
     
                       </div>
                       <div> 
                         <label class="my-3"> Frame Rate</label>
                         <div class="product-typeradio">
                          
                           <label class="radio">
                             <input
                               type="radio"
                               name="product_type"
                               value="1"
                               v-model="timelapseStore.timelapseVideoForm.frame_rate"
                             />
                            Normal
                             <span></span>
                           </label>
                           <label class="radio">
                             <input
                               type="radio"
                               name="product_type"
                               value="2"
                               v-model="timelapseStore.timelapseVideoForm.frame_rate"
                             />
                             2x
                             <span></span>
                           </label>
                           <label class="radio">
                             <input
                               type="radio"
                               name="product_type"
                               value="3"
                               v-model="timelapseStore.timelapseVideoForm.frame_rate"
                             />
                             2x
                             <span></span>
                           </label>
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
                       @click="closeTimelapseCreateModal"
                     >
                       Cancel
                     </button>
                     <button
                       type="button"
                       class="ionic-btn ionic-theme-btn2 save-btn"
                       @click="submitTimeLapseVideoForm(type = 'create' )"

                     >
                       Save
                       <BtnLoader
                          v-if="isCreatingTimelapse"
                          color="white"
                        ></BtnLoader>
                     </button>
                   </template>
                 </div>
               </div>
             </div>
           </section>
    </div>
  </template>
  
  <script setup>
    import { useTimelapseStore } from "~/stores/vms/timelapse";
    import { useSitesStore } from "~/stores/vms/sites";
    import { useCompaniesStore } from "~/stores/vms/company";
    import { useCommonStore } from  "~/stores/Common";
    const commonStore  = useCommonStore();
    const timelapseStore = useTimelapseStore();
    const siteStore = useSitesStore();
    const companyStore = useCompaniesStore();
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
      await asMounted()
      commonStore.preloader = false
       
    })
    let isCreatingTimelapse = ref(false)
    let showVideoPlayerModal = ref(false)
    let showEffect = ref(false)
    let modelEffect =  ref(false)
    let withDelete = reactive({
        video: null,
        showConfirmation: false,
    });
    let selectedTimelapseVideo = ref(null)
    let files = ref([])
    let showBtnLoader = ref(false)
    useNuxtApp().$on("mountTimeLapseVideo", () => {
        setTimeout(async()=>{
            await asMounted()
        }, 100)
    });
    async function asMounted(){
      globalLoader(true)
      timelapseStore.paginateVideos.site_id = useCookie('header_site').value == 'all' ? null : useCookie('header_site').value
      timelapseStore.paginateVideos.company_id = (useCookie('header_company').value  && useCookie('header_company').value != 'all') ? useCookie('header_company').value : null   
      await timelapseStore.getTimelapseVideoList()
      globalLoader(false)
    }
    function closeModal(){
        showVideoPlayerModal.value = false
      
    }
    function playVideo(video){
      showVideoPlayerModal.value = true
      selectedTimelapseVideo.value = video
    }
    function jumpPage(page){
        timelapseStore.paginateVideos.page = page;
        timelapseStore.getTimelapseVideoList()
    }
    async function download(video){
      files.value.push(video.video_file)
      await timelapseStore.downloadTimeLapseZip({files: files.value})
      files.value = []
    }
    async function openTimelapseCreateModal(){
      showBtnLoader.value = true
      if(useCookie("header_company").value == "all" || useCookie("header_company").value == "null"){
        await companyStore.showCompanySite(companyStore.companies[0].id);
        useCookie("header_company").value == companyStore.companies[0].id
        companyStore.headerSelectedCompany = companyStore.companies[0].id
        if(companyStore.companySiteList.length){
          await siteStore.getSite(companyStore.companySiteList[0].id);
          siteStore.headerSelectedSite = companyStore.companySiteList[0].id
          useCookie("header_site").value == companyStore.companySiteList[0].id
        }else{
          Toaster.error('No sites available for this company')
        }
      }else{
        await companyStore.showCompanySite(useCookie("header_company").value);
        if(companyStore.companySiteList.length && useCookie("header_site").value !='all' && useCookie("header_site").value =='null'){
          await siteStore.getSite(useCookie("header_site").value);
          companyStore.headerSelectedCompany = useCookie("header_company").value
          siteStore.headerSelectedSite = useCookie("header_site").value
          
        }else if(companyStore.companySiteList.length && ( useCookie("header_site").value =='all' || useCookie("header_site").value =='null') ){
          await siteStore.getSite(companyStore.companySiteList[0].id);
          siteStore.headerSelectedSite = companyStore.companySiteList[0].id
          useCookie("header_site").value = companyStore.companySiteList[0].id
        }else{
          Toaster.error('No sites available for this company')
        }
     
      }
      showBtnLoader.value = false
      timelapseStore.showTimelapseCreateModal = true
    }
    async function resetFromData(){
      if(useCookie("header_company").value == "all" || useCookie("header_company").value == "null"){
        await companyStore.showCompanySite(companyStore.companies[0].id);
        await siteStore.getSite(companyStore.companySiteList[0].id);
        companyStore.headerSelectedCompany = companyStore.companies[0].id
        siteStore.headerSelectedSite = companyStore.companySiteList[0].id
      }else{
        await companyStore.showCompanySite(useCookie("header_company").value);
        await siteStore.getSite(useCookie("header_site").value);
        companyStore.headerSelectedCompany = useCookie("header_company").value
        siteStore.headerSelectedSite = useCookie("header_site").value
      }
      timelapseStore.timelapseVideoForm = {
          entire_timeline: 0,
          camera_id: useRoute().params.id,
          total_images: 0,
          frame_rate: 1,
          start_time: H.formatDate(new Date(), "YYYY-MM-DD"),
          end_time: H.formatDate(new Date(), "YYYY-MM-DD"),
          request_type: "check",
          video_duration: null
      }
    }
    function closeTimelapseCreateModal(){
      timelapseStore.showTimelapseCreateModal = false
      resetFromData()
    }

async function onChangeCompany(event) {
    useCookie("header_company").value = event.target.value;
    companyStore.companySiteList = [];
    setTimeout(async () => {
      if (event.target.value == "all") {
          Toaster.warning("Please select a company");
          return;
      } else {
          if(useCookie("header_company").value == "all" || useCookie("header_company").value == "null"){
            await companyStore.showCompanySite(companyStore.companies[0].id);
          }else{
            await companyStore.showCompanySite(event.target.value);
          }
      }
    }, 100);
}

async function onChangeSite(siteId) {
  useCookie("header_site").value = siteId;
  setTimeout(async () => {
      if (useCookie("header_site").value) {
        siteStore.getSite(useCookie("header_site").value);
      }

  }, 100);
}
async function onSelectEntireTimeline(){
  timelapseStore.timelapseVideoForm.request_type = 'check' 
  if(timelapseStore.timelapseVideoForm.entire_timeline){
    submitTimeLapseVideoForm('check')
  }
}
async function submitTimeLapseVideoForm(type){
    if(siteStore.headerSelectedSite!='all' & !siteStore.headerSelectedSite){
      Toaster.error('Select site first')
      return
    }
    if(!timelapseStore.timelapseVideoForm.camera_id){
      Toaster.error('Select camera first')
      return
    }
    if(type=="check"){
        timelapseStore.checkSnapshotsAvailability(timelapseStore.timelapseVideoForm)
    }else{
      if(timelapseStore.timelapseVideoForm.entire_timeline == 0 && timelapseStore.timelapseVideoForm.camera_id == null){
        Toaster.error('Please select a camera')
      }else{
        isCreatingTimelapse.value = true
        await  timelapseStore.saveTimeLapse(timelapseStore.timelapseVideoForm)
        isCreatingTimelapse.value = false
       resetFromData()


      }  
    }
}
</script>
  
  <style scoped>
  /* Add your styles here */
  .btn-primary {
    background-color: #188653;
  }
  .alert {
    margin-top: 20px;
  }
  .required {
    color: red;
  }
  </style>
  