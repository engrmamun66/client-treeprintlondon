<template>
  <div>
    <Breadcrumb
      title="Coupons"
      :links="['settings', 'settings_coupon']"
    ></Breadcrumb>
    <div class="ionic-card ionic-filter-card">
      <div class="ionic-card-body">
        <div class="filters-section">
          <div class="row">
            <!-- First Row of Fields in a Single Row -->
            <div class="col-md-3 col-sm-3">
              <div>
                <order-productSearch
                  ref="searchedProducts"
                  label=""
                  @select="(product) => selectProduct(product.name, product.id)"
                ></order-productSearch>
              </div>
              <div class="selected-products">
                <div
                  v-for="(product, index) in selectedProductName"
                  :key="index"
                  class="product-card"
                >
                  {{ product }}
                  <span @click="removeProduct(index)" class="remove-icon"
                    >×</span
                  >
                </div>
              </div>
            </div>

            <div
              v-if="userCouponStore.SearchedProducts?.length"
              :hidden="SearchModal"
              class="product-modal"
              @click="closeSearchModal"
            >
              <div
                v-for="(product, index) in userCouponStore.SearchedProducts"
                :key="index"
                class="product-item"
              >
                <p @click="selectProduct(product.name, product.id)">
                  {{ product.name }}
                </p>
              </div>
            </div>

            <div class="col-md-2 col-sm-3">
              <div class="select-optionbox">
                <select class="form-control" v-model="Search.type">
                  <option value="2">Automatic</option>
                  <option value="1">Code</option>
                </select>
              </div>
            </div>

            <div class="col-md-2 col-sm-3 mobile-mt">
              <input
                type="text"
                v-model="Search.code"
                placeholder="Coupon Code"
                class="form-control"
              />
            </div>

            <div class="col-md-2 col-sm-3 mt-sm-4 mt-md-0 mobile-mt">
              <input
                type="text"
                v-model="Search.amount"
                placeholder="Discount Amount"
                class="form-control"
              />
            </div>

            <div class="col-md-3 col-sm-6 mobile-mt">
              <Picker-EmDateTimePicker
                ref="startDate"
                v-model="createCoupon.start_time"
                :showValueIf="createCoupon.start_time"
                :placeholder="start_date"
                @change="slogs"
                :options="{
                  ...globalData.datePickerOptions,
                  adjustX: 0,
                  adjustY: 0,
                  displayIn: 'bottom_right',
                  rangePicker: true,
                  useCustomRange: [
                    'Yesterday',
                    'Today',
                    'Tomorrow',
                    'Last 7 Days',
                    'Last 30 Days',
                    'Month',
                    'Last Month',
                    'Auto Months',
                  ],
                }"
              />
            </div>
          </div>

          <!-- Second Row for Buttons -->
          <div class="row mt-2">
            <div class="col-md-12 d-flex justify-content-start">
              <button
                @click="handleSearch"
                type="button"
                class="ionic-btn ionic-theme-btn2 ionic-btnlg ms-0"
              >
                <i class="las la-search"></i>Search
                <BtnLoader
                  :show="H.isPendingAnyApi('Settings:couponSearch')"
                  color="black"
                />
              </button>

              <button
                type="button"
                @click="resetSearch"
                class="ionic-btn ionic-cancel-btn ionic-btnlg ms-2"
              >
                <i class="las la-redo-alt me-2"></i>Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Date Range Selection -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Select Date Range</h3>
        <ul class="date-options">
          <li @click="selectDateRange('Yesterday')">Yesterday</li>
          <li @click="selectDateRange('Today')">Today</li>
          <li @click="selectDateRange('Tomorrow')">Tomorrow</li>
          <li @click="selectDateRange('Last 7 Days')">Last 7 Days</li>
          <li @click="selectDateRange('Last 30 Days')">Last 30 Days</li>
          <li @click="selectDateRange('This Month')">This Month</li>
          <li @click="selectDateRange('Last Month')">Last Month</li>
          <li @click="customRange = true">Custom Range</li>
        </ul>

        <div v-if="true" class="custom-range">
          <Picker-EmDateTimePicker
            ref="startDatePicker"
            v-model="customStartDate"
            :placeholder="start_date"
            :options="{
              ...globalData.datePickerOptions,

              adjustX: -20,
              adjustY: -500,
            }"
          />
          <Picker-EmDateTimePicker
            class="mt-2"
            ref="endDatePicker"
            v-model="customEndDate"
            :placeholder="end_date"
            :options="{
              ...globalData.datePickerOptions,

              adjustX: -20,
              adjustY: -500,
            }"
          />
        </div>
        <button
          @click="selectCustomRange"
          :hidden="!customRange"
          type="button"
          class="ionic-btn ionic-theme-btn2 w-20 mt-2"
        >
          Apply
        </button>
        <button
          type="button"
          class="ionic-btn ionic-border-btn cancel-btn mt-2"
          @click="closeModal"
        >
          Cancel
        </button>
      </div>
    </div>

    <div class="ionic-card">
      <div
        class="ionic-card-header card-header-border d-flex justify-content-between align-items-center"
      >
        <h4 class="fs-18">Coupons</h4>
        <div class="card-header-rightside">
          <button
            @click="openCouponPopup"
            class="ionic-btn ionic-theme-btn2 addnew-product-btn"
          >
            <i class="las la-plus"></i> Add Coupons
          </button>
        </div>
      </div>

      <!-- Table code started -->

      <div class="ionic-card-body">
        <div class="table-responsive">
          <table class="table table-borderless">
            <thead>
              <tr>
                <th>Id</th>
                <th>Product Name</th>
                <th>Code</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Quantity Range</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="empty-tr">
                <td colspan="5"></td>
              </tr>
              <template v-if="userCouponStore.showTableEffect">
                <tr v-for="(x, index) in 4" :key="index">
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
                <tr v-for="(Coupon, index) in userCouponStore.Coupons">
                  <td>{{ Coupon.id }}</td>
                  <td>-</td>
                  <td>{{ Coupon.code }}</td>
                  <td>{{ formatDate(Coupon.start_time) }}</td>
                  <td>{{ formatDate(Coupon.end_time) }}</td>
                  <td>
                    {{
                      Coupon.max_quantity - Coupon.min_quantity === 0
                        ? "-"
                        : `${Coupon.min_quantity} - ${Coupon.max_quantity}`
                    }}
                  </td>

                  <td>{{ Coupon.amount }} {{ Coupon.unit_type == 2 ? "$" : "%" }}</td>
                  <td>
                    <span
                      :class="
                        Coupon.status == true ? 'text-success' : 'text-danger'
                      "
                    >
                      {{ Coupon.status == true ? "Active" : "Inactive" }}
                    </span>
                  </td>
                  <td>
                    <div
                      class="d-flex justify-content-center tableaction-td pt-2"
                    >
                      <p tooltip="Edit" flow="up">
                        <i-las
                          t="edit"
                          class="size-sm cp"
                          @click="getEachCoupon(Coupon.id)"
                        />
                      </p>
                      <p tooltip="Delete" flow="up">
                        <i-las
                          t="trash"
                          class="size-sm cp"
                          @click="userCouponStore.deleteCoupon(Coupon.id)"
                        />
                      </p>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <div class="d-flex justify-content-end align-items-center my-3 pb-4">
        <p class="me-4">
          <strong class="text-white-50">
            Total: {{ userCouponStore.paginateData?.total }}

            <span class="mx-3">|</span>
            Page: {{ userCouponStore.paginateData?.page }}
            <span class="mx-3">|</span>
            Showing: {{ userCouponStore.paginateData?.data?.length }}
          </strong>
        </p>
        <PaginationRentMy
          v-model="userCouponStore.paginateData"
          @jump-now="userCouponStore.jumpToPage"
        ></PaginationRentMy>
      </div>

      <!-- Table code Ended -->
    </div>

    <div>
      <Rightbar
        title="Add Coupon"
        @unmount="closeSynCameraPopup(true)"
        v-if="userCouponStore.couponModal"
      >
        <div>
          <div class="ionic-card-body">
            <div class="col-md-4 col-sm-4">
              <label class="form-label">Type</label>
              <ShimmerEffect
                bg="dark"
                height="35px"
                radius="10px"
                v-if="showCouponModalEffect"
              ></ShimmerEffect>
              <div class="select-optionbox" :hidden="showCouponModalEffect">
                <select class="form-control" v-model="createCoupon.type">
                  <option value="1">Coupon Code</option>
                  <option value="2">Automatic</option>
                </select>
              </div>
            </div>

            <div class="col-md-4 col-sm-4 mt-4" v-if="createCoupon.type != 2">
              <ShimmerEffect
                bg="dark"
                height="35px"
                radius="10px"
                v-if="showCouponModalEffect"
              ></ShimmerEffect>
              <label class="form-label">Discount Code </label>

              <div style="position: relative">
                <div
                  class="d-flex justify-content-between"
                  style="position: absolute; top: -24px; right: 10px"
                >
                  <ShimmerEffect
                    bg="dark"
                    height="35px"
                    radius="10px"
                    v-if="showCouponModalEffect"
                  ></ShimmerEffect>

                  <p
                    class="mb-1 hover-text"
                    @click="genarateCode"
                    :hidden="showCouponModalEffect"
                  >
                    Genarate Code
                  </p>
                </div>

                <input
                  :hidden="showCouponModalEffect"
                  type="text"
                  v-model="createCoupon.code"
                  placeholder="Discount Code"
                  class="form-control"
                />
                <BtnLoader
                  :show="H.isPendingAnyApi('Coupon:getCouponCode')"
                  color="white"
                  class="input-loader-discount"
                />
              </div>
            </div>
            <label
              class="form-label"
              style="position: absolute; margin-top: 30px; left: 1px"
              >Unit Type
            </label>
            <div class="mt-5 d-flex align-items-start">
              <ShimmerEffect
                bg="dark"
                height="35px"
                radius="10px"
                v-if="showCouponModalEffect"
              ></ShimmerEffect>

              <div
                class="col-md-4 col-sm-4 select-optionbox"
                :hidden="showCouponModalEffect"
              >
                <select class="form-control" v-model="createCoupon.unit_type">
                  <option value="1">Percentage (%)</option>
                  <option value="2">Fixed discount ($)</option>
                </select>
              </div>

              <div class="col-md-4 col-sm-4 mx-5">
                <ShimmerEffect
                  bg="dark"
                  height="35px"
                  radius="10px"
                  v-if="showCouponModalEffect"
                ></ShimmerEffect>

                <label
                  class="form-label"
                  style="position: absolute; margin-top: -18px"
                >
                  {{
                    !showCouponModalEffect
                      ? createCoupon.unit_type == 2
                        ? "Amount"
                        : "Percentage"
                      : ""
                  }}

                  <span
                    v-if="!showCouponModalEffect"
                    style="color: red; font-size: 1.2rem"
                    >*</span
                  ></label
                >

                <div class="input-group" :hidden="showCouponModalEffect">
                  <span
                    class="input-group-text"
                    id="table-cost-addon"
                    v-if="createCoupon.unit_type == 2"
                    >$</span
                  >
                  <input
                    type="text"
                    v-model="createCoupon.amount"
                    :placeholder="
                      createCoupon.unit_type == 2
                        ? 'Enter Amount'
                        : 'Enter Percentage'
                    "
                    class="form-control"
                    aria-describedby="table-cost-addon"
                  />
                  <span
                    class="input-group-text"
                    id="table-cost-addon"
                    v-if="createCoupon.unit_type == 2"
                    >USD</span
                  >
                  <span
                    class="input-group-text"
                    id="table-cost-addon"
                    v-if="createCoupon.unit_type == 1"
                    >%</span
                  >
                </div>
              </div>
            </div>

            <div class="product-typeradio mt-4">
              <h5 class="mb-3">Applies To</h5>
              <ShimmerEffect
                bg="dark"
                height="35px"
                radius="10px"
                v-if="showCouponModalEffect"
              ></ShimmerEffect>
              <ShimmerEffect
                class="mt-2"
                bg="dark"
                height="35px"
                radius="10px"
                v-if="showCouponModalEffect"
              ></ShimmerEffect>
              <ShimmerEffect
                class="mt-2"
                bg="dark"
                height="35px"
                radius="10px"
                v-if="showCouponModalEffect"
              ></ShimmerEffect>
              <label class="radio" :hidden="showCouponModalEffect">
                <input
                  type="radio"
                  v-model="createCoupon.applies_to"
                  name="product_type"
                  value="order"
                  @click="openNumber = false"
                />
                Entire Order
                <span></span>
              </label>
              <label class="radio" :hidden="showCouponModalEffect">
                <input
                  type="radio"
                  v-model="createCoupon.applies_to"
                  name="product_type"
                  value="product"
                  @click="openNumber = false"
                />
                Specific Product
                <span></span>
              </label>
              <label
                class="radio"
                v-if="createCoupon.type == 2"
                :hidden="showCouponModalEffect"
              >
                <input
                  type="radio"
                  v-model="createCoupon.applies_to"
                  id="delivey"
                  name="product_type"
                  value="delivery"
                />
                Delivery
                <span></span>
              </label>
            </div>
            <div
              class="d-flex flex-column"
              v-if="
                (createCoupon.type == 1 && createCoupon.applies_to == 'order') ||(createCoupon.type == 1 && createCoupon.applies_to == 'product')
              "
            >
              <ShimmerEffect
                class="mt-2"
                bg="dark"
                height="35px"
                radius="10px"
                v-if="showCouponModalEffect"
              ></ShimmerEffect>

              <div class="mb-2 mt-4" :hidden="showCouponModalEffect">
                <h5>Usage Limits</h5>
              </div>

              <div
                class="d-flex align-items-center mb-2"
                :hidden="showCouponModalEffect"
              >
                <input
                  v-if="!showCouponModalEffect "
                  class="form-check-input in-dark-bg"
                  type="checkbox"
                  :checked="createCoupon.uses_limit > 0 || openNumber"
                  @click="openNumber = !openNumber"
                />

                <h5 class="mx-3 mb-0 mt-1" :hidden="showCouponModalEffect">
                  Limit number of times this discount can be used in total
                </h5>
              </div>
            </div>

            <div
              class="col-md-4 col-sm-4 mt-3"
              v-if="
                (createCoupon.type == 1 &&
                openNumber &&
                createCoupon.applies_to == 'order') || (createCoupon.type == 1 &&
                openNumber &&
                createCoupon.applies_to == 'product') 
              "
            >
              <input
                type="text"
                v-model="createCoupon.uses_limit"
                placeholder="Number"
                class="form-control"
              />
            </div>

            <div
              class="col-md-4 col-sm-4 mt-4"
              v-if="createCoupon.applies_to == 'product'"
            >
              <order-productSearch
                ref="searchedProductsCoupon"
                label="Product Serach"
                @select="
                  (product) => selectProductCoupon(product.name, product.id)
                "
              ></order-productSearch>

              <div class="selected-products">
                <div
                  v-for="(product, index) in selectedProductNameCoupon"
                  :key="index"
                  class="product-card"
                >
                  {{ product }}
                  <span
                    @click="removeProductCoupon(index)"
                    class="remove-icon size-1p1"
                    >×</span
                  >
                </div>
              </div>
            </div>
            <div
              class="d-flex mt-3"
              v-if="
                (createCoupon.type == 2 &&
                  createCoupon.applies_to == 'product') || (createCoupon.type == 2 &&
                  createCoupon.applies_to == 'order')
              "
            >
              <div class="col-md-4 col-sm-4 d-flex flex-column">
                <label class="form-label">Minimum Single Product Quantity</label>
                <div class="input-group">
                  <input
                    type="text"
                    v-model="createCoupon.min_quantity"
                    placeholder="Minimum Quantity"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="col-md-4 col-sm-4 d-flex flex-column mx-5">
                <label class="form-label">Maximum Single Product Quantity</label>
                <div class="input-group">
                  <input
                    type="text"
                    v-model="createCoupon.max_quantity"
                    placeholder="Maximum Quantity"
                    class="form-control"
                  />
                </div>
              </div>
            </div>

            <div
              class="product-typeradio mt-4"
              v-if="createCoupon.applies_to == 'delivery'"
            >
              <h5 class="mb-3">Apply discount to orders:</h5>

              <!-- First Row: "Over" Option -->
              <div class="row align-items-center mb-3">
                <div class="col-md-3 col-sm-4">
                  <label class="radio">
                    <input
                      type="radio"
                      name="discountOption"
                      id="over"
                      value="over"
                      v-model="dicountOrders.option"
                      :checked="userCouponStore.EachCoupon?.order_amount > 0"
                      @click="discount('over')"
                    />
                    Over
                    <span></span>
                  </label>
                </div>

                <div class="col-md-4 col-sm-4">
                  <ShimmerEffect
                    class="mt-2"
                    bg="dark"
                    height="35px"
                    radius="10px"
                    v-if="showCouponModalEffect"
                  ></ShimmerEffect>
                  <div class="input-group" :hidden="showCouponModalEffect">
                    <span class="input-group-text" id="table-cost-addon"
                      >$</span
                    >
                    <input
                      type="text"
                      v-model="createCoupon.order_amount"
                      placeholder="Amount"
                      class="form-control"
                      aria-describedby="table-cost-addon"
                    />
                    <span
                      class="input-group-text usd-text"
                      id="table-cost-addon"
                      >USD</span
                    >
                  </div>
                </div>
              </div>

              <!-- Second Row: "Longer than" Option -->
              <div class="row align-items-center">
                <div class="col-md-3 col-sm-4">
                  <label class="radio">
                    <input
                      type="radio"
                      name="discountOption"
                      id="days"
                      value="days"
                      v-model="dicountOrders.option"
                      :checked="userCouponStore.EachCoupon?.rental_length > 0"
                      @click="discount('days')"
                    />
                    Longer than
                    <span></span>
                  </label>
                </div>

                <div class="col-md-4 col-sm-4">
                  <div class="input-group">
                    <input
                      type="text"
                      v-model="createCoupon.rental_length"
                      class="form-control"
                      aria-describedby="table-cost-addon"
                    />
                    <span
                      class="input-group-text usd-text"
                      id="table-cost-addon"
                      >days</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex">
              <!-- Start Date Section -->
              <div
                class="col-md-4 col-sm-4 d-flex flex-column justify-content-evenly mt-3 custom-range"
              >
                <label class="form-label">Start Date</label>
                <Picker-EmDateTimePicker
                  ref="startDate"
                  v-model="createCoupon.start_time"
                  :showValueIf="createCoupon.start_time"
                  :placeholder="start_date"
                  :options="{
                    ...globalData.datePickerOptions,
                    adjustX: -20,
                    displayIn: 'bottom_right',
                    adjustY: -500,
                  }"
                />
              </div>

              <!-- End Date Section -->
              <div
                class="col-md-4 col-sm-4 d-flex flex-column justify-content-evenly mt-3 custom-range mx-5"
              >
                <label class="form-label">End Date</label>
                <Picker-EmDateTimePicker
                  ref="endDate"
                  v-model="createCoupon.end_time"
                  :placeholder="end_date"
                  :options="{
                    ...globalData.datePickerOptions,
                    adjustX: -50,
                    adjustY: -500,
                    displayIn: 'bottom_right',
                  }"
                />
              </div>
            </div>

            <div class="col-md-4 col-sm-4 mt-4">
              <label class="form-label">Status</label>
              <select class="form-control" v-model="createCoupon.status">
                <option value="1">Active</option>
                <option value="2">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="mt-4">
            <button
              type="button"
              @click="handleSubmit"
              class="ionic-btn ionic-theme-btn2 save-btn ms-0"
            >
              {{ updateModal ? "Update" : "Submit" }}
              <BtnLoader
                v-if="
                  H.isPendingAnyApi(
                    'Settings:createCoupon|Settings:updateCoupon'
                  )
                "
                color="black"
              ></BtnLoader>
            </button>
          </div>
        </template>
      </Rightbar>
    </div>
  </div>
