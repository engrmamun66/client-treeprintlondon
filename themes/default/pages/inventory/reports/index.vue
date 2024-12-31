<script setup>
import { useReportStore } from '~/stores/rentmy/Report';
let reportStore = useReportStore();
import { useOrderStore } from '~/stores/rentmy/Order';
let orderStore = useOrderStore();
import { useCustomFieldsStore } from '~/stores/rentmy/CustomFields';
let customFieldStore = useCustomFieldsStore();

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: "%s | Report",
});

const keys = [
    'general', 
    'customer', 
    'shipping', 
    'tax', 
    'payment',
    'order_items',
    'order_details',
    'custom',
  ];


let datePicker = ref(null);
let dateObj = ref({
  startDate: H.formatDate(new Date),
  endDate: H.formatDate(new Date),
});  
let orderDateTypeList = [
  {
      id: "order_date",
      name: "Order date"
  },
  
  {
      id: "start_date",
      name: "Start date"
  },
  
  {
      id: "end_date",
      name: "End date"
  },
  
  {
      id: "ship_date",
      name: "Ship date"
  },
  
  {
      id: "any_date",
      name: "Any date"
  },
]


let D = reactive({  
  general: [
    {
      id: "id",
      name: "Order ID",
      selected: true,
    },
    {
      id: "created",
      name: "Order date",
      selected: true,
    },
    {
      id: "total_quantity",
      name: "Items quantity",
      selected: true,
    },
    {
      id: "sub_total",
      name: "Sub total",
      selected: true,
    },
    {
      id: "total_discount",
      name: "Total discount",
      selected: true,
    },
    {
      id: "coupon_code",
      name: "Coupon code",
      selected: true,
    },
    {
      id: "coupon_amount",
      name: "Coupon amount",
      selected: true,
    },
    {
      id: "off_amount",
      name: "Discount",
      selected: true,
    },
    {
      id: "additional_charge",
      name: "Additional charge",
      selected: true,
    },
    {
      id: "tax",
      name: "Sales tax amount",
      selected: true,
    },
    {
      id: "return_charge",
      name: "Return amount",
      selected: true,
    },
    {
      id: "total_price",
      name: "Order total",
      selected: true,
    },
    {
      id: "rent_start",
      name: "Rent start date",
      selected: true,
    },
    
    {
      id: "rent_end",
      name: "Rent End date",
      selected: true,
    },
    {
      id: "status",
      name: "Order status",
      selected: true,
    },
    {
      id: "delivery_charge",
      name: "Shipping charges",
      selected: true,
    },    
  ],
  customer: [
    {
      id: "first_name",
      name: "First name",
      selected: false,
    },
    {
      id: "last_name",
      name: "Last name",
      selected: false,
    },
    {
      id: "mobile",
      name: "Mobile number",
      selected: false,
    },
    {
      id: "email",
      name: "Email ID",
      selected: false,
    },
    {
      id: "company",
      name: "Company name",
      selected: false,
    },
    {
      id: "country",
      name: "Country",
      selected: false,
    },
    {
      id: "address_line1",
      name: "Address line 1",
      selected: false,
    },
    {
      id: "address_line2",
      name: "Address line 2",
      selected: false,
    },
    {
      id: "city",
      name: "City",
      selected: false,
    },
    {
      id: "zipcode",
      name: "Zipcode",
      selected: false,
    },
    
    {
      id: "state",
      name: "State",
      selected: false,
    },
  ],
  order_items: [
    {
      id: "id",
      name: "Product ID",
      selected: false,
    },
    {
      id: "name",
      name: "Product Name",
      selected: false,
    }, 
    {
      id: "product_option",
      name: "Product options with product name",
      selected: false,
    },
    {
      id: "assets_serial_no",
      name: "Assigned assets",
      selected: false,
    },
    {
      id: "asset_costing_breakdown",
      name: "Asset costing breakdown",
      selected: false,
    }, 
  ],
  shipping: [
    {
      id: "shipping_first_name",
      name: "Shipping first name",
      selected: false,
    },
    {
      id: "shipping_last_name",
      name: "Shipping last name",
      selected: false,
    },
    {
      id: "shipping_email",
      name: "Shipping email",
      selected: false,
    },
    {
      id: "shipping_mobile",
      name: "Shipping phone number",
      selected: false,
    },
    {
      id: "shipping_address1",
      name: "Address line1",
      selected: false,
    },
    {
      id: "shipping_address2",
      name: "Address line2",
      selected: false,
    },
    {
      id: "shipping_country",
      name: "Shipping country",
      selected: false,
    },
    {
      id: "shipping_state",
      name: "Shipping state",
      selected: false,
    },
    {
      id: "shipping_city",
      name: "Shipping city",
      selected: false,
    },
    {
      id: "shipping_zipcode",
      name: "Shipping ZIP",
      selected: false,
    },
  ],
  tax: [
    {
      id: "total_tax",
      name: "Total tax",
      selected: false,
    },
    {
      id: "delivery_tax",
      name: "Delivery tax",
      selected: false,
    },
    {
      id: "tax_exempt",
      name: "Tax-exempt yes/no",
      selected: false,
    },
    {
      id: "tax_by_city_county_state",
      name: "Tax by city, county, state",
      selected: false,
    },
  ],
  payment: [
    {
      id: "total_paid_amount",
      name: "Payment amount",
      selected: false,
    },
    {
      id: "transaction_id",
      name: "Transaction ID",
      selected: false,
    },
    {
      id: "payment_gateway",
      name: "Payment source",
      selected: false,
    },
    {
      id: "created",
      name: "Payment date",
      selected: false,
    },
  ],
  order_details: [
    {
      id: "salesperson",
      name: "Salesperson",
      selected: false,
    },
    {
      id: "order_notes",
      name: "Order notes",
      selected: false,
    },
    {
      id: "event_location",
      name: "Order source",
      selected: false,
    },
  ],
  custom: [], // will set from api data
  start_date: H.formatDate(new Date),
  end_date: H.formatDate(new Date),
  export: "excel", // static
  location: "",
  status: "",
  order_date: "order_date",
});

