<script setup>
import { useAuthStore } from '~/stores/Auth';
const { afterLogin } = useAuthStore();
import { useVictronStore } from '~/stores/Victron';
const victronStore = useVictronStore();
import { useDashboardStore } from '~/stores/Dashboard';
const dashboardStore = useDashboardStore();

import { useCompaniesStore } from "~/stores/vms/company";
const companyStore = useCompaniesStore();

import { useSitesStore } from "~/stores/vms/sites";
const siteStore = useSitesStore();

provide('dashboardStore', dashboardStore);
import DashboardApi from "~/apis/Dashboard";


definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath + '/landing page',
});
useHead({
  titleTemplate: '%s | Dashboard',
});

let datePicker = ref(null);
let dateObj = ref({});  
let refreshing = ref(false);
let showWidgetSettings = ref(false);
let isMounted = ref(false);
let company_id = ref(null)
let site_id = ref(null)
let selectedAssetId = ref(null)
let asset_id = ref(null)

/**
 * With Drag(wd)
*/
let withDrag = reactive({
  dragging: false,
  index1: null,
  index2: null,
});
provide('withDrag', withDrag);
 
function activeAnyone(widgets){
  if(!widgets?.length) return false;
  return widgets.some(w => w?.active);
}

function getDateRange({startDate, endDate}){
  if(startDate && endDate){
    const date1 = moment(startDate); // Starting date
    const date2 = moment(endDate); // Ending date
    const diffDays = date2.diff(date1, 'days');
    let data = {
      start_time: date1.unix(),
      end_time: date2.unix(),
      interval: diffDays > 3 ? 'days' : 'hours',
      __duration: `${date1.format("YYYY-MM-DD")} - ${date2.format("YYYY-MM-DD")}`,
    }
    return data;
  } else {
    return false;
  }
}

async function loadWidgets(widgets, dates=null) {
  if(!widgets) return;
    try {
      let widgetList = Object.values(widgets).flat();
      let colors = [
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
      ]
      for (const widget of widgetList) {
        if(widget?.active && widget?.api){
          const { end_point, method, is_graph } = widget.api;  
          let params = {
            instance: widget.instance,        
          }
          if(is_graph){
            params.start = dates?.start_time || '';
            params.end = dates?.end_time || '';
          }
          try {
            widget._loading = true;
            const response = await DashboardApi.loadWidgets(method, end_point, { params });
            H.delay(()=>{
              widget._loading = false;
              widget._loaded_ = true;
            }, 100);
            let data = Response.parseData(response);
            let summary__data;
            if(is_graph){
              if(end_point === 'GlobalLinkSummary'){                
                summary__data = H.clone(data.summary_data || {});
                data = {
                  data: data.graph_data?.data || {},
                  meta: data.graph_data?.meta || {}
                }
              } 
              else if (end_point === 'SolarIrradiance'){
                data = {
                  data: data.forcast_data?.data || {},
                  meta: data.forcast_data?.meta || {}
                }
              }
              let arrays = Object.values(data?.data || {})?.filter(item => (item?.length))?.filter(item => item?.[1] != null);
              const dataSets = []
              widget._labels = [];
              widget._chartData = [];
              arrays?.forEach((dt, i) => {
                
                let processedData = dt.filter(arr => arr.filter(Boolean)?.length > 1); 
                if(processedData?.length){
  
                  let mappedData = processedData.map(d => d[1]); 
  
                  // set _chartData
                  if(!widget?._chartData?.length){
                    widget._chartData = processedData.map(d => d[1]); 
                  }
                  // set _labels
                  if(!widget?._labels?.length){
                    widget._labels = processedData.map(d => d[0]).map(unixTime => {
                      if(dates?.interval === 'hours'){
                        return H.unixToDate(unixTime, 'HH:mm');
                      } else {
                        return H.unixToDate(unixTime, 'MMM DD');
                      }  
                    });   
                    widget._labels = [...new Set(widget._labels)];        
                    
                  }
  
                  const bgColor = colors[i % colors.length];
                  const dataSet = {
                    label: widget.name,
                    data: mappedData,
                    backgroundColor: '#35D416',
                    backgroundColor: bgColor,
                  }; 
                  let metaData = Object.values(data?.meta);
                  if(metaData?.[i]?.description){
                    dataSet.label = metaData?.[i]?.description;
                  }
                  // log({metaData})
                              
                  dataSets.push(dataSet);
                }  
              });
              widget._datasets = dataSets;
              // log({widget: H.clone(widget)});                
            }
            

            

            widget._data = null;
            H.delay(()=> {
              widget._data = data;
              if(summary__data){
                widget._data = summary__data;
                widget._has_bottom_summary = true;
                console.log('----', {summary__data});
              }
            });
  
          } catch (error) {
            widget._loading = false;
            console.warn(`Failed to fetch ${end_point}:`, error);
          }
        }  
      }
    } catch (error) {
      console.error('loadWidgets', error);
    }
  }