</template>
<script setup>
import { useCouponstore } from "~/stores/rentmy/settings/Coupon.js";


// Page meta
definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

// Page title
useHead({
  titleTemplate: "%s | Coupons",
});


// Refs for UI controls
const start_date = ref("Select Date Range");
let startDate = ref(null);
let endDate = ref(null);
const end_date = ref("End Date");
const showModal = ref(false);
let showCouponModalEffect = ref(false);
const customRange = ref(false);
const selectedDateRange = ref("");
const customStartDate = ref("");
const customEndDate = ref("");
const selectedProductName = ref([]);
const selectedProductNameCoupon = ref([]);
const productId = ref([]);
const productIdCoupon = ref([]);

let searchedProductsCoupon = ref(null);
let openNumber = ref(false);
let showEffect = ref(true);
let updateModal = ref(false);

// Search parameters
let Search = ref({
  page_no: 1,
  limit: 20,
  type: 1,
  code: null,
  amount: null,
  start_date: null,
  end_date: null,
  products: null,
});

let dicountOrders = ref({
  over: "order",
  days: "days",
});

let createCoupon = ref({
  amount: null,
  applies_to: "order",
  code: null,
  delivery_discount_type: null,
  end_time: null,
  limit_to_order: null,
  max_quantity: null,
  min_quantity: null,
  order_amount: null,
  products: null,
  rental_length: null,
  start_time: null,
  product_id: [],
  status: 1,
  type: 1,
  unit_type: 1,
  uses_limit: 0,
});

