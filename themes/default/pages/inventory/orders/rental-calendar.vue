<script setup>
import { useCalendarStore } from '~/stores/rentmy/Calendar';
const calendarStore = useCalendarStore();
import { useGeofencestore } from "~/stores/Geofence";
import { usePeplinkStore } from "~/stores/Peplink";
const geofencestore = useGeofencestore();
const peplinkStore = usePeplinkStore();

let mapExpand = ref(true);
let pinned = ref(false);
let showMapToogleButton = ref(false);
let showMap = ref(true);


definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

useHead({
  titleTemplate: '%s | Calendar',
});

function toggle_by_keypress(event){
  if(showRightBar == true) return;
  if(event.key.toLowerCase() == "w"){
    pinned.value = !pinned.value;
  }
  else if(event.key.toLowerCase() == "e"){
    mapExpand.value = !mapExpand.value;
  }
  else if(event.key.toLowerCase() == "+" || event.key.toLowerCase() == "="){
    mapHeightIncDec('+')
  }
  else if(event.key.toLowerCase() == "-"){
    mapHeightIncDec('-')
  }
}


// Handle Map Height
let mapHeight = ref(500);
let heightTimeout = null;
const step = 50;
const maxHeightAdjust = 120;


function mapHeightIncDec(sign){
  clearTimeout(heightTimeout);
  mapExpand.value = Number(mapExpand.value);

  if(mapExpand.value){
    if(sign === '+'){
      if(mapHeight.value < (window.innerHeight - maxHeightAdjust))
        mapHeight.value += step;
    } else {
      if(mapHeight.value >= 100)
        mapHeight.value -= step;
    }
  }
}

function checkMapHeightByWindowHeight(){
  if(mapHeight.value > (window.innerHeight - maxHeightAdjust)){
    mapHeight.value = (window.innerHeight - maxHeightAdjust);
  }
}
 

onBeforeUnmount(()=>{
  document.removeEventListener('keyup', toggle_by_keypress);
  window.removeEventListener('resize', checkMapHeightByWindowHeight);
});

onMounted(async () => {

  document.removeEventListener('keyup', toggle_by_keypress);
  document.addEventListener('keyup', toggle_by_keypress);
  window.addEventListener('resize', checkMapHeightByWindowHeight);

  calendarStore.date = H.formatDate(new Date);
  setTimeout(() => {
    showMapToogleButton.value = true;
  }, 700);
})
 

async function prevous(){
  calendarStore.date = moment(calendarStore.date).subtract(1, calendarStore.calendarType).format('YYYY-MM-DD');
  calendarStore.getCalendarData();
}
async function next(){
  calendarStore.date = moment(calendarStore.date).add(1, calendarStore.calendarType).format('YYYY-MM-DD');
  calendarStore.getCalendarData();
}



function setProductsHeight(){
  let left_els = Array.from(document.querySelectorAll('.LeftRow'));
  let right_els = Array.from(document.querySelectorAll('.RightRow'));
  if(left_els?.length && right_els?.length){
    if(left_els.length === right_els.length){
      right_els.forEach((el, i) => {
        let bound = el.getBoundingClientRect();
        let productEl = left_els[i];
        let height = bound.height;
        let AssetItems = Array.from(el.querySelectorAll('[AssetItem]'));
        if(AssetItems?.length && height < 100){
          height += (30 * AssetItems?.length);
        }

        productEl.style.height = `${height}px`
      })
    }
  }
}

let interVal = null;

onMounted(async()=>{
  await calendarStore.getCalendarData();

  clearInterval(interVal);
  interVal = setInterval(setProductsHeight, 100);

})

onBeforeUnmount(() => {
  clearInterval(interVal);
})

// -- class list
// datetime-box-active
// datetime-box-hold
// datetime-box-reserved

function cahngeMode(mode='month'){
  switch (mode) {
    case 'month':
      calendarStore.getCalendarData();
      break;
  
    default:
      break;
  }
}

let colWidth = '90px';

function customerName({order_address}){
  if(!order_address) return ''
  return `${order_address?.first_name || 'N/C'} ${order_address?.last_name || ''}`;
}

