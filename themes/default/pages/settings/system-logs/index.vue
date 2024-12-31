<script setup>
import useLogStore  from "~/stores/Log";
const logStore = useLogStore();
definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: '%s | Logs',
});


let isMounted = ref(false);
let showEffect = ref(false)
async function asMounted(){
  await logStore.getLogList()
}

onMounted(async () => {
    isMounted.value = true;
    asMounted()
    console.log('hello')

})
</script>

<template>
    <div>
        <Breadcrumb title="Logs" :links="['settings', 'settings_logs']" ></Breadcrumb>
        <div class="ionic-card">
            <div class="ionic-card-header card-header-border">
            <h4 class="fs-18" >System Logs</h4>
            <div class="ionic-card-rightside">
           
            </div>
            </div>
            
            <div class="ionic-card-body">

                <div class="table-responsive">
                    <table class="table table-borderless">
                        <thead>
                            <tr>                        
                                <th>Company</th>
                                <th>Log type</th>
                                <th>Type</th>
                                <th>Options</th>
                                <th>Remarks</th>
                                <!-- <th>Action</th> -->
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="empty-tr">
                                <td colspan="88"></td>
                            </tr>
                            <template v-if="!isMounted">
                                <tr>
                                    <td>
                                        <ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect>
                                    </td>
                                    <td>
                                        <ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect>
                                    </td> 
                                    <td>
                                        <ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect>
                                    </td>                            
                                    <td>
                                        <ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect>
                                    </td>
                                    <td>
                                        <ShimmerEffect bg="light" height="35px" radius="10px"></ShimmerEffect>
                                    </td>
                                </tr>
                                
                            </template>
                            <template v-else>
                                <template v-for="(log, index) in logStore.logList" :key="index">
                                    <tr>                               
                                        <td>
                                            {{ log?.company?.company_name }}
                                        </td>
                                        <td>
                                            {{ log?.log_type == 'notification' ? 'Notification' : ''}}
                                        </td>
                                        <td>
                                            {{ log?.type == 'geofence_alert' ? 'Geofence alert' : '' }}
                                        </td>
                                        <td>
                                            {{ JSON.parse(log?.options)  }}
                                        </td>
                                        <td>
                                            {{ log?.remarks }}
                                        </td>
                                        <!-- <td class="text-center">
                                            <nuxt-link :to="`/settings/logs/${log.id}`"  class="cp text-white">
                                                <i class="las la-eye size-3"></i>
                                            </nuxt-link>
                                        </td> -->
                                        
                                    </tr>
                                
                                </template>
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
                        >
                        </ShimmerEffect>
                        <ShimmerEffect
                            bg="dark"
                            width="32px"
                            height="32px"
                            class="me-2"
                            speed="1s"
                            :stopAnimaiton="false"
                        >
                        </ShimmerEffect>
                        <ShimmerEffect
                            bg="dark"
                            width="32px"
                            height="32px"
                            class="me-2"
                            speed="1s"
                            :stopAnimaiton="false"
                        >
                        </ShimmerEffect>
                        <ShimmerEffect
                            bg="dark"
                            width="32px"
                            height="32px"
                            class="me-2"
                            speed="1s"
                            :stopAnimaiton="false"
                        >
                        </ShimmerEffect>
                        </div>
                    </template>
                    <template v-else>
                        <div class="d-flex justify-content-end align-items-center my-3">
                        <p class="me-4">
                            <strong class="text-white-50">
                            Total: {{ logStore?.paginateData?.total }}
                            <span class="mx-3">|</span>
                            Page: {{ logStore?.paginateData?.current_page }}
                            <span class="mx-3">|</span>
                            Showing: {{ logStore?.logList?.length || 0 }}
                            </strong>
                        </p>
                        <PaginationRentMy
                            v-model="logStore.paginateData"
                            @jumpToPage="
                            (page) => {
                                logStore.jumpToPage(page);
                            }
                            "
                        ></PaginationRentMy>
                        </div>
                    </template>
                </div>             
                  
            </div>

        </div>
    </div>
</template>