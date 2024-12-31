<template>
    <div>
      <Breadcrumb title="Audio List" :links="['audio']"></Breadcrumb>
      <div class="ionic-card">
            <div
            class="ionic-card-header m-card-header card-header-border"
            >
            <h4 class="fs-18">Audios</h4>
            <div class="card-header-rightside d-flex align-items-center justify-content-start">
                <div class="form-group mt-0 mb-0">
                        <template v-if="modelEffect">
                            <ShimmerEffect
                                bg="dark"
                                height="48px"
                                radius="15px"
                            ></ShimmerEffect>
                        </template>
                        <template v-else>
                            <template v-if="modelEffect">
                                <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                            </template>
                            <template v-else>
                                <select style="width: 200px" class="form-control mt-1" v-model="selectedCamera" @change="getAudioListByCameraId">
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
                         
                            </template>
                        </template>
                </div>
                <button
                    @click="openAudioModal"
                    class="ionic-btn ionic-theme-btn2 ionic-btnlg addnew-product-btn"
                >
                    <i class="las la-microphone"></i> Audio
                </button>
            </div>
            </div>
            <div class="ionic-card-body">
                <div class="table-responsive">
                    <table class="table table-borderless">
                        <thead>
                            <tr>
                            <th>Company</th>
                            <th>Site</th>
                            <th>Camera</th>
                            <th>Audio</th>
                            <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="empty-tr">
                                <td colspan="4"></td>
                            </tr>
                          
                            <template v-if="showEffect">
                            <tr v-for="(x, index) in cameraStore?.audioList?.length || 10" :key="index">
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
                                <tr v-for="(audio, index) in cameraStore?.audioList" :key="index">
                                    <td> <p class="p-0">{{ audio.company.company_name }}</p></td>
                                    <td> <p class="p-0">{{ audio.site.title }}</p></td>
                                    <td> <p class="p-0">{{ audio.camera.name }}</p></td>
                                    <td> <p @click="toggleAudioPlayer(audio.id)">
                                            <i v-if="selectedAudio !== audio.id || !showAudioPlayer" class="lar la-play-circle size-sm cp"></i>
                                            <i v-else class="las la-minus-circle size-sm cp"></i>
                                        </p> 
                                        <audio v-if="selectedAudio==audio.id && showAudioPlayer" :src="audio?.file_path_url" controls class="styled-audio"></audio> </td>
                                    <td> <p class="p-0">{{ H.formatDate(audio.created_at, 'MM-DD-YYYY hh:mm a') }}</p></td>
                                </tr>
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
                    <div class="d-flex justify-content-end align-items-center my-3">
                        <p class="me-4">
                        <strong class="text-white-50">
                            Total: {{ cameraStore?.audioPaginateData?.total }}
                            <span class="mx-3">|</span>
                            Page: {{ cameraStore?.audioPaginateData?.current_page }}
                            <span class="mx-3">|</span>
                            Showing: {{ cameraStore?.audioList?.length || 0 }}
                        </strong>
                        </p>
                        <PaginationRentMy
                        v-model="cameraStore.audioPaginateData"
                        @jumpToPage="
                            (page) => {
                                jumpPage(page);
                            }
                        "
                        ></PaginationRentMy>
                    </div>
                    </template>
                </div>
                </div>
            </div>
        <section
        v-if="cameraStore.showAudioModal"
        class="modal fade addnew-product-modal"
        tabindex="-1"
        style="display: block; opacity: unset"
      >
        <div
          class="modal-dialog modal-dialog-centered"
          @click.stop="closeAudioModal"
        >
          <div class="modal-content" @click.stop="false">
            <div class="modal-header">
              <h1 class="modal-title fs-5">Add audio</h1>
              <button
                @click.stop="closeAudioModal"
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
                  <!-- Company Name -->
                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="form-label">Company</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <select
                          class="form-control"
                          v-model="audioFormdata.company_id"
                          @change="onChangeCompany"
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
                          v-model="audioFormdata.site_id"
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
                            <template v-if="modelEffect">
                                <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                            </template>
                            <template v-else>
                                <select
                                    class="form-control"
                                        v-model="audioFormdata.camera_id"
                                        @change="(e)=> selectedCamera = e.target.value"
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
                            </template>
                        </div>
                    </div>
                    <div class="col-md-12 mb-3">
                            <label class="form-label mb-2">Date time</label>
                            <div class="time-period">
                                <Picker-EmDateTimePicker
                                v-model="audioDateTime"
                                ref="audioDateTimePicker"
                                @change="
                                    (data) => {
                                    }
                                "
                                :nextIcon="false"
                                :options="{...globalData.datePickerOptions,  timePicker: true, displayIn: 'modal', adjustX: 0, adjustY: 12}"
                                />
                            </div>
                    </div>
                    <div class="col-md-4 my-3"> 
                        <div class="product-typeradio my-3">
                        <label class="checkbox checkbox-pos-inline">
                            Repeat
                            <input
                            type="checkbox"
                            name="product_type"
                            value="1"
                            v-model="audioFormdata.is_repeat"
                            />
                            <span></span>
                        </label>
                        </div>
                    </div>
                    <div class="col-md-8" v-if="audioFormdata.is_repeat">
                        <div class="form-group">
                            <label class="form-label">Type</label>
                            <template v-if="modelEffect">
                                <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                            </template>
                            <template v-else>
                                <select
                                    class="form-control"
                                        v-model="audioFormdata.repeatation_type"
                                    >
                                    <!-- <option value="does_not_repeat">Does not repeat </option> -->
                                    <option value="daily">
                                        Daily
                                    </option>
                                    <!-- <option value="weekly">
                                        Weekly
                                    </option> -->
                                    <!-- <option value="monthly">
                                        Monthly
                                    </option>
                                    <option value="annualy">
                                        Annualy
                                    </option>
                                    <option value="every_weekday">
                                        Every Weekday
                                    </option> -->
                                    </select>
                            </template>
                        </div>
                    </div>
                    
                  <div class="col-md-12">
                    <div class="form-group">
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                            <div class="ionic-img-upload-area">
                            <el-audio-file-input
                            v-model="audioFormdata.audio_file"
                            ></el-audio-file-input>
                            </div>
                      </template>
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
                  @click="closeAudioModal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="ionic-btn ionic-theme-btn2 save-btn"
                  @click="submitAudioSaveForm"
                >
                 Save
                </button>
              </template>
            </div>
          </div>
        </div>
      </section>
    </div>

    
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useCompaniesStore } from "~/stores/vms/company";
  import { useCommonStore } from "~/stores/Common";
  import { useCameraStore } from '~/stores/vms/camera';
  import { useSitesStore } from "~/stores/vms/sites";
  const cameraStore  = useCameraStore();
  const commonStore = useCommonStore();
  const companyStore = useCompaniesStore();
  const siteStore = useSitesStore();
  const modelEffect = ref(false);
  const showEffect = ref(true);
  const selectedCamera = ref(null)
  const selectedAudio = ref(null)
  const showAudioPlayer = ref(false)
  definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

  let audioDateTimePicker = ref(null)
  let audioDateTime = ref({
    startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
    startTime: H.formatDate(new Date(), "hh:mm A"),
  });
  const audioFormdata = ref({
    company_id: null,
    site_id: null,
    camera_id: null,
    audio_file: null,
    date_time: null,
    is_repeat: 0,
    repeatation_type: 'daily'
  });

  onMounted(async () => {
    commonStore.preloader = true;
    if(useCookie('header_company').value == 'all'){
        await companyStore.getCompanyList();
        let company_id = companyStore.companies[0]?.id;
        useCookie("header_company").value = company_id;
        companyStore.headerSelectedCompany =  company_id;
        await companyStore.showCompanySite(company_id);
    }
    await getAudioList()
    if(useCookie('header_site').value != 'all' & useCookie('header_site').value){
        await cameraStore.getCameraListBySiteId(useCookie('header_site').value)
    }
    commonStore.preloader = false;
    showEffect.value = false
    useNuxtApp().$off("loadAudioList")
    useNuxtApp().$on("loadAudioList", () => {
        selectedCamera.value = null
        setTimeout(async()=>{
            getAudioList( )
        }, 100)
    });
  });
  async function getAudioList(){
    if(selectedCamera.value){
        await cameraStore.getAudioList({camera_id: selectedCamera.value})
    }else{
        if(useCookie('header_company').value != 'all' & useCookie('header_company').value && useCookie('header_site').value != 'all' & useCookie('header_site').value){
            await cameraStore.getAudioList( {site_id: useCookie('header_site').value})
        }else if(useCookie('header_company').value != 'all' & useCookie('header_company').value && (useCookie('header_site').value == 'all' || useCookie('header_site').value == null) ){
            await cameraStore.getAudioList( {company_id: useCookie('header_company').value})
        }
    }
    
    
  }

  async function getAudioListByCameraId(){
        cameraStore.audioPaginate.page = 1
        getAudioList();
  }
  async function jumpPage(page){
    cameraStore.audioPaginate.page = page;
    getAudioList();
  }

