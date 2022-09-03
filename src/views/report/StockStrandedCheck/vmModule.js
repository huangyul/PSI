import $ from 'jquery'
import report from '../../../api/reportApi.js'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  name: 'StockStrandedCheck',
  data() {
    return {
      permissionsList: '',
      isShowPosition: '',
      username: '',
      addDate: '',
      searchForm: {
        matTypeId: '',
        productInfo: '',
        whCode: '',
        positionCode: '',
        inDate: 1,
        day: 0,
        shopInfo: '',
      },
      tableData: [],
      tableDeteleData: '',
      page: 1,
      pageSize: 15,
      total: 0,
      warehouseList: [],
      positionList: [],
      CategoryTree: [],
      shopList: [],
    }
  },
  methods: {
    funcGetTableData(
      matTypeId,
      productInfo,
      whCode,
      positionCode,
      inDate,
      day,
      shopInfo,
      shopCode,
      page,
      pageSize
    ) {
      var url =
        report.StockStrandedCheck.query +
        '?matTypeId=' +
        matTypeId +
        '&productInfo=' +
        encodeURIComponent(productInfo) +
        '&whCode=' +
        whCode +
        '&positionCode=' +
        positionCode +
        '&inDate=' +
        inDate +
        '&day=' +
        day +
        '&shopInfo=' +
        shopInfo +
        '&shopCode=' +
        shopCode +
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

    //获取仓库列表和仓位列表
    funcGetWarehouseAndPosition(shopCode, whCode, type) {
      var url =
        basis.WhOrPositionInfo + '?shopCode=' + shopCode + '&whCode=' + whCode
      this.$axios
        .get(url)
        .then((res) => {
          if (type == 1) {
            this.warehouseList = res.data
          } else if (type == 2) {
            this.positionList = res.data
          }
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

    funcGetDate() {
      var myDate = new Date()
      this.addDate = func.formatTimeToStr(myDate)
    },
    //自定义表格底部合计
    funcGetSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        } else if (index === 6 || index === 7 || index === 8) {
          const values = data.map((item) => Number(item[column.property]))
          if (!values.every((value) => isNaN(value))) {
            sums[index] = `${values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)}`
          } else {
            sums[index] = ''
          }
        }
      })

      return sums
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
      if (this.searchForm.inDate == 2 && this.searchForm.day == undefined) {
        this.$message({ message: '自定义时间不能为空', type: 'warning' })
        return
      }
      if (!this.searchForm.matTypeId) {
        this.searchForm.matTypeId = ''
      }
      if (typeof this.searchForm.matTypeId != 'string') {
        var length = this.searchForm.matTypeId.length - 1
        this.searchForm.matTypeId = this.searchForm.matTypeId[length]
      }
      this.funcGetTableData(
        this.searchForm.matTypeId,
        this.searchForm.productInfo,
        this.searchForm.whCode,
        this.searchForm.positionCode,
        this.searchForm.inDate,
        this.searchForm.day,
        this.searchForm.shopInfo,
        localStorage.getItem('shopCode'),
        this.page,
        this.pageSize
      )
    },
    eventReset() {
      this.searchForm = {
        matTypeId: '',
        productInfo: '',
        whCode: '',
        positionCode: '',
        inDate: 1,
        day: 0,
        shopInfo: '',
      }
    },
    //导出
    eventExport() {
      if (typeof this.searchForm.matTypeId != 'string') {
        var length = this.searchForm.matTypeId.length - 1
        this.searchForm.matTypeId = this.searchForm.matTypeId[length]
      }

      var url_1 =
        report.StockStrandedCheck.Export +
        '?matTypeId=' +
        this.searchForm.matTypeId +
        '&productInfo=' +
        this.searchForm.productInfo +
        '&whCode=' +
        this.searchForm.whCode +
        '&positionCode=' +
        this.searchForm.positionCode +
        '&inDate=' +
        this.searchForm.inDate +
        '&day=' +
        this.searchForm.day +
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
      for (var item of this.tableDeteleData) {
        if (item == row) {
          className += ' rowSelect'
        }
      }
      return className
    },
  },
  mounted() {
    func.SearchJudge()
    this.username = localStorage.getItem('ms_username')
    this.isShowPosition = localStorage.getItem('isShowPosition')
    //this.eventSearch();
    this.funcGetShopCodeList(localStorage.getItem('shopCode'))
    this.funcGetCategoryTableData(
      '',
      '',
      localStorage.getItem('shopCode'),
      localStorage.getItem('userType'),
      1,
      100000
    )
    // this.funcGetWarehouseAndPosition(localStorage.getItem("shopCode"), '', 1);
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'StockStrandedCheck') {
        this.permissionsList = item.Rights
      }
    }
  },
  watch: {
    'searchForm.shopInfo'(newVal, oldVal) {
      this.searchForm.whCode = ''
      this.warehouseList = []
      if (newVal) {
        this.funcGetWarehouseAndPosition(newVal, '', 1)
      }
    },
    'searchForm.whCode'(newVal, oldVal) {
      this.searchForm.positionCode = ''
      this.positionList = []
      if (newVal) {
        this.funcGetWarehouseAndPosition(this.searchForm.shopInfo, newVal, 2)
      }
    },
  },
}
