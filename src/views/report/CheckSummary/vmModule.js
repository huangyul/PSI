import $ from 'jquery'
import report from '../../../api/reportApi.js'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  name: 'CheckSummary',
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
      isShowPosition: '',
      username: '',
      addDate: '',
      searchForm: {
        // date: [new Date(new Date().getFullYear(), new Date().getMonth() - 1, 26),new Date(new Date().getFullYear(), new Date().getMonth(), 25)],
        date: new Date(),
        suppllerInfo: '',
        Inventory: -1,
        CategoryId: [],
        productCode: '',
        warehouseCode: '',
        positionCode: '',
        shopInfo: '',
        startTime: '',
        endTime: '',
        reportType: '',
      },
      tableData: [],
      tableDeteleData: '',
      page: 1,
      pageSize: 15,
      total: 0,
      TjValues: [],
      warehouseList: [],
      positionList: [],
      CategoryTree: [],
      shopList: [],
      tableHeight: 0,
    }
  },
  methods: {
    funcGetTableData(
      InventoryDateStart,
      InventoryDateEnd,
      supllerInfo,
      Inventory,
      CategoryId,
      productCode,
      warehouseCode,
      positionCode,
      shopInfo,
      shopCode,
      userType,
      reportType,
      page,
      pageSize
    ) {
      var url =
        report.CheckSummary.query +
        '?InventoryDateStart=' +
        InventoryDateStart +
        '&InventoryDateEnd=' +
        InventoryDateEnd +
        '&supllerInfo=' +
        supllerInfo +
        '&Inventory=' +
        Inventory +
        '&productCode=' +
        productCode +
        '&warehouseCode=' +
        warehouseCode +
        '&positionCode=' +
        positionCode +
        '&shopInfo=' +
        shopInfo +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize +
        '&reportType=' +
        reportType
      let data = CategoryId
      this.$axios
        .post(url, data)
        .then((res) => {
          this.tableData = res.data.Results
          this.total = res.data.TotalCount
          this.TjValues = res.data.TjValues
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
          var arr = []
          for (var item of res.data.Results) {
            if (item.Mat_Type != 'M') {
              arr.push(item)
            }
          }
          this.CategoryTree = func.recursiveCategoryTree(arr)
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
        } else if (
          index === 9 ||
          index === 10 ||
          index === 11 ||
          index === 13 ||
          index === 14 ||
          index === 15
        ) {
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
            // sums[index] = parseFloat(sums[index]).toFixed(2);
            if (index === 9) {
              sums[index] = this.TjValues[0]
            }
            if (index === 10) {
              sums[index] = this.TjValues[1]
            }
            if (index === 11) {
              sums[index] = this.TjValues[2]
            }
            if (index === 13) {
              sums[index] = this.TjValues[3]
            }
            if (index === 14) {
              sums[index] = this.TjValues[4]
            }
            if (index === 15) {
              sums[index] = this.TjValues[5]
            }
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
      if (this.searchForm.date) {
        var month = this.searchForm.date.getMonth()
        var startTime = new Date(new Date().getFullYear(), month - 1, 26)
        var endTime = new Date(new Date().getFullYear(), month, 25)
        this.searchForm.startTime = func.formatTimeToStr(
          startTime,
          'yyyy-MM-dd'
        )
        this.searchForm.endTime = func.formatTimeToStr(endTime, 'yyyy-MM-dd')
      } else {
        this.searchForm.startTime = ''
        this.searchForm.endTime = ''
      }
      // if (!this.searchForm.CategoryId) {
      //   this.searchForm.CategoryId = ''
      // }
      // if (typeof this.searchForm.CategoryId != 'string') {
      //   var length = this.searchForm.CategoryId.length - 1
      //   this.searchForm.CategoryId = this.searchForm.CategoryId[length]
      // }
      this.funcGetTableData(
        this.searchForm.startTime,
        this.searchForm.endTime,
        this.searchForm.suppllerInfo,
        this.searchForm.Inventory,
        this.searchForm.CategoryId,
        this.searchForm.productCode,
        this.searchForm.warehouseCode,
        this.searchForm.positionCode,
        this.searchForm.shopInfo,
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType'),
        this.searchForm.reportType,
        this.page,
        this.pageSize
      )
    },
    // 联机选择器
    onCascaderChange(value) {
      this.searchForm.CategoryId = []
      value.forEach((v) => {
        this.searchForm.CategoryId.push(v[v.length - 1])
      })
    },
    eventReset() {
      this.cascaderValue = []
      this.searchForm = {
        date: null,
        suppllerInfo: '',
        Inventory: -1,
        CategoryId: [],
        productCode: '',
        warehouseCode: '',
        positionCode: '',
        shopInfo: '',
        startTime: '',
        endTime: '',
        reportType: '',
      }
    },
    //导出
    eventExport() {
      if (this.searchForm.date) {
        var month = this.searchForm.date.getMonth()
        var startTime = new Date(new Date().getFullYear(), month - 1, 26)
        var endTime = new Date(new Date().getFullYear(), month, 25)
        this.searchForm.startTime = func.formatTimeToStr(
          startTime,
          'yyyy-MM-dd'
        )
        this.searchForm.endTime = func.formatTimeToStr(endTime, 'yyyy-MM-dd')
      } else {
        this.searchForm.startTime = ''
        this.searchForm.endTime = ''
      }
      // if (!this.searchForm.CategoryId) {
      //   this.searchForm.CategoryId = ''
      // }
      // if (typeof this.searchForm.CategoryId != 'string') {
      //   var length = this.searchForm.CategoryId.length - 1
      //   this.searchForm.CategoryId = this.searchForm.CategoryId[length]
      // }

      var url_1 =
        report.CheckSummary.Export +
        '?InventoryDateStart=' +
        this.searchForm.startTime +
        '&InventoryDateEnd=' +
        this.searchForm.endTime +
        '&supllerInfo=' +
        this.searchForm.suppllerInfo +
        '&Inventory=' +
        this.searchForm.Inventory +
        '&productCode=' +
        this.searchForm.productCode +
        '&warehouseCode=' +
        this.searchForm.warehouseCode +
        '&positionCode=' +
        this.searchForm.positionCode +
        '&shopInfo=' +
        this.searchForm.shopInfo +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType') +
        '&reportType=' +
        this.searchForm.reportType

      this.$axios
        .post(url_1, this.searchForm.CategoryId)
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
    this.tableHeight = $('.middle').outerHeight(true)
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'CheckSummary') {
        this.permissionsList = item.Rights
      }
    }
  },
  watch: {
    'searchForm.shopInfo'(newVal, oldVal) {
      this.searchForm.warehouseCode = ''
      this.warehouseList = []
      if (newVal) {
        this.funcGetWarehouseAndPosition(newVal, '', 1)
      }
    },
    'searchForm.warehouseCode'(newVal, oldVal) {
      this.searchForm.positionCode = ''
      this.positionList = []
      if (newVal) {
        this.funcGetWarehouseAndPosition(this.searchForm.shopInfo, newVal, 2)
      }
    },
  },
}