watch(dateObj, ({startDate, endDate}, b) => {
  D.start_date = startDate;
  D.end_date = endDate;
})

let isSelectedAll = computed(() => {
  try {
    
    let selectedAll = (key) => {
      let data = D[key];
      if(!data.length) return false;
      return data.every(item => item?.selected === true);
    }
    return keys.map(selectedAll).every(item => item === true);  
  } catch (error) {
    console.error('isSelectedAll', {error});
  }
})

function toggleCheck(){
  if(isSelectedAll.value){
    keys.forEach(key => {
      D[key].forEach(item => item.selected = false);
    })
  } else {
    keys.forEach(key => {
      D[key].forEach(item => item.selected = true);
    })
  }
  D['general'].forEach(item => item.selected = true);
}


async function getSavedReport(rid){ 
  await reportStore.getSavedReport(rid);
  let attrs = reportStore.savedReport?.attributes;
  if(attrs){
    keys.forEach(key => {
      let names = attrs?.[key];
      if(names?.length){
        D[key].forEach(item => {
          item.selected = names.includes(key?.name || key?.field_name);
        })
      } else {
        // Unselect All
        D[key].forEach(item => {
          item.selected = false;
        })
      }
    })
  }
}

async function asMount(){
  orderStore.getStatusList() 
  await reportStore.getSavedReportList();
  let customFields = await customFieldStore.getCustomFields(); 
  if(customFields){
    D.custom = customFields.map(item => {
      item.selected = false;
      return item;
    })
  }

  try {
    // getSavedReport
    let rid = useRoute().query?.rid;
    if(rid) {
      await reportStore.getSavedReport(rid);
      if(reportStore.savedReport){
        reportName.value = reportStore.savedReport?.name;
        let attrs = reportStore.savedReport?.attributes;
        

        D.start_date = reportStore.savedReport?.filter?.start_date;
        D.end_date = reportStore.savedReport?.filter?.end_date;
        D.export = reportStore.savedReport?.filter?.export;
        D.order_date = reportStore.savedReport?.filter?.order_date;
        D.location = reportStore.savedReport?.filter?.location;
        D.status = reportStore.savedReport?.filter?.status;    
        
        datePicker.value.setDate(D.start_date, D.end_date);
  
        keys.forEach(key => {
          if(attrs[key]?.length){
            D[key].forEach(item => (item.selected = attrs[key].includes(item?.id)) || (item.selected = attrs[key].includes(item?.field_name)));
          } else {
            D[key].forEach(i => i.selected = false);
          }
        })
      }
    }
  } catch (error) {
    console.error('in asMount(), getSavedReport:error', error)
  }
}

