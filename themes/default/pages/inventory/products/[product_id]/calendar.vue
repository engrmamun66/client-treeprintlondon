

<template>
    <div>
        <Breadcrumb title="Order Details" :links="['products', 'productCalendar']"></Breadcrumb>
        <div class="ionic-card">
          <!-- <div class="ionic-card-header card-header-border">
              <div class="ionic-card-rightside">
                  <div class="ionic-tab">
                      <ul class="ionic-tab">
                          <template v-if="showEffect">
                              <li>
                                  <ShimmerEffect bg="dark" width="100px" height="35px" radius="25px"></ShimmerEffect>
                              </li>
                              <li class="tab-devided" style="transform: translateY(-14px)"></li>
                              <li>
                                  <ShimmerEffect bg="dark" width="100px" height="35px" radius="25px"></ShimmerEffect>
                              </li>
                              <li class="tab-devided" style="transform: translateY(-14px)"></li>
                              <li>
                                  <ShimmerEffect bg="dark" width="100px" height="35px" radius="25px"></ShimmerEffect>
                              </li>
                              <li class="tab-devided" style="transform: translateY(-14px)"></li>
                              <li>
                                  <ShimmerEffect bg="dark" width="100px" height="35px" radius="25px"></ShimmerEffect>
                              </li>
                          </template>
                          <template v-else>
                              <li>
                              <a :class="{'tab-active': tab === 1}" @click="tab=1">Monthly</a>
                              </li>
                              <li class="tab-devided"></li>
                              <li>
                              <a :class="{'tab-active': tab === 2}" @click="tab=2">Weekly</a>
                              </li>
                              <li>
                              <a :class="{'tab-active': tab === 3}" @click="tab=2">Daily</a>
                              </li>
                              <li>
                              <a :class="{'tab-active': tab === 3}" @click="tab=2">Today</a>
                              </li>
                          </template>
                      </ul>
                  </div>
              </div>
          </div> -->
      
          <!-- <div class="ionic-card">
                  <div class="ionic-card-body">
                      <div> 
                      <h4 class="fs-18" @click="showEffect=!showEffect">Calendar</h4>
                  </div>
                  <div class="invoice-map">
                      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6511980.1304290565!2d-124.59210174550276!3d37.16036014148867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia%2C%20USA!5e0!3m2!1sen!2sbd!4v1718972991655!5m2!1sen!2sbd" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                      <div class="invoice-mapmore-menu">
                          <a href="#"><i class="las la-ellipsis-v"></i></a>
                          <div class="invoice-mapmore-menubody">
      
                          </div>
                      </div>
                  </div>
              </div>
          </div> -->
      
          <div class="ionic-card-body relative">
              <div class="w-100 relative">
                  <BtnLoader :show="H.isPendingAnyApi('Product:getCalendar')" class="absolute" style="right:140px;top:7px;z-index:3" ></BtnLoader>
              </div>
              <ClientOnly>
                  <FullCalendar  :options="{...calendarOptions, events:  productStore.pickupData }" :handleDate="(e)=>{console.log(e)}"  ref="fullCalendar"> 
                  </FullCalendar>
              </ClientOnly>
                  
          </div>
          <!-- <div class="ionic-card-body"> -->
          <!-- </div> -->
      
          <!-- <div class="ionic-card-body">
              <div class="row">
                  <div class="col-3"> 
                      <div class="table-responsive">
                          <table class="table table-borderless">
                              <thead>
                                  <tr>
                                      <th>Product List</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr class="empty-tr mb-3">
                                      <td colspan="88"></td>
                                  </tr>
                                  <tr>
                                      <td>
                                          <div class="table-imgbox d-flex align-items-center">
                                              <div class="table-img">
                                                  <img src="/img/product-image-placeholder.jpg"  alt="table product img" />
                                              </div>
                                              <h6 class="fs-12">Rental product 1</h6>
                                          </div>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
                  <div class="col-9"> 
                      <div class="table-responsive">
                          <table class="table table-borderless">
                              <thead>
                                  <tr>
                                      <template v-for="x in 7" :key="x">
                                          <th>{{printDate(x, 'ddd')}}</th>
                                      </template>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr class="empty-tr">
                                      <td colspan="88"></td>
                                  </tr>
                                  <tr>
                                      <td colspan="3">
                                        
                                      </td>
                                      <td colspan="7">
                                          <div class="d-flex justify-content-between" style="background-color: greenyellow; border-radius: 10px; padding: 2px">
                                              <div class="d-flex justify-content-between"> 
                                                  <i class="lar la-clock m-2" style="color: green;"></i>
                                                  <div style="color: green; padding:4px">
                                                      <h6 style="font-size:10px;color:green">08:00 AM</h6>
                                                      <span style="font-size:10px;">01-12-24 03-12-24</span>
                                                  </div>
                                              </div>
                                              <div style="color: green; padding:4px">
                                                  <h6 style="font-size:10px;color:green">08:00 AM</h6>
                                              </div>
                                          </div>
                                      </td>
                                      
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
                  
                 
                 
              </div>
          </div> -->
      
        </div>
        <section
            v-if="showUnavailableModal"
            class="modal fade addnew-product-modal"
            tabindex="-1"
            style="display: block; opacity: unset"
        >
        <div
            class="modal-dialog modal-dialog-centered"
            @click.stop="showUnavailableModal = false"
        >
        <div class="modal-content" @click.stop="false">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Remove Availability</h1>
            <button
              @click="
                 showUnavailableModal = false;
              "
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
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label"
                          >Date <span class="required"></span></label
                        >
                        <template v-if="modalEffect">
                          <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                        </template>
                        <template v-else>
                          <input
                            type="text"
                            placeholder=""
                            class="form-control"
                            :disabled="true"
                            v-model="makeUnavailableProductForm.date"
                          />
                        </template>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label"
                          >Quantity <span class="required">*</span></label
                        >
                        <template v-if="modalEffect">
                          <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                        </template>
                        <template v-else>
                          <input
                            type="number"
                            placeholder=""
                            class="form-control"
                            v-model="makeUnavailableProductForm.quantity"
                            :max="maximumUnavailableQuantity"
                          />
                        </template>
                    </div>
                    <span>Please enter a valid value to make the item unavailable.</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-between ps-0 pe-0">
            <template v-if="modalEffect">
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
                @click="showUnavailableModal = false"
              >
                Cancel
              </button>
              
              
              <button
                @click="makeProductUnavailable()"
                type="button"
                class="ionic-btn ionic-theme-btn2 save-btn"

              >
                Submit
               
                <BtnLoader
                  v-if="H.isPendingAnyApi('Product:makeProductUnavailable')"
                  color="black"
                ></BtnLoader>
              </button>
              <button
                v-if="hasReservedProduct"
                type="button"
                class="ionic-btn ionic-border-btn cancel-btn"
                @click="removeProductUnavailability()"
              >
                Remove
                <BtnLoader
                  v-if="H.isPendingAnyApi('Product:removeProductUnavailability')"
                  color="black"
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
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from 'moment';
import { useProductStore } from '~/stores/rentmy/Product';
const productStore = useProductStore();
definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: '%s | Calendar',
});

