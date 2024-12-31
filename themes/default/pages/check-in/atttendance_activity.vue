<template>
  <div>
    <div class="ionic-card ionic-activity-card">
      <div class="ionic-card-header card-header-border">
        <h4 class="fs-22">Your Activity</h4>
      </div>
      <div class="ionic-card-body">
        <div class="row">
          <div
            class="col-md-4"
            v-for="(time, index) in atttendanceStore.attendanceList"
          >
            <div class="ionic-db-card">
              <div class="ionic-db-card-left">
                <h5 class="fs-20 mb-3">{{ convertToDate(time?.date) }}</h5>
                <div class="d-flex align-items-center">
                  <div class="d-flex align-items-center me-5">
                    <i class="las la-arrow-circle-right arrow-icon-right"></i>
                    <p class="fs-14">
                      {{ convertTime(time?.lowest_check_in) }}
                    </p>
                  </div>
                  <div class="d-flex align-items-center">
                    <i class="las la-arrow-circle-left arrow-icon-left"></i>
                    <p class="fs-14">
                      {{ convertTime(time?.highest_check_out) }}
                    </p>
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
<script setup>
import { useAttendanceStore } from "~/stores/Attendance.js";

let atttendanceStore = useAttendanceStore();
const userId = ref(null);
// Get today's date
const today = new Date();

// Get the date one week before today
const oneWeekBefore = new Date();
oneWeekBefore.setDate(today.getDate() - 7);

// Format the dates to YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

const todayFormatted = formatDate(today);
const oneWeekBeforeFormatted = formatDate(oneWeekBefore);

const formData = ref({
  start_date: null,
  end_date: null,
});

function convertToDate(inputDate) {
  // Input date string

  // Create a Date object from the input string
  const date = new Date(inputDate);

  // Define an array of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract the month, day, and year from the Date object
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  // Format the date as "Month Day, Year"
  const formattedDate = `${month} ${day}, ${year}`;

  return formattedDate;
}

function convertTime(inputDateTime) {
  if (!inputDateTime) {
    return "00:00";
  }
  // Input date and time string
  //   const inputDateTime = "2024-07-11 19:42:58";

  // Split the input into date and time components
  const [datePart, timePart] = inputDateTime.split(" ");

  // Split the time part into hours, minutes, and seconds
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  // Determine AM or PM
  const period = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM

  // Format the hours and minutes with leading zeros if necessary
  const formattedHours = String(hours12).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  // Combine the components into the desired format
  const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;

  return formattedTime;
}

onMounted(() => {
  formData.value.start_date = oneWeekBeforeFormatted;
  formData.value.end_date = todayFormatted;
  userId.value = useCookie("auth_user").value.id;
  atttendanceStore.getActivityList(userId.value, formData.value);
});
</script>
