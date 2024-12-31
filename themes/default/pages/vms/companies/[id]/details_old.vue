<template>
  <div>
    <Breadcrumb title="Company Details" :links="['companies']"></Breadcrumb>
    <div class="col-md-12">
      <div class="ionic-card ionic-tab-card">
        <div class="ionic-card-header">
          <h4 class="fs-18">Company details</h4>
          <div class="card-header-rightside">
            <nuxt-link
              :to="`/vms/companies`"
              class="ionic-btn ionic-theme-btn2 addnew-product-btn"
            >
              <i class="las la-list"> </i> Companies
            </nuxt-link>
          </div>
        </div>
        <div class="ionic-card-body pt-0">
          <div class="row">
            <div class="col-md-8">
              <div class="form-group">
                <label class="form-label">EEN Accounts</label>
                <template v-if="modelEffect">
                  <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                </template>

                <template v-else>
                  <select
                    class="form-control"
                    v-model="companyStore.companyData.een_user_account"
                    @change="handleen"
                  >
                    <option
                      v-for="(value, index) in companyStore.eenAccounts"
                      :key="index"
                      :value="value.id"
                      :selected="
                        value.id == companyStore.companyData.een_user_account
                      "
                    >
                      {{ value.name }}
                    </option>
                  </select>
                </template>
              </div>
            </div>

            <!-- Company Name -->
            <div class="col-md-8">
              <div class="form-group">
                <label class="form-label">
                  Company Name <span class="required">*</span>
                </label>
                <template v-if="modelEffect">
                  <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                </template>
                <template v-else>
                  <input
                    type="text"
                    placeholder="Company Name"
                    class="form-control"
                    disabled="true"
                    v-model="companyStore.companyData.company_name"
                  />
                </template>
              </div>
            </div>
            <!-- Logo -->
            <div class="col-md-8">
              <div class="form-group">
                <template v-if="modelEffect">
                  <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                </template>
                <template v-else>
                  <!-- <div class="ionic-img-upload-area">
                    <el-DropImages
                      v-model="image"
                      :allowMultiple="false"
                      @uploadFile="handleLogoUpload"
                      :showButton="false"
                    ></el-DropImages>
                  </div> -->
                  <!-- <div
                    v-if="companyStore.companyData.logo && !image"
                    class="ionic-img-uploadshow"
                  >
                    <ul>
                      <li>
                        <img
                          :src="companyStore.companyData.logo"
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
                          >Company Logo</label
                        >
                        <div class="form-group input-preview">
                          <img
                            class=""
                            :src="
                              companyStore.companyData.logo
                                ? companyStore.companyData.logo
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
            <!-- Email -->
            <div class="col-md-8">
              <div class="form-group">
                <label class="form-label"
                  >Email<span class="required">*</span></label
                >
                <template v-if="modelEffect">
                  <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                </template>
                <template v-else>
                  <input
                    type="email"
                    placeholder="Email"
                    class="form-control"
                    disabled="true"
                    v-model="companyStore.companyData.email"
                  />
                </template>
              </div>
            </div>
            <!-- Phone -->
            <div class="col-md-8">
              <div class="form-group">
                <label class="form-label"
                  >Phone<span class="required">*</span></label
                >
                <template v-if="modelEffect">
                  <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                </template>
                <template v-else>
                  <input
                    type="tel"
                    placeholder="Phone"
                    class="form-control"
                    disabled="true"
                    v-model="companyStore.companyData.contact_no"
                  />
                </template>
              </div>
            </div>
            <!-- Address -->
            <div class="col-md-8">
              <div class="form-group">
                <label class="form-label"
                  >Address<span class="required">*</span></label
                >
                <template v-if="modelEffect">
                  <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                </template>
                <template v-else>
                  <input
                    type="text"
                    placeholder="Address"
                    class="form-control"
                    disabled="true"
                    v-model="companyStore.companyData.address"
                  />
                </template>
              </div>
            </div>
            <div class="d-flex flex-row">
              <!-- First Name -->
              <!-- <div class="col-md-4" v-if="!isEditMode">
                <div class="form-group">
                  <label class="form-label"
                    >First Name<span class="required">*</span></label
                  >
                  <template v-if="modelEffect">
                    <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                  </template>
                  <template v-else>
                    <input
                      type="text"
                      placeholder="First Name"
                      class="form-control"
                      disabled="true"
                      v-model="companyStore.companyData.first_name"
                    />
                  </template>
                </div>
              </div> -->
              <!-- Last Name -->
              <!-- <div class="col-md-4" v-if="!isEditMode">
                <div class="form-group">
                  <label class="form-label"
                    >Last Name <span class="required">*</span></label
                  >
                  <template v-if="modelEffect">
                    <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                  </template>
                  <template v-else>
                    <input
                      autocomplete="off"
                      autosuggest="false"
                      type="text"
                      placeholder="Last Name"
                      class="form-control"
                      disabled="true"
                      v-model="companyStore.companyData.last_name"
                    />
                  </template>
                </div>
              </div> -->
            </div>
            <!-- <div class="d-flex flex-row" v-if="!isEditMode"> -->
            <!-- Password -->
            <!-- <div class="col-md-8">
                <div class="form-group">
                  <label class="form-label"
                    >Password <span class="required">*</span></label
                  >
                  <template v-if="modelEffect">
                    <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                  </template>
                  <template v-else>
                    <input
                      autocomplete="off"
                      autosuggest="false"
                      type="password"
                      placeholder="Password"
                      class="form-control"
                      disabled="true"
                      v-model="companyStore.companyData.password"
                    />
                  </template>
                </div>
              </div>
            </div> -->
            <!-- Status -->
            <div class="col-md-8">
              <div class="form-group">
                <label class="form-label">Status</label>
                <template v-if="modelEffect">
                  <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                </template>
                <template v-else>
                  <select
                    class="form-control"
                    v-model="companyStore.companyData.status"
                  >
                    <option :value="companyStore.companyData.status">
                      {{
                        companyStore.companyData.status == 1
                          ? "Active"
                          : "Inactive"
                      }}
                    </option>
                  </select>
                </template>
              </div>
            </div>
            <div v-if="validationError" class="alert alert-danger">
              {{ validationError }}
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
// const companyStore.showCompanyModal = ref(false);
const isEditMode = ref(false);
const modelEffect = ref(false);
const showEffect = ref(true);
const validationError = ref("");
let image = ref(null);

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});


onMounted(async () => {
  await companyStore.showCompany(useRoute().params.id);
  await companyStore.getEenAccounts();
  companyStore.companyData.password = 12345678;
  modelEffect.value = false;
  showEffect.value = false;
});

const handleLogoUpload = () => {
  companyStore.companyData.logo = image.value[0];
};

async function handleen(event) {
  const selectedenaccount = companyStore.eenAccounts.find(
    (enaccount) => enaccount.id == event.target.value
  );
  // console.log(selectedenaccount.name);
  companyStore.companyData.een_account_name = selectedenaccount.name;
  companyStore.companyData.company_name = selectedenaccount.name;
}
</script>

<style scoped>
.required {
  color: red;
}
</style>