let showUnavailableModal = ref(false)
let showEffect = ref(true);
let modalEffect = ref(true)
let tab = ref
let fullCalendar = ref(null)
let currentMonthDisplay = ref('');
let productAvailablityPayload = ref({
    start_date: null,
    end_date: null,
    product_id: null,
    variants_products_id: null,
    location: null
})
let maximumUnavailableQuantity = ref(0)
let hasReservedProduct = ref(false)
let makeUnavailableProductForm = ref({
    product_id: null,
    variants_products_id: null,
    location: null,
    date: null,
    quantity: null
})
onMounted( async ()=>{
    globalLoader(true)
    const productId = useRoute().params.product_id;
    await productStore.getProduct(productId);
    showEffect.value = false;
    await productStore.getPrice(productId);
    productAvailablityPayload.value.product_id = productStore.product.id
    productAvailablityPayload.value.variants_products_id = productStore.product_variant[0].ids[0]
    globalLoader(false)
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal-eye-icon')) {
            const date = event.target.getAttribute('data-date');
            const available = event.target.getAttribute('data-available');
            const reserve = event.target.getAttribute('data-reserve');
            openModal(date, available, reserve);
        }
    });
    setToolbarButtons();
})
function renderDayCellContent(arg) {
    const formattedDate = moment(arg.date).format('YYYY-MM-DD');
    const info = productStore.calendarData.hasOwnProperty(`${formattedDate}`) ?  productStore.calendarData[formattedDate] : null;
    if(info?.available ||  info?.reserve){
        if(info?.reserve > 0 ){
           
            return {
            html: `<div class="d-flex justify-content-between"> 
                        <div>
                        <i style="padding-right:10px; margin-top:20px" class="las la-ban cp modal-eye-icon" data-date="${formattedDate}" data-available="${info.available}" data-reserve="${info.reserve}"></i>
                        </div>
                        <div>
                            <div style="padding-left:20px !important"><span >${arg.dayNumberText}</span></div>
                            <div class="additional-info"><span style="background-color:#37D517;color:black!important; padding:0px 10px!important">${typeof(info?.available) == 'undefined' ? '0' : info?.available } Available</span></div>
                            <div class="additional-info"><span style="background-color:#ed6a0a;color:black!important; padding:0px 10px!important">${typeof(info?.reserve) == 'undefined' ? '0' : info?.reserve } Not Available</span></div>
                        </div>
                    </div>`
                    
            };
        }else{
            return {
            html: `<div class="d-flex justify-content-between"> 
                        <div>
                        <i style="padding-right:10px; margin-top:20px" class="las la-ban cp modal-eye-icon" data-date="${formattedDate}" data-available="${info.available}" data-reserve="${info.reserve}"></i>
                        </div>
                        <div>
                            <div style="padding-left:20px !important"><span >${arg.dayNumberText}</span></div>
                            <div class="additional-info"><span style="background-color:#37D517;color:black!important; padding:0px 10px!important">${typeof(info?.available) == 'undefined' ? '0' : info?.available } Available</span></div>
                        </div>
                    </div>`
                    
            };
        }
    }
   
}