// Refs for search results
let searchedProducts = ref(null);
let SearchModal = ref(false);
let SearchModalCoupon = ref(false);
let CouponId = ref(null);

// Store instance
const userCouponStore = useCouponstore();

function handleSearch() {
  // (console.log(Search.value.start_date);)
  // (console.log(Search.value.end_date);)

  if (createCoupon.value?.start_time != null) {
    const searchedDate = createCoupon.value?.start_time.split(" - ");
    // (console.log("=====*(*))", searchedDate[0]);
    Search.value.start_date = searchedDate[0];
    Search.value.end_date = searchedDate[1];
  }

  Search.value.products = productId.value.join(",");
  userCouponStore.couponSearch(Search.value);
}

async function genarateCode() {
  await userCouponStore.getCouponCode();
  createCoupon.value.code = userCouponStore.couponCode;
}

async function getEachCoupon(id) {
  if (!id) {
    return;
  }
  H.withUrl.setQuery({ couponId: id });
  resetCouponModal();
  showCouponModalEffect.value = true;
  CouponId.value = id;
  updateModal.value = true;
  userCouponStore.couponModal = true;
  await userCouponStore.getOneCoupon(id);

  // (console.log(userCouponStore.EachCoupon.amount);)
  createCoupon.value.amount = userCouponStore.EachCoupon.amount;
  createCoupon.value.applies_to = userCouponStore.EachCoupon.applies_to;
  createCoupon.value.code = userCouponStore.EachCoupon.code;
  createCoupon.value.delivery_discount_type =
    userCouponStore.EachCoupon.delivery_discount_type;
  createCoupon.value.end_time = userCouponStore.EachCoupon.end_time;
  createCoupon.value.limit_to_order = userCouponStore.EachCoupon.limit_to_order;
  createCoupon.value.max_quantity = userCouponStore.EachCoupon.max_quantity;
  createCoupon.value.min_quantity = userCouponStore.EachCoupon.min_quantity;
  createCoupon.value.order_amount = userCouponStore.EachCoupon.order_amount;
  createCoupon.value.products = userCouponStore.EachCoupon.products;
  createCoupon.value.rental_length = userCouponStore.EachCoupon.rental_length;
  createCoupon.value.start_time = "23 Aug, 2024";
  createCoupon.value.product_id = userCouponStore.EachCoupon.product_id;
  createCoupon.value.status =
    userCouponStore.EachCoupon.status == true ? "1" : "2";
  createCoupon.value.type = userCouponStore.EachCoupon.type;
  createCoupon.value.unit_type = userCouponStore.EachCoupon.unit_type;
  createCoupon.value.uses_limit = userCouponStore.EachCoupon.uses_limit;
  userCouponStore.EachCoupon.products.forEach((data) => {
    productIdCoupon.value.push(data.id);
    selectedProductNameCoupon.value.push(data.name);
  });

  // (console.log(userCouponStore.EachCoupon.start_time);)
  startDate.value.setDate(userCouponStore.EachCoupon.start_time);
  endDate.value.setDate(userCouponStore.EachCoupon.end_time);
  showCouponModalEffect.value = false;
  if (createCoupon.value.uses_limit > 0) {
    openNumber.value = true;
  }
}

