<template>
  <div>
    <Breadcrumb
      title="Companies"
      :links="['companies']"
      :page="{
        title: companyStore.companyData.company_name,
        link: `/vms/companies/${useRoute().params.id}`,
      }"
    ></Breadcrumb>
    <div class="row">
      <div class="col-xl-3 col-lg-4 col-md-4">
        <div class="ionic-card mb-2">
          <div class="ionic-card-body">
            <div style="text-align: center">
              <img
                class="rounded-circle"
                :src="
                  companyStore.companyData.logo
                    ? companyStore.companyData.logo
                    : 'https://s3.us-west-2.amazonaws.com/storage-dev.inspectdeploy.io/media/users/1717052490.png'
                "
                width="80"
                height="80"
              />
              <h4 class="mt-3">{{ companyStore.companyData.company_name }}</h4>
            </div>
            <ul class="h_list">
              <li>
                <div class="active-menu">
                  <i class="las la-home me-2"></i>Overview
                </div>
              </li>
              <li>
                <div class="active-menu cp" @click="openUpdateCompanyModal()">
                  <i class="las la-edit me-2"></i>Update company
                </div>
              </li>
              <li>
                <div class="active-menu cp" @click="goToSiteListPage()">
                  <i class="las la-map-marker-alt me-2"></i>All sites
                </div>
              </li>
              <li>
                <div class="active-menu cp" @click="goToSiteCamerasPage()">
                  <i class="las la-camera me-2"></i>Site cameras
                </div>
              </li>
              <li>
                <div class="active-menu cp" @click="openSynCameraPopup()">
                  <i class="las la-sync me-2"></i>Sync camera
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="ionic-card overview-info-card">
          <div class="ionic-card-body">
            <ul class="company-profile-info">
              <li>
                <strong>Email:</strong> {{ companyStore.companyData.email }}
              </li>
              <li>
                <strong>Address:</strong> {{ companyStore.companyData.address }}
              </li>
              <li>
                <strong>Phone:</strong>
                {{ companyStore.companyData.contact_no }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-xl-9 col-lg-8 col-md-8">
        <div class="ionic-card mb-2">
          <div class="ionic-card-header card-header-border">
            <h4 class="ionic-card-title fs-18">Overview</h4>
          </div>
          <div class="ionic-card-body">
            <div class="row">
              <div class="col-md-6">
                <div
                  class="ionic-card overview-card projects-card text-black mb-3"
                >
                  <div class="ionic-card-body">
                    <h4 class="ionic-card-title fs-20">
                      Sites
                      <span class="fs-22" style="float: right">{{
                        companyStore.companysites?.length
                      }}</span>
                    </h4>
                    <p class="card-text fs-14">Total Sites</p>
                  </div>
                </div>
              </div>
              <!-- <div class="col-md-4">
          <div class="ionic-card overview-card users-card text-black mb-3">

            <div class="ionic-card-body">
              <h4 class="ionic-card-title d-flex justify-content-between">
                <span>Users</span>
                <span>0</span>
              </h4>
              <p class="ionic-card-text">Total Users</p>
            </div>

          </div>
        </div> -->
              <div class="col-md-6">
                <div
                  class="ionic-card overview-card cameras-card text-black mb-3"
                >
                  <div class="ionic-card-body">
                    <h4 class="ionic-card-title fs-20">
                      Cameras
                      <a href="javascript:void(0)" style="float: right">
                        <span class="fs-22" onclick="showAllCameras()">
                          {{ companyStore.camera_ids.length }}</span
                        >/<span class="fs-22" onclick="showOnlyActiveCameras()"
                          >{{
                            companyStore.total_online_camera
                              ? companyStore.total_online_camera
                              : 0
                          }}
                        </span>
                      </a>
                    </h4>
                    <p class="card-text">
                      <a href="javascript:void(0)"
                        ><span class="fs-14" onclick="showAllCameras()"
                          >Total</span
                        >/<span class="fs-14" onclick="showOnlyActiveCameras()"
                          >Active</span
                        ></a
                      >
                      Cameras
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <!--  data table start -->
            <div class="overview-table-card mb-0">
              <div class="ionic-card-body">
                <div class="d-flex justify-content-end">
                  <input
                    class="form-control form-control-sm"
                    type="text"
                    id="searchTable"
                    placeholder="Search"
                    v-model="searched"
                    @input="searchTable"
                    style="width: 200px; margin-bottom: 10px; float: right"
                  />
                </div>
                
                <div class="table-responsive">
                  <table class="table table-borderless">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Online?</th>
                        <th>Address</th>
                        <th>Timelapse</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody v-if="companyStore.dataLoaded && companyStore.companysites?.length > 0  && (companyStore.companysites[0].title || companyStore.companysites[0].address) ">
                      <tr class="empty-tr">
                        <td colspan="88"></td>
                      </tr>
                      <template v-if="showEffect">
                        <tr v-for="x in 5" :key="x">
                          <td>
                            <ShimmerEffect
                              bg="light"
                              height="35px"
                              radius="10px"
                            ></ShimmerEffect>
                          </td>
                          <td colspan="7">
                            <ShimmerEffect
                              bg="light"
                              height="35px"
                              radius="10px"
                            ></ShimmerEffect>
                          </td>
                        </tr>
                      </template>
                      <template v-else>
                        <template
                          v-for="(order, index) in companyStore.companysites"
                          :key="index"
                        >
                          <tr>
                            <td>
                              <span
                                v-if="!order.showDetails"
                                @click="
                                  () => {
                                    selectedSite = order;
                                    toggleSubTable(index);
                                  }
                                "
                                class="plus"
                              >
                                {{ expandedIndex === index ? "-" : "+" }}
                              </span>
                            </td>
                            <td class="cp-details-title-td">
                              {{ order.title }}
                            </td>
                            <td class="cp-details-online-td"></td>
                            <td class="cp-details-address-td">
                              {{ order?.address }}
                            </td>
                            <td>{{}}</td>
                            <td>
                              <span
                                :class="
                                  order?.status == 1
                                    ? 'text-success'
                                    : 'text-danger'
                                "
                              >
                                {{ order?.status == 1 ? "Active" : "Inactive" }}
                              </span>
                            </td>
                            <td>
                              <div
                                class="d-flex justify-content-center tableaction-td pt-2"
                              >
                                <p class="me-2" tooltip="camera list" flow="up">
                                  <i
                                    class="las la-eye size-sm cp"
                                    @click="goToCameraListPage(order)"
                                  />
                                </p>
                                <nuxt-link
                                  :to="`/vms/sites/${order.id}/cameras`"
                                >
                                  <p
                                    tooltip="Site's cameras"
                                    flow="up"
                                    @click="goToSiteCameraPage(order)"
                                  >
                                    <i class="las la-camera size-sm cp" />
                                  </p>
                                </nuxt-link>

                              </div>
                            </td>
                          </tr>
                          <!-- Additional rows for expanded details -->
                          <tr
                            v-if="expandedIndex === index"
                            v-for="(item, index2) in order?.details
                              ?.order_items"
                            :key="index2"
                          >
                            <td></td>
                            <td class="cp-details-title-td">
                              <i
                                class="fa fa-caret-right fa-caret-right-green me-2"
                              ></i>
                              {{ item.name }}
                            </td>
                            <td class="cp-details-online-td">
                              <p>
                                {{
                                  companyStore.keyValueMap.get(item.id) ==
                                  "online"
                                    ? "Yes"
                                    : "No"
                                }}
                              </p>
                            </td>
                            <td class="cp-details-address-td"></td>
                            <td>
                              <div class="ionic-toggle mt-3">
                                <label class="ionic-toggle-switch">
                                  <input
                                    type="checkbox"
                                    v-model="item.is_timelapse"
                                    @change="
                                      updateTimelapseStatus(
                                        item,
                                        item.is_timelapse
                                      )
                                    "
                                  />
                                  <div class="toggle-switch-round"></div>
                                </label>
                              </div>
                            </td>
                            <td>
                              <div class="ionic-toggle mt-3">
                                <label
                                  :for="'status-checkbox-' + index2"
                                  class="ionic-toggle-switch"
                                >
                                  <input
                                    type="checkbox"
                                    :id="'status-checkbox-' + index2"
                                    v-model="item.status"
                                    @change="updateStatus(item)"
                                  />
                                  <div class="toggle-switch-round"></div>
                                </label>
                              </div>
                            </td>
                            <td
                              data-field="Actions"
                              data-autohide-disabled="false"
                            >
                              <div
                                class="d-flex justify-content-center tableaction-td pt-2"
                              >
                                <p
                                  tooltip="Timeline"
                                  flow="up"
                                  @click="
                                    navigateTo(
                                      `/vms/cameras/${item.id}/timeline`
                                    )
                                  "
                                >
                                  <i class="las la-eye size-sm cp me-2"></i>
                                </p>
                                <p
                                  tooltip="Timelapse Images"
                                  flow="up"
                                  @click="goToTimeLapseImagePage(item)"
                                >
                                  <i
                                    class="las la-camera size-sm cp"
                                    style="font-size: 16px"
                                  ></i>
                                </p>
                              </div>
                            </td>
                          </tr>
                          <tr
                            v-if="
                              expandedIndex === index &&
                              order?.details?.order_items?.length === 0
                            "
                          >
                            <td colspan="7" class="text-center">
                              No Camera Found
                            </td>
                          </tr>
                        </template>
                      </template>
                    </tbody>
                    <tbody v-else>
                      <tr class="empty-tr">
                        <td colspan="88"></td>
                      </tr>
                      <tr v-if="companyStore.dataLoaded">
                        <td colspan="88" class="mt-1">No Site Found</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Rightbar
      title="Sync Cameras"
      @unmount="closeSynCameraPopup(true)"
      v-if="syncCamera"
    >
      <div class="ionic-card">
        <div class="ionic-card-header bottom-border">
          <h5>Company information</h5>
        </div>
        <div class="ionic-card-body">
          <ul>
            <li class="py-2">
              <strong>Name:</strong> {{ companyStore?.company?.company_name }}
            </li>
            <li class="py-2">
              <strong>EEN Account Name:</strong>
              {{ companyStore?.company?.een_user_account }}
            </li>
            <li class="py-2">
              <strong>Total Camera :</strong>
              {{ companyStore?.companyCameraInfo?.totalEenCameraCount }}
            </li>
            <li class="py-2">
              <strong>Syn With Ionic :</strong>
              {{ companyStore?.company?.cameras?.length }}
            </li>
            <li class="py-2">
              <strong>New Camera :</strong>
              {{ companyStore?.companyCameraInfo?.newCameraCount }}
            </li>
            <li class="py-2">
              <strong>Delete Camera :</strong>
              {{ companyStore?.companyCameraInfo?.deleteCameraCount }}
            </li>
          </ul>
        </div>
      </div>
      <div class="ionic-card mb-3">
        <div class="ionic-card-header bottom-border">
          <h5>Sync new camera</h5>
        </div>
        <div class="ionic-card-body">
          <template v-if="companyStore?.cameraWithSiteSyncFormData?.length">
            <div
              class="row"
              v-for="(
                camera, index
              ) in companyStore?.cameraWithSiteSyncFormData"
              :key="index"
            >
              <div class="col-md-5">
                <div class="form-group">
                  <template v-if="modelEffect">
                    <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                  </template>
                  <template v-else>
                    <div class="mt-3 text-left">
                      <h4>{{ camera?.name }}</h4>
                    </div>
                  </template>
                </div>
              </div>
              <!-- Site -->

              <div class="col-md-5">
                <div class="form-group">
                  <template v-if="modelEffect">
                    <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                  </template>
                  <template v-else>
                    <select
                      class="form-control"
                      v-model="
                        companyStore.cameraWithSiteSyncFormData[index].site_id
                      "
                    >
                      <option :value="null">Select Site</option>
                      <option
                        v-for="(value, index) in companyStore.companyCameraInfo
                          .company.sites"
                        :key="index"
                        :value="value.id"
                      >
                        {{ value.title }}
                      </option>
                    </select>
                  </template>
                </div>
              </div>

              <div class="col-md-2">
                <div class="form-group">
                  <template v-if="modelEffect">
                    <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                  </template>
                  <template v-else>
                    <button
                      type="button"
                      @click="
                        () => {
                          companyStore.cameraWithSiteSyncFormData[
                            index
                          ].checked = true;
                          addEenCameraToIonic(camera.een_camera_id);
                        }
                      "
                      class="ionic-btn ionic-theme-btn2 texes-savebtn"
                    >
                      <i class="la la-plus"></i>
                    </button>
                  </template>
                </div>
              </div>
              <!-- Camera -->
            </div>
            <div>
              <button
                type="button"
                @click="addAllEenCameraToIonic()"
                class="ionic-btn ionic-theme-btn2 save-btn"
              >
                Update All
                <BtnLoader v-if="addCameraBtnLoader" color="black"></BtnLoader>
              </button>
            </div>
          </template>
          <template v-else>
            <div class="text-center"><p>No EEN Cameras Available</p></div>
          </template>
        </div>

        <div class="ionic-card-header bottom-border">
          <h5>Remove camera</h5>
        </div>
        <div class="ionic-card-body">
          <template
            v-if="companyStore?.companyCameraInfo?.company?.cameras?.length"
          >
            <div
              class="row"
              v-for="(camera, index2) in companyStore?.companyCameraInfo
                ?.company?.cameras"
              :key="index2"
            >
              <div class="col-md-5">
                <div class="form-group">
                  <template v-if="modelEffect">
                    <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                  </template>
                  <template v-else>
                    <div class="mt-3 text-left">
                      <h4>{{ camera?.name }}</h4>
                    </div>
                  </template>
                </div>
              </div>
              <!-- Site -->

              <div class="col-md-5">
                <div class="form-group">
                  <template v-if="modelEffect">
                    <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                  </template>
                  <template v-else>
                    <!-- <select
                            class="form-control"
                             
                          >
                          <option :value="null">Select Site</option>
                            <option
                              v-for="(value, index) in companyStore.companyCameraInfo.company.sites"
                              :key="index"
                              :value="value.id"
                              :selected="value.id == camera?.site_id"
                              :disabled="true"
                            >
                              {{ value.title }}
                            </option>
                          </select> -->
                    <div class="mt-3 text-left">
                      <template
                        v-for="(site, index) in companyStore.companyCameraInfo
                          ?.company?.sites"
                        :key="index"
                      >
                        <h4 v-if="site?.id == camera?.site_id">
                          {{ site?.title }}
                        </h4>
                      </template>
                    </div>
                  </template>
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <template v-if="modelEffect">
                    <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                  </template>
                  <template v-else>
                    <button
                      type="button"
                      @click="
                        () => {
                          companyStore.commonCameras[index2].checked = true;
                          deleteCameraFromIonic();
                        }
                      "
                      class="ionic-btn ionic-cancel-btn texes-deletebtn"
                    >
                      <i class="la la-trash"></i>
                    </button>
                  </template>
                </div>
              </div>
              <!-- Camera -->
            </div>
            <div>
              <button
                type="button"
                @click="deleteAllCameraFromIonic()"
                class="ionic-btn ionic-theme-btn2 save-btn mr-2"
              >
                Remove all
                <BtnLoader
                  v-if="deleteCameraBtnLoader"
                  color="balck"
                ></BtnLoader>
              </button>
            </div>
          </template>
          <template v-else>
            <div class="text-center"><p>No Cameras Available</p></div>
          </template>
        </div>
      </div>
    </Rightbar>
    <section
      v-if="companyStore.showCompanyModal"
      class="modal fade addnew-product-modal"
      tabindex="-1"
      style="display: block; opacity: unset"
    >
      <div class="modal-dialog modal-dialog-centered" @click.stop="closeModal">
        <div class="modal-content" @click.stop="false">
          <div class="modal-header">
            <h1 class="modal-title fs-5">
              {{ isEditMode ? "Edit Company" : "Create Company" }}
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
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label">EEN Accounts</label>
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>

                    <template v-else>
                      <select
                        class="form-control"
                        v-model="companyStore.companyData.een_user_account"
                        @change="handleen"
                      >
                        <option :value="null">-Select EEN Accounts-</option>
                        <option
                          v-for="(value, index) in companyStore.eenAccounts"
                          :key="index"
                          :value="value.id"
                          :selected="
                            value.id ==
                            companyStore.companyData.een_user_account
                          "
                        >
                          {{ value.name }}
                        </option>
                      </select>
                    </template>
                  </div>
                </div>

                <!-- Company Name -->
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label">
                      Company Name <span class="required">*</span>
                    </label>
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <input
                        type="text"
                        placeholder="Company Name"
                        class="form-control"
                        v-model="companyStore.companyData.company_name"
                      />
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
                        <el-DropImages
                          v-model="image"
                          :allowMultiple="false"
                          @uploadFile="handleLogoUpload"
                          :showButton="false"
                        ></el-DropImages>
                      </div>
                      <div
                        v-if="companyStore.companyData.logo && !image"
                        class="ionic-img-uploadshow"
                      >
                        <ul>
                          <li>
                            <img
                              :src="companyStore.companyData.logo"
                              class="img-fluid"
                              alt="img uploadshow img"
                              width="50px"
                              height="50px"
                            />
                          </li>
                        </ul>
                      </div>
                    </template>
                  </div>
                </div>
                <!-- Email -->
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label"
                      >Email<span class="required">*</span></label
                    >
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <input
                        type="email"
                        placeholder="Email"
                        class="form-control"
                        v-model="companyStore.companyData.email"
                      />
                    </template>
                  </div>
                </div>
                <!-- Phone -->
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label"
                      >Phone<span class="required">*</span></label
                    >
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <input
                        type="tel"
                        placeholder="Phone"
                        class="form-control"
                        v-model="companyStore.companyData.contact_no"
                      />
                    </template>
                  </div>
                </div>
                <!-- Address -->
                <div class="col-md-12">
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
                        v-model="companyStore.companyData.address"
                      />
                    </template>
                  </div>
                </div>
                <div class="d-flex flex-row">
                  <!-- First Name -->
                  <div class="col-md-6" v-if="!isEditMode">
                    <div class="form-group">
                      <label class="form-label"
                        >First Name<span class="required">*</span></label
                      >
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <input
                          type="text"
                          placeholder="First Name"
                          class="form-control"
                          v-model="companyStore.companyData.first_name"
                        />
                      </template>
                    </div>
                  </div>
                  <!-- Last Name -->
                  <div class="col-md-6" v-if="!isEditMode">
                    <div class="form-group">
                      <label class="form-label"
                        >Last Name <span class="required">*</span></label
                      >
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <input
                          autocomplete="off"
                          autosuggest="false"
                          type="text"
                          placeholder="Last Name"
                          class="form-control"
                          v-model="companyStore.companyData.last_name"
                        />
                      </template>
                    </div>
                  </div>
                </div>
                <div class="d-flex flex-row" v-if="!isEditMode">
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
                          autocomplete="off"
                          autosuggest="false"
                          type="password"
                          placeholder="Password"
                          class="form-control"
                          v-model="companyStore.companyData.password"
                        />
                      </template>
                    </div>
                  </div>
                  <!-- Confirm Password -->
                  <div class="col-md-6" v-if="!isEditMode">
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
                            companyStore.companyData.password_confirmation
                          "
                        />
                      </template>
                    </div>
                  </div>
                </div>
                <!-- Status -->
                <div class="col-md-12">
                  <div class="form-group">
                    <!-- <label class="form-label">Status</label> -->
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <div class="ionic-toggle d-flex justify-content-start">
                        <div>
                          <label class="form-label m-3">Status</label>
                        </div>
                        <div class="form-group mt-2">
                          <label class="ionic-toggle-switch">
                            <input
                              type="checkbox"
                              v-model="companyStore.companyData.status"
                            />
                            <div class="toggle-switch-round"></div>
                          </label>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <div v-if="validationError" class="alert alert-danger">
                  {{ validationError }}
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
                @click="handleSubmit"
              >
                {{ isEditMode ? "Update" : "Save"
                }}<BtnLoader
                  :show="H.isPendingAnyApi('Company:updateCompany')"
                  color="black"
                ></BtnLoader>
              </button>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCompaniesStore } from "~/stores/vms/company";
