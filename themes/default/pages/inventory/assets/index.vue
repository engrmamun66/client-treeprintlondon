<script setup>
import BtnLoader from "~/components/BtnLoader.vue";
import { useAssetStore } from "~/stores/rentmy/Asset";
import { usePeplinkStore } from "~/stores/Peplink";
let assetStore = useAssetStore();
provide("assetStore", assetStore);
let peplinkStore = usePeplinkStore();
let uuid = ref(67242)
definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: "%s | Assets",
});

async function asMounted() {
  await assetStore.getAssetList(true);  
}

let isMounted = ref(false);
let assetCreateMode = ref(false);
let assetUpdateMode = ref(false);
provide('assetUpdateMode', assetUpdateMode)
let targetAsset = ref(null);
let showDeleteModal = ref(false);

watch(assetCreateMode, (a, b) => {
  if (a === true) {
    H.withUrl.setQuery({ action: "add" });
  } else {
    H.withUrl.deleteQuery("action");
  }
});
watch(assetUpdateMode, (a, b) => {
  if (a === false) {
    H.withUrl.deleteQuery("action");
    H.withUrl.deleteQuery("assetId");
  }
});
let assetId = ref(0)
let ASSET_ID = computed(() => targetAsset.value?.id ?? assetId.value);
provide('ASSET_ID', ASSET_ID);
let allTabs = ref(null);

onMounted(async () => {
  assetStore.pagiantion.variants_products_id = null;
  if (useRoute().query.action == "add") {
    assetCreateMode.value = true;
  }
  if (useRoute().query.action == "update") {
    assetId.value = Number(useRoute().query.assetId)
    assetUpdateMode.value = true;
    setTimeout(() => {
      if (['update-asset', 'components'].includes(useRoute().query.tab)) {
        if(allTabs.value){
          allTabs.value.selectTab('components')
        }
      }
    }, 100);
  }
  await asMounted();
  isMounted.value = true;
});

function onClickDeleteAsset(asset) {
  asset.isShow = false;
  targetAsset.value = asset;
  showDeleteModal.value = true;
}
function onClickEditAsset(asset) {
  asset.isShow = false;
  targetAsset.value = asset;
  assetUpdateMode.value = true;
  H.withUrl.setQuery({ action: "update", assetId: asset.id });
}

let dateObj = reactive({
  startDate: new Date(),
  endDate: new Date(),
});
let showDateRange = ref(false);
</script>

