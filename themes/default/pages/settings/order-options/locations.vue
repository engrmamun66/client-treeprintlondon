<template>
  <div>
    <Breadcrumb
      title="Locations"
      :links="['settings', 'settings_location']"
    ></Breadcrumb>
    <div class="ionic-card">
      <div
        class="ionic-card-header card-header-border d-flex justify-content-between align-items-center"
      >
        <h4 class="fs-18">Coupons</h4>
        <div class="card-header-rightside">
          <button
            class="ionic-btn ionic-theme-btn2 addnew-product-btn"
            @click="openLocationPopUp"
          >
            <i class="las la-plus"></i> Add Location
          </button>
        </div>
      </div>

      <!-- Table code started -->
      <div class="ionic-card-body">
        <div class="table-responsive">
          <table class="table table-borderless">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Online Store</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="empty-tr">
                <td colspan="5"></td>
              </tr>
              <template v-if="userLocationStore.showTableEffect">
                <tr v-for="(x, index) in 4" :key="index">
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
              <template v-else>
                <tr
                  v-for="(table, index) in userLocationStore.tableData"
                  :key="index"
                >
                  <td>{{ table.name }}</td>
                  <td>
                    <span
                      :class="
                        table.status == 1 ? 'text-success' : 'text-danger'
                      "
                    >
                      {{ table.status == 1 ? "Active" : "Inactive" }}
                    </span>
                  </td>
                  <td>
                    <span
                      :class="table.is_online ? 'text-success' : 'text-danger'"
                    >
                      {{ table.is_online ? "Yes" : "No" }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex justify-content-center">
                      <div></div>
                      <div class="d-flex">
                      <p tooltip="Edit" flow="up">
                        <i-las
                          t="edit"
                          class="size-sm cp"
                          @click="getEachLocation(index)"
                        />
                      </p>
                      <p tooltip="Delete" flow="up">
                        <i-las
                          t="trash"
                          class="size-sm cp"
                          @click="withDelete.showConfirmation = true"
                        />
                      </p>
                    </div>
                    </div>

                  </td>
                  <Modal-Confirm
                    v-if="withDelete.showConfirmation"
                    v-model="withDelete.showConfirmation"
                    :skipAutoClose="true"
                    @yes="
                      async () => {
                        await userLocationStore.deleteLocation(table.id);
                        withDelete.showConfirmation = false;
                      }
                    "
                  >
                  </Modal-Confirm>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Table code Ended -->
    </div>
    <div>
      <Rightbar
        title="Add Location"
        @unmount="closeLocationPopUp"
        v-if="userLocationStore.locationModal"
      >
        <div>
          <div class="ionic-card-body">
            <div class="col-md-4 col-sm-4">
              <label class="form-label"
                >Name
                <span style="color: red; font-size: 1.2rem">*</span></label
              >

              <input
                type="text"
                v-model="locationData.name"
                placeholder="Location Name"
                class="form-control"
              />
            </div>

            <div class="col-md-12 col-sm-12 mt-4">
              <label class="form-label">Address</label>
              <div style="position: relative">
                <el-BaseInput
                  v-model="locationData.address"
                  :addressSearchFromGoogle="true"
                  :placeholder="add"
                  @changeAddress="
                    (address) => {
                      // console.log(address);
                      locationData.city = address?.city;
                      locationData.zipcode = address?.zipcode;
                      if (address.country_short_name != null) {
                        setCountry(address?.country_short_name);
                      }
                      if (address.state != null) {
                        locationData.state = address.state;
                      }
                    }
                  "
                />
              </div>
            </div>

            <div class="mt-4">
              <div class="row">
                <div class="col-md-6 col-sm-6">
                  <label class="form-label">Country</label>
                  <div class="select-optionbox position-relative">
                    <!-- Custom dropdown button -->
                    <button
                      class="form-control text-start"
                      @click="dropdownOpen = !dropdownOpen"
                      :class="{ 'btn-dark': selectedCountry }"
                    >
                      {{
                        selectedCountry
                          ? selectedCountry.name
                          : "Select Country"
                      }}
                    </button>
                    <!-- Dropdown with search and options -->
                    <div
                      v-if="dropdownOpen"
                      class="dropdown-menu show w-100 bg-dark text-white"
                      style="max-height: 200px; overflow-y: auto"
                    >
                      <!-- Search input inside dropdown -->
                      <input
                        type="text"
                        placeholder="Search Country"
                        v-model="searchTerm"
                        class="mb-2 bg-dark text-white search-field form-control"
                      />
                      <!-- Filtered country options -->
                      <div
                        v-for="country in filteredCountries"
                        :key="country.id"
                        @click="selectCountry(country)"
                        class="dropdown-item bg-dark text-white country-option"
                      >
                        {{ country.name }}
                      </div>
                      <!-- No countries found -->
                      <div
                        v-if="filteredCountries.length === 0"
                        class="dropdown-item text-muted bg-dark"
                      >
                        No countries found
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-6 col-sm-6">
                  <label class="form-label">State</label>
                  <div class="input-group">
                    <select
                      class="form-control"
                      v-model="locationData.state"
                      v-if="userTaxStore.stateList?.length"
                    >
                      <option :value="null">Select a state</option>
                      <option
                        v-for="state in stateList"
                        :key="state"
                        :value="state.code"
                      >
                        {{ state.name }}
                      </option>
                    </select>
                    <input
                      v-else
                      type="text"
                      placeholder="Enter a city"
                      v-model="locationData.state"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <div class="row">
                <div class="col-md-6 col-sm-6">
                  <label class="form-label">City</label>
                  <input
                    type="text"
                    placeholder="Enter a city"
                    v-model="locationData.city"
                    class="form-control"
                  />
                </div>

                <div class="col-md-6 col-sm-6">
                  <label class="form-label">Zip Code </label>
                  <div class="input-group">
                    <input
                      type="text"
                      placeholder="Enter a Zip Code"
                      v-model="locationData.zipcode"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <div class="row">
                <div class="col-md-6 col-sm-6 mt-4">
                  <label class="form-label">Status</label>
                  <select class="form-control" v-model="locationData.status">
                    <option :value="null">--Select Status--</option>
                    <option value="1">Active</option>
                    <option value="2">Inactive</option>
                  </select>
                </div>
                <div class="col-md-6 col-sm-6 mt-4">
                  <div class="d-flex align-items-center mt-4">
                    <input
                      class="form-check-input in-dark-bg"
                      type="checkbox"
                      v-model="locationData.is_online"
                      @click="locationData.is_online = !locationData.is_online"
                    />

                    <h5 class="mx-3 mb-0 mt-1">Is Online Store?</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="mt-4">
            <button
              type="button"
              class="ionic-btn ionic-theme-btn2 save-btn ms-0"
              @click="handleSubmit"
            >
              {{ updateLocation ? "Update" : "Submit" }}
              <BtnLoader
                v-if="
                  H.isPendingAnyApi('Settings:createLocations|Settings:updateLocation')
                "
                color="black"
              ></BtnLoader>
            </button>
          </div>
        </template>
      </Rightbar>
    </div>
  </div>
</template>

<script setup>
import { useCouponstore } from "~/stores/rentmy/settings/Coupon.js";
import { useLocationstore } from "~/stores/rentmy/settings/Location.js";
import { useTaxStore } from "~/stores/rentmy/Tax.js";


// Page meta
definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

// Page title
useHead({
  titleTemplate: "%s | Locations",
});

// Store instances
const userCouponStore = useCouponstore();
const userLocationStore = useLocationstore();
const userTaxStore = useTaxStore();

// Reactive states and references
const withDelete = reactive({
  showConfirmation: false,
  item: null,
});
const add = ref("Enter a location");
const locationData = ref({
  address: null,
  city: null,
  country: null,
  id: null,
  is_online: null,
  is_virtual: null,
  location: null,
  name: null,
  state: null,
  status: null,
  stores_terminals: null,
  zipcode: null,
});
let updateLocation = ref(false);
const searchTerm = ref(""); // To store the search input
const dropdownOpen = ref(false); // To control the visibility of the dropdown
const selectedCountry = ref(null); // To store the selected country
let stateList = ref(null);

// Computed properties
let filteredCountries = computed(() => {
  return userTaxStore.countryList.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Lifecycle hooks
onMounted(async () => {
  await userLocationStore.getLocationList();
  await userCouponStore.getCouponList();
  await userTaxStore.getCountryList();

  localStorage.setItem(
    "locations",
    JSON.stringify(userLocationStore.tableData)
  );
});

// Functions
function openLocationPopUp() {
  userLocationStore.locationModal = true;
  resetModal();
}

function closeLocationPopUp() {
  userLocationStore.locationModal = false;
  updateLocation.value = false;
}

async function getEachLocation(id) {
  openLocationPopUp();
  updateLocation.value = true;
  let a = JSON.parse(localStorage.getItem("locations"));
  setTimeout(() => {
    locationData.value = {
      ...a[id],
      location: `${a[id].address},${a[id].city},${a[id].state},${a[id].country}`,
    };
    setCountry(a[id].country);
  }, 100);
}

function setCountry(code) {
  if (!code) return;
  let b = filteredCountries.value.slice();
  b = b.filter((country) => country?.code === code);
  selectCountry(b[0]);
}

const selectCountry = async (country) => {
  useNuxtApp().$emit("GoogleAddressByCountry", country.code);

  selectedCountry.value = country; // Set the selected country
  searchTerm.value = ""; // Clear the search term to show all options
  dropdownOpen.value = false; // Close the dropdown modal
  locationData.value.country = selectedCountry.value?.code;
  await userTaxStore.stateByCountry(selectedCountry.value.id);
  stateList.value = userTaxStore.stateList;
  
};

async function handleSubmit() {
  if(locationData.value.name == null){
    Toaster.error("Please fill the required field")
    userLocationStore.locationModal = true
    return
  }
  if (updateLocation.value) {
    await userLocationStore.updateLocation(
      locationData.value.id,
      locationData.value
    );
  } else {
    await userLocationStore.createLocation(locationData.value);
  }

  localStorage.removeItem("locations");

  setTimeout(() => {
    localStorage.setItem(
      "locations",
      JSON.stringify(userLocationStore.tableData)
    );
  }, 100);
}

function resetModal() {
  locationData.value = {
    address: null,
    city: null,
    country: null,
    id: null,
    is_online: null,
    is_virtual: null,
    location: null,
    name: null,
    state: null,
    status: null,
    stores_terminals: null,
    zipcode: null,
  };
  selectedCountry.value = null;
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: rgb(0, 0, 0);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.date-options {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.date-options li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.date-options li:hover {
  background-color: #5a5757;
}

.custom-range {
  margin-top: 20px;
}

.custom-range input {
  width: 100%;
  margin-bottom: 10px;
}

.btn {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

.product-modal {
  position: absolute;
  top: 30%;
  left: 0;
  width: 20%;
  background-color: #000000;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.product-modal-coupon {
  position: absolute;
  top: 62%;
  left: 0;
  width: 20%;
  background-color: #000000;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.product-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.product-item:hover {
  background-color: #313131;
}

.selected-products {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.remove-icon {
  margin-left: 8px;
  cursor: pointer;
  color: red;
}

.remove-icon:hover {
  color: darkred;
}

.product-card {
  background-color: #000000;
  border-color: rgb(17, 255, 17);
  border-width: 10px;
  border-radius: 5px;
  padding: 8px 12px;
  margin-right: 5px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.usd-text {
  font-family: sans-serif;
  color: #fdfdfd;
  /* Green color */
  background-color: #f0f0f0;
  /* Light grey background */
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-container {
  position: relative;
}

.input-loader {
  position: absolute;
  top: 35%;
  right: 10px;
  transform: translateY(-50%);
}

.input-loader-discount {
  position: absolute;
  top: 40%;
  right: 1rem;
  transform: translateY(-50%);
  z-index: 10;
  /* Ensure it stays above the input field */
}

.hover-text {
  color: #37c923;
  /* Original color */
}

.hover-text:hover {
  cursor: pointer;
  color: #09be09;
  /* Deeper green color on hover */
}
.select-optionbox .country-option {
  font-family: sans-serif;
  font-weight: 12px;
}

/* Hover state for dropdown items */
.select-optionbox .country-option:hover {
  background-color: #0084b8 !important;
  /* Green color on hover */
  color: #fff !important;
  cursor: pointer;
  font-family: sans-serif;
  font-weight: 14px;
}

/* Custom margin for small devices */
@media (max-width: 767.98px) {
  .mobile-mt {
    margin-top: 1.5rem;
    /* Adjust this value as needed */
  }
}

/* Reset margin for larger devices */
@media (min-width: 768px) {
  .mobile-mt {
    margin-top: 0;
  }
}
</style>
