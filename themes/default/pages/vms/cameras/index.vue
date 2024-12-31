<template>
  <div>
    <Breadcrumb title="Camera List" :links="['cameras']"></Breadcrumb>
    <div class="ionic-card">
      <div
        class="ionic-card-header m-card-header card-header-border"
      >
        <h4 class="fs-18">Cameras</h4>
        <div
          class="card-header-rightside d-flex align-items-center justify-content-between"
        >
          <div class="form-group mt-0 mb-0">
            <div class="ionic-search-area">
              <template v-if="modelEffect">
                <ShimmerEffect
                  bg="dark"
                  height="48px"
                  radius="15px"
                ></ShimmerEffect>
              </template>
              <template v-else>
                <div class="ionic-search-box">
                  <div class="input-group mt-0 mb-0">
                    <input
                      type="text"
                      v-model="search"
                      @input="searchByName()"
                      class="form-control"
                      placeholder="Search Camera"
                    />
                    <BtnLoader
                      :show="H.isPendingAnyApi('Product:productSearch')"
                      class="absolute"
                      style="right: 19px; top: 16px; z-index: 100"
                    />
                    <button
                      class="ionic-btn ionic-search-btn"
                      type="button"
                      @click="searchByName()"
                    >
                      <i
                        v-show="!H.isPendingAnyApi('Product:productSearch')"
                        class="bx bx-search"
                      ></i>
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <button
            @click="openCreateModal"
            class="ionic-btn ionic-theme-btn2 ionic-btnlg addnew-product-btn"
          >
            <i class="las la-plus"> </i> Camera
          </button>
        </div>
      </div>
      <div class="ionic-card-body">
        <div class="table-responsive">
          <table class="table table-borderless">
            <thead>
              <tr>
                <th>Camera Name</th>
                <th>Company Name</th>
                <th>Site Name</th>
                <th>Status</th>
                <th>Timelapse</th>
                <th>Human Detetction</th>
                <th>Vehicle Detection</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="empty-tr">
                <td colspan="4"></td>
              </tr>
              <tr
                class="empty-tr"
                v-if="!companyStore.allCameraList && !showEffect"
              >
                <td colspan="5" class="text-center">No data available</td>
              </tr>
              <template
                v-if="
                  showEffect 
                "
              >
                <tr
                  v-for="(x, index) in companyStore?.allCameraList?.length ||
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
                <tr
                  v-for="(camera, index) in companyStore.allCameraList"
                  :key="index"
                >
                  <td>
                    <a @click="goToCameraTimeline(camera)">
                      <p class="cp p-0">{{ camera?.name }}</p>
                    </a>
                  </td>

                  <td>
                    <a @click="goToCameraWallPage(camera?.company)" class="cp"
                      
                      >{{ camera?.company?.company_name }}
                    </a>
                  </td>
                  <td>
                    <a class="cp" @click="goToSiteCamerasPage(camera?.site)">{{
                      camera?.site?.title
                    }}</a>
                  </td>
                  <td>
                    <el-Switch style="scale:0.8" size="sm" 
                    @change="
                          updateStatus(camera)
                        " class="col-md-2 col-2" yes="On" no="Off" v-model="camera.status"/>
                    <!-- <span
                      :class="
                        camera?.status == 1 ? 'text-success' : 'text-danger'
                      "
                    >
                      {{ camera?.status == 1 ? "Active" : "Inactive" }}
                    </span> -->
                  </td>
                  <td>
                      <el-Switch style="scale:0.8" size="sm"
                      :disabled="camera.status == 0 ? true : false"
                       @change="
                          updateTimelapseStatus(camera, camera.is_timelapse)
                        " class="col-md-2 col-2"  v-model="camera.is_timelapse"/>
                  </td>
                  <td>
                      <el-Switch style="scale:0.8" size="sm" 
                      :disabled="camera.status == 0 ? true : false"
                      @change="
                          updatePersonDetection(camera, camera.is_person_detection)
                        " class="col-md-2 col-2"  v-model="camera.is_person_detection"/>
                  </td>
                  <td>
                      <el-Switch style="scale:0.8" size="sm"
                      :disabled="camera.status == 0 ? true : false"
                      @change="
                          updateVehicleDetction(camera, camera.is_vehicle_detection)
                        " class="col-md-2 col-2"  v-model="camera.is_vehicle_detection"/>
                  </td>
                  <td>
                    <div
                      class="d-flex justify-content-center tableaction-td pt-2"
                    >
                      <p
                        tooltip="Camera settings"
                        flow="up"
                        @click="openCameraSettingPopup(camera)"
                      >
                        <i class="las la-cog size-sm ms-2 cp"></i>
                      </p>
                      <a @click="goToCameraTimeline(camera)">
                        <p tooltip="View timeline" flow="up">
                          <i-las t="view" class="size-sm ms-2 cp" />
                        </p>
                      </a>
                      <p
                        tooltip="View image"
                        flow="up"
                        @click="goToTimelapseImagePage(camera)"
                      >
                        <i class="las la-image size-sm ms-2 cp"></i>
                      </p>
                      <p
                        tooltip="View videos"
                        flow="up"
                        @click="goToTimelapseVideoPage(camera)"
                      >
                        <i class="las la-camera size-sm ms-2 cp"></i>
                      </p>
                      <!-- <p tooltip="Edit" flow="up" @click="getEditData(camera)">
                        <i class="las la-edit size-sm ms-2 cp"></i>
                      </p> -->
                      <p tooltip="Delete" flow="up">
                        <i-las
                          t="trash"
                          class="size-sm cp"
                          @click="(
                            camerId = camera?.id,
                            showConfirmation  = true
                          )"
                        />
                      </p>
                      <!-- <p tooltip="Edit" flow="up" @click="getEditData(camera)">
                        <i class="las la-edit size-sm ms-2 cp"></i>
                      </p> -->
                    </div>
                  </td>
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
                  Total: {{ companyStore?.cameraPaginateData?.total }}
                  <span class="mx-3">|</span>
                  Page: {{ companyStore?.cameraPaginateData?.current_page }}
                  <span class="mx-3">|</span>
                  Showing: {{ companyStore?.allCameraList?.length || 0 }}
                </strong>
              </p>
              <PaginationRentMy
                v-model="companyStore.cameraPaginateData"
                @jumpToPage="
                  (page) => {
                    companyStore.jumpToPage(page);
                  }
                "
              ></PaginationRentMy>
            </div>
          </template>
        </div>
      </div>

      <!-- Modal Component -->
      <section
        v-if="companyStore.showCameraModal"
        class="modal fade addnew-product-modal"
        tabindex="-1"
        style="display: block; opacity: unset"
      >
        <div
          class="modal-dialog modal-dialog-centered"
          @click.stop="closeModal"
        >
          <div class="modal-content" @click.stop="false">
            <div class="modal-header">
              <h1 class="modal-title fs-5">{{ updateModal ? "Update Camera" :"Add Camera" }}</h1>
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
                          v-model="formdata.company_id"
                          @change="handleCompany"
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
                          v-model="formdata.site_id"
                          @change="handleSiteName"
                        
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
                          v-model="formdata.een_camera_id"
                          @change="handleCameraList"
                          @click="handleCameraClick()"
                         
                        
                        >
                          <!-- <option
                            v-if="formdata.name !== null"
                            :value="formdata.een_camera_id"
                          >
                            {{ formdata.name }}
                          </option> -->
                          <option value="all"  >All Cameras</option>
                          <option
                            v-for="(
                              value, index
                            ) in siteStore.unAssignedSiteCamreaList"
                            :key="index"
                            :value="value.id"
                          >
                            {{ value.name + '&nbsp; ( ' +value.id +' )'}}
                          </option>
                        </select>
                      </template>
                    </div>
                    <!-- <span v-if="siteStore?.unAssignedSiteCamreaList?.length == 0" class="text-danger" style="font-size: 14px">Cameras not available *</span> -->
                  </div>

                  <!-- <div class="col-md-12">
                    <div class="form-group">
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <div class="ionic-img-upload-area">
                          <el-DropImages
                            v-model="image"
                            :allowMultiple="false"
                            @uploadFile="handleImageUpload"
                            :showButton="false"
                          ></el-DropImages>
                        </div>
                        <div
                          v-if="formdata.preview && !image"
                          class="ionic-img-uploadshow"
                        >
                          <ul>
                            <li>
                              <img
                                :src="formdata.preview"
                                class="img-fluid"
                                alt="img uploadshow img"
                                width="50px"
                                height="50px"
                              />
                            </li>
                          </ul>
                        </div>
                      </template>
                    </div>
                  </div> -->
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
                  @click="closeModal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="ionic-btn ionic-theme-btn2 save-btn"
                  @click="handleSubmit"
                >
                  {{ updateModal ? "Update" :"Save" }}
                </button>
              </template>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal Component -->
    <Rightbar title="Camera settings" @unmount="closeCameraSettingPopup(true)" v-if="isOpenCameraSetting">
            <div class="row bottom-border">
              <div class="col-md-4" > 
                <h2 class="m-2">Settings</h2>
              </div>
              <div class="col-md-8"> 
                <h2 class="m-2">{{selectedCamera.name}}</h2>
              </div>
            </div>
            <!-- <div class="row align-items-center mt-3 mb-3">
              <div class="col-md-4"> 
                <h3 class="m-2">Clips</h3>
              </div>
              <div class="col-md-4"> 
                <h4 class="m-2">Automatic clips save in</h4>
              </div>
              <div class="col-md-4"> 
                <div class="select-optionbox">
                      <select
                        class="form-control"
                        v-model="cameraSettingsForm.clip_interval"
                      >
                        <option :value="0">
                          N/A
                        </option>
                        <option
                          v-for="(duartion, index) in globalData.clipsSavingDuration"
                          :key="index"
                          :value="duartion"
                        >
                          {{ duartion }} Minutes
                        </option>
                      </select>
                    </div>
              </div>
            </div> -->
            <div class="row mt-2">
              <div class="col-md-4"> 
                <h3 class="m-2">Timelapse</h3>
              </div>
              <div class="col-md-4"> 
                <h4 class="m-2">Activate Timelapse</h4>
              </div>
              <div class="col-md-4"> 
                <el-Switch   :disabled="selectedCamera.status == 0 ? true : false" class="col-md-2 col-2" v-model="cameraSettingsForm.is_timelapse"/>
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-md-4"> 
                <h3 class="m-2">Human detection</h3>
              </div>
              <div class="col-md-4"> 
                <h4 class="m-2">Activate Human detection</h4>
              </div>
              <div class="col-md-4"> 
                <el-Switch  :disabled="selectedCamera.status == 0 ? true : false" class="col-md-2 col-2" v-model="cameraSettingsForm.is_person_detection"/>
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-md-4"> 
                <h3 class="m-2">Vehicle detection</h3>
              </div>
              <div class="col-md-4"> 
                <h4 class="m-2">Activate Vehicle detection</h4>
              </div>
              <div class="col-md-4"> 
                <el-Switch  :disabled="selectedCamera.status == 0 ? true : false" class="col-md-2 col-2" v-model="cameraSettingsForm.is_vehicle_detection"/>
              </div>
            </div>
            
           
            <!-- <div class="row mt-2">
              <div class="col-md-4"> 
                <h3 class="m-2">Timelapse video</h3>
              </div>
              <div class="col-md-4"> 
                <h4 class="m-2">Activate timelapse video</h4>
              </div>
              <div class="col-md-4"> 
                <el-Switch class="col-md-2 col-2"  @change="()=>{cameraSettingsForm.timelapse_video_activate = !cameraSettingsForm.timelapse_video_activate}"  v-model="cameraSettingsForm.timelapse_video_activate"/>
              </div>
            </div> -->

      <div class="d-flex justify-content-start ps-0 pe-0">
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
            @click="closeCameraSettingPopup(true)"
          >
            Cancel
          </button>
          <button
            type="button"
            class="ionic-btn ionic-theme-btn2 save-btn"
            @click="submitCameraSettingForm()"
          >
            Save<BtnLoader
              :show="H.isPendingAnyApi('Company:saveCameraSettings')"
              color="black"
            ></BtnLoader>
          </button>
        </template>
      </div>
    </Rightbar>
          <!-- ==================== Modal==================== -->
