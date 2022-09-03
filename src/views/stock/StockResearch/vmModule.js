import func from '../../func.js'
import basis from '../../../api/basisApi.js'
import stock from '../../../api/stockApi.js'
import RangeDate from '../../../components/rangeDate.vue'
export default {
  name: 'StockResearch',
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
      permissionsList: [],
      isShowPosition: localStorage.getItem('isShowPosition'),
      DataByPos: {
        tableData: [],
        total: 0,
        page: 1,
        pageSize: 15,
      },
      DataByWar: {
        tableData: [],
        total: 0,
        page: 1,
        pageSize: 15,
      },
      DataByPro: {
        tableData: [],
        total: 0,
        page: 1,
        pageSize: 15,
      },
      searchForm: {
        companyCode: '', //门店名称
        warehouseCode: '', //仓库名称
        positionCode: '', //仓位
        matTypeID: [], //商品类别
        productCode: '', //商品（编码/名称/条形码）
        stockNum: '0', //零库存（不显示/显示）
        InTime: '', //最早入库时间-开始日期到结束日期
        startTime: '',
        endTime: '',
      },
      WarehouseList: '',
      PositionList: '',
      MainCategoryTree: [],
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
          this.funcGetTableData(
            'ByPos',
            this.searchForm.warehouseCode,
            this.searchForm.positionCode,
            this.searchForm.matTypeID,
            this.searchForm.productCode,
            this.searchForm.stockNum,
            this.searchForm.InTime,
            1,
            this.DataByPos.pageSize
          ) //库存查询-按仓位排序
          this.funcGetTableData(
            'ByWar',
            this.searchForm.warehouseCode,
            this.searchForm.positionCode,
            this.searchForm.matTypeID,
            this.searchForm.productCode,
            this.searchForm.stockNum,
            this.searchForm.InTime,
            1,
            this.DataByWar.pageSize
          ) //库存查询-按仓库排序
          this.funcGetTableData(
            'ByPro',
            this.searchForm.warehouseCode,
            this.searchForm.positionCode,
            this.searchForm.matTypeID,
            this.searchForm.productCode,
            this.searchForm.stockNum,
            this.searchForm.InTime,
            1,
            this.DataByPro.pageSize
          ) //库存查询-按商品排序
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
    //获取商品类别
    funcGetMatType() {
      var url =
        basis.CategoryManagement.tree +
        '?bussinessType=&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType')
      this.$axios
        .get(url)
        .then((res) => {
          this.MainCategoryTree = func.recursiveCategoryTree(res.data)
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取总数据
    funcGetTableData(
      type,
      warehouseCode,
      positionCode,
      matTypeID,
      productCode,
      stockNum,
      InDate,
      page,
      pageSize
    ) {
      // if (typeof matTypeID != 'string' && matTypeID != null) {
      //   var length = matTypeID.length - 1
      //   matTypeID = matTypeID[length]
      // } else if (matTypeID == null) {
      //   matTypeID = ''
      // }
      var startData = ''
      var endDate = ''
      if (InDate) {
        InDate[0] = func.formatTimeToStr(InDate[0], 'yyyy-MM-dd')
        InDate[1] = func.formatTimeToStr(InDate[1], 'yyyy-MM-dd')
        startData = InDate[0]
        endDate = InDate[1]
      }
      var stockApi = ''
      switch (type) {
        case 'ByPos':
          stockApi = stock.StockManagement.SearchByPos
          break
        case 'ByWar':
          stockApi = stock.StockManagement.SearchByWar
          break
        case 'ByPro':
          stockApi = stock.StockManagement.SearchByPro
          break
      }

      var url =
        stockApi +
        '?warehouseCode=' +
        warehouseCode +
        '&positionCode=' +
        positionCode +
        '&productCode=' +
        productCode +
        '&stockNum=' +
        stockNum +
        '&startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&shopInfo=' +
        this.searchForm.companyCode +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType') +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      let data = matTypeID
      this.$axios
        .post(url, data)
        .then((res) => {
          switch (type) {
            case 'ByPos':
              this.DataByPos.tableData = res.data.Results
              for (var i = 0; i < this.DataByPos.tableData.length; i++) {
                this.DataByPos.tableData[i].SumNum =
                  this.DataByPos.tableData[i].StockNum +
                  this.DataByPos.tableData[i].ZtNum
              }
              this.DataByPos.total = res.data.TotalCount
              break
            case 'ByWar':
              this.DataByWar.tableData = res.data.Results
              for (var i = 0; i < this.DataByWar.tableData.length; i++) {
                this.DataByWar.tableData[i].SumNum =
                  this.DataByWar.tableData[i].StockNum +
                  this.DataByWar.tableData[i].ZtNum
              }
              this.DataByWar.total = res.data.TotalCount
              break
            case 'ByPro':
              this.DataByPro.tableData = res.data.Results
              for (var i = 0; i < this.DataByPro.tableData.length; i++) {
                this.DataByPro.tableData[i].SumNum =
                  this.DataByPro.tableData[i].StockNum +
                  this.DataByPro.tableData[i].ZtNum
              }
              this.DataByPro.total = res.data.TotalCount
              break
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    eventPageSizeChange(pagesize, type) {
      switch (type) {
        case 'ByPos':
          this.DataByPos.pageSize = pagesize
          break
        case 'ByWar':
          this.DataByWar.pageSize = pagesize
          break
        case 'ByPro':
          this.DataByPro.pageSize = pagesize
          break
      }
      this.funcGetTableData(
        type,
        this.searchForm.warehouseCode,
        this.searchForm.positionCode,
        this.searchForm.matTypeID,
        this.searchForm.productCode,
        this.searchForm.stockNum,
        this.searchForm.InTime,
        1,
        pagesize
      )
    },
    eventPageChange(page, type) {
      var pagesize = 15
      switch (type) {
        case 'ByPos':
          this.DataByPos.page = page
          pagesize = this.DataByPos.pageSize
          break
        case 'ByWar':
          this.DataByWar.page = page
          pagesize = this.DataByWar.pageSize
          break
        case 'ByPro':
          this.DataByPro.page = page
          pagesize = this.DataByPro.pageSize
          break
      }
      this.funcGetTableData(
        type,
        this.searchForm.warehouseCode,
        this.searchForm.positionCode,
        this.searchForm.matTypeID,
        this.searchForm.productCode,
        this.searchForm.stockNum,
        this.searchForm.InTime,
        page,
        pagesize
      )
    },
    eventSearch() {
      this.funcGetTableData(
        'ByPos',
        this.searchForm.warehouseCode,
        this.searchForm.positionCode,
        this.searchForm.matTypeID,
        this.searchForm.productCode,
        this.searchForm.stockNum,
        this.searchForm.InTime,
        1,
        this.DataByPos.pageSize
      )
      this.funcGetTableData(
        'ByWar',
        this.searchForm.warehouseCode,
        this.searchForm.positionCode,
        this.searchForm.matTypeID,
        this.searchForm.productCode,
        this.searchForm.stockNum,
        this.searchForm.InTime,
        1,
        this.DataByWar.pageSize
      )
      this.funcGetTableData(
        'ByPro',
        this.searchForm.warehouseCode,
        this.searchForm.positionCode,
        this.searchForm.matTypeID,
        this.searchForm.productCode,
        this.searchForm.stockNum,
        this.searchForm.InTime,
        1,
        this.DataByPro.pageSize
      )
    },
    // 联机选择器
    onCascaderChange(value) {
      this.searchForm.matTypeID = []
      value.forEach((v) => {
        this.searchForm.matTypeID.push(v[v.length - 1])
      })
    },
    //重置按钮
    eventReset() {
      this.cascaderValue = []
      this.searchForm = {
        companyCode: '',
        warehouseCode: '',
        positionCode: '',
        matTypeID: [],
        productCode: '',
        stockNum: '0',
        InTime: '',
        startTime: '',
        endTime: '',
      }
    },
    //导出
    eventExport() {
      var startData = ''
      var endDate = ''
      if (this.searchForm.InTime) {
        this.searchForm.InTime[0] = func.formatTimeToStr(
          this.searchForm.InTime[0],
          'yyyy-MM-dd'
        )
        this.searchForm.InTime[1] = func.formatTimeToStr(
          this.searchForm.InTime[1],
          'yyyy-MM-dd'
        )
        startData = this.searchForm.InTime[0]
        endDate = this.searchForm.InTime[1]
      }
      // if (
      //   typeof this.searchForm.matTypeID != 'string' &&
      //   this.searchForm.matTypeID != null
      // ) {
      //   var length = this.searchForm.matTypeID.length - 1
      //   this.searchForm.matTypeID = this.searchForm.matTypeID[length]
      // } else if (this.searchForm.matTypeID == null) {
      //   this.searchForm.matTypeID = ''
      // }

      var url_1 =
        stock.StockManagement.StoreProductExport +
        '?warehouseCode=' +
        this.searchForm.warehouseCode +
        '&positionCode=' +
        this.searchForm.positionCode +
        '&productCode=' +
        this.searchForm.productCode +
        '&stockNum=' +
        this.searchForm.stockNum +
        '&startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&shopInfo=' +
        this.searchForm.companyCode +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType')
      this.$axios
        .post(url_1, this.searchForm.matTypeID)
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
    this.funcGetCompany()
    this.funcGetMatType() //获取商品类别
    // this.funcGetTableData('ByPos', this.searchForm.warehouseCode, this.searchForm.positionCode, this.searchForm.matTypeID, this.searchForm.productCode, this.searchForm.stockNum, this.searchForm.InTime, 1, this.DataByPos.pageSize); //库存查询-按仓位排序
    // this.funcGetTableData('ByWar', this.searchForm.warehouseCode, this.searchForm.positionCode, this.searchForm.matTypeID, this.searchForm.productCode, this.searchForm.stockNum, this.searchForm.InTime, 1, this.DataByWar.pageSize); //库存查询-按仓库排序
    // this.funcGetTableData('ByPro', this.searchForm.warehouseCode, this.searchForm.positionCode, this.searchForm.matTypeID, this.searchForm.productCode, this.searchForm.stockNum, this.searchForm.InTime, 1, this.DataByPro.pageSize); //库存查询-按商品排序
    var AllPromossions = JSON.parse(localStorage.getItem('permissions'))
    this.permissionsList = AllPromossions.find(function (item) {
      return item.ModuleUrl == 'StockResearch'
    }).Rights
  },
  watch: {
    'searchForm.warehouseCode'(newVal, oldVal) {
      this.searchForm.positionCode = ''
      this.funcGetWhOrPositionInfo(this.searchForm.companyCode, newVal, 2) //获取仓位列表
    },
    'searchForm.companyCode'(newVal, oldVal) {
      //this.searchForm.matTypeID = "";
      //this.MainCategoryTree = [];
      this.searchForm.warehouseCode = ''
      this.WarehouseList = []
      this.searchForm.positionCode = ''
      this.PositionList = []
      if (newVal != '') {
        this.funcGetWhOrPositionInfo(newVal, '', 1) //获取仓库列表
      }
    },
  },
}
