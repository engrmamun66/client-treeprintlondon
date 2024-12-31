<script setup>
import { useAuthStore } from '~/stores/Auth';
const { afterLogin } = useAuthStore();

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath + '/landing page',
});
useHead({
  titleTemplate: '%s | Dashboard',
});

let show = ref(true)
let editor = ref(null)
let content = ref('<h1>Hello world</h1>')

let data = ref({
  "startTime": "04:00 AM",
  "endTime": "04:00 AM"
});
let options = {
  "onlyTimePicker": true,
  "timePickerUi": "standard",
  "displayIn": "bottom_left",
  "theme": "dark"
}

await afterLogin();

</script>

<template>

  <div> 
    <Breadcrumb title="Dashboard" :links="['dashboard']"></Breadcrumb>
    <!-- Solar and Generator Performance  -->
    <div class="row">
      <div class="col-xl-6 col-lg-12 col-md-12">
        <div class="ionic-card dashboard-card">
          <div class="ionic-card-header">
            <h4 class="fs-22">Solar Panel Performance</h4>
          </div>
          <div class="ionic-card-body">
            <div class="row">
              <div class="col-md-4">
                <div class="ionic-db-card">
                  <div class="ionic-db-card-left">
                    <h5 class="fs-20 mb-2"> <Num :count="320" :delay="1000">Kwh</Num> </h5>
                    <span class="fs-12">Capacity</span>
                  </div>
                  <div class="ionic-db-card-right">
                    <img src="/img/capacity.png" class="img-fluid" alt="dashbard icon" />
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="ionic-db-card">
                  <div class="ionic-db-card-left">
                    <h5 class="fs-20 mb-2"><Num :count="190" :delay="1000">Kwh</Num></h5>
                    <span class="fs-12">Total Yield</span>
                  </div>
                  <div class="ionic-db-card-right">
                    <img src="/img/capacity.png" class="img-fluid" alt="dashbard icon" />
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="ionic-db-card">
                  <div class="ionic-db-card-left">
                    <h5 class="fs-20 mb-2"><Num :count="190" :delay="1000">Kwh</Num></h5>
                    <span class="fs-12">Real time Power Usage</span>
                  </div>
                  <div class="ionic-db-card-right">
                    <span class="fs-12 circle-red">
                      <img src="/img/arrowdownicon.png" class="img-fluid" alt="dashbard icon" />
                      -16%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="ionic-db-card">
                  <div class="ionic-db-card-left">
                    <h5 class="fs-20 mb-2"><Num :count="190" :delay="1000">Kwh</Num></h5>
                    <span class="fs-12">Consumption</span>
                  </div>
                  <div class="ionic-db-card-right">
                    <img src="/img/conjuction.png" class="img-fluid" alt="dashbard icon" />
                  </div>
                </div>
                <div class="ionic-db-card">
                  <div class="ionic-db-card-left">
                    <h5 class="fs-20 mb-2"> <Num :count="190" :delay="1000">Kwh</Num> </h5>
                    <span class="fs-12">Total Charging</span>
                  </div>
                  <span class="fs-12 circle-green">
                    <img src="/img/arrowupicon.png" class="img-fluid" alt="dashbard icon" />
                    -16%
                  </span>
                </div>
              </div>
              <div class="col-md-8">
                <div class="ionic-db-card ionic-db-card-lg">
                  <div class="ionic-db-card-right">
                    <img src="/img/solar-panel.png" class="img-fluid" alt="dashbard icon" />
                  </div>
                  <div class="ionic-db-card-left">
                    <div class="ionic-dbcard-top">
                      <span class="fs-12">Status</span>
                      <h5 class="fs-20 mt-2">Active</h5>
                    </div>
                    <div class="ionic-dbcard-bottom">
                      <h5 class="fs-20 mb-2"> <Num :count="32" :delay="1000"></Num> </h5>
                      <span class="fs-12">Total Panels</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-6 col-lg-12 col-md-12">
        <div class="ionic-card dashboard-card">
          <div class="ionic-card-header">
            <h4 class="fs-22">Generator Performance</h4>
          </div>
          <div class="ionic-card-body">
            <div class="row">
              <div class="col-md-4">
                <div class="ionic-db-card">
                  <div class="ionic-db-card-left">
                    <h5 class="fs-20 mb-2"> <Num :count="520" :delay="1000">Kwh</Num> </h5>
                    <span class="fs-12">Capacity</span>
                  </div>
                  <div class="ionic-db-card-right">
                    <img src="/img/capacity.png" class="img-fluid" alt="dashbard icon" />
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="ionic-db-card">
                  <div class="ionic-db-card-left">
                    <h5 class="fs-20 mb-2"> <Num :count="190" :delay="1000">Kwh</Num> </h5>
                    <span class="fs-12">Total Yield</span>
                  </div>
                  <div class="ionic-db-card-right">
                    <img src="/img/capacity.png" class="img-fluid" alt="dashbard icon" />
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="ionic-db-card">
                  <div class="ionic-db-card-left">
                    <h5 class="fs-20 mb-2"> <Num :count="390" :delay="1000">Kwh</Num> </h5>
                    <span class="fs-12">Power Usage</span>
                  </div>
                  <div class="ionic-db-card-right">
                    <span class="fs-12 circle-red">
                      <img src="/img/arrowdownicon.png" class="img-fluid" alt="dashbard icon" />
                      -16%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="ionic-db-card">
                  <div class="ionic-db-card-left">
                    <h5 class="fs-20 mb-2"> <Num :count="190" :delay="1000">Ltr</Num> </h5>
                    <span class="fs-12">Consumption</span>
                  </div>
                  <div class="ionic-db-card-right">
                    <img src="/img/conjuction.png" class="img-fluid" alt="dashbard icon" />
                  </div>
                </div>
                <div class="ionic-db-card">
                  <div class="ionic-db-card-left">
                    <h5 class="fs-20 mb-2"> <Num :count="180" :delay="1000">Ltr</Num> </h5>
                    <span class="fs-12">Total Fuel</span>
                  </div>
                  <span class="fs-12 circle-green">
                    <img src="/img/arrowupicon.png" class="img-fluid" alt="dashbard icon" />
                    -16%
                  </span>
                </div>
              </div>
              <div class="col-md-8">
                <div class="ionic-db-card ionic-db-card-lg">
                  <div class="ionic-db-card-right">
                    <img src="/img/solar-panel-transformer.png" class="img-fluid" alt="dashbard icon" />
                  </div>
                  <div class="ionic-db-card-left">
                    <div class="ionic-dbcard-top">
                      <span class="fs-12">Status</span>
                      <h5 class="fs-20 mt-2">Running</h5>
                    </div>
                    <div class="ionic-dbcard-bottom">
                      <h5 class="fs-20 mb-2"><Num :count="32" :delay="1000"></Num></h5>
                      <span class="fs-12">Total Panels</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Battery Storage area   -->
  <div class="ionic-card dashboard-card">
    <div class="ionic-card-body pt-1">
      <div class="row">
        <div class="col-md-4">
          <div class="ionic-db-card ionic-db-card-md">
            <div class="ionic-db-card-left">
              <h5 class="fs-35 mb-2"><Num :count="122" :delay="1000"><sub>Kwh</sub></Num> </h5>
              <span class="fs-12">BATTERY STORAGE CAPACITY</span>
            </div>
            <div class="ionic-db-card-right">
              <img src="/img/battery-capacity.png" class="img-fluid" alt="dashbard icon" />
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="ionic-db-card ionic-db-card-md">
            <div class="ionic-db-card-left">
              <h5 class="fs-35 mb-2">
                <Num :count="90" :delay="1000"><sub>%</sub></Num>  
                <span class="fs-12 circle-green ms-3">
                  <img src="/img/arrowupicon.png" class="img-fluid" alt="dashbard icon" />
                  +<Num :count="16" :delay="1000"></Num> %
                </span>
              </h5>
              <span class="fs-12">BATTERY VOLUME CAPACITY</span>
            </div>
            <div class="ionic-db-card-right">
              <img src="/img/battery-capacity.png" class="img-fluid" alt="dashbard icon" />
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="ionic-db-card ionic-db-card-md">
            <div class="ionic-db-card-left">
              <h5 class="fs-35 mb-2">
                <Num :count="20" :delay="1000"><sub>c</sub></Num> 
                <span class="fs-12 circle-green ms-3">
                  <img src="/img/arrowupicon.png" class="img-fluid" alt="dashbard icon" />
                  +<Num :count="16" :delay="1000"></Num>%
                </span>
              </h5>
              <span class="fs-12">BATTERIES TEMPERATURE</span>
            </div>
            <div class="ionic-db-card-right">
              <img src="/img/capacity-lg.png" class="img-fluid" alt="dashbard icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  <!-- Daily Forecast area  -->
    <div class="row">
      <div class="col-xl-6 col-lg-12 col-md-12">
        <div class="ionic-card dashboard-card">
          <div class="ionic-card-header">
            <h4 class="fs-22">Daily Forecast</h4>
          </div>
          <div class="ionic-card-body">
            <div class="row">
              <div class="col-md-4">
                <div class="ionic-db-card">
                  <div class="ionic-db-card-left">
                    <h5 class="fs-20 mb-2"><Num :count="320" :delay="1000">Kwh</Num> </h5>
                    <span class="fs-12">21 OCTOBER</span>
                  </div>
                  <div class="ionic-db-card-right">
                    <img src="/img/sunicon.png" class="img-fluid" alt="dashbard icon" />
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="ionic-db-card">
                  <div class="ionic-db-card-left">
                    <h5 class="fs-20 mb-2"> <Num :count="190" :delay="1000">Kwh</Num> </h5>
                    <span class="fs-12">22 OCTOBER</span>
                  </div>
                  <div class="ionic-db-card-right">
                    <img src="/img/cloudicon.png" class="img-fluid" alt="dashbard icon" />
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="ionic-db-card">
                  <div class="ionic-db-card-left">
                    <h5 class="fs-20 mb-2"> <Num :count="190" :delay="1000">Kwh</Num> </h5>
                    <span class="fs-12">23 OCTOBER</span>
                  </div>
                  <div class="ionic-db-card-right">
                    <img src="/img/rainicon.png" class="img-fluid" alt="dashbard icon" />
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="ionic-db-card">
                  <div class="table-responsive">
                    <table class="table dailyforecast-table">
                      <tr>
                        <td>
                          <h5 class="fs-20 mb-2"> <Num :count="280" :delay="1000">Kwh</Num> </h5>
                          <span class="fs-12">Maximum Used</span>
                        </td>
                        <td>
                          21 OCTOBER
                          <img src="/img/cloudicon-small.png" class="img-fluid" alt="cloud img" />
                        </td>
                        <td>
                          <h5 class="fs-20 mb-2"> <Num :count="280" :delay="1000">Kwh</Num> </h5>
                          <span class="fs-12">Maximum Used</span>
                        </td>
                        <td class="text-right pe-0">
                          22 OCTOBER
                          <img src="/img/cloudicon-small.png" class="img-fluid" alt="cloud img" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h5 class="fs-20 mb-2"> <Num :count="280" :delay="1000">Kwh</Num> </h5>
                          <span class="fs-12">Maximum Used</span>
                        </td>
                        <td>
                          21 OCTOBER
                          <img src="/img/cloudicon-small.png" class="img-fluid" alt="cloud img" />
                        </td>
                        <td>
                          <h5 class="fs-20 mb-2"> <Num :count="280" :delay="1000">Kwh</Num> </h5>
                          <span class="fs-12">Maximum Used</span>
                        </td>
                        <td class="text-right pe-0">
                          22 OCTOBER
                          <img src="/img/cloudicon-small.png" class="img-fluid" alt="cloud img" />
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-6 col-lg-12 col-md-12">
        <div class="ionic-card dashboard-card">
          <div class="ionic-card-header">
            <h4 class="fs-22">map</h4>
          </div>
          <div class="ionic-card-body">
            <div class="invoice-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6511980.1304290565!2d-124.59210174550276!3d37.16036014148867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia%2C%20USA!5e0!3m2!1sen!2sbd!4v1718972991655!5m2!1sen!2sbd"
                style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              <div class="invoice-mapmore-menu">
                <a href="#"><i class="las la-ellipsis-v"></i></a>
                <div class="invoice-mapmore-menubody">

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Energy Produced and Distribution area  -->
    <div class="row">
      <div class="col-xl-8 col-lg-12 col-md-12">
        <div class="ionic-card dashboard-card">
          <div class="ionic-card-header">
            <h4 class="fs-22">Energy Produced</h4>
          </div>
          <div class="ionic-card-body">
            <div class="ionic-db-card">
              <div class="produced-card-body">
                <div class="produced-top-area">
                  <div class="produced-left">
                    <h5 class="fs-20 mb-2"> <Num :count="880" :delay="1000" time="2" >Kwh</Num> </h5>
                    <span class="fs-12">Total Produce</span>
                  </div>
                  <div class="produced-center">
                    <span class="me-4"><i class="bx bxs-circle circle-green me-2 fs-16"></i>Energy Produced</span>
                    <span><i class="bx bxs-circle circle-red me-2 fs-16"></i>Energy Consumption</span>
                  </div>
                  <div class="produced-right">
                    <div class="select-optionbox">
                      <select class="form-control">
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>Yearly</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="produced-chart">
                  <img src="/img/produced.png" class="img-fluid" alt="produced img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-lg-12 col-md-12">
        <div class="ionic-card dashboard-card">
          <div class="ionic-card-header">
            <h4 class="fs-22">map</h4>
          </div>
          <div class="ionic-card-body">
            <div class="ionic-db-card justify-center" style="min-height: 304px;">
              <img src="/img/distribution.png" class="img-fluid" alt="distribution img" />
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Current Day, Month area -->
    <div class="ionic-card dashboard-card">
      <div class="ionic-card-body pt-1">
        <div class="row">
          <div class="col-md-4">
            <div class="ionic-db-card ionic-db-card-md">
              <div class="ionic-db-card-left">
                <h5 class="fs-35 mb-2">1.07 <sub>$</sub></h5>
                <span class="fs-12">CURRENT DAY POWER COST</span>
              </div>
              <div class="ionic-db-card-right">
                <img src="/img/dolarboxicon.png" class="img-fluid" alt="dashbard icon" />
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="ionic-db-card ionic-db-card-md">
              <div class="ionic-db-card-left">
                <h5 class="fs-35 mb-2">109.9 <sub>$</sub></h5>
                <span class="fs-12">CURRENT MONTH BILL</span>
              </div>
              <div class="ionic-db-card-right">
                <img src="/img/dolarboxicon.png" class="img-fluid" alt="dashbard icon" />
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="ionic-db-card ionic-db-card-md">
              <div class="ionic-db-card-left">
                <h5 class="fs-35 mb-2">280 <sub>kWh</sub></h5>
                <span class="fs-12">CURRENT MONTH POWER USAGE</span>
              </div>
              <div class="ionic-db-card-right">
                <img src="/img/charticon.png" class="img-fluid" alt="dashbard icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Vehicles and Energy Produced area  -->
    <div class="row">
      <div class="col-xl-4 col-lg-12 col-md-12">
        <div class="ionic-card dashboard-card">
          <div class="ionic-card-header">
            <h4 class="fs-22">My Vehicles</h4>
          </div>
          <div class="ionic-card-body">
            <div class="row">
              <div class="col-md-12">
                <div class="ionic-db-card">
                  <div class="table-responsive">
                    <table class="table dailyforecast-table">
                      <tr>
                        <td>
                          <div class="table-imgbox d-flex align-items-center">
                            <div class="table-img">
                              <img src="/img/vehicales1.png" alt="table product img" />
                            </div>
                            <div class="table-img-info">
                              <h5 class="fs-18 mb-2">Rumah Sasana</h5>
                              <span class="fs-12">Capacity 320 kWh</span>
                            </div>
                          </div>
                        </td>
                        <td class="text-center">
                          <span><img src="/img/vehiclesicon.png" class="vehicle-img" alt="vehicles icon" /> 292.9 kWh</span><br>
                          <span class="color-green">Active </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="table-imgbox d-flex align-items-center">
                            <div class="table-img">
                              <img src="/img/vehicales2.png" alt="table product img" />
                            </div>
                            <div class="table-img-info">
                              <h5 class="fs-18 mb-2">Sans Brother</h5>
                              <span class="fs-12">Capacity 320 kWh</span>
                            </div>
                          </div>
                        </td>
                        <td class="text-center">
                          <span><img src="/img/vehiclesicon.png" class="vehicle-img" alt="vehicles icon" /> 292.9 kWh</span><br>
                          <span class="color-yellow">Charging </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="table-imgbox d-flex align-items-center">
                            <div class="table-img">
                              <img src="/img/vehicales3.png" alt="table product img" />
                            </div>
                            <div class="table-img-info">
                              <h5 class="fs-18 mb-2">Perum Gulon</h5>
                              <span class="fs-12">Capacity 320 kWh</span>
                            </div>
                          </div>
                        </td>
                        <td class="text-center">
                          <span><img src="/img/vehiclesicon.png" class="vehicle-img" alt="vehicles icon" /> 292.9 kWh</span><br>
                          <span class="color-red">Inactive </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="table-imgbox d-flex align-items-center">
                            <div class="table-img">
                              <img src="/img/vehicales4.png" alt="table product img" />
                            </div>
                            <div class="table-img-info">
                              <h5 class="fs-18 mb-2">Rumah Sasana</h5>
                              <span class="fs-12">Capacity 320 kWh</span>
                            </div>
                          </div>
                        </td>
                        <td class="text-center">
                          <span><img src="/img/vehiclesicon.png" class="vehicle-img" alt="vehicles icon" /> 292.9 kWh</span><br>
                          <span class="color-green">Active </span>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-8 col-lg-12 col-md-12">
        <div class="ionic-card dashboard-card">
          <div class="ionic-card-header">
            <h4 class="fs-22">Energy Produced</h4>
          </div>
          <div class="ionic-card-body">
            <div class="ionic-db-card">
              <div class="produced-card-body">
                <div class="produced-top-area">
                  <div class="produced-left">
                    <h5 class="fs-20 mb-2">880 Kwh</h5>
                    <span class="fs-12">Total Produce</span>
                  </div>
                  <div class="produced-right">
                    <div class="select-optionbox">
                      <select class="form-control">
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>Yearly</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="produced-chart">
                  <img src="/img/produced2.png" class="img-fluid" alt="produced img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>



</template>