import { useSitesStore } from "~/stores/vms/sites";
import { useCommonStore } from  "~/stores/Common";
const commonStore  = useCommonStore();
const companyStore = useCompaniesStore();
const siteStore = useSitesStore();
// const companyStore.showCompanyModal = ref(false);

import { useTimelapseStore } from "~/stores/vms/timelapse";
const timelapseStore = useTimelapseStore();

const modelEffect = ref(false);
const showEffect = ref(true);
const isEditMode = ref(false);
const validationError = ref("");
let image = ref(null);
let searched = ref(null);
let syncCamera = ref(false);
// State to track the currently expanded sub-table
const expandedIndex = ref(null);

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});


onMounted(async () => {
  await companyStore.companysitelist(useRoute().params.id);
  commonStore.preloader = true
  await asMounted();
  commonStore.preloader = false
  asMounted();
});
const openUpdateCompanyModal = async () => {
  isEditMode.value = true;
  companyStore.showCompanyModal = true;
};
const closeModal = async () => {
  await resetForm();
  companyStore.showCompanyModal = false;
  await companyStore.showCompany(useRoute().params.id);
};

const handleLogoUpload = () => {
  companyStore.companyData.logo = image.value[0];
};
const resetForm = async () => {
  companyStore.companyData.company_name = "";
  companyStore.companyData.logo = null;
  companyStore.companyData.status = true;
  companyStore.companyData.first_name = "";
  companyStore.companyData.last_name = "";
  companyStore.companyData.contact_no = "";
  companyStore.companyData.address = "";
  companyStore.companyData.email = "";
  companyStore.companyData.password = "";
  companyStore.companyData.password_confirmation = "";
  companyStore.companyData.id = null;
  image.value = null;
  isEditMode.value = false;
  companyStore.companyData.een_user_account = null;
};

