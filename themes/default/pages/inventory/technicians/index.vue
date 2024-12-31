<template>
  <div class="ionic-card">
    <div
      class="ionic-card-header card-header-border d-flex justify-content-between align-items-center"
    >
      <h4 class="fs-18">Technicians</h4>
      <div class="card-header-rightside">
        <button
          @click="openCreateModal"
          class="ionic-btn ionic-theme-btn2 addnew-product-btn"
        >
          <i class="las la-plus"></i> Technician
        </button>
      </div>
    </div>

    <div class="ionic-card-body">
      <div class="table-responsive">
        <table class="table table-borderless">
          <thead>
            <tr>
              <th>Image</th>
              <th>Full Name</th>
              <th>Device</th>
              <th>Hourly Rate</th>
              <th>Status</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr class="empty-tr">
              <td colspan="7"></td>
            </tr>
            <template v-if="showEffect">
              <tr
                v-for="(x, index) in technicianStore?.technicianList?.length"
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
              <tr
                v-for="(technician, index) in technicianStore.technicianList"
                :key="index"
              >
                <td>
                  <img
                    :src="technician?.profile_pic_url"
                    alt="Technician Image"
                    class="img-fluid"
                    width="50px"
                    height="50px"
                  />
                </td>
                <td>{{ technician?.first_name + technician?.last_name }}</td>
                <td>{{ technician?.device }}</td>
                <td>{{ technician?.hourly_rate }}</td>

                <td>
                  <span
                    :class="
                      technician?.status == 1 ? 'text-success' : 'text-danger'
                    "
                  >
                    {{ technician?.status == 1 ? "Active" : "Inactive" }}
                  </span>
                </td>
                <td>
                  <div
                    class="d-flex justify-content-center tableaction-td pt-2"
                  >
                    <!-- <nuxt-link
                      :to="`companies/${technician.id}/camera-wall/gallery`"
                    >
                      <p tooltip="Site with cameras" flow="up">
                        <i-las t="file" class="size-sm cp" />
                      </p>
                    </nuxt-link> -->
                    <p tooltip="Edit" flow="up">
                      <i-las
                        t="edit"
                        class="size-sm cp"

                      />
                    </p>
                    <p tooltip="Delete" flow="up">
                      <i-las
                        t="trash"
                        class="size-sm cp"
                        @click="handleDelete(technician?.id)"
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
                Total: {{ technicianStore.paginateData?.data?.total }}
                <span class="mx-3">|</span>
                Page: {{ technicianStore.paginateData?.data?.page_no }}
                <span class="mx-3">|</span>
                Showing: {{ technicianStore.companies?.length || 0 }}
              </strong>
            </p>
            <PaginationRentMy
              v-model="technicianStore.paginateData"
              @jump-now="technicianStore.jumpToPage"
            ></PaginationRentMy>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal Start -->
    <section
      v-if="technicianStore.showTechnicianModal"
      class="modal fade addnew-product-modal"
      tabindex="-1"
      style="display: block; opacity: unset"
    >
      <div class="modal-dialog modal-dialog-centered" @click.stop="closeModal">
        <div class="modal-content" @click.stop="false">
          <div class="modal-header">
            <h1 class="modal-title fs-5">
              {{ isEditMode ? "Edit Technician" : "Create Technician" }}
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
                <!-- First Name -->
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
                        v-model="technicianStore.technicianData.first_name"
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
                        v-model="technicianStore.technicianData.last_name"
                      />
                    </template>
                  </div>
                </div>
                <!-- Employee # -->
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">Employee #</label>
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <input
                        type="text"
                        placeholder="Employee #"
                        class="form-control"
                        v-model="technicianStore.technicianData.employee_data"
                      />
                    </template>
                  </div>
                </div>
                <!-- GPS # -->
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">GPS #</label>
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <input
                        type="text"
                        placeholder="GPS #"
                        class="form-control"
                        v-model="technicianStore.technicianData.gps_number"
                      />
                    </template>
                  </div>
                </div>
                <!-- Email -->
                <div class="col-md-6">
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
                        v-model="technicianStore.technicianData.email"
                      />
                    </template>
                  </div>
                </div>
                <!-- Cell # -->
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label"
                      >Cell # <span class="required">*</span></label
                    >
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <input
                        type="text"
                        placeholder="Cell #"
                        class="form-control"
                        v-model="technicianStore.technicianData.phone"
                      />
                    </template>
                  </div>
                </div>
                <!-- Whatsapp -->
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">Whatsapp</label>
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <input
                        type="text"
                        placeholder="Whatsapp"
                        class="form-control"
                        v-model="technicianStore.technicianData.whatsapp_number"
                      />
                    </template>
                  </div>
                </div>
                <!-- Start Date -->
                <div class="col-md-6">
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
                        v-model="technicianStore.technicianData.joining_date"
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
                        v-model="technicianStore.technicianData.hourly_rate"
                      />
                    </template>
                  </div>
                </div>
                <!-- Job Type -->
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">Job Type</label>
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <select
                        class="form-control"
                        v-model="technicianStore.technicianData.job_type"
                      >
                        <option value="1">Full Time</option>
                        <option value="2">Part Time</option>
                      </select>
                    </template>
                  </div>
                </div>
                <!-- Batch No -->
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">Batch No</label>
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <input
                        type="text"
                        placeholder="Batch No"
                        class="form-control"
                        v-model="technicianStore.technicianData.batch_no"
                      />
                    </template>
                  </div>
                </div>
                <!-- Address -->
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label"
                      >Address<span class="required">*</span></label
                    >
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <input
                        type="text"
                        placeholder="Address"
                        class="form-control"
                        v-model="technicianStore.technicianData.address"
                      />
                    </template>
                  </div>
                </div>
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
                        v-model="technicianStore.technicianData.gender"
                      >
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                        <option value="3">Other</option>
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
                        v-model="technicianStore.technicianData.status"
                      >
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </template>
                  </div>
                </div>

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
                <!-- Username -->
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label"
                      >Username <span class="required">*</span></label
                    >
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <input
                        type="text"
                        placeholder="Username"
                        class="form-control"
                        v-model="technicianStore.technicianData.username"
                      />
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
                        v-model="technicianStore.technicianData.password"
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
                        v-model="
                          technicianStore.technicianData.password_confirmation
                        "
                      />
                    </template>
                  </div>
                </div>
                <!-- Notes -->
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label">Notes</label>
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <textarea
                        placeholder="Notes"
                        class="form-control"
                        v-model="technicianStore.technicianData.notes"
                      ></textarea>
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
                  {{ isEditMode ? "Update Technician" : "Create Technician" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Modal End -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useTechnicianStore } from "~/stores/Technician";

const technicianStore = useTechnicianStore();
// const technicianStore.showCompanyModal = ref(false);
const isEditMode = ref(false);
const modelEffect = ref(false);
const showEffect = ref(true);
const validationError = ref("");
let imageLicence = ref(null);
let imageGuardCard = ref(null);
let profile_pic = ref(null);

onMounted(async () => {
  await technicianStore.getTechnicianList();
  modelEffect.value = false;
  showEffect.value = false;
});

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

// const showData = async (id) => {
//   await resetForm();
//   await technicianStore.getTechnicianDetails(id);
//   isEditMode.value = true;
//   technicianStore.showTechnicianModal = true;
// };

const openCreateModal = async () => {
  resetForm();
  technicianStore.showTechnicianModal = true;
};

const closeModal = () => {
  resetForm();
  technicianStore.showTechnicianModal = false;
};

const handleLicenceUpload = () => {
  technicianStore.technicianData.licence = imageLicence.value[0];
  console.log(imageLicence.value[0]);
  // technicianStore.technicianData.profile_pic = image.value[0];
};
const handleGuardCardUpload = () => {
  technicianStore.technicianData.card = imageGuardCard.value[0];
  console.log(imageGuardCard.value[0]);
};

const handleProfilePic = () => {
  technicianStore.technicianData.profile_pic = profile_pic.value[0];
  console.log(profile_pic.value[0]);
};

const handleSubmit = () => {
  if (
    !technicianStore.technicianData.first_name ||
    !technicianStore.technicianData.phone ||
    !technicianStore.technicianData.email ||
    !technicianStore.technicianData.username ||
    !technicianStore.technicianData.password ||
    !technicianStore.technicianData.password_confirmation ||
    !technicianStore.technicianData.last_name ||
    !technicianStore.technicianData.address
  ) {
    Toaster.error("Please Fill all the required fileds");
    return;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(technicianStore.technicianData.email)) {
    Toaster.error("Invalid email format.");
    return;
  }

  if (
    technicianStore.technicianData.password !=
    technicianStore.technicianData.password_confirmation
  ) {
    Toaster.error("The passwords entered do not match.");
    return;
  }

  // validationError.value = "";
  if (isEditMode.value) {
    technicianStore.updateTechnician(
      technicianStore.technicianData.id,
      technicianStore.technicianData
    );
  } else {
    technicianStore.createTechnician(technicianStore.technicianData);
  }

  // closeModal();
};

const handleDelete = async (id) => {
  console.log(id);
  await technicianStore.deleteTechnician(id);
};

const resetForm = async () => {
  technicianStore.technicianData = {
    id: null,
    profile_pic: null,
    first_name: null,
    last_name: null,
    employee_data: null,
    gps_number: null,
    email: null,
    phone: null,
    whatsapp_number: null,
    joining_date: null,
    hourly_rate: null,
    job_type: null,
    batch_no: null,
    address: null,
    gender: null,
    driving_license: null,
    guard_card: null,
    username: null,
    password: null,
    password_confirmation: null,
    notes: null,
    // isworking: null,
    // status: 1,
  };

  imageGuardCard.value = null;
  imageLicence.value = null;
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
</style>
