import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from "element-plus";
export default {
    name: "CommodityUnit",
    data() {
        return {
						permissionsList:'',
            username: '',
            addDate: '',
            searchForm: {
                unitName: '',
                unitNo: '',
            },
            tableData: [],
            dialogVisible: false,
            addForm: {
                Id: '',
                Unit_Name: '',
                Unit_No: '',
                Memo: '',
                UpdateTime: '',
            },
            tableDeteleData: '',
            OpenWindowTitle: '',
            page: 1,
            pageSize: 15,
            total: 0,
        }
    },
    methods: {
        funcGetTableData(unitName, unitNo, shopCode,sysOrgId, page, pageSize) {
            var url = basis.CommodityUnit.query + "?unitName=" + unitName + "&unitNo=" + unitNo + "&shopCode=" + shopCode+ "&sysOrgId=" + sysOrgId + "&page=" + page + "&pageSize=" + pageSize;
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
            var url = basis.GeneratedNumber + "?tableName=" + tableName + "&matType=" + matType;
            this.$axios.get(url).then(res => {
                this.addForm.Unit_No = res.data;
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });

            //this.addForm.Unit_No = func.randomString(2);
        },
        //单独删除
        funcTableDetele(id, updateTime, shopCode, userType) {
            var url = basis.CommodityUnit.delete + "?id=" + id + "&updateTime=" + updateTime + "&shopCode=" + shopCode + "&userType=" + userType;
            this.$axios.delete(url).then(res => {
                ElMessage.success({ message: '删除成功', type: 'success', });
                this.eventSearch();
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        //批量删除
        funcTableDeteleList(ids, shopCode, userType) {
            var url = basis.CommodityUnit.deleteList + "?ids=" + ids + "&shopCode=" + shopCode + "&userType=" + userType;
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
            this.funcGetTableData(this.searchForm.unitName, this.searchForm.unitNo, localStorage.getItem("shopCode"),localStorage.getItem("OrganizationId"), this.page, this.pageSize);
        },
        eventReset() {
            this.searchForm = {
                unitName: '',
                unitNo: '',
            }
        },
        eventDetele() {
            if (this.tableDeteleData.length == 1) {
                for (var item of this.tableDeteleData) {
                    this.funcTableDetele(item.Id, item.UpdateTime, localStorage.getItem("shopCode"), localStorage.getItem("userType"));
                }
            } else if (this.tableDeteleData.length == 0) {
                ElMessage.warning({ message: '还未选择', type: 'warning', });
            } else if (this.tableDeteleData.length > 1) {
                var ids = [];
                for (var item of this.tableDeteleData) {
                    ids.push(item.Id);
                }
                ids = ids.join(",");
                this.funcTableDeteleList(ids, localStorage.getItem("shopCode"), localStorage.getItem("userType"));
            }
        },
        eventTableSelect(val) {
            this.tableDeteleData = val;
        },
        eventOpenWindow(row) {
            this.funcGetDate();
            if (row) {
                this.OpenWindowTitle = '编辑';
                var url = basis.CommodityUnit.queryOne + "?id=" + row.Id;
                this.$axios.get(url).then(res => {
                    this.addForm = {
                        Id: res.data.Id,
                        Unit_Name: res.data.Unit_Name,
                        Unit_No: res.data.Unit_No,
                        Memo: res.data.Memo,
                        UpdateTime: res.data.UpdateTime,
                        Creater: res.data.Creater,
                        Modifier: this.username,
												OrganizationId:res.data.OrganizationId,
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
                this.addForm = {
                    Id: '',
                    Unit_Name: '',
                    Unit_No: '',
                    Memo: '',
                    UpdateTime: 0,
                    Creater: this.username,
                    Modifier: this.username,
                };
                this.funcGetCurrenCode("mast_Unit", "");
            }
            this.dialogVisible = true;
        },
        eventSaveWindow() {
						if(!this.addForm.Unit_Name){
							ElMessage.warning({ message: '单位名称，编码不能为空', type: 'warning', });
							return;
						}
						const loading = func.backgroundLoading('Loading');
            if (this.OpenWindowTitle == '新增') {
                var str = func.guid();
                var params = {
                    Id: str,
                    Unit_No: this.addForm.Unit_No,
                    Unit_Name: this.addForm.Unit_Name,
                    Memo: this.addForm.Memo,
                    ShopCode: '',
                    Creater: this.username,
                    Modifier: this.username,
										OrganizationId:localStorage.getItem("OrganizationId"),
                }
                var url = basis.CommodityUnit.add + "?sysOrgId=" + localStorage.getItem("OrganizationId");
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
                var params = {
                    Id: this.addForm.Id,
                    Unit_No: this.addForm.Unit_No,
                    Unit_Name: this.addForm.Unit_Name,
                    Memo: this.addForm.Memo,
                    ShopCode: '',
                    Creater: this.addForm.Creater,
                    Modifier: this.addForm.Modifier,
                    UpdateTime: this.addForm.UpdateTime,
										OrganizationId:this.addForm.OrganizationId,
                }
                var url = basis.CommodityUnit.update + "?shopCode=" + localStorage.getItem("shopCode") + "&sysOrgId=" + localStorage.getItem("OrganizationId");
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
					var ids = [];
					for (var item of this.tableDeteleData) {
					    ids.push(item.Id);
					}
					//ids = ids.join(",");
					var url_1 = basis.CommodityUnit.Export + "?unitNo=" + this.searchForm.unitNo +
					"&unitName=" + this.searchForm.unitName + "&shopCode=" + localStorage.getItem("shopCode") +
					"&sysOrgId=" + localStorage.getItem("OrganizationId");
					this.$axios.post(url_1,ids).then(res => {
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
        this.eventSearch();
				for(var item of JSON.parse(localStorage.getItem("permissions"))){
					if(item.ModuleUrl == 'CommodityUnit'){
						this.permissionsList = item.Rights;
					}
				}
    },
    watch: {

    },
};