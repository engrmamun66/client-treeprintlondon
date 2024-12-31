<template>
    <div>
        <Breadcrumb title="Camera Timeline" :links="['cameras', 'cameraTimeline']"></Breadcrumb>
        <div class="ionic-admin-subheader">
            <div class="ionic-admin-subheader-inner">
                <div class="ionic-subheader-rightside">
                    <h3 class="fs-16">{{ galleryStore?.cameraDetails?.name}}</h3>
                </div>
                <div class="ionic-subheader-rightside timeline-subheader-rightside">
                    <div class="expand-timeline-search d-flex align-items-center"> 
                        <button
                        :tooltip="isCollapsedIframe ? 'Collapse' : 'Expand'"
                            class="ionic-btn ionic-theme-btn2 timeline-expand-btn me-2 "
                            @click="isCollapsedIframe = !isCollapsedIframe"
                            ><i :class="isCollapsedIframe  ? 'lni lni-chevron-left' : 'lni lni-chevron-right'"></i> Clips
                        </button>
                        <div class="date-box">
                            <div class="time-period">
                                <Picker-EmDateTimePicker ref="startDatePicker"
                                v-model="startDate"
                                @change="
                                    async (data) => {
                                        if(H.formatDate(startDate.startDate, 'MM-DD-YYYY HH:mm') <= H.formatDate(new Date(),  'MM-DD-YYYY HH:mm') ){
                                            isHistoryMode = true 
                                            await getClipList(data)
                                            await loadVideoStream(null, useRoute().params.id, moment(H.formatDate(startDate.startDate, 'MM-DD-YYYY HH:mm')).add(6, 'hours').format('YYYY-MM-DDTHH:mm:ss') )
                                        }else{
                                            Toaster.error('Your selected date is greater than current date')
                                            galleryStore.videoClips = []
                                        }
                                    
                                    }
                                "
                                :options="{...globalData.datePickerOptions, displayIn: 'bottom_left', adjustX: 0, adjustY: 12}"
                                />
                            </div>
                            <button @click.stop="$refs.startDatePicker.toggle()" type="button" class="ionic-btn">
                                <i class="la la-calendar"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="timelapes-clips-btn d-flex justify-content-between"> 
                        
                        
                        <button @click="toggleIframeMode()"
                            class="ionic-btn ionic-theme-btn2 historylivestream-btn"
                            >
                            <!-- <i class="bx bx-transfer-alt size-2 mt-1"></i> -->
                             {{ isHistoryMode ? 'Live stream' : 'History mode' }}
                        </button> 
                        <button
                            @click="openTimelapseCreateModal"
                            class="ionic-btn ionic-theme-btn2"
                            >
                            <i class="las la-plus"> </i> Timelapse
                        </button> 
                                          
                        <!-- <button 
                            type="button" 
                            @click="openClipsSaveModal()" 
                            class="ionic-btn ionic-theme-btn2">
                            <i class="la la-plus"></i>Clips
                        </button> -->
                        <button 
                            type="button" 
                            @click="openClipsDownloadModal()" 
                            class="ionic-btn ionic-theme-btn2">
                            <i class="la la-plus"></i>Clips
                        </button>
                        <!-- <button
                            @click="openAudioModal"
                            class="ionic-btn ionic-theme-btn2 ionic-btnlg addnew-product-btn"
                        >
                            <i class="las la-microphone"></i> Audio
                        </button> -->
                    </div>

                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xl-4 col-lg-5 col-md-6 camera-videoclips-column" v-if="isCollapsedIframe">
                <div class="ionic-tab">
                   
                    <ul>
                        <!-- <li>
                            <a class="tab-active">
                                Alert
                            </a>
                        </li>
                        <li class="tab-devided"></li> -->
                        <li>
                            <a class="">
                                Clips
                            </a>
                        </li>
                        <!-- <li class="tab-devided"></li>
                        <li>
                            <a class="">
                                Guards
                            </a>
                        </li> -->
                    </ul>
                </div>

                <div class="ionic-card ionic-tab-card" >
                    <div class="ionic-card-body">
                        <template v-if="shimmerEffect"> 
                            <div class="work-order-card ionic-db-card">
                            <div class="ionic-db-card-left">
                                <ShimmerEffect
                                bg="light"
                                width="180px"
                                height="22px"
                                class="mb-2"
                                radius="10px"
                                ></ShimmerEffect>
                                <ShimmerEffect
                                bg="light"
                                width="80px"
                                height="16px"
                                class="mb-3"
                                radius="10px"
                                ></ShimmerEffect>
                                <ShimmerEffect
                                bg="light"
                                width="90px"
                                height="36px"
                                radius="30px"
                                ></ShimmerEffect>
                            </div>
                            <div class="ionic-db-card-right">
                                <div class="ionic-db-card-right-inner">
                                <ShimmerEffect
                                    bg="light"
                                    width="80px"
                                    height="16px"
                                    class="mb-3"
                                    radius="10px"
                                ></ShimmerEffect>
                                <ShimmerEffect
                                    bg="light"
                                    width="90px"
                                    height="36px"
                                    radius="30px"
                                    class="mb-2"
                                ></ShimmerEffect>
                                <ShimmerEffect
                                    bg="light"
                                    width="80px"
                                    height="16px"
                                    class="mb-3"
                                    radius="10px"
                                ></ShimmerEffect>
                                </div>
                            </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="siteguard-coverage-tab scrollbar">
                                <template v-if="galleryStore.videoClips?.length > 0">
                                    <template v-for="(clip, index) in galleryStore.videoClips " :key=index>
                                        <div>
                                            <div class="site-card site-timeline-card" :class="selectedParentClip?.id == clip?.id ? 'camera-box-active' : ''">
                                                <div class="site-card-leftstide">
                                                    <div class="site-info timeline-siteinfo">
                                                        <div class="kpi-card-box">
                                                            <div class="kpi-card-box-inner">
                                                                <h4>Date</h4>
                                                                <p class="count">{{ convertToCameraTimezone(clip.start_timestamp, 'MM-DD-YYYY') }}</p>
                                                            </div>
                                                        </div>
                                                        <div class="kpi-card-box">
                                                            <div class="kpi-card-box-inner">
                                                                <h4>Start time</h4>
                                                                <p class="count">{{ convertToCameraTimezone(clip.start_timestamp, 'hh:mm a') }}</p>
                                                            </div>
                                                        </div>
                                                        <div class="kpi-card-box">
                                                            <div class="kpi-card-box-inner">
                                                                <h4>End time</h4>
                                                                <p class="count">{{ convertToCameraTimezone(clip.end_timestamp, 'hh:mm a') }}</p>
                                                            </div>
                                                        </div>
                                                        <div class="kpi-card-box">
                                                            <div class="kpi-card-box-inner">
                                                                <h4>Expires</h4>
                                                                <p class="count">{{ convertToCameraTimezone(clip.expire_time, 'MM-DD-YYYY hh:mm a') }}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="site-card-rightside" >
                                                    <!-- <div class="camera-list-videobox" v-if="galleryStore?.videoClipDetails?.length">
                                                        <video width="320" height="240" autoplay>
                                                        <source :src="false" type="video/mp4">
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    </div> -->
                                                    <div class="camera-list-videobox">
                                                        <!-- <div class="camera-box timeline-clip-box cp" @click="openClipDetailsModal(clip, loadFirstVideo=true)"> -->
                                                        <div class="camera-box timeline-clip-box cp"  @click="isHistoryMode=true; loadVideoStream(clip, clip.camera_id, clip.start_timestamp);">
                                                            <img :class="clip.status != 1 ? 'blurred-image' : ''" :src="clip.preview_image?.image_small_path_url ? clip.preview_image?.image_small_path_url : '/img/empty_img_small.jpg'" class="img-fluid" alt="camera img"/>
                                                                <template v-if="isCallingApi && selectedParentClip?.id == clip?.id">
                                                                    <div class="camera-playicon">
                                                                        <BtnLoader :show="true" color="#e8b100" size="16px" y="0px" ></BtnLoader>
                                                                    </div>
                                                                </template>
                                                                <template v-else>
                                                                   
                                                                    <div v-if="clip.status != 1" class="camera-playicon"> 
                                                                        <btn-loader size="sm" :show="streamLoader" color="green"></btn-loader>
                                                                    </div>
                                                                    <div v-else class="camera-playicon">
                                                                        <i class="las la-play-circle"></i>
                                                                    </div>
                                                                </template>
                                                            <!-- <div class="camera-bottom bottom-center">
                                                                <div class="camera-bottom-right">
                                                                    <i class="bx bx-error error-icon"></i>
                                                                    <i class="las la-clout-alt"></i>
                                                                </div>
                                                            </div> -->
                                                        </div>
                                                        <div>
                                                           
                                                            <button v-if="clip.status == 1"  @click="downloadsClipsAsZip(clip)" class="mt-2 ionic-btn-block status-active cp">Download<btn-loader size="14px" style="height: 14px; width: 14px" :show="isDownloading && downloadingClipId == clip.id" color="white"></btn-loader></button>
                                                            <!-- <button v-if="clip.status == 1"  @click="galleryStore.downLoadExportedClip(clip.id)" class="mt-2 ionic-btn-block status-active cp">Download</button> -->
                                                            <button v-else class="mt-2 ionic-btn-block status-active cp">Processing</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="ionice-camera-guards collaps-camera-guards">
                                                <button type="button" class="ionic-btn ionic-border-btn ms-0"  @click="isCollapsedIframe = !isCollapsedIframe">
                                                    Collapse
                                                    <i class="las la-angle-double-up ms-3"></i>
                                                </button>
                                            </div> 
                                            <!-- <div> 
                                                <div @click="openClipDetailsModal(clip)" class="checkoutbox-btn-column text-center m-4 d-flex justify-content-between">
                                                    <button  class="ionic-btn ionic-theme-btn2 viewpreviewactivity-btn">Load more clips <BtnLoader v-if="isCallingButtonApi && selectedParentClip?.id == clip?.id" style="margin-top:5px;" :show="true" color="black" size="16px" y="0px" ></BtnLoader><i v-else class="las la-arrow-right ms-1"></i></button>
                                                </div>
                                            </div> -->
                                        </div>
                                    </template>
                                    <div class="align-items-center my-3">
                                        
                                        <PaginationRentMy
                                        v-model="galleryStore.clipsPaginateData"
                                        @jump-now="jumpToClipsPage"
                                        ></PaginationRentMy>
                                        <div class="m-4"> 
                                            <p class="ms-4">
                                        <strong class="text-white-50">
                                            Total: {{ galleryStore.clipsPaginateData?.total }}
                                            <span class="mx-3">|</span>
                                            Page: {{ galleryStore.clipsPaginateData?.current_page }}
                                            <span class="mx-3">|</span>
                                            Showing: {{ galleryStore.videoClips?.length || 0 }}
                                        </strong>
                                        </p>
                                        </div>                 
                                    </div>
                                </template>
                                <template v-else>
                                        <div class="text-center m-3"><h6 class="m-3">No clips found</h6></div>
                                </template>
                                
                            </div>
                        </template>
                        
                    </div>
                </div>
            </div>
            <div :class="isCollapsedIframe ? 'col-xl-8 col-lg-7 col-md-6 collaps-fream-column' : 'col-xl-12 col-lg-12 col-md-12 collaps-fream-column video-collapsfull-view' ">
                <div class="ionic-card" style="background-color: #2f3644 !important;">
                <!-- <div class="ionic-card"> -->
                    <div class="ionic-card-body">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="camera-box iframe-box" style="background-color: #2f3644 !important;" v-if="siteStore.siteCamerasLiveFeed?.camera_een_id && showIframe">
                                    <iframe v-show="showIframe && iframeSrc" ref="iframeWrapper" class="camera-iframe" 
                                        id="test-iframe" 
                                        height="500" 
                                        width="1000" 
                                        title="History Browser" 
                                        :src="iframeSrc"
                                        scrolling="no"
                                    ></iframe>
                                    <i v-if="isHistoryMode" class="las la-arrows-alt size-sm cp"  style="position:absolute; bottom:20px; left:150px; z-index:99999" @click="toggleFullscreen()"></i>
                                    <!-- <button class="ionic-btn ionic-theme-btn" style="position:absolute; top:10px; left:10px; z-index:99999" @click="toggleFullscreen()">click</button> -->
                                </div>
                                <div v-else class="camera-box camera-large-box mb-4">
                                    <img v-if="cameraStore?.liveSnapShot" :src="cameraStore.liveSnapShot" class="img-fluid timeline-video-box-img" alt="camera img"/>
                                    <!-- <div class="camera-playicon">
                                        <i class="las la-play-circle"></i>
                                    </div> -->
                                    <div class="camera-bottom bottom-between">
                                        <h5 class="fs-12">{{ galleryStore?.cameraDetails?.name }}</h5>
                                        <div class="camera-bottom-right">
                                            <i class="bx bx-wifi wifi-icon"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <div class="ionic-card">
                    <div class="ionic-card-header card-header-border">
                        <h4 class="fs-22">Timeline</h4>
                        <div class="ionic-card-rightside">
                            <div class="ionic-tab">
                                <ul class="ionic-tab">
                                    <li>
                                        <a class="tab-active">Daily</a>
                                    </li>
                                    <li class="tab-devided"></li>
                                    <li>
                                        <a class="">Weekly</a>
                                    </li>
                                    <li class="tab-devided"></li>
                                    <li>
                                        <a class="">Monthly</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="ionic-card-body">
                        <h4 class="fs-20">Timeline Chart</h4>
                    </div>
                </div> -->
            </div>
        </div>
           <!-- Modal Component -->
        <section
        v-if="showClipsSaveModal"
        class="modal fade addnew-product-modal"
        tabindex="-1"
       
        style="display: block; opacity: unset"
        >
        <div class="modal-dialog modal-dialog-centered" @click.stop="closeModal">
            <div class="modal-content" @click.stop="false">
            <div class="modal-header">
                <h1 class="modal-title fs-5">Add clips</h1>
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
                    <div class="mb-3">
                        <label class="form-label">Date</label>
                        <div class="time-period">
                            <Picker-EmDateTimePicker
                              v-model="date"
                              @change="
                                (data) => {
                                //   $refs.startDatePicker.setDate(data.startDate)
                                  getClipList(data)
                                }
                              "
                              :nextIcon="false"
                              :options="{...globalData.datePickerOptions, displayIn: 'bottom_left', adjustX: 0, adjustY: 12}"
                            />
                        </div>
                    </div>
                    <!-- Company Name -->
                    <div class="row justify-content-between">
                        <div class="col-md-6">
                            <div class="ionic-form-area">
                                <div class="row">
                                    <label class="form-label">Start time</label>
                                    <div class="col-md-12">
                                    <div class="form-group">
                                        <div class="time-box">
                                            <div class="time-box-input">
                                                <Picker-EmDateTimePicker
                                                v-model="startTime"
                                                @change="
                                                    (data) => {
                                                        startTime = data;
                                                    }
                                                "
                                                :options="{...timePickerOptions, displayIn: 'bottom_left', documentation: false, adjustX: -150, adjustY: -18}"
                                                />
                                            </div>
                                            <button type="button" class="ionic-btn">
                                                <i class="la la-clock"></i>
                                            </button>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="ionic-form-area">
                                <div class="row">
                                    <label class="form-label">End time</label>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <div class="time-box">
                                            <div class="time-box-input">
                                                <Picker-EmDateTimePicker
                                                v-model="endTime"
                                                @change="
                                                    (data) => {
                                                    endTime = data;
                                                    }
                                                "
                                                :options="{...timePickerOptions, displayIn: 'bottom_left', documentation: false, adjustX: -150, adjustY: -18}"
                                                />
                                            </div>
                                            <button type="button" class="ionic-btn">
                                                <i class="la la-clock"></i>
                                            </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <div class="modal-footer justify-content-between ps-0 pe-0">
                <template v-if="modelEffect">
                <ShimmerEffect
                    bg="dark"
                    height="52px"
                    width="140px"
                    radius="20px"
                ></ShimmerEffect>
                <ShimmerEffect
                    bg="dark"
                    height="52px"
                    width="140px"
                    radius="20px"
                ></ShimmerEffect>
                </template>
                <template v-else>
                <button
                    type="button"
                    class="ionic-btn ionic-border-btn cancel-btn"
                    @click="closeModal"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    class="ionic-btn ionic-theme-btn2 save-btn"
                    @click="saveClips()"
                >
                    Save
                </button>
                </template>
            </div>
            </div>
        </div>
        </section>
        <section
        v-if="showClipsDownloadModal"
        class="modal fade addnew-product-modal"
        tabindex="-1"
       
        style="display: block; opacity: unset"
        >
            <div class="modal-dialog modal-dialog-centered" @click.stop="closeClipsDownloadModal()">
                <div class="modal-content" @click.stop="false">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Add clips</h1>
                    <button
                    @click.stop="closeClipsDownloadModal()"
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
                            <label class="form-label mb-2">Start :</label>
                            <div class="time-period">
                                <Picker-EmDateTimePicker
                                v-model="startDateTime"
                                ref="startDateTimePicker"
                                @change="
                                    (data) => {
                                        endDateTime.startDate = data.startDate
                                        endDateTimePicker.setDate(data.startDate)
                                    }
                                "
                                :maxDate="new Date"
                                :options="{...globalData.datePickerOptions,  timePicker: true, displayIn: 'modal', adjustX: 0, adjustY: 12}"
                                />
                            </div>
                        </div>
                        <div class="col-md-6">
                                <div class="ionic-form-area">
                                    <div class="row">
                                        <label class="form-label">Stop:</label>
                                        <div class="col-md-12">
                                        <div class="form-group">
                                            <div class="time-box">
                                                <div class="time-box-input">
                                                    <Picker-EmDateTimePicker
                                                    ref="endDateTimePicker"
                                                    v-model="endDateTime"
                                                    @change="
                                                        (data) => {
                                                            startDateTime.startDate = data.startDate
                                                            startDateTimePicker.setDate(data.startDate)
                                                        }
                                                    "
                                                    :maxDate="new Date"
                                                    :options="{...globalData.datePickerOptions,  timePicker: true, displayIn: 'modal', adjustX: 0, adjustY: 12}"
                                                    />
                                                </div>
                    
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                        

                        <!-- Company Name -->
                        <!-- <div class="row">
                            <div class="col-md-6">
                                <div class="ionic-form-area">
                                    <div class="row">
                                        <label class="form-label">End Date:</label>
                                        <div class="col-md-12">
                                        <div class="form-group">
                                            <div class="time-box">
                                                <div class="time-box-input">
                                                    <Picker-EmDateTimePicker
                                                    v-model="endDateTime"
                                                    @change="
                                                        (data) => {
                                                        //   $refs.startDatePicker.setDate(data.startDate)
                                                        }
                                                    "
                                                    :nextIcon="false"
                                                    :options="{...globalData.datePickerOptions,  timePicker: true, displayIn: 'bottom_left', adjustX: 0, adjustY: 12}"
                                                    />
                                                </div>
                                                <button type="button" class="ionic-btn">
                                                    <i class="la la-clock"></i>
                                                </button>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="ionic-form-area">
                                    <div class="row">
                                        <label class="form-label">End time :</label>
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <div class="time-box">
                                                <div class="time-box-input">
                                                    <Picker-EmDateTimePicker
                                                    v-model="endTime"
                                                    @change="
                                                        (data) => {
                                                        endTime = data;
                                                        }
                                                    "
                                                    :options="{...timePickerOptions, displayIn: 'bottom_left', documentation: false, adjustX: -150, adjustY: -18}"
                                                    />
                                                </div>
                                                <button type="button" class="ionic-btn">
                                                    <i class="la la-clock"></i>
                                                </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> -->
                        <!-- <div class="row">
                            <label class="form-label">Type :</label>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <select class="form-control">
                                        <option value="Video">Video</option>
                                        <option value="Bundle">Bundle</option>
                                        <option value="Preview Timelapse">Preview Timelapse</option>
                                    </select>
                                </div>
                            </div>
                        </div> -->
                        <div class="row">
                            <label class="form-label">Description :</label>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <input type="text" v-model="downloadClipsFormData.info.name" class="form-control">
                                </div>
                            </div>
                        </div>
                        <!-- <div class="row my-3">
                            <div class="col-md-2">
                                <label class="form-label">Time Stamp :</label>
                            </div>
                            <div class="col-md-1">
                                <div class="product-typeradio">
                                    <label class="checkbox checkbox-pos-inline">
                                        <input
                                        type="checkbox"
                                        v-model="isTimestamp"
                                        />
                                        <span></span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-4" v-if="isTimestamp">
                                <div class="form-group">
                                    <select class="form-control" v-model="downloadClipsFormData.osd.timeZone">
                                        <template  v-for="(timezone , index) in timezones"   :key="index"> 
                                            <option :value="timezone.value">{{ timezone.name }}</option>
                                        </template>
                                    </select>
                                </div>
                            </div>
                        </div> -->
                        <div class="row">
                            <label class="form-label">Note :</label>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <textarea row="3" v-model="downloadClipsFormData.info.notes" class="form-control">
                                    </textarea>
                                </div>
                            </div>
                        </div>
                             
                             
                    </div>
                </div>
                <div class="modal-footer justify-content-between ps-0 pe-0">
                    <template v-if="modelEffect">
                    <ShimmerEffect
                        bg="dark"
                        height="52px"
                        width="140px"
                        radius="20px"
                    ></ShimmerEffect>
                    <ShimmerEffect
                        bg="dark"
                        height="52px"
                        width="140px"
                        radius="20px"
                    ></ShimmerEffect>
                    </template>
                    <template v-else>
                    <button
                        type="button"
                        class="ionic-btn ionic-border-btn cancel-btn"
                        @click="closeClipsDownloadModal()"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        class="ionic-btn ionic-theme-btn2 save-btn"
                        @click="saveClipsDownloadForm()"

                    >
                    Save
                    <BtnLoader :show="H.isPendingAnyApi('Gallery:downloadClipsFromEEN')" ></BtnLoader>
                </button>
                    </template>
                </div>
                </div>
            </div>
        </section>



        <section
        v-if="galleryStore.showClipDetailsModal"
        class="modal fade clips-details-modal"
        tabindex="-1"
       
        style="display: block; opacity: unset"
       
        >
        <div class="modal-dialog modal-dialog-centered" @click.stop="closeClipDetailsModal">
            <div class="modal-content" @click.stop="false">
                <div class="modal-header">
                    
                        <h1 class="modal-title fs-18 text-start">
                            Clip Details<br>
                            <small class="fs-12 count">{{formatTimestamp(selectedParentClip?.date, 'MM-DD-YYYY') }} &nbsp; {{ formatTimestamp(selectedParentClip?.date+' '+selectedParentClip?.start_time, 'hh:mm:ss A') }} - {{ formatTimestamp(selectedParentClip?.date+' '+selectedParentClip?.end_time, 'hh:mm:ss A') }}</small>
                        </h1>
                        <div class="modal-header-rightside">
                        <button
                            type="button"
                            class="ionic-btn ionic-theme-btn2 me-2"
                            @click="async ()=>{await galleryStore.deleteClip(selectedParentClip?.id);}"
                        >
                            Delete Clip
                            <template v-if="H.isPendingAnyApi('Gallery:deleteClip')">
                                <BtnLoader :show="true" color="black" size="16px" y="0px" ></BtnLoader>
                            </template>
                        </button>

                        <button
                            @click.stop="closeClipDetailsModal"
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            >
                            <i class="la la-close"></i>
                        </button>
                        </div>

                </div>
                <div class="modal-body" @click.stop="false"  ref="clipDetailsModal">
                    <div class="modal-body-inner">
                        
                        <div v-if="selectedSmallClip"> 
                            <video ref="videoPlayer" :src="selectedSmallClip?.mp4Url" controls type="video/mp4" autoplay></video>
                        </div>
                        <div v-if="galleryStore?.videoClipDetails?.clips?.length > 0" class="row">
                            <div class="col-md-12">
                                    <template v-for="(clip, index) in galleryStore?.videoClipDetails?.clips" :key="index">
                                            <div class="site-card site-timeline-card" :class="selectedSmallClip?.startTimestamp == clip?.startTimestamp ? 'camera-box-active' : ''">
                                                <div class="site-card-leftstide">
                                                    <div class="">
                                                        <div class="kpi-card-box mb-3">
                                                            <h4 class="fs-16">Start time:</h4>
                                                            <p class="fs-12 count">{{formatTimestamp(clip?.startTimestamp) }}</p>
                                                        </div>
                                                        <div class="kpi-card-box">
                                                            <div class="kpi-card-box-inner">
                                                                <h4 class="fs-16">End time:</h4>
                                                                <p class="fs-12 count">{{ formatTimestamp(clip?.endTimestamp) }}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="card-header-rightside" >
                                                    <div class="camera-list-videobox">
                                                        <div class="camera-box cp"  @click="playVideoPlayer(clip)">
                                                            <img :src="selectedParentClip.preview_image_url ? selectedParentClip.preview_image_url : '/img/empty_img_small.jpg'" class="img-fluid" alt="camera img" />
                                                            
                                                            <template v-if="isCallingApi && selectedSmallClip?.startTimestamp == clip?.startTimestamp">
                                                                <div class="camera-playicon">
                                                                    <BtnLoader :show="true" color="black" size="16px" y="10px" ></BtnLoader>
                                                                </div>
                                                            </template>
                                                            <template v-else>
                                                                <div class="camera-playicon">
                                                                    <i class="las la-play-circle"></i>
                                                                </div> 

                                                            </template>
                                                            <!-- <div class="camera-bottom bottom-center">
                                                                <div class="camera-bottom-right">
                                                                    <i class="bx bx-error error-icon"></i>
                                                                    <i class="bx bx-wifi wifi-icon"></i>
                                                                </div>
                                                            </div> -->
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    </template>
                            </div>
                        </div>
                        <div  v-else class="row">
                            <div class="text-center m-3">No clips found</div>
                        </div>
                    </div>
                </div>
           
            </div>
        </div>
        </section>


        <section
        v-if="timelapseStore.showTimelapseCreateModal"
        class="modal fade addnew-product-modal"
        tabindex="-1"
    
        style="display: block; opacity: unset"
    >
        <div class="modal-dialog modal-dialog-centered" @click.stop="closeTimelapseCreateModal">
        <div class="modal-content" @click.stop="false">
            <div class="modal-header">
            <h1 class="modal-title fs-5">Create Timelapse</h1>
            <button
            @click.stop="closeTimelapseCreateModal"
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
                <div class="col-md-12 my-2"> 
                    <div class="product-typeradio">
                    <label class="checkbox checkbox-pos-inline">
                        Entire Timeline
                        <input
                        type="checkbox"
                        name="product_type"
                        value="1"
                        @change="onSelectEntireTimeline()"
                        v-model="timelapseStore.timelapseVideoForm.entire_timeline"
                        />
                        <span></span>
                    </label>
                    </div>
                </div>
                <div class="d-flex justify-content-between my-2" v-if="timelapseStore.timelapseVideoForm.entire_timeline == 0">
                    <div> 
                    <label class="form-label">Start Time</label> 
                    <div class="date-box me-3">
                        <div class="time-period">
                            <Picker-EmDateTimePicker ref="startDatePicker" v-model="timelapseStore.timelapseVideoForm.start_time" @change="
                                async (data) => {
                                    timelapseStore.timelapseVideoForm.start_time = data.startDate;
                                    if(timelapseStore.timelapseVideoForm.end_time){
                                        timelapseStore.timelapseVideoForm.request_type = 'check'
                                        submitTimeLapseVideoForm('check')
                                    }
                                }
                                "
                                :options="{...globalData.datePickerOptions, displayIn: 'bottom_left', adjustX: 0, adjustY: 12}" />
                        </div>
                        <button type="button" class="ionic-btn"><i class="la la-calendar"></i></button>
                    </div>
                    </div>
                    <div> 
                    <label class="form-label">End Time</label>
                    <div class="date-box">
                        <div class="time-period">
                            <Picker-EmDateTimePicker ref="startDatePicker" v-model="timelapseStore.timelapseVideoForm.end_time" @change="
                                async (data) => {
                                timelapseStore.timelapseVideoForm.end_time = data.startDate;
                                timelapseStore.timelapseVideoForm.request_type = 'check'
                                submitTimeLapseVideoForm(type = 'check')
                                }
                            "
                            :options="{...globalData.datePickerOptions, displayIn: 'bottom_left', adjustX: 0, adjustY: 12}" />
                        </div>
                        <button  @click.stop="$refs.endDatePicker.toggle()" type="button" class="ionic-btn"><i class="la la-calendar"></i></button>
                    </div>

                    </div>
                </div>
            
                <!-- <div class="d-flex justify-content-between my-2">
                    <label>Total Footage Recorded
                    </label>
                    <label>{{ timelapseStore?.timelapseVideoInfoBeforeProcess ? timelapseStore?.timelapseVideoInfoBeforeProcess?.days +'days '+ timelapseStore?.timelapseVideoInfoBeforeProcess?.hours +'hours' :  'N/A' }}</label> 
                </div> -->
                <div class="d-flex justify-content-between mt-3">
                    <label>Frame Rate Increase Video Length</label>
                    <label>{{ timelapseStore?.timelapseVideoForm?.video_duration ?? 'N/A' }}</label> 

                </div>
                <div> 
                    <label class="my-3"> Frame Rate</label>
                    <div class="product-typeradio">
                    
                    <label class="radio">
                        <input
                        type="radio"
                        name="product_type"
                        value="1"
                        v-model="timelapseStore.timelapseVideoForm.frame_rate"
                        />
                    Normal
                        <span></span>
                    </label>
                    <label class="radio">
                        <input
                        type="radio"
                        name="product_type"
                        value="2"
                        v-model="timelapseStore.timelapseVideoForm.frame_rate"
                        />
                        1x
                        <span></span>
                    </label>
                    <label class="radio">
                        <input
                        type="radio"
                        name="product_type"
                        value="3"
                        v-model="timelapseStore.timelapseVideoForm.frame_rate"
                        />
                        2x
                        <span></span>
                    </label>
                    </div>
                </div>
                
                
            
                </div>
            </div>
            </div>
            <div class="modal-footer justify-content-between ps-0 pe-0">
            <template v-if="modelEffect">
                <ShimmerEffect
                bg="dark"
                height="52px"
                width="140px"
                radius="20px"
                ></ShimmerEffect>
                <ShimmerEffect
                bg="dark"
                height="52px"
                width="140px"
                radius="20px"
                ></ShimmerEffect>
            </template>
            <template v-else>
                <button
                type="button"
                class="ionic-btn ionic-border-btn cancel-btn"
                @click="closeTimelapseCreateModal"
                >
                Cancel
                </button>
                <button
                type="button"
                class="ionic-btn ionic-theme-btn2 save-btn"
                @click="submitTimeLapseVideoForm(type = 'create' )"
                >
                Save
                <BtnLoader
                    v-if="isCreatingTimelapse"
                    color="white"
                ></BtnLoader>
                </button>
            </template>
            </div>
        </div>
        </div>
        </section>

        <section
        v-if="cameraStore.showAudioModal"
        class="modal fade addnew-product-modal"
        tabindex="-1"
        style="display: block; opacity: unset"
      >
        <div
          class="modal-dialog modal-dialog-centered"
          @click.stop="closeAudioModal"
        >
          <div class="modal-content" @click.stop="false">
            <div class="modal-header">
              <h1 class="modal-title fs-5">Add audio</h1>
              <button
                @click.stop="closeAudioModal"
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
                  <!-- Company Name -->
                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="form-label">Company</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <select
                          class="form-control"
                          v-model="audioFormdata.company_id"
                          @change="onChangeCompany"
                          :disabled="true"
                        >
                          <option
                            v-for="(value, index) in companyStore.companies"
                            :key="index"
                            :value="value.id"
                          >
                            {{ value.company_name }}
                          </option>
                        </select>
                      </template>
                    </div>
                  </div>
                  <!-- Site -->
                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="form-label">Site</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <select
                          class="form-control"
                          v-model="audioFormdata.site_id"
                          @change="onChangeSite"
                                :disabled="true"
                        
                        >
                        <option value="null">Select Site </option>
                          <option
                            v-for="(
                              value, index
                            ) in companyStore.companySiteList"
                            :key="index"
                            :value="value.id"
                          >
                            {{ value.title }}
                          </option>
                        </select>
                      </template>
                    </div>
                  </div>
                  <!-- Camera -->
                    <div class="col-md-12">
                        <div class="form-group">
                            <label class="form-label">Camera</label>
                            <template v-if="modelEffect">
                                <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                            </template>
                            <template v-else>
                                <select
                                    class="form-control"
                                        v-model="audioFormdata.camera_id"
                                              :disabled="true"
                                    >
                                    <option value="null">Select Camera </option>
                                    <option
                                        v-for="(
                                        camera, index
                                        ) in cameraStore.cameraListBySiteId"
                                        :key="index"
                                        :value="camera.id"
                                    >
                                        {{ camera.name }}
                                    </option>
                                    </select>
                            </template>
                        </div>
                    </div>
                    <div class="col-md-12 mb-3">
                            <label class="form-label mb-2">Date time</label>
                            <div class="time-period">
                                <Picker-EmDateTimePicker
                                v-model="audioDateTime"
                                ref="audioDateTimePicker"
                                @change="
                                    (data) => {
                                    }
                                "
                                :nextIcon="false"
                                :options="{...globalData.datePickerOptions,  timePicker: true, displayIn: 'modal', adjustX: 0, adjustY: 12}"
                                />
                            </div>
                    </div>
                    <div class="col-md-4 my-3"> 
                        <div class="product-typeradio my-3">
                        <label class="checkbox checkbox-pos-inline">
                            Repeat
                            <input
                            type="checkbox"
                            name="product_type"
                            value="1"
                            v-model="audioFormdata.is_repeat"
                            />
                            <span></span>
                        </label>
                        </div>
                    </div>
                    <div class="col-md-8" v-if="audioFormdata.is_repeat">
                        <div class="form-group">
                            <label class="form-label">Type</label>
                            <template v-if="modelEffect">
                                <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                            </template>
                            <template v-else>
                                <select
                                    class="form-control"
                                        v-model="audioFormdata.repeatation_type"
                                    >
                                    <!-- <option value="does_not_repeat">Does not repeat </option> -->
                                    <option value="daily">
                                        Daily
                                    </option>
                                    <!-- <option value="weekly">
                                        Weekly
                                    </option> -->
                                    <!-- <option value="monthly">
                                        Monthly
                                    </option>
                                    <option value="annualy">
                                        Annualy
                                    </option>
                                    <option value="every_weekday">
                                        Every Weekday
                                    </option> -->
                                    </select>
                            </template>
                        </div>
                    </div>
                    
                  <div class="col-md-12">
                    <div class="form-group">
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                            <div class="ionic-img-upload-area">
                            <el-audio-file-input
                            v-model="audioFormdata.file"
                            ></el-audio-file-input>
                            </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer justify-content-between ps-0 pe-0">
              <template v-if="modelEffect">
                <ShimmerEffect
                  bg="dark"
                  height="52px"
                  width="140px"
                  radius="20px"
                ></ShimmerEffect>
                <ShimmerEffect
                  bg="dark"
                  height="52px"
                  width="140px"
                  radius="20px"
                ></ShimmerEffect>
              </template>
              <template v-else>
                <button
                  type="button"
                  class="ionic-btn ionic-border-btn cancel-btn"
                  @click="closeAudioModal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="ionic-btn ionic-theme-btn2 save-btn"
                  @click="submitAudioSaveForm"
                >
                 Save
                </button>
              </template>
            </div>
          </div>
        </div>
      </section>
        
    </div>
    
