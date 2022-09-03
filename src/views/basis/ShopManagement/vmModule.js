import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from "element-plus";
export default {
    name: "ShopManagement",
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
						tableDeteleData:[],
            page: 1,
            pageSize: 15,
            total: 0,
			OpenWindowTitle:'',
			dialogVisible:false,
			addForm:{},
        }
    },
    methods: {
        funcGetTableData(code, name,sysOrgId, page, pageSize) {
            var url = basis.ShopManagement.query + "?code=" + code + "&name=" + name + "&sysOrgId=" + sysOrgId + "&page=" + page + "&pageSize=" + pageSize;
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
            this.funcGetTableData(this.searchForm.unitNo,this.searchForm.unitName,localStorage.getItem("OrganizationId"), this.page, this.pageSize);
        },
        eventReset() {
            this.searchForm = {
                unitName: '',
                unitNo: '',
            }
        },
		//打开编辑弹窗
		eventOpenWindow(row){
			this.OpenWindowTitle = '编辑';
			this.dialogVisible = true;
			var url = basis.ShopManagement.queryOne + "?code=" + row.Code;
			this.$axios.get(url).then(res => {
			    this.addForm = res.data;
				//console.log(this.addForm);
			}).catch(err => {
			    this.$message({
			        message: err,
			        type: 'warning'
			    });
			});
		},
		//点击保存按钮
		eventSaveWindow(){
			if(!this.addForm.Mast_Name){
				ElMessage.warning({ message: 'U8仓库名称不能为空', type: 'warning', });
				return;
			}
			this.addForm.Modifier = localStorage.getItem("ms_username");
			const loading = func.backgroundLoading('Loading');
			var url = basis.ShopManagement.update;
			this.$axios.put(url,this.addForm).then(res => {
				loading.close();
			    ElMessage.success({ message: '更新成功', type: 'success', });
			    this.eventSearch();
				this.dialogVisible = false;
			}).catch(err => {
				loading.close();
			    ElMessage.warning({ message: err, type: 'warning', });
			});
		},
        
    },
    mounted() {
				func.SearchJudge();
        this.username = localStorage.getItem("ms_username");
        this.eventSearch();
				for(var item of JSON.parse(localStorage.getItem("permissions"))){
					if(item.ModuleUrl == 'ShopManagement'){
						this.permissionsList = item.Rights;
					}
				}
    },
    watch: {

    },
};