const handleSubmit = async () => {
  if (isEditMode.value) {
    if (
      !companyStore.companyData.company_name ||
      !companyStore.companyData.email ||
      !companyStore.companyData.contact_no ||
      !companyStore.companyData.address
    ) {
      validationError.value = "";
      Toaster.error("All fields must be filled out.");
      return;
    }
    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(companyStore.companyData.email)) {
      validationError.value = "Invalid email format.";
      Toaster.error("Invalid email format.");
      return;
    }
  } else {
    if (
      !companyStore.companyData.company_name ||
      !companyStore.companyData.email ||
      !companyStore.companyData.contact_no ||
      !companyStore.companyData.address ||
      !companyStore.companyData.first_name ||
      !companyStore.companyData.last_name ||
      !companyStore.companyData.password
    ) {
      validationError.value = "";
      Toaster.error("All fields must be filled out.");
      return;
    }
    if (companyStore.companyData.password.length < 6) {
      Toaster.error("Password length should be greater than 6");
      return;
    }
    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(companyStore.companyData.email)) {
      validationError.value = "Invalid email format.";
      Toaster.error("Invalid email format.");
      return;
    }
    if (
      companyStore.companyData.password !=
      companyStore.companyData.password_confirmation
    ) {
      Toaster.error("The passwords entered do not match");
      toggleSubTable;
      return;
    }
  }

  // console.log(companyStore.showCompanyModal);
  // if(companyStore.showCompanyModal){
  //   console.log(companyStore.showCompanyModal)
  //   return
  // }

  validationError.value = "";
  if (isEditMode.value) {
    companyStore.updateCompany(
      companyStore.companyData.id,
      companyStore.companyData
    );
  } else {
    companyStore.createCompany(companyStore.companyData);
  }

  await companyStore.showCompany(useRoute().params.id);
};
async function asMounted() {
 
  await companyStore.showCompany(useRoute().params.id);
  await companyStore.getCompanyCameraInfo(useRoute().params.id);
  showEffect.value = false;
  if (companyStore.camera_ids.length > 0) {
    await companyStore.getCameraOfflineOnlineStatus({
      camera_ids: companyStore.camera_ids,
    });
  }
  await companyStore.getEenAccounts();
  companyStore.companyData.password = 12345678;
  companyStore.companyData.password_confirmation = 12345678;
  modelEffect.value = false;
}

