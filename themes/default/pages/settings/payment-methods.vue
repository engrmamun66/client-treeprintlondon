<script setup>
import { usePayMethodStore } from '~/stores/rentmy/settings/PayMethod';
let payStore = usePayMethodStore();

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: '%s | Payment Methods',
});

let isMounted = ref(false);
let showManualPayment = ref(false);
let showOnlineGetway = ref(false);
let getwayItem = ref(null);
provide('payStore', payStore);
provide('getwayItem', getwayItem);

let withDelete = reactive({
  showConfirmation: false,
  item: null
});


async function asMounted(){
    await payStore.getGetwaySettings();
    await payStore.getGetwayList();
}

function onClickEdit(getway){
    getwayItem.value = getway;
    if(getway?.type === 'offline' || getway?.type === 'cod' ){
        showManualPayment.value = true;
    } else {
        showOnlineGetway.value = true;
    }
}

function clearQuery(){
    getwayItem.value = null;
    H.withUrl.deleteQuery('id');
    H.withUrl.deleteQuery('action');
}

onMounted(async () => {
    await asMounted();
    let action = useRoute().query?.action;
    let id = useRoute().query?.id;

    if(['update-online-getway', 'add-online-getway'].includes(action)){
        showOnlineGetway.value = true;        
    }
    else if(['update-manual-payment', 'add-manual-payment'].includes(action)){
        showManualPayment.value = true;
    }

    if(id && payStore.getwayList?.length){
        getwayItem.value = payStore.getwayList?.filter(item => item.id == +id)?.[0];
    }

    let code = useRoute().query?.code;
    if(code){
        getwayItem.value = payStore.getwayList?.filter(item => item.name == 'Stripe')?.[0];
        await payStore.postStripeToken(code);
        await asMounted();
        showOnlineGetway.value = true;
    }

    isMounted.value = true;
})

</script>

<template>
    <div>
        <Breadcrumb title="Payment Methods" :links="['settings', 'paymentMethods']" ></Breadcrumb>

        <addpayment-manualPayment v-if="showManualPayment" @unmount="showManualPayment = false;clearQuery();asMounted()" ></addpayment-manualPayment>
        <addpayment-onlineGetway v-if="showOnlineGetway" @unmount="showOnlineGetway = false;clearQuery();asMounted()" ></addpayment-onlineGetway>

        <div class="ionic-card">
            <div class="ionic-card-header card-header-border">
            <h4 class="fs-18" >Payment Methods</h4>
            <div class="ionic-card-rightside">
                <div class="ionic-tab">
                    <ul class="pe-0" >
                        <template v-if="!isMounted">
                            <li>
                                <ShimmerEffect bg="dark" width="180px" height="35px" radius="15px" class="me-2" ></ShimmerEffect>
                            </li>             
                            <li>
                                <ShimmerEffect bg="dark" width="180px" height="35px" radius="15px" class="me-2" ></ShimmerEffect>
                            </li>             
                        </template>
                        <template v-else>
                            <li>
                                <button @click.stop="getwayItem=null;showOnlineGetway=true" class="ionic-btn ionic-theme-btn"  >
                                    <i-las t="plus" class="me-2"></i-las> Add Online Getway
                                </button>
                            </li>               
                            <li>
                                <button @click.stop="getwayItem=null;showManualPayment=true" class="ionic-btn ionic-theme-btn"  >
                                    <i-las t="plus" class="me-2"></i-las> Add Manual Payment
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
                                <th>Payment Method</th>
                                <th>Manual payment</th>
                                <th>Online Store</th>
                                <th>Admin/POS</th>
                                <th>Real Payment</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="empty-tr">
                                <td colspan="88"></td>
                            </tr>
                            <template v-if="!isMounted || H.isPendingAnyApi('Settings:getGetwaySettings,getGetwayList')">
                                <tr v-for="(x, index) in (payStore.getwayList?.length || 5)" :key="index">
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
                                <template v-for="(getway, index) in payStore.getwayList" :key="index">
                                    <tr>                               
                                        
                                        
                                        <td>
                                            <strong>{{ getway?.name }}</strong>
                                        </td>
                                        <td>
                                            <span v-if="getway?.type == 'cod' || getway?.type == 'offline'" class="text-success">Yes</span>
                                            <span v-else class="text-danger">No</span>
                                        </td>
                                        <td>
                                            <span v-if="getway?.is_online" class="text-success">Yes</span>
                                            <span v-else class="text-danger">No</span>
                                        </td>
                                        <td>
                                            <span v-if="getway?.is_admin" class="text-success">Yes</span>
                                            <span v-else class="text-danger">No</span>
                                        </td>
                                        <td>
                                            <span v-if="getway?.type == 'offline' && getway?.config?.is_paid == true" class="text-success">Yes</span>
                                            <span v-else class="text-danger">No</span>
                                        </td>
                                        <td>
                                            <strong>
                                                <span v-if="getway?.status == 1" class="text-success">Active</span>
                                                <span v-else class="text-danger">Inactive</span>
                                            </strong>
                                        </td>
                                                                        
                                    
                                        <td class="text-center">  
                                            <a @click.stop="onClickEdit(getway)" class="cp text-white" >
                                                <i class="las la-edit size-1"></i>
                                            </a>
                                        </td>
                                    </tr>
                                
                                </template>
                            </template>
                        </tbody>
                    </table>
                </div>             
                  
            </div>


            <!-- ==================== Modal==================== -->
            <!-- ==================== Modal==================== -->
            <!-- ==================== Modal==================== -->

            <Modal-Confirm v-if="withDelete.showConfirmation" v-model="withDelete.showConfirmation" :skipAutoClose="true" @yes="async()=>{
            await usePayMethodStore.deleteLocation(withDelete.item.id);
            withDelete.showConfirmation = false;
            }">
            
            </Modal-Confirm>

        </div>
    </div>
</template>