</template>
<script setup>
import ConstantConfig from '~/constant.config.js'
const { timezones } = ConstantConfig;
import moment from "moment-timezone";
import { useSitesStore } from '~/stores/vms/sites';
import { useGalleryStore} from '~/stores/vms/gallery'
import { useTimelapseStore } from "~/stores/vms/timelapse";
import { useCommonStore } from  "~/stores/Common";
import { useCameraStore } from '~/stores/vms/camera';
import { useCompaniesStore } from "~/stores/vms/company";

//reactive data import
const siteStore = useSitesStore();
const galleryStore = useGalleryStore()
const timelapseStore = useTimelapseStore();
const commonStore  = useCommonStore();
const cameraStore  = useCameraStore();
const companyStore = useCompaniesStore();
// defautl 5 minutes
const HIGHT_QUALITY_STREAM_TIMEOUT = Number(useRoute().query?.delay || 0) || (1000 * 60 * (useRuntimeConfig()?.public?.HIGHT_QUALITY_STREAM_TIMEOUT ?? 5));

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: "%s | Camera timeline",
});
let isCreatingTimelapse = ref(false)
let iframeSrc = ref(null)
let showIframe = ref(true)
let isHistoryMode = ref(false)
// let currentTimeStamp = ref(moment().toISOString())
let currentTimeStamp = ref(new Date())
let modelEffect = ref(false);
let videoPlayer = ref(null);
let shimmerEffect = ref(true)
let timeOut = null; 