function discount(data) {
  // (console.log(data);)
  if (data == "days") {
    createCoupon.value.order_amount = null;
  } else {
    createCoupon.value.rental_length = null;
  }
}

function handleSubmit() {
  if (createCoupon.value.amount == null || !createCoupon.value.amount) {
    userCouponStore.couponModal = true;
    Toaster.error("Please fill all the required field");
    return;
  } else {
    if(createCoupon.value.status == 1){
      createCoupon.value.status = "true"
    }else{
      createCoupon.value.status = "false"
    }
    if (createCoupon.value.applies_to != "product") {
      createCoupon.value.product_id != [];
      createCoupon.value.products = null;
    }
    if (updateModal.value) {
      userCouponStore.updateCoupon(CouponId.value, createCoupon.value);
    } else {
      userCouponStore.createCoupon(createCoupon.value);
    }
  }
}

// Functions

async function SearchProducts(params) {
  if (!params.length) {
    SearchModal.value = true;
    return;
  }

  await userCouponStore.productSearch(params);

  if (userCouponStore.SearchedProducts?.length > 0) {
    SearchModal.value = false;
  }
}

let searchedResultCoupon = ref(null);
// Functions

async function SearchProductsCoupon(params) {
  if (!params.length) {
    SearchModalCoupon.value = true;
    searchedResultCoupon.value = null;
    return;
  }
  SearchModal.value = true;

  await userCouponStore.productSearch(params);

  if (userCouponStore.SearchedProducts?.length > 0) {
    SearchModalCoupon.value = false;
    searchedResultCoupon.value = userCouponStore.SearchedProducts;
    SearchModal.value = true;
    // (console.log("======", searchedResultCoupon.value);)
  }
}

