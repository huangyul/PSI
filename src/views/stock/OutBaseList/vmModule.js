import func from '../../func.js'
import basis from '../../../api/basisApi.js'
import stock from '../../../api/stockApi.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import RangeDate from '../../../components/rangeDate.vue'
export default {
  name: 'OutBaseList',
  components: { RangeDate },
  data() {
    return {
      cascaderProps: {
        multiple: true,
        label: 'Name',
        value: 'Id',
        children: 'children',
        expandTrigger: 'hover',
      },
      cascaderValue: [],
      permissionsList: '',
      isShowPosition: localStorage.getItem('isShowPosition'),
      searchForm: {
        searchCondition: {
          checkoutType: '',
          Product: '',
          InTime: [new Date(), new Date()],
          companyCode: '',
          warehouseCode: '',
          positionCode: '',
          useWay: '',
          matTypeId: [],
        },
        startTime: new Date(),
        endTime: new Date(),
        page: 1,
        pageSize: 15,
        total: 0,
      },
      tableSelectedData: [],
      tableData: [],
      WarehouseList: [],
      PositionList: [],
      CompanyList: [],
      CategoryTree: [],
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
            this.searchForm.searchCondition.companyCode =
              this.CompanyList[0].Code
          }
          this.GetCheckoutDatas()
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取仓库
    funcGetWarehouseList(shopCode) {
      var url = stock.StockManagement.GetWarehouse + '?shopCode=' + shopCode
      this.$axios
        .get(url)
        .then((res) => {
          this.WarehouseList = res.data
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取仓位列表
    funcGetWhOrPositionInfo(whCode, shopCode) {
      if (shopCode == '') {
        this.PositionList = []
        return
      }
      var url =
        basis.WhOrPositionInfo + '?shopCode=' + shopCode + '&whCode=' + whCode
      this.$axios
        .get(url)
        .then((res) => {
          this.PositionList = res.data
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取品类信息表
    funcGetCategoryTableData(
      name,
      matType,
      shopCode,
      userType,
      page,
      pageSize
    ) {
      var url =
        basis.CategoryManagement.query +
        '?name=' +
        name +
        '&matType=' +
        matType +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .get(url)
        .then((res) => {
          this.CategoryTree = func.recursiveCategoryTree(res.data.Results)
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    GetCheckoutDatas() {
      var checkoutType = -1
      if (!(this.searchForm.searchCondition.checkoutType === '')) {
        checkoutType = this.searchForm.searchCondition.checkoutType
      }
      // if (!this.searchForm.searchCondition.matTypeId) {
      //   this.searchForm.searchCondition.matTypeId = ''
      // }
      // if (typeof this.searchForm.searchCondition.matTypeId != 'string') {
      //   var length = this.searchForm.searchCondition.matTypeId.length - 1
      //   this.searchForm.searchCondition.matTypeId =
      //     this.searchForm.searchCondition.matTypeId[length]
      // }
      var url =
        stock.StockManagement.GetCheckoutDatas +
        '?productInfo=' +
        this.searchForm.searchCondition.Product +
        '&whCode=' +
        this.searchForm.searchCondition.warehouseCode +
        '&positionCode=' +
        this.searchForm.searchCondition.positionCode +
        '&startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&useWay=' +
        this.searchForm.searchCondition.useWay +
        '&inShopCode=' +
        this.searchForm.searchCondition.companyCode +
        '&checkoutType=' +
        checkoutType +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType') +
        '&page=' +
        this.searchForm.page +
        '&pageSize=' +
        this.searchForm.pageSize
      let data = this.searchForm.searchCondition.matTypeId
      this.$axios
        .post(url, data)
        .then((res) => {
          this.tableData = res.data.Results
          for (var data of this.tableData) {
            data.OutDate = data.OutDate.split(' ')[0]
          }
          this.searchForm.total = res.data.TotalCount
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    eventSearch() {
      this.GetCheckoutDatas()
    },
    // 联机选择器
    onCascaderChange(value) {
      this.searchForm.searchCondition.matTypeId = []
      value.forEach((v) => {
        this.searchForm.searchCondition.matTypeId.push(v[v.length - 1])
      })
    },
    eventReset() {
      this.cascaderValue = []
      this.searchForm = {
        searchCondition: {
          checkoutType: '',
          Product: '',
          InTime: [new Date(), new Date()],
          companyCode: '',
          warehouseCode: '',
          positionCode: '',
          useWay: '',
          matTypeId: [],
        },
        startTime: new Date(),
        endTime: new Date(),
        page: 1,
        pageSize: 15,
        total: 0,
      }
    },
    eventPageSizeChange(val, type) {
      this.searchForm.page = 1
      this.searchForm.pageSize = val
      this.GetCheckoutDatas()
    },
    eventPageChange(val, type) {
      this.searchForm.page = val
      this.GetCheckoutDatas()
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
      var checkoutType = -1
      if (!(this.searchForm.searchCondition.checkoutType === '')) {
        checkoutType = this.searchForm.searchCondition.checkoutType
      }
      // if (!this.searchForm.searchCondition.matTypeId) {
      //   this.searchForm.searchCondition.matTypeId = ''
      // }
      // if (typeof this.searchForm.searchCondition.matTypeId != 'string') {
      //   var length = this.searchForm.searchCondition.matTypeId.length - 1
      //   this.searchForm.searchCondition.matTypeId =
      //     this.searchForm.searchCondition.matTypeId[length]
      // }
      var ids = []
      for (var item of this.tableSelectedData) {
        ids.push(item.Id)
      }
      //ids = ids.join(",");
      var url_1 =
        stock.StockManagement.CheckoutExport +
        '?productInfo=' +
        this.searchForm.searchCondition.Product +
        '&whCode=' +
        this.searchForm.searchCondition.warehouseCode +
        '&positionCode=' +
        this.searchForm.searchCondition.positionCode +
        '&startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&useWay=' +
        this.searchForm.searchCondition.useWay +
        '&inShopCode=' +
        this.searchForm.searchCondition.companyCode +
        '&checkoutType=' +
        checkoutType +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType')
      this.$axios
        .post(url_1, {
          Ids: [],
          matTypeId: this.searchForm.searchCondition.matTypeId,
        })
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
    // this.GetCheckoutDatas();
    var AllPromossions = JSON.parse(localStorage.getItem('permissions'))
    this.permissionsList = AllPromossions.find(function (item) {
      return item.ModuleUrl == 'OutBaseList'
    }).Rights
    this.funcGetCategoryTableData(
      '',
      '',
      localStorage.getItem('shopCode'),
      localStorage.getItem('userType'),
      1,
      100000
    )
  },
  watch: {
    'searchForm.searchCondition.warehouseCode'(newVal, oldVal) {
      this.searchForm.searchCondition.positionCode = ''
      this.funcGetWhOrPositionInfo(
        newVal,
        this.searchForm.searchCondition.companyCode
      ) //获取仓位列表
    },
    'searchForm.searchCondition.companyCode'(newVal, oldVal) {
      this.searchForm.searchCondition.positionCode = ''
      this.PositionList = []
      this.searchForm.searchCondition.warehouseCode = ''
      this.WarehouseList = []
      if (newVal != '') {
        this.funcGetWarehouseList(newVal)
      }
    },
  },
}
