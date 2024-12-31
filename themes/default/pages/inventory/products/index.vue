<script setup>
import { useProductStore } from "~/stores/rentmy/Product";
import { useTagStore } from "~/stores/rentmy/Tag";
const tagStore = useTagStore();
const productStore = useProductStore();

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: "%s | Products",
});
let showToolsDropdown = ref(false)
let preloader = inject("preloader");
let showEffect = ref(true);
let tableEffect = ref(false);
const tab = ref(1);
const loaderIndex = ref(1);
const showProductModal = ref(false);
const showPackageModal = ref(false);
const modelEffect = ref(true);
let searchParams = reactive({
  location: useCookie("rentmy_location_id").value,
  page_no: 1,
  limit: 20,
  sort_by: "created",
  sort_dir: "DESC",
  rental_type: "all",
  avd_search: true,
});
let bulkProductIds = ref([])
let withDelete = reactive({
  product: null,
  showConfirmation: false,
});
const filteredProducts = computed(() => {
  return productStore?.productList?.filter(product => product.type === tab.value);
});
watch(showProductModal, (a, b) => {
  if (a == true) {
    setTimeout(() => {
      modelEffect.value = false;
    }, 600);
  } else {
    modelEffect.value = true;
    productStore.payload.files = [];
  }
});

watch(showPackageModal, (a, b) => {
  if (a == true) {
    setTimeout(() => {
      modelEffect.value = false;
    }, 600);
  } else {
    modelEffect.value = true;
    productStore.payload.files = [];
  }
});

onMounted(async () => {
  if (useRoute().query.page_no) {
    productStore.pagination.page_no = useRoute().query.page_no;
  }
  await asMounted();
});

async function asMounted() {
  await tagStore.getTagList();
  await productStore.getTaxlist();
  await productStore.getProductList();
  showEffect.value = false;
}
function resetPrice(type) {
  if (type == 1) {
    productStore.payload.name = "";
    productStore.payload.base_price = "";
    productStore.files = null;
    productStore.payload.price.price_type = "3";
    productStore.payload.price.duration_type = "hourly";
    productStore.payload.price.duration = "1";
  } else {
    productStore.payload.price.price = "";
    productStore.payload.price.price_type = "3";
    productStore.payload.price.duration_type = "hourly";
    productStore.payload.price.duration = "";
  }
}
function clearvalue() {
  productStore.payload.name = "";
  productStore.payload.base_price = "";
  productStore.files = null;
  productStore.payload.price.price_type = "3";
  productStore.payload.price.duration_type = "hourly";
  productStore.payload.price.duration = "1";
}
function onImageError(e) {
  e.target.src = "/img/product-image-placeholder.jpg";
}

const router = useRouter();

const editItem = (product) => {
  navigateTo(`/inventory/products/${product.id}/view?type=${product.type}`);
};

async function switchTab(num) {
  isSelectedAll.value = false
  loaderIndex.value = num;
  tableEffect.value = true;
  productStore.pagination.type_id = num
  productStore.pagination.per_page = 1
  await productStore.getProductList();
  H.delay(() => {
    tab.value = num;
    tableEffect.value = false;
  }, 200);
}

async function jumpToPage(page_no) {
  tableEffect.value = true;
  productStore.pagination.page_no = page_no
  await productStore.getProductList();
  tableEffect.value = false;
}

const productExcel = (product) => {
  navigateTo("/inventory/products/product-excel");
};
function openmodal() {
  clearvalue();
  showProductModal.value = true;
}
function closemodal() {
  clearvalue();
  showProductModal.value = false;
}
function clearpackmodal() {
  productStore.packagePayload.name = "";
  productStore.packagePayload.product_type = 1;
  productStore.packagePayload.description = "";
  productStore.packagePayload.client_specific_id = null;
  productStore.packagePayload.sales_tax = null;
  productStore.packagePayload.deposit_amount = null;
  productStore.packagePayload.image = "";
  productStore.packagePayload.quantity = [
    {
      quantity: 0,
      location_id: useCookie('rentmy_location_id').value,  // Reset with dynamic location_id
      label: "default location"
    }
  ];
  productStore.packagePayload.base_price = "";
  productStore.packagePayload.tags = "";
  productStore.packagePayload.keyword = "";
  productStore.packagePayload.supplier_id = "";
  productStore.packagePayload.supply_id = "";
  productStore.packagePayload.client_specific_id = "";
  productStore.packagePayload.sales_tax = null;
  productStore.packagePayload.deposit_amount = "";
  productStore.packagePayload.driving_license = false;
  productStore.packagePayload.featured = false;
  productStore.packagePayload.free_shipping = false;
  productStore.packagePayload.is_default_weight = true;
  productStore.packagePayload.weight_amount = "";
  productStore.packagePayload.weight_unit = "pound";
  productStore.packagePayload.is_tracked = 0;
  productStore.packagePayload.height = "";
  productStore.packagePayload.width = "";
  productStore.packagePayload.length = "";
  productStore.packagePayload.ship_own_box = false;
  productStore.packagePayload.sequence_no = 50;
  productStore.packagePayload.price = {
    price_type: 3,
    additional_duration: "",
    additional_range: "",
    additional_price: "",
    duration_type: "hourly",
    duration: "1",
    price: ""
  };
  productStore.packagePayload.type = 2;
  productStore.packagePayload.status = 1;
  productStore.files = null;
}




