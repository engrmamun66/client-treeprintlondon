<template>
    <div class="row">
      <div class="col-md-8">
        <div class="ionic-card">
          <div class="ionic-card-header card-header-border">
            <h4 class="fs-20">
              Log details
            </h4>
          </div>
          <div class="ionic-card-header card-header-border">
            <div class="ionic-card-header-inner">
              <div class="profile-guard-list">
                <div class="profile-guard-item">
                  <div class="profile-guarditem-infoimg">
                    <div class="profile-guarditem-info">
                      <template v-if="loadData">
                        <ShimmerEffect
                          bg="light"
                          height="20px"
                          width="150px"
                        ></ShimmerEffect>
                        <ShimmerEffect
                          bg="light"
                          height="20px"
                          width="100px"
                          class="mt-2"
                        ></ShimmerEffect>
                      </template>
                      <template v-else>
                        <h5>dddd</h5>
                        <span class="text-light">Batch # 010</span>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="ionic-card-body">
            <div class="activesite-hourspay activesite-overwall">
              <div class="activesite-hourspay">
                <div class="hourspay-listitem">
                  <div class="hourspay-item-text">Hourly Rate</div>
                  <div class="hourspay-item-rightside">
                    <input
                      
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="hourspay-listitem">
                  <div class="hourspay-item-text">Hourly Rate</div>
                  <div class="hourspay-item-rightside">
                    <input
                      
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="hourspay-listitem">
                  <div class="hourspay-item-text">Hourly Rate</div>
                  <div class="hourspay-item-rightside">
                    <input
                      
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script setup>
let loadData = ref(false)

console.log('hello')

</script>