<!-- ==================== Modal==================== -->
<!-- ==================== Modal==================== -->

<Modal-Confirm v-if="showConfirmation" v-model="showConfirmation" :skipAutoClose="false" @yes="async () => {
    let isDeleted =  await companyStore.deleteCamera(camerId);
    if (isDeleted) {
        showConfirmation = false;
        camerId = null;
    }
}">
    <template v-if="showConfirmation"> Are you sure? </template>
</Modal-Confirm>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCompaniesStore } from "~/stores/vms/company";
import { useSitesStore } from "~/stores/vms/sites";
import { useCommonStore } from "~/stores/Common";
let showConfirmation = ref(false)
const commonStore = useCommonStore();
const siteStore = useSitesStore();
const companyStore = useCompaniesStore();
const showModal = ref(false);
const modelEffect = ref(false);
let updateModal = ref(false)
const showEffect = ref(true);
let search = ref(null);
let camerId = ref(null)
const company = ref({
  company_name: "",
  site: "",
  camera: "",
});
let selectedCompany = ref(null)
const formdata = ref({
  company_id: "",
  site_id: null,
  een_camera_id: "all",
  timezone: null,
  status: "",
  name: "",
  preview: "",
});
let company_id = ref(null);
let image = ref(null);
let isOpenCameraSetting = ref(false);
let selectedCamera = ref(null);
let cameraSettingsForm = ref({
  camera_id: null,
  clip_interval: 0,
  is_timelapse: 1,
  // timelapse_video_activate: false,
  is_vehicle_detection: 0,
  is_person_detection: 0

});
const handleImageUpload = () => {
  formdata.value.preview = image.value[0];
};

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});


