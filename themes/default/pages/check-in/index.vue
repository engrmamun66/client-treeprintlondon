<template>
  <div>
    <div>
      <div class="row">
        <div class="col-xl-12">
          <div class="progress-box">
            <svg>
              <circle cx="100" cy="109" r="93"></circle>
              <circle
                class="active-color"
                cx="100"
                cy="109"
                r="93"
                style="--percent: 0"
              ></circle>
            </svg>
            <div class="progress-value" style="color: white">
              <img src="/img/mobileicon/timestarticon.png" />
              <span>{{ formattedElapsedTime }}</span>
            </div>
          </div>
          <div class="row justify-content-center start-stop-btnarea">
            <div class="col-auto d-flex">
              <button
                @click="startTimer"
                class="ionic-btn ionic-theme-btn2 ionic-btnlg start-btn"
                :hidden="showButton"
              >
                <i class="las la-power-off"></i> Start shift
              </button>
              <button
                @click="stopTimer"
                class="ionic-btn ionic-cancel-btn ionic-btnlg stop-btn"
                :hidden="!showButton"
              >
                <i class="las la-power-off"></i> Stop shift
              </button>
              <button
                @click="openCreateModal()"
                class="ionic-btn ionic-theme-btn2 ionic-btnlg"
              >
                <i class="las la-plus"></i> Add Attendance
              </button>
            </div>
          </div>
        </div>
        <div class="col-xl-12 today-attendance-area">
          <div class="row justify-content-center">
            <div class="col-8 attemdance-title-column">
              <h5 class="attemdance-title mb-2">Today Attendance</h5>
            </div>
          </div>
          <div class="row align-items-center justify-content-center">
            <div class="col-4 checkoutbox-column">
              <div class="checkin-out-box">
                <div class="checkin-out-box-inner">
                  <h5 class="checkin-out-title">
                    <img src="/img/mobileicon/clockicon.png" /> Check in
                  </h5>
                  <h6>
                    {{
                      atttendanceStore.attendanceData.check_in
                        ? getTimeInAmPm(
                            atttendanceStore.attendanceData.check_in
                          )
                        : "00:00:00"
                    }}
                  </h6>
                  <span>Go home</span>
                </div>
              </div>
            </div>
            <div class="col-4 checkoutbox-column">
              <div class="checkin-out-box">
                <div class="checkin-out-box-inner">
                  <h5 class="checkin-out-title fs-14">
                    <img src="/img/mobileicon/clockredicon.png" /> Check Out
                  </h5>
                  <h6>
                    {{
                      atttendanceStore.attendanceData.check_out
                        ? getTimeInAmPm(
                            atttendanceStore.attendanceData.check_out
                          )
                        : "00:00:00"
                    }}
                  </h6>
                  <span>Go home</span>
                </div>
              </div>
            </div>
            <div class="col-md-12 checkoutbox-btn-column text-center mt-4">
              <nuxt-link
                to="/check-in/atttendance_activity"
                class="ionic-btn ionic-theme-btn2 viewpreviewactivity-btn"
                >View Previous activity <i class="las la-arrow-right ms-1"></i
              ></nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <section
        v-if="showAttendanceModal"
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
              <h1 class="modal-title fs-5">Add Attendance</h1>
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
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="form-label">Type</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <div class="select-optionbox">
                          <select class="form-control" v-model="modalData.type">
                            <option :value="null" class="color-white">
                              -Select Type-
                            </option>
                            <option value="check_in" class="color-white">
                              Check In
                            </option>
                            <option value="check_out" class="color-white">
                              Check Out
                            </option>
                          </select>
                        </div>
                      </template>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">Date</label>
                      <div class="date-box">
                        <div class="date-box-input">
                          <input
                            v-model="modalData.date"
                            class="em-datetimepick form-control theme-dark date-input"
                            type="date"
                          />
                        </div>
                        <!-- <button type="button" class="ionic-btn">
                        <i class="la la-calendar"></i>
                      </button> -->
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">Time</label>
                      <div class="time-box">
                        <div class="time-box-input">
                          <input
                            v-model="modalData.time"
                            class="em-datetimepicker form-control theme-dark date-input-time"
                            type="time"
                          />
                        </div>
                        <!-- <button type="button" class="ionic-btn">
                        <i class="la la-clock"></i>
                      </button> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer justify-content-between ps-0 pe-0">
              <template v-if="modelEffect">
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
                  @click="closeModal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="ionic-btn ionic-theme-btn2 save-btn"
                  @click="handleSubmit"
                >
                  Submit
                </button>
              </template>
            </div>
          </div>
        </div>
      </section>
    </div>
    <!-- Modal -->
  </div>
</template>

<script setup>
import { useAttendanceStore } from "~/stores/Attendance.js";
let atttendanceStore = useAttendanceStore();

const showAttendanceModal = ref(false);
const timerStoped = ref(null);
const showButton = ref(false);
const timer = ref(null);
const elapsedTime = ref(0);
const latitude = ref(null);
const longitude = ref(null);
const error = ref(null);
const userId = ref(null);
const modalData = ref({
  type: null,
  date: null,
  time: null,
});

const openCreateModal = async () => {
  modalData.value.date = null;
  modalData.value.time = null;
  modalData.value.type = null;
  showAttendanceModal.value = true;
};

