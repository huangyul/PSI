import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import {
    ElMessage,
    ElMessageBox
} from "element-plus";
import WangEditor from "wangEditor";
import {
    ref,
    reactive,
    onMounted,
    onBeforeUnmount
} from "vue";
export default {
    name: "SetUp",
    setup() {

    },
    data() {
        return {
						permissionsList:'',
            form: {

            },
            checkbox1: false,
            checkbox2: false,
            DayList: [],
        }
    },
    methods: {
        funcGetTableData() {
            var url = basis.SetUp.query;
            this.$axios.get(url).then(res => {
                this.form = res.data;
                if (this.form.WarnType == 0) {
                    this.checkbox1 = false;
                    this.checkbox2 = false;
                } else if (this.form.WarnType == 1) {
                    this.checkbox1 = true;
                    this.checkbox2 = false;
                } else if (this.form.WarnType == 2) {
                    this.checkbox1 = false;
                    this.checkbox2 = true;
                } else if (this.form.WarnType == 3) {
                    this.checkbox1 = true;
                    this.checkbox2 = true;
                }
                if (!this.form.IsLimitInvDate) {
                    this.form.StartDay = '';
                    this.form.EndDay = '';
                }
            }).catch(err => {
                this.$message({
                    message: err,
                    type: 'warning'
                });
            });
        },
        eventUpdateTableData() {
            var params = this.form;
            params.Creater = localStorage.getItem("ms_username");
            params.Modifier = localStorage.getItem("ms_username");
            if (!this.checkbox1 && !this.checkbox2) {
                params.WarnType = 0;
            }
            if (this.checkbox1 && !this.checkbox2) {
                params.WarnType = 1;
            }
            if (!this.checkbox1 && this.checkbox2) {
                params.WarnType = 2;
            }
            if (this.checkbox1 && this.checkbox2) {
                params.WarnType = 3;
            }
            if (params.StartDay > params.EndDay) {
                this.$message({
                    message: '开始日不能大于结束日',
                    type: 'warning'
                });
                return;
            }
            if (!params.IsLimitInvDate) {
                params.StartDay = 0;
                params.EndDay = 0;
            }
						const loading = func.backgroundLoading('Loading');
            var url = basis.SetUp.update;
            this.$axios.post(url, params).then(res => {
								loading.close();
                this.$message({
                    message: '更新成功',
                    type: 'success'
                });
                this.funcGetTableData();
            }).catch(err => {
								loading.close();
                this.$message({
                    message: err,
                    type: 'warning'
                });
            });
        },
    },
    mounted() {
        this.funcGetTableData();
        this.DayList = [];
        for (var i = 1; i <= 31; i++) {
            var obj = {
                value: i,
                label: i + '日'
            };
            this.DayList.push(obj);
        }
				for(var item of JSON.parse(localStorage.getItem("permissions"))){
					if(item.ModuleUrl == 'SetUp'){
						this.permissionsList = item.Rights;
					}
				}
    },
    watch: {

    },
};