function startLiveSnapAfterFewMomemt(){
    if(useRoute().query?.delay) log(`set ${(Number(useRoute().query?.delay) / 1000).toFixed(1)}s`);
    clearTimeout(timeOut);
    timeOut = setTimeout(()=>{
       if(useRoute().query?.delay) log('wao >>  Live snap started')
       isHistoryMode.value = true;
       showIframe.value = false
       getLiveSnap()
    }, HIGHT_QUALITY_STREAM_TIMEOUT )
}
onMounted(async () => {
    commonStore.preloader = true
    let cameraId = useRoute().params.id;
    await getClipList()
    await siteStore.getSiteCamerasLiveFeed(cameraId)
    await loadVideoStream(null, cameraId, currentTimeStamp.value, false);
    useCookie('header_site').value = galleryStore?.cameraDetails?.site_id;
    siteStore.headerSelectedSite = galleryStore?.cameraDetails?.site_id;
    shimmerEffect.value = false
    siteStore.showAllSiteOption = false
    commonStore.preloader = false
    startLiveSnapAfterFewMomemt(); 
    document.addEventListener('mousemove', startLiveSnapAfterFewMomemt);
});
onBeforeUnmount(()=>{
    clearTimeout(timeOut)
    clearInterval(intervalId)
    siteStore.showAllSiteOption = true
    cameraStore.playLiveStream = false
    cameraStore.loadSnapShotForCameraId = null
    cameraStore.allowApi = false
    document.removeEventListener('mousemove', startLiveSnapAfterFewMomemt);


})
let isCollapsedIframe = ref(false)
let showClipsSaveModal = ref(false)
let selectedParentClip = ref(null)
let selectedSmallClip = ref(null) 
let clipDetailsModal = ref(null)
let startDatePicker  = ref(null)
let startDateTimePicker = ref(null)
let endDateTimePicker = ref(null)
let iframeWrapper = ref(null)
let intervalId = null
let date = ref({
  startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
  endDate: H.formatDate(new Date(), "YYYY-MM-DD"),
});
let startDate = ref({
  startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
  endDate: H.formatDate(new Date(), "YYYY-MM-DD"),
});
let startTime = ref({
  startTime: H.formatDate(new Date(), "hh:mm A"),
  endTime: H.formatDate(new Date(), "hh:mm A"),
});
let endDate = ref({
  startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
  endDate: H.formatDate(new Date(), "YYYY-MM-DD"),
});
let endTime = ref({
  startTime: H.formatDate(new Date(), "hh:mm A"),
  endTime: H.formatDate(new Date(), "hh:mm A"),
});