const closeModal = async () => {
  showAttendanceModal.value = false;
};

const getFormattedDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const formattedElapsedTime = computed(() => {
  const hours = String(Math.floor(elapsedTime.value / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((elapsedTime.value % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(elapsedTime.value % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
});

const updateElapsedTime = () => {
  elapsedTime.value++;
  console.log(elapsedTime.value)
  localStorage.setItem("elapsedTime", elapsedTime.value);
};

const getPosition = (callback) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        if (callback) callback();
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            error.value = "User denied the request for Geolocation.";
            break;
          case err.POSITION_UNAVAILABLE:
            error.value = "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            error.value = "The request to get user location timed out.";
            break;
          case err.UNKNOWN_ERROR:
            error.value = "An unknown error occurred.";
            break;
        }
        Toaster.error(error.value);
      }
    );
  } else {
    error.value = "Geolocation is not supported by this browser.";
  }
};

const handleSubmit = () => {
  if (new Date() < new Date(modalData.value.date)) {
    Toaster.error("Could not submit attendance for future date");
    return;
  }
  if (modalData.value.type && modalData.value.date && modalData.value.time) {
    getPosition(() => {
      atttendanceStore.attendance.type = modalData.value.type;
      atttendanceStore.attendance.user_id = userId.value;
      atttendanceStore.attendance.dateTime =
        modalData.value.date + " " + modalData.value.time;
      atttendanceStore.attendance.lat = latitude.value;
      atttendanceStore.attendance.long = longitude.value;
      atttendanceStore.createAttendance(atttendanceStore.attendance);
    });
    atttendanceStore.getAttendance(userId);
    setTimeout(() => {
      atttendanceStore.getAttendance(userId.value);
    }, 500);
    showAttendanceModal.value = false;
  } else {
    Toaster.error("Please Fill all the fields");
    showAttendanceModal.value = true;
    return;
  }
};

const startTimer = () => {
  getPosition(() => {
    // console.log(
    //   `Start: Latitude: ${latitude.value}, Longitude: ${longitude.value}`
    // );

    showButton.value = true;
    localStorage.setItem("showButton", JSON.stringify(showButton.value));
    timerStoped.value = false;
    localStorage.setItem("timerStopped", timerStoped.value);

    // Check if there is already elapsed time in localStorage
    const savedTime = localStorage.getItem("elapsedTime");
    if (savedTime) {
      elapsedTime.value = parseInt(savedTime);
    } else {
      elapsedTime.value = 0;
    }

    if (!timer.value) {
      timer.value = setInterval(updateElapsedTime, 1000);
    }

    atttendanceStore.attendance.type = "check_in";
    atttendanceStore.attendance.user_id = userId.value;
    atttendanceStore.attendance.dateTime = getFormattedDateTime();
    atttendanceStore.attendance.lat = latitude.value;
    atttendanceStore.attendance.long = longitude.value;
    atttendanceStore.createAttendance(atttendanceStore.attendance,"start");
    // console.log(`Start Time: ${getFormattedDateTime()}`);
  });

  if (error.value) {
    return;
  }
  atttendanceStore.getAttendance(userId);
  setTimeout(() => {
    atttendanceStore.getAttendance(userId.value);
  }, 500);
};

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
const stopTimer = () => {
  getPosition(() => {
    console.log(
      `Stop: Latitude: ${latitude.value}, Longitude: ${longitude.value}`
    );
    showButton.value = false;
    localStorage.setItem("showButton", JSON.stringify(showButton.value));
    timerStoped.value = true;
    localStorage.setItem("timerStopped", timerStoped.value);
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
      clearInterval(updateElapsedTime)

    }
    atttendanceStore.attendance.type = "check_out";
    atttendanceStore.attendance.user_id = userId.value;
    atttendanceStore.attendance.dateTime = getFormattedDateTime();
    atttendanceStore.attendance.lat = latitude.value;
    atttendanceStore.attendance.long = longitude.value;
    atttendanceStore.createAttendance(atttendanceStore.attendance,"stop");
  });
  setTimeout(() => {
    atttendanceStore.getAttendance(userId.value);
  }, 500);
};

const getTimeInAmPm = (datetime) => {
  const date = new Date(datetime);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${hours}:${minutes}:${seconds} ${ampm}`;
};

onMounted(() => {
  showButton.value = Boolean(JSON.parse(localStorage.getItem("showButton")));
  const savedTime = localStorage.getItem("elapsedTime");
  if (savedTime) {
    elapsedTime.value = parseInt(savedTime);
  }
  // if (!Boolean(localStorage.getItem('timerStopped')) === true) {
  //   timer.value = setInterval(updateElapsedTime, 1000);
  // }
  if (showButton.value) {
    timer.value = setInterval(updateElapsedTime, 1000);
  }

  userId.value = useCookie("auth_user").value.id;
  setTimeout(() => {
    atttendanceStore.getAttendance(userId.value);
  }, 500);
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});

</script>

<style>
/* Add your styles here */
.date-input {
  color: white; /* Change text color to white */
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(1); /* Inverts the color of the calendar icon */
}
.date-input-time {
  color: white;
  /* Change text color to white */
}

.date-input-time::-webkit-calendar-picker-indicator {
  filter: invert(1); /* Inverts the color of the calendar icon */
  margin-left: 13rem;
}
.color-white {
  color: white;
}
</style>