function closepackmodal() {
  showPackageModal.value = false;
  clearpackmodal();
}
function showpackmodal() {
  showPackageModal.value = true;
  clearpackmodal();
}
let isSelectedAll = ref(false)
function selectAllProduct(){
  setTimeout(()=>{
    if(isSelectedAll.value){
      let productIds = productStore.productList.map((item)=>{
        return item.id
      })
      bulkProductIds.value = productIds
    }else{
      bulkProductIds.value = []
    }
  }, 100)
}
 function updateSelectedAllValue(){
  console.log('hello', bulkProductIds.value.length)
  setTimeout(()=>{
    if(productStore.productList.length != bulkProductIds.value.length){
      isSelectedAll.value = false
    }else{
      isSelectedAll.value = true
    }
  }, 100)
 }
let showBulkDeleteButtonLoader = ref(false)
let showBulkDeleteModal = ref(false)
let showAssignedOrder = ref(false)
let showBulkDeleteResponseModal = ref(false)
let toolDropdownValue = ref(null)
function openBulkDeleteModal(){
  toolDropdownValue.value = 'delete'; 
  if(toolDropdownValue.value == 'delete' && bulkProductIds.value.length){
    showBulkDeleteModal.value = true
  }else{
    Toaster.error('Select Product First')
  }
}

</script>

