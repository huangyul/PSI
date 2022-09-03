import $ from 'jquery'
import supplier from '../../../api/supplierApi.js'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import RangeDate from '../../../components/rangeDate.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  name: 'Statements',
  components: { RangeDate },
  data() {
    return {
      permissionsList: '',
      username: '',
      addDate: '',
      searchForm: {
        date: null,
        poCode: '',
        supllerInfo: '',
        productName: '',
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
      TjValues: [],
      LogisticsList: [],
      isSupplier: false,
    }
  },
  methods: {
    funcGetTableData(
      poCode,
      supllerInfo,
      startTime,
      endTime,
      productName,
      shopCode,
      userType,
      status,
      page,
      pageSize
    ) {
      var url =
        supplier.Statements.query +
        '?poCode=' +
        poCode +
        '&supllerInfo=' +
        supllerInfo +
        '&startTime=' +
        startTime +
        '&endTime=' +
        endTime +
        '&productName=' +
        encodeURIComponent(productName) +
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
          this.TjValues = res.data.TjValues
          //console.log(res);
          for (var item of this.tableData) {
            item.OrderDate = func.formatTimeToStr(item.OrderDate, 'yyyy-MM-dd')
          }
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
          index === 9 ||
          index === 10 ||
          index === 11 ||
          index === 12 ||
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
            // if(index === 8 || index === 9 || index === 10 || index === 11 || index === 12 || index === 13 || index === 14 || index === 15){
            // 	sums[index] = parseFloat(sums[index]).toFixed(2);
            // }
            if (index === 8) {
              sums[index] = this.TjValues[0]
            }
            if (index === 9) {
              sums[index] = this.TjValues[1]
            }
            if (index === 10) {
              sums[index] = this.TjValues[2]
            }
            if (index === 11) {
              sums[index] = this.TjValues[3]
            }
            if (index === 12) {
              sums[index] = this.TjValues[4]
            }
            if (index === 13) {
              sums[index] = this.TjValues[5]
            }
            if (index === 14) {
              sums[index] = this.TjValues[6]
            }
            if (index === 15) {
              sums[index] = this.TjValues[7]
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
      //console.log(this.searchForm.startTime, this.searchForm.endTime);
      this.funcGetTableData(
        this.searchForm.poCode,
        this.searchForm.supllerInfo,
        this.searchForm.startTime,
        this.searchForm.endTime,
        this.searchForm.productName,
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
        poCode: '',
        supllerInfo: '',
        productName: '',
        status: -1,
        startTime: '',
        endTime: '',
      }
    },
    eventTableSelect(val) {
      this.tableDeteleData = val
    },
    getHeight() {
      this.tableHeight = $('.middle').outerHeight(true)
    },
  },
  mounted() {
    func.SearchJudge()
    this.username = localStorage.getItem('ms_username')
    this.eventSearch()
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'Statements') {
        this.permissionsList = item.Rights
      }
    }
    if (localStorage.getItem('userType') == '3') {
      this.isSupplier = true
    }
  },
  watch: {},
}