let isMounted = ref(false);

onMounted(async ()=>{
  reportStore.savedReport = null;
  await asMount();
  isMounted.value = true;
})

let reportName = ref('');
let showNameModal = ref(false);

async function onCLickSaveOrUpdateReport() {
  try {
    let rid = useRoute().query?.rid;
    showNameModal.value = false;
    if(rid){
      // update report
      await reportStore.updateReport(rid, reportName.value, D);
    } else {
      // Save report
      await reportStore.saveTheReport(reportName.value, D);
      reportName.value = '';
      asMount();
    }
  } catch (error) {
    console.error('onCLickSaveOrUpdateReport:error, ', error);
  }
}
async function onCLickItem({item, i}) {
  navigateTo({
    path: useRoute().path,
    query: {
      name: item?.name || item?.field_label,
      rid: item.id,
    }
  });
}
async function onClickExportExcel() {
   await reportStore.exportExcel(D);
}

</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <Breadcrumb title="Order Export" :links="['report_orderExport']"></Breadcrumb>

      <div class="d-flex">
        <el-ButtonAndDropList :btnText="useRoute().query?.rid ? 'Update Report' : 'Save Report'" :data="reportStore.savedReportList" @click="showNameModal=true" 
        @clickItem="onCLickItem" :loading="H.isPendingAnyApi('Report:saveTheReport,updateReport')" color="black" ></el-ButtonAndDropList>
        <button v-if="useRoute().query?.rid" @click="navigateTo(useRoute().path)" :class="[BTNCLASS.green]" class="px-3" style="height: 40px" >Back</button>
      </div>
  </div>


    <div class="ionic-card">

      <div class="ionic-card-body">
        <div class="row">

          <div class="col-md-5 col-12">
            <div class="form-group">
              <label> Select Order Date </label>
              <div class="d-flex" >
                <template v-if="!isMounted" >
                  <el-BaseInput :label="false" :showEffect="!isMounted"></el-BaseInput>
                </template>
                <template v-else >
                  <Picker-EmDateTimePicker
                    ref="datePicker"
                    v-model="dateObj"
                    placeholder="Due Date" 
                    :options="{
                      ...globalData.datePickerOptions,
                      rangePicker: true,
                      displayIn: 'bottom_left',
                      adjustX: 0,
                      adjustY: -0,
                      invisible: false,
                      useCustomRange: [
                        'Today',
                        'Yesterday',
                        'Last 24 hours',
                        'Last 2 Days',
                        'Last 3 Days',
                        'Last 7 Days',
                        'Last 30 Days',
                        'Last 90 Days',
                        'Last 6 Months',
                      ],
                    }"
                  /> 
                </template>
                <div class="w-100 ms-2" >
                  <el-BaseSelect :showEffect="!isMounted" v-model="D.order_date" :data="orderDateTypeList" displayKey="name" :option1="false" ></el-BaseSelect>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-3 col-6">
            <el-baseSelect :showEffect="!isMounted" v-model="D.location" label="Location" :data="useCookie('locations').value || []" option1="-Location-" displayKey="name" ></el-baseSelect>
          </div>
          <div class="col-md-3 col-6">
            <el-baseSelect :showEffect="!isMounted" v-model="D.status" label="Order Status" :data="orderStore.statusList || []" displayKey="label" option1="-Order Status-" ></el-baseSelect>
          </div>

          


        </div>


        <div class="row">

          <div class="col-md-3">
            <h3 class="mb-2 hlevel" >General</h3>
            <template v-for="item in D.general">
              <el-checkbox :showEffect="!isMounted" v-model="item.selected" :label="item.name" :skipAutoMargin="true" ></el-checkbox>
            </template>
          </div>

          <div class="col-md-3">
            <h3 class="mb-2 hlevel" >Customer</h3>
            <template v-for="item in D.customer">
              <el-checkbox :showEffect="!isMounted" v-model="item.selected" :label="item.name" :skipAutoMargin="true" ></el-checkbox>
            </template>
            <h3 class="my-3 hlevel" >Order Items</h3>
            <template v-for="item in D.order_items">
              <el-checkbox :showEffect="!isMounted" v-model="item.selected" :label="item.name" :skipAutoMargin="true" ></el-checkbox>
            </template>
          </div>

          <div class="col-md-3">
            <h3 class="mb-2 hlevel" >Shipping</h3>
            <template v-for="item in D.shipping">
              <el-checkbox :showEffect="!isMounted" v-model="item.selected" :label="item.name" :skipAutoMargin="true" ></el-checkbox>
            </template>

            <h3 class="my-3 hlevel" >Tax</h3>
            <template v-for="item in D.tax">
              <el-checkbox :showEffect="!isMounted" v-model="item.selected" :label="item.name" :skipAutoMargin="true" ></el-checkbox>
            </template>
          </div>
          <div class="col-md-3">
            <h3 class="mb-2 hlevel" >Payment</h3>
            <template v-for="item in D.payment">
              <el-checkbox :showEffect="!isMounted" v-model="item.selected" :label="item.name" :skipAutoMargin="true" ></el-checkbox>
            </template>

            <!-- Handling With Some Custom Code -->
            <template v-if="D.custom?.length" >
              <h3 class="my-2 hlevel" >Custom Checkout Fields</h3>
              <template v-for="item in D.custom">
                <el-checkbox :showEffect="!isMounted" v-model="item.selected" :label="item.field_label" :skipAutoMargin="true" ></el-checkbox>
              </template>
            </template> 


            <h3 class="mb-2 hlevel" >Order Details</h3>
            <template v-for="item in D.order_details">
              <el-checkbox :showEffect="!isMounted" v-model="item.selected" :label="item.name" :skipAutoMargin="true" ></el-checkbox>
            </template>

          </div>

          

        </div>
      </div>

      <div class="ionic-card-footer justify-content-end top-border">
        <button @click="onClickExportExcel()" :class="[BTNCLASS.green]" class="ms-0 px-4 me-2"> Export Excel <BtnLoader :show="H.isPendingAnyApi('Report:exportExcel')" color="black" ></BtnLoader> </button>
        <button @click="toggleCheck()" :class="[BTNCLASS.primary]" class="ms-0 px-4 me-2"> 
          <template v-if="!isSelectedAll">
            <i class='bx bx-check-square bx-flashing size-1p2 transformY-1px' ></i> Select All
          </template>
          <template v-else>
            <i class='bx bx-checkbox bx-flashing size-1p2 transformY-1px' ></i> Deselect All
          </template>
           
        </button>
      </div>
    </div>


    <modal-global v-model="showNameModal" title="Report Name" modalSize="small" @clicked-submit="()=>{
      if(reportName){
        onCLickSaveOrUpdateReport();
      } else {
        Toaster.warning('Enter a name')
      }
    }" >
      <template #modalbody>
        <div class="w-100">
          <el-baseInput v-model="reportName" placeholder="Report Name"></el-baseInput>
        </div>
      </template>
    </modal-global>

 




  </div>
</template>


<style scoped>
.hlevel{
  padding: 8px 6px;
  font-size: 14px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: #232626;
}
</style>