const timelapsepage = (siteid, companyid, cameraid) => {
  useCookie("header_site").value = siteid;
  useCookie("header_company").value = companyid;
  useCookie("camera_id").value = cameraid;
};

const searchTable = () => {
  expandedIndex.value = null;
  if (!searched.value) {
    return (expandedIndex.value = null);
  }
  let title = [];
  companyStore.companysites.forEach((data) => {
    title.push(data.title);
  });

  expandedIndex.value = title.findIndex((name) =>
    name.includes(searched.value)
  );
  title.length = 0;
};
let addCameraBtnLoader = ref(false);
let deleteCameraBtnLoader = ref(false);

// Sample static data for the orders
// const companysites = ref([
//   {
//     id: 1,
//     name: "Testing Company",
//     has_rent_item: true,
//     company_address: "Mirpur 10,Round",
//     address: "123 Main St, Cityville",
//     status: 0,

//     details: {
//       order_items: [
//         {
//           id: 1,
//           product: {
//             name: "Camera",
//             type: 2,
//             image: "https://via.placeholder.com/60",
//           },
//           quantity: 1,
//           sub_total: 50,
//           timelapse_status: true,
//         },
//         {
//           id: 2,
//           product: {
//             name: "Lens",
//             type: 1,
//             image: "https://via.placeholder.com/60",
//           },
//           quantity: 2,
//           sub_total: 100,
//           timelapse_status: false,
//         },
//       ],
//     },
//     showDetails: false,
//   },
//   // Add more orders as needed
// ]);

