import $ from 'jquery'
import report from '../../../api/reportApi.js'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import RangeDate from '../../../components/rangeDate.vue'
export default {
  name: 'EntersSellsSaves',
  components: {
    RangeDate,
  },
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
          new Date(new Date().getFullYear(), new Date().getMonth() - 1, 26),
          new Date(new Date().getFullYear(), new Date().getMonth(), 25),
        ],
        matTypeId: [],
        productInfo: '',
        whCode: '',
        positionCode: '',
        shopInfo: '',
        startTime: new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 1,
          26
        ),
        endTime: new Date(new Date().getFullYear(), new Date().getMonth(), 25),
        reportType: '',
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
      TjValues: [],
    }
  },
  methods: {
    funcGetTableData(
      startTime,
      endTime,
      matTypeId,
      productInfo,
      whCode,
      positionCode,
      shopInfo,
      shopCode,
      userType,
      reportType,
      page,
      pageSize
    ) {
      var url =
        report.EntersSellsSaves.query +
        '?startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&productInfo=' +
        productInfo +
        '&whCode=' +
        whCode +
        '&positionCode=' +
        positionCode +
        '&shopInfo=' +
        shopInfo +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType +
        '&reportType=' +
        reportType +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      let data = matTypeId
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
          index === 8 ||
          index === 10 ||
          index === 11 ||
          index === 13 ||
          index === 14 ||
          index === 16 ||
          index === 17 ||
          index === 19 ||
          index === 20 ||
          index === 22 ||
          index === 23 ||
          index === 25 ||
          index === 26 ||
          index === 28 ||
          index === 29 ||
          index === 31 ||
          index === 32 ||
          index === 34 ||
          index === 35 ||
          index === 37 ||
          index === 38 ||
          index === 40
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
            if (index === 8) {
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
            if (index === 16) {
              sums[index] = this.TjValues[5]
            }
            if (index === 17) {
              sums[index] = this.TjValues[6]
            }
            if (index === 19) {
              sums[index] = this.TjValues[7]
            }
            if (index === 20) {
              sums[index] = this.TjValues[8]
            }
            if (index === 22) {
              sums[index] = this.TjValues[9]
            }
            if (index === 23) {
              sums[index] = this.TjValues[10]
            }
            if (index === 25) {
              sums[index] = this.TjValues[11]
            }
            if (index === 26) {
              sums[index] = this.TjValues[12]
            }
            if (index === 28) {
              sums[index] = this.TjValues[13]
            }
            if (index === 29) {
              sums[index] = this.TjValues[14]
            }
            if (index === 31) {
              sums[index] = this.TjValues[15]
            }
            if (index === 32) {
              sums[index] = this.TjValues[16]
            }
            if (index === 34) {
              sums[index] = this.TjValues[17]
            }
            if (index === 35) {
              sums[index] = this.TjValues[18]
            }
            if (index === 37) {
              sums[index] = this.TjValues[19]
            }
            if (index === 38) {
              sums[index] = this.TjValues[20]
            }
            if (index === 40) {
              sums[index] = this.TjValues[21]
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
      // if(isFirst === true){
      // 	var date = new Date();
      // 	//获取这个月的第一天
      // 	var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      // 	//获取下个月的上一天，即这个月的最后一天
      // 	var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      // 	this.searchForm.date = [firstDay,lastDay];

      // }
      if (!this.searchForm.startTime || !this.searchForm.endTime) {
        this.$message({ message: '查询时查看日期不能为空', type: 'warning' })
        return
      }
      // if (!this.searchForm.matTypeId) {
      //   this.searchForm.matTypeId = ''
      // }
      // if (typeof this.searchForm.matTypeId != 'string') {
      //   var length = this.searchForm.matTypeId.length - 1
      //   this.searchForm.matTypeId = this.searchForm.matTypeId[length]
      // }
      this.funcGetTableData(
        this.searchForm.startTime,
        this.searchForm.endTime,
        this.searchForm.matTypeId,
        this.searchForm.productInfo,
        this.searchForm.whCode,
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
      this.searchForm.matTypeId = []
      value.forEach((v) => {
        this.searchForm.matTypeId.push(v[v.length - 1])
      })
    },
    eventReset() {
      this.cascaderValue = []
      this.searchForm = {
        date: null,
        matTypeId: [],
        productInfo: '',
        whCode: '',
        positionCode: '',
        shopInfo: '',
        startTime: '',
        endTime: '',
        reportType: '',
      }
    },
    //导出
    eventExport() {
      // if (!this.searchForm.matTypeId) {
      //   this.searchForm.matTypeId = ''
      // }
      // if (typeof this.searchForm.matTypeId != 'string') {
      //   var length = this.searchForm.matTypeId.length - 1
      //   this.searchForm.matTypeId = this.searchForm.matTypeId[length]
      // }

      var url_1 =
        report.EntersSellsSaves.Export +
        '?startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&productInfo=' +
        this.searchForm.productInfo +
        '&whCode=' +
        this.searchForm.whCode +
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
    this.username = localStorage.getItem('ms_username')
    this.isShowPosition = localStorage.getItem('isShowPosition')
    //this.eventSearch(true);
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
      if (item.ModuleUrl == 'EntersSellsSaves') {
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