//clips download
let startDateTime = ref({
  startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
  startTime: H.formatDate(new Date(), "hh:mm A"),
});

let endDateTime = ref({
    startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
    startTime: H.formatDate(new Date(), "hh:mm A"),
});
//audio save
let audioDateTimePicker = ref(null)
let audioDateTime = ref({
  startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
  startTime: H.formatDate(new Date(), "hh:mm A"),
});

let timePickerOptions = {
  onlyTimePicker: true,
  timePickerButtons: true,
  displayIn: "modal",
  theme: "dark",
  minuteStep: "1",
  colors: {
    primary_bg: "#6bba1c",
  },
};
let isCallingApi = ref(false)
let isCallingButtonApi = ref(false)
let showClipsDownloadModal = ref(false)
let downloadClipsFormData = ref({
    camera_id: useRoute().params.id,
    deviceId: null,
    autoDelete: true,
    type: 'video',
    info: {
        directory: "/",
        name: null,
        notes: null
    },
    period: {
        startTimestamp: null,
        endTimestamp: null
    }
})
let isTimestamp = ref(0)
const audioFormdata = ref({
  company_id: null,
  site_id: null,
  camera_id: null,
  file: null,
  date_time: null,
  is_repeat: 0,
  repeatation_type: 'daily'
});
let isFirstInterval = ref(false)
let isDownloading = ref(false)
let downloadingClipId = ref(null)
async function openAudioModal() {
//   closeAudioModal();
  audioFormdata.value.company_id = galleryStore?.cameraDetails?.company?.id;
  audioFormdata.value.site_id = galleryStore?.cameraDetails?.site?.id;
  await cameraStore.getCameraListBySiteId( galleryStore?.cameraDetails?.site?.id)
  audioFormdata.value.camera_id = galleryStore?.cameraDetails?.id;
  cameraStore.showAudioModal = true;
  startLiveSnapAfterFewMomemt();
}
function closeAudioModal() {
    audioFormdata.value.company_id = "";
    audioFormdata.value.site_id = null;
    audioFormdata.value.camera_id = null;
    audioFormdata.value.file = null;
    audioFormdata.value.is_repeat = 0;
    audioDateTimePicker.value.setDate = {
        startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
    };
    audioDateTimePicker.value.setTime = {
        startTime: H.formatDate(new Date(), "hh:mm A"),
    };
    audioDateTime.value  = {
        startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
        startTime: H.formatDate(new Date(), "hh:mm A"),
    };
    cameraStore.showAudioModal = false;

}
async function onChangeCompany(companyId){
    await companyStore.showCompanySite(companyId);
    startLiveSnapAfterFewMomemt();

}
async function onChangeSite(siteId){
    await cameraStore.getCameraListBySiteId(siteId);
    startLiveSnapAfterFewMomemt();
}
async function submitAudioSaveForm(){
    audioFormdata.value.date_time = `${audioDateTime.value.startDate} ${audioDateTime.value.startTime}`
    await cameraStore.saveAudio(audioFormdata.value);
    startLiveSnapAfterFewMomemt();
}
const toggleIframeMode = async ( ) => {
    clearInterval(intervalId)
    showIframe.value = true
    isHistoryMode.value = !isHistoryMode.value; 
    if(isHistoryMode.value){
        selectedParentClip.value ? await loadVideoStream(selectedParentClip.value, selectedParentClip.value.camera_id, selectedParentClip.value.start_timestamp) :  await loadVideoStream(null, useRoute().params.id, currentTimeStamp.value)
    }else{
        await loadVideoStream(null, useRoute().params.id, currentTimeStamp.value);
        clearTimeout(timeOut)
        timeOut = setTimeout(()=>{
            showIframe.value = false
            getLiveSnap()
        }, HIGHT_QUALITY_STREAM_TIMEOUT)
    }
}
const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        // Enter fullscreen mode
        iframeWrapper.value.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
    }
}

