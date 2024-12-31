<script setup>
import { useProductStore } from "~/stores/rentmy/Product";
const productStore = useProductStore();
import moment from 'moment';

let datePicker = ref(null);

let availableInDates = ref([
    {
        // "available": 45489,
        "date": "2024-07-10",
        highlight: 'green',
    },
    {
        // "available": 3434,
        "date": "2024-07-12",
        highlight: 'red',
    },
])


function onNextPrev(data){ 
    console.log('nextPrev-data', data);
    let {startDate, endDate} = data;
    
    let s_year = +H.formatDate(startDate, 'YYYY');
    let e_year = +H.formatDate(endDate, 'YYYY');
    let s_month = +H.formatDate(startDate, 'MM');
    let e_month = +H.formatDate(endDate, 'MM'); 
    
    let dates = [
        {
            // "available": 45489,
            "date": `${H.randBetween(s_year, e_year)}-${String(H.randBetween(s_month, e_month)).padStart(2, '0')}-${String(H.randBetween(1,12)).padStart(2, '0')}`,
            highlight: H.randBetween(1,3) == 1 ? 'green' : 'red',
        },
        {
            // "available": 3434,
            "date": `${H.randBetween(s_year, e_year)}-${String(H.randBetween(s_month, e_month)).padStart(2, '0')}-${String(H.randBetween(1,12)).padStart(2, '0')}`,
            highlight: H.randBetween(1,3) == 1 ? 'green' : 'yellow',
        },
        {
            // "available": 3434,
            "date": `${H.randBetween(s_year, e_year)}-${String(H.randBetween(s_month, e_month)).padStart(2, '0')}-${String(H.randBetween(1,12)).padStart(2, '0')}`,
            highlight: H.randBetween(1,3) == 1 ? 'green' : 'yellow',
        },
        {
            // "available": 3334,
            "date": `${H.randBetween(s_year, e_year)}-${String(H.randBetween(s_month, e_month)).padStart(2, '0')}-${String(H.randBetween(1,12)).padStart(2, '0')}`,
            highlight: H.randBetween(1,3) == 1 ? 'green' : 'red',
        },
        {
            // "available": 45489,
            "date": `${H.randBetween(s_year, e_year)}-${String(H.randBetween(s_month, e_month)).padStart(2, '0')}-${String(H.randBetween(1,12)).padStart(2, '0')}`,
            highlight: H.randBetween(1,3) == 1 ? 'green' : 'red',
        },
        {
            // "available": 3434,
            "date": `${H.randBetween(s_year, e_year)}-${String(H.randBetween(s_month, e_month)).padStart(2, '0')}-${String(H.randBetween(1,12)).padStart(2, '0')}`,
            highlight: H.randBetween(1,3) == 1 ? 'green' : 'red',
        },
        {
            // "available": 3434,
            "date": `${H.randBetween(s_year, e_year)}-${String(H.randBetween(s_month, e_month)).padStart(2, '0')}-${String(H.randBetween(1,12)).padStart(2, '0')}`,
            highlight: H.randBetween(1,3) == 1 ? 'green' : 'red',
        },
        {
            // "available": 3334,
            "date": `${H.randBetween(s_year, e_year)}-${String(H.randBetween(s_month, e_month)).padStart(2, '0')}-${String(H.randBetween(1,12)).padStart(2, '0')}`,
            highlight: H.randBetween(1,3) == 1 ? 'green' : 'red',
        },
        {
            // "available": 45489,
            "date": `${H.randBetween(s_year, e_year)}-${String(H.randBetween(s_month, e_month)).padStart(2, '0')}-${String(H.randBetween(1,12)).padStart(2, '0')}`,
            highlight: H.randBetween(1,3) == 1 ? 'green' : 'red',
        },
        {
            // "available": 3434,
            "date": `${H.randBetween(s_year, e_year)}-${String(H.randBetween(s_month, e_month)).padStart(2, '0')}-${String(H.randBetween(1,12)).padStart(2, '0')}`,
            highlight: H.randBetween(1,3) == 1 ? 'green' : 'yellow',
        },
        {
            // "available": 3434,
            "date": `${H.randBetween(s_year, e_year)}-${String(H.randBetween(s_month, e_month)).padStart(2, '0')}-${String(H.randBetween(1,12)).padStart(2, '0')}`,
            highlight: H.randBetween(1,3) == 1 ? 'green' : 'yellow',
        },
        {
            // "available": 3334,
            "date": `${H.randBetween(s_year, e_year)}-${String(H.randBetween(s_month, e_month)).padStart(2, '0')}-${String(H.randBetween(1,12)).padStart(2, '0')}`,
            highlight: H.randBetween(1,3) == 1 ? 'green' : 'red',
        },
        {
            // "available": 45489,
            "date": `${H.randBetween(s_year, e_year)}-${String(H.randBetween(s_month, e_month)).padStart(2, '0')}-${String(H.randBetween(1,12)).padStart(2, '0')}`,
            highlight: H.randBetween(1,3) == 1 ? 'green' : 'red',
        },
        {
            // "available": 3434,
            "date": `${H.randBetween(s_year, e_year)}-${String(H.randBetween(s_month, e_month)).padStart(2, '0')}-${String(H.randBetween(1,12)).padStart(2, '0')}`,
            highlight: H.randBetween(1,3) == 1 ? 'green' : 'red',
        },
        {
            // "available": 3434,
            "date": `${H.randBetween(s_year, e_year)}-${String(H.randBetween(s_month, e_month)).padStart(2, '0')}-${String(H.randBetween(1,12)).padStart(2, '0')}`,
            highlight: H.randBetween(1,3) == 1 ? 'green' : 'red',
        },
        {
            // "available": 3334,
            "date": `${H.randBetween(s_year, e_year)}-${String(H.randBetween(s_month, e_month)).padStart(2, '0')}-${String(H.randBetween(1,12)).padStart(2, '0')}`,
            highlight: H.randBetween(1,3) == 1 ? 'green' : 'red',
        },
    ]

    dates.length = H.randBetween(10, dates?.length)
    datePicker.value.setAvailableDates(dates)
}

