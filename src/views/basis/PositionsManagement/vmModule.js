import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from "element-plus";
export default {
    name: "PositionsManagement",
    data() {
        return {
						permissionsList:'',
            username: '',
            addDate: '',
            searchForm: {
                Name: '',
                Code: '',
                whCode: '',
                shopInfo: '',
            },
            tableData: [],
            dialogVisible: false,
            addForm: {
                Name: '',
                Code: '',
                WarehouseCode: '',
                WarehouseName: '',
                ShopCode: '',
            },
            tableDeteleData: '',
            OpenWindowTitle: '',
            WarehouseList: [],
            WarehouseList_2: [],
            page: 1,
            pageSize: 15,
            total: 0,
            shopList: [],
						isUpdate:false,
						isUpdate_1:false,
        }
    },
    methods: {
        funcGetTableData(name, code, whCode, shopInfo, page, pageSize) {
            var url = basis.PositionsManagement.query + "?name=" + name + "&code=" + code + "&whCode=" + whCode + "&shopInfo=" + shopInfo + "&page=" + page + "&pageSize=" + pageSize;
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
            var url = basis.PositionsManagement.delete + "?code=" + code + "&updateTime=" + updateTime + "&shopCode=" + shopCode + "&userType=" + userType;
            this.$axios.delete(url).then(res => {
                ElMessage.success({ message: '删除成功', type: 'success', });
                this.eventSearch();
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        //批量删除
        funcTableDeteleList(codes) {
            var url = basis.PositionsManagement.deleteList + "?codes=" + codes;
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
        funcGetWhOrPositionInfo(shopCode, whCode, type) {
            var url = basis.WhOrPositionInfo + "?shopCode=" + shopCode + "&whCode=" + whCode;
            this.$axios.get(url).then(res => {
                if (type == 1) {
                    this.WarehouseList = res.data;
                } else if (type == 2) {
                    this.WarehouseList_2 = res.data;
                }
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        //获取门店信息列表
        funcGetShopCodeList(shopCode) {
            var url = basis.GetShopCodeList + "?shopCode=" + shopCode;
            this.$axios.get(url).then(res => {
                this.shopList = res.data;
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
                this.funcGetTableData(this.searchForm.Name, this.searchForm.Code, this.searchForm.whCode, this.searchForm.shopInfo, this.page, this.pageSize);
            } else {
                this.funcGetTableData(this.searchForm.Name, this.searchForm.Code, this.searchForm.whCode, localStorage.getItem("shopCode"), this.page, this.pageSize);
            }
        },
        eventReset() {
            this.searchForm = {
                Name: '',
                Code: '',
                whCode: '',
                shopInfo: '',
            }
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
                this.funcTableDeteleList(codes, localStorage.getItem("shopCode"), localStorage.getItem("userType"));
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
								this.isUpdate_1 = true;
                var url = basis.PositionsManagement.queryOne + "?Code=" + row.Code;
                this.$axios.get(url).then(res => {
										this.funcGetWhOrPositionInfo(res.data.ShopCode, '', 2);
                    this.addForm = {
                        Code: res.data.Code,
                        Name: res.data.Name,
                        ShopCode: res.data.ShopCode,
                        ShopName: res.data.ShopName,
                        UpdateTime: res.data.UpdateTime,
                        WarehouseCode: res.data.WarehouseCode,
                        WarehouseName: res.data.WarehouseName,
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
								this.isUpdate_1 = false;
                this.addForm = {
                    Code: "",
                    Name: "",
                    ShopCode: '',
                    ShopName: '',
                    UpdateTime: 0,
                    WarehouseCode: "",
                    WarehouseName: "",
                    Creater: this.username,
                    Modifier: this.username,
                };
                this.funcGetCurrenCode("PSI_Base_Position", "");
            }
            this.dialogVisible = true;
        },
        eventSaveWindow() {
						if(!this.addForm.Name || !this.addForm.WarehouseCode || !this.addForm.ShopCode || !this.addForm.Code){
							ElMessage.warning({ message: '仓位名称，编号，关联仓库，所属门店不能为空', type: 'warning', });
							return;
						}
            for (var item of this.WarehouseList_2) {
                if (this.addForm.WarehouseCode == item.Code) {
                    this.addForm.WarehouseName = item.Name;
                }
            }
            for (var item of this.shopList) {
                if (item.Code == this.addForm.ShopCode) {
                    this.addForm.ShopName = item.Name;
                }
            }
						const loading = func.backgroundLoading('Loading');
            if (this.OpenWindowTitle == '新增') {
                var params = this.addForm;
                var url = basis.PositionsManagement.add;
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
                var url = basis.PositionsManagement.update + "?shopCode=" + localStorage.getItem("shopCode") + "&userType=" + localStorage.getItem("userType");
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
    },
    mounted() {
        func.SearchJudge();
        this.username = localStorage.getItem("ms_username");
        //this.funcGetWhOrPositionInfo(localStorage.getItem("shopCode"),'');
        if (localStorage.getItem("WarehouseCode")) {
            this.funcGetWhOrPositionInfo(localStorage.getItem("shopCode"), '', 1);
            this.searchForm.whCode = localStorage.getItem("WarehouseCode");
            this.eventSearch();
            localStorage.removeItem('WarehouseCode');
        } else {
            this.searchForm.WarehouseCode = '';
            this.eventSearch();
        }
        this.funcGetShopCodeList(localStorage.getItem("shopCode"));
				for(var item of JSON.parse(localStorage.getItem("permissions"))){
					if(item.ModuleUrl == 'PositionsManagement'){
						this.permissionsList = item.Rights;
					}
				}
    },
    watch: {
        'searchForm.shopInfo'(newVal, oldVal) {
            this.searchForm.whCode = '';
            this.WarehouseList = [];
            if (newVal) {
                this.funcGetWhOrPositionInfo(newVal, '', 1);
            }
        },
				'addForm.ShopCode'(newVal, oldVal){
					if(this.isUpdate){
						this.isUpdate = false;
					}else{
						this.addForm.WarehouseCode = '';
						this.WarehouseList_2 = [];
						if(newVal){
							this.funcGetWhOrPositionInfo(newVal, '', 2);
						}
					}
				},
    },
};