async function submitTimeLapseVideoForm(type){
    if(type=="check"){
        timelapseStore.checkSnapshotsAvailability(timelapseStore.timelapseVideoForm)
    }else{
        isCreatingTimelapse.value = true
        await timelapseStore.saveTimeLapse(timelapseStore.timelapseVideoForm)
        resetVideoCreateForm()
        isCreatingTimelapse.value = false
        
    }
}
function resetVideoCreateForm(){
    timelapseStore.timelapseVideoForm = {
            entire_timeline: 0,
            camera_id: useRoute().params.id,
            total_images: 0,
            frame_rate: 1,
            start_time: H.formatDate(new Date(), "YYYY-MM-DD"),
            end_time: H.formatDate(new Date(), "YYYY-MM-DD"),
            request_type: "check",
            video_duration: null
        }
}
async function getClipList(data=null){
    if(data) startDate.value  = data;
    let payload = {
    date: H.formatDate(
      `${startDate.value.startDate}`,
      "YYYY-MM-DD"
    ),
    camera_id: useRoute().params.id,
  };
  await galleryStore.getDownloadedVideoClipsFromEEN(payload);
}
function jumpToClipsPage(page){
    commonStore.preloader = true
    galleryStore.clipsPaginate.page = page;
    getClipList();
    commonStore.preloader = false
  }