function closeSearchModal() {
  SearchModal.value = true;
  updateModal.value = false;
  resetCouponModal();
}
function closeSearchModalCoupon() {
  SearchModalCoupon.value = true;
}

function resetSearch(data) {
  if (data !== "modal") {
    userCouponStore.getCouponList();
  }

  selectedProductName.value.length = 0;
  Search.value = {
    amount: null,
    code: null,
    end_date: null,
    start_date: null,
    limit: null,
    products: null,
    type: 1,
  };
  createCoupon.value.start_time = null;
  customEndDate.value = null;
  customStartDate.value = null;
  selectedDateRange.value = null;
  searchedProducts.value.clear()
}

function selectProduct(name, id) {
  selectedProductName.value.push(name);
  productId.value.push(id);
  searchedProducts.value = null;
}

function selectProductCoupon(name, id) {
  selectedProductNameCoupon.value.push(name);
  productIdCoupon.value.push(id);
  createCoupon.value.product_id = [...productIdCoupon.value];
  searchedProducts.value = null;
  searchedProductsCoupon.value.clear();
}

function removeProduct(index) {
  selectedProductName.value.splice(index, 1);
  productId.value.splice(index, 1);
}
function removeProductCoupon(index) {
  selectedProductNameCoupon.value.splice(index, 1);
  productIdCoupon.value.splice(index, 1);
  createCoupon.value.product_id = [...productIdCoupon.value];
}