// Function to toggle the sub-table
const toggleSubTable = (index) => {
  expandedIndex.value = expandedIndex.value === index ? null : index;
};
let selectedSite = ref(null);
const goToCameraListPage = async (site) => {
  useCookie("header_company").value = companyStore.companyData.id;
  useCookie("header_site").value = site.id;
  await companyStore.showCompanySite(companyStore.companyData.id);

  setTimeout(() => {
    companyStore.headerSelectedCompany = companyStore.companyData.id;
    siteStore.headerSelectedSite = site.id;
    navigateTo(`/vms/cameras`);
  }, 1000);
};
const goToSiteCameraPage = async (site) => {
  useCookie("header_company").value = companyStore.companyData.id;
  useCookie("header_site").value = site.id;
  await companyStore.showCompanySite(companyStore.companyData.id);
   setTimeout(()=>{
    companyStore.headerSelectedCompany = companyStore.companyData.id
    siteStore.headerSelectedSite = site.id
    navigateTo(`/vms/sites/${site.id}/cameras`)
   }, 1000)

}
const goToCameraTimeline = async (camera) =>{
  console.log("camera", camera)
  useCookie('header_company').value = camera.company_id
  useCookie('header_site').value = camera.site_id
  await companyStore.showCompanySite(camera.company_id);
   setTimeout(()=>{
    companyStore.headerSelectedCompany = camera.company_id
    siteStore.headerSelectedSite = camera.site_id
    navigateTo(`/vms/cameras/${camera.id}/timeline`)
   }, 1000)

}
const goToTimeLapseImagePage = async (camera) =>{
  useCookie("header_site").value = camera.site_id;
  useCookie("header_company").value = camera.company_id;
  useCookie("camera_id").value = camera.id;
  await companyStore.showCompanySite(camera.company_id);
  setTimeout(() => {
    companyStore.headerSelectedCompany = camera.company_id;
    siteStore.headerSelectedSite = camera.site_id;
    timelapseStore.selectedCamera = camera.id;
    navigateTo(
      `/vms/timelapse/images?camera_id=${camera.id}&date=${H.formatDate(
        new Date(),
        "MM-DD-YYYY"
      )}`
    );
  }, 1000);
};
const updateStatus = async (item) => {
  let payload = {
    slug: item.slug,
    status: item.status,
    updated_at: item.updated_at,
    updated_by: item.updated_by,
  };
  await companyStore.updateCameraStatus(item.id, payload);
  Toaster.success("Status Updated");
};

