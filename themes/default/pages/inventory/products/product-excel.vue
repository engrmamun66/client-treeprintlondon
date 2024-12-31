<script setup>
import { useProductStore } from '~/stores/rentmy/Product';
const productStore = useProductStore();

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

</script>

<template>
    <div class="ionic-card">
        <div class="ionic-card-header card-header-border">
            <h4 class="fs-18">Upload Initial Product Excel</h4>
            <div class="card-header-rightside">
                <button @click="navigateTo('/inventory/products')" class="ionic-btn ionic-theme-btn2 addnew-product-btn">Back</button>
            </div>
        </div>
        <div class="ionic-card-body">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="" class="form-label">Image Uplaod</label>
                        <el-DropFile ref="uploader" v-model="productStore.files" :show-details="true" :accepts="'xls,xlsx,xlsm'" />
                    </div>

                    <div class="d-flex justify-content-center">
                        <button :disabled="!productStore.files?.length" @click="productStore.importProducts" type="button" class="activestatus-btn px-4 me-2"> <i-las t="upload" class="size-2 ty--2 me-1"></i-las> Upload    <BtnLoader class="ms-2" :show="H.isPendingAnyApi('Product:importProduct')" :color="'white'" /></button>
                        <button :disabled="!productStore.files?.length" @click="$refs.uploader.removeFileAll()" type="button" class="redstatus-btn px-4 "> <i-las t="reset" class="size-2 ty--2 me-1"></i-las> Cancel </button>
                    </div>
                </div>
                <div class="col-md-6">
                    <div>
                        <h4>Import instructions</h4>
                        <div> Please download sample excel file for importing and fill the
                            necessary data. </div>
                        <div> First tab on the sample for importing products. After importing we
                            will provide another excel file for updating price &amp;&amp; assets </div>
                        <div>&nbsp;</div>
                        <div class="mb-20"><a title="Download Sample" class="btn btn-sm btn-brand bg-black" style="color: #fff;"
                                href="https://rentmyapidevteam1.leaperdev.rocks/api/products/download/sample">Download
                                Sample</a></div>
                        <div>&nbsp;</div>
                        <table class="table">
                            <tr>
                                <td width="30%">Product ID</td>
                                <td>Should be empty for new products</td>
                            </tr>
                            <tr>
                                <td>Variant Product ID</td>
                                <td>Should be empty for new products</td>
                            </tr>
                            <tr>
                                <td>Product Name</td>
                                <td>Valid Unique Product name</td>
                            </tr>
                            <tr>
                                <td>Location Name</td>
                                <td> Valid Location names. This names should match with system
                                    existing locations. Invalid Location name will not import for that product. </td>
                            </tr>
                            <tr>
                                <td>Variants</td>
                                <td> Variant Options names. Comma separated [,] for multiple
                                    names. e.g - Color,Size. Keep empty for empty variant. </td>
                            </tr>
                            <tr>
                                <td>Variant Values</td>
                                <td> Variant names. Comma separated [,] for multiple names. e.g -
                                    Color,Size. Keep empty for empty variant. </td>
                            </tr>
                            <tr>
                                <td>Barcode</td>
                                <td>Product / Variants Barcode</td>
                            </tr>
                            <tr>
                                <td>Quantity</td>
                                <td> Product/Variant quantity for untracted items. Tracked items
                                    quantity calculated from total assets. </td>
                            </tr>
                            <tr>
                                <td>Keyword</td>
                                <td>Comma separated keyword names</td>
                            </tr>
                            <tr>
                                <td>Description</td>
                                <td>Product Description</td>
                            </tr>
                            <tr>
                                <td>Supplier Name</td>
                                <td>Individual Supplier name for any product.</td>
                            </tr>
                            <tr>
                                <td>Supply ID</td>
                                <td>Suppler Product Identification Number</td>
                            </tr>
                            <tr>
                                <td>Deposit Amount</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Sales Tax</td>
                                <td>Product Sales tax (in percentage e.g 8.5)</td>
                            </tr>
                            <tr>
                                <td>Tag</td>
                                <td> Tag names ( for multiple tags add comma separated names e.g
                                    Accessories, Cloths) </td>
                            </tr>
                            <tr>
                                <td>Weight</td>
                                <td>Item weight (used for shipping)</td>
                            </tr>
                            <tr>
                                <td>Weight Unit</td>
                                <td> Item weight unit. Valid values are : pound / kilogram /
                                    ounce </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>