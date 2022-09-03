import basis from '../../../api/basisApi.js';
import warning from '../../../api/warningApi.js';
import func from '../../func.js'
export default {
    name:'StayWarning',
    data() {
        return {
            permissionsList:'',
            searchForm: {
                companyCode: '',
								matTypeId:'',
            },
            page: 1,
            pageSize: 15,
            total: 0,
            tableData: [],
            CompanyList: '',
						CategoryTree:[],
        }
    },
    methods: {
        //获取门店列表
        funcGetCompany() {
            var url = basis.GetShopCodeList + '?shopCode=' + localStorage.getItem("shopCode");
            this.$axios.get(url).then((res) => {
                this.CompanyList = res.data;
                if(this.CompanyList.length == 1){
                    this.searchForm.companyCode = this.CompanyList[0].Code;
                }
                this.funcGetWarningData();
            }).catch((err) => {
                this.$message({ message: err, type: "warning" });
            });
        },
        funcGetWarningData(){
						if(!this.searchForm.matTypeId){
							this.searchForm.matTypeId = '';
						}
						if (typeof this.searchForm.matTypeId != 'string') {
						    var length = this.searchForm.matTypeId.length - 1;
						    this.searchForm.matTypeId = this.searchForm.matTypeId[length];
						}
            var url = warning.DetialRequest.Stay + '?shopCode=' + localStorage.getItem("shopCode") + '&searchShop=' + this.searchForm.companyCode + 
            '&matTypeId=' + this.searchForm.matTypeId + '&page=' +this.page+ '&pageSize=' + this.pageSize;
            this.$axios.get(url).then((res) => {
                this.tableData = res.data.data.Results;
                this.total = res.data.data.TotalCount;
            }).catch((err) => {
                this.$message({ message: err, type: "warning" });
            });
        },
				//获取品类信息表
				funcGetCategoryTableData(name, matType, shopCode, userType, page, pageSize) {
				    var url = basis.CategoryManagement.query + "?name=" + name + "&matType=" + matType + "&shopCode=" + shopCode +
				        "&userType=" + userType + "&page=" + page + "&pageSize=" + pageSize;
				    this.$axios.get(url).then(res => {
				        this.CategoryTree = func.recursiveCategoryTree(res.data.Results);
				    }).catch(err => {
				        this.$message({
				            message: err,
				            type: 'warning'
				        });
				    });
				},
        eventSearch() {
            this.funcGetWarningData();
        },
				eventReset(){
					this.searchForm.companyCode = '';
					this.searchForm.matTypeId = '';
				},
        eventPageSizeChange(val) {
            this.page = 1;
            this.pageSize = val;
            this.funcGetWarningData();
        },
        eventPageChange(val) {
            this.page = val;
            this.funcGetWarningData();
        },
        //导出
        eventExport(){
						if(!this.searchForm.matTypeId){
							this.searchForm.matTypeId = '';
						}
						if (typeof this.searchForm.matTypeId != 'string') {
						    var length = this.searchForm.matTypeId.length - 1;
						    this.searchForm.matTypeId = this.searchForm.matTypeId[length];
						}
            var url_1 = warning.DetialRequest.StayExport + "?searchShop=" + this.searchForm.companyCode + "&shopCode=" + localStorage.getItem("shopCode")
						+ "&matTypeId=" + this.searchForm.matTypeId;
            this.$axios.post(url_1,[]).then(res => {
                if (!res.data.Success) {
                    this.$message({ message: res.data.Msg, type: 'warning' });
                    return;
                }
                //文件流
                var url_2 = basis.ExportDownload + "?filePath=" + res.data.data + "&delete=1";
                window.location.href = url_2;
            }).catch(err => {
                this.$message({ message: err, type: 'warning' });
            });
        }
    },
    mounted() {
				func.SearchJudge();
        this.funcGetCompany();
        var AllPromossions = JSON.parse(localStorage.getItem("permissions"));
        this.permissionsList = AllPromossions.find(function (item) { return item.ModuleUrl == 'DayStockWarn' }).Rights;
				this.funcGetCategoryTableData('', '', localStorage.getItem("shopCode"), localStorage.getItem("userType"), 1, 100000);
    },
}