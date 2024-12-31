<template>
  <div>
    <Breadcrumb title="Users" :links="['users']"></Breadcrumb>
    <div class="ionic-card ionic-filter-card">
      <div class="ionic-card-body">
        <div class="filters-section">
          <div class="row">
            <div class="col-md-3 col-sm-3">
              <input
                type="text"
                placeholder="Name"
                class="form-control"
                v-model="userStore.userSearched.name"
              />
            </div>

            <div class="col-md-3 col-sm-3">
              <input
                type="text"
                placeholder="Email"
                class="form-control"
                v-model="userStore.userSearched.email"
              />
            </div>
            <div class="col-md-3 col-sm-3">
              <div class="select-optionbox">
                <select
                  class="form-control"
                  v-model="userStore.userSearched.role_id"
                >
                  <option :value="null">-Select Role-</option>
                  <option
                    v-for="role in userStore?.userRoles"
                    :key="role?.id + 1"
                    :value="role?.id"
                  >
                    {{ role.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-3 col-sm-3">
              <div class="select-optionbox">
                <select
                  class="form-control"
                  v-model="userStore.userSearched.company_id"
                >
                  <option :value="null">-Select company-</option>
                  <option
                    v-for="(company, index) in companyStore?.companies"
                    :key="index"
                    :value="company?.id"
                  >
                    {{ company?.company_name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="col-md-4 col-sm-4 mt-2 d-flex pt-2">
            <button
              @click="handleFilters"
              type="button"
              class="ionic-btn ionic-theme-btn2 ionic-btnlg ms-0"
            >
              <i class="las la-search"></i>Search
              <BtnLoader v-if="userStore.userLoader" color="black"></BtnLoader>
            </button>
            <button
              type="button"
              @click="resetSearch"
              class="ionic-btn ionic-cancel-btn ionic-btnlg"
            >
              <i class="las la-redo-alt me-2"></i>Clear
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="ionic-card">
      <div
        class="ionic-card-header card-header-border d-flex justify-content-between align-items-center"
      >
        <h4 class="fs-18">Users</h4>
        <div class="card-header-rightside">
          <button
            @click="openCreateModal"
            class="ionic-btn ionic-theme-btn2 addnew-product-btn"
          >
            <i class="las la-plus"></i> User
          </button>
        </div>
      </div>

      <!-- Table Code Started -->
      <div class="ionic-card-body">
        <div class="table-responsive">
          <!-- Filters Section -->

          <table class="table table-borderless">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Company Name</th>
                <th>2FA</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="empty-tr">
                <td colspan="5"></td>
              </tr>
              <template v-if="showEffect">
                <tr
                  v-for="(x, index) in userStore?.userList?.length"
                  :key="index"
                >
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
                <tr v-for="(user, index) in userStore.userList" :key="index">
                  <td>
                    <!-- <nuxt-link :to="`/users/profile/${user?.id}`"> -->
                      <img
                        :src="
                          user?.profile_pic_url
                            ? user?.profile_pic_url
                            : 'https://s3.us-west-2.amazonaws.com/storage-dev.inspectdeploy.io/media/users/1717052490.png'
                        "
                        alt="User Image"
                        class="img-fluid"
                        width="50px"
                        height="50px"
                      />
                    <!-- </nuxt-link> -->
                  </td>
                  <td>
                    <!-- <nuxt-link :to="`/users/profile/${user?.id}`"> -->
                      {{  user?.first_name ? `${user?.first_name || ""} ${user?.last_name || ""}` : `${user?.name || ""}` }}
                    <!-- </nuxt-link> -->
                  </td>

                  <td>{{ user?.email }}</td>
                  <td>
                    {{ user?.roles?.[0]?.name }}
                    <!-- {{
                      user?.role_id == 1
                        ? "Super Admin"
                        : user?.role_id == 2
                        ? "Admin"
                        : "Technician"
                    }} -->
                  </td>
                  <td>
                    {{ user?.company?.company_name }}
                    <!-- {{
                      user?.role_id == 1
                        ? "Super Admin"
                        : user?.role_id == 2
                        ? "Admin"
                        : "Technician"
                    }} -->
                  </td>
                  <td>
                    <el-Switch class="col-md-12 col-sm-12 mb-2" :disabled="true" v-model="user.enable_2FA"  size="sm"/>
                  </td>
                  <td>
                    <div
                      class="d-flex justify-content-center tableaction-td pt-2"
                    >
                      <!-- <nuxt-link :to="`/users/profile/${user?.id}`">
                        <p tooltip="Profile" flow="up">
                          <i-las t="view" class="size-sm cp" />
                        </p>
                      </nuxt-link> -->
                      <nuxt-link :to="`/users/details/${user?.id}`">
                        <p tooltip="Edit" flow="up">
                          <i-las t="edit" class="size-sm cp" />
                        </p>
                      </nuxt-link>
                      <p tooltip="Delete" flow="up">
                        <i-las
                          t="trash"
                          class="size-sm cp"
                          @click="
                            (showConfirmation = true), (userId = user?.id)
                          "
                        />
                      </p>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <template v-if="showEffect">
            <div class="d-flex justify-content-end align-items-center my-3">
              <ShimmerEffect
                bg="dark"
                width="64px"
                height="12px"
                class="me-4"
                speed="1s"
                radius="2px"
                :stopAnimaiton="false"
              ></ShimmerEffect>
              <ShimmerEffect
                bg="dark"
                width="64px"
                height="12px"
                class="me-4"
                speed="1s"
                radius="2px"
                :stopAnimaiton="false"
              ></ShimmerEffect>
              <ShimmerEffect
                bg="dark"
                width="64px"
                height="12px"
                class="me-4"
                speed="1s"
                radius="2px"
                :stopAnimaiton="false"
              ></ShimmerEffect>
              <ShimmerEffect
                bg="dark"
                width="32px"
                height="32px"
                class="me-2"
                speed="1s"
                :stopAnimaiton="false"
              ></ShimmerEffect>
              <ShimmerEffect
                bg="dark"
                width="32px"
                height="32px"
                class="me-2"
                speed="1s"
                :stopAnimaiton="false"
              ></ShimmerEffect>
              <ShimmerEffect
                bg="dark"
                width="32px"
                height="32px"
                class="me-2"
                speed="1s"
                :stopAnimaiton="false"
              ></ShimmerEffect>
              <ShimmerEffect
                bg="dark"
                width="32px"
                height="32px"
                class="me-2"
                speed="1s"
                :stopAnimaiton="false"
              ></ShimmerEffect>
            </div>
          </template>
          <template v-else>
            <div class="d-flex justify-content-end align-items-center my-3">
              <p class="me-4">
                <strong class="text-white-50">
                  Total: {{ userStore.paginateData?.total }}

                  <span class="mx-3">|</span>
                  Page: {{ userStore.paginateData?.page_no }}
                  <span class="mx-3">|</span>
                  Showing: {{ userStore.userList?.length || 0 }}
                </strong>
              </p>
              <PaginationRentMy
                v-model="userStore.paginateData"
                @jump-now="userStore.jumpToPage"
              ></PaginationRentMy>
            </div>
          </template>
        </div>
      </div>

      <!-- Modal Start -->
      <section
        v-if="userStore.showUserModal"
        class="modal fade addnew-product-modal"
        tabindex="-1"
        aria-hidden="true"
        style="display: block; opacity: unset"
      >
        <div
          class="modal-dialog modal-dialog-centered"
          @click.stop="closeModal"
        >
          <div class="modal-content" @click.stop="false">
            <div class="modal-header">
              <h1 class="modal-title fs-5">
                {{ isEditMode ? "Edit User" : "Create User" }}
              </h1>
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
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label"
                        >First Name <span class="required">*</span></label
                      >
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <input
                          type="text"
                          placeholder="First Name"
                          class="form-control"
                          v-model="userStore.userData.first_name"
                        />
                      </template>
                    </div>
                  </div>
                  <!-- Last Name -->
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label"
                        >Last Name<span class="required">*</span></label
                      >
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <input
                          type="text"
                          placeholder="Last Name"
                          class="form-control"
                          v-model="userStore.userData.last_name"
                        />
                      </template>
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="form-label"
                        >Email <span class="required">*</span></label
                      >
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <input
                          type="email"
                          placeholder="Email"
                          class="form-control"
                          v-model="userStore.userData.email"
                        />
                      </template>
                    </div>
                  </div>
                  <!-- User Role -->
                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="form-label"
                        >User Role <span class="required">*</span></label
                      >
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <select
                          class="form-control"
                          v-model="userStore.userData.role_id"
                        >
                          <option :value="null">-Select Role-</option>
                          <template v-for="role in userStore.userRoles" :key="role.id">
                            <option
                            class="color-white"
                            :value="role.id"
                             v-if="!(role.id === 1 && useCookie('role_id').value != 1)"
                          >
                            {{ role.name }}
                          </option>
                          </template>
                         
                        </select>
                      </template>
                    </div>
                  </div>
                  <div
                    class="col-md-12"
                    v-if="
                      userStore.userData.role_id != 1 &&
                      userStore.userData.role_id != null
                    "
                  >
                    <div class="form-group">
                      <label class="form-label">Company Name</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <div class="custom-dropdown">
                          <div class="selected-company" @click="toggleDropdown">
                            {{ selectedCompanyName || "Select a Company" }}
                          </div>

                          <div v-if="dropdownOpen" class="dropdown-container">
                            <input
                              type="text"
                              v-model="searchTerm"
                              class="form-control search-input"
                              placeholder="Search company name"
                            />

                            <div class="options-list">
                              <div
                                v-if="filteredCompanies?.length == 0"
                                class="no-results"
                              >
                                No company found
                              </div>

                              <div
                                v-for="(company, idx) in filteredCompanies"
                                :key="company.id"
                                class="dropdown-item"
                                @click="selectCompany(company)"
                              >
                                {{ company.company_name }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                  

                  <!-- Start Date -->
                  <!-- <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">Start Date</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <input
                          type="date"
                          placeholder="dd/mm/yyyy"
                          class="form-control date-input"
                          v-model="userStore.userData.joining_date"
                        />
                      </template>
                    </div>
                  </div> -->

                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">Start Date</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <Picker-EmDateTimePicker
                          ref="startDatePicker"
                          v-model="startDate"
                          placeholder="Start Date"
                          @change="
                            (data) => {
                              userStore.userData.joining_date = data.startDate;
                            }
                          "
                          :options="{
                            ...globalData.datePickerOptions,
                            displayIn: 'center',
                            adjustX: 0,
                            adjustY: 0,
                          }"
                        />
                      </template>
                    </div>
                  </div>

                  <!-- Hourly Rate -->
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">Hourly Rate</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <input
                          type="number"
                          placeholder="Hourly Rate"
                          class="form-control"
                          v-model="userStore.userData.hourly_rate"
                        />
                      </template>
                    </div>
                  </div>
                  <!-- Cell # -->
               

                  <!-- Gender -->
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">Gender</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <select
                          class="form-control"
                          v-model="userStore.userData.gender"
                        >
                          <option :value="null">-Select Gender-</option>
                          <option value="1" class="color-white">Male</option>
                          <option value="2" class="color-white">Female</option>
                          <option value="3" class="color-white">Other</option>
                        </select>
                      </template>
                    </div>
                  </div>

                  <!-- Status -->
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">Status</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <select
                          class="form-control"
                          v-model="userStore.userData.status"
                        >
                          <option value="1" class="color-white">Active</option>
                          <option value="0" class="color-white">
                            Inactive
                          </option>
                        </select>
                      </template>
                    </div>
                  </div>
                  <div class="col-md-12 col-sm-12">
                      <div class="form-group">
                        <label>Phone </label>
                        <el-PhoneNumberWithFlug  labelPop="Mobile" 
                          v-model="userStore.userData.phone"
                          :countryCode="selectedCountry.code"
                          @changeCountry="(country) => {
                            selectedCountry = country
                            userStore.userData.phone_code_for_phone = country.phoneCode
                          }" />
                      </div>
                  </div>

                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="form-label"
                        >Address</label
                      >
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <el-BaseInput
                          :placeholder="addressPlaceholder"
                          v-model="userStore.userData.address"
                          :addressSearchFromGoogle="true"
                          @changeAddress="
                            (address) => {

                              if (address?.latitude && address?.longitude) {

                             
                                userStore.userData.latitude = String(
                                  address.latitude
                                );
                                userStore.userData.longitude = String(
                                  address.longitude
                                );
                                userStore.userData.city = String(address.city)
                                  ? String(address.city)
                                  : null;
                                userStore.userData.state = String(address.state)
                                  ? String(address.state)
                                  : null;
                                userStore.userData.country = String(
                                  address.country_long_name
                                )
                                  ? String(address.country_long_name)
                                  : null;
                                userStore.userData.zipcode =
                                address.zipcode !== null &&
                                address.zipcode !== undefined
                                    ? String(address.zipcode)
                                    : null;
                                H.refreshMap();

                        
                              }
                            }
                          "
                        />
                      </template>
                    </div>
                    <!-- <span
                      v-if="
                        siteStore.errors.type == 422 &&
                        siteStore.errors.message?.address?.length
                      "
                      class="text-danger pb-2 ps-2 font-weight-normal"
                    >
                      {{
                        siteStore.errors.message?.address?.length
                          ? siteStore.errors?.message?.address?.join(", ")
                          : ""
                      }}
                    </span> -->
                  </div>

                  
                

                  <!-- Company Name -->
                  <!-- <div class="col-md-12" v-if="userStore.userData.role_id != 1 && userStore.userData.role_id != null">
                    <div class="form-group">
                      <label class="form-label"
                        >Company Name <span class="required">*</span></label
                      >
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <select class="form-control" v-model="selectedCompany">
                          <option
                            v-for="(company, idx) in companyStore.companies"
                            :key="company.id"
                            :value="company.id"
                          >
                            {{ company.company_name }}
                          </option>
                        </select>
                      </template>
                    </div>
                  </div> -->

                 

                  <!-- Profile Picture -->
                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="form-label">Profile Picture</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <el-DropImages
                          v-model="profile_pic"
                          :allowMultiple="false"
                          @uploadFile="handleProfilePic"
                          :showButton="false"
                        ></el-DropImages>
                      </template>
                    </div>
                  </div>

                  <!-- Driving License -->
                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="form-label">Driving License</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <el-DropImages
                          v-model="imageLicence"
                          :allowMultiple="false"
                          @uploadFile="handleLicenceUpload"
                          :showButton="false"
                        ></el-DropImages>
                      </template>
                    </div>
                  </div>
                  <!-- Guard Card -->
                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="form-label">Guard Card</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <el-DropImages
                          v-model="imageGuardCard"
                          :allowMultiple="false"
                          @uploadFile="handleGuardCardUpload"
                          :showButton="false"
                        ></el-DropImages>
                      </template>
                    </div>
                  </div>

                  <!-- Password -->
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label"
                        >Password <span class="required">*</span></label
                      >
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <input
                          type="password"
                          placeholder="Password"
                          class="form-control"
                          v-model="userStore.userData.password"
                        />
                      </template>
                    </div>
                  </div>
                  <!-- Password -->
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label"
                        >Confirm Password <span class="required">*</span></label
                      >
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          class="form-control"
                          v-model="userStore.userData.password_confirmation"
                        />
                      </template>
                    </div>
                  </div>
                </div>
                <div class="form-group mt-3 d-flex justify-content-between">
                  <button
                    type="button"
                    class="ionic-btn ionic-border-btn cancel-btn"
                    @click="closeModal"
                  >
                    Cancel
                  </button>
                  <button
                    class="ionic-btn ionic-theme-btn2 w-20"
                    @click="handleSubmit"
                  >
                    {{ isEditMode ? "Update User" : "Create User" }}

                    <BtnLoader
                      v-if="H.isPendingAnyApi('User:createUser')"
                      color="black"
                    ></BtnLoader>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Modal End -->
    </div>

    <!-- ==================== Modal==================== -->
    <!-- ==================== Modal==================== -->
    <!-- ==================== Modal==================== -->

    <Modal-Confirm
      v-if="showConfirmation"
      v-model="showConfirmation"
      :skipAutoClose="false"
      @yes="
        async () => {
          let isDeleted = await userStore.deleteUser(userId);
          if (isDeleted) {
            showConfirmation = false;
            userId = null;
          }
        }
      "
    >
      <template v-if="showConfirmation"> Are you sure? </template>
    </Modal-Confirm>
  </div>
</template>

<script setup>
import { useUserStore } from "~/stores/User.js";
import { useCompaniesStore } from "~/stores/vms/company";
const userStore = useUserStore();
// const technicianStore.showCompanyModal = ref(false);
const isEditMode = ref(false);
const modelEffect = ref(false);
const companyStore = useCompaniesStore();
const showEffect = ref(true);
const validationError = ref("");
let imageLicence = ref(null);
let imageGuardCard = ref(null);
let profile_pic = ref(null);
let selectedCompany = ref(null);
const dropdownOpen = ref(false);
let userId = ref(null);
const addressPlaceholder = ref("Address");
let startDatePicker = ref(null);
let startDate = ref(null);
// The search term
let showConfirmation = ref(false);
const searchTerm = ref("");
// Function to toggle dropdown visibility
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};
let selectedCountry = ref(globalData.defultCountry.code)
// Computed property to filter companies based on search term
const filteredCompanies = computed(() => {
  const search = searchTerm.value.toLowerCase();
  return companyStore.companies.filter((company) =>
    company.company_name.toLowerCase().includes(search)
  );
});

// Selected company name
let companyId = ref(null);
const selectedCompanyName = computed(() => {
  companyId.value = null;
  const selected = companyStore.companies.find(
    (c) => c.id === selectedCompany.value
  );
  companyId.value = selected ? selected.id : null;
  return selected ? selected.company_name : null;
});



// Function to select a company
const selectCompany = (company) => {
  selectedCompany.value = company.id;
  searchTerm.value = ""; // Clear search input after selection
  dropdownOpen.value = false; // Close dropdown after selection
};
definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
onMounted(async () => {
  await userStore.getUserList();
  await companyStore.getCompanyList();

  if (companyStore.companies?.length > 0) {
    selectedCompany.value = companyStore.companies[0].id;
  }
  modelEffect.value = false;
  showEffect.value = false;
  userStore.getUserRole();
});

const resetSearch = async () => {
  showEffect.value = true;
  userStore.userSearched.email = null;
  userStore.userSearched.name = null;
  userStore.userSearched.role_id = null;
  userStore.userSearched.company_id = null;
  await userStore.getUserList();
  showEffect.value = false;
};

const showData = async (id) => {
  resetForm();
  //   await userStore.getUserDetails(id);
  isEditMode.value = true;
  userStore.showUserModal = true;
};

const openCreateModal = async () => {
  resetForm();
  userStore.showUserModal = true;
};

const closeModal = () => {
  resetForm();
  userStore.showUserModal = false;
};

const handleLicenceUpload = () => {
  userStore.userData.driving_license = imageLicence.value[0];

  // userStore.userData.profile_pic = image.value[0];
};
const handleGuardCardUpload = () => {
  userStore.userData.guard_card = imageGuardCard.value[0];
};

const handleProfilePic = () => {
  userStore.userData.profile_img = profile_pic.value[0];
};

const handleSubmit = () => {
  if (userStore.userData.role_id == 1) {
    userStore.userData.company_id = null;
  } else {
    userStore.userData.company_id = companyId.value;
  }

  if (!userStore.userData.first_name) {
    Toaster.error("Please enter your first name");
    return;
  }

  if (!userStore.userData.last_name) {
    Toaster.error("Please enter your last name");
    return;
  }

  if (!userStore.userData.email) {
    Toaster.error("Please enter your email");
    return;
  }
  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!emailPattern.test(userStore.userData.email)) {
    Toaster.error("Invalid email format.");
    return;
  }

  // if(!userStore.userData.phone){
  //   Toaster.error("Please Enter your Phone number.");
  //   return;
  // }

  // if (!userStore.userData.address) {
  //   Toaster.error("Please enter your address");
  //   return;
  // }



  if (!userStore.userData.role_id) {
    Toaster.error("Please select a role");
    return;
  }

  if (!userStore.userData.password) {
    Toaster.error("Please enter your password");
    return;
  }

  if (!userStore.userData.password_confirmation) {
    Toaster.error("Please confirm your password");
    return;
  }



  if (
    userStore.userData.password?.length < 6 ||
    userStore.userData.password_confirmation?.length < 6
  ) {
    Toaster.error("Passwords must be at least 6 characters long");
    return;
  }

  if (userStore.userData.password != userStore.userData.password_confirmation) {
    Toaster.error("The passwords entered do not match.");
    return;
  }

  // validationError.value = "";

  if (isEditMode.value) {
    userStore.updateUser(userStore.userData.id, userStore.userData);
  } else {
    userStore.createUser(userStore.userData);
  }

  // closeModal();
};

const handleDelete = async (id) => {
  await userStore.deleteUser(id);
};
const handleFilters = async () => {
  // await userStore.getUserSearchedList(
  //   userStore.userSearched.name,
  //   userStore.userSearched.email,
  //   userStore.userSearched.role_id,
  //   userStore.userSearched.company_id
  // );
     userStore.paginate =  { page: 1, per_page: 20 }
     useNuxtApp().$emit('reset_pagination', 1)
    await userStore.getUserSearchedList({...userStore.userSearched});
};

const resetForm = async () => {
  userStore.userData = {
    id: null,
    profile_pic: null,
    first_name: null,
    last_name: null,
    email: null,
    phone: null,
    joining_date: null,
    hourly_rate: null,
    gender: null,
    role_id: null,
    password: null,
    password_confirmation: null,
    // isworking: null,
    status: 1,
    driving_license: null,
    guard_card: null,
    profile_img: null,

    latitude: null,
    longitude: null,
    address: "",
    city: null,
    state: null,
    country: null,
    zipcode: null,
  };
  profile_pic.value = null;
  imageGuardCard.value = null;
  imageLicence.value = null;
  startDate.value = null;
};
</script>

<style scoped>
/* Add your styles here */
.btn-primary {
  background-color: #188653;
}
.alert {
  margin-top: 20px;
}
.required {
  color: red;
}
.date-input {
  color: white; /* Change text color to white */
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(1); /* Inverts the color of the calendar icon */
}
.color-white {
  color: white;
}

.custom-dropdown {
  /* position: relative; */
  width: 100%;
  /* border: 1px solid #ced4da;
  border-radius: 0.25rem; */
}

.search-input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #1be409;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
}

.options-list {
  max-height: 200px; /* Add a scrollable height for options */
  overflow-y: auto;
  background: rgb(0, 0, 0);
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #050505;
}

.no-results {
  padding: 10px;
  color: #888;
}

.custom-dropdown {
  position: relative;
}

.selected-company {
  display: flex;
  align-items: center;
  background-color: #1d1d1d;
  height: 48px;
  border: 1px solid #1d1d1d;
  cursor: pointer;
  border-radius: 15px;
  padding-left: 20px;
}
.selected-company:hover,
.selected-company:active,
.selected-company:focus {
  border: 1px solid #37c923;
}

.dropdown-container {
  position: absolute;
  width: 100%;
  background-color: #1d1d1d;
  border: 1px solid #000000;
  /* max-height: 200px; */
  /* overflow-y: auto; */
  z-index: 1000;
  border-radius: 15px;
  padding: 15px;
}

.search-input {
  margin-bottom: 10px;
  border: 1px solid #37c923;
  border-radius: 12px;
  background-color: #2c3030;
}

.options-list {
  max-height: 155px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #3b3b3b;
}

.no-results {
  padding: 10px;
  text-align: center;
  color: #6c757d;
}
.options-list {
  background: #1d1d1d;
}
</style>
