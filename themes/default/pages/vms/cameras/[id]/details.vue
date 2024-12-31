<template>
    <div>
      <Breadcrumb title="Camera Details" :links="['cameras']"></Breadcrumb>
      <div class="col-md-12">
        <div class="ionic-card ionic-tab-card">
          <div class="ionic-card-header">
            <h4 class="fs-18">Camera details</h4>
            <div class="card-header-rightside">
              <nuxt-link :to="`/vms/cameras`"
                class="ionic-btn ionic-theme-btn2 addnew-product-btn"
              >
                <i class="las la-list"> </i> Cameras
            </nuxt-link>
            </div>
          </div>
          <div class="ionic-card-body pt-0">
            <div class="row">
                  <!-- Company Name -->
                  <div class="col-md-8">
                    <div class="form-group">
                      <label class="form-label">Companies</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <select
                          class="form-control"
                          v-model="cameraDetails.company_id"
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
                  <div class="col-md-8">
                    <div class="form-group">
                      <label class="form-label">Site</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <select
                          class="form-control"
                          v-model="cameraDetails.site_id"
                          @change="handleSiteName"
                        >
                          <option
                            v-for="(value, index) in companyStore.companySiteList"
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
                  <div class="col-md-8">
                    <div class="form-group">
                      <label class="form-label">Camera</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <select
                          class="form-control"
                          v-model="cameraDetails.een_camera_id"
                        >
                          <option
                            v-for="(
                              value, index
                            ) in companyStore.companySiteCameraList"
                            :key="index"
                            :value="value.id"
                          >
                            {{ value.name }}
                          </option>
                        </select>
                      </template>
                    </div>
                  </div>
  
                  <div class="col-md-8">
                    <div class="form-group">
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <div class="ionic-img-upload-area">
                          <!-- <el-DropImages
                            v-model="image"
                            :allowMultiple="false"
                            @uploadFile="handleImageUpload"
                            :showButton="false"
                          ></el-DropImages> -->
                        </div>
                        <!-- <div
                          v-if="cameraDetails.preview && !image"
                          class="ionic-img-uploadshow"
                        >
                          <ul>
                            <li>
                              <img
                                :src="cameraDetails.preview"
                                class="img-fluid"
                                alt="img uploadshow img"
                                width="50px"
                                height="50px"
                              />
                            </li>
                          </ul>
                        </div> -->


                        <div class="userprofile-tab-content">
                    <div class="row">
                      <div class="col-md-6 col-sm-12">
                        <label for="formFileLg" class="form-label"
                          >Camera Logo</label
                        >
                        <div class="form-group input-preview">
                          <img
                            class=""
                            :src="
                              galleryStore?.cameraDetails?.preview_url
                                ? galleryStore?.cameraDetails?.preview_url
                                : 'https://s3.us-west-2.amazonaws.com/storage-dev.inspectdeploy.io/media/users/1717052490.png'
                            "
                          />
                          <div>
                            <div
                              class="d-flex justify-content-between w-100 position-relative mt-2"
                            >
                              <span class="filename"></span>
                              <span>
                                <p class="highlight"></p>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>







                      </template>
                    </div>
                  </div>
                </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from "vue";
import { useCompaniesStore } from "~/stores/vms/company";
const companyStore = useCompaniesStore();
import { useGalleryStore} from '~/stores/vms/gallery'
const galleryStore = useGalleryStore()
const showModal = ref(false);
const modelEffect = ref(false);
const showEffect = ref(true);

const company = ref({
  company_name: "",
  site: "",
  camera: "",
});

const cameraDetails = ref({
  company_id: "",
  site_id: "",
  een_camera_id: "",
  status: "",
  name: "",
  preview: ""
});
let image = ref(null);

const handleImageUpload = () => {
  cameraDetails.value.preview = image.value[0];
};

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

onMounted(async () => {
   useCookie("app_type").value = 'vms'
  await galleryStore.getCameraDetails(useRoute().params.id)
  cameraDetails.value = {...galleryStore.cameraDetails}
  await handleCompany()

  if(useCookie('header_company').value && useCookie('header_site').value){
    await companyStore.getAllCameraList(useCookie('header_company').value, useCookie('header_site').value);
  }else if(useCookie('header_company').value){
    await companyStore.getAllCameraList(useCookie('header_company').value, null);
  }else if(useCookie('header_site').value){
    await companyStore.getAllCameraList(null , useCookie('header_site').value);
  }else{
    await companyStore.getAllCameraList();
  }
  showEffect.value = false;
});


async function handleCompany() {
  const selectedCompany = companyStore.companies.find(
    (company) => company.id == cameraDetails.value.company_id
  );
  // console.log(selectedCompany);
  await companyStore.showCompanySite(cameraDetails.value.company_id);
  await companyStore.showCompanySiteCamera(cameraDetails.value.company_id);
  cameraDetails.value.status = selectedCompany.status;
}

async function handleSiteName() {
  cameraDetails.value.site_id = cameraDetails.value.site_id;
}
</script>
  <style scoped>
  .required {
    color: red;
  }
</style>
  