onMounted(async () => {
 asMounted()
});
async function asMounted(isShowEffect = null){
  commonStore.preloader = true;
  if (
    useCookie("header_company").value &&
    useCookie("header_company").value != "all" &&
    useCookie("header_site").value &&
    useCookie("header_site").value != "all"
  ) {
    await companyStore.getAllCameraList(
      useCookie("header_company").value,
      useCookie("header_site").value
    );
  } else if (
    useCookie("header_company").value &&
    useCookie("header_company").value != "all"
  ) {
    await companyStore.getAllCameraList(
      useCookie("header_company").value,
      null
    );
  } else if (
    useCookie("header_site").value &&
    useCookie("header_site").value != "all"
  ) {
    await companyStore.getAllCameraList(null, useCookie("header_site").value);
  } else {
    await companyStore.getAllCameraList();
  }
  if(isShowEffect==null){
    showEffect.value = false;
  }
  commonStore.preloader = false;
}
onBeforeUnmount(() => {
  useNuxtApp().$emit("reset_pagination", 1);
  companyStore.cameraPaginate = { page: 1, per_page: 20, search: null };
});
function openCreateModal() {
  closeModal();
  formdata.value.company_id = useCookie('header_company').value ?? "";
  formdata.value.site_id = useCookie('header_site').value ?? null;
  if(useCookie('header_company').value != 'all' && useCookie('header_company').value && useCookie('header_site').value != 'all' && useCookie('header_site').value){
    siteStore.getUnassignedSiteCamerasList(useCookie('header_company').value,  useCookie('header_site').value);
  }
  companyStore.showCameraModal = true;
}

