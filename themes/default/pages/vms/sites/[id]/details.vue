<template>
    <div>
      <Breadcrumb title="Sites" :links="['sites']"></Breadcrumb>
      <div class="col-md-12">
        <div class="ionic-card ionic-tab-card">
          <div class="ionic-card-header">
            <h4 class="fs-18">Site details</h4>
            <div class="card-header-rightside">
              <nuxt-link :to="`/vms/sites`"
                class="ionic-btn ionic-theme-btn2 addnew-product-btn"
              >
                <i class="las la-list"> </i> Sites
            </nuxt-link>
            </div>
          </div>
          <div class="ionic-card-body pt-0">
            <div class="row">
                  <div class="col-md-6">
                    <div class="col-md-12">
                      <div class="form-group mt-3">
                        <label class="form-label"
                          >Select Company <span class="required">*</span></label
                        >
                        <template v-if="siteStore.showEffect">
                          <div class="w-100">
                            <div class="d-flex">
                              <ShimmerEffect
                                bg="dark"
                                height="52px"
                              ></ShimmerEffect>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <select
                            class="form-control"
                            v-model="siteStore.site.company_id"
                          >
                            <option :value="null">-Select Company-</option>
                            <option
                              v-for="(company, index) in companyStore.companies"
                              :key="index"
                              :value="company.id"
                            >
                              {{ company?.company_name }}
                            </option>
                          </select>
                          <span
                            v-if="
                              siteStore.errors.type == 422 &&
                              siteStore.errors.message?.company_id?.length
                            "
                            class="text-danger ps-2 pb-2 font-weight-normal"
                          >
                            {{
                              siteStore.errors.message?.company_id?.length
                                ? siteStore.errors?.message?.address?.join(", ")
                                : ""
                            }}
                          </span>
                        </template>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group">
                        <label class="form-label"
                          >Title <span class="required">*</span></label
                        >
                        <template v-if="siteStore.showEffect">
                          <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                        </template>
                        <template v-else>
                          <input
                            type="text"
                            placeholder=""
                            class="form-control"
                            v-model="siteStore.site.title"
                          />
                        </template>
                      </div>
                      <span
                        v-if="
                          siteStore.errors.type == 422 &&
                          siteStore.errors.message?.title?.length
                        "
                        class="text-danger ps-2 pb-2 font-weight-normal"
                      >
                        {{
                          siteStore.errors.message?.title?.length
                            ? siteStore.errors?.message?.title?.join(", ")
                            : ""
                        }}
                      </span>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group">
                        <label class="form-label"
                          >Address <span class="required">*</span></label
                        >
                        <template v-if="siteStore.showEffect">
                          <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                        </template>
                        <template v-else>
                          <el-BaseInput
                            v-model="siteStore.site.address"
                            :addressSearchFromGoogle="true"
                            @changeAddress="
                              (address) => {
                                if(address?.latitude && address?.longitude){
                                  siteStore.site.latitude = String(address.latitude);
                                  siteStore.site.longitude = String(address.longitude);
                                  H.refreshMap()
                                }
                              }
                            "
                          />
                        </template>
                      </div>
                      <span
                        v-if="
                          siteStore.errors.type == 422 &&
                          siteStore.errors.message?.address?.length
                        "
                        class="text-danger ps-2 pb-2 font-weight-normal"
                      >
                        {{
                          siteStore.errors.message?.address?.length
                            ? siteStore.errors?.message?.address?.join(", ")
                            : ""
                        }}
                      </span>
                    </div>
                    <!-- <div class="col-md-12">
                      <div class="form-group">
                        <label class="form-label">Latitude</label>
                        <template v-if="siteStore.showEffect">
                          <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                        </template>
                        <template v-else>
                          <input
                            type="text"
                            placeholder=""
                            class="form-control"
                            v-model="siteStore.site.latitude"
                          />
                        </template>
                      </div>
                    </div> -->
                    <!-- <div class="col-md-12">
                      <div class="form-group">
                        <label class="form-label">Longitude</label>
                        <template v-if="siteStore.showEffect">
                          <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                        </template>
                        <template v-else>
                          <input
                            type="text"
                            placeholder=""
                            class="form-control"
                            v-model="siteStore.site.longitude"
                          />
                        </template>
                      </div>
                    </div> -->
                    <div class="col-md-12">
                      <div class="form-group mt-3">
                        <label class="form-label">Status</label>
                        <template v-if="siteStore.showEffect">
                          <div class="w-100">
                            <div class="d-flex">
                              <ShimmerEffect
                                bg="dark"
                                height="52px"
                              ></ShimmerEffect>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <select
                            class="form-control"
                            v-model="siteStore.site.status"
                          >
                            <option :value="null">-Status-</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                        </template>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <GoogleMap-PickLatLong
                      v-if="siteStore.site.latitude && siteStore.site.longitude"
                      :isUpdateMode="
                        useRoute().query?.siteId ||
                        (siteStore.site.latitude && siteStore.site.longitude)
                      "
                      @pick-latlong="
                        (latLog) => {
                          (siteStore.site.latitude = latLog.lat.toString()),
                            (siteStore.site.longitude = latLog.lng.toString());
                        }
                      "
                      @pick-address="(addr) => (siteStore.site.address = addr)"
                      :lat="Number(siteStore.site.latitude)"
                      :lng="Number(siteStore.site.longitude)"
                      height="480px"
                    />
                  </div>
                </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useSitesStore } from "~/stores/vms/sites";
  import { useCompaniesStore } from "~/stores/vms/company";
  
  definePageMeta({
    middleware: ["auth"],
    key: (route) => route.fullPath,
  });
  
  useHead({
    titleTemplate: "%s | Sites",
  });
  
  let showEffect = ref(true);
  const siteStore = useSitesStore();
  const companyStore = useCompaniesStore();
  onMounted(async () => {
    await siteStore.getSite(useRoute().params.id);
    showEffect.value = false;
  });
  </script>
  
  <style scoped>
  .required {
    color: red;
  }
  </style>
  