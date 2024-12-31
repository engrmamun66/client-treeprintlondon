<template>
  <div>
    <div class="row">
      <div class="col-md-3 col-12 manage-users-leftside">
        <div class="ionic-card activesite-guardprofile-card">
          <div class="ionic-card-body">
            <div class="activesite-profile">
              <div class="profile-img-info">
                <div class="manage-userprofile-img">
                  <img
                    :src="
                      userStore.userDetailsData.profile_pic_url
                        ? userStore.userDetailsData.profile_pic_url
                        : 'https://s3.us-west-2.amazonaws.com/storage-dev.inspectdeploy.io/media/users/1717052490.png'
                    "
                    class="align-self-end"
                    alt=""
                  />
                </div>
                <div class="manage-userprofile-info">
                  <h5 class="fs-16">{{ userStore.userDetailsData.name }}</h5>
                  <p>{{ userStore.userDetailsData.email }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-center" v-if="isAdmin">
          <button
            type="button"
            class="ionic-btn ionic-theme-btn2 ionic-submit-btn2 io ms-0"
            @click="activateAccountEmail"
          >
            Resend Account Activation Email
            <BtnLoader
              v-if="H.isPendingAnyApi('User:accountActivateEmail')"
              color="black"
            ></BtnLoader>
          </button>
        </div>
      </div>
      <div class="col-md-9 manage-users-rightside">
        <div class="ionic-card">
          <div class="ionic-card-body">
            <div class="userprofile-tab-link">
              <img class="img-fluid" />
              <ul class="d-flex justify-content-start">
                <li>
                  <a
                    href="#"
                    @click="tabchange(1)"
                    :class="{ 'text-color': profile, heading: !profile }"
                  >
                    <strong>Profile Overview</strong>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    @click="tabchange(2)"
                    :class="{ 'text-color': avatar, heading: !avatar }"
                  >
                    <strong>Change Avatar</strong>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    @click="tabchange(3)"
                    :class="{ 'text-color': password, heading: !password }"
                  >
                    <strong>Reset Password</strong>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    @click="tabchange(4)"
                    :class="{ 'text-color': twoFA, heading: !twoFA }"
                  >
                    <strong>2FA</strong>
                  </a>
                </li>
              </ul>
            </div>
            <div class="userprofile-tab-body">
              <!-- Profile overview area -->
              <div class="userprofile-tab-content" :hidden="!profile">
                <div class="row">
                  <div class="col-xl-8 col-lg-12 col-md-12">
                    <div class="row">
                      <div class="col-md-6 col-sm-12">
                        <div class="form-group">
                          <label>First Name</label>
                          <span>
                            <span class="text-danger ps-1">*</span>
                          </span>
                          <input
                            v-model="userStore.userDetailsData.first_name"
                            class="form-control"
                            autocomplete="on"
                            placeholder=""
                            type="text"
                          />
                        </div>
                      </div>
                      <div class="col-md-6 col-sm-12">
                        <div class="form-group">
                          <label>Last Name</label>
                          <input
                            v-model="userStore.userDetailsData.last_name"
                            class="form-control"
                            autocomplete="on"
                            placeholder=""
                            type="text"
                          />
                        </div>
                      </div>
                      <div class="col-md-12 col-sm-12">
                        <div class="form-group">
                          <label>Email</label>
                          <span>
                            <span class="text-danger ps-1">*</span>
                          </span>
                          <input
                            v-model="userStore.userDetailsData.email"
                            class="form-control"
                            autocomplete="on"
                            placeholder=""
                            type="email"
                          />
                        </div>
                      </div>
                      <div class="col-md-12 col-sm-12">
                        <div class="form-group">
                          <label>Phone </label>
                          <el-PhoneNumberWithFlug
                            labelPop="Mobile"
                            v-model="userStore.userDetailsData.phone"
                            :countryCode="selectedCountry?.code"
                            @changeCountry="
                              (country) => {
                                selectedCountry = country;
                                userStore.userDetailsData.phone_code_for_phone =
                                  country.phoneCode;
                              }
                            "
                            autocomplete="off"
                          />
                        </div>
                      </div>
                      <div class="col-md-12 col-sm-12">
                        <div class="form-group">
                          <label class="">User Role</label>
                          <span>
                            <span class="text-danger ps-1">*</span>
                          </span>
                          <div class="select-optionbox">
                            <select
                              class="form-control"
                              v-model="userStore.userDetailsData.role_id"
                            >
                              <template
                                v-for="role in userStore.userRoles"
                                :key="role.id"
                              >
                                <option
                                  class="color-white"
                                  :value="role.id"
                                  v-if="
                                    !(
                                      role.id === 1 &&
                                      useCookie('role_id').value != 1
                                    )
                                  "
                                >
                                  {{ role.name }}
                                </option>
                              </template>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="mb-3" v-if="isAdmin">
                        <div class="d-flex">
                          <p class="mt-1">Account Activated?</p>
                          <el-Switch
                            style="scale: 0.8"
                            size="sm"
                            @change="
                              activateAccount(userStore.userDetailsData.id)
                            "
                            class="col-md-2 col-2"
                            yes="Yes"
                            no="No"
                            v-model="activated"
                          />
                        </div>
                      </div>

                      <div class="d-flex">
                        <button
                          type="button"
                          class="ionic-btn ionic-theme-btn2 ionic-submit-btn2 io ms-0"
                          @click="handleSubmit"
                        >
                          Submit
                          <BtnLoader
                            v-if="H.isPendingAnyApi('User:updateUser')"
                            color="black"
                          ></BtnLoader>
                        </button>
                        <nuxt-link :to="'/users'">
                          <button
                            type="button"
                            class="ionic-btn ionic-cancel-btn leap-cancel-btn me-2"
                          >
                            Cancel
                          </button>
                        </nuxt-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Change avatar area -->
              <div class="userprofile-tab-content" :hidden="!avatar">
                <div class="row">
                  <div class="col-md-6 col-sm-12">
                    <label for="formFileLg" class="form-label"
                      >User Image</label
                    >
                    <div class="form-group input-preview">
                      <input
                        type="file"
                        id="file_34ffdcd"
                        accept="image/png, image/jpeg"
                        @change="avatarChange"
                      />
                      <span class="close">
                        <i class="las la-times text-white"></i>
                      </span>
                      <img
                        class=""
                        :src="
                          filePreview
                            ? filePreview
                            : userStore.userDetailsData.profile_pic_url
                            ? userStore.userDetailsData.profile_pic_url
                            : 'https://s3.us-west-2.amazonaws.com/storage-dev.inspectdeploy.io/media/users/1717052490.png'
                        "
                      />
                      <div>
                        <div
                          class="d-flex justify-content-between w-100 position-relative mt-2"
                        >
                          <span class="filename"></span>
                          <span>
                            <p class="highlight"></p>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex ml-2">
                    <button
                      type="button"
                      class="ionic-btn ionic-theme-btn2 ms-0"
                      @click="handleSubmit"
                    >
                      Submit
                      <BtnLoader
                        v-if="H.isPendingAnyApi('User:updateUser')"
                        color="black"
                      ></BtnLoader>
                    </button>
                    <nuxt-link :to="'/users'">
                      <button
                        type="button"
                        class="ionic-btn ionic-cancel-btn leap-cancel-btn me-2"
                      >
                        Cancel
                      </button>
                    </nuxt-link>
                  </div>
                </div>
              </div>
              <!-- Change password area -->
              <div class="userprofile-tab-content" :hidden="!password">
                <div class="row">
                  <div class="col-md-8 col-12">
                    <div class="form-group">
                      <label>New Password</label>
                      <span>
                        <span class="text-danger ps-1">*</span>
                      </span>
                      <div class="position-relative">
                        <input
                          class="form-control"
                          autocomplete="off"
                          v-model="userStore.userDetailsData.password"
                          placeholder="Password"
                          :type="showPassword ? 'text' : 'password'"
                        />
                        <i
                          class="las la-eye eye-icon"
                          @click="togglePasswordVisibility(1)"
                          :class="{
                            'la-eye-slash': !showPassword,
                            'la-eye': showPassword,
                          }"
                        ></i>
                      </div>
                      <div
                        class="d-flex justify-content-start align-items-center mt-1"
                      >
                        <span class="strength-level me-2"></span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-8 col-12">
                    <div class="form-group">
                      <label>Confirm Password</label>
                      <span>
                        <span class="text-danger ps-1">*</span>
                      </span>
                      <div class="position-relative">
                        <input
                          class="form-control"
                          v-model="
                            userStore.userDetailsData.password_confirmation
                          "
                          autocomplete="off"
                          placeholder="Confirm Password"
                          :type="showConfirmPassword ? 'text' : 'password'"
                        />

                        <i
                          class="las la-eye eye-icon"
                          @click="togglePasswordVisibility(2)"
                          :class="{
                            'la-eye-slash': !showConfirmPassword,
                            'la-eye': showConfirmPassword,
                          }"
                        ></i>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex ml-2">
                    <button
                      type="button"
                      class="ionic-btn ionic-theme-btn2 ms-0"
                      @click="handlePassWordSubmit"
                    >
                      Submit
                      <BtnLoader
                        v-if="H.isPendingAnyApi('User:updateUserPassword')"
                        color="black"
                      ></BtnLoader>
                    </button>
                    <nuxt-link :to="'/users'">
                      <button
                        type="button"
                        class="ionic-btn ionic-cancel-btn leap-cancel-btn me-2"
                      >
                        Cancel
                      </button>
                    </nuxt-link>
                  </div>
                </div>
              </div>
              <!-- Change password area -->
              <div class="userprofile-tab-content" :hidden="!twoFA">
                <div class="row">
                  <el-Switch
                    class="col-md-12 col-sm-12 mb-2"
                    @change="toggle2FA"
                    v-model="userStore.userDetailsData.enable_2FA"
                    label="Enable 2FA ?"
                    size="md"
                  />
                  <div class="text-center" v-if="authStore.qrCodeUrl">
                    <QRCodeVue :value="authStore.qrCodeUrl" :size="200" />
                    <h3 class="mt-3">
                      Scan the QR code with your Google Authenticator app
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <Modal-Confirm v-if="show2FAdisableConfirmation" v-model="show2FAdisableConfirmation" :skipAutoClose="false" @yes="async () => {
          let isDeleted =  await authStore.disable2FA();
          if (isDeleted) {
              show2FAdisableConfirmation = false;
          }
      }">
          <template v-if="show2FAdisableConfirmation"> Are you sure? </template>
    </Modal-Confirm> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import QRCodeVue from "qrcode.vue";