async function getEditData(camera) {
  updateModal.value = true
  modelEffect.value = true
  companyStore.showCameraModal = true;
  await companyStore.showCompanySite(camera.company.id);
  formdata.value.company_id =
    companyStore.companySiteList[0].cameras[0].company_id;
  formdata.value.site_id = companyStore.companySiteList[0].cameras[0].site_id;
  // formdata.value.een_camera_id = companyStore.companySiteList[0].cameras[0].een_camera_id
  formdata.value.name = companyStore.companySiteList[0].cameras[0].name;
  formdata.value.status = camera.status
  formdata.value.timezone = camera.timezone
  selectedCamera.value = camera
  await siteStore.getUnassignedSiteCamerasList(formdata.value.company_id, formdata.value.site_id);
  modelEffect.value = false
  
}

function closeModal() {
  siteStore.unAssignedSiteCamreaList = []
  companyStore.showCameraModal = false;
  formdata.value.company_id = "";
  formdata.value.een_camera_id = "all";
  formdata.value.site_id = null;
  formdata.value.preview = "";
  image.value = null;
  updateModal.value = false
}
function openCameraSettingPopup(camera) {
  cameraSettingsForm.value.clip_interval = camera.clip_interval;
  selectedCamera.value = camera;
  cameraSettingsForm.value.camera_id = camera.id;
  cameraSettingsForm.value.is_vehicle_detection = camera.is_vehicle_detection;
  cameraSettingsForm.value.is_person_detection = camera.is_person_detection
  cameraSettingsForm.value.is_timelapse = camera.is_timelapse;
  isOpenCameraSetting.value = true;
}
function closeCameraSettingPopup() {
  isOpenCameraSetting.value = false;
  cameraSettingsForm.value = {
    camera_id: null,
    clip_interval: 0,
    // is_timelapse: false,
    // timelapse_video_activate: false,
    is_vehicle_detection: 0,
    is_person_detection: 0
  };
}
async function submitCameraSettingForm() {
  await companyStore.saveCameraSettings(cameraSettingsForm.value);
  asMounted(false)
}
async function handleSubmit() {
  if (
    !formdata.value.company_id ||
    !formdata.value.een_camera_id ||
    !formdata.value.site_id
  ) {
    Toaster.error("Fill all the field");
    return;
  }
  if(siteStore.unAssignedSiteCamreaList.length == 0){
    Toaster.error("No camera available");
    return;

  }
  if(!updateModal.value){
    await companyStore.saveCompanySiteCamera(formdata.value);
  }else{
    await companyStore.updateCompanySiteCamera(selectedCamera.value.id, formdata.value);
  }
  asMounted(false)

  if (!companyStore.showCameraModal) {
    closeModal();
  }
}

