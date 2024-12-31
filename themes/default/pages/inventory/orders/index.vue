<script setup>
import { useOrderStore } from '~/stores/rentmy/Order';
const orderStore = useOrderStore();
import { useGeofencestore } from "~/stores/Geofence"; 
const geofenceStore = useGeofencestore();
import { useCompaniesStore } from "~/stores/vms/company";
const companyStore = useCompaniesStore();
import { useSitesStore } from "~/stores/vms/sites";
const siteStore = useSitesStore();

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: '%s | Orders',
});

let tab = ref(1);
let showTabs = ref(false);
let showEffect = ref(true);
let tableEffect = ref(false);
let showCreateOrderModal = ref(false);
let selectedOrderId = ref(null)
let withDelete = reactive({
  order: null,
  showConfirmation: false,
})


const isSpinning = ref(false);

function spinIcon() {
  isSpinning.value = true;
  setTimeout(() => {
    isSpinning.value = false;
  }, 1000); // Spin for 1 second
}

function handleClick() {
  asMounted();
  spinIcon();
}

function closeModal(order) {
       setTimeout(()=>{
        order.isShow = false;
       },500)
        
}

const orderStatusFlatList = computed(() => {
    const { statusList } = orderStore;
    if(!orderStore.statusList?.length) return [];
    else {
        let childs = H.clone(orderStore.statusList).filter(item => item.child).map(item => item.child);
        let status_flat = [...H.clone(orderStore.statusList), ...childs];
        status_flat.forEach(item => delete item.child);
        return status_flat.flat();
    }
})

function orderStatus(order){
    const { statusList } = orderStore;
    if(!statusList && !orderStore.statusList?.length) return '';
    else {       
        let status = orderStatusFlatList.value.filter(item => item.id == order.status)?.[0];
        return ({
            id : status?.id,
            label : status?.label,
            class : 'status-' + status?.label?.toLowerCase().replace(/\s/g, '-'),
            serial_no : status?.serial_no,
            color_code : status?.color_code,
        })
    }
}

async function jumpToPage(page_no){
  tableEffect.value = true;
  await orderStore.getOrderList({page_no, site_id: site_id.value});
  tableEffect.value = false;
};

async function onClickPlusIcon(order){
    orderStore.orderList.forEach(i => {
        i.showDetails = false
        i.showEffect = false
    })
    order.showDetails = true;
    order.showEffect = true; 
    H.delay(() => order.showEffect = false, 500)
    selectedOrderId=order.id;
    await orderStore.getOrderDetailsForListPage(order);
};

async function onClickMinusIcon(order){
    order.showDetails = false;
    order.showEffect = false;
    selectedOrderId=null;
};

const editItem = (order) => {
  navigateTo(`/inventory/orders/${order.id}`);
};
function onImageError(e) {
  e.target.src = '/img/product-image-placeholder.jpg';
}

let site_id = ref(useRoute()?.query?.site_id || null);
let site_name = ref(null);
provide('site_id_from_order_list_page', site_id);
let showSearch = ref(false);
let targetOrderId = ref(null);
let showOrderDetails = ref(false);

watch(showOrderDetails, (a, b)=>{
    if(a === true){
        H.withUrl.setQuery({orderId: targetOrderId.value})
    } else {
        H.withUrl.deleteQuery('orderId');
    }
})

async function asMounted(){
    await orderStore.getStatusList();   
    await orderStore.getOrderList({site_id: site_id.value});
    showEffect.value = false;
}

onMounted( async ()=>{   
    if(useRoute().query?.site_id){
        site_id.value = useRoute().query?.site_id;
    }
    if(useRoute().query?.site_name){
        site_name.value = useRoute().query?.site_name;
    }
    await companyStore.getCompanyList()
    if (useCookie("header_company").value && useCookie("header_company").value !='all') {
        await siteStore.getSiteList(useCookie("header_company").value, {per_page: 200});
        useCookie("header_site").value = "all";
        siteStore.headerSelectedSite = "all";
    } else {
        siteStore.getSiteList(null, {per_page: 200});
    }
    
    await asMounted();

    if(useRoute().query.orderId){
        targetOrderId.value = useRoute().query.orderId;
        showOrderDetails.value = true;
    }
})


