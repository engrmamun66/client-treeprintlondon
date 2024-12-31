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
                    <h3 class="my-2">Open your Google Authenticator app & verify your code</h3>
                    <div class="login-form">
                      <form @submit.prevent="submitLoginForm">
                        <div class="form-group">
                          <input
                            v-model="code"
                            type="text"
                            class="form-control"
                            placeholder="Enter the code"
                            @keyup.enter="submitLoginForm"
                          />

                        </div>
                        <div>
                          <div class="form-group mt-4 mb-0">
                            <button type="button" class="btn sub-btn" @click="submitVerificationForm">
                             Verify                         
                              <BtnLoader class="ms-2" :show="authStore.loading" :color="'white'" />
                            </button>
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
  import QRCodeVue from 'qrcode.vue';
  import { useAuthStore } from '~/stores/Auth'
  const { verify2FAcode } = useAuthStore()
  const authStore = useAuthStore()
  
  let code = ref(null)
  definePageMeta({ layout: "auth" })
  useHead({
    titleTemplate: '%s | Login',
  })
  onMounted(()=>{
    authStore.qrCodeUrl  = useRoute().query.qr_code_url
  })
  async function submitVerificationForm() {
    authStore.loading = true
    if(validateForm()) {
      await verify2FAcode({code: code.value})
    }
  }
  
  function validateForm() {
    if (!code.value) {
      Toaster.error("Verification code is required")
      authStore.loading = false
      return false
    } 
    
    return true
  }
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
  