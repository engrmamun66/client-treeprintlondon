<template>
    <div>
        <div class="row">
            <div class="col-md-4">
                <div class="ionic-card">
                    <div class="ionic-card-header card-header-border">
                        <h4 class="fs-22">Technician Profile</h4>
                    </div>
                    <div class="ionic-card-header card-header-border">
                        <div class="ionic-card-header-inner">
                            <div class="profile-guard-list">
                                <div class="profile-guard-item">
                                    <div class="profile-guarditem-infoimg">
                                        <img src="https://s3.us-west-2.amazonaws.com/storage-dev.inspectdeploy.io/media/users/1683189947.jpeg"
                                            alt="profile img" />
                                        <div class="profile-guarditem-info">
                                            <h5>Test Guard App</h5>
                                            <span class="text-light">Batch # 010</span>
                                        </div>
                                    </div>
                                    <button class="active-status"><span class="active-status-btn"></span>Active</button>
                                </div>
                            </div>
                            <div class="gurad-profile-gps">
                                <h5>GPS</h5>
                                <div class="guard-profile-gpsbar">
                                    gps
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ionic-card-body">
                        <div class="activesite-hourspay activesite-overwall">
                            <div class="activesite-hourspay">
                                <div class="hourspay-listitem">
                                    <div class="hourspay-item-text">Start Date</div>
                                    <div class="hourspay-item-rightside"><input type="text" class="form-control" />
                                    </div>
                                </div>
                                <div class="hourspay-listitem">
                                    <div class="hourspay-item-text">Hourly Rate</div>
                                    <div class="hourspay-item-rightside"><input type="text" class="form-control" />
                                    </div>
                                </div>
                                <div class="hourspay-listitem">
                                    <div class="hourspay-item-text">1099 or w-2</div>
                                    <div class="hourspay-item-rightside"><input type="text" value="1099"
                                            class="form-control" /></div>
                                </div>
                                <div class="hourspay-listitem">
                                    <div class="hourspay-item-text">Driver License Status</div>
                                    <div class="hourspay-item-rightside"><input type="text" value="Valid"
                                            class="form-control" /></div>
                                </div>
                                <div class="hourspay-listitem">
                                    <div class="hourspay-item-text">Guard License Status</div>
                                    <div class="hourspay-item-rightside"><input type="text" value="Valid"
                                            class="form-control" /></div>
                                </div>
                                <div class="hourspay-listitem">
                                    <div class="hourspay-item-text">GPS Device #</div>
                                    <div class="hourspay-item-rightside"><input type="text" class="form-control" />
                                    </div>
                                </div>
                                <div class="hourspay-listitem">
                                    <div class="hourspay-item-text">Phone</div>
                                    <div class="hourspay-item-rightside"><input type="text" class="form-control" />
                                    </div>
                                </div>
                                <div class="hourspay-listitem">
                                    <div class="hourspay-item-text">Whatsapp</div>
                                    <div class="hourspay-item-rightside"><input type="text" class="form-control" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="ionic-card">
                    <div class="ionic-card-body">
                        <div class="invoice-map pt-0">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6511980.1304290565!2d-124.59210174550276!3d37.16036014148867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia%2C%20USA!5e0!3m2!1sen!2sbd!4v1718972991655!5m2!1sen!2sbd"
                                style="border: 0;" loading="lazy"></iframe>
                            <div class="invoice-mapmore-menu">
                                <a href="#"><i class="las la-ellipsis-v"></i></a>
                                <div class="invoice-mapmore-menubody"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="ionic-card">
                    <div class="ionic-card-header card-header-border">
                        <h4 class="fs-22">Work Orders</h4>
                    </div>
                    <div class="ionic-card-body">
                        <div class="work-order-card ionic-db-card wordorder-active">
                            <div class="ionic-db-card-left">
                                <h5 class="fs-16 mb-2 pb-1">Solar Generator T01</h5>
                                <span class="fs-12 mb-3">Change Oil</span>
                                <div class="select-optionbox order-selectbox">
                                    <select class="form-control">
                                        <option value="all">Open</option>
                                        <option value="card">Open2</option>
                                        <option value="cash">Open3</option>
                                    </select>
                                </div>
                            </div>
                            <div class="ionic-db-card-right">
                                <div class="ionic-db-card-right-inner">
                                    <span class="fs-10 mb-3">#213</span>
                                    <span class="work-status status-active">Medium</span>
                                    <span class="fs-10 mt-3">
                                        Requested<br> 
                                        by supervisor
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="work-order-card ionic-db-card">
                            <div class="ionic-db-card-left">
                                <h5 class="fs-16 mb-2 pb-1">Solar Generator T01</h5>
                                <span class="fs-12 mb-3">Change Oil</span>
                                <div class="select-optionbox order-selectbox">
                                    <select class="form-control">
                                        <option value="all">Open</option>
                                        <option value="card">Open2</option>
                                        <option value="cash">Open3</option>
                                    </select>
                                </div>
                            </div>
                            <div class="ionic-db-card-right">
                                <div class="ionic-db-card-right-inner">
                                    <span class="fs-10 mb-3">#213</span>
                                    <span class="work-status status-canceled">High</span>
                                    <span class="fs-10 mt-3">
                                        Requested<br> 
                                        by supervisor
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="work-order-card ionic-db-card">
                            <div class="ionic-db-card-left">
                                <h5 class="fs-16 mb-2 pb-1">Solar Generator T01</h5>
                                <span class="fs-12 mb-3">Change Oil</span>
                                <div class="select-optionbox order-selectbox">
                                    <select class="form-control">
                                        <option value="all">Open</option>
                                        <option value="card">Open2</option>
                                        <option value="cash">Open3</option>
                                    </select>
                                </div>
                            </div>
                            <div class="ionic-db-card-right">
                                <div class="ionic-db-card-right-inner">
                                    <span class="fs-10 mb-3">#213</span>
                                    <span class="work-status status-active">Medium</span>
                                    <span class="fs-10 mt-3">
                                        Requested<br> 
                                        by supervisor
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="table-responsive">
                    <div class="ionic-card">
                        <div class="ionic-card-header card-header-border d-flex justify-content-between align-items-center">
                            <h4 class="fs-18">Check IN / OUT</h4>
                        </div>
                        <div class="ionic-card-body">
                            <div class="table-responsive">
                                <table class="table table-borderless">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Day</th>
                                            <th>Check-In</th>
                                            <th>Check-Out</th>
                                            <th>Photo</th>
                                            <th>Check Point Hit</th>
                                            <th>Stayed in Geofence</th>
                                            <th>Dispatch Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="empty-tr">
                                            <td colspan="4"></td>
                                        </tr>
                                        <tr>
                                            <td>22/12/2024</td>
                                            <td>Monday</td>
                                            <td>09:00</td>
                                            <td>17:00</td>
                                            <td>04</td>
                                            <td>12</td>
                                            <td>01 h 01 min</td>
                                            <td>4.5 / 5</td>
                                        </tr>
                                        <tr>
                                            <td>22/12/2024</td>
                                            <td>Monday</td>
                                            <td>09:00</td>
                                            <td>17:00</td>
                                            <td>04</td>
                                            <td>12</td>
                                            <td>01 h 01 min</td>
                                            <td>4.5 / 5</td>
                                        </tr>
                                        <tr>
                                            <td>22/12/2024</td>
                                            <td>Monday</td>
                                            <td>09:00</td>
                                            <td>17:00</td>
                                            <td>04</td>
                                            <td>12</td>
                                            <td>01 h 01 min</td>
                                            <td>4.5 / 5</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="d-flex justify-content-end align-items-center my-3">
                                    <p class="me-4">
                                        <strong class="text-white-50"> Total: 2 <span class="mx-3">|</span> Page: 1 <span class="mx-3">|</span> Showing: 2</strong>
                                    </p>
                                    <!--v-if-->
                                </div>
                            </div>
                        </div>
                        <!-- Modal Start --><!--v-if-->
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

</script>