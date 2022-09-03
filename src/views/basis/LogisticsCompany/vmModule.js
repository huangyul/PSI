import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from "element-plus";
import table2excel from 'js-table2excel'
export default {
    name: "LogisticsCompany",
    data() {
        return {
						permissionsList:'',
            username: '',
            addDate: '',
            searchForm: {
                name: '',
                code: '',
                status: -1,
            },
            tableData: [],
            dialogVisible: false,
            addForm: {
                Name: '',
                Code: '',
                PathUrl: '',
                Status: '',
                Remark: '',
                UpdateTime: 0,
            },
            tableDeteleData: '',
            OpenWindowTitle: '',
            page: 1,
            pageSize: 15,
            total: 0,
        }
    },
    methods: {
        funcGetTableData(name, code, status, page, pageSize) {
            var url = basis.LogisticsCompany.query + "?name=" + name + "&code=" + code + "&status=" + status + "&page=" + page + "&pageSize=" + pageSize;
            this.$axios.get(url).then(res => {
                this.tableData = res.data.Results;
                this.total = res.data.TotalCount;
								//console.log(this.tableData)
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
                this.addForm.Code = res.data;
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        //单独删除
        funcTableDetele(code, updateTime) {
            var url = basis.LogisticsCompany.delete + "?code=" + code + "&updateTime=" + updateTime;
            this.$axios.delete(url).then(res => {
                ElMessage.success({ message: '删除成功', type: 'success', });
                this.eventSearch();
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        //批量删除
        funcTableDeteleList(codes) {
            var url = basis.LogisticsCompany.deleteList + "?codes=" + codes;
            this.$axios.delete(url).then(res => {
                ElMessage.success({ message: '删除成功', type: 'success', });
                this.eventSearch();
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        },
        //批量更新状态
        funcTableUpdateStatusList(codes, status) {
            var url = basis.LogisticsCompany.updateStatus + "?codes=" + codes + "&status=" + status
            this.$axios.put(url).then(res => {
                ElMessage.success({ message: '更新成功', type: 'success', });
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
            this.funcGetTableData(this.searchForm.name, this.searchForm.code, this.searchForm.status, this.page, this.pageSize);
        },
        eventReset() {
            this.searchForm = {
                name: '',
                code: '',
                status: -1,
            }
        },
        eventDetele() {
            if (this.tableDeteleData.length == 1) {
                for (var item of this.tableDeteleData) {
                    this.funcTableDetele(item.Code, item.UpdateTime);
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
                var url = basis.LogisticsCompany.queryOne + "?code=" + row.Code;
                this.$axios.get(url).then(res => {
                    this.addForm = {
                        Name: res.data.Name,
                        Code: res.data.Code,
                        PathUrl: res.data.PathUrl,
                        Status: res.data.Status,
                        Remark: res.data.Remark,
                        UpdateTime: res.data.UpdateTime,
                        Creater: res.data.Creater,
                        Modifier: this.username,
                    };
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
                    Name: '',
                    Code: '',
                    PathUrl: '',
                    Status: 1,
                    Remark: '',
                    UpdateTime: 0,
                    Creater: this.username,
                    Modifier: this.username,
                };
                this.funcGetCurrenCode("PSI_Base_LogCompany", "");
            }
            this.dialogVisible = true;
        },
        eventSaveWindow() {
						if(!this.addForm.Name){
							ElMessage.warning({ message: '物流公司名称不能为空', type: 'warning', });
							return;						
						}
						const loading = func.backgroundLoading('Loading');
            if (this.OpenWindowTitle == '新增') {
                var params = this.addForm;
                var url = basis.LogisticsCompany.add;
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
								//console.log(params);return;
                var url = basis.LogisticsCompany.update;
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
        eventUploadImgChange(file, fileList) {
					if (file.raw.type != "image/png" && file.raw.type != "image/jpg" && file.raw.type != "image/jpeg") {
					    this.$message({ message: '只能上传png，jpg，jpeg格式的图片', type: 'warning' });
							return;
					}
					var num = file.raw.size / 1024 / 1024;
					if (num > 2) {
					    this.$message({ message: '上传图片字节大小不能超过2M', type: 'warning' });
					    return;
					}
					
            this.addForm.PathUrl = '';
            //图片转base64
            func.getBase64(file).then(res => {
                this.addForm.PathUrl = res;
            })
        },
        eventImgDetele() {
            this.addForm.PathUrl = '';
        },
        eventUpdateStatus(status) {
            var codes = [];
            for (var item of this.tableDeteleData) {
                codes.push(item.Code);
            }
            codes = codes.join(",");
            this.funcTableUpdateStatusList(codes, status);
        },


    },
    mounted() {
				func.SearchJudge();
        this.username = localStorage.getItem("ms_username");
        this.eventSearch();
				for(var item of JSON.parse(localStorage.getItem("permissions"))){
					if(item.ModuleUrl == 'LogisticsCompany'){
						this.permissionsList = item.Rights;
					}
				}
    },
    watch: {

    },
};