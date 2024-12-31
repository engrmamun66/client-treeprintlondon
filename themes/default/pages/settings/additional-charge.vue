<script setup>
import { useChargeStore } from '~/stores/rentmy/settings/Charge';
const chargeStore = useChargeStore();

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: "%s | Addtional Charge",
});


let withDelete = reactive({
  showConfirmation: false,
  item: null
});
let isMounted = ref(null);

// >>> with add / edit
let targetId = ref(null);
let showItemDetails = ref(false);

watch(showItemDetails, (a, b)=>{
  if(a === true){
    if(targetId.value){
      H.withUrl.setQuery({"chargeId": targetId.value})
    } else {
      H.withUrl.setQuery({"action": 'add-new'})
    }
  } else {
    H.withUrl.deleteQuery("chargeId");
    H.withUrl.deleteQuery("action");
  }
})



async function asMounted(){
  await chargeStore.getChargeList();
}



onMounted(async() => {  
  await asMounted();  
  let action = useRoute().query.action;
  let chargeId = useRoute().query.chargeId;

  if(action || chargeId){
    targetId.value = chargeId || null;
    showItemDetails.value = true;
  }
  isMounted.value = true;
})


</script>

<template>
  <div>
    <Breadcrumb title="Additional Charge" :links="['settings', 'settings_additionalCharge']" ></Breadcrumb>

    <settings-AdditionalChargeAddEdit 
    v-if="showItemDetails" 
    :chargeId="targetId" 
    @unmount="showItemDetails=false;targetId=null"
     >
    </settings-AdditionalChargeAddEdit>

    <div class="ionic-card">
    <div class="ionic-card-header card-header-border">
      <h4 class="fs-18" >Additional Charge Configuration</h4>
      <div class="ionic-card-rightside">
        <div class="ionic-tab">
          <ul class="ionic-tab">
            <template v-if="!isMounted">
                <li>
                    <ShimmerEffect bg="dark" width="100px" height="35px" radius="15px" class="me-2" ></ShimmerEffect>
                </li>             
            </template>
            <template v-else>
                <li>
                    <button @click.stop="targetId=null; showItemDetails=true" class="ionic-btn ionic-theme-btn"  >
                        <i-las t="plus" class="me-2"></i-las> Add New
                    </button>
                </li>               
            </template>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="ionic-card-body">

        <div class="table-responsive">
            <table class="table table-borderless">
            <thead>
                    <tr>                        
                        <th>Sl No</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Fee</th>
                        <th>Tax</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody @click="H.toggleLoopItem(chargeStore.chargeList, -1)">
                    <tr class="empty-tr">
                        <td colspan="88"></td>
                    </tr>
                    <template v-if="!isMounted || H.isPendingAnyApi('Settings:getAdditionalCharges')">
                        <tr v-for="(x, index) in (chargeStore?.paginateData?.data?.length || 5)" :key="index">
                            <td>
                                <ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect>
                            </td>
                            <td colspan="5">
                                <ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect>
                            </td>                            
                            <td>
                                <ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect>
                            </td>
                        </tr>
                        
                    </template>
                    <template v-else>
                        <template v-for="(charge, index) in chargeStore.chargeList" :key="index">
                            <tr>                               
                                
                                <td>
                                    {{ index + 1 }}
                                </td>
                                <td>
                                    {{ charge?.title }}
                                </td>
                                 
                                <td>
                                    {{ charge?.description }}
                                </td>
                                <td>
                                    {{ charge?.fee?.amounts?.map(n => {
                                      if(charge?.fee?.type == 'percentage'){
                                        n += '%'
                                      }
                                      return n
                                    }).join(', ') }}
                                </td>
                                <td>
                                    {{ charge?.tax_status ? 'YES' : 'NO' }}
                                </td>
                                <td >
                                    <span :class="[globalData.settings.additionalChargeTypes.filter(i => i.id == charge?.status)?.[0]?.className]">
                                      {{  globalData.settings.additionalChargeTypes.filter(i => i.id == charge?.status)?.[0]?.name  }}
                                    </span>
                                </td>                                 
                              
                                <td>  
                                    <div class="table-action">
                                        <div class="table-actionicon" @click.stop="H.toggleLoopItem(chargeStore.chargeList, index)">
                                            <i class="las la-ellipsis-v"></i>
                                        </div>
                                        <div v-if="charge.isShow" class="table-action-body" @click.stop="false">                                      
                                          <a @click.stop="withDelete.item = charge; withDelete.showConfirmation = true">
                                              <i class="las la-trash-alt"></i> Delete
                                          </a>
                                          <a @click.stop="targetId=charge.id;showItemDetails=true">
                                              <i class="las la-edit"></i> Edit
                                          </a>
                                        </div>
                                    </div>


                                </td>
                            </tr>
                         
                        </template>
                    </template>
                </tbody>
            </table>
        </div>
        <template v-if="!isMounted">
              <div class="d-flex justify-content-end align-items-center my-3">
                <ShimmerEffect bg="dark" width="64px" height="12px" class="me-4" speed="1s" radius="2px":stopAnimaiton="false"></ShimmerEffect>
                <ShimmerEffect bg="dark" width="64px" height="12px" class="me-4" speed="1s" radius="2px":stopAnimaiton="false"></ShimmerEffect>
                <ShimmerEffect bg="dark" width="64px" height="12px" class="me-4" speed="1s" radius="2px":stopAnimaiton="false"></ShimmerEffect>

                <ShimmerEffect bg="dark" width="32px" height="32px" class="me-2" speed="1s" :stopAnimaiton="false"></ShimmerEffect>
                <ShimmerEffect bg="dark" width="32px" height="32px" class="me-2" speed="1s" :stopAnimaiton="false"></ShimmerEffect>
                <ShimmerEffect bg="dark" width="32px" height="32px" class="me-2" speed="1s" :stopAnimaiton="false"></ShimmerEffect>
                <ShimmerEffect bg="dark" width="32px" height="32px" class="me-2" speed="1s" :stopAnimaiton="false"></ShimmerEffect>
              </div>
            </template>
            <template v-else>
                <div class="d-flex justify-content-end align-items-center my-3">
                    <p class="me-4"> <strong class="text-white-50"> 
                        Total: {{ chargeStore.paginateData?.total }}
                        <span class="mx-3">|</span>
                        Page: {{ chargeStore.paginateData?.page_no }}
                        <span class="mx-3">|</span>
                        Showing: {{ chargeStore.chargeList?.length || 0 }}
                    </strong> </p>
                    <PaginationRentMy v-model="chargeStore.paginateData" @jump-now="(page_no) => chargeStore.getChargeList({page_no})" ></PaginationRentMy>
                </div>
            </template>
    </div>


    <!-- ==================== Modal==================== -->
    <!-- ==================== Modal==================== -->
    <!-- ==================== Modal==================== -->

    <Modal-Confirm v-if="withDelete.showConfirmation" v-model="withDelete.showConfirmation" :skipAutoClose="true" @yes="async()=>{
      await chargeStore.deleteCharge(withDelete.item.id);
      withDelete.showConfirmation = false;
    }">
     
    </Modal-Confirm>

  </div>

  </div>    
</template>