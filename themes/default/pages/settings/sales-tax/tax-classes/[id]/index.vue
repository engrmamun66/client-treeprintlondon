<script setup>
import { useTaxStore } from "~/stores/rentmy/Tax";
const taxStore = useTaxStore();

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: "%s | Tax class",
});

let showEffect = ref(true);
let tableEffect = ref(false);
const showModal = ref(false);
const modalEffect = ref(true);
let showTaxClasses = ref(false)
let tagName = ref(null)
let tab = ref(1)
let countryId = ref(null)
let editMode = ref(false)
let withDelete = reactive({
  rate: null,
  showConfirmation: false,
});

onMounted(async () => {
  await asMounted();
});

async function asMounted() {
  
    await taxStore.getCountryList()
    await taxStore.getTaxlist();
  showEffect.value = false;
  taxStore.taxRatePayload.tax_class_id = useRoute().params.id
  await taxStore.getTaxClassWiseRateList(useRoute().params.id)

}

const router = useRouter();

async function openmodal(rate=null) {

   
    if(editMode.value == true){
        taxStore.taxRatePayload = { ...rate, rate_id: rate.id}
        await getStateList()

    }
    showModal.value = true;
    setTimeout(()=>{
        modalEffect.value = false
    })
}
function closemodal() {
  showModal.value = false;
}
async function submitForm(){
    await taxStore.addTaxClassRate( useRoute().params.id, taxStore.taxRatePayload )
    // await taxStore.getTaxClassWiseRateList(useRoute().params.id)
    showModal.value = false;
}

async function getStateList(){
    if(taxStore.taxRatePayload.country){
        let selectedCountry = taxStore.countryList.filter((item)=>{
            return taxStore.taxRatePayload.country == item.code;
        })
        taxStore.stateByCountry(selectedCountry[0].id)
    }

}
</script>

