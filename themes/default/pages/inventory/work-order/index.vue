<script setup>
import { useWorkOrderStore } from "~/stores/WorkOrder";
import { useTechnicianStore } from "~/stores/Technician";
import { useOrderStore } from "~/stores/rentmy/Order";

const orderStore = useOrderStore();
const technicianStore = useTechnicianStore();
let workOrderStore = useWorkOrderStore();
provide("workOrderStore", workOrderStore);
provide("technicianStore", technicianStore);

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: "%s | Work Order",
});

let tab = ref(1);
let isMounted = ref(false);
let timeout = null;
let startDate = reactive({
  startDate: new Date(),
  endDate: new Date(),
});
let endDate = reactive({
  startDate: new Date(),
  endDate: new Date(),
});
let dueDate = reactive({
  startDate: new Date(),
  endDate: new Date(),
});

provide("startDate", startDate);
provide("endDate", endDate);
provide("dueDate", dueDate);
provide("isMounted", isMounted);

let showSearchOrder = ref(false);
let showPopupEffect = ref(false);
let showDetailEffect = ref(false);
provide("showDetailEffect", showDetailEffect);
watch(showSearchOrder, (a, b) => {
  showPopupEffect.value = true;
  H.delay(() => (showPopupEffect.value = false), 300);
});

let searchOrder = reactive({
  page: 1,
  is_search: true,
  id: null,
  status: null,
  name: null, //customer name
  email: null, //customer email
  location: useCookie('rentmy_location_id').value
  // address: null,
});

function searchOrderNow(time = 300) {
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    await orderStore.getOrderList({ searchParams: searchOrder });
  }, time);
}
function clearSearchOrder() {
  searchOrder.id = null;
  searchOrder.status = null;
  searchOrder.name = null;
  searchOrder.email = null;
  // searchOrder.address = null
  searchOrderNow(0);
}

async function asMounted() {
  await orderStore.getOrderList();
  await orderStore.getStatusList();
  await technicianStore.getTechnicianList();
  await workOrderStore.getList();
}

onMounted(async () => {
  document.addEventListener("click", (e) => (showSearchOrder.value = false));  
  await asMounted();
  if (workOrderStore.list?.length) {
    onClickShowDetails(workOrderStore.list[0]);
  }
  isMounted.value = true;
});

function onClickCreateNewFromCardHeader() {
  workOrderStore.addEditMode = true;
  workOrderStore.resetPayload();
  workOrderStore.workOrder.id = null;
}

provide("onClickCreateNewFromCardHeader", onClickCreateNewFromCardHeader);

function onClickShowDetails(item) {
  workOrderStore.addEditMode = false;
  Object.keys(workOrderStore.workOrder).forEach((key) => {
    if (key in item) {
      workOrderStore.workOrder[key] = item[key]; 
    }
  });
  showDetailEffect.value = true;
  H.delay(() => (showDetailEffect.value = false), 200);
  workOrderStore.getLogs();
  workOrderStore.getComments();
}

function onChangeAddress(address) {
  if (address?.address) {
    workOrderStore.payload.country = address.country_short_name;
    workOrderStore.payload.city = address.city;
    workOrderStore.payload.state = address.state;
    workOrderStore.payload.zipcode = address.zipcode;
    workOrderStore.payload.address = address.address;
    workOrderStore.payload.latitude = address.latitude;
    workOrderStore.payload.longitude = address.longitude;
  }
}
</script>