function renderEventContent(arg) {
    const { rent_start, rent_end } = arg.event.extendedProps;
    const rentStartDateTime = H.formatDate(rent_start, 'YYYY-MM-DD');

    const currentDateTime = H.formatDate(new Date(),'YYYY-MM-DD');

  // Check if rent_start is greater than the current date and time
  // if (rentStartDateTime > currentDateTime) {
          return {
            html: `<div style="margin-top:5px">
                        <div style="margin:5px">
                            <strong>${arg.event.title}</strong>
                        </div>
                  </div>`
          };
        }
      
      // <div style="margin:5px">
      //                   <div>Start date: ${rent_start ? H.formatDate(rent_start, 'YYYY-MM-DD') : ''}</div>
      //                   <div>End date: ${rent_end ? H.formatDate(rent_end, 'YYYY-MM-DD') : ''}</div>
      //               </div>
// }
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

let currentStartDate = null;

const debouncedDatesSet = debounce(async (info) => {
  globalLoader(true)
  setToolbarButtons(); 
  const currentMonth = info.view.currentStart;
  // handleDatesChange(info);
  if (currentStartDate && currentStartDate.getTime() === currentMonth.getTime()) {
    return;
  }
  currentStartDate = currentMonth;
  currentMonthDisplay.value = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const monthString = currentMonthDisplay.value;
  const parsedMonth = moment(monthString, "MMMM YYYY");
  const startDate = parsedMonth.startOf('month').format('YYYY-MM-DD');
  const endDate = parsedMonth.endOf('month').format('YYYY-MM-DD');
  productAvailablityPayload.value.start_date = startDate;
  productAvailablityPayload.value.end_date = endDate;
  productAvailablityPayload.value.location = useCookie('rentmy_location_id').value;
  await productStore.getCalendar({ params: productAvailablityPayload.value });
  globalLoader(false)
}, 3000);

