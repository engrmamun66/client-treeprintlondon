<script setup>
import useNotificationStore  from "~/stores/rentmy/settings/Notification";
import { useCompaniesStore } from "~/stores/vms/company";
const notificationStore = useNotificationStore();
const companyStore = useCompaniesStore();
import ConstantConfig from '~/constant.config.js'

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: '%s | Notifications',
});

let isMounted = ref(false);
let modelEffect = ref(false)
let isEditMode = ref(false)
let isUpdating = ref(false)
let showConfirmation = ref(false)
let notificationId = ref(null)
let payload = ref({
  id: null,
  company_id: null,
  event: null,
  trigger_on: 'immediately',
  duration: 2,
  duration_type: 'days',
  related_users: false,
  company_admins: false
})

async function asMounted(){
  await notificationStore.getNotificationList()
  await companyStore.getCompanyList();
}

onMounted(async () => {
    isMounted.value = true;
    asMounted()

})
function openEditPopUp(eventDetails){
    isEditMode.value = true
    payload.value.id = eventDetails.id
    payload.value.event = eventDetails.event
    payload.value.company_id = eventDetails.company_id
    payload.value.trigger_on = JSON.parse(eventDetails.trigger_on).send
    payload.value.duration = JSON.parse(eventDetails.trigger_on).duration
    payload.value.duration_type = JSON.parse(eventDetails.trigger_on).duration_type
    payload.value.related_users = JSON.parse(eventDetails.recipient).related_users
    payload.value.company_admins = JSON.parse(eventDetails.recipient).company_admins
    notificationStore.showNotificationPopup = true
}
async function submitForm(){
  if(!payload.value.company_id){
    Toaster.error("Please select a company")
    return
  }
  if(!payload.value.event){
    Toaster.error("Please select an event")
    return
  }
  if(isEditMode.value){
    await notificationStore.updateNotification(payload.value.id, payload.value)
  }else{
      isUpdating.value = true
      await notificationStore.saveNotification(payload.value)
      isUpdating.value = false
      closeNotificationPopUp()
  }
  await asMounted()
}

function getEventName(eventKey){
  let event = ConstantConfig.event_notifications.filter((event)=>{
    return event.value == eventKey
  })
  return event[0].name
}

function closeNotificationPopUp(){
  notificationStore.showNotificationPopup = false
  isUpdating.value = false
  payload.value = {
    id: null,
    event: null,
    trigger_on: 'immediately',
    duration: 2,
    duration_type: 'days',
    related_users: false,
    company_admins: false
  }
}
</script>