<template>
  <div>
    <Breadcrumb title="Work Orders" :links="['workOrder']"></Breadcrumb>
    
    <WorkOrderSearch></WorkOrderSearch>

    <div class="row">
      <div class="col-md-5">
        <div class="ionic-tab">
          <ul>
            <li>
              <a @click=" tab = 1; workOrderStore.clearSearch(); " :class="{ 'tab-active': tab == 1 }" >To Do </a>
            </li>
            <li class="tab-devided"></li>
            <li>
              <a @click=" tab = 2; workOrderStore.getList({ status: 4 }); " :class="{ 'tab-active': tab == 2 }" >Done </a>
            </li>
          </ul>
        </div>
        <div class="ionic-card ionic-tab-card">
          <div class="ionic-card-header card-header-border">
            <h4 class="fs-18">Work Orders</h4>
          </div>
          <div class="ionic-card-body set-min-height-for-min-width-900">
            <template v-if="!isMounted || H.isPendingAnyApi('WorkOrder:list')">
              <template v-for="x in workOrderStore.list?.length || workOrderStore.pagination?.per_page" >
                <div class="work-order-card ionic-db-card">
                  <div class="ionic-db-card-left">
                    <ShimmerEffect bg="light" width="180px" height="22px" class="mb-2" radius="10px" ></ShimmerEffect>
                    <ShimmerEffect bg="light" width="80px" height="16px" class="mb-3" radius="10px" ></ShimmerEffect>
                    <ShimmerEffect bg="light" width="90px" height="36px" radius="30px" ></ShimmerEffect>
                  </div>
                  <div class="ionic-db-card-right">
                    <div class="ionic-db-card-right-inner">
                      <ShimmerEffect bg="light" width="80px" height="16px" class="mb-3" radius="10px" ></ShimmerEffect> 
                      <ShimmerEffect bg="light" width="90px" height="36px" radius="30px" class="mb-2" ></ShimmerEffect>
                      <ShimmerEffect bg="light" width="80px" height="16px" class="mb-3" radius="10px" ></ShimmerEffect>
                    </div>
                  </div>
                </div>
              </template>
            </template>
            <template v-else>
              <template v-if="!workOrderStore.list?.length">
                <h6 class="text-white-50">No work order found</h6>
              </template>

              <template v-for="(item, index) in workOrderStore.list" :key="index" >
                <div class="work-order-card ionic-db-card cp" @click.stop="onClickShowDetails(item)" :class="{ 'workorder-active': workOrderStore.workOrder?.id == item?.id, }" >
                  <div class="ionic-db-card-left">
                    <h5 class="fs-16 mb-2 pb-1 cp">{{ item?.name }}</h5>
                    <p class="fs-12 mb-3 cp">
                      {{ item.type || "Type Unassigned" }}
                    </p>
                    <p class="work-status status-active cp">
                      {{
                        globalData.workOrder.statusList?.filter(
                          (s) => s.id == item.status
                        )?.[0]?.name
                      }}
                    </p>
                  </div>
                  <div class="ionic-db-card-right">
                    <div class="ionic-db-card-right-inner">
                      <span class="fs-10 mb-3 cp">
                        {{
                          item?.order_id
                            ? `Order #${item?.order_id}`
                            : "Order Unassigned"
                        }}
                      </span>
                      <span class="work-status cp" :class="[ item?.priority == 3 ? 'status-canceled' : 'status-active', ]" >
                        {{
                          globalData.workOrder.priorityList?.filter(
                            (p) => p.id == item.priority
                          )?.[0]?.name
                        }}
                        </span
                      >
                      <div>
                        <span class="fs-10 mt-3" @click.stop="false">
                          By: {{ item?.created_by?.name }}
                        </span>
                        <span class="fs-10" :class="[ item?.user?.name ? 'text-white' : 'opacity-50', ]" @click.stop="false" > To: {{ item?.user?.name || "Unassigned" }}</span >
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </template>

            <div class="d-flex justify-content-center my-3">
              <PaginationRentMy v-model="workOrderStore.paginateData" :prevent="true" @jumpToPage="(page) => workOrderStore.getList({ page })" >
              </PaginationRentMy>
            </div>
          </div>
        </div>
      </div>

      <div v-if="workOrderStore.addEditMode" class="col-md-7">
        <div class="ionic-card">
          <div class="ionic-card-header card-header-border">
            <h4 class="fs-22"> {{ workOrderStore.payload?.id ? "Update" : "Create" }} Work Order </h4>
          </div>
          <div class="ionic-card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group" :tooltip="workOrderStore.payload.name ? 'Name' : ''" >
                  <template v-if="!isMounted">
                    <ShimmerEffect bg="dark" width="100%" height="48px" class="mb-3" radius="15px" ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <input v-model="workOrderStore.payload.name" class="form-control" type="text" placeholder="Name*" />
                  </template>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <template v-if="!isMounted">
                    <ShimmerEffect bg="dark" width="100%" height="48px" class="mb-3" radius="15px" ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <div class="select-optionbox" :tooltip="workOrderStore.payload.status ? 'Status' : ''" >
                      <select class="form-control" v-model="workOrderStore.payload.status" >
                        <template v-for="(status, i) in globalData.workOrder.statusList" >
                          <option :value="status.id">{{ status.name}}</option>
                        </template>
                      </select>
                    </div>
                  </template>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group" :tooltip="workOrderStore.payload.type ? 'Type' : ''" >
                  <template v-if="!isMounted">
                    <ShimmerEffect bg="dark" width="100%" height="48px" class="mb-3" radius="15px" ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <input v-model="workOrderStore.payload.type" class="form-control" type="text" placeholder="Type" />
                  </template>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <template v-if="!isMounted">
                    <ShimmerEffect bg="dark" width="100%" height="48px" class="mb-3" radius="15px" ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <div class="select-optionbox" :tooltip=" workOrderStore.payload.priority ? 'Priority' : '' " >
                      <select class="form-control" v-model="workOrderStore.payload.priority" >
                        <option :value="null">-Select Priority-</option>
                        <template v-for="(pririty, i) in globalData.workOrder .priorityList" >
                          <option :value="pririty.id">
                            {{ pririty.name }}
                          </option>
                        </template>
                      </select>
                    </div>
                  </template>
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-group">
                  <template v-if="!isMounted">
                    <ShimmerEffect bg="dark" width="100%" height="48px" class="mb-3" radius="15px" ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <div class="select-optionbox" :tooltip=" workOrderStore.payload.user_id ? 'Assigned To' : '' " >
                      <select class="form-control" v-model="workOrderStore.payload.user_id" >
                        <option :value="null">-Assigned To-</option>
                        <template v-for="( technician, index ) in technicianStore.technicianList" :key="index" >
                          <option :value="technician.id">
                            {{ technician.name }}
                          </option>
                        </template>
                      </select>
                    </div>
                  </template>
                </div>
              </div>
              <div class="col-md-6" @click.stop="false">
                <template v-if="!isMounted">
                  <ShimmerEffect bg="dark" width="100%" height="48px" class="mb-3" radius="15px" ></ShimmerEffect>
                </template>
                <template v-else>
                  <div class="form-group" :tooltip=" workOrderStore.payload.order_id ? 'Linked Order ID' : '' " >
                    <input v-keep-only-digits @click="showSearchOrder = !showSearchOrder" v-model="workOrderStore.payload.order_id" class="form-control" type="text" placeholder="Linked Order ID*" />
                    <section v-if="showSearchOrder" class="field-popup-area">
                      <div class="row">
                        <div class="col-6 mb-2" :tooltip="searchOrder.id ? 'Order Id' : ''" flow="down" >
                          <template v-if="showPopupEffect">
                            <ShimmerEffect bg="dark" width="100%" height="30px" class="" radius="15px" ></ShimmerEffect>
                          </template>
                          <template v-else>
                            <input v-model="searchOrder.id" @keyup.enter="searchOrderNow" class="form-control smaller" type="search" placeholder="Order id" />
                          </template>
                        </div>
                        <div class="col-6 mb-2" :tooltip="searchOrder.status ? 'Status-' : ''" flow="down" >
                          <template v-if="showPopupEffect">
                            <ShimmerEffect bg="dark" width="100%" height="30px" class="" radius="15px" ></ShimmerEffect>
                          </template>
                          <template v-else>
                            <select class="form-control smaller" v-model="searchOrder.status" @change="searchOrderNow" >
                              <option :value="null">-Status-</option>
                              <template v-for="( orderStatus, sIndex ) in orderStore.statusList" :key="sIndex" >
                                <option :value="orderStatus.id">
                                  {{ orderStatus?.label }}
                                </option>
                              </template>
                            </select>
                          </template>
                        </div>
                        <div class="col-6 mb-2" :tooltip="searchOrder.name ? 'Name' : ''" >
                          <template v-if="showPopupEffect">
                            <ShimmerEffect bg="dark" width="100%" height="30px" class="" radius="15px" ></ShimmerEffect>
                          </template>
                          <template v-else>
                            <input v-model="searchOrder.name" @keyup.enter="searchOrderNow" class="form-control smaller" type="search" placeholder="Name" />
                          </template>
                        </div>
                        <div class="col-6 mb-2" :tooltip="searchOrder.email ? 'Email' : ''" >
                          <template v-if="showPopupEffect">
                            <ShimmerEffect bg="dark" width="100%" height="30px" class="" radius="15px" ></ShimmerEffect>
                          </template>
                          <template v-else>
                            <input v-model="searchOrder.email" @keyup.enter="searchOrderNow" class="form-control smaller" type="search" placeholder="Email" />
                          </template>
                        </div>
                  
                        <!-- Search popup -->
                        <div class="col-md-6 col-6 mb-2">
                          <template v-if="showPopupEffect">
                            <ShimmerEffect bg="dark" width="100%" height="26px" class="" radius="8px" ></ShimmerEffect>
                          </template>
                          <template v-else>
                            <span @click="searchOrderNow()" class="activestatus-btn w-100 radius-10 cp" style="height: 28px" >Search <BtnLoader :show="H.isPendingAnyApi('Order:list')" ></BtnLoader>
                            </span>
                          </template>
                        </div>
                        <div class="col-md-6 col-6 mb-2">
                          <template v-if="showPopupEffect">
                            <ShimmerEffect bg="dark" width="100%" height="26px" class="" radius="8px" ></ShimmerEffect>
                          </template>
                          <template v-else>
                            <span @click="clearSearchOrder()" class="redstatus-btn w-100 radius-10 cp" style="height: 28px" >Clear</span >
                          </template>
                        </div>
                      </div>
                      <template v-if=" showPopupEffect || H.isPendingAnyApi('Order:list') " > <ul class="mt-2 overflow-y-auto">
                          <li> <ShimmerEffect count="5" bg="light" width="100%" height="20px" radius="5px" class="mb-2" ></ShimmerEffect> </li>
                        </ul>
                      </template>
                      <template v-else>
                        <ul @click.stop="false" class="mt-2 overflow-y-auto hoverable" style="--maxh: 280px" >
                          <template v-for="(order, index) in orderStore.orderList" :key="index" >
                            <li @click.stop=" workOrderStore.payload.order_id = order.id " class="px-2 py-1 cp" >
                              <!-- #{{ order.store_order_id }}, -->
                              #{{ [order.id, order.name === ' ' ? '' : order.name].filter(Boolean).join(', ') }}
                            </li>
                          </template>
                        </ul>
                      </template>
                    </section>
                  </div>
                </template>
              </div>
              <div class="col-md-6">
                <div class="form-group" :tooltip="workOrderStore.payload.due_date ? 'Due Date' : ''" >
                  <template v-if="!isMounted">
                    <ShimmerEffect bg="dark" width="100%" height="48px" class="mb-3" radius="15px" ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <div class="date-box" :tooltip=" workOrderStore.pagination.due_date ? 'Due Date' : '' " >
                      <div class="date-box-input">
                        <Picker-EmDateTimePicker ref="dueDatePicker" v-model="dueDate" placeholder="Due Date" :showValueIf="workOrderStore.payload.due_date" @change="
                            (data) => {
                              workOrderStore.payload.due_date = data.startDate;
                            }
                          "
                          :options="{ ...globalData.datePickerOptions, displayIn: 'bottom_right', adjustRight: -50, adjustTop: 12, }"
                        />
                      </div>
                      <button @click.stop="$refs.dueDatePicker.toggle()" type="button" class="ionic-btn" >
                        <i class="la la-calendar"></i>
                      </button>
                    </div>
                  </template>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group" :tooltip=" workOrderStore.payload.start_date ? 'Start Date' : '' " >
                  <template v-if="!isMounted">
                    <ShimmerEffect bg="dark" width="100%" height="48px" class="mb-3" radius="15px" ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <div class="date-box" :tooltip=" workOrderStore.pagination.due_date ? 'Due Date' : '' " >
                      <div class="date-box-input">
                        <Picker-EmDateTimePicker ref="startDatePicker" v-model="startDate" placeholder="Start Date" :showValueIf="workOrderStore.payload.start_date" @change="
                            (data) => {
                              workOrderStore.payload.start_date =
                                data.startDate;
                            }
                          "
                          :options="{ ...globalData.datePickerOptions, displayIn: 'bottom_left', adjustLeft: 0, adjustTop: 12, }"
                        />
                      </div>
                      <button @click.stop="$refs.startDatePicker.toggle()" type="button" class="ionic-btn" > <i class="la la-calendar"></i> </button>
                    </div>
                  </template>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group" :tooltip="workOrderStore.payload.end_date ? 'End Date' : ''" >
                  <template v-if="!isMounted">
                    <ShimmerEffect bg="dark" width="100%" height="48px" class="mb-3" radius="15px" ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <div class="date-box" :tooltip=" workOrderStore.pagination.due_date ? 'Due Date' : '' " >
                      <div class="date-box-input">
                        <Picker-EmDateTimePicker ref="endDatePicker" v-model="endDate" placeholder="End Date" :showValueIf="workOrderStore.payload.end_date" @change="
                            (data) => {
                              workOrderStore.payload.end_date = data.startDate;
                            }
                          "
                          :options="{ ...globalData.datePickerOptions, displayIn: 'bottom_right', adjustRight: -50, adjustTop: 12, }"
                        />
                      </div>
                      <button @click.stop="$refs.endDatePicker.toggle()" type="button" class="ionic-btn" >
                        <i class="la la-calendar"></i>
                      </button>
                    </div>
                  </template>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group" :tooltip=" workOrderStore.payload.address ? 'Pick a location' : '' " >
                  <template v-if="!isMounted">
                    <ShimmerEffect bg="dark" width="100%" height="48px" class="mb-3" radius="15px" ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <el-BaseInput v-model="workOrderStore.payload.address" :addressSearchFromGoogle="true" @changeAddress="onChangeAddress" placeholder="Pick a location" ></el-BaseInput> </template>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group" :tooltip="workOrderStore.payload.country ? 'Country' : ''" > <template v-if="!isMounted">
                    <ShimmerEffect bg="dark" width="100%" height="48px" class="mb-3" radius="15px" ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <div class="select-optionbox">
                      <select class="form-control" v-model="workOrderStore.payload.country" >
                        <option :value="null">-Select Country-</option>
                        <template v-for="(country, i) in globalData.countries">
                          <option :value="country.code">
                            {{ country.name }}
                          </option>
                        </template>
                      </select>
                    </div>
                  </template>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group" :tooltip="workOrderStore.payload.city ? 'City' : ''" >
                  <template v-if="!isMounted">
                    <ShimmerEffect bg="dark" width="100%" height="48px" class="mb-3" radius="15px" ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <input v-model="workOrderStore.payload.city" class="form-control" type="text" placeholder="City" />
                  </template>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group" :tooltip="workOrderStore.payload.state ? 'State' : ''" >
                  <template v-if="!isMounted">
                    <ShimmerEffect bg="dark" width="100%" height="48px" class="mb-3" radius="15px" ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <input v-model="workOrderStore.payload.state" class="form-control" type="text" placeholder="State" />
                  </template>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group" :tooltip="workOrderStore.payload.zipcode ? 'Zipcode' : ''" >
                  <template v-if="!isMounted">
                    <ShimmerEffect bg="dark" width="100%" height="48px" class="mb-3" radius="15px" ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <input v-model="workOrderStore.payload.zipcode" class="form-control" type="text" placeholder="Zipcode"
                    />
                  </template>
                </div>
              </div>

              <div class="col-md-12">
                <template v-if="!isMounted">
                  <ShimmerEffect bg="dark" width="100%" height="196px" class="mb-3" radius="15px" ></ShimmerEffect>
                </template>
                <template v-else>
                  <div class="form-group" :tooltip=" workOrderStore.payload.description ? 'Description' : '' " >
                    <textarea v-model="workOrderStore.payload.description" class="form-control" placeholder="Description..." cols="30" rows="10" ></textarea>
                  </div>
                </template>
              </div>
              <div class="col-md-12">
                <template v-if="!isMounted">
                  <ShimmerEffect bg="dark" width="200px" height="48px" class="mb-3" radius="15px" ></ShimmerEffect>
                </template>
                <template v-else>
                  <div class="form-group" v-if="!workOrderStore.payload?.id">
                    <button @click.stop="workOrderStore.create({ callListApi: true })" type="button" class="ionic-btn ionic-theme-btn2 ionic-btnxl create-orderbtn" >
                      Create Work Order
                      <BtnLoader :show="H.isPendingAnyApi('WorkOrder:addEdit')" color="black" ></BtnLoader>
                    </button>
                  </div>
                  <div class="form-group" v-else>
                    <button @click.stop="workOrderStore.update()" type="button" class="ionic-btn ionic-theme-btn2 ionic-btnxl create-orderbtn me-3" >
                      Update
                      <BtnLoader
                        :show="H.isPendingAnyApi('WorkOrder:update')"
                        color="black"
                      ></BtnLoader>
                    </button>
                    <button @click.stop=" workOrderStore.resetPayload(); workOrderStore.addEditMode = false; " type="button" class="ionic-btn ionic-theme-btn redstatus-btn create-orderbtn" style="border-radius: 10px" >
                      Cancel
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WorkOrderDetails v-else></WorkOrderDetails>
    </div>
  </div>
</template>