import { useUserStore } from "~/stores/User.js";
import { useAuthStore } from "~/stores/Auth";
let route = useRoute();
const userId = route.params.id;
const userStore = useUserStore();
const authStore = useAuthStore();
const profile = ref(true);
const avatar = ref(false);
const password = ref(false);
const twoFA = ref(false);
const changeImage = ref(null);
const filePreview = ref("");
const fileName = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const show2FAdisableConfirmation = ref(false);
let activated = ref(0);
const userData = ref({ email: "" });
let isAdmin = ref(false);
async function activateAccountEmail() {
  userData.value.email = userStore.userDetailsData.email;
  await userStore.accountActivateEmail(userData.value);
}
function activateAccount(id) {
  let payload = ref({
    status: activated.value,
  });
  userStore.accountActivate(id, payload.value);
}
let selectedCountry = ref(globalData.defultCountry.code);
definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

onMounted(async () => {
  await userStore.getUserDetails(userId);
  activated.value = userStore.userDetailsData.status;
  isAdmin.value = useCookie("role_id").value == 1 ? true : false;

  if (userStore.userDetailsData.enable_2FA) {
    await authStore.get2FaQrCodeUrl({ user_id: useRoute().params?.id });
  }
  if (userStore.userDetailsData.phone_code_for_phone) {
    const filteredCountry = globalData.countries.find(
      (item) =>
        item.phoneCode === userStore.userDetailsData.phone_code_for_phone
    );
    selectedCountry.value = filteredCountry || null;
  }

  let filteredCountry = globalData.countries.filter((item) => {
    if (item.phoneCode == userStore.userDetailsData.phone_code_for_phone) {
      return item;
    }
  });
  selectedCountry.value = filteredCountry[0];

  userStore.getUserRole();
  userStore.userDetailsData.password = null;
  userStore.userDetailsData.password_confirmation = null;
});