function styles({startDate, endDate, is_older_startDate}){

  if(!is_older_startDate){
    let d1 = new Date(startDate).getDate() - 1;
    let diff = moment(endDate).diff(startDate, 'day') + 1;
 
    let styleArr = [];

    let m = (parseInt(colWidth) * d1);

    let marginLeft = 'margin-left:' + (m > 10 ? m - 5 : m) + 'px';
    let w = parseInt(colWidth) * diff;
    let width = 'width:' + (w == 90 ? 140 : w) + 'px';    
    
    styleArr.push(marginLeft);
    styleArr.push(width);    
    return styleArr.join(';');

  } else {

    let start_date_of_month = moment(calendarStore.date).startOf('month').format('YYYY-MM-DD');
    let d1 = new Date(endDate).getDate() - 1;
    let diff = moment(endDate).diff(start_date_of_month, 'day') + 1;
 
    let styleArr = [];
    
    let w = parseInt(colWidth) * diff;
    let width = 'width:' + (w == 90 ? 140 : w) + 'px';   
    styleArr.push(width);
    return styleArr.join(';');
  }

}

let showRightBar = ref(false);
let orderId = ref(null);

function togglePopup(event=null, order=null){
  showRightBar.value = true
  orderId.value = order.id;
  

   calendarStore.products?.forEach(product => {
      if(product?.pickup_orders?.length){
        product?.pickup_orders?.forEach(ord => ord.showPopup = false);
      }
      if(product?.return_orders?.length){
        product?.return_orders?.forEach(ord => ord.showPopup = false);
      }
   })
}

function hasGeofence(order_id){
  if(geofencestore.geofenceList?.length){
    let index = geofencestore.geofenceList.findIndex(item => {
      return Array.from(item.order_ids).includes(order_id);
    });
    return index > -1;
  } else {
    return false;
  }
}

async function onClickGeofenceIcon(order_id, fromItem=false){
  if(hasGeofence(order_id) === false){
    return;
  } else {
    // focus map
    geofencestore.geofenceList.forEach(item => {
      if(item?.order_id == order_id){
        item.focusThis = true;
      } else {
        item.focusThis = false;
      }
      H.refreshMap();
    });
  }
}

function scrollTop(){
  window.scrollTo({
    top: 0,
    behavior: 'instant',
  });
}


</script>

