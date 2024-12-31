<template>
  <div>
    <Breadcrumb title="Users" :links="['users']"></Breadcrumb>
    <div class="row">
      <div class="col-md-4 technician-leftside">
        <div class="ionic-card">
          <div class="ionic-card-header card-header-border">
            <h4 class="fs-20">
              {{
                loadData
                  ? ""
                  : profileStore.technicianDetails.role_id == 1
                  ? "Admin Profile"
                  : profileStore.technicianDetails.role_id == 2
                  ? "Technician Profile"
                  : "Supervisor Profile"
              }}
            </h4>
          </div>
          <div class="ionic-card-header card-header-border">
            <div class="ionic-card-header-inner">
              <div class="profile-guard-list">
                <div class="profile-guard-item">
                  <div class="profile-guarditem-infoimg">
                    <template v-if="loadData">
                      <ShimmerEffect
                        bg="light"
                        height="100px"
                        radius="50%"
                      ></ShimmerEffect>
                    </template>
                    <template v-else>
                      <img
                        :src="
                          profileStore.technicianDetails.profile_img ||
                          'https://s3.us-west-2.amazonaws.com/storage-dev.inspectdeploy.io/media/users/1717052490.png'
                        "
                        alt="profile img"
                      />
                    </template>
                    <div class="profile-guarditem-info">
                      <template v-if="loadData">
                        <ShimmerEffect
                          bg="light"
                          height="20px"
                          width="150px"
                        ></ShimmerEffect>
                        <ShimmerEffect
                          bg="light"
                          height="20px"
                          width="100px"
                          class="mt-2"
                        ></ShimmerEffect>
                      </template>
                      <template v-else>
                        <h5>{{ profileStore.technicianDetails.name }}</h5>
                        <span class="text-light">Batch # 010</span>
                      </template>
                    </div>
                  </div>
                  <template v-if="loadData">
                    <ShimmerEffect
                      bg="light"
                      height="35px"
                      radius="10px"
                      width="100px"
                    ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <button
                      :class="
                        profileStore.technicianDetails.status == 1
                          ? 'active-status'
                          : 'inactive-status'
                      "
                    >
                      <span class="active-status-btn"></span>
                      {{
                        profileStore.technicianDetails.status == 1
                          ? "Active"
                          : "Inactive"
                      }}
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="ionic-card-body">
            <div class="activesite-hourspay activesite-overwall">
              <div class="activesite-hourspay">
                <div class="hourspay-listitem">
                  <div class="hourspay-item-text">Start Date</div>
                  <div class="hourspay-item-rightside">
                    <Picker-EmDateTimePicker
                      ref="startDate"
                      v-model="profileStore.technicianDetails.joining_date"
                      :placeholder="start_date"
                      :options="{
                        ...globalData.datePickerOptions,
                        adjustX: -50,
                        adjustY: 10,
                        displayIn: 'bottom_right',
                      }"
                    />
                  </div>
                </div>
                <div class="hourspay-listitem">
                  <div class="hourspay-item-text">Hourly Rate</div>
                  <div class="hourspay-item-rightside">
                    <input
                      v-model="profileStore.technicianDetails.hourly_rate"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="hourspay-listitem">
                  <div class="hourspay-item-text">Driver License</div>
                  <div class="hourspay-item-rightside">
                    <el-DropImagesProfile
                      v-model="driving"
                      :previouslyUpoadedFile="
                        profileStore.technicianDetails.driving_license
                      "
                      :allowMultiple="false"
                      @uploadFile="handleDrivingLicenense"
                      :showButton="false"
                    ></el-DropImagesProfile>
                  </div>
                </div>
                <div class="hourspay-listitem">
                  <div class="hourspay-item-text">Card</div>
                  <div class="hourspay-item-rightside">
                    <el-DropImagesProfile
                      v-model="card"
                      :previouslyUpoadedFile="
                        profileStore.technicianDetails.guard_card
                      "
                      :allowMultiple="false"
                      @uploadFile="handleCard"
                      :showButton="false"
                    ></el-DropImagesProfile>
                  </div>
                </div>
                <!-- <div class="hourspay-listitem">
                  <div class="hourspay-item-text">GPS #</div>
                  <div class="hourspay-item-rightside">
                    <input
                      type="text"
                      v-model="profileStore.technicianDetails.device_id"
                      class="form-control"
                    />
                  </div>
                </div> -->
                <div class="hourspay-listitem">
                  <div class="hourspay-item-text">Cell #</div>
                  <div class="hourspay-item-rightside">
                    <input
                      v-model="profileStore.technicianDetails.phone"
                      type="tel"
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="hourspay-item-rightside text-end mt-3">
                  <button
                    type="button"
                    class="ionic-btn ionic-theme-btn2"
                    @click="handleSubmit"
                  >
                    Submit
                    <BtnLoader
                      v-if="H.isPendingAnyApi('User:updateUser')"
                      color="black"
                    ></BtnLoader>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-5 technician-middleside">
        <div
          class="ionic-card"
          v-if="!loadData && profileStore.workOrder?.length > 0"
        >
          <div class="ionic-card-body">
            <div class="invoice-map pt-0">
              <div id="map" style="height: 400px"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 technician-rightside">
        <div
          class="ionic-card"
          v-if="!loadData && profileStore.workOrder?.length > 0"
        >
          <div class="ionic-card-header card-header-border">
            <h4 class="fs-20">Work Orders</h4>
          </div>
          <div class="ionic-card-body">
            <div
              class="work-order-card ionic-db-card wordorder-active"
              v-for="(work, index) in profileStore.workOrder"
            >
              <div class="ionic-db-card-left">
                <h5 class="fs-16 mb-2 pb-1">{{ work?.name }}</h5>
                <span class="fs-12 mb-3">{{ work?.type }}l</span>
                <div class="select-optionbox order-selectbox">
                  <select
                    class="form-control"
                    v-model="work.status"
                    @change="handleSelect(work.status, work.id)"
                  >
                    <template
                      v-for="(status, i) in globalData.workOrder.statusList"
                    >
                      <option
                        v-if="status.id == work.status"
                        :value="work.status"
                      >
                        {{ status.name }}
                      </option>
                    </template>
                    <template
                      v-for="(status, i) in globalData.workOrder.statusList"
                    >
                      <option
                        v-if="status.id != work.status"
                        :value="status.id"
                      >
                        {{ status.name }}
                      </option>
                    </template>
                  </select>
                </div>
              </div>
              <div class="ionic-db-card-right">
                <div class="ionic-db-card-right-inner">
                  <span class="fs-10 mb-3">#{{ work?.order_id }}</span>
                  <span class="work-status status-active">{{
                    work?.priority == 1
                      ? "Low"
                      : work?.priority == 2
                      ? "Medium"
                      : "High"
                  }}</span>
                  <span class="fs-10 mt-3">
                    Requested<br />
                    by {{ work?.created_by?.roles[0]?.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="table-responsive">
          <div class="ionic-card">
            <div
              class="ionic-card-header card-header-border d-flex justify-content-between align-items-center"
            >
              <h4 class="fs-18">Check IN / OUT</h4>
            </div>
            <div class="ionic-card-body">
              <div class="table-responsive">
                <table class="table table-borderless">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Day</th>
                      <th>Check-In</th>
                      <th>Check-Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="empty-tr">
                      <td colspan="4"></td>
                    </tr>
                    <tr
                      v-for="(time, index) in atttendanceStore.attendanceList"
                    >
                      <td>{{ time?.date }}</td>
                      <td>{{ time?.day }}</td>
                      <td>{{ time?.check_in }}</td>
                      <td>{{ time?.check_out }}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="ionic-pagination ionic-align-center">
                  <ProfilePagination
                    v-if="atttendanceStore?.paginateData?.data"
                    @pagechanged="
                      (page) => {
                        onChangedPage(page);
                      }
                    "
                    :totalPages="
                      atttendanceStore?.paginateData?.data?.last_page
                    "
                    :perPage="atttendanceStore?.paginateData?.data?.per_page"
                    :currentPage="
                      atttendanceStore?.paginateData?.data?.current_page
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAttendanceStore } from "~/stores/Attendance.js";
import { useProfileStore } from "~/stores/Profile.js";
import { useUserStore } from "~/stores/User.js";
const userStore = useUserStore();
const atttendanceStore = useAttendanceStore();
const profileStore = useProfileStore();
const route = useRoute();
const userId = ref(route.params.id);
const driving = ref(null);
const card = ref(null);
const start_date = ref("Start Date");
let startDate = ref(null);
const markers = [
  {
    lat: 0,
    lng: 0,
  },
];
let drivingfile = null;
let cardfile = null;
const joinDate = reactive({
  startDate: new Date(),
  endDate: new Date(),
});
let joinDatePicker = ref(null);
let status = ref({
  status: null,
});

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

function onChangedPage(page) {
  atttendanceStore.paginate.page = page;
  atttendanceStore.getActivityList(userId.value, formData.value);
}

const handleSelect = (id, workid) => {
  profileStore.updatWorkOrderStatus(workid, { status: id });
};
// Get today's date
const today = new Date();

// Get the date one week before today
const oneWeekBefore = new Date();
oneWeekBefore.setDate(today.getDate() - 30);

// Format the dates to YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const todayFormatted = formatDate(today);
const oneWeekBeforeFormatted = formatDate(oneWeekBefore);

const formData = ref({
  start_date: new Date(),
  end_date: new Date(),
});

function convertTime(inputDateTime) {
  if (!inputDateTime) {
    return "00:00";
  }
  const [datePart, timePart] = inputDateTime.split(" ");
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  const formattedHours = String(hours12).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
  return formattedTime;
}

const handleDrivingLicenense = () => {
  profileStore.technicianDetails.driving_license = null;
  // setTimeout(()=>{
  //   const file = driving.value[0];
  //   profileStore.technicianDetails.driving_license = file;
  // },100)
};

const handleCard = () => {
  profileStore.technicianDetails.guard_card = null;
};

function handleSubmit() {
  if (driving.value) {
    drivingfile = driving.value[0];
    profileStore.technicianDetails.driving_license = drivingfile;
  }
  if (card.value) {
    cardfile = card.value[0];
    profileStore.technicianDetails.guard_card = cardfile;
  }

  userStore.updateUser(userId.value, profileStore.technicianDetails);
}
let loadData = ref(true);
onMounted(async () => {
  formData.value.start_date = oneWeekBeforeFormatted;
  formData.value.end_date = todayFormatted;
  profileStore.technicianDetails.name = null;
  profileStore.technicianDetails.role_id = null;
  await profileStore.getTechnicianDetails(userId.value);
  startDate.value.setDate(profileStore.technicianDetails.joining_date);
  // Object.keys(profileStore.technicianDetails.value).forEach(key => profileStore.technicianDetails.value[key] = null);
  await atttendanceStore.getActivityList(userId.value, formData.value);
  // Reset technicianDetails fields to null

  await profileStore.getWorkOrder(userId.value);

  loadData.value = false;

  if (profileStore.technicianDetails.joining_date) {
    joinDate.startDate = joinDate.endDate =
      profileStore.technicianDetails.joining_date;
  }

  if (profileStore.workOrder?.length > 0) {
    const initMap = () => {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: {
          lat: Number(profileStore.workOrder[0].latitude),
          lng: Number(profileStore.workOrder[0].longitude),
        },
        zoom: 12,
      });

      profileStore.workOrder.forEach((data) => {
        markers.push({
          lat: Number(data?.latitude),
          lng: Number(data?.longitude),
        });
        profileStore.technicianDetails.first_name = data.user.first_name;
        profileStore.technicianDetails.last_name = data.user.last_name;
        profileStore.technicianDetails.email = data.user.email;
        profileStore.technicianDetails.role_id = data.user.role_id;
      });

      markers.forEach((location) => {
        new google.maps.Marker({
          position: location,
          map: map,
        });
      });
    };

    const loadGoogleMapsScript = () => {
      const googleMapsKey = "AIzaSyAPktaTZKux-L2DEpfyyQldi6WlgBG80fg"; // Replace with your actual API key
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&callback=initMap`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = initMap;
    };
    setTimeout(() => {
      loadGoogleMapsScript();
    }, 500);
  }
});
</script>

<style scoped>
/* Add any relevant styles here */
</style>
