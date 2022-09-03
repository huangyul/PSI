import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from "element-plus";
import router from '../../../router'
import Bus from '../../Bus.js'
import { ref, reactive, onMounted, onBeforeUnmount, onUnmounted } from "vue";
export default {
    name: "SupplierManagement",
    setup() {
        onUnmounted(() => {
            Bus.off("SupplierManagementGetTableData");
						localStorage.removeItem('UpdateSupplierManagementSupplierId');
        });
    },
    data() {
        return {
						permissionsList:'',
            username: '',
            addDate: '',
            searchForm: {
                SupplierId: '',
                SupplierName: '',
                ActiveStatus: -1,
            },
            tableData: [],
            dialogVisible: false,
            addForm: {

            },
            tableDeteleData: '',
            OpenWindowTitle: '',
            page: 1,
            pageSize: 15,
            total: 0,
        }
    },
    methods: {
        funcGetTableData(supplierName, supplierId, shopCode, userType, topOrgId,activeStatus, page, pageSize) {
            var url = basis.SupplierManagement.query + "?supplierName=" + supplierName + "&supplierId=" + supplierId + 
						"&shopCode=" + shopCode + "&userType=" + userType + "&topOrgId=" + topOrgId + "&activeStatus=" + activeStatus + 
						"&page=" + page + "&pageSize=" + pageSize;
            this.$axios.get(url).then(res => {
                this.tableData = res.data.Results;
                this.total = res.data.TotalCount;
								//console.log(res);
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        funcGetDate() {
            var myDate = new Date();
            this.addDate = func.formatTimeToStr(myDate);
        },
        funcGetCurrenCode(tableName, matType) {
            var url = basis.GeneratedNumber + "?tableName=" + tableName + "&matType=" + matType;
            this.$axios.get(url).then(res => {
                this.addForm.Unit_No = res.data;
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        //单独删除
        funcTableDetele(supplierId, updateTime, shopCode, userType) {
            var url = basis.SupplierManagement.delete + "?supplierId=" + supplierId + "&updateTime=" + updateTime + "&shopCode=" + shopCode + "&userType=" + userType;
            this.$axios.delete(url).then(res => {
                ElMessage.success({ message: '删除成功', type: 'success', });
                this.eventSearch();
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        //批量删除
        funcTableDeteleList(supplierIds, shopCode, userType) {
            var url = basis.SupplierManagement.deleteList + "?supplierIds=" + supplierIds + "&shopCode=" + shopCode + "&userType=" + userType;
            this.$axios.delete(url).then(res => {
                ElMessage.success({ message: '删除成功', type: 'success', });
                this.eventSearch();
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        //批量更新状态
        funcUpdateStatus(userCode, shopCode, userType, activeStatus, supplierIds) {
            var url = basis.SupplierManagement.updateStatus + "?userCode=" + userCode + "&shopCode=" + shopCode + "&userType=" + userType + "&activeStatus=" + activeStatus + "&supplierIds=" + supplierIds;
            this.$axios.put(url).then(res => {
                this.$message({ message: '更新成功', type: 'success' });
                this.eventSearch();
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        funcRowClassName({ row, rowIndex }) {
          let className = ''
          if (rowIndex % 2 == 1) {
            className += 'double-row'
          }
          for (var item of this.tableDeteleData) {
            if (item == row) {
              className += ' rowSelect'
            }
          }
          return className
        },
        eventPageSizeChange(val) {
            this.pageSize = val;
            this.eventSearch();
        },
        eventPageChange(val) {
            this.page = val;
            this.eventSearch();
        },
        eventSearch() {
            this.funcGetTableData(this.searchForm.SupplierName, this.searchForm.SupplierId, localStorage.getItem("shopCode"), 
						localStorage.getItem("userType"),localStorage.getItem("OrganizationId"), this.searchForm.ActiveStatus, this.page, this.pageSize);
        },
        eventReset() {
            this.searchForm = {
                SupplierId: '',
                SupplierName: '',
                ActiveStatus: -1,
            }
        },
        eventDetele() {
            if (this.tableDeteleData.length == 1) {
                for (var item of this.tableDeteleData) {
                    this.funcTableDetele(item.SupplierId, item.UpdateTime, localStorage.getItem("shopCode"), localStorage.getItem("userType"));
                }
            } else if (this.tableDeteleData.length == 0) {
                ElMessage.warning({ message: '还未选择', type: 'warning', });
            } else if (this.tableDeteleData.length > 1) {
                var supplierIds = [];
                for (var item of this.tableDeteleData) {
                    supplierIds.push(item.SupplierId);
                }
                supplierIds = supplierIds.join(",");
                this.funcTableDeteleList(supplierIds, localStorage.getItem("shopCode"), localStorage.getItem("userType"));
            }
        },
        eventTableSelect(val) {
            this.tableDeteleData = val;
        },
        eventOpenWindow(row) {
            if (row) {
                localStorage.setItem("UpdateSupplierManagementSupplierId", row.SupplierId);
                router.push("/UpdateSupplierManagement");
            } else {
                router.push("/AddSupplierManagement");
            }

        },
        eventUpdateStatus(status) {
            if (this.tableDeteleData.length == 0) {
                ElMessage.warning({ message: '还未选择', type: 'warning', });
            } else if (this.tableDeteleData.length > 0) {
                var supplierIds = [];
                for (var item of this.tableDeteleData) {
                    supplierIds.push(item.SupplierId)
                }
                supplierIds = supplierIds.join(",");
                this.funcUpdateStatus(localStorage.getItem("userCode"), localStorage.getItem("shopCode"), localStorage.getItem("userType"), status, supplierIds);
            }
        },
        eventSaveWindow() {

        },
    },
    mounted() {
				func.SearchJudge();
        this.username = localStorage.getItem("ms_username");
        this.eventSearch();
				for(var item of JSON.parse(localStorage.getItem("permissions"))){
					if(item.ModuleUrl == 'SupplierManagement'){
						this.permissionsList = item.Rights;
					}
				}
        Bus.on("SupplierManagementGetTableData", () => {
            this.eventSearch();
        })
    },
    watch: {

    },
};