<template>
    <div>
        <Breadcrumb title="Notifications" :links="['settings', 'notifications']" ></Breadcrumb>
        <div class="ionic-card">
            <div class="ionic-card-header card-header-border">
            <h4 class="fs-18" >Email notifications</h4>
            <div class="ionic-card-rightside">
                <div class="ionic-tab">
                    <ul class="pe-0" >
                        <template v-if="!isMounted">
                            <li>
                                <ShimmerEffect bg="dark" width="180px" height="35px" radius="15px" class="me-2" ></ShimmerEffect>
                            </li>             
                        </template>
                        <template v-else>
                            <li>
                                <button class="ionic-btn ionic-theme-btn"  @click="notificationStore.showNotificationPopup = true">
                                    <i-las t="plus" class="me-2"></i-las> Add notification
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
                              <th>Event name</th>
                              <th>Company</th>                       
                              <th>Type</th>
                              <th>Schedule</th>
                              <th>Actions</th>
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
                                <template v-for="(notification, index) in notificationStore.notificationList" :key="index">
                                    <tr>                               
                                        <td>
                                            <strong>{{ getEventName(notification?.event) }}</strong>
                                        </td>
                                        <td>{{  notification?.company?.company_name }}</td>
                                        <td>
                                            <span>{{notification?.type == 'email' ? 'Email' : 'SMS'}}</span>
                                        </td>
                                        <td>
                                            <span>{{JSON.parse(notification?.trigger_on).send == 'after' ? 'After' : 'Immediately' }}</span>
                                        </td>
                                        <td class="text-center">  
                                            <a  class="cp text-white" @click="openEditPopUp(notification)">
                                                <i class="las la-edit size-3"></i>
                                            </a>
                                            <a  class="cp text-white" @click="(
                                              notificationId = notification?.id,
                                              showConfirmation  = true
                                            )">
                                                <i class="las la-trash size-3"></i>
                                            </a>
                                        </td>
                                    </tr>
                                
                                </template>
                            </template>
                        </tbody>
                    </table>
                </div>             
                  
            </div>

        </div>

        <Rightbar ref="rightbar" v-if="notificationStore.showNotificationPopup" :title="isEditMode ? 'Edit notification' : 'Add new notification'" @unmount="closeNotificationPopUp()" >
          <el-BaseSelect label="Company" displayKey="company_name" option1="-Select company-" v-model="payload.company_id" :data="companyStore.companies" ></el-BaseSelect>
          <div class="col-md-12">
            <div class="form-group">
                <label class="form-label">Select Event</label>
                <template v-if="modelEffect">
                  <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                </template>
                <template v-else>
                  <select
                    class="form-control"
                    v-model="payload.event"
                  >
                  <option value="null"> -- Select event -- </option>
                      <template v-for="(event, index) in ConstantConfig.event_notifications" :key="index">
                        <option :value="event.value">
                          {{event.name}}
                        </option>
                      </template>
                  </select>
                </template>
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group">
                <label class="form-label">Before or After the Event</label>
                <template v-if="modelEffect">
                  <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                </template>
                <template v-else>
                  <select class="form-control" v-model="payload.trigger_on">
                    <option value="null"> -- Select type -- </option>
                   
                    <option value="immediately">Immediately</option>
                    <option value="after">After</option>
                  </select>
                </template>
            </div>
          </div>
          <div class="row" v-if="payload.trigger_on == 'after'"> 
            <div class="col-md-6">
              <div class="form-group">
                  <label class="form-label">Duration</label>
                  <template v-if="modelEffect">
                    <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                  </template>
                  <template v-else>
                    <input class="form-control" type="number" min="0" v-model="payload.duration">
                  </template>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                  <label class="form-label">Duration Type</label>
                  <template v-if="modelEffect">
                    <ShimmerEffect bg="dark" height="52px"></ShimmerEffect>
                  </template>
                  <template v-else>
                    <select class="form-control" v-model="payload.duration_type">
                      <option value="days">Days</option>
                      <option value="hours">Hours</option>
                    </select>
                  </template>
              </div>
            </div>
          </div>
          <div class="col-md-12 my-3"> 
              <label class="form-label"> Notification recipients</label>
              <div class="product-typeradio my-3">
              <label class="checkbox checkbox-pos-inline">
                 Customer / User related to notification
                  <input
                  type="checkbox"
                  name="product_type"
                  value="1"
                  v-model="payload.related_users"
                  />
                  <span></span>
              </label>
              </div>
          </div>
          <div class="col-md-12 my-3"> 
              <label class="form-label"> BCC</label>
              <div class="product-typeradio my-3">
              <label class="checkbox checkbox-pos-inline">
                 Company admins
                  <input
                  type="checkbox"
                  name="product_type"
                  value="1"
                  v-model="payload.company_admins"
                  />
                  <span></span>
              </label>
              </div>
          </div>
          <template #footer >
              <div class="mt-4">
                  <button type="button"  class="ionic-btn ionic-theme-btn2 save-btn ms-0" @click="submitForm">
                     Submit <BtnLoader color="black" v-if="H.isPendingAnyApi('Setting: saveNotification') || isUpdating"></BtnLoader>
                  </button>         
                  <button @click="closeNotificationPopUp()" type="button" class="ionic-btn ionic-cancel-btn ionic-btnlg">Cancel</button>
              </div>
          </template>

        </Rightbar>
        <Modal-Confirm v-if="showConfirmation" v-model="showConfirmation" :skipAutoClose="false" @yes="async () => {
            let isDeleted =  await notificationStore.deleteNotification(notificationId);
            if (isDeleted) {
                showConfirmation = false;
                notificationId = null;
            }
        }">
            <template v-if="showConfirmation"> Are you sure? </template>
        </Modal-Confirm>
    </div>
</template>