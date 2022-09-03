import func from '../../func.js'
import basis from '../../../api/basisApi.js'
import stock from '../../../api/stockApi.js'
import RangeDate from '../../../components/rangeDate.vue'
export default {
  name: 'CheckinQuery',
  components: { RangeDate },
  data() {
    return {
      permissionsList: '',
      isShowPosition: localStorage.getItem('isShowPosition'),
      searchForm: {
        companyCode: '',
        warehouseCode: '',
        positionCode: '',
        InTime: '',
        startTime: '',
        endTime: '',
        productCode: '',
        oddNum: '',
        purchaseType: '',
      },
      tableSelectedData: [],
      page: 1,
      pageSize: 15,
      total: 0,
      tableData: [],
      WarehouseList: '',
      PositionList: '',
      CompanyList: '',
    }
  },
  methods: {
    //获取门店列表
    funcGetCompany() {
      var url =
        basis.GetShopCodeList + '?shopCode=' + localStorage.getItem('shopCode')
      this.$axios
        .get(url)
        .then((res) => {
          this.CompanyList = res.data
          if (this.CompanyList.length == 1) {
            this.searchForm.companyCode = this.CompanyList[0].Code
          }
          this.funcGetCheckinQuery()
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取仓库or仓位列表
    funcGetWhOrPositionInfo(shopCode, whCode, type) {
      if (shopCode == '') {
        return
      }
      var url =
        basis.WhOrPositionInfo + '?shopCode=' + shopCode + '&whCode=' + whCode
      this.$axios
        .get(url)
        .then((res) => {
          if (type == 1) {
            this.WarehouseList = res.data
          } else {
            this.PositionList = res.data
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    funcTimeformat(val) {
      return func.formatTimeToStr(val.InDate, 'yyyy/MM/dd')
    },
    //获取已入库列表
    funcGetCheckinQuery() {
      const product = encodeURIComponent(this.searchForm.productCode)
      var url =
        stock.StockManagement.CheckinQuery +
        '?warehouseCode=' +
        this.searchForm.warehouseCode +
        '&positionCode=' +
        this.searchForm.positionCode +
        '&inDateStart=' +
        this.searchForm.startTime +
        '&inDateEnd=' +
        this.searchForm.endTime +
        '&product=' +
        product +
        '&orderCode=' +
        this.searchForm.oddNum +
        '&CheckinType=' +
        this.searchForm.purchaseType +
        '&shopInfo=' +
        this.searchForm.companyCode +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType') +
        '&page=' +
        this.page +
        '&pageSize=' +
        this.pageSize
      this.$axios
        .get(url)
        .then((res) => {
          this.tableData = res.data.Results
          this.total = res.data.TotalCount
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    eventReset() {
      this.searchForm = {
        companyCode: '',
        warehouseCode: '',
        positionCode: '',
        InTime: '',
        startTime: '',
        endTime: '',
        productCode: '',
        oddNum: '',
        purchaseType: '',
      }
    },
    eventSearch() {
      this.funcGetCheckinQuery()
    },
    eventPageSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.funcGetCheckinQuery()
    },
    eventPageChange(val) {
      this.page = val
      this.funcGetCheckinQuery()
    },
    funcRowClassName({ row, rowIndex }) {
      let className = ''
      if (rowIndex % 2 == 1) {
        className += 'double-row'
      }
      for (var item of this.tableSelectedData) {
        if (item == row) {
          className += ' rowSelect'
        }
      }
      return className
    },
    eventTableSelect(val) {
      this.tableSelectedData = val
    },
    //导出
    eventExport() {
      var ids = []
      for (var item of this.tableSelectedData) {
        var arr = item.Id.split(',')
        for (var item_1 of arr) {
          ids.push(item_1)
        }
      }
      //ids = ids.join(",");
      var url_1 =
        stock.StockManagement.CheckinExport +
        '?warehouseCode=' +
        this.searchForm.warehouseCode +
        '&positionCode=' +
        this.searchForm.positionCode +
        '&inDateStart=' +
        this.searchForm.startTime +
        '&inDateEnd=' +
        this.searchForm.endTime +
        '&product=' +
        this.searchForm.productCode +
        '&orderCode=' +
        this.searchForm.oddNum +
        '&checkinType=' +
        this.searchForm.purchaseType +
        '&shopInfo=' +
        this.searchForm.companyCode +
        '&shopCode=' +
        localStorage.getItem('shopCode')
      this.$axios
        .post(url_1, ids)
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
    this.funcGetCompany()
    // this.funcGetCheckinQuery();
    var AllPromossions = JSON.parse(localStorage.getItem('permissions'))
    this.permissionsList = AllPromossions.find(function (item) {
      return item.ModuleUrl == 'CheckinQuery'
    }).Rights
  },
  watch: {
    'searchForm.warehouseCode'(newVal, oldVal) {
      this.searchForm.positionCode = ''
      this.PositionList = []
      this.funcGetWhOrPositionInfo(this.searchForm.companyCode, newVal, 2) //获取仓位列表
    },
    'searchForm.companyCode'(newVal, oldVal) {
      this.searchForm.positionCode = ''
      this.PositionList = []
      this.searchForm.warehouseCode = ''
      this.WarehouseList = []
      this.funcGetWhOrPositionInfo(newVal, '', 1) //获取仓库列表
    },
  },
}
