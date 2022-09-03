import $ from 'jquery'
import procurement from '../../../api/procurementApi.js'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import RangeDate from '../../../components/rangeDate.vue'
export default {
  name: 'PurchaseOrderDetail',
  components: { RangeDate },
  data() {
    return {
      permissionsList: '',
      username: '',
      addDate: '',
      searchForm: {
        date: [new Date(), new Date()],
        Code: '',
        supplierInfo: '',
        Status: '',
        shopInfo: '',
        startTime: new Date(),
        endTime: new Date(),
      },
      tableData: [],
      tableDeteleData: '',
      page: 1,
      pageSize: 15,
      total: 0,
      shopList: [],
    }
  },
  methods: {
    funcGetTableData(
      shopInfo,
      startTime,
      endTime,
      orderCode,
      supplierInfo,
      shopCode,
      userType,
      status,
      page,
      pageSize
    ) {
      var url =
        procurement.PurchaseOrderDetail.query +
        '?shopInfo=' +
        shopInfo +
        '&startTime=' +
        startTime +
        '&endTime=' +
        endTime +
        '&orderCode=' +
        orderCode +
        '&supplierInfo=' +
        supplierInfo +
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
          //console.log(this.tableData);
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    funcTableDeteleList(ids, status, userName) {
      var url =
        procurement.PurchaseOrderDetail.updateStatus +
        '?ids=' +
        ids +
        '&status=' +
        status +
        '&userName=' +
        userName
      this.$axios
        .put(url)
        .then((res) => {
          ElMessage.success({
            message: '更新成功',
            type: 'success',
          })
          this.eventSearch()
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //获取门店信息列表
    funcGetShopCodeList(shopCode) {
      var url = basis.GetShopCodeList + '?shopCode=' + shopCode
      this.$axios
        .get(url)
        .then((res) => {
          this.shopList = res.data
          if (this.shopList.length == 1) {
            this.searchForm.shopInfo = this.shopList[0].Code
          }
          this.eventSearch()
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    funcGetDate() {
      var myDate = new Date()
      this.addDate = func.formatTimeToStr(myDate)
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
      let searchStatus = this.searchForm.Status
      if (this.searchForm.Status == '') {
        searchStatus = '-1'
      }
      //console.log(this.searchForm.startTime, this.searchForm.endTime);
      this.funcGetTableData(
        this.searchForm.shopInfo,
        this.searchForm.startTime,
        this.searchForm.endTime,
        this.searchForm.Code,
        this.searchForm.supplierInfo,
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType'),
        searchStatus,
        this.page,
        this.pageSize
      )
    },
    eventReset() {
      this.searchForm = {
        date: null,
        Code: '',
        supplierInfo: '',
        Status: '',
        shopInfo: '',
        startTime: '',
        endTime: '',
      }
    },
    eventDetele(status) {
      if (this.tableDeteleData.length == 0) {
        ElMessage.warning({
          message: '还未选择',
          type: 'warning',
        })
      } else {
        var ids = []
        for (var item of this.tableDeteleData) {
          if (item.Status != '1' && status == 4) {
            ElMessage.warning({
              message: '只有状态为已下单才能订单终止',
              type: 'warning',
            })
            return
          }
          if (item.Status != '4' && status == 1) {
            ElMessage.warning({
              message: '只有状态为已完成才能订单撤销',
              type: 'warning',
            })
            return
          }
          ids.push(item.Id)
        }
        ids = ids.join(',')
        this.funcTableDeteleList(
          ids,
          status,
          localStorage.getItem('ms_username')
        )
      }
    },
    eventTableSelect(val) {
      this.tableDeteleData = val
    },
    //导出
    eventExport() {
      var ordercodes = []
      for (var item of this.tableDeteleData) {
        ordercodes.push(item.Code)
      }
      //ordercodes = ordercodes.join(",");

      var url_1 =
        procurement.PurchaseOrder.ExportDetail +
        '?shopInfo=' +
        this.searchForm.shopInfo +
        '&startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&Code=' +
        this.searchForm.Code +
        '&supllerInfo=' +
        this.searchForm.supplierInfo +
        '&status=' +
        this.searchForm.Status +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType')

      this.$axios
        .post(url_1, ordercodes)
        .then((res) => {
          if (!res.data.Success) {
            this.$message({ message: res.data.Msg, type: 'warning' })
            return
          }
          //文件流
          var url_2 =
            basis.ExportDownload + '?filePath=' + res.data.data + '&delete=1'
          window.location.href = url_2
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
  },
  mounted() {
    func.SearchJudge()
    this.username = localStorage.getItem('ms_username')
    this.eventSearch()
    this.funcGetShopCodeList(localStorage.getItem('shopCode'))
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'PurchaseOrderDetail') {
        this.permissionsList = item.Rights
      }
    }
    this.searchForm.startTime = new Date()
    this.searchForm.endTime = new Date()
  },
  watch: {},
}
