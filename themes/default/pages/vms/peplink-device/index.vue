<script setup>
import { usePeplinkStore } from "~/stores/Peplink";
// Import moment and moment-timezone
import moment from "moment";
import "moment-timezone";
let peplinkStore = usePeplinkStore();
let showCameraModal = ref(false);
let showDeviceModal = ref(false);
let cameraDetail = ref(null);
let deviceDetails = ref({
  WAN_Type: null,
  ip_address: null,
  subnet_mask: null,
  default_gateway: null,
  dns_servers: null,
  routing_mode: null,
  mtu: null,
  imsi: null,
  iccid: null,
  mtn: null,
  uptime: null,
  online: null,
  first_appear: null,
  essid: null,
});

// let deviceDetails = ref(null);
function cameraDetails(details) {
  showCameraModal.value = true;
  cameraDetail.value = details;
}

function formatTimeDifference(uptimeAppear) {
  // console.log("=============================================", uptimeAppear);
  if (uptimeAppear == "N/A") {
    return "N/A";
  }
  // Parse the uptimeAppear date in UTC using moment
  const uptimeDate = moment.utc(uptimeAppear);

  // Convert it to America/Chicago timezone
  const chicagoTime = uptimeDate.clone().tz("America/Chicago");

  // Get the current time in America/Chicago timezone
  const now = moment().tz("America/Chicago");

  // Calculate the difference in days and hours
  const duration = moment.duration(now.diff(chicagoTime));
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();

  // Format the Chicago time to display in desired format
  const formattedDate = chicagoTime.format("YYYY-MM-DD HH:mm:ss");

  return `${days} days ${hours} hours (${formattedDate})`;
}

function formatFirstAppearTime(firstAppear) {
  // Ensure moment-timezone is loaded
  if (!moment.tz) {
    // console.error("moment-timezone is required.");
    return "Error: moment-timezone not available.";
  }

  // Validate the date
  if (!moment(firstAppear, moment.ISO_8601, true).isValid()) {
    // console.error("Invalid date format:", firstAppear);
    return "Invalid date";
  }

  // Parse the date in UTC and convert to America/Chicago timezone
  const chicagoTime = moment.tz(firstAppear, "UTC").tz("America/Chicago");

  // Get the current time in America/Chicago timezone
  const now = moment().tz("America/Chicago");

  // Calculate the difference in years, months, and days
  const diff = moment.duration(now.diff(chicagoTime));
  const years = diff.years();
  const months = diff.months();

  // Format the Chicago time for display
  const formattedDate = chicagoTime.format("YYYY-MM-DD HH:mm:ss");

  // Construct the relative time string
  return `${years} year${years !== 1 ? "s" : ""} ${months} month${
    months !== 1 ? "s" : ""
  } ago (${formattedDate})`;
}

function deviceDetail(details) {
  // Open the device modal
  showDeviceModal.value = true;

  // Parse incoming details safely
  const detailsObject = JSON.parse(details);
  // console.log(detailsObject);

  // Assign values using null-safe operators
  deviceDetails.value.ip_address = detailsObject.interfaces?.[0]?.ip ?? "N/A";
  deviceDetails.value.WAN_Type = detailsObject.interfaces?.[0]?.name ?? "N/A";
  deviceDetails.value.subnet_mask =
    detailsObject.interfaces?.[0]?.netmask ?? "N/A";
  deviceDetails.value.default_gateway =
    detailsObject.interfaces?.[0]?.gateway ?? "N/A";

  const updateDNS = (dnsArray) => {
    deviceDetails.value.dns_servers = dnsArray?.join(", ") ?? "N/A"; // Null-safe join
  };
  updateDNS(detailsObject.interfaces?.[0]?.dns_servers);

  deviceDetails.value.routing_mode =
    detailsObject.interfaces?.[0]?.conn_mode ?? "N/A";
  deviceDetails.value.mtu = detailsObject.interfaces?.[0]?.mtu ?? "N/A";
  deviceDetails.value.imsi =
    detailsObject.interfaces?.[0]?.sims?.[0]?.imsi ?? "N/A";
  deviceDetails.value.iccid =
    detailsObject.interfaces?.[0]?.sims?.[0]?.iccid ?? "N/A";
  deviceDetails.value.mtn =
    detailsObject.interfaces?.[0]?.sims?.[0]?.mtn ?? "N/A";

  deviceDetails.value.uptime = formatTimeDifference(
    detailsObject.uptime_appear ?? "N/A"
  );
  deviceDetails.value.online = formatTimeDifference(
    detailsObject.last_online ?? "N/A"
  );
  deviceDetails.value.first_appear = formatFirstAppearTime(
    detailsObject.first_appear ?? "N/A"
  );
  deviceDetails.value.essid = detailsObject.ssid_mac_list?.[0]?.essid ?? "N/A";
}