<template>
  <div>
    <Breadcrumb title="Tax Class" :links="['settings', 'salexTax', 'taxClass']"></Breadcrumb>
    <div class="row">
      <div class="col-md-12">
        <div class="ionic-card">
          <div class="ionic-card-header card-header-border pt-3 pb-2">
            <div class="card-header-leftside">
              <div class="ionic-tab">
                <ul>
                  <li><nuxt-link :to="`/settings/sales-tax`">Sales Tax Option</nuxt-link></li>
                  <li v-if="!taxStore.salesTaxPayload.automatic" class="tab-devided"></li>
                  <li v-if="!taxStore.salesTaxPayload.automatic">
                    <a class="tab-active" @click="showTaxClasses=!showTaxClasses">Tax Classes <i class="la la-angle-down ms-2"></i></a>
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
            <div class="card-header-rightside">
              <button type="button" @click="openmodal()" class="ionic-btn ionic-theme-btn2"><i class="la la-plus"></i> Add Tax
                Rates</button>
            </div>
          </div>
          <div class="ionic-card-body">
            <div class="texes-tab-body pt-3">
          
              <!-- Tax classes area -->
              <div class="taxes-tab-content">
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
                      <template v-for="(rate, index) in taxStore.rateList" :key="index"> 
                        <tr>
                            <td width="9%">{{ rate?.name }}</td>
                            <td width="9%">{{ rate?.country }}</td>
                            <td width="8%">{{ rate?.state }}</td>
                            <td width="9%">{{ rate?.zipcode }}</td>
                            <td width="8%">{{ rate?.city }}</td>
                            <td width="9%">{{ rate?.rent_rate }}</td>
                            <td width="9%">{{ rate?.buy_rate }}</td>
                            <td width="9%">{{ rate?.shipping_rate }}</td>
                            <td width="9%">{{ rate?.priority }}</td>
                            <td width="9%">{{ rate?.compound == 1 ? 'Yes' : 'No' }}</td>
                            <td width="9%">
                                <div class="table-action">
                                    <div class="table-actionicon d-flex">
                                        <a @click="editMode = true; openmodal(rate)"><i class="las la-edit"></i>  </a>
                                        <a  @click.stop="
                                withDelete.rate = rate;
                                withDelete.showConfirmation = true;
                              "><i class="las la-trash-alt"></i></a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                      </template>
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
            <h1 class="modal-title fs-5">{{editMode == true ? ' Update' : 'Add'}} Tax Rate</h1>
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
                      <input type="text" class="form-control" v-model="taxStore.taxRatePayload.name">
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <label class="col-form-label col-md-4">Country</label>
                    <div class="col-md-8">
                      <div class="select-optionbox">
                        <select  @change="getStateList()" v-model="taxStore.taxRatePayload.country" class="form-control">
                          <option   value="0">-Select country-</option>
                          <template v-if="taxStore.countryList.length > 0 "> 
                              <option  v-for="(country, index) in taxStore.countryList" :key="index" :value="country.code">{{ country.name }}</option>
                          </template>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <label class="col-form-label col-md-4">State</label>
                    <div class="col-md-8">
                        <div class="select-optionbox">
                        <select v-model="taxStore.taxRatePayload.state" class="form-control">
                            <option   value="0">-Select State-</option>
                            <template v-if="taxStore.stateList.length > 0 "> 
                                <option  v-for="(state, index) in taxStore.stateList" :key="index" :value="state.code">{{ state.name }}</option>
                            </template>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <label class="col-form-label col-md-4">Postal Code/Zip</label>
                    <div class="col-md-8">
                      <input type="text" v-model="taxStore.taxRatePayload.zipcode" class="form-control" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <label class="col-form-label col-md-4">City</label>
                    <div class="col-md-8">
                      <input type="text" class="form-control" v-model="taxStore.taxRatePayload.city" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <label class="col-form-label col-md-4">Rent Rate%</label>
                    <div class="col-md-8">
                      <input type="number" class="form-control" v-model="taxStore.taxRatePayload.rent_rate"/>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <label class="col-form-label col-md-4">Buy Rate%</label>
                    <div class="col-md-8">
                      <input type="number" class="form-control" v-model="taxStore.taxRatePayload.buy_rate"/>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <label class="col-form-label col-md-4">Shipping Rate%</label>
                    <div class="col-md-8">
                      <input type="number" class="form-control" v-model="taxStore.taxRatePayload.shipping_rate"/>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <label class="col-form-label col-md-4">Priority</label>
                    <div class="col-md-8">
                      <input type="number" class="form-control" v-model="taxStore.taxRatePayload.priority"/>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row align-items-center form-group">
                    <div class="col-md-4">
                      <label class="col-form-label">Compound ?</label>
                    </div>
                    <div class="col-md-8">
                        <el-Switch v-model="taxStore.taxRatePayload.compound" class="col-md-2 col-2"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-between ps-0 pe-0">
            <template v-if="modalEffect">
              <ShimmerEffect bg="dark" height="52px" width="140px" radius="20px"></ShimmerEffect>
              <ShimmerEffect bg="dark" height="52px" width="140px" radius="20px"></ShimmerEffect>
            </template>
            <template v-else>
              <button type="button" class="ionic-btn ionic-border-btn cancel-btn" @click="closemodal">
                Cancel
              </button>
              <button type="button" @click="submitForm()" class="ionic-btn ionic-theme-btn2 save-btn">
                Save
                <BtnLoader v-if="H.isPendingAnyApi('Tax:addTaxClassRate')" color="black" ></BtnLoader>
              </button>
            </template>
          </div>
        </div>
      </div>
    </section>
    <Modal-Confirm
        v-if="withDelete.showConfirmation"
        v-model="withDelete.showConfirmation"
        :skipAutoClose="true"
        @yes="
          async () => {
            await taxStore.deleteTaxRate(withDelete.rate.id);
            withDelete.showConfirmation = false;
          }
        "
      >
        Are you sure want to delete?
        <template #btn-yes>
          <BtnLoader :show="H.isPendingAnyApi('Order:orderItemDelete')" />
        </template>
      </Modal-Confirm>
  </div>

</template>