async function openAudioModal() {
    audioFormdata.value.company_id = useCookie('header_company').value
    audioFormdata.value.site_id = useCookie('header_site').value
  cameraStore.showAudioModal = true;
}
function closeAudioModal() {
    audioFormdata.value.company_id = "";
    audioFormdata.value.site_id = null;
    audioFormdata.value.camera_id = null;
    audioFormdata.value.audio_file = null;
    audioFormdata.value.is_repeat = 0;
    audioDateTimePicker.value.setDate = {
        startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
    };
    audioDateTimePicker.value.setTime = {
        startTime: H.formatDate(new Date(), "hh:mm A"),
    };
    audioDateTime.value  = {
        startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
        startTime: H.formatDate(new Date(), "hh:mm A"),
    };
    cameraStore.showAudioModal = false;

}
async function onChangeCompany(event){
    audioFormdata.value.site_id = null
    audioFormdata.value.camera_id = null
    cameraStore.cameraListBySiteId = []
    useCookie('header_company').value = event.target.value
    companyStore.headerSelectedCompany = event.target.value
    useCookie('header_site').value = 'all'
    siteStore.headerSelectedSite = 'all'
    await companyStore.showCompanySite(event.target.value)
    await getAudioList()

}
async function onChangeSite(event){
    audioFormdata.value.camera_id = null
    useCookie('header_site').value = event.target.value
    siteStore.headerSelectedSite = event.target.value
    await cameraStore.getCameraListBySiteId(event.target.value)
    await getAudioList()
}
async function submitAudioSaveForm(){
    if(!audioFormdata.value.company_id){
        Toaster.error("Please select a company")
    }
    if(!audioFormdata.value.site_id){
        Toaster.error("Please select a site")
    }
    if(!audioFormdata.value.camera_id){
        Toaster.error("Please select a camera")
    }
    audioFormdata.value.date_time = `${audioDateTime.value.startDate} ${audioDateTime.value.startTime}`
    await cameraStore.saveAudio(audioFormdata.value)
    await getAudioListByCameraId()
}
function toggleAudioPlayer(audioId){
    selectedAudio.value = audioId
    showAudioPlayer.value = !showAudioPlayer.value

}
</script>
  
  <style scoped>
  .btn-primary {
    background-color: #188653;
  }
  td {
  text-align: center; /* Center-align elements horizontally */
}

td p, td audio {
  display: inline-block; /* Keep elements inline */
  vertical-align: middle; /* Align elements vertically in the middle */
}
  </style>
  