function openClipsSaveModal() {
    showClipsSaveModal.value = true;
}
function openClipsDownloadModal(){
    downloadClipsFormData.value.info.name =  `Video ${galleryStore?.cameraDetails?.name} ${startDate.value.startDate} ${startTime.value.startTime}`
    downloadClipsFormData.value.deviceId = galleryStore?.cameraDetails?.een_camera_id
    showClipsDownloadModal.value = true;
}
async function closeClipsDownloadModal(){
    await resetDownloadClipForm()
    showClipsDownloadModal.value = false
}
function openTimelapseCreateModal(){
      timelapseStore.showTimelapseCreateModal = true;
      startLiveSnapAfterFewMomemt();
}
function closeTimelapseCreateModal(){
    timelapseStore.showTimelapseCreateModal = false
    resetVideoCreateForm()
    startLiveSnapAfterFewMomemt();
}

async function openClipDetailsModal(clip, loadFirstVideo=false){
    if(loadFirstVideo){  
        isCallingApi.value = true
    }else{
        isCallingButtonApi.value = true
    }
    selectedParentClip.value = clip
    await galleryStore.getVideoClipDetails(clip.id)
    galleryStore.showClipDetailsModal = true;
    if(loadFirstVideo){
        playVideoPlayer(galleryStore?.videoClipDetails?.clips[0])
        isCallingApi.value = false 
    }else{
        isCallingButtonApi.value = false
    }
}
function closeModal(){
    showClipsSaveModal.value = false;
    startLiveSnapAfterFewMomemt();
}
function closeClipDetailsModal(){
    galleryStore.showClipDetailsModal = false;
    selectedSmallClip.value = null
    startLiveSnapAfterFewMomemt();
}
async function loadMoreClips(){
    galleryStore.clipsPaginate.per_page = galleryStore.clipsPaginate.per_page + 20
    if(galleryStore.clipsPaginateData.total  >   galleryStore.clipsPaginate.per_page){
        isCallingButtonApi.value = true
        await getClipList()
        isCallingButtonApi.value = false
    }  
}
async function saveClips() {
  let payload = {
    date: H.formatDate(
      `${date.value.startDate}`,
      "YYYY-MM-DD"
    ),
    start_time: moment(startTime.value.startTime, ['h:mm A']).format("HH:mm"),
    end_time:  moment(endTime.value.startTime,   ['h:mm A']).format("HH:mm"),
    camera_id: useRoute().params.id,
  };
  if( payload.date > H.formatDate(new Date(), "YYYY-MM-DD")){
    Toaster.error('Please select a date before tomorrow')
    return
  }
  await  galleryStore.saveVideoClips(payload);
  await startDatePicker.value.setDate(date.value.startDate)
  await getClipList()
  closeModal()
}

