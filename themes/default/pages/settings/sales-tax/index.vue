<script setup>
import { useTaxStore } from "~/stores/rentmy/Tax";
const taxStore = useTaxStore();

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: "%s | Sales tax",
});

let showEffect = ref(true);
let tableEffect = ref(false);
const showModal = ref(false);
const modelEffect = ref(true);
let showTaxClasses = ref(false)
let tagName = ref(null)
let tab = ref(1)
onMounted(async () => {
  await asMounted();
});

async function asMounted() {
  await taxStore.getTaxlist();
  showEffect.value = false;
}

const router = useRouter();

async function jumpToPage(page_no) {
  tableEffect.value = true;
  await productStore.getProductList({ page_no });
  tableEffect.value = false;
}

function openmodal() {
  showModal.value = true;
}
function closemodal() {
  showModal.value = false;
}
async function submitForm(){
  await taxStore.addSalesTax()
  // await taxStore.getTaxlist();
}
async function onClickTaxClassUpdateButton(index){
  let payload = {
    name: null,
    class_id: null
  }
  payload.name = taxStore.salesTaxClassList[index].name
  payload.class_id = taxStore.salesTaxClassList[index].id
  await taxStore.createOrupdateTaxClass(payload)
  // await taxStore.getTaxlist();
}
async function onClickTaxClassAddButton(){
  let payload = {
    name: null,
  }
  payload.name = tagName.value
  await taxStore.createOrupdateTaxClass(payload)
  // await taxStore.getTaxlist();
  tagName.value = null
}
</script>