async function handleDatesChange(info) {
  const currentStartDate = moment(info.start); // The start date of the current visible month
  const currentEndDate = moment(info.end).subtract(1, 'days'); // The end date of the current visible month

  // Calculate the next visible range's start and end dates
  const nextMonthStart = moment(currentStartDate).add(1, 'months').startOf('month');
  const nextMonthEnd = moment(nextMonthStart).endOf('month');

  productAvailablityPayload.value.start_date = currentStartDate.format('YYYY-MM-DD');
  productAvailablityPayload.value.end_date = currentEndDate.format('YYYY-MM-DD');
  productAvailablityPayload.value.location = useCookie('rentmy_location_id').value;

  await productStore.getCalendar({ params: productAvailablityPayload.value });

  // You can perform actions with these dates, like fetching events for the next month
}

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: productStore.pickupData,
  datesSet: debouncedDatesSet,
  eventChange: function (arg) {},
    headerToolbar: {
      start: "",
      center: "title",
      end: "dayGridMonth",
    },
    dayCellContent: renderDayCellContent,
    eventContent: renderEventContent
});
function setToolbarButtons() {
  const calendarApi = fullCalendar.value.getApi();
  const currentDate = calendarApi.getDate(); // Get the current visible date in FullCalendar
  const today = moment(); // Get today’s date using moment

  // Check if the current month in FullCalendar is today’s month
  const isCurrentMonth = moment(currentDate).isSame(today, 'month');

  // Show "prev" and "next" based on the comparison
  if (isCurrentMonth) {
    calendarOptions.value.headerToolbar.start = 'next'; // Hide prev button
  } else {
    calendarOptions.value.headerToolbar.start = 'prev,next'; // Show prev and next buttons
  }

  // Refresh FullCalendar options dynamically
  calendarApi.setOption('headerToolbar', calendarOptions.value.headerToolbar);
}
function openModal(date, available, reserve){
    showUnavailableModal.value = true
    makeUnavailableProductForm.value.date = date 
    makeUnavailableProductForm.value.location = productAvailablityPayload.value.location
    makeUnavailableProductForm.value.product_id = productStore.product.id
    makeUnavailableProductForm.value.variants_products_id = productStore.product_variant[0].ids[0]
    
    modalEffect.value = false
    if(reserve > 0){
        hasReservedProduct.value = true
        makeUnavailableProductForm.value.quantity = reserve
        maximumUnavailableQuantity.value = reserve
    }else{
        hasReservedProduct.value = false
        makeUnavailableProductForm.value.quantity = available
        maximumUnavailableQuantity.value = available
    }

}
async function makeProductUnavailable(){

    await productStore.addProductUnavailability( makeUnavailableProductForm.value)
    showUnavailableModal.value = false
    await productStore.getCalendar({ params: productAvailablityPayload.value });
}
async function removeProductUnavailability(){
  let payload = {
    date: makeUnavailableProductForm.value.date,
    location: makeUnavailableProductForm.value.location, 
    product_id: makeUnavailableProductForm.value.product_id ,
    variants_products_id: makeUnavailableProductForm.value.variants_products_id
  }
  await productStore.removeProductUnavailability( payload)
  showUnavailableModal.value = false
  await productStore.getCalendar({ params: productAvailablityPayload.value });
}
</script>
<style>
.fc-daygrid-event-harness {
  position: relative;
  top: auto;
  margin-top: auto;
}

.fc-daygrid-day-frame {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.fc-daygrid-day-top {
  margin-bottom: auto;
}

.fc-daygrid-event {
  font-size: 10px; /* Adjust the size as needed */
  padding: 5px;
  background-color: #563fd8;

}
</style>
