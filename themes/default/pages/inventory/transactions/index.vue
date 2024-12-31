<script setup>
import { useReportStore } from "~/stores/rentmy/Report";
const reportStore = useReportStore();

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});
useHead({
  titleTemplate: "%s | Transaction Reports",
});

onMounted(async () => {
  // await reportStore.getTransactionsReport();
  showEffect.value = false;
});

let showEffect = ref(true);
let tableEffect = ref(false);
let payment_type_init = ref("all");
let startDate = ref({
  startDate: H.backDate(new Date(), 7),
  endDate: H.formatDate(new Date(), "YYYY-MM-DD"),
});
let datePickerOptions = {
  onlyTimePicker: false,
  timePickerUi: "standard",
  displayIn: "modal",
  theme: "dark",
  rangePicker: true,
  endTimeAutoValid: true,
  colors: {
    primary_bg: "#6bba1c",
  },
  startDate: H.backDate(new Date(), 7),
  endDate: H.formatDate(new Date(), "YYYY-MM-DD"),
};
async function jumpToPage(page_no) {
  let payload = {
    start_date: startDate.value.startDate,
    end_date: startDate.value.endDate,
    payment_type: payment_type_init.value,
    location: useCookie("rentmy_location_id").value,
  };
  tableEffect.value = true;
  await reportStore.getTransactionsReport(payload, page_no);
  tableEffect.value = false;
}

function submitTransactionSearchForm() {
  let payload = {
    start_date: startDate.value.startDate,
    end_date: startDate.value.endDate,
    payment_type: payment_type_init.value,
    location: useCookie("rentmy_location_id").value,
  };
  // console.log('payload', payload)
  reportStore.getTransactionsReport(payload);
}
</script>