<template>
  <div>
    <Breadcrumb title="Add Sales Tax" :links="['settings', 'salexTax']"></Breadcrumb>
    <div class="row">
      <div class="col-md-12">
        <div class="ionic-card">
          <div class="ionic-card-header card-header-border pt-3 pb-2">
            <div class="card-header-leftside">
              <div class="ionic-tab">
                <ul>
                  <li><a :class="showTaxClasses==false ? 'tab-active' : ''">Sales Tax Option</a></li>
                  <li v-if="!taxStore.salesTaxPayload.automatic" class="tab-devided"></li>
                  <li v-if="!taxStore.salesTaxPayload.automatic">
                    <a :class="showTaxClasses==true ? 'tab-active' : ''" @click="showTaxClasses=!showTaxClasses">Tax Classes <i class="la la-angle-down ms-2"></i></a>
                    <div class="dropdown-body" v-if="showTaxClasses">
                      <ul>
                        <template v-for="(tax, index) in taxStore.salesTaxClassList" :key="index" > 
                          <li><nuxt-link :to="`/settings/sales-tax/tax-classes/${tax.id}`">{{tax?.name}}</nuxt-link></li>
                        </template>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="ionic-card-body">
            <div class="texes-tab-body pt-3">
              <!-- Sales Tax Option area -->
              <div class="taxes-tab-content" v-if="tab==1">
                <div class="row mb-3">
                  <div class="col-md-3">
                    <h5 class="fs-15">Sales tax</h5>
                  </div>
                  <div class="col-md-9">
                    <div class="form-group">
                      <div class="d-flex align-items-center">
                        <h6 class="fs-15 me-4">Select Sale Tax Options</h6>
                        <div class="radio-inline">
                          <label class="radio mb-0">
                            <input type="radio" v-model="taxStore.salesTaxPayload.tax_apply_on" :value="3"/>
                            Rent Only
                            <span></span>
                          </label>
                          <label class="radio mb-0">
                            <input type="radio" v-model="taxStore.salesTaxPayload.tax_apply_on" :value="2"/>
                            Buy Only
                            <span></span>
                          </label>
                          <label class="radio mb-0">
                            <input type="radio" v-model="taxStore.salesTaxPayload.tax_apply_on" :value="1"/>
                            Both
                            <span></span>
                          </label>
                          <label class="radio mb-0">
                            <input type="radio" v-model="taxStore.salesTaxPayload.tax_apply_on" :value="0"/>
                            None
                            <span></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row pb-3">
                  <div class="col-md-3">
                    <h5 class="fs-15">Calculate tax based on</h5>
                  </div>
                  <div class="col-md-5">
                    <div class="form-group">
                      <div class="select-optionbox">
                        <select class="form-control" v-model="taxStore.salesTaxPayload.address">
                          <option value="">--Select--</option>
                          <option value="billing">Customer billing address</option>
                          <option value="shipping">Customer shipping address</option>
                          <option value="delivery">Customer delivery address</option>
                          <option value="store">Shop selected online store location</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row pb-3">
                  <div class="col-md-3">
                    <h5 class="fs-15">Enable automated taxes ?</h5>
                  </div>
                  <div class="col-md-6">
                    <el-Switch v-model="taxStore.salesTaxPayload.automatic" class="col-md-2 col-2"/>
                  </div>
                </div>
                <template v-if="taxStore.salesTaxPayload.automatic">
                  <div class="row pb-3">
                  <div class="col-md-3">
                    <h5 class="fs-15">Exempt delivery tax</h5>
                  </div>
                  <div class="col-md-5">
                    <div class="form-group">
                      <div class="m-radio-inline pb-2">
                        <label class="radio">
                          <input type="radio" :value="true" v-model="taxStore.salesTaxPayload.exempt_delivery_tax">
                          Yes
                          <span></span>
                        </label>
                      </div>
                      <div class="m-radio-inline">
                        <label class="radio">
                          <input type="radio" :value="false" v-model="taxStore.salesTaxPayload.exempt_delivery_tax">
                          No
                          <span></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                </template>
                <template v-else> 
                  <div class="row pb-3">
                  <div class="col-md-3">
                    <h5 class="fs-15">Prices entered with tax ?</h5>
                  </div>
                
                  <div class="col-md-5">
                    <div class="form-group">
                      <div class="m-radio-inline pb-2">
                        <label class="radio">
                          <input type="radio" :value="true" v-model="taxStore.salesTaxPayload.price_with_tax">
                          Yes, I will enter prices inclusive of tax
                          <span></span>
                        </label>
                      </div>
                      <div class="m-radio-inline">
                        <label class="radio">
                          <input type="radio" :value="false" v-model="taxStore.salesTaxPayload.price_with_tax">
                          No, I will enter prices exclusive of tax
                          <span></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row pb-3">
                  <div class="col-md-3">
                    <h5 class="fs-15">Shipping tax class</h5>
                  </div>
                  <div class="col-md-5">
                    <div class="form-group">
                      <div class="select-optionbox">
                        <select class="form-control" v-model="taxStore.salesTaxPayload.shipping">
                          <option value="null">--Select--</option>
                          <template v-for="(tax, index) in taxStore.salesTaxClassList" :key="index" > 
                            <option  :value="tax.id">{{ tax.name }}</option>
                          </template>
                         
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row pb-3">
                  <div class="col-md-3">
                    <h5 class="fs-15">Delivery tax class</h5>
                  </div>
                  <div class="col-md-5">
                    <div class="form-group">
                      <div class="select-optionbox">
                        <select class="form-control" v-model="taxStore.salesTaxPayload.delivery">
                          <option value="null">--Select--</option>
                          <template v-for="(tax, index) in taxStore.salesTaxClassList" :key="index" > 
                            <option  :value="tax.id">{{ tax.name }}</option>
                          </template>
                         
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row pb-3">
                  <div class="col-md-3">
                    <h5 class="fs-15">Additional service tax</h5>
                  </div>
                  <div class="col-md-5">
                    <div class="form-group">
                      <div class="select-optionbox">
                        <select class="form-control" v-model="taxStore.salesTaxPayload.additional_service">
                          <option value="null">--Select--</option>
                          <template v-for="(tax, index) in taxStore.salesTaxClassList" :key="index" > 
                            <option  :value="tax.id">{{ tax.name }}</option>
                          </template>
                         
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row pb-3">
                  <div class="col-md-3">
                    <h5 class="fs-15">Tax classes</h5>
                  </div>
                  <template v-for="(tax, index) in taxStore.salesTaxClassList" :key="index" > 
                  <div class="col-md-3" v-if="index != 0">
                    
                  </div>
                  <div class="col-md-5">
                    <div class="form-group">
                      <input type="text" class="form-control" :placeholder="tax.name"  v-model="taxStore.salesTaxClassList[index].name"/>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-group">
                      <button type="button" @click="onClickTaxClassUpdateButton(index)" class="ionic-btn ionic-theme-btn2 texes-savebtn"><i
                          class="la la-floppy-o"></i></button>
                      <button type="button" class="ionic-btn ionic-cancel-btn texes-deletebtn"><i
                          class="la la-trash" @click="taxStore.deleteTaxClass(tax.id)"></i></button>
                    </div>
                  </div>
                </template>
                </div>
                <div class="row pb-3">
                  <div class="col-md-3">

                  </div>
                  <div class="col-md-5">
                    <div class="form-group">
                      <input type="text" v-model="tagName" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-group">
                      <button type="button"  @click="onClickTaxClassAddButton(tagName)" class="ionic-btn ionic-theme-btn2 texes-savebtn"><i
                          class="la la-plus"></i></button>
                    </div>
                  </div>
                </div>
                  
                </template>
             
                <div class="top-border"></div>
                <div class="col-md-12 pt-4">
                  <button type="button" @click="submitForm()" class="ionic-btn ionic-theme-btn2 ionic-btnlg ms-0"> Submit <btnLoader :show="H.isPendingAnyApi('Tax:addSalesTax')" color="black" ></btnLoader> </button>
                </div>
              </div>
              <!-- Tax classes area -->
              <div class="taxes-tab-content" v-else>
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th width="9%">Name</th>
                        <th width="9%">Country</th>
                        <th width="8%">State</th>
                        <th width="9%">Postal Code/Zip</th>
                        <th width="8%">City</th>
                        <th width="9%">Rent Rate%</th>
                        <th width="9%">Buy Rate%</th>
                        <th width="9%">Shipping Rate%</th>
                        <th width="9%"> Priority </th>
                        <th width="9%"> Compound </th>
                        <th width="9%">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="empty-tr">
                        <td></td>
                      </tr>
                      <tr>
                        <td width="9%">Name</td>
                        <td width="9%">USA</td>
                        <td width="8%">New York</td>
                        <td width="9%">45454</td>
                        <td width="8%">New York</td>
                        <td width="9%">5%</td>
                        <td width="9%">2%</td>
                        <td width="9%">3%</td>
                        <td width="9%">2</td>
                        <td width="9%">3 </td>
                        <td width="9%">
                          <div class="table-action">
                            <div class="table-actionicon">
                              <i class="las la-ellipsis-v"></i>
                            </div>
                            <div class="table-action-body" style="display: none;">
                              <a><i class="las la-edit"></i> Edit </a>
                              <a><i class="las la-trash-alt"></i> Delete </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td width="9%">Name</td>
                        <td width="9%">USA</td>
                        <td width="8%">New York</td>
                        <td width="9%">45454</td>
                        <td width="8%">New York</td>
                        <td width="9%">5%</td>
                        <td width="9%">2%</td>
                        <td width="9%">3%</td>
                        <td width="9%">2</td>
                        <td width="9%">3 </td>
                        <td width="9%">
                          <div class="table-action">
                            <div class="table-actionicon">
                              <i class="las la-ellipsis-v"></i>
                            </div>
                            <div class="table-action-body" style="display: none;">
                              <a><i class="las la-edit"></i> Edit </a>
                              <a><i class="las la-trash-alt"></i> Delete </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td width="9%">Name</td>
                        <td width="9%">USA</td>
                        <td width="8%">New York</td>
                        <td width="9%">45454</td>
                        <td width="8%">New York</td>
                        <td width="9%">5%</td>
                        <td width="9%">2%</td>
                        <td width="9%">3%</td>
                        <td width="9%">2</td>
                        <td width="9%">3 </td>
                        <td width="9%">
                          <div class="table-action">
                            <div class="table-actionicon">
                              <i class="las la-ellipsis-v"></i>
                            </div>
                            <div class="table-action-body" style="display: none;">
                              <a><i class="las la-edit"></i> Edit </a>
                              <a><i class="las la-trash-alt"></i> Delete </a>
                            </div>
                          </div>
                        </td>
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
    <section v-if="showModal" class="modal fade addrate-modal" tabindex="-1"
      style="display: block; opacity: unset">
      <div class="modal-dialog modal-dialog-centered" @click.stop="showModal = false">
        <div class="modal-content" @click.stop="false">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Add Tax Rate</h1>
            <button @click.stop="closemodal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
              <i class="la la-close"></i>
            </button>
          </div>
          <div class="modal-body" @click.stop="false">
            <div class="modal-body-inner ionic-form-area pt-3">
              <div class="row">
                <div class="col-md-6">
                  <div class="row form-group align-items-center">
                    <label class="col-form-label col-md-4 mb-0">Name</label>
                    <div class="col-md-8">
                      <input type="text" formcontrolname="name" class="form-control">
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <label class="col-form-label col-md-4">Country</label>
                    <div class="col-md-8">
                      <div class="select-optionbox">
                        <select name="param" class="form-control">
                          <option value="0">-Select country-</option>
                          <option value="1">Andorra</option>
                          <option value="2">United Arab Emirates</option>
                          <option value="3">Afghanistan</option>
                          <option value="4">Antigua and Barbuda</option>
                          <option value="5">Anguilla</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <label class="col-form-label col-md-4">State</label>
                    <div class="col-md-8">
                      <input id="state" type="text" class="form-control" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <label class="col-form-label col-md-4">Postal Code/Zip</label>
                    <div class="col-md-8">
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <label class="col-form-label col-md-4">City</label>
                    <div class="col-md-8">
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <label class="col-form-label col-md-4">Rent Rate%</label>
                    <div class="col-md-8">
                      <input type="number" class="form-control" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <label class="col-form-label col-md-4">Buy Rate%</label>
                    <div class="col-md-8">
                      <input type="number" class="form-control" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <label class="col-form-label col-md-4">Shipping Rate%</label>
                    <div class="col-md-8">
                      <input type="number" class="form-control" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <label class="col-form-label col-md-4">Priority</label>
                    <div class="col-md-8">
                      <input type="number" class="form-control" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <div class="col-md-4">
                      <label class="col-form-label">Compound ?</label>
                    </div>
                    <div class="col-md-8">
                      switch button
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-between ps-0 pe-0">
            <template v-if="modelEffect">
              <ShimmerEffect bg="dark" height="52px" width="140px" radius="20px"></ShimmerEffect>
              <ShimmerEffect bg="dark" height="52px" width="140px" radius="20px"></ShimmerEffect>
            </template>
            <template v-else>
              <button type="button" class="ionic-btn ionic-border-btn cancel-btn" @click="closemodal">
                Cancel
              </button>
              <button type="button" class="ionic-btn ionic-theme-btn2 save-btn" @click="productStore.createProduct">
                Save
                <BtnLoader v-if="H.isPendingAnyApi('Product:create')" color="black"></BtnLoader>
              </button>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>

</template>
