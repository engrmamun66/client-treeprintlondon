<template>
  <div>
    <section class="login-register" v-if="$route.query.token && verifyToken">
      <div class="login-shape-top">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="110"
          height="200"
          viewBox="0 0 110 200"
          fill="none"
        >
          <path
            d="M110 90C110 150.751 60.7513 200 0 200C-60.7513 200 -110 150.751 -110 90C-110 29.2487 -60.7513 -20 0 -20C60.7513 -20 110 29.2487 110 90Z"
            fill="#61626F"
            fill-opacity="0.08"
          />
        </svg>
      </div>
      <div class="login-shape-bottom-left"></div>
      <div class="login-shape-bottom-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="220"
          height="110"
          viewBox="0 0 220 110"
          fill="none"
        >
          <path
            d="M220 110C220 170.751 170.751 220 110 220C49.2487 220 0 170.751 0 110C0 49.2487 49.2487 0 110 0C170.751 0 220 49.2487 220 110Z"
            fill="#61626F"
            fill-opacity="0.08"
          />
        </svg>
      </div>
      <div class="login-register-overley">
        <div class="container-fluid fullheight-100">
          <Teleport to="body">
            <Toaster></Toaster>
          </Teleport>
          <div
            class="row align-items-center justify-content-center fullheight-100"
          >
            <div class="col-lg-6 auth-leftside">
              <div class="text-center">
                <img src="/img/landscape.png" class="img-fluid login-logo" />
              </div>
              <h4>Fast, Efficient and Easy Electricity</h4>
              <span
                >We let you choose how much electricity you<br />
                need, when you need it</span
              >
            </div>
            <div class="col-lg-6 auth-rightside">
              <div class="login-container">
                <div class="login-container-body">
                  <div class="login-heading mb-5"></div>
                  <div class="login-subheading"></div>
                  <div class="login-form">
                    <form @submit.prevent="submitLoginForm">
                      <div class="position-relative mb-3">
                        <input
                          v-model="userData.password"
                          :type="showPassword ? 'text' : 'password'"
                          class="form-control"
                          placeholder="New Password"
                          @keyup.enter="submitLoginForm"
                          autocomplete="off"
                        />
                        <i
                          class="las la-eye eye-icon color"
                          @click="togglePasswordVisibility(1)"
                          :class="{
                            'la-eye-slash': !showPassword,
                            'la-eye': showPassword,
                          }"
                        ></i>
                      </div>

                      <div class="position-relative mb-3">
                        <input
                          v-model="userData.password_confirmation"
                          :type="showConfirmPassword ? 'text' : 'password'"
                          class="form-control"
                          placeholder="Confirm Password"
                          @keyup.enter="submitLoginForm"
                          autocomplete="off"
                        />
                        <i
                          class="las la-eye eye-icon color"
                          @click="togglePasswordVisibility(2)"
                          :class="{
                            'la-eye-slash': !showConfirmPassword,
                            'la-eye': showConfirmPassword,
                          }"
                        ></i>
                      </div>
                      <span
                        v-if="
                          error.type === 422 && error.message?.password?.length
                        "
                        class="text-danger pt-3 ps-2 font-weight-normal"
                      >
                        {{
                          error.message?.password?.length
                            ? error.message.password.join(", ")
                            : ""
                        }}
                      </span>

                      <div
                        class="form-group mt-4 mb-0 d-flex justify-content-end align-items-center"
                      >
                        <button
                          type="submit"
                          class="ionic-btn ionic-theme-btn2 ionic-btnlg ms-0"
                        >
                          Submit
                          <BtnLoader
                            v-if="H.isPendingAnyApi('User:accountActivateByCredential')"
                            :show="true"
                            color="black"
                          />
                        </button>

                        <button
                          type="button"
                          @click="cancel"
                          class="ionic-btn ionic-cancel-btn ionic-btnlg"
                        >
                          Cancel
                        </button>
                      </div>

                      <!-- <div class="form-group mt-4 mb-0">
                        <button type="submit" class="btn sub-btn">
                          Submit
                          <BtnLoader
                            v-if="H.isPendingAnyApi('Auth:passwordReset')"
                            :show="true"
                            color="black"
                          />
                        </button>
                      </div> -->
                      <p v-if="successMessage" class="text-success mt-3">
                        {{ successMessage }}
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Preloader v-else />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/Auth";
import { useUserStore } from "~/stores/User.js";
const userStore = useUserStore();
const { passwordReset } = useAuthStore();
const authStore = useAuthStore();
const { loading, error, passConfirm } = storeToRefs(authStore);
const route = useRoute();
const userData = ref({
  email: "",
  token: "",
  password: "",
  password_confirmation: "",
});
const successMessage = ref(""); // Success message variable
const showPassword = ref(false);
const showConfirmPassword = ref(false);
definePageMeta({ layout: "auth" });
useHead({
  titleTemplate: "%s | Login",
});
let verifyToken = ref(false);
onMounted(async () => {
  userData.value.email = route.query.email || "";
  userData.value.token = route.query.token || "";
  let payload = ref({
    email: route.query.email,
    token: route.query.token,
  });
  if (payload.value.email == null || payload.value.token == null) {
    verifyToken.value = false
    Toaster.error("The account activation link is not valid");
    setTimeout(() => {
      reloadNuxtApp({ path: "/login" });
    }, 2000);
  }else{
    verifyToken.value = await userStore.verifyAccountActivationToken(payload.value);
  }

});

function togglePasswordVisibility(id) {
  if (id == 1) {
    showPassword.value = !showPassword.value;
  } else {
    showConfirmPassword.value = !showConfirmPassword.value;
  }
}
let navigateToLogin = ref(false);
function cancel() {
  navigateToLogin.value = true;
  error.value = { type: 401, message: { email: [], password: [] } };
  navigateTo("/login");

}
// Prevent navigation if the form is submitting
onBeforeRouteLeave((to, from, next) => {
  if (navigateToLogin.value) {
    next(); // Allow navigation at any cost
  } else if (passConfirm.value) {
    next(false); // Block navigation
  } else {
    next(); // Allow navigation
  }
});

async function submitLoginForm() {
  if (validateForm()) {
    await userStore.accountActivateByCredential(userData.value)
    // await passwordReset(userData.value);
    // successMessage.value = "Password reset successfully!"; // Set success message
  }
}

function validateForm() {
  error.value.message = { password: [] };
  error.value.type = 422;

  if (!userData.value.password) {
    error.value.message.password.push("New password is required");
    return false;
  } else if (userData.value.password.length < 6) {
    error.value.message.password.push(
      "New password must be at least 6 characters"
    );
    return false;
  }

  if (!userData.value.password_confirmation) {
    error.value.message.password.push("Confirm password is required");
    return false;
  } else if (userData.value.password_confirmation !== userData.value.password) {
    error.value.message.password.push(
      "New password and confirm password do not match"
    );
    return false;
  }

  return true;
}
</script>

<style scoped>
/* Add your styles here */
.color {
  color: white;
}
</style>
