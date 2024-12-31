
<template>
  <div class="ionic-card">
    <div class="ionic-card-header card-header-border d-flex justify-content-between align-items-center">
      <h4 class="fs-18">Technicians</h4>
      <div class="card-header-rightside">
        <button @click="openCreateModal" class="ionic-btn ionic-theme-btn2 addnew-product-btn">
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
              <th>Is working</th>
              <th>Status</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr class="empty-tr">
              <td colspan="7"></td>
            </tr>
            <template v-if="showEffect">
              <tr v-for="(x, index) in technicianStore?.companies?.length" :key="index">
                <td><ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect></td>
                <td><ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect></td>
                <td><ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect></td>
                <td><ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect></td>
                <td><ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect></td>
                <td><ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect></td>
                <td><ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect></td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="(company, index) in technicianStore.companies" :key="index">
                <td><img :src="company?.profile_pic" alt="Technician Image" class="img-fluid" width="50px" height="50px" /></td>
                <td>{{ company?.user?.name }}</td>
                <td>{{ company?.device }}</td>
                <td>{{ company?.hourly_rate }}</td>
                <td>{{ company?.is_working ? 'Yes' : 'No' }}</td>
                <td>
                  <span :class="company?.status == 1 ? 'text-success' : 'text-danger'">
                    {{ company?.status == 1 ? "Active" : "Inactive" }}
                  </span>
                </td>
                <td>
                  <div class="d-flex justify-content-center tableaction-td pt-2">
                    <nuxt-link :to="`companies/${company.id}/camera-wall/gallery`">
                      <p tooltip="Site with cameras" flow="up">
                        <i-las t="file" class="size-sm cp" />
                      </p>
                    </nuxt-link>
                    <p tooltip="Edit" flow="up">
                      <i-las t="edit" class="size-sm cp" @click="showData(company.id)" />
                    </p>
                    <p tooltip="Delete" flow="up">
                      <i-las t="trash" class="size-sm cp" @click="handleDelete(company.id)" />
                    </p>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <template v-if="showEffect">
          <div class="d-flex justify-content-end align-items-center my-3">
            <ShimmerEffect bg="dark" width="64px" height="12px" class="me-4" speed="1s" radius="2px" :stopAnimaiton="false"></ShimmerEffect>
            <ShimmerEffect bg="dark" width="64px" height="12px" class="me-4" speed="1s" radius="2px" :stopAnimaiton="false"></ShimmerEffect>
            <ShimmerEffect bg="dark" width="64px" height="12px" class="me-4" speed="1s" radius="2px" :stopAnimaiton="false"></ShimmerEffect>
            <ShimmerEffect bg="dark" width="32px" height="32px" class="me-2" speed="1s" :stopAnimaiton="false"></ShimmerEffect>
            <ShimmerEffect bg="dark" width="32px" height="32px" class="me-2" speed="1s" :stopAnimaiton="false"></ShimmerEffect>
            <ShimmerEffect bg="dark" width="32px" height="32px" class="me-2" speed="1s" :stopAnimaiton="false"></ShimmerEffect>
            <ShimmerEffect bg="dark" width="32px" height="32px" class="me-2" speed="1s" :stopAnimaiton="false"></ShimmerEffect>
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
            <PaginationRentMy v-model="technicianStore.paginateData" @jump-now="technicianStore.jumpToPage"></PaginationRentMy>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal Start -->
    <section v-if="technicianStore.showTechnicianModal" class="modal fade addnew-product-modal" tabindex="-1" style="display: block; opacity: unset">
      <div class="modal-dialog modal-dialog-centered" @click.stop="closeModal">
        <div class="modal-content" @click.stop="false">
          <div class="modal-header">
            <h1 class="modal-title fs-5">
              {{ isEditMode ? "Edit Technician" : "Create  Technician" }}
            </h1>
            <button @click.stop="closeModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
              <i class="la la-close"></i>
            </button>
          </div>
          <div class="modal-body" @click.stop="false">
            <div class="modal-body-inner ionic-form-area">
              <div class="row">
                <!-- Full Name -->
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label">Full Name <span class="required">*</span></label>
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <input type="text" placeholder="Full Name" class="form-control" v-model="technicianStore.technicianData.company_name" />
                    </template>
                  </div>
                </div>
                <!-- Logo -->
                <div class="col-md-12">
                  <div class="form-group">
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <div class="ionic-img-upload-area">
                        <el-DropImages v-model="image" :allowMultiple="false" @uploadFile="handleLogoUpload" :showButton="false"></el-DropImages>
                      </div>
                      <div v-if="technicianStore.technicianData.profile_pic && !image" class="ionic-img-uploadshow">
                        <ul>
                          <li>
                            <img :src="technicianStore.technicianData.profile_pic" class="img-fluid" alt="img uploadshow img" width="50px" height="50px" />
                          </li>
                        </ul>
                      </div>
                    </template>
                  </div>
                </div>
                <!-- Device -->
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label">Device<span class="required">*</span></label>
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <input type="text" placeholder="Device" class="form-control" v-model="technicianStore.technicianData.device" />
                    </template>
                  </div>
                </div>
                <!-- Hourly Rate -->
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label">Hourly Rate<span class="required">*</span></label>
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <input type="text" placeholder="Hourly Rate" class="form-control" v-model="technicianStore.technicianData.hourly_rate" />
                    </template>
                  </div>
                </div>
                <!-- Is Working -->
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label">Is Working<span class="required">*</span></label>
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <select class="form-control" v-model="technicianStore.technicianData.is_working">
                        <option :value="true">Yes</option>
                        <option :value="false">No</option>
                      </select>
                    </template>
                  </div>
                </div>
                <!-- Status -->
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label">Status<span class="required">*</span></label>
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <select class="form-control" v-model="technicianStore.technicianData.status">
                        <option :value="1">Active</option>
                        <option :value="0">Inactive</option>
                      </select>
                    </template>
                  </div>
                </div>
              </div>
              <div class="form-group mt-3">
                <button class="ionic-btn ionic-theme-btn2 w-100" @click="submitForm">
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
let image = ref(null);

