import $ from 'jquery'
import supplier from '../../../api/supplierApi.js'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import RangeDate from '../../../components/rangeDate.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  name: 'DeliveryDetail',
  components: { RangeDate },
  data() {
    return {
      permissionsList: '',
      username: '',
      addDate: '',
      searchForm: {
        date: null,
        deliveryCode: '',
        poCode: '',
        supllerInfo: '',
        logCompanyCode: '',
        expressNumber: '',
        status: -1,
        startTime: '',
        endTime: '',
      },
      tableData: [],
      dialogVisible: false,
      addForm: {
        Code: '',
        CreateTime: '',
        Creater: '',
        PSI_Purchase_Delivery_Ms: [],
        Modifier: '',
        ModifyTime: '',
        Plan_Date: '',
        ShopAddress: '',
        ShopCode: '',
        ShopName: '',
        UpdateTime: 0,
      },

      tableDeteleData: '',
      page: 1,
      pageSize: 15,
      total: 0,
      LogisticsList: [],
      isSupplier: false,
      tipDialogShow: false,
    }
  },
  methods: {
    funcGetTableData(
      deliveryCode,
      poCode,
      supllerInfo,
      startTime,
      endTime,
      logCompanyCode,
      expressNumber,
      shopCode,
      userType,
      status,
      page,
      pageSize
    ) {
      var url =
        supplier.DeliveryDetail.query +
        '?deliveryCode=' +
        deliveryCode +
        '&poCode=' +
        poCode +
        '&supllerInfo=' +
        supllerInfo +
        '&startTime=' +
        startTime +
        '&endTime=' +
        endTime +
        '&logCompanyCode=' +
        logCompanyCode +
        '&expressNumber=' +
        expressNumber +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType +
        '&status=' +
        status +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .get(url)
        .then((res) => {
          this.tableData = res.data.Results
          this.total = res.data.TotalCount
          //console.log(res);
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //获取物流公司列表
    funcGetLogisticsTableData(name, code, status, page, pageSize) {
      var url =
        basis.LogisticsCompany.query +
        '?name=' +
        name +
        '&code=' +
        code +
        '&status=' +
        status +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .get(url)
        .then((res) => {
          this.LogisticsList = res.data.Results
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
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
      this.pageSize = val
      this.eventSearch()
    },
    eventPageChange(val) {
      this.page = val
      this.eventSearch()
    },
    eventSearch() {
      //console.log(this.searchForm.startTime, this.searchForm.endTime);
      this.funcGetTableData(
        this.searchForm.deliveryCode,
        this.searchForm.poCode,
        this.searchForm.supllerInfo,
        this.searchForm.startTime,
        this.searchForm.endTime,
        this.searchForm.logCompanyCode,
        this.searchForm.expressNumber,
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType'),
        this.searchForm.status,
        this.page,
        this.pageSize
      )
    },
    eventReset() {
      this.searchForm = {
        date: null,
        deliveryCode: '',
        poCode: '',
        supllerInfo: '',
        logCompanyCode: '',
        expressNumber: '',
        status: -1,
        startTime: '',
        endTime: '',
      }
    },
    //撤销发货
    eventDetele() {
      if (this.tableDeteleData.length == 0) {
        ElMessage.warning({
          message: '还未选择',
          type: 'warning',
        })
      } else {
        var ids = []
        for (var item of this.tableDeteleData) {
          if (item.CheckinStatus != '未入库') {
            ElMessage.warning({
              message: '仅能撤销未入库的商品',
              type: 'warning',
            })
            return
          }
          ids.push(item.Id)
        }
        //ids = ids.join(",");
        const loading = func.backgroundLoading('Loading')
        var url =
          supplier.DeliveryDetail.undo +
          '?userName=' +
          localStorage.getItem('ms_username')
        this.$axios
          .post(url, ids)
          .then((res) => {
            loading.close()
            ElMessage.success({
              message: '撤销成功',
              type: 'success',
            })
            this.eventSearch()
          })
          .catch((err) => {
            loading.close()
            if (err.includes('订单终止')) {
              this.tipDialogShow = true
            } else {
              this.$message({
                message: err,
                type: 'warning',
              })
            }
          })
      }
    },
    eventTableSelect(val) {
      this.tableDeteleData = val
    },
    toPrucurementDetail() {
      this.tipDialogShow = false
      this.$router.push({ name: 'PurchaseOrderDetail' })
    },
  },
  mounted() {
    func.SearchJudge()
    this.username = localStorage.getItem('ms_username')
    this.eventSearch()
    this.funcGetLogisticsTableData('', '', -1, 1, 10000)
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'DeliveryDetail') {
        this.permissionsList = item.Rights
      }
    }
    if (localStorage.getItem('userType') == '3') {
      this.isSupplier = true
    }
  },
  watch: {},
}
