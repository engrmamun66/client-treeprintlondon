<script setup>

definePageMeta({
  keepalive: false,
  key: (route) => route.fullPath,
});

useHead({
  title: "My App",
  titleTemplate: `%s | Product Details`,
});

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

let isAsset = ref(false);
let viewElement = ref(null);
provide('isAsset', isAsset);

let TAB = ref(null);
function selectTab(tab){
  if(viewElement.value){
    TAB.value = tab;
    viewElement.value.selectTab(tab);
    H.delay(()=>TAB.value = null, 2000)
  }
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const topOffset = section.getBoundingClientRect().top + window.pageYOffset - 100;
    window.scrollTo({
      top: topOffset,
      behavior: 'instant'
    });
    
    let div = section.querySelector('div');
    if([
      'section_details', 
      'section_images',
      'section_pricing',
      'section_asset',
    ].includes(sectionId)){
      div = section;
    }

    if(div){
      div.classList.add('blinking-border');
      H.delay(()=>div.classList.remove('blinking-border'), 500)
    }
  }
}

let scrolledDown = ref(false);

function onScroll(){
  if(window.scrollY >= 100){
    scrolledDown.value = true;
  } else {
    scrolledDown.value = false;
  }
}

onMounted(()=>{
  window.removeEventListener('scroll', onScroll);
  window.addEventListener('scroll', onScroll);
})

onBeforeUnmount(()=> {
  window.removeEventListener('scroll', onScroll);
})

</script>


<template>
  <div>
    <!-- <div class="d-flex justify-content-between align-items-center" > -->
    <div class="d-md-flex justify-content-between align-items-center" style="margin-right: 20px;" >
      <Breadcrumb title="Product Details" :links="['products', 'productDetails']"></Breadcrumb>
      <div :class="{'section-navigator-fixedpos': scrolledDown}" >
        <div class="section-navigator" >
          <button :class="[BTNCLASS.greenOutline]" class="ms-0 section-displaytext-button" style="padding: 0px 18px;" >
            <i class="bx bxs-book-content size-1 px-0 me-2 transformY-1px-"></i> 
            Sctions 
            <!-- <i-las t="down-arrow" class="ms-2" ></i-las>  -->
          </button>
          <ul>
          
              <li>
                <div>
                  <a @click.prevent="scrollToSection('section_details')">Details</a>
                  <button @click.stop="selectTab('details')" >
                    <BtnLoader v-if="TAB == 'details'" :show="true" size="12px" />
                    <i-las v-else t="edit" />
                  </button>
                </div>
              </li>
              <li>
                <div>
                  <a @click.prevent="scrollToSection('section_product_options')">Product Options</a>
                  <button @click.stop="selectTab('product_options')" >
                    <BtnLoader v-if="TAB == 'product_options'" :show="true" size="12px" />
                    <i-las v-else t="edit" />
                  </button>
                </div>
              </li>
              <li>
                <div>
                  <a @click.prevent="scrollToSection('section_variant')">Variant</a>
                  <button @click.stop="selectTab('variants')" >
                    <BtnLoader v-if="TAB == 'variants'" :show="true" size="12px" />
                    <i-las v-else t="edit" />
                  </button>
                </div>
              </li>
              <li v-if="isAsset">
                <div>
                  <a @click.prevent="scrollToSection('section_asset')">Assets</a>
                  <button @click.stop="selectTab('assets')" >
                    <BtnLoader v-if="TAB == 'assets'" :show="true" size="12px" />
                    <i-las v-else t="edit" />
                  </button>
                </div>
              </li>
              <li>
                <div>
                  <a @click.prevent="scrollToSection('section_pricing')">Pricing</a>
                  <button @click.stop="selectTab('pricing')" >
                    <BtnLoader v-if="TAB == 'pricing'" :show="true" size="12px" />
                    <i-las v-else t="edit" />
                  </button>
                </div>
              </li>
              <li>
                <div>
                  <a @click.prevent="scrollToSection('section_images')">Images</a>
                  <button @click.stop="selectTab('images')" >
                    <BtnLoader v-if="TAB == 'images'" :show="true" size="12px" />
                    <i-las v-else t="edit" />
                  </button>
                </div>
              </li>
              <li>
                <div>
                  <a @click.prevent="scrollToSection('section_related_items')">Related Item</a>
                  <button @click.stop="selectTab('related_items')" >
                    <BtnLoader v-if="TAB == 'related_items'" :show="true" size="12px" />
                    <i-las v-else t="edit" />
                  </button>
                </div>
              </li>              
              <li>
                <div>
                  <a @click.prevent="scrollToSection('section_category')">Category</a>
                  <button @click.stop="selectTab('category')" >
                    <BtnLoader v-if="TAB == 'category'" :show="true" size="12px" />
                    <i-las v-else t="edit" />
                  </button>
                </div>
              </li>
              <li>
                <div>
                  <a @click.prevent="scrollToSection('section_calendar')" class="text-white-50 pointer-events-none" >Calendar</a>
                  <button @click.stop="selectTab('calendar')" >
                    <BtnLoader v-if="TAB == 'calendar'" :show="true" size="12px" />
                    <i-las v-else t="edit" />
                  </button>
                </div>
              </li>
          </ul>
        </div>
      </div>
    </div>
    <Product-DetailsView :productId="useRoute().params?.product_id" ref="viewElement" ></Product-DetailsView>
  </div>
</template>