async function asMounted({from_refresh_icon=false, dates}={}){
  if(from_refresh_icon === false){
    await dashboardStore.getActiveWidgets({company_id: company_id.value, asset_id: selectedAssetId.value});
  }
  await loadWidgets( dashboardStore.widgets, dates);

  // if(from_refresh_icon === false){
  //   await victronStore.getInstallations();
  //   await victronStore.getDashboardData(dates);
  //   await victronStore.getBatterSummary();
  // }
}
async function loadWidgetsByAsset(assetId){
  selectedAssetId.value = assetId
  await dashboardStore.getActiveWidgets( {asset_id: selectedAssetId.value } );
  await loadWidgets( dashboardStore.widgets, last7Days());
}
async function loadWidgetsBySite(site_id){
  await dashboardStore.getAssetIdsBySite(site_id);
  let assetIds = []
  assetIds = dashboardStore.assetsHavingOrder.map((item)=>{
    return item.id
  })
  selectedAssetId.value = assetIds.join(', ');
  await dashboardStore.getActiveWidgets( {asset_id: selectedAssetId.value } );
  await loadWidgets( dashboardStore.widgets, last7Days());

}
async function loadWidgetsByCompany(company_id){
  let company = dashboardStore.companiesHavingAssetOrder.filter((company)=>{
                if(company.id == company_id){
                  return company
                }
              })
  dashboardStore.sitesHavingAssetOrder = company[0].sites
  await dashboardStore.getActiveWidgets( {company_id : company_id} );
  await loadWidgets( dashboardStore.widgets, last7Days());

}
function last7Days(){
  let start_time = moment().subtract(7, 'days').startOf('day');
  let end_time = moment().endOf('day');

  datePicker.value.setDate(start_time.format("YYYY-MM-DD"), end_time.format("YYYY-MM-DD"));
  let [startDate, endDate] =  [ start_time.format("YYYY-MM-DD"), end_time.format("YYYY-MM-DD") ];
  return getDateRange({startDate, endDate});
}
 

onMounted(async () => {

  document.addEventListener("mouseup", () => {
    withDrag.dragging = false,
    withDrag.index1 = null;
    withDrag.index2 = null;
  });


  dashboardStore.widgets = H.localStorage('active_widgets').value || null;
  afterLogin();  
  await dashboardStore.getCompaniesWithAsset()
  if(dashboardStore.companiesHavingAssetOrder.length){
    company_id.value = dashboardStore.companiesHavingAssetOrder[0].id
    dashboardStore.sitesHavingAssetOrder = dashboardStore.companiesHavingAssetOrder[0].sites
    await asMounted({dates: last7Days()}); 
  }
  isMounted.value = true;
}) 

</script>

