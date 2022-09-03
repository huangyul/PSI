import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from "element-plus";
export default {
    name: "CategorySetWhPosition",
    data() {
        return {
						permissionsList:'',
						isShowPosition:'',
            username: '',
            addDate: '',
            searchForm: {
                shopInfo:'',
								warehouseCode:'',
								positionCode:'',
								CategoryId:'',
            },
            tableData: [],
            dialogVisible: false,
            addForm: {
              MatTypeId: '',
							ShopCode: '',
							WhCode: '',
							PositionCode: '',
							Creater: '',
            },
            tableDeteleData: '',
            OpenWindowTitle: '',
            page: 1,
            pageSize: 15,
            total: 0,
						shopList:[],
						warehouseList:[],
						AddWarehouseList:[],
						positionList:[],
						AddPositionList:[],
						CategoryTree:[],
						machineTreeLastId:[],
						isUpdate_1:false,
						isUpdate_2:false,
						props:{label: 'Name',value: 'Id',children: 'children',checkStrictly: true,multiple:false,expandTrigger: 'hover'},
        }
    },
    methods: {
        funcGetTableData(shopInfo, whCode,positionCode, matTypeId,shopCode, page, pageSize) {
            var url = basis.CategoryAndDefault.query + "?shopInfo=" + shopInfo + "&whCode=" + whCode + "&positionCode=" + positionCode+ 
						"&matTypeId=" + matTypeId + "&shopCode=" + shopCode + "&page=" + page + "&pageSize=" + pageSize;
            this.$axios.get(url).then(res => {
                this.tableData = res.data.Results;
                this.total = res.data.TotalCount;
								//console.log(res);
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
				//获取仓库列表和仓位列表
				funcGetWarehouseAndPosition(shopCode, whCode, type,type_1) {
				    var url = basis.WhOrPositionInfo + "?shopCode=" + shopCode + "&whCode=" + whCode;
				    this.$axios.get(url).then(res => {
				        if (type == 1 && type_1 == 1) {
				            this.warehouseList = res.data;
				        } else if (type == 2  && type_1 == 1) {
				            this.positionList = res.data;
				        }else if(type == 1 && type_1 == 2){
									this.AddWarehouseList = res.data;
								}else if(type == 2  && type_1 == 2){
									this.AddPositionList = res.data;
								}
				    }).catch(err => {
				        this.$message({
				            message: err,
				            type: 'warning'
				        });
				    });
				},
				//获取门店信息列表
				funcGetShopCodeList(shopCode) {
				    var url = basis.GetShopCodeList + "?shopCode=" + shopCode;
				    this.$axios.get(url).then(res => {
				        this.shopList = res.data;
				        if(this.shopList.length == 1){
				            this.searchForm.shopInfo = this.shopList[0].Code;
				        }
				        this.eventSearch();
				    }).catch(err => {
				        this.$message({ message: err, type: 'warning' });
				    });
				},
				//获取品类信息表
				funcGetCategoryTableData(name, matType, shopCode, userType, page, pageSize) {
				    var url = basis.CategoryManagement.query + "?name=" + name + "&matType=" + matType + "&shopCode=" + shopCode +
				        "&userType=" + userType + "&page=" + page + "&pageSize=" + pageSize;
				    this.$axios.get(url).then(res => {
				        this.CategoryTree = func.recursiveCategoryTree(res.data.Results);
								this.machineTreeLastId = [];
								this.funcRecursiveCategoryTree(this.CategoryTree);
				    }).catch(err => {
				        this.$message({
				            message: err,
				            type: 'warning'
				        });
				    });
				},
				//递归品类List
				funcRecursiveCategoryTree(data) {
					// 循环遍历json数据
					for (var i = 0; i < data.length; i++) {
						if (!data[i].children) {
							this.machineTreeLastId.push(data[i].Id);
						} else {
							// children若不为空数组，则继续 递归调用 本方法
							this.funcRecursiveCategoryTree(data[i].children);
						}
					}
				},
        funcGetDate() {
            var myDate = new Date();
            this.addDate = func.formatTimeToStr(myDate);
        },
        funcGetCurrenCode(tableName, matType) {
            var url = basis.GeneratedNumber + "?tableName=" + tableName + "&matType=" + matType;
            this.$axios.get(url).then(res => {
                //this.addForm.Unit_No = res.data;
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });

            //this.addForm.Unit_No = func.randomString(2);
        },
        //单独删除
        // funcTableDetele(id, updateTime, shopCode, userType) {
        //     var url = basis.CommodityUnit.delete + "?id=" + id + "&updateTime=" + updateTime + "&shopCode=" + shopCode + "&userType=" + userType;
        //     this.$axios.delete(url).then(res => {
        //         ElMessage.success({ message: '删除成功', type: 'success', });
        //         this.eventSearch();
        //     }).catch(err => {
        //         this.$message({ message: err, type: 'warning' });
        //     });
        // },
        //批量删除
        funcTableDeteleList(codes) {
            var url = basis.CategoryAndDefault.deleteList + "?codes=" + codes;
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
        eventPageSizeChange(val) {
            this.pageSize = val;
            this.eventSearch();
        },
        eventPageChange(val) {
            this.page = val;
            this.eventSearch();
        },
        eventSearch() {
						// if(this.searchForm.CategoryId.length && this.searchForm.CategoryId.length > 0){
						// 	console.log(666);
						// }else{
						// 	console.log(777);
						// }
						// return;
						// console.log(this.searchForm.CategoryId);
						// return;
						if(!this.searchForm.CategoryId){
							this.searchForm.CategoryId = '';
						}
						if (typeof this.searchForm.CategoryId != 'string') {
						    var length = this.searchForm.CategoryId.length - 1;
						    this.searchForm.CategoryId = this.searchForm.CategoryId[length];
						}
            this.funcGetTableData(this.searchForm.shopInfo, this.searchForm.warehouseCode,this.searchForm.positionCode,this.searchForm.CategoryId,
						localStorage.getItem("shopCode"), this.page, this.pageSize);
        },
        eventReset() {
            this.searchForm = {
              shopInfo:'',
              warehouseCode:'',
              positionCode:'',
              CategoryId:'',
            }
        },
        eventDetele() {
            if(this.tableDeteleData.length == 0) {
                ElMessage.warning({ message: '还未选择', type: 'warning', });
            } else if (this.tableDeteleData.length > 0) {
                var codes = [];
                for (var item of this.tableDeteleData) {
                    codes.push(item.Id);
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
                var url = basis.CategoryAndDefault.queryOne + "?id=" + row.Id;
                this.$axios.get(url).then(res => {
										//console.log(res);
                    this.addForm = res.data;
										this.addDate = res.data.ModifyTime;
										this.funcGetWarehouseAndPosition(res.data.ShopCode, '', 1,2);
										this.funcGetWarehouseAndPosition(res.data.ShopCode, res.data.WhCode, 2,2);
										this.isUpdate_1 = true;
										this.isUpdate_2 = true;
                }).catch(err => {
                    this.$message({
                        message: err,
                        type: 'warning'
                    });
                    this.eventSearch();
                });
            } else {
                this.OpenWindowTitle = '新增';
								this.isUpdate_1 = false;
								this.isUpdate_2 = false;
                this.addForm = {
                  MatTypeId: '',
                  ShopCode: '',
                  WhCode: '',
                  PositionCode: '',
                  Creater: '',
                };
                
            }
            this.dialogVisible = true;
        },
        eventSaveWindow() {
						if(this.isShowPosition == '1'){
							if(!this.addForm.ShopCode || !this.addForm.WhCode || !this.addForm.PositionCode || !this.addForm.MatTypeId){
								ElMessage.warning({ message: '门店名称，品类，默认仓库，默认仓位不能为空', type: 'warning', });
								return;
							}
						}else if(this.isShowPosition == '0'){
							if(!this.addForm.ShopCode || !this.addForm.WhCode || !this.addForm.MatTypeId){
								ElMessage.warning({ message: '门店名称，品类，默认仓库，不能为空', type: 'warning', });
								return;
							}
						}
						var params = JSON.parse(JSON.stringify(this.addForm));
						if (typeof params.MatTypeId != 'string') {
						    var length = params.MatTypeId.length - 1;
						    params.MatTypeId = params.MatTypeId[length];
						}
						var isLast = false;
						for(var item of this.machineTreeLastId){
							if(params.MatTypeId == item){
								isLast = true;
							}
						}
						if(!isLast){ElMessage.warning({message: '品类不是最底层品类',type: 'warning',});return;}
						const loading = func.backgroundLoading('Loading');
            if (this.OpenWindowTitle == '新增') {
                //var str = func.guid();
								params.Creater = localStorage.getItem("ms_username");
								//console.log(params);return;
                var url = basis.CategoryAndDefault.add;
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
                //console.log(params);return;
                var url = basis.CategoryAndDefault.update;
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
				//导出
				eventExport(){
					return;
					var ids = [];
					for (var item of this.tableDeteleData) {
					    ids.push(item.Id);
					}
					ids = ids.join(",");
					var url_1 = basis.CommodityUnit.Export + "?ids=" + ids  + "&unitNo=" + this.searchForm.unitNo +
					"&unitName=" + this.searchForm.unitName + "&shopCode=" + localStorage.getItem("shopCode") +
					"&sysOrgId=" + localStorage.getItem("OrganizationId");
					this.$axios.get(url_1).then(res => {
						if(!res.data.Success){
							this.$message({message: res.data.Msg,type: 'warning'});
							return;
						}
						//文件流
						var url_2 = basis.ExportDownload +"?filePath=" + res.data.data + "&delete=1";
						window.location.href = url_2;
					}).catch(err => {
					    this.$message({message: err,type: 'warning'});
					});
				},
    },
    mounted() {
				func.SearchJudge();
        this.username = localStorage.getItem("ms_username");
				this.isShowPosition = localStorage.getItem("isShowPosition");
        this.eventSearch();
				this.funcGetShopCodeList(localStorage.getItem("shopCode"));
				this.funcGetCategoryTableData('', '', localStorage.getItem("shopCode"), localStorage.getItem("userType"), 1, 100000);
				for(var item of JSON.parse(localStorage.getItem("permissions"))){
					if(item.ModuleUrl == 'CategorySetWhPosition'){
						this.permissionsList = item.Rights;
					}
				}
    },
    watch: {
			'searchForm.shopInfo'(newVal, oldVal) {
			    this.searchForm.warehouseCode = '';
			    this.warehouseList = [];
			    if (newVal) {
			        this.funcGetWarehouseAndPosition(newVal, '', 1,1);
			    }
			},
			'searchForm.warehouseCode'(newVal, oldVal) {
			    this.searchForm.positionCode = '';
			    this.positionList = [];
			    if (newVal) {
			        this.funcGetWarehouseAndPosition(this.searchForm.shopInfo, newVal, 2,1);
			    }
			},
			'addForm.ShopCode'(newVal, oldVal) {
					if(this.isUpdate_1){
						this.isUpdate_1 = false;
					}else{
						this.addForm.WhCode = '';
						this.AddWarehouseList = [];
						if (newVal) {
						    this.funcGetWarehouseAndPosition(newVal, '', 1,2);
						}
					}
			},
			'addForm.WhCode'(newVal, oldVal) {
					if(this.isUpdate_2){
						this.isUpdate_2 = false;
					}else{
						this.addForm.PositionCode = '';
						this.AddPositionList = [];
						if (newVal) {
						    this.funcGetWarehouseAndPosition(this.addForm.ShopCode, newVal, 2,2);
						}
					}
			},
    },
};