<template>
    <div>
      <div class="row">
        <div class="col-md-12">
          <div class="ionic-card">
            <div class="ionic-card-body">
                <div class="text-center" v-if="authStore.qrCodeUrl">
                    <QRCodeVue :value="authStore.qrCodeUrl" :size="200" />
                    <h3 class="mt-3">Scan the QR code with your Google Authenticator app</h3>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import QRCodeVue from 'qrcode.vue';
  import { useAuthStore } from '~/stores/Auth'
  const authStore = useAuthStore()
  onMounted(()=>{
    authStore.qrCodeUrl  = useRoute().query.qr_code_url
  })
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  