<template>
  <div>
    <div class="d-flex justify-content-between mb-3"> 
      <div> 
        <Breadcrumb title="Product List" :links="['products']"></Breadcrumb>
      </div>
      <div class="d-flex"> 
        <ul class="rightside-navmenu">
          <li class="leap-admin-right-dropdown">
            <a
              class="leap-admin-dropdown-link security-guard-menulink cp" :style="{height:'35px'}"
              @click="showToolsDropdown = !showToolsDropdown"
            >
              <i class="la la-briefcase security-icon"></i>
              Tools
              <i class="la la-angle-down ms-3"></i>
            </a>
            <!-- popup -->
            <ul
              id="rentalDropdown"
              class="leap-admin-rightside-dropdown arrow-black --animate-show cp"
              :style="showToolsDropdown ? 'display: block' : 'display: none'"
               @mouseleave="showToolsDropdown = false"
            >
              <li>
                <div class="leap-admin-rightside-body radius-5 shadow">
                  <ul class="leap-admin-userprofile-menu w-100">
                    <h6 class="app-name" @click="openBulkDeleteModal()">
                      <i class="bx bxs-store"></i> Bulk Delete
                    </h6>
                  </ul>
                </div>
              </li>
            </ul>
          </li>
        </ul>
       
      </div>
  

    </div>
   
    <div class="row">
      <div class="col-lg-6">
        <div class="ionic-card">
          <div class="ionic-card-header card-header-border">
            <h4 class="fs-20" >Inventory</h4>
            <div class="card-header-rightside">
              <button
                class="ionic-btn ionic-theme-btn"
                @click.stop="productExcel()"
              >
                <i class="la la-download"></i>Import
              </button>
              <!-- <button class="ionic-btn ionic-theme-btn"><i class="la la-upload"></i>Export</button> -->
            </div>
          </div>
          <div class="ionic-card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label">Rental Type</label>
                  <template v-if="showEffect">
                    <ShimmerEffect
                      bg="dark"
                      width="100%"
                      height="48px"
                      radius="15px"
                    ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <select
                      class="form-control"
                      v-model="productStore.pagination.rental_type"
                      @change="productStore.getProductList()"
                    >
                      <option :value="null">Select</option>
                      <option value="buy">Buy</option>
                      <option value="rent">Rent</option>
                      <option value="all">All</option>
                    </select>
                  </template>
                </div>
              </div>
              <!-- <div class="col-md-4">
                <div class="form-group">
                  <label class="form-label">Template Structure</label>
                  <template v-if="showEffect">
                    <ShimmerEffect bg="dark" width="100%" height="48px" radius="15px" ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <select class="form-control">
                      <option>All</option>
                      <option>Template-1</option>
                      <option>Template-2</option>
                      <option>Template-3</option>
                    </select>
                  </template>                  
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label class="form-label">Price Ruleset</label>
                  <template v-if="showEffect">
                    <ShimmerEffect bg="dark" width="100%" height="48px" radius="15px" ></ShimmerEffect>
                  </template>
                  <template v-else>
                    <select class="form-control">
                      <option>All</option>
                      <option>Product Type1</option>
                      <option>Product Type2</option>
                      <option>Product Type3</option>
                      <option>Product Type4</option>
                    </select>
                  </template>                    
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="ionic-card">
          <div class="ionic-card-header card-header-border">
            <h4 class="fs-20">Tags</h4>
            <div class="card-header-rightside"></div>
          </div>
          <div class="ionic-card-body">
            <div
              class="itemlist-border taglist-item overflow-y-auto"
              style="max-height: 100px"
            >
              <template v-if="!showEffect">
                <ul>
                  <template v-if="tagStore.tagList">
                    <template
                      v-for="(tag, index) in tagStore.tagList"
                      :key="index"
                    >
                      <li class="cp" v-if="tag.status">{{ tag.name }}</li>
                    </template>
                  </template>
                </ul>
              </template>
              <template v-else>
                <ul>
                  <ShimmerEffect
                    count="8"
                    bg="dark"
                    width="120px"
                    height="34px"
                    class="me-2 mb-3"
                    radius="30px"
                  >
                  </ShimmerEffect>
                </ul>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-12">
      <div class="ionic-tab">
        <ul>
          <li>
            <a :class="{ 'tab-active': tab === 1 }" @click="switchTab(1)"
              >Products
              <BtnLoader
                :show="
                  !showEffect &&
                  loaderIndex == 1 &&
                  H.isPendingAnyApi('Product:list')
                "
              />
            </a>
          </li>
          <li class="tab-devided"></li>
          <li>
            <a :class="{ 'tab-active': tab === 2 }" @click="switchTab(2)"
              >Bundle
              <BtnLoader
                :show="
                  !showEffect &&
                  loaderIndex == 2 &&
                  H.isPendingAnyApi('Product:list')
                "
              />
            </a>
          </li>
        </ul>
      </div>

      <div class="ionic-card ionic-tab-card">
        <div class="ionic-card-header m-card-header">
          <h4 class="fs-18">Products</h4>
          <div class="card-header-rightside">
            <button
              @click="openmodal"
              class="ionic-btn ionic-theme-btn2 addnew-product-btn"
            >
              Add New Product
            </button>
            <button
              @click="showpackmodal"
              class="ionic-btn ionic-theme-btn2 addnew-product-btn"
            >
              Add New Package
            </button>
          </div>
        </div>
        <div class="ionic-card-body pt-0">
          <div class="table-responsive">
            <table class="table table-borderless">
              <thead>
                <tr>
                  <th>
                    <label class="checkbox checkbox-pos-inline checkbox-list-view">
                      <input type="checkbox" v-model="isSelectedAll" @click="selectAllProduct()"><span></span>
                    </label>
                  </th>
                  <th>Image</th>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Buy price</th>
                  <th>Rent price</th>
                  <th>Status</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>
              <tbody @click="H.toggleLoopItem(productStore.productList, -1)">
                <tr class="empty-tr">
                  <td colspan="88"></td>
                </tr>
                <template v-if="!showEffect && !tableEffect">
                  <template v-if="productStore?.productList?.length">
                    <template
                      v-for="(product, index) in productStore.productList"
                      :key="index"
                    >
                      <tr v-if="tab == 1 && product.type == 1">
                        <td>
                          <label class="checkbox checkbox-pos-inline checkbox-list-view">
                            <input type="checkbox" :value="product.id" @change="updateSelectedAllValue()" v-model="bulkProductIds"><span></span>
                          </label>
                        </td>
                        <td>
                          <div class="table-imgbox d-flex justify-content-start ">
                            <div class="table-img">
                              <img 
                                :src="
                                  RentmyHelper.product.image(
                                    product?.id,
                                    product?.image
                                  )
                                "
                                @error="onImageError"
                                alt="table product img"
                              />
                            </div>
                            <h6
                              class="fs-12 cp m-3"
                              @dblclick="log(product)"
                              @click.stop="editItem(product)"
                            >
                              
                            </h6>
                          </div>
                        </td>
                        <td>
                          <nuxt-link :to="`/inventory/products/${product.id}/view?type=${product.type}`">
                            {{product.id}}
                          </nuxt-link>
                        </td>
                        <td>{{ product?.name}}</td>
                        <td>
                          {{ product?.quantity}}
                        </td>
                        <td>
                          {{  product?.price[0]['base']?.price }}
                        </td>
                        <!-- <td>
                          {{ product?.price[0]['hourly'] ? RentmyHelper.currency.format(product?.price[0]['hourly'][0]?.price) : (product?.price[0]['daily'] ? RentmyHelper.currency.format(product?.price[0]['daily'][0]?.price) : RentmyHelper.currency.format(product?.price[0]['monthly'][0]?.price ) )}}
                        </td> -->
                        <td>
                          {{ product?.price[0].hasOwnProperty('hourly') ? RentmyHelper.currency.format(product?.price[0]['hourly'][0]?.price) : (product?.price[0].hasOwnProperty('daily') ? RentmyHelper.currency.format(product?.price[0]['daily'][0]?.price) :( product?.price[0].hasOwnProperty('monthly') ? RentmyHelper.currency.format(product?.price[0]['monthly'][0]?.price  ) : '' ) )}}
                        </td>
                        <td>
                          <span
                            v-if="product.status == 1"
                            class="activestatus-btn"
                            >Active 
                          </span>
                          <span
                            v-else-if="product.status == 5"
                            class="redstatus-btn"
                            >Deleted <i class="las la-trash-alt ms-2 fs-15"></i
                          ></span>
                          <span v-else class="redstatus-btn"
                            >Inactive
                            <i class="las la-low-vision ms-2 fs-15"></i
                          ></span>
                        </td>
                      
                        <td>
                          <div class="table-action">
                            <div
                              class="table-actionicon"
                              @click.stop="
                                H.toggleLoopItem(
                                  productStore.productList,
                                  index
                                )
                              "
                            >
                              <i class="las la-ellipsis-v"></i>
                            </div>
                            <div
                              v-if="product.isShow"
                              class="table-action-body"
                              @click.stop="false"
                            >
                              <nuxt-link
                                :to="`/inventory/products/${product.id}/calendar`"
                              >
                                <i class="las la-calendar"></i> Calendar
                              </nuxt-link>
                              <a @click.stop="editItem(product)">
                                <i class="las la-edit"></i> Edit
                              </a>
                              <a
                                @click.stop="
                                  withDelete.product = product;
                                  withDelete.showConfirmation = true;
                                "
                              >
                                <i class="las la-trash-alt"></i> Delete
                              </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="tab == 2 && product.type == 2">
                        <td>
                          <label class="checkbox checkbox-pos-inline checkbox-list-view">
                            <input type="checkbox" :value="product.id" v-model="bulkProductIds"><span></span>
                          </label>
                        </td>
                        <td>
                          <div class="table-imgbox d-flex align-items-center">
                            <div class="table-img">
                              <img
                                :src="
                                  RentmyHelper.product.image(
                                    product?.id,
                                    product?.image
                                  )
                                "
                                @error="onImageError"
                                alt="table product img"
                              />
                            </div>
                          </div>
                        </td>
                        <td>{{product.id}}</td>
                        <td>{{ product?.name}}</td>
                        <td>
                          {{ product?.quantity}}
                        </td>
                        <td>
                          {{  product?.price[0]['base']?.price }}
                        </td>
                        <!-- <td>
                          {{ product?.price[0]['hourly'] ? RentmyHelper.currency.format(product?.price[0]['hourly'][0]?.price) : (product?.price[0]['daily'] ? RentmyHelper.currency.format(product?.price[0]['daily'][0]?.price) : RentmyHelper.currency.format(product?.price[0]['monthly'][0]?.price ) )}}
                        </td> -->
                        <td>
                          {{ product?.price[0].hasOwnProperty('hourly') ? RentmyHelper.currency.format(product?.price[0]['hourly'][0]?.price) : (product?.price[0].hasOwnProperty('daily') ? RentmyHelper.currency.format(product?.price[0]['daily'][0]?.price) :( product?.price[0].hasOwnProperty('monthly') ? RentmyHelper.currency.format(product?.price[0]['monthly'][0]?.price  ) : '' ) )}}
                        </td>
                        <td>
                          <span
                            v-if="product.status == 1"
                            class="activestatus-btn"
                            >Active <i class="la la-eye ms-2 fs-15"></i
                          ></span>
                          <span
                            v-else-if="product.status == 5"
                            class="redstatus-btn"
                            >Deleted <i class="las la-trash-alt ms-2 fs-15"></i
                          ></span>
                          <span v-else class="redstatus-btn"
                            >Inactive
                            <i class="las la-low-vision ms-2 fs-15"></i
                          ></span>
                        </td>
                      
                        <td>
                          <div class="table-action">
                            <div
                              class="table-actionicon"
                              @click.stop="
                                H.toggleLoopItem(
                                  productStore.productList,
                                  index
                                )
                              "
                            >
                              <i class="las la-ellipsis-v"></i>
                            </div>
                            <div
                              v-if="product.isShow"
                              class="table-action-body"
                              @click.stop="false"
                            >
                              <nuxt-link
                                :to="`/inventory/products/${product.id}/calendar`"
                              >
                                <i class="las la-calendar"></i> Calendar
                              </nuxt-link>
                              <a @click.stop="editItem(product)">
                                <i class="las la-edit"></i> Edit
                              </a>
                              <a
                                @click.stop="
                                  withDelete.product = product;
                                  withDelete.showConfirmation = true;
                                "
                              >
                                <i class="las la-trash-alt"></i> Delete
                              </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </template>
                </template>
                <template v-else>
                  <tr
                    v-for="x in productStore?.productList?.length || 5"
                    :key="x"
                  >
                    <td colspan="1">
                      <div class="d-flex align-items-center">
                        <ShimmerEffect
                          width="50px"
                          height="50px"
                          class="me-2"
                          radius="10px"
                        ></ShimmerEffect>
                      </div>
                    </td>
                    <td colspan="6">
                      <ShimmerEffect></ShimmerEffect>
                    </td>
                    <td colspan="1">
                      <ShimmerEffect width="60px"></ShimmerEffect>
                    </td>                    
                  </tr>
                </template>
              </tbody>
            </table>

            <template v-if="showEffect">
              <div class="d-flex justify-content-end align-items-center my-3">
                <ShimmerEffect
                  bg="dark"
                  width="64px"
                  height="12px"
                  class="me-4"
                  speed="1s"
                  radius="2px"
                  :stopAnimaiton="false"
                ></ShimmerEffect>
                <ShimmerEffect
                  bg="dark"
                  width="64px"
                  height="12px"
                  class="me-4"
                  speed="1s"
                  radius="2px"
                  :stopAnimaiton="false"
                ></ShimmerEffect>
                <ShimmerEffect
                  bg="dark"
                  width="64px"
                  height="12px"
                  class="me-4"
                  speed="1s"
                  radius="2px"
                  :stopAnimaiton="false"
                ></ShimmerEffect>

                <ShimmerEffect
                  bg="dark"
                  width="32px"
                  height="32px"
                  class="me-2"
                  speed="1s"
                  :stopAnimaiton="false"
                ></ShimmerEffect>
                <ShimmerEffect
                  bg="dark"
                  width="32px"
                  height="32px"
                  class="me-2"
                  speed="1s"
                  :stopAnimaiton="false"
                ></ShimmerEffect>
                <ShimmerEffect
                  bg="dark"
                  width="32px"
                  height="32px"
                  class="me-2"
                  speed="1s"
                  :stopAnimaiton="false"
                ></ShimmerEffect>
                <ShimmerEffect
                  bg="dark"
                  width="32px"
                  height="32px"
                  class="me-2"
                  speed="1s"
                  :stopAnimaiton="false"
                ></ShimmerEffect>
              </div>
            </template>
            <template v-else>
              <div class="d-flex justify-content-end align-items-center my-3">
                <p class="me-4">
                  <strong class="text-white-50">
                    <!-- Total: {{ productStore.paginateData?.total }}
                    <span class="mx-3">|</span> -->
                    Page: {{ productStore.paginateData?.page_no }}
                    <span class="mx-3">|</span>
                    Showing: {{ filteredProducts?.length || 0 }}
                  </strong>
                </p>

                <PaginationRentMy
                  v-model="productStore.paginateData"
                  @jump-now="jumpToPage"
                ></PaginationRentMy>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== Modal==================== -->
    <!-- ==================== Modal==================== -->
    <!-- ==================== Modal==================== -->

    <Modal-Confirm
      v-if="withDelete.showConfirmation"
      v-model="withDelete.showConfirmation"
      :skipAutoClose="false"
      @yes="
        async () => {
          if(productStore.productList.length == 1 && productStore.pagination.page_no != '1'){
            productStore.pagination.page_no = productStore.pagination.page_no - 1
          }
          await productStore.deleteProduct(withDelete.product.id);
          await productStore.getProductList()
          withDelete.showConfirmation = false;
        }
      "
    >
      <template v-if="withDelete.product?.status == 5">
        Are you sure you want to Delete?
      </template>
      <template v-else>
        Archiving this product will remove it from availablity. Continue?
      </template>
      <template #btn-yes>
        <BtnLoader :show="H.isPendingAnyApi('Product:productDelete')" />
      </template>
    </Modal-Confirm>

    <Modal-Confirm
      v-if="showBulkDeleteModal"
      v-model="showBulkDeleteModal"
      :skipAutoClose="true"
      @yes="
        async () => {

          showBulkDeleteButtonLoader = true
          if(productStore.productList.length == bulkProductIds){
            productStore.pagination.page_no =  productStore.pagination.page_no != '1' ? productStore.pagination.page_no - 1 :  productStore.pagination.page_no
          }
          await productStore.deleteBulkProducts({product_id: bulkProductIds});
          bulkProductIds = []
          toolDropdownValue = null
          showBulkDeleteButtonLoader = false
          showBulkDeleteModal = false;
          if(productStore.bulkDeleteResponse.status == 'NOK'){
            showBulkDeleteResponseModal = true
          } 
        }
      "
    >
        Are you sure you want to Delete?
      <template #btn-yes>
        <BtnLoader :show="showBulkDeleteButtonLoader" />
      </template>
    </Modal-Confirm>

    <section
      v-if="showProductModal"
      class="modal fade addnew-product-modal"
      tabindex="-1"
      style="display: block; opacity: unset"
    >
      <div
        class="modal-dialog modal-dialog-centered"
        @click.stop="showProductModal = false"
      >
        <div class="modal-content" @click.stop="false">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Add New Product</h1>
            <button
              @click.stop="closemodal"
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
                    <label class="form-label">Product Name</label>
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <input
                        type="text"
                        placeholder=""
                        class="form-control"
                        v-model="productStore.payload.name"
                      />
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
                        <el-DropImages
                          v-model="productStore.files"
                          :allowMultiple="false"
                          @uploadFile="
                            () => {
                              productStore.imageSaveBeforeProductCreate();
                            }
                          "
                          :showButton="false"
                        ></el-DropImages>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <div class="product-typearea">
                <h4 class="fs-18">Product Type</h4>
                <template v-if="modelEffect">
                  <template v-for="x in 3" :key="x">
                    <div class="w-100 mb-2">
                      <div class="d-flex">
                        <ShimmerEffect
                          class="me-3"
                          width="24px"
                          height="24px"
                          radius="50px"
                          bg="dark"
                        ></ShimmerEffect>
                        <ShimmerEffect
                          width="180px"
                          bg="dark"
                          height="24px"
                        ></ShimmerEffect>
                      </div>
                    </div>
                  </template>
                </template>
                <template v-else>
                  <div class="product-typeradio">
                    <label class="radio">
                      <input
                        type="radio"
                        name="product_type"
                        value="2"
                        v-model="productStore.payload.product_type"
                        @click="resetPrice(2)"
                        :checked="productStore.payload.product_type == 2"
                      />
                      Sale Item
                      <span></span>
                    </label>
                    <label class="radio">
                      <input
                        type="radio"
                        name="product_type"
                        value="1"
                        v-model="productStore.payload.product_type"
                        @click="resetPrice(1)"
                        :checked="productStore.payload.product_type == 1"
                      />
                      Rental product
                      <span></span>
                    </label>
                  </div>
                </template>
                <div class="row mt-4">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">Product Quantity</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <input
                          v-keep-only-digits
                          type="text"
                          class="form-control"
                          v-model="productStore.payload.quantity[0].quantity"
                        />
                      </template>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">SKU</label>
                      <template v-if="modelEffect">
                        <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                      </template>
                      <template v-else>
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Your SKU"
                          v-model="productStore.payload.client_specific_id"
                        />
                      </template>
                    </div>
                  </div>
                  <!-- <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">Sales Tax</label>
                      <template v-if="modelEffect">
                        <div class="w-100">
                          <div class="d-flex">                           
                            <ShimmerEffect
                              bg="dark"
                              height="52px"
                            ></ShimmerEffect>
                          </div>
                        </div>
                      </template>
                      <template v-else>                      
                    
                        <select class="form-control" v-model="productStore.payload.sales_tax" >
                          <option value=""> -Select- </option>
                          <template v-for="(tax, i) in productStore.taxList?.classes" :key="i">
                            <option :value="tax.id"> {{ tax?.name }} </option>
                          </template>                          
                        </select>                        
                      </template>
                    </div>
                  </div> -->
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">Deposit Amount</label>
                      <div class="input-group">
                        <template v-if="modelEffect">
                          <div class="w-100">
                            <div class="d-flex">
                              <ShimmerEffect
                                bg="dark"
                                height="52px"
                                width="40px"
                                class="me-2"
                              ></ShimmerEffect>
                              <ShimmerEffect
                                bg="dark"
                                height="52px"
                              ></ShimmerEffect>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <span class="input-group-text" id="basic-addon1"
                            >$</span
                          >
                          <input v-keep-only-digits-with-dot                         
                            type="text"
                            placeholder="0.00"
                            v-model="productStore.payload.deposit_amount"
                            class="form-control"
                          />                         
                        </template>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-label">Price</label>
                      <div class="input-group">
                        <template v-if="modelEffect">
                          <div class="w-100">
                            <div class="d-flex">
                              <ShimmerEffect
                                bg="dark"
                                height="52px"
                                width="40px"
                                class="me-2"
                              ></ShimmerEffect>
                              <ShimmerEffect
                                bg="dark"
                                height="52px"
                              ></ShimmerEffect>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <span class="input-group-text" id="basic-addon1"
                            >$</span
                          >
                          <input v-keep-only-digits-with-dot
                            v-if="productStore.payload.product_type == 1"
                            type="text"
                            placeholder="0.00"
                            v-model="productStore.payload.price.price"
                            class="form-control"
                          />
                          <input
                            v-else
                            v-keep-only-digits-with-dot
                            type="text"
                            placeholder="0"
                            v-model="productStore.payload.base_price"
                            class="form-control"
                          />
                        </template>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6" v-if="productStore.payload.product_type == 1" >
                    <div class="form-group">
                      <label class="form-label">Rental Duration</label>
                      <template v-if="modelEffect">
                        <div class="w-100">
                          <div class="d-flex">
                            <ShimmerEffect
                              bg="dark"
                              height="52px"
                            ></ShimmerEffect>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <select
                          class="form-control"
                          v-model="productStore.payload.price.duration_type"
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </template>
                    </div>
                  </div>                             
                  <div class="col-md-12 mt-3">

                    <h4>Product Tracking</h4>
                    <p>You can track details of a specific item in your inventory by using assets?</p>

                    <template v-if="modelEffect">
                      <template v-for="x in 3" :key="x">
                        <div class="w-100 mb-2">
                          <div class="d-flex">
                            <ShimmerEffect
                              class="me-3"
                              width="24px"
                              height="24px"
                              radius="50px"
                              bg="dark"
                            ></ShimmerEffect>
                            <ShimmerEffect
                              width="180px"
                              bg="dark"
                              height="24px"
                            ></ShimmerEffect>
                          </div>
                        </div>
                      </template>
                    </template>
                    <template v-else>
                      <div class="product-typeradio mt-3">
                        <label class="radio">
                          <input
                            type="radio"
                            name="is_tracked"
                            :value="productStore.payload.is_tracked"
                            @click="productStore.payload.is_tracked = 0"
                            :checked="!productStore.payload.is_tracked"
                          />
                          Track quantity only
                          <span></span>
                        </label>
                        <label class="radio">
                          <input
                            type="radio"
                            name="is_tracked"
                            :value="productStore.payload.is_tracked"
                            @click="productStore.payload.is_tracked = 1"
                            :checked="productStore.payload.is_tracked"
                          />
                          Track specific assets
                          <span></span>
                        </label>
                      </div>
                    </template>
                  </div>                             
                </div>
              </div>
             
              <div class="product-visible">
                <h4 class="fs-18">Visible to the site</h4>
                <div class="product-visible-btn">
                  <template v-if="modelEffect">
                    <div class="w-100">
                      <div class="d-flex">
                        <ShimmerEffect
                          bg="dark"
                          height="42px"
                          width="100px"
                          radius="30px"
                          class="me-3"
                        ></ShimmerEffect>
                        <ShimmerEffect
                          bg="dark"
                          height="42px"
                          width="100px"
                          radius="30px"
                        ></ShimmerEffect>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <span
                      class="activestatus-btn me-3 cp"
                      @click="productStore.payload.status = 1"
                      >Visible
                      <i
                        v-if="productStore.payload.status == 1"
                        class="la la-check ms-2"
                      ></i
                    ></span>
                    <span
                      class="redstatus-btn cp"
                      @click="productStore.payload.status = 2"
                      >Hidden
                      <i
                        v-if="productStore.payload.status == 2"
                        class="la la-check ms-2"
                      ></i
                    ></span>
                  </template>
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
                @click="closemodal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="ionic-btn ionic-theme-btn2 save-btn"
                @click="productStore.createProduct"
              >
              
                Save
                <BtnLoader
                  v-if="H.isPendingAnyApi('Product:create')"
                  color="black"
                ></BtnLoader>
              </button>
            </template>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="showPackageModal"
      class="modal fade addnew-product-modal"
      tabindex="-1"
      style="display: block; opacity: unset"
    >
      <div
        class="modal-dialog modal-dialog-centered"
        @click.stop="showPackageModal = false"
      >
        <div class="modal-content" @click.stop="false">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Add New Package</h1>
            <button
              @click.stop="closepackmodal"
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
                    <label class="form-label">Package Name</label>
                    <template v-if="modelEffect">
                      <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                    </template>
                    <template v-else>
                      <input
                        type="text"
                        placeholder=""
                        class="form-control"
                        v-model="productStore.packagePayload.name"
                      />
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
                        <el-DropImages
                          v-model="productStore.files"
                          :allowMultiple="false"
                          @uploadFile="
                            () => {
                              productStore.imageSaveBeforeProductCreate();
                            }
                          "
                          :showButton="false"
                        ></el-DropImages>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <div class="product-typearea">
                <div class="row">
                  <h4 class="fs-18">Package Type</h4>
                  <template v-if="modelEffect">
                    <template v-for="x in 3" :key="x">
                      <div class="w-100 mb-2">
                        <div class="d-flex">
                          <ShimmerEffect
                            class="me-3"
                            width="24px"
                            height="24px"
                            radius="50px"
                            bg="dark"
                          ></ShimmerEffect>
                          <ShimmerEffect
                            width="180px"
                            bg="dark"
                            height="24px"
                          ></ShimmerEffect>
                        </div>
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <div class="product-typeradio">
                      <label class="radio">
                        <input
                          type="radio"
                          name="product_type"
                          value="2"
                          v-model="productStore.packagePayload.product_type"
                          @click="resetPrice(2)"
                          :checked="productStore.packagePayload.product_type == 2"
                        />
                        Sale
                        <span></span>
                      </label>
                      <label class="radio">
                        <input
                          type="radio"
                          name="product_type"
                          value="1"
                          v-model="productStore.packagePayload.product_type"
                          @click="resetPrice(1)"
                          :checked="productStore.packagePayload.product_type == 1"
                        />
                        Rental
                        <span></span>
                      </label>
                    </div>
                  </template>
                  <div class="row mt-4">
                    <div class="col-md-6">
                      <label class="form-label">Package Quantity</label>
                      <div class="form-group">
                        <template v-if="modelEffect">
                          <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                        </template>
                        <template v-else>
                          <input v-keep-only-digits
                            type="text"
                            class="form-control"
                            min="1"
                            v-model="
                              productStore.packagePayload.quantity[0].quantity
                            "
                          />
                        </template>
                      </div>
                    </div>  



                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-label">SKU</label>
                        <template v-if="modelEffect">
                          <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                        </template>
                        <template v-else>
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Your SKU"
                            v-model="productStore.packagePayload.client_specific_id"
                          />
                        </template>
                      </div>
                    </div>
                    <!-- <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-label">Sales Tax</label>
                        <template v-if="modelEffect">
                          <div class="w-100">
                            <div class="d-flex">
                              <ShimmerEffect
                                bg="dark"
                                height="52px"
                              ></ShimmerEffect>
                            </div>
                          </div>
                        </template>
                        <template v-else>                      
                      
                          <select class="form-control" v-model="productStore.packagePayload.sales_tax" >
                            <option value=""> -Select- </option>
                            <template v-for="(tax, i) in productStore.taxList?.classes" :key="i">
                              <option :value="tax.id"> {{ tax?.name }} </option>
                            </template>                          
                          </select>                        
                        </template>
                      </div>
                    </div> -->
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-label">Deposit Amount</label>
                        <div class="input-group">
                          <template v-if="modelEffect">
                            <div class="w-100">
                              <div class="d-flex">
                                <ShimmerEffect
                                  bg="dark"
                                  height="52px"
                                  width="40px"
                                  class="me-2"
                                ></ShimmerEffect>
                                <ShimmerEffect
                                  bg="dark"
                                  height="52px"
                                ></ShimmerEffect>
                              </div>
                            </div>
                          </template>
                          <template v-else>
                            <span class="input-group-text" id="basic-addon1"
                              >$</span
                            >
                            <input v-keep-only-digits-with-dot                                                  
                              type="text"
                              placeholder="0.00"
                              v-model="productStore.packagePayload.deposit_amount"
                              class="form-control"
                            />                         
                          </template>
                        </div>
                      </div>
                    </div>




                    
                    

                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-label">Price</label>
                        <div class="input-group">
                          <template v-if="modelEffect">
                            <div class="w-100">
                              <div class="d-flex">
                                <ShimmerEffect
                                  bg="dark"
                                  height="52px"
                                  width="40px"
                                  class="me-2"
                                ></ShimmerEffect>
                                <ShimmerEffect
                                  bg="dark"
                                  height="52px"
                                ></ShimmerEffect>
                              </div>
                            </div>
                          </template>
                          <template v-else>
                            <span class="input-group-text" id="basic-addon1"
                              >$</span
                            >
                            <input v-keep-only-digits-with-dot
                              v-if="productStore.packagePayload.product_type == 1"
                              type="text"
                              placeholder="0.00"
                              v-model=" productStore.packagePayload.price.price"
                              class="form-control"
                            />
                            <input v-keep-only-digits-with-dot
                              v-else
                              type="text"
                              placeholder="0.00"
                              v-model="productStore.packagePayload.base_price"
                              class="form-control"
                            />
                          </template>
                        </div>
                    </div>
                    </div>
                    <div class="col-md-6" v-if="productStore.packagePayload.product_type == 1" > <div class="form-group">
                        <label class="form-label">Rental Duration</label>
                        <template v-if="modelEffect">
                          <div class="w-100">
                            <div class="d-flex">
                              <ShimmerEffect
                                bg="dark"
                                height="52px"
                              ></ShimmerEffect>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <select class="form-control" v-model=" productStore.packagePayload.price.duration_type " >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </template>
                      </div>
                    </div>
                  </div>

                </div>
              
              </div>
              <div class="product-visible">
                <h4 class="fs-18">Visible to the site</h4>
                <div class="product-visible-btn">
                  <template v-if="modelEffect">
                    <div class="w-100">
                      <div class="d-flex">
                        <ShimmerEffect
                          bg="dark"
                          height="42px"
                          width="100px"
                          radius="30px"
                          class="me-3"
                        ></ShimmerEffect>
                        <ShimmerEffect
                          bg="dark"
                          height="42px"
                          width="100px"
                          radius="30px"
                        ></ShimmerEffect>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <span
                      class="activestatus-btn me-3 cp"
                      @click="productStore.packagePayload.status = 1"
                      >Visible
                      <i
                        v-if="productStore.packagePayload.status == 1"
                        class="la la-check ms-2"
                      ></i
                    ></span>
                    <span
                      class="redstatus-btn cp"
                      @click="productStore.packagePayload.status = 2"
                      >Hidden
                      <i
                        v-if="productStore.packagePayload.status == 2"
                        class="la la-check ms-2"
                      ></i
                    ></span>
                  </template>
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
                @click="closepackmodal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="ionic-btn ionic-theme-btn2 save-btn"
                @click="productStore.createPackage"
              >
                Save
                <BtnLoader
                  v-if="H.isPendingAnyApi('Product:create')"
                  color="black"
                ></BtnLoader>
              </button>
            </template>
          </div>
        </div>
      </div>
    </section>


    <section
      v-if="showBulkDeleteResponseModal"
      class="modal fade addnew-product-modal"
      tabindex="-1"
      style="display: block; opacity: unset"
    >
      <div
        class="modal-dialog modal-dialog-centered"
        @click.stop="showBulkDeleteResponseModal = false"
      >
        <div class="modal-content" @click.stop="false">
          <div class="modal-header"style="border-bottom: none;">
            <button
              @click.stop="showBulkDeleteResponseModal=false; showAssignedOrder = false"
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
            <template v-if="!showAssignedOrder"> 
              <h5>Warning - Product(s) selected have been (or currently are) assigned to orders. Deleting products will affect reporting.</h5>
              <br>
              <h5><a @click.stop="showAssignedOrder=true" class="text-primary cp">Click here</a> to view orders where these products appear.</h5>
            </template>
            <template v-else> 
              <h3>Selected products appear on the following order(s).</h3>
              <br>
              <div class="table-responsive">
                <table class="table table-borderless">
                  <thead>
                    <tr>
                      <th>Product id</th>
                      <th>Name</th>
                      <th>Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="empty-tr">
                      <td colspan="88"></td>
                    </tr>
                      <tr
                        v-for="(order, index) in productStore?.bulkDeleteResponse?.result.orders"
                        :key="index"
                      > 
                        <td>{{  order.product.id }} </td>
                        <td>{{  order.product.name }} </td>
                        <td>
                          <span v-for="(order, index) in  order.orders.split(',')" :key="index">
                            {{ order }} ,
                            <br v-if="index % 4 != 0">
                          </span> 
                        </td>
                      </tr>
                  </tbody>
                </table>
              </div>
              <br>
              <h5>Remove product(s) from the above orders to continue with product selection.</h5>
            </template>
             
            
             
            </div>
          </div>
          <div class="modal-footer justify-content-between ps-0 pe-0">
              <button
                type="button"
                class="ionic-btn ionic-border-btn cancel-btn"
                @click="showBulkDeleteResponseModal=false; showAssignedOrder = false"
              >
                Cancel
              </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