<template>
  <div>
    <Breadcrumb
      title="Transaction Reports"
      :links="['transactions']"
    ></Breadcrumb>
    <div class="ionic-card">
      <div class="ionic-card-header card-header-border">
        <h4 class="fs-18" @click="showEffect = !showEffect">
          Transaction List
        </h4>
        <!-- <div class="ionic-card-rightside d-flex justify-content-between">
                <div class="date-box">
                    <div class="date-box-input">
                        <Picker-EmDateTimePicker ref="startDatePicker1" v-model="startDate" @change="(data) => { startDate = data }"
                            :options="{...globalData.datePickerOptions, displayIn: 'bottom_left', adjustX: 0, adjustY: 12}" />
                    </div>
                    <button @click.stop="$refs.startDatePicker1.toggle()" type="button" class="ionic-btn">
                                <i class="la la-calendar"></i>
                            </button>
                </div>
                <button type="button" class="ionic-btn ionic-theme-btn2 ionic-btnlg"
                    @click=" submitTransactionSearchForm()">Search</button>
            </div> -->
      </div>
      <div class="ionic-card-body">
        <div class="row">
          <div class="col-md-3">
            <div class="form-group">
              <label class="form-label">Select Type</label>
              <div class="date-box">
                <div class="date-box-input">
                  <Picker-EmDateTimePicker
                    ref="startDatePicker2"
                    v-model="startDate"
                    @change="
                      (data) => {
                        startDate = data;
                      }
                    "
                    :options="{
                      ...globalData.datePickerOptions,
                      displayIn: 'bottom_left',
                      rangePicker: true,
                      adjustX: 0,
                      adjustTop: 12,
                    }"
                  />
                </div>
                <button
                  @click.stop="$refs.startDatePicker2.toggle()"
                  type="button"
                  class="ionic-btn"
                >
                  <i class="la la-calendar"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label class="form-label">Payment Type</label>
              <div class="select-optionbox">
                <select class="form-control" v-model="payment_type_init">
                  <option :value="'all'">All</option>
                  <option :value="'card'">Card</option>
                  <option :value="'cash'">Cash</option>
                </select>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <button
                type="button"
                class="ionic-btn ionic-theme-btn2 ionic-btnlg transaction-search-btn"
                @click="submitTransactionSearchForm()"
              >
                Search

                <BtnLoader
                  v-if="H.isPendingAnyApi('Report:getTransactionsReport')"
                  color="black"
                ></BtnLoader>
              </button>
            </div>
          </div>
        </div>
        <div
          class="row mt-2 mb-4"
          v-if="reportStore?.transactionsReportSummary"
        >
          <h4 class="fs-18 m-2"> Transaction Summary </h4>
          <div class="col-12">
            <!-- <div class="ionic-transaction-info ionic-guards-infolist">
                        <div class="ionic-guards-infoitem">
                            <h5 class="fs-14">Transaction</h5>
                            <span>{{ reportStore?.transactionsReportSummary?.totalTransaction }}</span>
                        </div>
                        <div class="ionic-guards-infoitem">
                            <h5 class="fs-14">Cash Payment</h5>
                            <span>{{ reportStore?.transactionsReportSummary?.cashAmount }}</span>
                        </div>
                        <div class="ionic-guards-infoitem">
                            <h5 class="fs-14">Change Amount</h5>
                            <span>{{ reportStore?.transactionsReportSummary?.change_amount }}</span>
                        </div>
                        <div class="ionic-guards-infoitem">
                            <h5 class="fs-14">Tendered Amount</h5>
                            <span>{{ reportStore?.transactionsReportSummary?.amount_tendered }}</span>
                        </div>
                        <div class="ionic-guards-infoitem">
                            <h5 class="fs-14">Card Payment</h5>
                            <span>{{ reportStore?.transactionsReportSummary?.change_amount }}</span>
                        </div>
                        <div class="ionic-guards-infoitem">
                            <h5 class="fs-14">Manual Payment</h5>
                            <span>{{ reportStore?.transactionsReportSummary?.othersAmount }}</span>
                        </div>
                        <div class="ionic-guards-infoitem">
                            <h5 class="fs-14">Refund Amount</h5>
                            <span>{{ reportStore?.transactionsReportSummary?.refundedAmount }}</span>
                        </div>
                        <div class="ionic-guards-infoitem">
                            <h5 class="fs-14">Total</h5>
                            <span>{{ reportStore?.transactionsReportSummary?.total }}</span>
                        </div>
                    </div> -->
            <div class="table-responsive">
              <table class="table table-borderless">
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Cash Payment</th>
                    <th>Change Amount</th>
                    <th>Tendered Amount</th>
                    <th>Card Payment</th>
                    <th>Manual Payment</th>
                    <th>Refund Amount</th>
                    <th class="text-start">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="empty-tr">
                    <td colspan="88"></td>
                  </tr>

                  <template v-if="showEffect">
                    <tr>
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
                    <tr>
                      <td>
                        {{
                          reportStore?.transactionsReportSummary
                            ?.totalTransaction
                        }}
                      </td>
                      <td>
                        {{  RentmyHelper.currency.format(reportStore?.transactionsReportSummary?.cashAmount) }}
                      </td>
                      <td>
                        {{
                           RentmyHelper.currency.format(reportStore?.transactionsReportSummary?.change_amount)
                        }}
                      </td>
                      <td>
                        {{
                           RentmyHelper.currency.format(reportStore?.transactionsReportSummary
                            ?.amount_tendered)
                        }}
                      </td>
                      <td>
                        {{
                           RentmyHelper.currency.format(reportStore?.transactionsReportSummary?.change_amount)
                        }}
                      </td>
                      <td>
                        {{
                           RentmyHelper.currency.format(reportStore?.transactionsReportSummary?.othersAmount)
                        }}
                      </td>
                      <td>
                        {{
                           RentmyHelper.currency.format(reportStore?.transactionsReportSummary?.refundedAmount)
                        }}
                      </td>
                      <td>
                        {{ RentmyHelper.currency.format(reportStore?.transactionsReportSummary?.total) }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>

            <!-- <div class="d-flex justify-content-start mb-2">
                        <h6> Transaction : </h6> <span style="padding-top: 3px;padding-left: 3px;">
                            {{ reportStore?.transactionsReportSummary?.totalTransaction }}</span>
                    </div>
                    <div class="d-flex justify-content-start mb-2">
                        <h6> Cash Payment : </h6> <span style="padding-top: 3px;padding-left: 3px;"> $
                            {{ reportStore?.transactionsReportSummary?.cashAmount }}</span>
                    </div>
                    <div class="d-flex justify-content-start mb-2">
                        <h6> Change Amount : </h6> <span style="padding-top: 3px;padding-left: 3px;"> $
                            {{ reportStore?.transactionsReportSummary?.change_amount }}</span>
                    </div>
                    <div class="d-flex justify-content-start mb-2">
                        <h6> Tendered Amount : </h6> <span style="padding-top: 3px;padding-left: 3px;"> $
                            {{ reportStore?.transactionsReportSummary?.amount_tendered }}</span>
                    </div>
                    <div class="d-flex justify-content-start mb-2">
                        <h6> Card Payment : </h6> <span style="padding-top: 3px;padding-left: 3px;"> $
                            {{ reportStore?.transactionsReportSummary?.change_amount }}</span>
                    </div>
                    <div class="d-flex justify-content-start mb-2">
                        <h6> Manual Payment : </h6> <span style="padding-top: 3px;padding-left: 3px;"> $
                            {{ reportStore?.transactionsReportSummary?.othersAmount }}</span>
                    </div>
                    <div class="d-flex justify-content-start mb-2">
                        <h6> Refund Amount : </h6> <span style="padding-top: 3px;padding-left: 3px;"> $
                            {{ reportStore?.transactionsReportSummary?.refundedAmount }}</span>
                    </div>
                    <div class="d-flex justify-content-start mb-2">
                        <h6> Total : </h6> <span style="padding-top: 3px;padding-left: 3px;"> $
                            {{ reportStore?.transactionsReportSummary?.total }}</span>
                    </div> -->
          </div>
        </div>
        <h4 class="fs-18 m-2" v-if="reportStore?.paginateData?.data?.length">
          Transaction List
        </h4>
        <div
          class="table-responsive"
          v-if="reportStore?.paginateData?.data?.length"
        >
          <table class="table table-borderless">
            <thead>
              <tr>
                <th>Date</th>
                <th>Order id</th>
                <th>Customer name</th>
                <th>Location</th>
                <th>Payment Type</th>
                <th class="text-start">Payment Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr class="empty-tr">
                <td colspan="88"></td>
              </tr>

              <template v-if="showEffect">
                <tr
                  v-for="(x, index) in reportStore?.paginateData?.data
                    ?.length || 5"
                  :key="index"
                >
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
                <template
                  v-for="(
                    transaction, index
                  ) in reportStore?.transactionsReport"
                  :key="index"
                >
                  <tr>
                    <td>
                      {{ transaction?.date }}
                    </td>
                    <td>
                      {{ transaction?.order_id }}
                    </td>
                    <td>
                      {{ transaction?.customer_name }}
                    </td>
                    <td>
                      {{ transaction?.location }}
                    </td>
                    <td>
                      {{ transaction?.payment_type }}
                    </td>
                    <td>
                      {{ RentmyHelper.currency.format(transaction?.payment_amount) }}
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>

        <template v-if="showEffect && reportStore?.paginateData?.data?.length">
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
          <div
            class="d-flex justify-content-end align-items-center my-3"
            v-if="reportStore?.paginateData?.data?.length"
          >
            <p class="me-4">
              <strong class="text-white-50">
                Total: {{ reportStore.paginateData?.total }}
                <span class="mx-3">|</span>
                Page: {{ reportStore.paginateData?.page_no }}
                <span class="mx-3">|</span>
                Showing: {{ reportStore.transactionsReport?.length || 0 }}
              </strong>
            </p>
            <PaginationRentMy
              v-model="reportStore.paginateData"
              @jump-now="jumpToPage"
            ></PaginationRentMy>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