onMounted(async () => {
  await technicianStore.getTechnicianList();
  modelEffect.value = false;
  showEffect.value = false;
  technicianStore.technicianData.password = 12345678;
  technicianStore.technicianData.password_confirmation = 12345678;
});

const showData = async (id) => {
  await resetForm();
  await technicianStore.getTechnicianDetails(id);
  isEditMode.value = true;
  technicianStore.showTechnicianModal = true;
};

const openCreateModal = async () => {
  await resetForm();
  technicianStore.showTechnicianModal = true;
};

const closeModal = () => {
  technicianStore.showTechnicianModal = false;
};

const handleLogoUpload = () => {
  technicianStore.technicianData.profile_pic = image.value[0];
};

const handleSubmit = () => {
  if (isEditMode.value) {
    if (
      !technicianStore.technicianData.email ||
      !technicianStore.technicianData.contact_no ||
      !technicianStore.technicianData.address
    ) {
      validationError.value = "";
      Toaster.error("All fields must be filled out.");
      return;
    }
    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(technicianStore.technicianData.email)) {
      validationError.value = "Invalid email format.";
      Toaster.error("Invalid email format.");
      return;
    }
  } else {
    if (
      !technicianStore.technicianData.company_name ||
      !technicianStore.technicianData.email ||
      !technicianStore.technicianData.contact_no ||
      !technicianStore.technicianData.address ||
      !technicianStore.technicianData.first_name ||
      !technicianStore.technicianData.last_name ||
      !technicianStore.technicianData.password
    ) {
      validationError.value = "";
      Toaster.error("All fields must be filled out.");
      return;
    }
    if (technicianStore.technicianData.password.length < 6) {
      Toaster.error("Password length should be greater than 6");
      return;
    }
    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(technicianStore.technicianData.email)) {
      validationError.value = "Invalid email format.";
      Toaster.error("Invalid email format.");
      return;
    }
    if (
      technicianStore.technicianData.password !=
      technicianStore.technicianData.password_confirmation
    ) {
      Toaster.error("Passwords mismatch");
      return;
    }
  }

  // console.log(technicianStore.showCompanyModal);
  // if(technicianStore.showCompanyModal){
  //   console.log(technicianStore.showCompanyModal)
  //   return
  // }

  validationError.value = "";
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

const resetForm = async () => {
  technicianStore.technicianData.profile_pic = null;
  technicianStore.technicianData.status = 1;
  technicianStore.technicianData.first_name = "";
  technicianStore.technicianData.last_name = "";
  technicianStore.technicianData.contact_no = "";
  technicianStore.technicianData.address = "";
  technicianStore.technicianData.email = "";
  technicianStore.technicianData.password = "";
  technicianStore.technicianData.password_confirmation = "";
  technicianStore.technicianData.id = null;
  image.value = null;
  isEditMode.value = false;
};

const handleDelete = async (id) => {
  await technicianStore.deleteCompany(id);
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
</style>