<template>
  <div class="div">
    <Breadcrumb title="Assets" :links="['assets']"></Breadcrumb>

    <Modal-Confirm
      v-model="showDeleteModal"
      @yes="assetStore.deleteAsset(targetAsset)"
    >
      Are you sure you want to permanently delete?
    </Modal-Confirm>

    <Asset-Add
      v-if="assetCreateMode"
      @unmount="assetCreateMode = false"
    ></Asset-Add>
    <!-- <Asset-Update
      v-if="assetUpdateMode"
      :assetId="targetAsset?.id ?? assetId"
      @unmount="assetUpdateMode = false"
      :showDeviceAssignField="true"
    ></Asset-Update> -->
    <asset-allTabs v-if="assetUpdateMode" ref="allTabs"
     @unmount="()=>{
      assetUpdateMode = false;
      H.withUrl.deleteQuery('tab');
      H.withUrl.deleteQuery('action');
      H.withUrl.deleteQuery('assetId');
    }">

    </asset-allTabs>

    <div class="ionic-card">
      <div class="ionic-card-header card-header-border">
        <h4 class="fs-20">Asset Search</h4>
        <div class="card-header-rightside"></div>
      </div>
      <div class="ionic-card-body">
        <div class="row pt-2">
          <div class="col-md-3 col-6">
            <ShimmerEffect
              v-if="!isMounted"
              bg="dark"
              height="48px"
              radius="15px"
            ></ShimmerEffect>
            <asset-search ref="assetSearchCompo"
              v-else
              label=""
              @select="
                ({ product_id, variants_products_id }) => {
                  assetStore.pagiantion.product_id = product_id;
                  assetStore.pagiantion.variants_products_id =
                    variants_products_id;
                }
              "
              @clear="
                () => {
                  assetStore.pagiantion.product_id = null;
                  assetStore.pagiantion.variants_products_id = null;
                }
              "
            ></asset-search>
          </div>
          <div class="col-md-3 col-6">
            <ShimmerEffect
              v-if="!isMounted"
              bg="dark"
              height="48px"
              radius="15px"
            ></ShimmerEffect>
            <div v-else class="form-group">
              <input
                v-model="assetStore.pagiantion.serial_no"
                @keyup.enter="assetStore.getAssetList({ is_search: true })"
                type="text"
                class="form-control"
                placeholder="Asset Serial No"
              />
            </div>
          </div>
          <div class="col-md-3 col-6">
            <ShimmerEffect
              v-if="!isMounted"
              bg="dark"
              height="48px"
              radius="15px"
            ></ShimmerEffect>
            <div v-else class="form-group">
              <div class="select-optionbox">
                <select
                  class="form-control"
                  v-model="assetStore.pagiantion.current_status"
                >
                  <option :value="null">-Status-</option>
                  <template
                    v-for="(status, i) in globalData.asset.statusListMini"
                  >
                    <option :value="status.id">{{ status.name }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <ShimmerEffect
              v-if="!isMounted"
              bg="dark"
              height="48px"
              radius="15px"
            ></ShimmerEffect>
            <div v-else class="form-group">
              <div class="date-box">
                <div class="date-box-input">
                  <Picker-EmDateTimePicker
                    ref="datePicker"
                    v-model="assetStore.pagiantion.created"
                    placeholder="Due Date"
                    :showValueIf="assetStore.pagiantion.created"
                    :options="{
                      ...globalData.datePickerOptions,
                      displayIn: 'bottom_right',
                      skipAutomaticValue: true,
                      adjustX: -50,
                      adjustY: 12,
                    }"
                  />
                </div>
                <button
                  @click.stop="$refs.datePicker.toggle()"
                  type="button"
                  class="ionic-btn"
                >
                  <i class="la la-calendar"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-xl-12">
            <template v-if="!isMounted">
              <div class="d-flex">
                <ShimmerEffect
                  bg="dark"
                  width="130px"
                  height="48px"
                  radius="15px"
                  class="me-2 mt-3"
                ></ShimmerEffect>
                <ShimmerEffect
                  bg="dark"
                  width="110px"
                  height="48px"
                  radius="15px"
                  class="mt-3"
                ></ShimmerEffect>
              </div>
            </template>
            <template v-else>
              <button
                @click="assetStore.getAssetList({ is_search: true })"
                type="button"
                class="ionic-btn ionic-theme-btn2 ionic-btnlg ms-0"
              >
                <i class="las la-search"></i>Search
                <!-- <BtnLoader
                  v-if="H.isPendingAnyApi('Asset:list')"
                  color="black"
                ></BtnLoader> -->
              </button>
              <button
                @click="
                  assetStore.clearSearchForm();
                  assetStore.getAssetList();
                  $refs.assetSearchCompo.clear();
                "
                type="button"
                class="ionic-btn ionic-cancel-btn ionic-btnlg"
              >
                <i class="las la-redo-alt me-2"></i>Clear
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="ionic-card" @click.stop="showDateRange = false">
      <div class="ionic-card-header card-header-border">
        <h4 class="fs-20">
          Asset List
          <i v-if="assetStore.assetList?.length"
            class="la la-calendar cp"
            @click.stop="showDateRange = !showDateRange"
          ></i>
          <div
            :class="{ 'd-none': !showDateRange }"
            class="calendar-dropdown-body"
          >
            <div class="calendar-dropdown-body-inner">
              <label class="mr-2">Select Date Range</label>
              <Picker-EmDateTimePicker
                ref="ppicker"
                v-model="dateObj"
                @change="
                  async ({ startDate: start_date, endDate: end_date }) => {
                    showDateRange = false;
                    await assetStore.getAssetList({ start_date, end_date });
                  }
                "
                placeholder="Date Range"
                :options="{
                  ...globalData.datePickerOptions,
                  rangePicker: true,
                  skipAutomaticValue: false,
                  displayIn: 'modal',
                  adjustX: 0,
                }"
              />

              <div class="mt-2">
                <button
                  type="button"
                  value="Submit"
                  class="ionic-btn ionic-theme-btn2 ms-0"
                >
                  Submit
                </button>
                <button
                  @click.stop="
                    async () => {
                      showDateRange = false;
                      $refs.ppicker.setDate(new Date());
                      await assetStore.getAssetList();
                    }
                  "
                  type="button"
                  class="ionic-btn ionic-cancel-btn"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </h4>

        <div class="card-header-rightside">
          <button
            class="ionic-btn ionic-theme-btn2 addnew-product-btn"
            @click="assetCreateMode = true"
          >
            <i class="la la-plus"></i>Add Asset
          </button>
        </div>
      </div>
      <div class="ionic-card-body">
        <div class="table-responsive">
          <table class="table table-borderless">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Asset Details</th>
                <th>Peplink</th>
                <th>Victron</th>
                <th>Last Modified</th>
                <th>Current Condition</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody @click.stop="H.toggleLoopItem(assetStore.assetList, -1)">
              <tr class="empty-tr">
                <td colspan="88"></td>
              </tr>
              <template
                v-if="!isMounted || H.isPendingAnyApi('Asset:list', true)"
              >
                <template v-for="x in assetStore.assetList?.length || 20">
                  <tr>
                    <td>
                      <ShimmerEffect bg="light" height="40px"></ShimmerEffect>
                    </td>
                    <td colspan="4">
                      <ShimmerEffect bg="light" height="40px"></ShimmerEffect>
                    </td>
                    <td>
                      <ShimmerEffect bg="light" height="40px"></ShimmerEffect>
                    </td>
                    <td>
                      <ShimmerEffect bg="light" height="40px"></ShimmerEffect>
                    </td>
                    
                  </tr>
                </template>
              </template>
              <template v-else>
                <template v-if="assetStore.assetList?.length">
                  <template
                    v-for="(asset, index) in assetStore.assetList"
                    :key="index"
                  >
                    <tr>
                      <td>
                        <a class="cp" @click.stop="onClickEditAsset(asset)">{{ asset?.product?.name }}</a>
                      </td>
                      <td>                 
                        <a class="cp" @click.stop="onClickEditAsset(asset)">{{ asset?.serial_no }}</a>
                      </td>
                      <td>
                        <span v-if="peplinkStore.peplinkDeviceAssets[asset.id]">
                            {{peplinkStore. peplinkDeviceAssets[asset.id] }}
                        </span>
                      </td>
                      <td>
                        <span v-if="peplinkStore.victornDeviceAssets[asset.id]">
                            {{peplinkStore. victornDeviceAssets[asset.id] }}
                        </span>
                      </td>
                      <td>{{ H.transformDate(asset.modified) }}</td>
                      <td @contextmenu="log(asset)">
                        <span
                          class="cp"
                          :class="[
                            RentmyHelper.asset.getCondition(asset)?.className ||
                              'activestatus-btn',
                          ]"
                          @click.stop="
                            assetStore.targetAsset = asset;
                            assetStore.checkAssigned(asset.id);
                          "
                        >
                          {{ RentmyHelper.asset.getCondition(asset)?.name }}
                          <BtnLoader
                            :show="
                              H.isPendingAnyApi('Asset:checkAssigned') &&
                              assetStore.targetAsset?.id == asset.id
                            "
                          ></BtnLoader>
                        </span>
                      </td>

                      <td>
                        <div class="table-action">
                          <div
                            @click.stop="
                              H.toggleLoopItem(assetStore.assetList, index)
                            "
                            class="table-actionicon"
                          >
                            <i class="las la-ellipsis-v"></i>
                          </div>

                          <div class="table-action-body" v-if="asset?.isShow">
                            <a
                              @click.stop="
                                assetStore.assetClone({ asset_id: asset.id })
                              "
                              class=""
                              ><i class="la la-clone"></i> Clone
                            </a>
                            <!-- <a href="#" class=""><i class="la la-registered"></i> retire and asset </a> -->
                            <!-- <a href="#" class=""><i class="la la-cog"></i> Service </a> -->
                            <a @click.stop="onClickEditAsset(asset)"
                              ><i class="las la-edit"></i> Edit
                            </a>
                            <a @click.stop="onClickDeleteAsset(asset)"
                              ><i class="las la-trash-alt"></i> Delete</a
                            >
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="88">
                      <h6 class="text-muted">No Asset Found</h6>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
        <div
          class="d-flex justify-content-end align-items-center my-3"
          @click="false"
        >
          <p class="me-4">
            <strong class="text-white-50">
              Total: {{ assetStore.paginateData?.total }}
              <span class="mx-3">|</span>
              Page: {{ assetStore.paginateData?.page_no }}
              <span class="mx-3">|</span>
              Showing: {{ assetStore?.assetList?.length || 0 }}
            </strong>
          </p>

          <PaginationRentMy
            v-model="assetStore.paginateData"
            :prevent="true"
            @jumpToPage="(page_no) => assetStore.getAssetList({ page_no })"
          ></PaginationRentMy>
        </div>
      </div>
    </div>

    <modal-ChangeStatus
      v-if="assetStore.statusModal"
      v-model="assetStore.statusModal"
      :statusId="assetStore.targetAsset?.current_status"
      :statusList="globalData.asset.statusList"
      @yes="
        assetStore.updateStatus();
        assetStore.targetAsset = null;
      "
      :bntLoader="H.isPendingAnyApi('Asset:updateStatus')"
    >
    </modal-ChangeStatus>
  </div>
</template>

<style>
.main-content-of-picker header * {
  font-size: 14px;
}
</style>
