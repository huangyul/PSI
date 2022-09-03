import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from "element-plus"
import router from '../../../router'
export default {
    name: "WarehouseManagement",
    data() {
        return {
						permissionsList:'',
            isShowPosition: '',
            username: '',
            addDate: '',
            searchForm: {
                shopInfo: '',
            },
            tableData: [],
            dialogVisible: false,
            addForm: {
                Address: "",
                Code: "",
                Contact: "",
                ContactNumber: "",
                Name: "",
                Remark: "",
                ShopCode: "",
                ShopName: "",
                UpdateTime: 0,
                ZipCode: "",
            },
            tableDeteleData: '',
            OpenWindowTitle: '',
            page: 1,
            pageSize: 15,
            total: 0,
            shopList: [],
						isUpdate:false,
        }
    },
    methods: {
        funcGetTableData(name, code, shopcode, page, pageSize) {
            var url = basis.WarehouseManagement.query + "?name=" + name + "&code=" + code + "&shopcode=" + shopcode + "&page=" + page + "&pageSize=" + pageSize;
            this.$axios.get(url).then(res => {
                this.tableData = res.data.Results;
                this.total = res.data.TotalCount;
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        funcGetDate() {
            var myDate = new Date();
            this.addDate = func.formatTimeToStr(myDate);
        },
        funcGetCurrenCode(tableName, matType) {
						this.addForm.Code = func.randomString(7);
						return;
            var url = basis.GeneratedNumber + "?tableName=" + tableName + "&matType=" + matType;
            this.$axios.get(url).then(res => {
                this.addForm.Code = res.data;
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        //单独删除
        funcTableDetele(code, updateTime, shopCode, userType) {
            var url = basis.WarehouseManagement.delete + "?code=" + code + "&updateTime=" + updateTime + "&shopCode=" + shopCode + "&userType=" + userType;
            this.$axios.delete(url).then(res => {
                ElMessage.success({ message: '删除成功', type: 'success', });
                this.eventSearch();
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        //批量删除
        funcTableDeteleList(codes) {
            var url = basis.WarehouseManagement.deleteList + "?codes=" + codes;
            this.$axios.delete(url).then(res => {
                ElMessage.success({ message: '删除成功', type: 'success', });
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
        //获取仓库or仓位列表
        funcGetWhOrPositionInfo(shopCode, whCode) {
            var url = basis.WhOrPositionInfo + "?shopCode=" + shopCode + "&whCode=" + whCode;
            this.$axios.get(url).then(res => {
                console.log(res);
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        //获取门店信息列表
        funcGetShopCodeList(shopCode) {
            var url = basis.GetShopCodeList + "?shopCode=" + shopCode;
            this.$axios.get(url).then(res => {
                this.shopList = res.data;
                if(this.shopList.length == 1){
                    this.searchForm.shopInfo = this.shopList[0].Code;
                    this.addForm.ShopCode = this.shopList[0].Code;
                }
                this.eventSearch();
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
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
            if (this.searchForm.shopInfo) {
                this.funcGetTableData('', '', this.searchForm.shopInfo, this.page, this.pageSize);
            } else {
                this.funcGetTableData('', '', localStorage.getItem("shopCode"), this.page, this.pageSize);
            }
        },
        eventReset() {
            this.searchForm.shopInfo = '';
        },
        eventDetele() {
            if (this.tableDeteleData.length == 1) {
                for (var item of this.tableDeteleData) {
                    this.funcTableDetele(item.Code, item.UpdateTime, localStorage.getItem("shopCode"), localStorage.getItem("userType"));
                }
            } else if (this.tableDeteleData.length == 0) {
                ElMessage.warning({ message: '还未选择', type: 'warning', });
            } else if (this.tableDeteleData.length > 1) {
                var codes = [];
                for (var item of this.tableDeteleData) {
                    codes.push(item.Code);
                }
                codes = codes.join(",");
                this.funcTableDeteleList(codes);
            }
        },
        eventTableSelect(val) {
            this.tableDeteleData = val;
        },
        eventOpenWindow(row) {
            this.funcGetDate();
            if (row) {
                this.OpenWindowTitle = '编辑';
								this.isUpdate = true;
                var url = basis.WarehouseManagement.queryOne + "?Code=" + row.Code;
                this.$axios.get(url).then(res => {
                    this.addForm = {
                        Address: res.data.Address,
                        Code: res.data.Code,
                        Contact: res.data.Contact,
                        ContactNumber: res.data.ContactNumber,
                        Name: res.data.Name,
                        Remark: res.data.Remark,
                        ShopCode: res.data.ShopCode,
                        ShopName: res.data.ShopName,
                        UpdateTime: res.data.UpdateTime,
                        ZipCode: res.data.ZipCode,
                        Creater: res.data.Creater,
                        Modifier: this.username,
                    };
										this.addDate = res.data.ModifyTime;
                }).catch(err => {
                    this.$message({
                        message: err,
                        type: 'warning'
                    });
                    this.eventSearch();
                });
            } else {
                this.OpenWindowTitle = '新增';
								this.isUpdate = false;
                this.addForm = {
                    Address: "",
                    Code: "",
                    Contact: "",
                    ContactNumber: "",
                    Name: "",
                    Remark: "",
                    ShopCode: '',
                    ShopName: '',
                    UpdateTime: 0,
                    ZipCode: "",
                    Creater: this.username,
                    Modifier: this.username,
                };
                this.funcGetCurrenCode("PSI_Base_Warehouse", "");
            }
            this.dialogVisible = true;
        },
        eventSaveWindow() {
						if(!this.addForm.Name || !this.addForm.ShopCode || !this.addForm.Code){
							ElMessage.warning({ message: '仓库名称，编号，所属门店不能为空', type: 'warning', });
							return;
						}
						if(this.addForm.Name.length > 50 || this.addForm.Remark.length > 200){
							ElMessage.warning({ message: '仓库名称长度不能超过50，备注长度不能超过200', type: 'warning', });
							return;
						}
            for (var item of this.shopList) {
                if (item.Code == this.addForm.ShopCode) {
                    this.addForm.ShopName = item.Name;
                }
            }
						const loading = func.backgroundLoading('Loading');
            if (this.OpenWindowTitle == '新增') {
                var params = this.addForm;
                var url = basis.WarehouseManagement.add;
                this.$axios.post(url, params).then(res => {
										loading.close();
                    ElMessage.success({ message: '新增成功', type: 'success', });
                    this.eventSearch();
										this.dialogVisible = false;
                }).catch(err => {
										loading.close();
                    ElMessage.warning({ message: err, type: 'warning', });
                });
            } else if (this.OpenWindowTitle == '编辑') {
                var params = this.addForm;
                var url = basis.WarehouseManagement.update + "?shopCode=" + localStorage.getItem("shopCode") + "&userType=" + localStorage.getItem("userType");
                this.$axios.put(url, params).then(res => {
										loading.close();
                    ElMessage.success({ message: '更新成功', type: 'success', });
                    this.eventSearch();
										this.dialogVisible = false;
                }).catch(err => {
										loading.close();
                    ElMessage.warning({ message: err, type: 'warning', });
                });
            }
            //this.dialogVisible = false;
        },
        eventCheckPosition() {
            if (this.tableDeteleData.length <= 0) {
                ElMessage.warning({ message: '未选择仓库', type: 'warning', });
            } else if (this.tableDeteleData.length == 1) {
                localStorage.setItem("WarehouseCode", this.tableDeteleData[0].Code);
                router.push("/PositionsManagement");
            } else {
                ElMessage.warning({ message: '只能选择一个仓库', type: 'warning', });
            }
        }
    },
    mounted() {
				func.SearchJudge();
        this.username = localStorage.getItem("ms_username");
        this.isShowPosition = localStorage.getItem("isShowPosition");
        this.funcGetShopCodeList(localStorage.getItem("shopCode"));
        //this.eventSearch();
				for(var item of JSON.parse(localStorage.getItem("permissions"))){
					if(item.ModuleUrl == 'WarehouseManagement'){
						this.permissionsList = item.Rights;
					}
				}
    },
    watch: {

    },
};