// startTime: '09:00 AM',
// endTime: '09:00 AM',
// let dateObj = ref(null)
// let dateObj = ref(new Date)
// let dateObj = ref({
//     startDate: new Date(),
//     endDate: new Date(),
// })
// let dateObj = ref({startDate: new Date})
// let dateObj = ref('')
// let dateObj = ref(new Date())
let dateObj = ref({
    "startDate": new Date,
    "endDate": new Date,
    "startTime": "08:30 am",
    "endTime": "05:30 pm"
})

let show = ref(true);

function reset(){
    show.value = false;
    // dateObj.value = null;
    // dateObj.value = new Date();
    // dateObj.value = '11:23pm'
    // dateObj.value = '2024-7-4 - 2024-7-9';
    dateObj.value = {
    "startDate": new Date,
    "endDate": new Date,
    "startTime": "08:30 am",
    "endTime": "05:30 pm"
}
   
    setTimeout(() => {
        show.value = true;
    }, 300);
}


let classname = ref('status-active')
</script>

<template>
    <div class="ionic-card">
        <div class="ionic-card-header card-header-border">
            <h4 class="fs-20">Asset Search <button @click="reset" >Reset</button> </h4>
            <div class="card-header-rightside">
            </div>
        </div>
        <div class="ionic-card-body">
            <GoogleMapDrawGeofence></GoogleMapDrawGeofence>
           <p> FFFFFFFFFFFFF </p>
           <p> FFFFFFFFFFFFF</p>
           <p> FFFFFFFFFFFFF</p>
           product_Date :: {{ productStore.product }}
           <div class="my-5"  >
               
                <p @click="$refs.datePicker.setDate(moment(dateObj.startDate).add(1, 'day'), moment(dateObj.startDate).add(1, 'day'))" class="mt-3" :class="[classname]" > SetDate </p>
                <p @click="$refs.datePicker.setTime('11:22pm', '11:28')" class="mt-3" :class="[classname]" > SetTime </p>
                <div class="col-md-12 my-3 border">
                    <button @click="reset()" >Reset</button>
                    <button @click="reset()" >set 08:20, 19:20</button>
                    <pre> {{ dateObj }} </pre>
                   
                </div>

           </div>

            <div class="row">
                <div class="col-md-12 offset-md-1---">
                    <picker-emDateTimePicker v-if="show"
                     ref="datePicker"
                     v-model="dateObj" 
                     :skipSetValueBeforManualChange="true"
                     :row="6"
                     @change="log"
                     __columnGap="2px"
                     __rowGap="2px"
                     :__availableInDates="availableInDates"
                     @__nextPrevious="onNextPrev"
                     :__buttons="{applyBtn:false}"
                    :options="{ 
                        ...globalData.datePickerOptions,                     
                        useCustomRange: 
                        false ?? 
                        // true ?? 
                        [
                            // 'January', 'February', 'March', 'December',
                            // 'Auto Months',
                            // 'All Months',
                            // 'Last Week',
                            // 'Last 2 Weeks',
                            // 'This Month',
                            // 'Last 3 Months',
                            // 'next 3 weeks',
                            '3 days',
                            '3 weeks',
                            '3 Months',
                            ':Hot Deal:2024-07-21:2024-07-31',
                            ':Eid Vacation:2024-07-17:2024-07-25',
                        ],
                        // theme: 'light',
                        // timePickerUi: 'classic',
                        // timePickerUi: 'modern',
                        timePickerUi: 'standard',
                        // minuteStep: 5,
                        timePicker: true,
                        rangePicker: true,  
                        // skipHighlighterDefaultClassess: true,
                        // allowRightSideTimePicker: true,
                        // use24Format: true,
                        // onlyTimePicker: true,
                        timePickerButtons: true,
                        // skipSetValueBeforManualChange: true,   
                        // calendarQuantity: 2,
                        // multiCalendarMode: 'flex-around', 
                        // hideSwitcher: true,
                        // documentation: true,
                        // displayFormat: 'YYYY-MM-DD',
                        // minDate: 'today',
                        // maxDate: 'Today + 55 days',
                        // hideDateOutOfMinMax: true,
                        local: {
                            adjustWeekday: 0,
                        },
                        buttons: {
                            // applyBtn: false,
                        },
                                          
                        // useRandomSelection: true,

                        // rangeSelectionPattern: '5th week of month',
                        // rangeSelectionPattern: 'from Tue To Sat',

                        // allowDateOnlyFromCustomRange: true,
                        // autoOpen: true,
                        // invisible: true,
                        // sticky: true,
                        // timePickerUi: 'classic',
                        // displayIn: 'modal',
                        // displayIn: 'bottom_left',
                        // displayIn: 'bottom_center',
                        // displayIn: 'top_left',
                        displayIn: 'top_right',
                        // displayIn: 'top_center',
                        // displayIn: 'left_top',
                        // displayIn: 'left_bottom',
                        // displayIn: 'left_center',
                        // displayIn: 'right_top',
                        // displayIn: 'right_bottom',
                        // displayIn: 'right_center',
                        // displayIn: 'center',
                        // displayIn: 'inline',
                        // displayIn: 'inline_left',
                        // displayIn: 'inline_right',
                        // displayIn: 'inline_center',
                         }">

                    </picker-emDateTimePicker>
                </div>
             
               
            </div>

          
            
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>
           <p> GGGGG </p>



        </div>
    </div>

</template>
