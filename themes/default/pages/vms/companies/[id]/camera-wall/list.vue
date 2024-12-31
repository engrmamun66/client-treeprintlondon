<template>
    <div class="row">
        <div class="col-md-6">
            <div class="ionic-card">
                <div class="ionic-card-body">
                    <div class="siteguard-coverage-tab scrollbar">
                        <section v-for="(site, index) in galleryStore.cameraStatus?.site" :key="index">
                            <div class="site-card">
                                <div class="site-card-leftstide">
                                    <div class="card-header">
                                        <div>
                                            <span class="card-title">{{ site.title }}</span>
                                        </div>
                                        <div>
                                            <button class="active-status"><span class="active-status-btn"></span>
                                                Active</button>
                                        </div>
                                    </div>
                                    <div class="card-location"><span>{{ site.address }}</span>
                                    </div>
                                    <div class="site-info">
                                        <div class="kpi-card-box">
                                            <div class="kpi-card-box-inner">
                                                <h4>Total Camera</h4>
                                                <p class="count">{{ site.total_camera || 0 }}</p>
                                            </div>
                                        </div>
                                        <div class="kpi-card-box">
                                            <div class="kpi-card-box-inner">
                                                <h4>Online</h4>
                                                <p class="count">{{ site.total_online_camera || 0 }}</p>
                                            </div>
                                        </div>
                                        <div class="kpi-card-box">
                                            <div class="kpi-card-box-inner">
                                                <h4>Offline</h4>
                                                <p class="count">{{ site.total_offline_camera || 0 }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-header-rightside">
                                    <div class="camera-list-videobox">
                                        <div class="camera-box">
                                            <img src="/img/empty_img_small.jpg" class="img-fluid" alt="camera img" />
                                            <div class="camera-playicon">
                                                <i class="las la-play-circle"></i>
                                            </div>
                                            <div class="camera-bottom bottom-center">
                                                <h5 class="fs-12">09:00</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="ionice-camera-guards">
                                    <button type="button" class="ionic-btn ionic-border-btn ms-0">
                                        Guards
                                        <i class="las la-angle-double-down ms-3"></i>
                                    </button>
                                    <div class="ionic-camera-guards-body">
                                        <div class="ionic-guards-infolist">
                                            <div class="ionic-guards-infoitem">
                                                <h5 class="fs-18">Jhone Smith</h5>
                                                <span>09:00</span>
                                            </div>
                                            <div class="ionic-guards-infoitem">
                                                <h5 class="fs-10"><i class='bx bxs-circle circle-green'></i>Jhone Smith
                                                </h5>
                                                <span>09:00</span>
                                            </div>
                                            <div class="ionic-guards-infoitem">
                                                <h5 class="fs-10"><i class='bx bxs-circle circle-red'></i>Jhone Smith
                                                </h5>
                                                <span>09:00</span>
                                            </div>
                                            <div class="ionic-guards-infoitem">
                                                <h5 class="fs-10"><i class='bx bxs-circle circle-green'></i>Jhone Smith
                                                </h5>
                                                <span>09:00</span>
                                            </div>
                                            <div class="ionic-guards-infoitem">
                                                <h5 class="fs-10"><i class='bx bxs-circle circle-red'></i>Jhone Smith
                                                </h5>
                                                <span>09:00</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="row">
                <div class="col-md-3">
                    <div class="ionic-card ionic-card-textnumber">
                        <div class="ionic-card-body">
                            <span>Total Camera Online</span>
                            <h3>{{ galleryStore.cameraStatus?.company?.total_online_camera }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="ionic-card ionic-card-textnumber">
                        <div class="ionic-card-body">
                            <span>Total Camera Offline</span>
                            <h3>{{ galleryStore.cameraStatus?.company?.total_offline_camera }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="ionic-card ionic-card-textnumber">
                        <div class="ionic-card-body">
                            <span>Total Alert</span>
                            <h3>0</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="ionic-card ionic-card-textnumber">
                        <div class="ionic-card-body">
                            <span>Total Sites</span>
                            <h3>{{ galleryStore.cameraStatus?.company?.total_sites }}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ionic-card">
                <div class="invoice-map">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6511980.1304290565!2d-124.59210174550276!3d37.16036014148867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia%2C%20USA!5e0!3m2!1sen!2sbd!4v1718972991655!5m2!1sen!2sbd"
                        style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    <div class="invoice-mapmore-menu">
                        <a href="#"><i class="las la-ellipsis-v"></i></a>
                        <div class="invoice-mapmore-menubody">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useGalleryStore } from '~/stores/vms/gallery';
import { useCompaniesStore } from "~/stores/vms/company";
const galleryStore = useGalleryStore();
const companyStore = useCompaniesStore();
definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
onMounted(() => {
    galleryStore.getGallery();
    galleryStore.getCameraStatus();
    
    // Access the current route
    const route = useRoute();
    // Regular expression to match the pattern
    const cameraWallGalleryPattern = /^\/vms\/companies\/\d+\/camera-wall\/gallery$/
    const cameraWallListPattern = /^\/vms\/companies\/\d+\/camera-wall\/list$/
    if(cameraWallGalleryPattern.test(route.fullPath)){
        companyStore.isCameraWallGalleryPattern = true
    }
    if(cameraWallListPattern.test(route.fullPath)){
        companyStore.isCameraWallListPattern = true
    }
});
onBeforeUnmount(()=>{
  companyStore.isCameraWallGalleryPattern = false
  companyStore.isCameraWallListPattern = false
})




</script>