<template>
  <div>

    <Breadcrumb title="Rental Calendar" :links="[ 'orders', 'retnalCalendar' ]" > </Breadcrumb>

    <Rightbar v-if="showRightBar" @unmount="async()=>{
      showRightBar = false;c
      await calendarStore.getCalendarData({loader: false});
      showMap = false;
      H.delay(()=>showMap=true);
    }" title="Order Details" :largestMode="true" >
      <Order-Details :orderId="orderId" :inRightBar="true" ></Order-Details>
    </Rightbar>

    <div class="row">
      <div class="col-md-12">
        <div class="ionic-tab">
          <ul>
              <li>
                  <a class="tab-active" @click.stop.prevent="cahngeMode('month')" >
                      Monthly
                  </a>
              </li>
              <!-- <li class="tab-devided"></li> -->
              <!-- <li>
                  <a class="">
                      Weekly
                  </a>
              </li> -->
              <!-- <li class="tab-devided"></li>
              <li>
                  <a class="">
                      Daily
                  </a>
              </li>
              <li class="tab-devided"></li>
              <li>
                  <a class="">
                      Day
                  </a>
              </li> -->
          </ul>
      </div>
        <div class="ionic-card ionic-tab-card">
          <div class="ionic-card-header card-header-border d-flex justify-content-between align-items-center">
            <h4 class="fs-18" >Calendar | {{ H.formatDate(calendarStore.date, 'MMM YYYY') }} <i-las @click="calendarStore.getCalendarData();" t="reload" class="" ></i-las> </h4>
            <div class="card-header-rightside card-calendar-rightside">
              <!-- <div class="calendar-status-area">
                <div class="calendar-staus calendar-staus-active">
                  <div class="calendar-status-circle"></div>
                  Active
                </div>
                <div class="calendar-staus calendar-staus-reserved">
                  <div class="calendar-status-circle"></div>
                  Reserved
                </div>
                <div class="calendar-staus calendar-staus-hold">
                  <div class="calendar-status-circle"></div>
                  Hold
                </div>
              </div> -->
              <div class="calendar-nextpreview-area">
                <button @click.stop="prevous()" type="button" class="ionic-btn ionic-nextpreview-btn"><i class="la la-angle-left"></i></button>
                <button @click.stop="next()" type="button" class="ionic-btn ionic-nextpreview-btn"><i class="la la-angle-right"></i></button>
              </div>
            </div>
          </div>
          <div class="ionic-card-body relative">
            <section id="map_section" :class="{pinned: pinned}" >
              <div class="row">
                <div class="col-12 mb-4 relative">
                  <GoogleMap-DispalyGeofences v-if="showMap" ref="geoMap" :locations="geofencestore.geofenceList" :mappedDeviceList="peplinkStore.mappedDeviceList" :height="mapExpand ? `${mapHeight}px` : '50px'" > </GoogleMap-DispalyGeofences>
                  <button v-if="showMapToogleButton" class="ionic-btn ionic-theme-btn2 map-size-toggler">
                    <span style="--tbg:#333;--tcolor:white;" :tooltip="!pinned ? 'Pin (w)' : 'Unpin (w)'" @click.stop="pinned = !pinned" ><i class='bx'  :class="{'bxs-pin': pinned, 'bx-pin': !pinned}" ></i> </span>
                    <span style="--tbg:#333;--tcolor:white;" @click.stop="mapHeightIncDec('+')" :tooltip="mapExpand ? 'Increase Size (+)' : ''" :class="{'opacity-25': !mapExpand}" ><i class="bx bx-plus m-0 p-0 me-1" ></i></span>
                    <span style="--tbg:#333;--tcolor:white;" @click.stop="mapHeightIncDec('-')" :tooltip="mapExpand ? 'Decrease Size (-)' : ''" :class="{'opacity-25': !mapExpand}" ><i class="bx bx-minus m-0 p-0 me-1" ></i></span>
                    <span style="--tbg:#333;--tcolor:white;" :tooltip="!pinned ? 'Pin (w)' : 'Unpin (w)'" class="pin-area" @click.stop="()=>{
                      pinned=!pinned;
                      if(pinned) mapExpand = true;
                      scrollTop()
                    }" >
                  </span>
                    <span @click.stop="mapExpand=!mapExpand" style="--tbg:#333;--tcolor:white;" :tooltip="!mapExpand ? 'Expand (e)' : 'Collaps (e)'"><i class="lni m-0 p-0" :class="{'lni-chevron-up': mapExpand, 'lni-chevron-down': !mapExpand}" ></i></span>
                  </button>
                </div>
              </div>
            </section>
            <div class="row">
              <div class="col-lg-3">
                <div class="ionic-card rental-calendar-pdlist">
                  <div class="ionic-card-header card-header-border">
                    <h4 class="fs-16">Product List</h4>
                  </div>
                  <div class="ionic-card-body">
                    <div class="rental-calendar-pdlist-body">
                      <ul>
                        <template v-if="calendarStore.products?.length" >
                          <template v-for="(product, index) in calendarStore.products" :key="index" >
                            <li class="LeftRow">
                              <div class="img-box-area">
                                <div class="img-box" @dblclick="log(H.clone(product))" >
                                  <img src="/img/product-image-placeholder.jpg" class="img-fluid" />
                                </div>
                                <div class="img-box-info align-items-start">
                                  <h6> {{ product?.name }} </h6>
                                  <template v-if="calendarStore.assetByProductId?.[product?.product_id]?.length" >
                                  
                                    <!-- <template v-for="aseetItem in calendarStore.assetByProductId?.[product?.product_id]?.filter(({order_id}) => {
                                      let pickup_order_ids = product.pickup_orders?.length ? product.pickup_orders.map(o => o.id) : [];
                                      let return_order_ids = product.return_orders?.length ? product.return_orders.map(o => o.id) : [];
                                      let all_order_ids = [...pickup_order_ids, ...return_order_ids];
                                      return all_order_ids.includes(order_id);
                                    })" > -->
                                    <template v-for="aseetItem in calendarStore.assetByProductId?.[product?.product_id]" >
                                      <p AssetItem @dblclick.stop="log(H.clone({aseetItem, product, assetByProductId: calendarStore.assetByProductId, mappedDeviceList:peplinkStore.mappedDeviceList}))" class="m-0 p-0 pt-1 fw-400 size-07 relative" style="line-height: 12px;" > 
                                        #{{ aseetItem?.order_id }} - Asset #{{ aseetItem?.asset.serial_no }} 
                                        <!-- - {{ aseetItem?.asset_id }} -->
                                        <template v-if="peplinkStore.mappedDeviceList?.length">
                                          <template v-for="deviceLocation in (peplinkStore.mappedDeviceList || []).filter(item => item?.asset_id == aseetItem?.asset_id )">
                                            <img 
                                            @click="()=>{
                                              let targetOrder = calendarStore.iOrders.filter(o => o.order_id == aseetItem?.order_id)?.[0];
                                              const group_id = deviceLocation.peplink_device.group_id;
                                              const peplink_device_id = deviceLocation.peplink_device.value;
                                              $refs.geoMap.setCenter({...deviceLocation, order: targetOrder, group_id, peplink_device_id});
                                              if(!pinned) scrollTop()
                                            }"
                                            @contextmenu.stop="log({deviceLocation: H.clone({...deviceLocation, order: targetOrder})})"
                                            :src="`/map-icon/pin-h.png`" tooltip="asdf" class="absolute cp" style="right:-20px;top:0px;height:18px" >
                                          </template>
                                        </template>

                                      </p>
                                    </template>

                                  </template>
                                </div>
                              </div>
                            </li>

                          </template>
                        </template>
                        <template v-else>
                          <li> 
                            <h5>Not Product Found</h5>  
                          </li>
                        </template>
                         
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-9">
                <div class="ionic-card ionic-calendar-card">
                  <div class="ionic-card-body">
                    <div class="rental-calendar-area">
                      <div class="rental-calendar-area-inner">
                        <div class="rental-calendar-datearea">
                          <ul>
                            <template v-for="monthDay in calendarStore.getMonthDays(calendarStore.date)" >
                              <li class="calendar-date-box">{{ H.formatDate(monthDay.date, 'ddd') }} &nbsp; {{ H.formatDate(monthDay.date, 'DD') }}</li>
                            </template>
               
                          </ul>
                        </div>
                        <div class="rental-calendar-body" >
                          <template v-if="calendarStore.products?.length" >
                            <template v-for="(product, index) in calendarStore.products" :key="index" >
                              <div class="calendar-box-row RightRow" >

                                
                                <template v-if="product?.pickup_orders?.length || product.return_orders">
                                <!-- Pickup Orders -->
                                  <template v-if="product?.pickup_orders?.length">
                                    <template v-for="(order, oi) in product.pickup_orders" :index="oi">
                                      <div class="calendar-datetime-box cp" :class="{'datetime-box-active': true, 'startDateIsOld': order?.is_older_startDate}" 
                                      @click.stop="onClickGeofenceIcon(order?.id, true)" @dblclick.stop="togglePopup($event, order)" :style="styles(order)" >
                                        <div class="datetime-box-leftside">
                                          <div lefticons class="me-1" >
                                            <div class="datetime-qty cp" :class="{grayscale: !hasGeofence(order?.id)}"
                                            :style="styles(order).indexOf('140px')>-1 ? 'margin-bottom:3px': 'margin-right:3px'"
                                            :tooltip="hasGeofence(order?.id) ? 'Geofence' : 'N/A'" flow="right" @click.stop="onClickGeofenceIcon(order?.id)" >
                                              <i class="bx bx-shape-square size-08 centerize" :class="{'text-danger': !hasGeofence(order?.id)}"  ></i>
                                            </div>
                                            <div class="datetime-qty" @click.stop="togglePopup($event, order)">
                                              <i-las t="3dot" class="size-08 centerize" ></i-las>
                                            </div>
                                            <!-- <i class="la la-clock"></i> -->
                                          </div>
                                          <div class="leftside-datetime">
                                            <span> <NuxtLink :to="`/inventory/orders/${order?.id}`" >#{{ order.id }} </NuxtLink> </span><br>
                                            <span>{{ H.formatDate(order.startDate, FORMATS.date) }} - {{ H.formatDate(order.endDate, FORMATS.date) }}</span>
                                          </div>
                                        </div>
                                        <div class="datetime-box-rightside relative">
                                          <span> <NuxtLink :to="`/inventory/orders/${order?.id}`" >{{ customerName(order) || 'N/C' }}</NuxtLink> </span>
                                          <template v-if="false" >
                                            <div class="datetime-qty cp" :class="{grayscale: !hasGeofence(order?.id)}"
                                            :style="styles(order).indexOf('140px')>-1 ? 'margin-bottom:3px': 'margin-right:3px'"
                                            :tooltip="hasGeofence(order?.id) ? 'Geofence Available' : 'Geofence Not Created'" @click.stop="onClickGeofenceIcon(order?.id)" >
                                              <i class="bx bx-shape-square" :class="{'text-danger': !hasGeofence(order?.id)}"  ></i>
                                            </div>
                                            <div class="datetime-qty" @click.stop="togglePopup($event, order)">
                                              <i-las t="3dot" ></i-las>
                                            </div>

                                          </template>
                                          <!-- Popup -->
                                          <calendarPopup v-if="order?.showPopup" :order="order" :customerName="customerName" ></calendarPopup>
                                        </div>
                                      </div>                                  
                                    </template>
                                  </template>

                                  
                                  <!-- Return Orders -->
                                  <template v-if="product.return_orders?.length">
                                    <template v-for="(order, oi) in product.return_orders" :index="oi">
                                      <div class="calendar-datetime-box cp" :class="{'datetime-box-hold': true, 'startDateIsOld': order?.is_older_startDate}" 
                                      @click.stop="onClickGeofenceIcon(order?.id, true)" @dblclick.stop="togglePopup($event, order)" :style="styles(order)">
                                        <div class="datetime-box-leftside">
                                          <div lefticons class="me-1" >
                                            <div class="datetime-qty cp" :class="{grayscale: !hasGeofence(order?.id)}"
                                            :style="styles(order).indexOf('140px')>-1 ? 'margin-bottom:3px': 'margin-right:4px'"
                                            :tooltip="hasGeofence(order?.id) ? 'Geofence' : 'N/A'" flow="right" @click.stop="onClickGeofenceIcon(order?.id)" >
                                              <i class="bx bx-shape-square size-08 centerize" :class="{'text-danger': !hasGeofence(order?.id)}"  ></i>
                                            </div>
                                            <div class="datetime-qty" @click.stop="togglePopup($event, order)" >
                                              <i-las t="3dot" class="size-08 centerize" ></i-las>
                                            </div>
                                            <!-- <i class="la la-clock"></i> -->
                                          </div>
                                          <div class="leftside-datetime">
                                            <span> <NuxtLink :to="`/inventory/orders/${order?.id}`" >#{{ order.id }} </NuxtLink> </span><br>
                                            <span>{{ H.formatDate(order.startDate, FORMATS.date) }} - {{ H.formatDate(order.endDate, FORMATS.date) }}</span>
                                          </div>
                                        </div>
                                        <div class="datetime-box-rightside relative">
                                          <span> <NuxtLink :to="`/inventory/orders/${order.id}`" >{{ customerName(order) || 'N/C' }}</NuxtLink> </span>
                                          <template v-if="false" >
                                            <div class="datetime-qty cp" :class="{grayscale: !hasGeofence(order?.id)}"
                                            :style="styles(order).indexOf('140px')>-1 ? 'margin-bottom:3px': 'margin-right:4px'"
                                            :tooltip="hasGeofence(order?.id) ? 'Geofence Available' : 'Geofence Not Created'" @click.stop="onClickGeofenceIcon(order?.id)" >
                                              <i class="bx bx-shape-square" :class="{'text-danger': !hasGeofence(order?.id)}"  ></i>
                                            </div>
                                            <div class="datetime-qty" @click.stop="togglePopup($event, order)" >
                                              <i-las t="3dot" ></i-las>
                                            </div>

                                          </template>
                                          <!-- Popup -->
                                          <calendarPopup v-if="order?.showPopup" :order="order" :customerName="customerName" ></calendarPopup>
                                        </div>
                                      </div>                                  
                                    </template>
                                  </template>
                                </template>
                                <template v-else>
                                  <div style="height: 50px;" ></div>
                                </template>

                              </div>
                            </template> 
                          </template> 

                            
                        </div>
                      </div>
                    </div>
  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-size-toggler{
  position: absolute;
  left: calc(50% - 50px);
  bottom: -14px;
  box-shadow: 0px 3px 4px #0000008f;
  height: 30px;
  border-radius: 30px;
  color: #333;
  margin: 0;
  background: #d0ffe1;
  z-index: 1;
}
.map-size-toggler .pin-area{
  margin-right: 3px;
  margin-top: 5px;
}
.map-size-toggler .pin-area:hover{
  scale: 1.05;
}
#map_section.pinned{
  position: fixed;
  z-index: 999;
  top: 3px;
  left: 3px;
  width: 100%;
}
.centerize{
    transform: translate(2px, 2px);
}
.dragbar{
  position: absolute;
  z-index: 9;
  bottom: 0px;
  left: 12px;
  width: calc(100% - 24px);
  height: 8px;
  border-top: 1px solid red;
  border-bottom: 3px solid red;
  background-color: #000000;
  cursor: s-resize;
}
</style>