const selectDateRange = (range) => {
  const today = new Date();
  let startDate, endDate;

  switch (range) {
    case "Yesterday":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 1);
      endDate = new Date(startDate);
      break;
    case "Today":
      startDate = today;
      endDate = today;
      break;
    case "Tomorrow":
      startDate = new Date(today);
      startDate.setDate(today.getDate() + 1);
      endDate = new Date(startDate);
      break;
    case "Last 7 Days":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      endDate = today;
      break;
    case "Last 30 Days":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      endDate = today;
      break;
    case "This Month":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = today;
      break;
    case "Last Month":
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "Custom Range":
      startDate = customStartDate.value;
      endDate = customEndDate.value;
      break;
    default:
      startDate = null;
      endDate = null;
  }

  const formatDateForAPI = (date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split("T")[0];
  };

  if (startDate && endDate) {
    Search.value.start_date = formatDateForAPI(startDate);
    Search.value.end_date = formatDateForAPI(endDate);
    selectedDateRange.value =
      range === "Custom Range"
        ? `From ${formatDate(startDate)} To ${formatDate(endDate)}`
        : range;
  } else {
    Search.value.start_date = null;
    Search.value.end_date = null;
    selectedDateRange.value = "";
  }

  selectedDateRange.value = `From ${Search.value.start_date} To ${Search.value.end_date}`;
  showModal.value = false;
};