function onIframeMessageDataPost(event){
    if (event.data === 'een-iframe-loaded' || event.data === "een-iframe-token-expired") {
        const iframe = document.getElementById("test-iframe").contentWindow;
        iframe.postMessage({ 
            type: 'een-token', 
            token: siteStore.siteCamerasLiveFeed.access_token
        }, "https://iframe.eagleeyenetworks.com/");

       
    }
}
async function loadVideoStream(clip = null, cameraId, timestamp = null){
    globalLoader(true)
    showIframe.value = false
    isHistoryMode.value = false
    if(clip){
        isHistoryMode.value = true
        selectedParentClip.value = clip 
        currentTimeStamp.value = timestamp ? moment(timestamp).tz(galleryStore?.cameraDetails?.timezone ?? 'UTC').format('MM-DD-YYYY HH:mm') : moment().local().format('MM-DD-YYYY HH:mm')
    }else{
        currentTimeStamp.value =  moment.utc(timestamp).local().format('MM-DD-YYYY HH:mm')
    } 

    await galleryStore.getCameraDetails(cameraId)
    globalLoader(false)
    // await siteStore.getSiteCamerasLiveFeed(cameraId)
    if(siteStore.siteCamerasLiveFeed.access_token && isHistoryMode.value){
        iframeSrc.value = `https://iframe.eagleeyenetworks.com/#/history?ids=${siteStore.siteCamerasLiveFeed.camera_een_id}&time=${currentTimeStamp.value}`;
    }
    if(siteStore.siteCamerasLiveFeed.access_token && !isHistoryMode.value){
        iframeSrc.value = `https://iframe.eagleeyenetworks.com/#/live/${siteStore.siteCamerasLiveFeed.camera_een_id}`
    }
    window.addEventListener("message", onIframeMessageDataPost);
    showIframe.value = true
    
}

const playVideoPlayer = async (clip) => {
    selectedSmallClip.value = clip;
    var requestOptions = {
      method: 'GET',
      headers: {
        "Authorization" : `Bearer ${galleryStore?.videoClipDetails.access_token}`
      },
      credentials: 'include'
    };
    await nextTick();
    if (clipDetailsModal.value) {
        clipDetailsModal.value.scrollTop = 0;
    }
    fetch(`${galleryStore?.videoClipDetails.hostname}/api/v3.0/media/session`, requestOptions)
      .then(response => response.json() )
      .then( body => fetch(body.url, requestOptions) )
      .then( response => console.log("response status", response.status ) )
      .catch(error => console.log('error', error));
    setTimeout(()=>{
      videoPlayer.value.play();
    }, 500)
      // Scroll to the top of the modal
  
};
function formatTimestamp(timestamp , format="MM-DD-YYYY hh:mm:ss A") {
    return moment.utc(timestamp).format(format);
}
async function onSelectEntireTimeline(){
  timelapseStore.timelapseVideoForm.request_type = 'check' 
  if(timelapseStore.timelapseVideoForm.entire_timeline){
    submitTimeLapseVideoForm('check')
  }
}
function convertToCameraTimezone(time, timeFormat){
   return  moment.utc(time).tz(galleryStore?.cameraDetails?.timezone ?? 'UTC').format(timeFormat)
}
let mouseentered = ref(false);

function enableScroll() {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}
function disableScroll() {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
}