let ids = [];
function assetFind(content_id) {
  const asset = peplinkStore.allAssets.find((item) => item.id === content_id);

  // Check if asset is found
  if (asset) {
    const serial_no = asset.serial_no ? asset.serial_no : "-";
    return serial_no; // Return the serial_no if asset exists
  } else {
    return "-"; // Return null or handle the case when asset is not found
  }
  // ids.push(content_id);
  // console.log(ids.length);
  // console.log("++++", index);
  // if (index == Number(peplinkStore.paginateData?.total) - 1) {
  //   // let concatenatedIds = ids.join(",");
  //   // let res = await peplinkStore.getAllAssets(concatenatedIds);
  //   // if(res){
  //   //   console.log("----", peplinkStore.allAssets)
  //   //   const asset = peplinkStore.allAssets.find(item => item.id === content_id);
  //   //   // Return serial_no if found, otherwise return null or a default value
  //   //   return asset ? asset.serial_no : null;
  //   // }
  // }
}

function closeModal() {
  showCameraModal.value = false;
  showDeviceModal.value = false;
}

let assetId = ref(null);

function assetNavigate(val) {
  // console.log(val);
  assetId.value = val;
  navigateTo(`/inventory/assets?action=update&assetId=${val}`);
  // H.withUrl.setQuery({ action: "update", assetId: val });
}

onMounted(async () => {
  await peplinkStore.getPeplinkList();
});
</script>
<template>
  <div>
    <Breadcrumb
      title="Peplink Devices"
      :links="['peplinkdevices']"
    ></Breadcrumb>
    <div class="ionic-card">
      <div
        class="ionic-card-header card-header-border d-flex justify-content-between align-items-center"
      >
        <h4 class="fs-18">Peplink Devices</h4>
      </div>

      <!-- Table code started -->

      <div class="ionic-card-body">
        <div class="table-responsive">
          <table class="table table-borderless mt-3 text-center">
            <thead>
              <tr>
                <th>Peplink Device Name</th>
                <th>Connected Asset Serial No</th>
                <th>Connected Devices</th>
                <th>Device Details</th>
              </tr>
            </thead>
            <tbody>
              <!-- Show shimmer effect rows if data is loading -->
              <!-- peplinkStore.peplink_devices -->
              <template
                v-if="
                  peplinkStore.peplink_devices == null ||
                  peplinkStore.allAssets == null
                "
              >
                <tr class="empty-tr">
                  <td colspan="7"></td>
                </tr>
                <tr v-for="(x, index) in 8" :key="index">
                  <td>
                    <ShimmerEffect
                      bg="light"
                      height="35px"
                      radius="10px"
                    ></ShimmerEffect>
                  </td>
                  <td>
                    <ShimmerEffect
                      bg="light"
                      height="35px"
                      radius="10px"
                    ></ShimmerEffect>
                  </td>
                  <td>
                    <ShimmerEffect
                      bg="light"
                      height="35px"
                      radius="10px"
                    ></ShimmerEffect>
                  </td>
                  <td>
                    <ShimmerEffect
                      bg="light"
                      height="35px"
                      radius="10px"
                    ></ShimmerEffect>
                  </td>
                </tr>
              </template>

              <!-- Show static empty state if no data -->
              <template v-else-if="peplinkStore.peplink_devices?.length == 0">
                <tr>
                  <td colspan="7" class="text-center">No data available.</td>
                </tr>
              </template>

              <!-- Dynamic Rows -->
              <template v-else>
                <tr class="empty-tr">
                  <td colspan="5"></td>
                </tr>
                <tr
                  v-for="(item, index) in peplinkStore.peplink_devices"
                  :key="index"
                >
                  <td>{{ item.color }}</td>
                  <td
                    @click="assetNavigate(item.relations[0]?.content_id)"
                    :class="{
                      clickable:
                        assetFind(item.relations[0]?.content_id) !== '-', // Ensure clickable only when asset exists
                    }"
                  >
                    {{
                      item.relations[0]?.content_id != null
                        ? assetFind(item.relations[0]?.content_id)
                        : "-"
                    }}
                  </td>
                  <td>
                    <template v-if="item.cameras?.length === 0">-</template>
                    <template v-else>
                      <i-las
                        t="view"
                        class="size-sm ms-2 cp"
                        @click="cameraDetails(item.cameras)"
                      ></i-las>
                    </template>
                  </td>
                  <td>
                    <template v-if="item?.options?.length == 0">-</template>
                    <template v-else>
                      <i-las
                        t="view"
                        class="size-sm ms-2 cp"
                        @click="deviceDetail(item?.options)"
                      ></i-las>
                    </template>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <div class="d-flex justify-content-end align-items-center my-3 pb-4">
        <p class="me-4">
          <strong class="text-white-50">
            Total: {{ peplinkStore.paginateData?.total }}

            <span class="mx-3">|</span>
            Page: {{ peplinkStore.paginateData?.current_page }}
            <span class="mx-3">|</span>
            Showing: {{ peplinkStore.peplink_devices?.length }}
          </strong>
        </p>
        <PaginationRentMy
          v-model="peplinkStore.paginateData"
          @jumpToPage="
            (page_no) => {
              peplinkStore.paginate.page = page_no;
              peplinkStore.getPeplinkList();
            }
          "
        ></PaginationRentMy>
      </div>
      <!-- Table code Ended -->

      <!-- Modal Component Camera -->
      <section
        v-if="showCameraModal"
        class="modal fade addnew-product-modal"
        tabindex="-1"
        style="display: block; opacity: unset"
      >
        <div
          class="modal-dialog modal-dialog-centered"
          @click.stop="closeModal"
        >
          <div class="modal-content" @click.stop="false">
            <div class="modal-header">
              <h1 class="modal-title fs-5">{{ "Connected Device Details" }}</h1>
              <button
                @click.stop="closeModal"
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
                <div>
                  <div class="ionic-card">
                    <div class="ionic-card-body">
                      <div class="row">
                        <div class="col-md-12">
                          <template
                            v-for="(camera, index) in cameraDetail"
                            :key="index"
                          >
                            <div class="camera-card">
                              <ul
                                class="camera-details"
                                style="margin-left: 20px"
                              >
                                <li>
                                  <strong>Camera Name:</strong>
                                  {{ camera.name }}
                                </li>
                                <li>
                                  <strong>Eagle Eye ID:</strong>
                                  {{ camera.een_camera_id }}
                                </li>
                                <li>
                                  <strong>Bridge ID:</strong>
                                  {{ camera.bridge_id }}
                                </li>
                                <li><strong>MAC:</strong> {{ camera.mac }}</li>
                              </ul>
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer justify-content-between ps-0 pe-0"></div>
          </div>
        </div>
      </section>

      <!-- Modal Component Device -->
      <section
        v-if="showDeviceModal"
        class="modal fade addnew-product-modal"
        tabindex="-1"
        style="display: block; opacity: unset"
      >
        <div
          class="modal-dialog modal-dialog-centered"
          @click.stop="closeModal"
        >
          <div class="modal-content" @click.stop="false">
            <div class="modal-header">
              <h1 class="modal-title fs-5">Device Details</h1>
              <button
                @click.stop="closeModal"
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
                <div>
                  <div class="ionic-card">
                    <div class="ionic-card-body">
                      <ul class="device-details">
                        <li>
                          <strong>WAN Type :</strong>
                          {{ deviceDetails.WAN_Type }}
                        </li>
                        <li>
                          <strong>IP Address :</strong>
                          {{ deviceDetails.ip_address }}
                        </li>
                        <li>
                          <strong>Subnet Mask :</strong>
                          {{ deviceDetails.subnet_mask }}
                        </li>
                        <li>
                          <strong>Default Gateway :</strong>
                          {{ deviceDetails.default_gateway }}
                        </li>
                        <li>
                          <strong>DNS Servers :</strong>
                          {{ deviceDetails.dns_servers }}
                        </li>
                        <li>
                          <strong>Routing Mode :</strong>
                          {{ deviceDetails.routing_mode }}
                        </li>
                        <li><strong>MTU :</strong> {{ deviceDetails.mtu }}</li>
                        <li>
                          <strong>IMSI :</strong> {{ deviceDetails.imsi }}
                        </li>
                        <li>
                          <strong>ICCID :</strong> {{ deviceDetails.iccid }}
                        </li>
                        <li><strong>MTN :</strong> {{ deviceDetails.mtn }}</li>
                        <li>
                          <strong>Uptime :</strong> {{ deviceDetails.uptime }}
                        </li>
                        <li>
                          <strong>Online :</strong> {{ deviceDetails.online }}
                        </li>
                        <li>
                          <strong>First Appear :</strong>
                          {{ deviceDetails.first_appear }}
                        </li>
                        <li>
                          <strong>ESSID :</strong> {{ deviceDetails.essid }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer justify-content-between ps-0 pe-0"></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<style>
.camera-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #2c3030;
}