function slogs() {
  // (console.log(createCoupon.value.start_time);)
}

const selectCustomRange = () => {
  selectedDateRange.value = `From ${customStartDate.value} To ${customEndDate.value}`;
  showModal.value = false;
  customRange.value = false;
};

const closeModal = () => {
  showModal.value = false;
  customRange.value = false;
};

function resetCouponModal() {
  createCoupon.value = {
    amount: null,
    applies_to: "order",
    code: null,
    delivery_discount_type: null,
    end_time: null,
    limit_to_order: null,
    max_quantity: null,
    min_quantity: null,
    order_amount: null,
    products: null,
    rental_length: null,
    start_time: null,
    product_id: [],
    status: 1,
    type: 1,
    unit_type: 1,
    uses_limit: 0,
  };
  productIdCoupon.value.length = 0;
  selectedProductNameCoupon.value.length = 0;
  updateModal.value = false
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function openCouponPopup() {
  userCouponStore.couponModal = true;
  resetCouponModal();
  userCouponStore.SearchedProducts = null;
  resetSearch("modal");
  H.withUrl.setQuery({ action: "add" });
}
function closeSynCameraPopup() {
  userCouponStore.couponModal = false;
  // (console.log("+++++======>>>>");)
  updateModal.value = false;
}

// Lifecycle hooks
onMounted(async () => {
  await userCouponStore.getCouponList();
  showEffect.value = false;
  if (useRoute().query?.action || useRoute().query?.couponId) {
    getEachCoupon(useRoute().query?.couponId);
    userCouponStore.couponModal = true;
  }
});


</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: rgb(0, 0, 0);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.date-options {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.date-options li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.date-options li:hover {
  background-color: #5a5757;
}

.custom-range {
  margin-top: 20px;
}

.custom-range input {
  width: 100%;
  margin-bottom: 10px;
}

.btn {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}
.product-modal {
  position: absolute;
  top: 30%;
  left: 0;
  width: 20%;
  background-color: #000000;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.product-modal-coupon {
  position: absolute;
  top: 62%;
  left: 0;
  width: 20%;
  background-color: #000000;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.product-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.product-item:hover {
  background-color: #313131;
}
.selected-products {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
.remove-icon {
  margin-left: 8px;
  cursor: pointer;
  color: red;
}

.remove-icon:hover {
  color: darkred;
}
.product-card {
  background-color: #333333;
  border-color: rgb(17, 255, 17);
  border-width: 20px;
  border-radius: 5px;
  padding: 8px 12px;
  margin-right: 5px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.usd-text {
  font-family: sans-serif;
  color: #fdfdfd; /* Green color */
  background-color: #f0f0f0; /* Light grey background */
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-container {
  position: relative;
}

.input-loader {
  position: absolute;
  top: 35%;
  right: 10px;
  transform: translateY(-50%);
}

.input-loader-discount {
  position: absolute;
  top: 40%;
  right: 1rem;
  transform: translateY(-50%);
  z-index: 10; /* Ensure it stays above the input field */
}

.hover-text {
  color: #37c923; /* Original color */
}

.hover-text:hover {
  cursor: pointer;
  color: #38ff1e; /* Deeper green color on hover */
}

/* Custom margin for small devices */
@media (max-width: 767.98px) {
  .mobile-mt {
    margin-top: 1.5rem; /* Adjust this value as needed */
  }
}

/* Reset margin for larger devices */
@media (min-width: 768px) {
  .mobile-mt {
    margin-top: 0;
  }
}
</style>