<template>

  <div> 
    <div class="m-subheader d-flex justify-content-between"> 
        <Breadcrumb title="Dashboard" :links="['dashboard']"></Breadcrumb>
        <div style="width:314px">         
              <div class="dashborad-top-right d-flex mb-3" >
                
                <Picker-EmDateTimePicker
                    ref="datePicker"
                    v-model="dateObj"
                    placeholder="Select Date"
                    @change="
                      (data) => {
                        let dates = getDateRange(data);
                        if(dates) asMounted({dates});
                      }
                    "
                    :options="{
                      ...globalData.datePickerOptions,
                      rangePicker: true,
                      displayIn: 'bottom_right',
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
                  <a @click.stop="showWidgetSettings = !showWidgetSettings" href="#" class="widget-icon"><i class='bx bx-slider-alt'></i></a>
                  <a @click.stop="async () => {
                    refreshing = true;
                    await asMounted({dates: last7Days(), loader: false, from_refresh_icon: true});
                    refreshing = false;
                  }" href="#" class="widget-icon">
                    <i v-if="!refreshing" class='bx bx-refresh size-1p2'></i>
                    <BtnLoader v-else :show="true" ></BtnLoader>
                  </a>
                  
              </div>
          </div>
    
    </div>

   <div class="row"> 
        <el-baseSelect
        v-if="useCookie('role').value == 'Admin'"
          v-model="company_id"
          :data="dashboardStore.companiesHavingAssetOrder"
          :label="false"
          displayKey="company_name"
          option1="-Select Company-"
          class="col-md-2 col-12 dropdown-filter"
          :tooltip="company_id ? 'Company' : ''"
          @change="
            (company_id) => {
              loadWidgetsByCompany(company_id)
            }
          "
        ></el-baseSelect>
        <el-baseSelect
      
          v-model="site_id"
          class="col-md-2 col-12 dropdown-filter"
          :data="dashboardStore.sitesHavingAssetOrder"
          :label="false"
          displayKey="title"
          option1="-Select Site-"
          :tooltip="site_id ? 'Site' : ''"
          @change="
            (site_id) => {
              loadWidgetsBySite(site_id)
            }
          "
        ></el-baseSelect>
        <div class="col-md-2 col-12">
          <div class="form-group" >
            <!-- <label class="form-label">EEN Accounts</label> -->
              <select
                style="border: 1px solid #37C923"
                tooltip="Equipment"
                class="form-control"
                v-model="asset_id"
                @change="(e)=>{
                  loadWidgetsByAsset(e.target.value)
                }"
              >
                <option :value="null">-Select Equipment-</option>
                
                <option
                  v-for="(asset, index) in dashboardStore.assetsHavingOrder"
                  :key="index"
                  :value="asset.id"
                >
                  {{ asset?.product?.name}}( {{asset?.serial_no}})
                </option>
              </select>
          </div>
        </div>
   </div>
    <dashboard-widgetSettings v-if="showWidgetSettings" @updateSettings="asMounted({dates: last7Days()})" ></dashboard-widgetSettings>


    <template v-if="dashboardStore?.widgets" >
      <template v-for="(widgets, key) in dashboardStore?.widgets" :key="key" >
        <h3 v-if="activeAnyone(dashboardStore?.widgets[key])" class="heading-radius">
          <i class='bx bxs-bar-chart-alt-2 transformY-1px' ></i> {{ key.split(' [')[0] }} 
        </h3>
        <div class="row">
          <template v-for="(widget, i) in dashboardStore?.widgets[key]" :key="i" >
            <template v-if="widget.active" >
              <dashboard-card
              :data="widget?._data" 
              :widget="widget"
              :widgetKey="key"
              :widgets="dashboardStore?.widgets[key]"
              :index="i"
              :title="widget?.isExpanded ?  widget.name : $textTail(widget.name, widget?.asset_id ? 15 : 26)"
              >
              <template #body >
                  <div @click="log(H.clone(widget))">
                    <!-- <pre @click="log(widget)" > {{ widget.name }}  </pre> -->
                    <template v-if="!widget.api?.is_graph" >
                      <template v-if="widget._data?.data && !widget?._loading" >
                        <template v-for="item in widget._data?.data" :key="item" >
                          <div @click.stop="log({item, data: widget._data?.data})" class="d-flex justify-content-between pe-1" >
                          <p> {{ item.dataAttributeName }}</p>
                          <p :class="[item.formattedValue == 'No alarm' ? 'text-danger' : 'text-primary']" > {{ item.formattedValue }} </p>
                          </div>
                        </template>
                      </template>
                      <template v-else>
                        <div v-if="widget?._loading" class="text-white-50">
                          <p class="mb-3">Loading....... </p>
                          <ShimmerEffect :count="7" class="mb-1" bg="light" width="100%" height="14px" radius="0px" ></ShimmerEffect>                    
                        </div>
                        <div v-else class="text-white-50" >
                            {{ widget?._loaded_ ? 'Summary Data Not Available' : 'Please wait a few moment !' }}               
                        </div>
                      </template>
                    </template>
                    <template v-else >
                      <!-- <pre @click="log(widget)" > {{ widget?._data }}  </pre> -->
                      <template v-if="widget?._data && widget?._labels?.length && !widget?._loading">
                        <BarChart 
                        :labels="widget?._labels"
                        :data="widget?._chartData"
                        :datasets="widget?._datasets"
                        :responsive="true"
                        >
                        </BarChart>

                        <template v-if="widget._data?.data && widget?._has_bottom_summary" >
                          <template v-for="item in widget._data?.data" :key="item" >
                            <div @click.stop="log({item, data: widget._data?.data})" class="d-flex justify-content-between pe-1" >
                            <p> {{ item.dataAttributeName }}</p>
                            <p :class="[item.formattedValue == 'No alarm' ? 'text-danger' : 'text-primary']" > {{ item.formattedValue }} </p>
                            </div>
                          </template>
                        </template>

                      </template>
                      <template v-else>
                        <div class="text-white-50">
                          <div v-if="widget?._loading" class="text-white-50">
                            <p class="mb-3" >Loading....... </p>
                            <ShimmerEffect :count="7" class="mb-1" bg="light" width="100%" height="14px" radius="0px" ></ShimmerEffect>                    
                          </div>
                          <div v-else class="text-white-50">
                            {{ widget?._loaded_ ? 'Chart Data Not Available ' : 'Please wait a few moment !' }}          
                          </div>
                        </div>
                      </template>
                        

                        
                    </template>
                  </div>
                </template>
              
              </dashboard-card> 

            </template>
                                   
          </template>          
        </div>
      </template>      
    </template>
















    <template v-if="false" >
      
          <div class="row">
            <div class="col-xl-12 col-lg-12 col-md-12">
              <div class="ionic-card dashboard-card">
                <div class="ionic-card-header">
                  <h4 class="fs-22">Battery Summary</h4>
                </div>
                <div class="ionic-card-body">
                  <div class="row">              
                    <!-- <div class="col-md-4">
                      <div class="ionic-db-card">
                        <div class="ionic-db-card-left">
                          <h5 class="fs-20 mb-2"> 
                          Solar {{ (victronStore.totals?.total_solar_yield || 0).toFixed(1) }} Kwh
                          </h5>
                          <span class="fs-12">Total Yield</span>
                        </div>
                        <div class="ionic-db-card-right">
                          <img src="/img/capacity.png" class="img-fluid" alt="dashbard icon" />
                        </div>
                      </div>
                    </div> -->
                    
                    <div class="col-md-4" >
                      <div class="ionic-db-card">
                        <div class="ionic-db-card-left">
                          <h5 class="fs-20 mb-2">{{ victronStore.batterySummary.voltage?.formattedValue || '0.0 V' }}</h5>
                          <span class="fs-12">
                            Voltage
                          </span>                    
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="ionic-db-card">
                        <div class="ionic-db-card-left">
                          <h5 class="fs-20 mb-2">{{ victronStore.batterySummary.current?.formattedValue || '0.0 A' }}</h5>
                          <span class="fs-12">
                            Current
                          </span>                    
                        </div>
                      </div>
                    </div>
      
                    <div class="col-md-4" >
                      <div class="ionic-db-card">
                        <div class="ionic-db-card-left">
                          <h5 class="fs-20 mb-2">{{ (Number(victronStore.batterySummary.current?.rawValue || 0) * Number(victronStore.batterySummary.voltage?.rawValue || 0)).toFixed(2) }} W</h5>
                          <span class="fs-12">
                            Power
                          </span>                    
                        </div>
                      </div>
                    </div>
      
                    <div class="col-md-4" >
                      <div class="ionic-db-card">
                        <div class="ionic-db-card-left">
                          <h5 class="fs-20 mb-2">{{ victronStore.batterySummary.temparature?.formattedValue || '0.0 °C' }}</h5>
                          <span class="fs-12">
                            Temparature
                          </span>                    
                        </div>
                      </div>
                    </div>
      
                    <div class="col-md-4">
                      <div class="ionic-db-card">
                        <div class="ionic-db-card-left">
                          <h5 class="fs-20 mb-2">{{ victronStore.boardData.discharging }}</h5>
                          <span class="fs-12">
                            {{ victronStore.boardData.chargeDisChardText }}
                          </span>                    
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-4" >
                      <div class="ionic-db-card">
                        <div class="ionic-db-card-left">
                          <h5 class="fs-20 mb-2">{{ victronStore.batterySummary.consumed_amphours?.formattedValue || '0.0 Ah' }}</h5>
                          <span class="fs-12">
                            Consumed Amphours
                          </span>                    
                        </div>
                      </div>
                    </div>
                    
                    
      
      
                  </div>             
                </div>
              </div>
            </div>
             
          </div>
      
          <!-- Energy Produced and Distribution area  -->
          <div class="row">
            <div class="col-xl-12 col-lg-12 col-md-12">
              <div class="ionic-card dashboard-card">
                <div class="ionic-card-header">
                  <h4 class="fs-22">Battery SOC</h4>
                </div>
                <div class="ionic-card-body"> 
                  <div class="diagram">
                        <!-- <img src="/img/produced.png" class="img-fluid" alt="produced img" /> -->
                    
                        <BarChart v-if="victronStore.showChart && victronStore.chartData?._labels"
                        :labels="victronStore.chartData?._labels"
                        :data="victronStore.chartData?._data"
                        :datasets="victronStore.chartData?._datasets"
                        >
                        </BarChart>
                        <BarChart v-show="!victronStore.showChart" v-if="victronStore.chartData?._labels"
                        :labels="victronStore.chartData?._labels"
                        :data="victronStore.chartData?._data"
                        :datasets="victronStore.chartData?._datasets"
                        >
                        </BarChart>
                      </div>
                </div>
              </div>
            </div>
          </div>

    </template>


    

 


     
  </div>



</template>

<style>
.dashborad-top-right .em-datetimepicker{
  border: 1px solid #00ba00;
}
.heading-radius{
  background-color: var(--bg-light);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 20px 10px;
  margin-bottom: 22px;
  border-bottom: 1px solid #000000;
}
.dropdown-filter .form-control {
   border: 1px solid #37C923
}
</style>
