import $ from 'jquery'
import report from '../../../api/reportApi.js'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import RangeDate from '../../../components/rangeDate.vue'
export default {
  name: 'PurchaseInLibrarySummary',
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
      isShowPosition: '',
      username: '',
      addDate: '',
      searchForm: {
        date: [
          new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        ],
        type: '',
        supplier: '',
        code: '',
        matTypeId: [],
        product: '',
        warehouseCode: '',
        positionCode: '',
        shopInfo: '',
        startTime: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endTime: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ),
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
      loadReportType: '',
    }
  },
  methods: {
    funcGetTableData(
      inDateStart,
      inDateEnd,
      supplier,
      code,
      matTypeId,
      product,
      warehouseCode,
      positionCode,
      shopInfo,
      shopCode,
      reportType,
      page,
      pageSize
    ) {
      var url =
        report.PurchaseInLibrarySummary.query +
        '?inDateStart=' +
        inDateStart +
        '&inDateEnd=' +
        inDateEnd +
        '&checkinType=' +
        this.searchForm.type +
        '&supplier=' +
        supplier +
        '&code=' +
        code +
        '&product=' +
        product +
        '&warehouseCode=' +
        warehouseCode +
        '&positionCode=' +
        positionCode +
        '&shopInfo=' +
        shopInfo +
        '&shopCode=' +
        shopCode +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize +
        '&reportType=' +
        reportType
      let data = matTypeId
      this.$axios
        .post(url, data)
        .then((res) => {
          this.tableData = res.data.Results
          this.total = res.data.TotalCount
          this.TjValues = res.data.TjValues
          //console.log(res);
          this.loadReportType = JSON.parse(
            JSON.stringify(this.searchForm.reportType)
          )
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
        } else if (
          index === 14 ||
          index === 15 ||
          index === 16 ||
          index === 17
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
            if (this.loadReportType == 2) {
              if (index === 14) {
                sums[index] = ''
              }
              if (index === 15) {
                sums[index] = this.TjValues[0]
              }
              if (index === 16) {
                sums[index] = this.TjValues[1]
              }
              if (index === 17) {
                sums[index] = this.TjValues[2]
              }
            } else {
              if (index === 14) {
                sums[index] = this.TjValues[0]
              }
              if (index === 15) {
                sums[index] = this.TjValues[1]
              }
              if (index === 16) {
                sums[index] = this.TjValues[2]
              }
              if (index === 17) {
                sums[index] = this.TjValues[3]
              }
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
      this.funcGetTableData(
        this.searchForm.startTime,
        this.searchForm.endTime,
        this.searchForm.supplier,
        this.searchForm.code,
        this.searchForm.matTypeId,
        this.searchForm.product,
        this.searchForm.warehouseCode,
        this.searchForm.positionCode,
        this.searchForm.shopInfo,
        localStorage.getItem('shopCode'),
        this.searchForm.reportType,
        this.page,
        this.pageSize
      )
    },
    eventReset() {
      this.cascaderValue = []
      this.searchForm = {
        date: null,
        type: '',
        supplier: '',
        code: '',
        matTypeId: [],
        product: '',
        warehouseCode: '',
        positionCode: '',
        shopInfo: '',
        startTime: '',
        endTime: '',
        reportType: '',
      }
    },
    // 联机选择器
    onCascaderChange(value) {
      this.searchForm.matTypeId = []
      value.forEach((v) => {
        this.searchForm.matTypeId.push(v[v.length - 1])
      })
    },
    //导出
    eventExport() {
      var url_1 =
        report.PurchaseInLibrarySummary.Export +
        '?inDateStart=' +
        this.searchForm.startTime +
        '&inDateEnd=' +
        this.searchForm.endTime +
        '&supplier=' +
        this.searchForm.supplier +
        '&code=' +
        this.searchForm.code +
        '&checkinType=' +
        this.searchForm.type +
        '&product=' +
        this.searchForm.product +
        '&warehouseCode=' +
        this.searchForm.warehouseCode +
        '&positionCode=' +
        this.searchForm.positionCode +
        '&shopInfo=' +
        this.searchForm.shopInfo +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&reportType=' +
        this.searchForm.reportType

      this.$axios
        .post(url_1, { Ids: [], matTypeId: this.searchForm.matTypeId })
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
    var thisDate = new Date()
    if (thisDate.getDate() >= 1 && thisDate.getDate() <= 25) {
      this.searchForm.startTime = new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        26
      )
      this.searchForm.endTime = new Date()
    } else if (thisDate.getDate() >= 26 && thisDate.getDate() <= 31) {
      this.searchForm.startTime = new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        26
      )
      this.searchForm.endTime = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        25
      )
    }
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
      if (item.ModuleUrl == 'PurchaseInLibrarySummary') {
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