</script>

<template>
<div> 

  <Breadcrumb title="Order List" :links="['orders']"></Breadcrumb>

  <Order-AllTabs
      ref="allTabs"
      v-if="showTabs"
      :orderId="targetOrderId"
      @unmount="
        showTabs = false;
        H.withUrl.deleteQuery('tab');
        async (modified_tabs) => {
            await orderStore.getStatusList();
        }
      "
    ></Order-AllTabs>

  <Rightbar v-if="showOrderDetails" title="Order Details" @unmount="showOrderDetails = false;orderStore.getOrderList({site_id})" :largestMode="true" >
    <Order-Details :orderId="targetOrderId" :inRightBar="true"></Order-Details>
  </Rightbar>

  <div class="ionic-card">
    <div class="ionic-card-header card-header-border">
        <h4 class="fs-18" >
            {{ site_name ?  `Order list of - ${site_name} ` : 'Order List '}}          
            <i-las @click="handleClick" t="reload"  :class="['las', 'la-sync-alt', { spin: isSpinning }]"></i-las> </h4>
  
      <div class="ionic-card-rightside">
        <div class="ionic-tab">
          <ul class="ionic-tab">
            <template v-if="showEffect">
                <li>
                    <ShimmerEffect bg="dark" width="100px" height="35px" radius="15px" class="me-2" ></ShimmerEffect>
                </li>
                <li>
                    <ShimmerEffect bg="dark" width="120px" height="35px" radius="15px"></ShimmerEffect>
                </li>
             
            </template>
            <template v-else>
                <li>
                    <button @click.stop="showSearch=!showSearch" class="ionic-btn ionic-theme-btn"  >
                        <i-las t="search" class="me-2"></i-las>  Search
                    </button>
                    <button @click.stop="showCreateOrderModal = true" class="ionic-btn ionic-theme-btn"  >
                        <i-las t="plus" class="me-2"></i-las>  Create Order
                    </button>
                </li>               
            </template>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="ionic-card-body">


        <Order-AdvancedSearch v-if="showSearch" ></Order-AdvancedSearch>

        <div class="table-responsive">
            <table class="table table-borderless">
            <thead>
                    <tr>
                        <th>#</th>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Geofence</th>
                        <th>Dates</th>
                        <th>Address</th>
                        <th>QTY</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody @click="H.toggleLoopItem(orderStore.orderList, -1)">
                    <tr class="empty-tr">
                        <td colspan="88"></td>
                    </tr>
                    <template v-if="showEffect || H.isPendingAnyApi('Order:list')">
                        <tr v-for="(x, index) in (orderStore?.paginateData?.data?.length || 5)" :key="index">
                            <td>
                                <ShimmerEffect bg="light" height="35px" width="40px" radius="10px"></ShimmerEffect>
                            </td>
                            <td colspan="8">
                                <ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect>
                            </td>                            
                            <td>
                                <ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect>
                            </td>
                        </tr>
                        
                    </template>
                    <template v-else>
                        <template v-for="(order, index) in orderStore.orderList" :key="index">
                            <tr>
                                <td> 
                                    <span v-if="!order.showDetails" @click="onClickPlusIcon(order)" class="plus"> + </span> 
                                    <span v-else class="plus" @click="onClickMinusIcon(order)">
                                        <template v-if="H.isPendingAnyApi('Order:orderDetails')">
                                            <BtnLoader :show="true" color="white" ></BtnLoader>
                                        </template>
                                        <template v-else>
                                            -
                                        </template>
                                    </span> 
                                </td>   
                                <td> 
                                    <nuxt-link :to="`/inventory/orders/${order.id}`">
                                        #{{order.id}}
                                    </nuxt-link>
                                </td>                                
                                <td> 
                                    <nuxt-link :to="`/inventory/orders/${order.id}`">
                                        {{ order?.name }}
                                    </nuxt-link>
                                 </td>    
                                 <td> 
                                    <span v-if="geofenceStore.geofenceOrders.includes(order.id)" >Assigned</span>
                                </td>                               
                                
                                <td>
                                    <div class="table-date-area">
                                        <div class="table-date">
                                            <template v-if="order?.rent_start">
                                                <small class="bg-black p-05 radius-3" >Start&nbsp;Date</small>
                                                <span class="mb-1">{{ H.formatDate(order.rent_start, 'DD MMM YYYY, hh:mm A') }}</span>
                                            </template>
    
                                            <template v-if="order.rent_end">
                                                <small class="bg-black p-05 radius-3" >End&nbsp;Date</small>
                                                <span>{{ H.formatDate(order.rent_end, 'DD MMM YYYY, hh:mm A') }}</span>
                                            </template>
    
                                            <template v-if="!order.start_end && !order.rent_end">
                                                <small class="bg-black p-05 radius-3" >Created</small>
                                                <span>{{ H.formatDate(order.created, 'DD MMM YYYY, hh:mm A') }}</span>
                                            </template>
    
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {{ order?.address }}
                                </td>
                                <td>
                                    {{ order?.total_quantity }}
                                </td>
                                <td>
                                    {{RentmyHelper.currency.format(order?.total_price)}}
                                </td>
                                <td>
                                    <span :class="[ orderStatus(order).class ]" >{{ orderStatus(order)?.label }}</span>
                                </td>
                                <td>
                                    <div class="table-action">
                                    <div class="table-actionicon" @click.stop="H.toggleLoopItem(orderStore.orderList, index)">
                                        <i class="las la-ellipsis-v"></i>
                                    </div>
                                    <div v-if="order.isShow" class="table-action-body" @click.stop="false">
                                        <nuxt-link :to="`/inventory/orders/${order.id}`" @click="closeModal(order)">
                                            <i class="las la-eye"></i> Details
                                        </nuxt-link>
                                        <!-- <a @click.stop="editItem(order); closeModal(order)">
                                            <i class="las la-edit"></i> Edit
                                        </a> -->
                                        <a @click.stop="withDelete.order = order; withDelete.showConfirmation = true; closeModal(order)">
                                            <i class="las la-trash-alt"></i> Delete
                                        </a>
                                        <!-- <a @click.stop="targetOrderId = order.id; showOrderDetails = true; closeModal(order)">
                                            <i class="las la-edit"></i> Edit
                                        </a> -->
                                        <a @click.stop="targetOrderId = order.id; showTabs = true; closeModal(order)">
                                            <i class="las la-edit"></i> Edit
                                        </a>
                                    </div>
                                </div>
                                </td>
                            </tr>
                            <tr v-if="order.showDetails && selectedOrderId==order.id">
                                <td colspan="11">
                                    <table class="table table-borderless table-dark">
                                        <thead>
                                            <tr>
                                                <th width="20%">#</th>
                                                <th width="20%">Name</th>
                                                <th width="20%">Type</th>
                                                <th width="10%">QTY</th>
                                                <th width="20%">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="empty-tr">
                                                <td colspan="88"></td>
                                            </tr>
                                            
                                            <template v-if="H.isPendingAnyApi('Order:orderDetails') || order.showEffect">
                                                <tr v-for="x in 2" :key="x">
                                                    <td><ShimmerEffect bg="light" height="30px" ></ShimmerEffect></td>
                                                    <td><ShimmerEffect bg="light" height="30px" ></ShimmerEffect></td>
                                                    <td><ShimmerEffect bg="light" height="30px" ></ShimmerEffect></td>
                                                    <td><ShimmerEffect bg="light" height="30px" ></ShimmerEffect></td>
                                                    <td><ShimmerEffect bg="light" height="30px" ></ShimmerEffect></td>
                                                </tr>
                                            </template>
                                            <template v-else>
                                                <template v-for="(orderItem, index) in order?.details?.order_items" :key="index">
                                                    <tr>
                                                        <td><img class="mt-2" :src="RentmyHelper.product.image(orderItem?.product?.id , orderItem?.product?.images[0]?.image_small)" @error="onImageError" alt="table product img" style="height:60px;width:auto;" /></td>
                                                        <td>{{orderItem?.product?.name}}</td>
                                                        <td><i class="la la-cube fs-18"></i>{{orderItem.product.type == 2 ?  'Rental Product' : 'Buy Product'}}</td>
                                                        <td>{{orderItem?.quantity}}</td>
                                                        <td>{{RentmyHelper.currency.format(orderItem?.sub_total)}} </td>
                                                    </tr>
                                                </template>
                                            </template>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </template>
                    </template>
                </tbody>
            </table>
        </div>
        <template v-if="showEffect">
              <div class="d-flex justify-content-end align-items-center my-3">
                <ShimmerEffect bg="dark" width="64px" height="12px" class="me-4" speed="1s" radius="2px":stopAnimaiton="false"></ShimmerEffect>
                <ShimmerEffect bg="dark" width="64px" height="12px" class="me-4" speed="1s" radius="2px":stopAnimaiton="false"></ShimmerEffect>
                <ShimmerEffect bg="dark" width="64px" height="12px" class="me-4" speed="1s" radius="2px":stopAnimaiton="false"></ShimmerEffect>

                <ShimmerEffect bg="dark" width="32px" height="32px" class="me-2" speed="1s" :stopAnimaiton="false"></ShimmerEffect>
                <ShimmerEffect bg="dark" width="32px" height="32px" class="me-2" speed="1s" :stopAnimaiton="false"></ShimmerEffect>
                <ShimmerEffect bg="dark" width="32px" height="32px" class="me-2" speed="1s" :stopAnimaiton="false"></ShimmerEffect>
                <ShimmerEffect bg="dark" width="32px" height="32px" class="me-2" speed="1s" :stopAnimaiton="false"></ShimmerEffect>
              </div>
            </template>
            <template v-else>
                <div class="d-flex justify-content-end align-items-center my-3">
                    <p class="me-4"> <strong class="text-white-50"> 
                        Total: {{ orderStore.paginateData?.total || 0 }}
                        <span class="mx-3">|</span>
                        Page: {{ orderStore.paginateData?.page_no || 1 }}
                        <span class="mx-3">|</span>
                        Showing: {{ orderStore.orderList?.length || 0 }}
                    </strong> </p>
                    <PaginationRentMy v-model="orderStore.paginateData" @jump-now="jumpToPage" ></PaginationRentMy>
                </div>
            </template>
    </div>


    <!-- ==================== Modal==================== -->
    <!-- ==================== Modal==================== -->
    <!-- ==================== Modal==================== -->

    <Modal-Confirm v-if="withDelete.showConfirmation" v-model="withDelete.showConfirmation" :skipAutoClose="true" @yes="async()=>{
      let deleted = await orderStore.deleteOrder(withDelete.order.id);
      withDelete.showConfirmation = false;
    }">
     Are you sure want to delete?
     <template #btn-yes>
        <BtnLoader :show="H.isPendingAnyApi('Order:deleteOrder')" />
    </template>
     
    </Modal-Confirm>

    <Modal-Confirm v-if="orderStore.hasReurnableAsset" v-model="orderStore.hasReurnableAsset" :skipAutoClose="true" @yes="async()=>{
      await orderStore.deleteOrder(withDelete.order.id, true);
      orderStore.hasReurnableAsset = false;
    }">
     Some assets didn't return yet.
     <template #btn-yes>
        <BtnLoader :show="H.isPendingAnyApi('Order:deleteOrder')" />
    </template>
     
    </Modal-Confirm>


    <!-- orderStore.quickOrder() -->
    <Order-beforeOrderModal 
    v-if="showCreateOrderModal" 
    v-model="showCreateOrderModal"
    
     ></Order-beforeOrderModal>

  </div>
</div>

</template>