const updateTimelapseStatus = async (item, status) => {
  // let convertstatus = status == true ? 1 : 0;
  let payload = {
    company_id: item.company_id,
    een_camera_id: item.een_camera_id,
    id: item.id,
    is_fav: item.is_fav,
    name: item.name,
    preview: item.preview,
    preview_url: item.preview_url,
    is_timelapse: item.is_timelapse,
    site_id: item.site_id,
    slug: item.slug,
    status: item.status,
    updated_at: item.updated_at,
    updated_by: item.updated_by,
  };
  await companyStore.updateCameraStatus(item.id, payload);
  Toaster.success("Timelapse Updated");
};
function openSynCameraPopup() {
  syncCamera.value = true;
}
function closeSynCameraPopup() {
  syncCamera.value = false;
}
// function openUpdateCompanyModal(){
//   navigateTo(`/vms/companies?company=${useRoute().params.id}`)
// }
async function goToSiteListPage() {
  useCookie("header_company").value = useRoute().params.id;
  companyStore.headerSelectedCompany = useRoute().params.id;
  await companyStore.showCompanySite(useRoute().params.id);
  navigateTo(`/vms/sites?company=${useRoute().params.id}`);
}
async function goToSiteCamerasPage() {
  navigateTo(`/vms/companies/${useRoute().params.id}/camera-wall/gallery`);
}
async function deleteCamera() {
  let removeCamerasIds = [];
  // companyStore.commonCameras.forEach((camera)=>{
  //   removeCamerasIds.push(camera.cemara_id)

  // })
}
async function addEenCameraToIonic(eenCameraId) {
  let een_cameras_to_add = [];
  setTimeout(async () => {
    companyStore.cameraWithSiteSyncFormData.forEach((eenCamera) => {
      if (
        eenCamera.checked == true &&
        eenCamera.site_id &&
        eenCamera.een_camera_id == eenCameraId
      ) {
        een_cameras_to_add.push(eenCamera);
      }
    });
    if (een_cameras_to_add.length > 0) {
      let payload = {
        company_id: useRoute().params.id,
        data: JSON.stringify(een_cameras_to_add),
      };
      await companyStore.addEenCameraToIonic(payload);
      asMounted();
    } else {
      Toaster.error("Please select a site with associated camera");
    }
  }, 100);
}
async function addAllEenCameraToIonic() {
  // companyStore.cameraWithSiteSyncFormData = companyStore.cameraWithSiteSyncFormData.map((eenCamera)=>{
  //       eenCamera.checked = true
  // })
  addCameraBtnLoader.value = true;
  let siteSelectionCount = 0;
  companyStore.cameraWithSiteSyncFormData.forEach((eenCamera) => {
    if (eenCamera.site_id != null) {
      eenCamera.checked = true;
      siteSelectionCount++;
    }
  });
  if (siteSelectionCount == companyStore.cameraWithSiteSyncFormData.length) {
    let payload = {
      company_id: useRoute().params.id,
      data: JSON.stringify(companyStore.cameraWithSiteSyncFormData),
    };
    await companyStore.addEenCameraToIonic(payload);
    await asMounted();
    addCameraBtnLoader.value = false;
  } else {
    Toaster.error("Please assign a site for each camera");
    addCameraBtnLoader.value = false;
  }
}
async function deleteCameraFromIonic() {
  let camera_ids = [];
  setTimeout(async () => {
    companyStore.commonCameras.forEach((camera) => {
      if (camera.checked == true) {
        camera_ids.push(camera.een_camera_id);
      }
    });
    let payload = {
      camera_ids: camera_ids,
    };

    if (camera_ids.length == 0) {
      Toaster.error("Please select a camera");
    } else {
      await companyStore.deleteCameraFromIonic(payload);
      await asMounted();
    }
  }, 100);
}
async function deleteAllCameraFromIonic() {
  deleteCameraBtnLoader.value = true;
  let camera_ids = [];
  setTimeout(async () => {
    companyStore.commonCameras = companyStore.commonCameras.map((camera) => {
      camera.checked = true;
      camera_ids.push(camera.een_camera_id);
    });
    let payload = {
      camera_ids: camera_ids,
    };
    if (cameras_ids.length == 0) {
      Toaster.error("Please select a camera");
    } else {
      await companyStore.deleteCameraFromIonic(payload);
      await asMounted();
    }
    deleteCameraBtnLoader.value = false;
  }, 100);
}
</script>