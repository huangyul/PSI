import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import {
    ElMessage,
    ElMessageBox
} from "element-plus";
export default {
    name: "MachineAndLandscape",
    data() {
        return {
						permissionsList:{
							Delete:true,
						},
            username: '',
            addDate: '',
            searchForm: {

            },
            tableData: [],
            dialogVisible: false,
            addForm: {

            },
            tableDeteleData: '',
            OpenWindowTitle: '',
            page: 1,
            pageSize: 100000,
            total: 0,

            leftInput: '',
            leftInputValue: '',
            rightInput: '',
            machineTree: [],
						machineTreeLink:[],
            additionMachineTree: [],
            ProdCodeOrMatIdList: [],
						machineTreeLastId:[],
						additionMachineTreeLastId:[],
						loading:false,
        }
    },
    methods: {
        //过滤左边的树
        funcFilterNodeLeft(value, data) {
            if (!value) return true
            return data.Name.indexOf(value) !== -1
        },
        //过滤右边的树
        funcFilterNodeRight(value, data) {
            if (!value) return true;
            return data.Name.indexOf(value) !== -1
        },
        funcGetTableData(prodCodeOrMatId, devIdOrMatId, page, pageSize) {
					this.loading = true;
            var url = basis.MachineAndLandscape.query + "?prodCodeOrMatId=" + prodCodeOrMatId + "&devIdOrMatId=" + devIdOrMatId + "&page=" + page + "&pageSize=" + pageSize;
            this.$axios.get(url).then(res => {
                this.tableData = res.data.Results;
                this.total = res.data.TotalCount;
								this.loading = false;
                //console.log(res.data.Results)
            }).catch(err => {
                this.$message({
                    message: err,
                    type: 'warning'
                });
            });
        },
        //获取品类信息表
        funcGetCategoryTableData(name, matType, shopCode, userType, page, pageSize) {
            var url = basis.CategoryManagement.query + "?name=" + name + "&matType=" + matType + "&shopCode=" + shopCode +
                "&userType=" + userType + "&page=" + page + "&pageSize=" + pageSize;
            this.$axios.get(url).then(res => {
                this.machineTree = [];
                this.additionMachineTree = [];
                for (var item of func.recursiveCategoryTree(res.data.Results)) {
                    if (item.Mat_Type == "M") {
                        this.machineTree.push(item);
                    } else if (item.Mat_Type == "K") {
                        this.additionMachineTree.push(item)
                    }
                }

            }).catch(err => {
                this.$message({
                    message: err,
                    type: 'warning'
                });
            });
        },
				//获取已经关联品类信息表
				funcGetCategoryTableDataLink(name, matType, shopCode, userType,isLink, page, pageSize) {
				    var url = basis.CategoryManagement.query + "?name=" + name + "&matType=" + matType + "&shopCode=" + shopCode +
				        "&userType=" + userType +  "&isLink=" + isLink + "&page=" + page + "&pageSize=" + pageSize;
				    this.$axios.get(url).then(res => {
				        //console.log(res.data.Results);
								this.machineTreeLink = res.data.Results;
				    }).catch(err => {
				        this.$message({
				            message: err,
				            type: 'warning'
				        });
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
                this.$message({
                    message: err,
                    type: 'warning'
                });
            });
        },
        //单独删除
        funcTableDetele(id, updateTime, shopCode, userType) {
            var url = basis.MachineAndLandscape.delete + "?id=" + id + "&updateTime=" + updateTime + "&shopCode=" + shopCode +
                "&userType=" + userType;
            this.$axios.delete(url).then(res => {
                ElMessage.success({
                    message: '删除成功',
                    type: 'success',
                });
                this.funcGetTableData('', '', this.page, this.pageSize);
								this.funcGetCategoryTableDataLink('', '', localStorage.getItem("shopCode"), localStorage.getItem("userType"),1, 1, 100000);
            }).catch(err => {
                this.$message({
                    message: err,
                    type: 'warning'
                });
                this.funcGetTableData('', '', this.page, this.pageSize);
            });
        },
        //批量删除
        funcTableDeteleList(ids, shopCode, userType) {
            var url = basis.CommodityUnit.deleteList + "?ids=" + ids + "&shopCode=" + shopCode + "&userType=" + userType;
            this.$axios.delete(url).then(res => {
                ElMessage.success({
                    message: '删除成功',
                    type: 'success',
                });
                this.funcGetTableData('', '', this.page, this.pageSize);
								this.funcGetCategoryTableDataLink('', '', localStorage.getItem("shopCode"), localStorage.getItem("userType"),1, 1, 100000);
            }).catch(err => {
                this.$message({
                    message: err,
                    type: 'warning'
                });
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
				//递归品类List
				funcRecursiveCategoryTree_1(data) {
					// 循环遍历json数据
					for (var i = 0; i < data.length; i++) {
						if (!data[i].children) {
							this.additionMachineTreeLastId.push(data[i].Id);
						} else {
							// children若不为空数组，则继续 递归调用 本方法
							this.funcRecursiveCategoryTree_1(data[i].children);
						}
					}
				},
        // eventPageSizeChange(val) {
        //     this.pageSize = val;
        //     this.funcGetTableData('', '', this.page, this.pageSize);
        // },
        // eventPageChange(val) {
        //     this.page = val;
        //     this.funcGetTableData('', '', this.page, this.pageSize);
        // },
        // eventSearch() {
        //     this.funcGetTableData('', '', this.page, this.pageSize);
        // },
        // eventReset() {

        // },
        eventDetele(data) {
            this.funcTableDetele(data.Id, data.UpdateTime, localStorage.getItem("shopCode"), localStorage.getItem("userType"));
        },
        eventTableSelect(val) {
            this.tableDeteleData = val;
        },
        eventOpenWindow(row) {
            this.funcGetCategoryTableData('', '', localStorage.getItem("shopCode"), localStorage.getItem("userType"), 1, 100000);
            this.funcGetDate();
            if (row) {

            } else {
                this.OpenWindowTitle = '新增';
                this.addForm = {
                    Id: 0,
                    ProdCodeOrMatId: '',
                    DevIdOrMatId: '',
                    LinkType: 1,
                    UpdateTime: 0,
                    Creater: this.username,
                    Modifier: this.username,
                };
								this.ProdCodeOrMatIdList = [
									{
									    value: ''
									}
								];
                //this.funcGetCurrenCode("mast_Unit", "");
            }
            this.dialogVisible = true;
        },
        eventSaveWindow() {
						this.machineTreeLastId = [];
						this.additionMachineTreeLastId = [];
						this.funcRecursiveCategoryTree(this.machineTree);
						this.funcRecursiveCategoryTree_1(this.additionMachineTree);
						var isLast = false;
						var isLast_1 = false;
            if (this.OpenWindowTitle == '新增') {
							if(!this.addForm.DevIdOrMatId || this.ProdCodeOrMatIdList.length == 0){
								ElMessage.warning({message: '机器种类，关联景品不能为空',type: 'warning',});
								return;
							}
							var length = this.addForm.DevIdOrMatId.length -1;
							var value = this.addForm.DevIdOrMatId[length];
							for(var item of this.machineTreeLastId){
								if(value == item){
									isLast = true;
								}
							}
							if(!isLast){
								ElMessage.warning({message: '机器种类没有选择到最底层种类',type: 'warning',});
								return;
							}
							
							for(var item of this.ProdCodeOrMatIdList){
								if(!item.value){
									ElMessage.warning({message: '关联的景品中不能为空',type: 'warning',});
									return;
								}
							}
                var paramsList = [];
                var params = JSON.parse(JSON.stringify(this.addForm));
                params.DevIdOrMatId = value;
                var arr = [];
                for (var item of this.ProdCodeOrMatIdList) {
                    var sum = item.value.length - 1;
                    if (sum >= 0) {
                        arr.push(item.value[sum]);
                    }
                }
								if ((new Set(arr)).size != arr.length) {
									ElMessage.warning({message: '关联的景品中不能有重复',type: 'warning',});
									return;
								}
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i]) {
                        var obj = JSON.parse(JSON.stringify(params));
                        obj.ProdCodeOrMatId = arr[i];
												obj.isLast = false;
                        paramsList.push(obj);
                    }
                }
								for(var item of paramsList){
									for(var item_1 of this.additionMachineTreeLastId){
										if(item.ProdCodeOrMatId == item_1){
											item.isLast = true;
										}
									}
								}
								for(var item of paramsList){
									if(!item.isLast){
										ElMessage.warning({message: '关联的景品中没有选择到最底层种类',type: 'warning',});
										return;
									}
								}
								//console.log(paramsList);return;
								const loading = func.backgroundLoading('Loading');
                var url = basis.MachineAndLandscape.add;
                this.$axios.post(url, paramsList).then(res => {
										loading.close();
                    ElMessage.success({
                        message: '新增成功',
                        type: 'success',
                    });
                    this.funcGetTableData('', '', this.page, this.pageSize);
										this.dialogVisible = false;
										this.funcGetCategoryTableDataLink('', '', localStorage.getItem("shopCode"), localStorage.getItem("userType"),1, 1, 100000);
                }).catch(err => {
										loading.close();
                    ElMessage.warning({
                        message: err,
                        type: 'warning',
                    });
                    this.funcGetTableData('', '', this.page, this.pageSize);
                });
            }
            //this.dialogVisible = false;
        },
        eventAddAssociated() {
						if(this.ProdCodeOrMatIdList.length == 10){
							ElMessage.warning({message: '最多只能关联10条景品',type: 'warning',});
							return;
						}
            var obj = {
                value: ''
            }
            this.ProdCodeOrMatIdList.push(obj);
        },
        eventDeteleAssociated(row) {
						if(this.ProdCodeOrMatIdList.length == 1){
							ElMessage.warning({message: '至少要保留一个选项',type: 'warning',});
							return;
						}
            for (var i in this.ProdCodeOrMatIdList) {
                if (this.ProdCodeOrMatIdList[i] == row) {
                    this.ProdCodeOrMatIdList.splice(i, 1);
                }
            }
        },
        //点击左边数节点
        eventNodeClick(data) {
            this.leftInputValue = data.Id;
            this.funcGetTableData(this.rightInput, data.Id, this.page, this.pageSize);
        },
				//点击左边全部按钮
				eventNodeClickAll(){
					this.leftInput = '';
					this.rightInput = '';
					this.funcGetTableData('', '', this.page, this.pageSize);
				},
    },
    mounted() {
        this.username = localStorage.getItem("ms_username");
        this.funcGetTableData('', '', this.page, this.pageSize);
        //this.funcGetCategoryTableData('', '', localStorage.getItem("shopCode"), localStorage.getItem("userType"), 1, 100000);
				this.funcGetCategoryTableDataLink('', '', localStorage.getItem("shopCode"), localStorage.getItem("userType"),1, 1, 100000);
				for(var item of JSON.parse(localStorage.getItem("permissions"))){
					if(item.ModuleUrl == 'MachineAndLandscape'){
						this.permissionsList = item.Rights;
					}
				}
    },
    watch: {
        leftInput(val) {
            this.$refs.treeLeft.filter(val)
        },
        rightInput(val) {
            //this.$refs.treeRight.filter(val)
            this.funcGetTableData(val, this.leftInputValue, this.page, this.pageSize);
        },
    },
};