watch(mouseentered, (a, b)=>{
    if(a) disableScroll()
    else enableScroll()
})
watch(() => startDateTime.value.startDate, (newVal, oldVal)=>{
    if(newVal != oldVal){
        downloadClipsFormData.value.info.name =  `Video ${galleryStore?.cameraDetails?.name} ${newVal}  ${startDateTime.value.startTime}`
        // Parse the date and time in the format 'YYYY-MM-DD hh-mm-ss A'
       
    }
})
watch(() => startDateTime.value.startTime, (newVal, oldVal)=>{
    if(newVal != oldVal){
        downloadClipsFormData.value.info.name =  `Video ${galleryStore?.cameraDetails?.name} ${startDateTime.value.startDate}  ${newVal}`
        // const parsedDate = moment(`${newVal} ${startTime.value.startTime}`, 'YYYY-MM-DD hh-mm-ss A');
        // // Convert to UTC and format as ISO 8601
        // downloadClipsFormData.value.period.startTimestamp = parsedDate.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    }
})
async function saveClipsDownloadForm(){
    const parsedStartDateTime = moment(`${startDateTime.value.startDate} ${startDateTime.value.startTime}`, 'YYYY-MM-DD hh-mm-ss A');
    downloadClipsFormData.value.period.startTimestamp = parsedStartDateTime.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const parsedEndDateTime = moment(`${endDateTime.value.startDate} ${endDateTime.value.startTime}`, 'YYYY-MM-DD hh-mm-ss A');
    downloadClipsFormData.value.period.endTimestamp = parsedEndDateTime.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    let payload = {
        camera_id: downloadClipsFormData.value.camera_id,
        device_id: downloadClipsFormData.value.deviceId,
        name:   downloadClipsFormData.value.info.name,
        notes:  downloadClipsFormData.value.info.notes,
        // start_timestamp: downloadClipsFormData.value.period.startTimestamp,
        // end_timestamp:   downloadClipsFormData.value.period.endTimestamp
        start_timestamp: `${startDateTime.value.startDate} ${startDateTime.value.startTime}`,
        end_timestamp:   `${endDateTime.value.startDate} ${endDateTime.value.startTime}`,
        timezone: galleryStore?.cameraDetails?.timezone ?? 'UTC'
    }
    await galleryStore.downloadClipsFromEEN(payload)
    // await startDatePicker.value.setDate(startDateTime.value.startDate)
    // startDate.value.startDate = startDateTime.value.startDate
    // await getClipList()
    setTimeout(async ()=>{
        await getClipList()
    }, 1000*60)
    setTimeout(async ()=>{
        await getClipList()
    }, 1000*60*60)
    await resetDownloadClipForm()
    showClipsDownloadModal.value = false

}
async function resetDownloadClipForm(){
    startDateTimePicker.value.setDate = {
        startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
    };
    startDateTimePicker.value.setTime = {
        startTime: H.formatDate(new Date(), "hh:mm A"),
    };

    endDateTimePicker.value.setDate = {
        startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
    };
    endDateTimePicker.value.setTime = {
        startTime: H.formatDate(new Date(), "hh:mm A"),
    };
    
    startDateTime.value = {
        startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
        startTime: H.formatDate(new Date(), "hh:mm A"),
    };
    endDateTime.value = {
        startDate: H.formatDate(new Date(), "YYYY-MM-DD"),
        startTime: H.formatDate(new Date(), "hh:mm A"),
    }

    downloadClipsFormData.value = {
        camera_id: useRoute().params.id,
        deviceId: null,
        autoDelete: true,
        type: 'video',
        info: {
            directory: "/",
            name: null,
            notes: null
        },
        period: {
            startTimestamp: null,
            endTimestamp: null
        }
    }
}
let downloadClipId = ref(null)
// async function downloadsClipsAsZip(clip){
//     try {
//         isDownloading.value = true
//         downloadingClipId = clip.id
//         await galleryStore.downLoadExportedClip(clip.id)
//         const downloadLink = JSON.parse(clip.options).result.intervals[0]?.files[0]?.url
//         // const url = `${siteStore.siteCamerasLiveFeed.een_base_url}/api/v3.0/downloads/${ downloadClipId.value}:download`
//         const url = `${downloadLink}:download`
//         const options = {
//             method: 'GET',
//             headers: {
//                 accept: '*/*',
//                 authorization: `Bearer ${siteStore.siteCamerasLiveFeed.access_token}`
//             }
//         }
//         const response = await fetch(url, options);
//         // Check for HTTP errors
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         isDownloading.value = false
//         // Process the response as a blob (binary data)
//         const blob = await response.blob();

//         // Create a URL for the blob
//         const temporaryUrl = window.URL.createObjectURL(blob);

//         // Create a temporary anchor element to trigger download
//         const a = document.createElement('a');
//         a.href = temporaryUrl;
//         a.download = `clip_${Date.now()}.mp4`; // Default filename
//         document.body.appendChild(a);
//         a.click();

//         // Clean up
//         a.remove();
//         window.URL.revokeObjectURL(temporaryUrl);
//     } catch (error) {
//         console.error('Error:', error.message);
//     }
// }

// async function downloadsClipsAsZip(clip){
//     try {
//         isDownloading.value = true
//         downloadingClipId = clip.id
//         await galleryStore.downLoadExportedClip(clip.id)
//         isDownloading.value = false
//     } catch (error) {
//         console.error('Error:', error.message);
//     }
// }


async function downloadsClipsAsZip(clip) {
    try {
        const downloadLink = JSON.parse(clip.options).result.video_url;
        if (!downloadLink) {
            throw new Error("Download link not found.");
        }
        // Add necessary headers (e.g., token) as query parameters if required
        // const url = `${downloadLink}:download?token=${siteStore.siteCamerasLiveFeed.access_token}`;
        const url = downloadLink
        // Trigger the browser's download manager by creating an anchor element
        const a = document.createElement('a');
        a.href = url; // File URL
        a.target = '_blank'; // Optional: open in a new tab
        a.download = ''; // This makes the browser download the file
        document.body.appendChild(a);
        a.click();
        a.remove(); // Clean up

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function getLiveSnap(){
    cameraStore.allowApi = true
    cameraStore.loadSnapShotForCameraId = galleryStore?.cameraDetails.id
    cameraStore.playLiveStream = true
    clearInterval(intervalId)
    cameraStore.liveSnapShot = null
    isFirstInterval.value = true
    globalLoader(true)
    intervalId = setInterval(async () => {
        if (isFirstInterval.value) {
            try {
                await cameraStore.getLiveSnapShot(galleryStore?.cameraDetails.id); // Wait until the API call is done
                if (cameraStore.liveSnapShot) {
                    globalLoader(false); // Turn off loader after the first call completes
                    isFirstInterval.value = false; // Mark first call as complete
                }
            } catch (error) {
                isFirstInterval.value = false;
                globalLoader(false);
                clearInterval(intervalId);
            } 
        } else {
            cameraStore.getLiveSnapShot(galleryStore?.cameraDetails.id); // Continue subsequent calls
        }
    }, 1000);
}
async function stopGettingLiveSnap(){
  clearInterval(intervalId)
  cameraStore.liveSnapShot = null
}
</script>
<style scoped>
.iframe-container {
  width: 100%;
  height: 400px;
  overflow: hidden;
} 

.iframe-content {
  width: 100%;
  height: 100%;
  transform: scale(1.8); 
  transform-origin: -20 -20;
  overflow: hidden;
}
.blurred-image {
    filter: blur(5px); /* Adjust the value for more or less blur */
}
</style>
>