async function handleCompany(event) {
  selectedCompany.value = companyStore.companies.find(
    (company) => company.id == event.target.value
  );
  siteStore.unAssignedSiteCamreaList = []
  await companyStore.showCompanySite(formdata.value.company_id);
  company_id.value = selectedCompany.value.id;
  useCookie("header_company").value = selectedCompany.value.id;
  companyStore.headerSelectedCompany = selectedCompany.value.id;
  formdata.value.status = selectedCompany.value.status;
}

async function handleSiteName() {
  commonStore.preloader = true;
  await siteStore.getUnassignedSiteCamerasList(formdata.value.company_id, formdata.value.site_id);
  if(!formdata.value.company_id){
    Toaster.error('Select company first')
    return
  }
  if(siteStore?.unAssignedSiteCamreaList?.length == 0){
    Toaster.error('Cameras not available')
  }
  useCookie("header_site").value = formdata.value.site_id;
  siteStore.headerSelectedSite = formdata.value.site_id;
  commonStore.preloader = false;
}

async function handleCameraClick() {
  if(!formdata.value.company_id || formdata.value.company_id == 'all'){
    Toaster.error('Select company first')
    return
  }
  if(!formdata.value.site_id || formdata.value.site_id == 'all'){
    Toaster.error('Select site first')
    return
  }
}
async function handleCameraList() {
  if(!formdata.value.company_id){
    Toaster.error('Select company first')
    return
  }
  if(!formdata.value.site_id){
    Toaster.error('Select site first')
    return
  }
  const selectedCamera = siteStore.unAssignedSiteCamreaList.find(
    (camera) => camera.id == event.target.value
  );
  formdata.value.timezone = selectedCamera.timeZone.zone;
  formdata.value.name = selectedCamera.name;
}

async function handleDelete(id) {
  await companyStore.deleteCamera(id);
}

