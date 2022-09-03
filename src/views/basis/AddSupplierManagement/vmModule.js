import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from "element-plus";
import WangEditor from "wangEditor";
import { ref, reactive, onMounted, onBeforeUnmount, onUnmounted } from "vue";
import JsBarcode from 'jsbarcode'
import router from '../../../router'
import { useStore } from "vuex"
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router"
import Bus from '../../Bus.js'
export default {
    name: "AddSupplierManagement",
    setup() {
        const route = useRoute();
        const router = useRouter();
        const store = useStore();
        //关闭当前页面的标签页
        const closeThisRouter = () => {
            store.commit("closeCurrentTag", {
                $router: router,
                $route: route
            });
        };

        return {
            closeThisRouter
        };
    },
    data() {
        return {
            tableData: '',
            form: {
                SupplierId: '',
                SupplierName: '',
                Mobile: '',
                Address: '',
                ActiveStatus: 1,
                Summary: '',
                ShopCode: '',
                Creater: localStorage.getItem("ms_username"),
                Modifier: localStorage.getItem("ms_username"),
                UpdateTime: 0,
                SupplierType: 1,
                AccountLogin: '',
                Password: '',
                LegalPerson: '',
                Contact: '',
                ContactSex: 1,
                ContactPost: '',
                AccountName: '',
                AccountNumber: '',
                AccountBank: '',
                SettleMethod: 0,
                ContactMobile: '',
                ContactEmail: '',
                ZipCode: '',
                IsPriceFixed: true,
                IsTaxFixed: true,
                WeChatCode: '',
                ContactAddress: '',
            },
            rules: {
                SupplierName: [
                    { required: true, message: '这是必填字段', trigger: 'blur' }
                ],
                SupplierId: [
                    { required: true, message: '这是必填字段', trigger: 'blur' }
                ],
                SupplierType: [
                    { required: true, message: '这是必填字段', trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        funcGetTableData(supplierName, supplierId, shopCode, userType,topOrgId, activeStatus, page, pageSize) {
            var url = basis.SupplierManagement.query + "?supplierName=" + supplierName + "&supplierId=" + supplierId + "&shopCode=" + shopCode + 
						"&userType=" + userType + "&topOrgId=" + topOrgId + "&activeStatus=" + activeStatus + "&page=" + page + "&pageSize=" + pageSize;
            this.$axios.get(url).then(res => {
                this.tableData = res.data.Results;
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        funcGetCurrenCode(tableName, matType) {
            var url = basis.GeneratedNumber + "?tableName=" + tableName + "&matType=" + matType;
            this.$axios.get(url).then(res => {
                this.form.SupplierId = res.data;
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        eventSave() {
            if (!this.form.SupplierName || !this.form.SupplierId || !this.form.SupplierType) {
                this.$message({ message: '供应商名称，编号，供应商类别不能为空!', type: 'warning' });
                return;
            }
            if (!this.form.AccountLogin) {
                this.form.AccountLogin = this.form.SupplierId
            }
            if (!this.form.Password) {
                this.form.Password = '888888';
            }
            for (var item of this.tableData) {
                if (this.form.AccountLogin == item.AccountLogin) {
                    this.$message({ message: '登录账号重复', type: 'warning' });
                    return;
                }
                if (this.form.SupplierId == item.SupplierId) {
                    this.$message({ message: '编号重复', type: 'warning' });
                    return;
                }
            }
						const loading = func.backgroundLoading('Loading');
            var url = basis.SupplierManagement.add + '?orgId=' + localStorage.getItem("OrganizationId");
            var params = this.form;
            this.$axios.post(url, params).then(res => {
								loading.close();
                this.$message({ message: '新增成功', type: 'success' });


                Bus.emit("SupplierManagementGetTableData");
                this.closeThisRouter();
            }).catch(err => {
								loading.close();
                this.$message({ message: err, type: 'warning' });
								// Bus.emit("SupplierManagementGetTableData");
								// this.closeThisRouter();
            });
        },

    },
    mounted() {
        func.TracingPointFunc();
        this.funcGetTableData('', '', localStorage.getItem("shopCode"), localStorage.getItem("userType"),localStorage.getItem("OrganizationId"), -1, 1, 10000000);
        this.funcGetCurrenCode("SupplierInfo", "");
    },
    watch: {

    },
};