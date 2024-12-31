<template> 
  <div>
    <section class="login-register" v-if="!$route.query.token">
      <div class="login-shape-top">
        <svg xmlns="http://www.w3.org/2000/svg" width="110" height="200" viewBox="0 0 110 200" fill="none">
          <path d="M110 90C110 150.751 60.7513 200 0 200C-60.7513 200 -110 150.751 -110 90C-110 29.2487 -60.7513 -20 0 -20C60.7513 -20 110 29.2487 110 90Z" fill="#61626F" fill-opacity="0.08"/>
        </svg>
      </div>
      <div class="login-shape-bottom-left"></div>
      <div class="login-shape-bottom-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="220" height="110" viewBox="0 0 220 110" fill="none">
          <path d="M220 110C220 170.751 170.751 220 110 220C49.2487 220 0 170.751 0 110C0 49.2487 49.2487 0 110 0C170.751 0 220 49.2487 220 110Z" fill="#61626F" fill-opacity="0.08"/>
        </svg>
      </div>
      <div class="login-register-overley">
        <div class="container-fluid fullheight-100">
          <Teleport to="body">
            <Toaster></Toaster>
          </Teleport>
          <div class="row align-items-center justify-content-center fullheight-100">
            <div class="col-lg-6 auth-leftside">
              <div class="text-center">
                <img src="/img/landscape.png" class="img-fluid login-logo" />
              </div>
              <h4>Fast, Efficient and Easy Electricity</h4>
              <span>We let you choose how much electricity you<br> need, when you need it</span>
            </div>
            <div class="col-lg-6 auth-rightside">
              <div class="login-container">
                <div class="login-container-body">
                  <div class="login-heading">Sign In</div>
                  <div class="login-subheading">Welcome Back!</div>
                  <div class="login-form">
                    <form @submit.prevent="submitLoginForm">
                      <div class="form-group">
                        <input
                          v-model="userData.email"
                          type="text"
                          class="form-control"
                          placeholder="User Name / Email"
                          @keyup.enter="submitLoginForm"
                        />
                        <span v-if="error.type === 422 && error.message?.email?.length" class="text-danger pt-3 ps-2 font-weight-normal">
                          {{ error.message?.email?.length ? error.message.email.join(", ") : "" }}
                        </span>
                      </div>
                      <div class="form-group">
                        <input
                          v-model="userData.password"
                          type="password"
                          class="form-control"
                          placeholder="Password"
                          @keyup.enter="submitLoginForm"
                        />
                        <span v-if="error.type === 422 && error.message?.password?.length" class="text-danger pt-3 ps-2 font-weight-normal">
                          {{ error.message?.password?.length ? error.message.password.join(", ") : "" }}
                        </span>
                      </div>
                 
                      <div>
                        <div class="form-group mt-4 mb-0">
                          <button type="submit" class="btn sub-btn">
                           Sign In                          
                            <BtnLoader class="ms-2" :show="authStore.loading" :color="'white'" />
                          </button>
                      </div>
                      <div class="d-flex mt-2">
                        <nuxt-link to="/forgot-password" class="forgot-password-link">Forgot Password?</nuxt-link>
                      </div>
                    </div>

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
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/Auth'


const { login } = useAuthStore()
const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)

const userData = ref({ email: "", password: "" })
definePageMeta({ layout: "auth", middleware: ['login'] })
useHead({
  titleTemplate: '%s | Login',
})

async function submitLoginForm() {
  if (validateForm()) {
    await login(userData.value)
    // console.log('Token call')
  }
}

function validateForm() {
  // Clear previous errors
  error.value.message = { email: [], password: [] }
  error.value.type = 422

  // Basic frontend validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (userData.value.email === '') {
    error.value.message.email.push('Email is required')
    return false
  } else if (!emailPattern.test(userData.value.email)) {
    error.value.message.email.push("Invalid Email")
    return false
  }

  if (!userData.value.password) {
    error.value.message.password.push("Password is required")
    return false
  } else if (userData.value.password.length < 6) {
    error.value.message.password.push("Password must be at least 6 characters")
    return false
  }
  return true
}


onMounted(()=>{
  let options = authMethods.logoutIfExpireToken();  
  let is2FAverified = authMethods.is2FAverified()
  if(!options && is2FAverified){
     return navigateTo({path: '/inventory'})
  }
})


</script>

<style scoped>
.forgot-password-link {
  font-size: 14px;
  color: #37c923;
  text-decoration: none;
  margin-left: auto; /* Aligns the link to the right */
}

.forgot-password-link:hover {
  text-decoration: underline;
}


</style>