async function showCameraData(id) {
  await companyStore.showCameraList(id);
  // console.log(companyStore.company.company_id);
  companyStore.showCameraModal = true;
}
async function goToCameraWallPage(company) {
  useCookie("header_company").value = company.id;
  useCookie("header_site").value = "all";
  await companyStore.showCompanySite(company.id);
  setTimeout(() => {
    companyStore.headerSelectedCompany = company.id;
    siteStore.headerSelectedSite = "all";
    navigateTo(`/vms/companies/${company.id}/camera-wall/gallery`);
  }, 100);
}
async function goToTimelapseImagePage(camera) {
  console.log("camera", camera);
  useCookie("header_company").value = camera.company.id;
  useCookie("header_site").value = camera.site.id;
  await companyStore.showCompanySite(camera.company.id);

  setTimeout(() => {
    companyStore.headerSelectedCompany = camera.company.id;
    siteStore.headerSelectedSite = camera.site.id;
    navigateTo(
      `/vms/timelapse/images?camera_id=${camera.id}&date=${H.formatDate(
        new Date(),
        "MM-DD-YYYY"
      )}`
    );
  }, 1000);
}
async function goToTimelapseVideoPage(camera) {
  console.log("camera", camera);
  useCookie("header_company").value = camera.company.id;
  useCookie("header_site").value = camera.site.id;
  await companyStore.showCompanySite(camera.company.id);

  setTimeout(() => {
    companyStore.headerSelectedCompany = camera.company.id;
    siteStore.headerSelectedSite = camera.site.id;
    // navigateTo(`/vms/timelapse/videos?camera_id=${camera.id}`)
    navigateTo(`/vms/timelapse/videos`);
  }, 100);
}
async function goToSiteCamerasPage(site) {
  useCookie("header_company").value = site.company_id;
  useCookie("header_site").value = site.id;
  await companyStore.showCompanySite(site.company_id);
  setTimeout(() => {
    companyStore.headerSelectedCompany = site.company_id;
    siteStore.headerSelectedSite = site.id;
    navigateTo(`/vms/sites/${site?.id}/cameras`);
  }, 100);
}
const goToCameraTimeline = async (camera) => {
  useCookie("header_company").value = camera.company_id;
  useCookie("header_site").value = camera.site_id;
  await companyStore.showCompanySite(camera.company_id);
  setTimeout(() => {
    companyStore.headerSelectedCompany = camera.company_id;
    siteStore.headerSelectedSite = camera.site_id;
    navigateTo(`/vms/cameras/${camera.id}/timeline`);
  }, 1000);
};
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
// Debounce the API call
const searchByName = debounce(async () => {
  if (search.value?.length) {
    companyStore.cameraPaginate.search = search.value;
    companyStore.cameraPaginate.page = 1;
  } else {
    companyStore.cameraPaginate.search = null;
    companyStore.cameraPaginate.page = 1;
  }
  useNuxtApp().$emit("reset_pagination", 1);
  if (
    useCookie("header_company").value &&
    useCookie("header_company").value != "all" &&
    useCookie("header_site").value &&
    useCookie("header_site").value != "all"
  ) {
    await companyStore.getAllCameraList(
      useCookie("header_company").value,
      useCookie("header_site").value
    );
  } else if (
    useCookie("header_company").value &&
    useCookie("header_company").value != "all"
  ) {
    await companyStore.getAllCameraList(
      useCookie("header_company").value,
      null
    );
  } else if (
    useCookie("header_site").value &&
    useCookie("header_site").value != "all"
  ) {
    await companyStore.getAllCameraList(null, useCookie("header_site").value);
  } else {
    await companyStore.getAllCameraList();
  }
}, 400);
const updateStatus = async (camera) => {
  let payload = {
    company_id: camera.company_id,
    een_camera_id: camera.een_camera_id,
    id: camera.id,
    is_fav: camera.is_fav,
    name: camera.name,
    preview: camera.preview,
    preview_url: camera.preview_url,
    is_timelapse: camera.is_timelapse,
    site_id: camera.site_id,
    slug: camera.slug,
    status: camera.status,
    updated_at: camera.updated_at,
    updated_by: camera.updated_by,
  };
  await companyStore.updateCameraStatus(camera.id, payload, true);
  Toaster.success("Camera Status Updated");
  asMounted(false)
};
const updateTimelapseStatus = async (item, status) => {
  // let convertstatus = status == true ? 1 : 0;
  let payload = {
    camera_id: item.id,
    clip_interval: item.clip_interval,
    is_timelapse: status,
    is_person_detection: item.is_person_detection,
    is_vehicle_detection: item.is_vehicle_detection,
  };
  await companyStore.saveCameraSettings(payload);
  Toaster.success("Timelapse Updated");
  asMounted(false)
};
const updateVehicleDetction = async (item, status) => {
  let payload = {
    camera_id: item.id,
    clip_interval: item.clip_interval,
    is_timelapse: item.is_timelapse,
    is_person_detection: item.is_person_detection,
    is_vehicle_detection: status,
  };
  await companyStore.saveCameraSettings(payload);
  Toaster.success("Timelapse Updated");
  asMounted(false)
};
const updatePersonDetection = async (item, status) => {
  let payload = {
    camera_id: item.id,
    clip_interval: item.clip_interval,
    is_timelapse: item.is_timelapse,
    is_person_detection: status,
    is_vehicle_detection: item.is_vehicle_detection,
  };
  await companyStore.saveCameraSettings(payload);
  Toaster.success("Timelapse Updated");
  asMounted(false)
};
</script>

<style scoped>
.btn-primary {
  background-color: #188653;
}
</style>