.camera-title {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #333;
}

.camera-details {
  list-style: none;
  padding: 0;
}

.camera-details li {
  margin-bottom: 4px;
}

.device-details {
  list-style: none;
  padding: 20px;
  margin: 10px;
  background-color: #2c3030; /* Light gray background */
  border: 1px solid #ddd; /* Border around the entire list */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.device-details li {
  padding: 10px 0;
  border-bottom: 1px solid #eee; /* Divider between items */
  display: flex; /* Use flexbox for better alignment */
  justify-content: space-between; /* Separate label and value */
  align-items: center; /* Vertically align items */
  margin-left: 25px;
  margin-right: 25px;
}

.device-details li:last-child {
  border-bottom: none; /* Remove border for the last item */
}

.device-details strong {
  color: #fcfcfc; /* Darker text for labels */
  font-weight: 600; /* Slightly bolder font */
  margin-right: 15px; /* Add spacing after the label */
  flex-shrink: 0; /* Prevent the label from shrinking */
}

.device-details span {
  color: #fcfcfc; /* Muted text for dynamic data */
  font-size: 14px; /* Slightly smaller font size for details */
  text-align: center; /* Align text to the left */
  flex-grow: 1; /* Allow value to take up remaining space */
  padding-left: 10px; /* Additional spacing between static and dynamic data */
}

.clickable {
  cursor: pointer; /* Changes cursor to pointer on hover */
}

.clickable:hover {
  color: blue !important; /* Makes the text blue */
}
</style>
