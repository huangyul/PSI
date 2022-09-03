import func from '../../func.js'
import basis from '../../../api/basisApi.js'
import scene from '../../../api/sceneApi.js'
import RangeDate from '../../../components/rangeDate.vue'
export default {
  name: 'SceneSales',
  components: { RangeDate },
  data() {
    return {
      permissionsList: '',
      searchForm: {
        deviceCode: '',
        warehouseCode: '',

        InTime: [new Date(), new Date()],
        startTime: new Date(),
        endTime: new Date(),
        productCode: '',
        shopInfo: '',
      },
      page: 1,
      pageSize: 15,
      total: 0,
      tableData: [],
      shopList: [],
    }
  },
  methods: {
    //获取仓库or仓位列表
    funcGetWhOrPositionInfo(shopCode, whCode, type) {
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
    //获取已入库列表
    funcGetCheckinQuery() {
      var startData = ''
      var endDate = ''
      if (this.searchForm.InTime) {
        startData = func.formatTimeToStr(
          this.searchForm.InTime[0],
          'yyyy-MM-dd'
        )
        endDate = func.formatTimeToStr(this.searchForm.InTime[1], 'yyyy-MM-dd')
      }
      var url =
        scene.SceneSelesList.GetProductSaleInOutList +
        '?device=' +
        encodeURIComponent(this.searchForm.deviceCode) +
        '&noseNum=' +
        this.searchForm.warehouseCode +
        '&saleDateStart=' +
        this.searchForm.startTime +
        '&saleDateEnd=' +
        this.searchForm.endTime +
        '&product=' +
        encodeURIComponent(this.searchForm.productCode) +
        '&shopInfo=' +
        this.searchForm.shopInfo +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&page=' +
        this.page +
        '&pageSize=' +
        this.pageSize

      this.$axios
        .get(url)
        .then((res) => {
          //console.log(res);
          this.tableData = res.data.Results
          this.total = res.data.TotalCount
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取门店信息列表
    funcGetShopCodeList(shopCode) {
      var url = basis.GetShopCodeList + '?shopCode=' + shopCode
      this.$axios
        .get(url)
        .then((res) => {
          console.log(res)
          console.log(7777)
          this.shopList = res.data
          if (this.shopList.length == 1) {
            this.searchForm.shopInfo = this.shopList[0].Code
          }
          this.eventSearch()
        })
        .catch((err) => {
          console.log(err)
          this.$message({ message: err, type: 'warning' })
        })
    },
    eventReset() {
      this.searchForm = {
        deviceCode: '',
        warehouseCode: '',
        startTime: new Date(),
        endTime: new Date(),
        InTime: '',
        productCode: '',
        shopInfo: '',
      }
    },
    eventSearch() {
      this.funcGetCheckinQuery()
    },
    eventPageSizeChange(val) {
      //this.page = 1;
      this.pageSize = val
      this.funcGetCheckinQuery()
    },
    eventPageChange(val) {
      this.page = val
      this.funcGetCheckinQuery()
    },
    //导出
    eventExport() {
      var startData = ''
      var endDate = ''
      if (this.searchForm.InTime) {
        startData = func.formatTimeToStr(
          this.searchForm.InTime[0],
          'yyyy-MM-dd'
        )
        endDate = func.formatTimeToStr(this.searchForm.InTime[1], 'yyyy-MM-dd')
      }

      var url_1 =
        scene.SceneSelesList.Export +
        '?device=' +
        this.searchForm.deviceCode +
        '&noseNum=' +
        this.searchForm.warehouseCode +
        '&saleDateStart=' +
        this.searchForm.startTime +
        '&saleDateEnd=' +
        this.searchForm.endTime +
        '&product=' +
        this.searchForm.productCode +
        '&shopInfo=' +
        this.searchForm.shopInfo +
        '&shopCode=' +
        localStorage.getItem('shopCode')

      this.$axios
        .post(url_1, [])
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
    funcRowClassName({ row, rowIndex }) {
      let className = ''
      if (rowIndex % 2 == 1) {
        className += 'double-row'
      }
      return className
    },
  },
  mounted() {
    func.SearchJudge()
    //this.funcGetWhOrPositionInfo(localStorage.getItem("shopCode"),"",1); //获取仓库列表
    //this.funcGetCheckinQuery();
    this.funcGetShopCodeList(localStorage.getItem('shopCode'))
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'SceneSales') {
        this.permissionsList = item.Rights
      }
    }
  },
  watch: {
    'searchForm.warehouseCode'(newVal, oldVal) {
      this.searchForm.productCode = ''
      //this.funcGetWhOrPositionInfo(localStorage.getItem("shopCode"),newVal,2); //获取仓位列表
    },
  },
}