function avatarChange(event) {
  // console.log(event.target.files[0])
  const file = event.target.files[0];
  userStore.userDetailsData.profile_img = file;
  if (file) {
    fileName.value = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      filePreview.value = e.target.result;
      console.log(filePreview.value);
    };
    reader.readAsDataURL(file);
  }
}

function tabchange(tab) {
  if (tab === 1) {
    profile.value = true;
    avatar.value = false;
    password.value = false;
    twoFA.value = false;
    userStore.userDetailsData.password = null;
    userStore.userDetailsData.password_confirmation = null;
  } else if (tab === 2) {
    profile.value = false;
    avatar.value = true;
    password.value = false;
    twoFA.value = false;
    userStore.userDetailsData.password = null;
    userStore.userDetailsData.password_confirmation = null;
  } else if (tab === 3) {
    profile.value = false;
    avatar.value = false;
    password.value = true;
  } else if (tab === 4) {
    profile.value = false;
    avatar.value = false;
    password.value = false;
    twoFA.value = true;
  }
}

function isEmpty(value) {
  return !value || (typeof value === "string" && value.trim() === "");
}

function handleSubmit() {
  if (isEmpty(userStore.userDetailsData.first_name)) {
    Toaster.error("First Name is required");
    return;
  }

  if (isEmpty(userStore.userDetailsData.email)) {
    Toaster.error("Email is required");
    return;
  }

  // if (isEmpty(userStore.userDetailsData.phone)) {
  //   Toaster.error('Phone Number is required');
  //   return;
  // }

  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!emailPattern.test(userStore.userDetailsData.email)) {
    Toaster.error("Invalid email format.");
    return;
  }

  if (isEmpty(userStore.userDetailsData.role_id)) {
    Toaster.error("Role is required");
    return;
  }
  userStore.updateUser(userId, userStore.userDetailsData);
}
function handlePassWordSubmit() {
  if (!userStore.userDetailsData.password) {
    Toaster.error("Password is required");
    return;
  }
  if (
    userStore.userDetailsData.password.length < 6 ||
    userStore.userDetailsData.password_confirmation.length < 6
  ) {
    Toaster.error("Passwords must be at least 6 characters long");
    return;
  }
  if (!userStore.userDetailsData.password_confirmation) {
    Toaster.error("Password Confirmation is required");
    return;
  }
  if (
    userStore.userDetailsData.password !=
    userStore.userDetailsData.password_confirmation
  ) {
    Toaster.error("Passwords mismatch");
    return;
  }

  const formData = ref({
    password: null,
    password_confirmation: null,
  });
  formData.value.password = userStore.userDetailsData.password;
  formData.value.password_confirmation =
    userStore.userDetailsData.password_confirmation;

  userStore.updateUserPassword(userId, formData.value);
}

function togglePasswordVisibility(id) {
  if (id == 1) {
    showPassword.value = !showPassword.value;
  } else {
    showConfirmPassword.value = !showConfirmPassword.value;
  }
}
async function toggle2FA() {
  if (!userStore.userDetailsData.enable_2FA) {
    await authStore.disable2FA({ user_id: useRoute().params?.id });
    //  show2FAdisableConfirmation.value = true
  } else {
    authStore.enable2FA({ user_id: useRoute().params?.id });
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
