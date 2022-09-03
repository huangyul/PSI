import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import stock from '../../../api/stockApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import RangeDate from '../../../components/rangeDate.vue'
export default {
  name: 'InventoryAdjustment',
  components: {
    RangeDate,
  },
  data() {
    return {
      permissionsList: '',
      isShowPosition: '',
      username: '',
      addDate: '',
      searchForm: {
        Code: '',
        warehouseCode: '',
        positionCode: '',
        shop: '',
        productInfo: '',
        date: [new Date(), new Date()],
        startTime: new Date(),
        endTime: new Date(),
      },
      tableData: [],
      dialogVisible: false,
      addForm: {
        Code: '',
        shop: '',
        InDate: '',
        Creater: '',
        Details: [],
      },
      productTableData: [],
      productSearchForm: {
        productInfo: '',
        warehouseCode: '',
        positionCode: '',
        matTypeId: '',
      },
      tableDeteleData: '',
      productTableDeteleData: '',
      page: 1,
      pageSize: 15,
      total: 0,
      nested_page: 1,
      nested_pageSize: 15,
      nested_total: 0,
      dialogVisibleProduct: false,
      CategoryTree: [],
      shopList: [],
      warehouseList: [],
      positionList: [],
      productWarehouseList: [],
      producPositionList: [],
      supplierIsdisabled: false,
    }
  },
  methods: {
    funcGetTableData(
      inCode,
      warehouseCode,
      positionCode,
      productCode,
      inDateStart,
      inDateEnd,
      shopInfo,
      shopCode,
      userType,
      page,
      pageSize
    ) {
      var url =
        stock.InventoryAdjustment.query +
        '?inCode=' +
        inCode +
        '&warehouseCode=' +
        warehouseCode +
        '&positionCode=' +
        positionCode +
        '&productCode=' +
        encodeURIComponent(productCode) +
        '&inDateStart=' +
        inDateStart +
        '&inDateEnd=' +
        inDateEnd +
        '&shopInfo=' +
        shopInfo +
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
    //获取商品列表
    funcGetProductTableData(
      whCode,
      positionCode,
      matTypeId,
      productInfo,
      shopInfo,
      shopCode,
      userType,
      page,
      pageSize
    ) {
      var url =
        stock.InventoryAdjustment.queryProduct +
        '?whCode=' +
        whCode +
        '&positionCode=' +
        positionCode +
        '&matTypeId=' +
        matTypeId +
        '&productInfo=' +
        encodeURIComponent(productInfo) +
        '&shopInfo=' +
        shopInfo +
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
          //console.log(res.data.Results);
          this.productTableData = res.data.Results
          this.nested_total = res.data.TotalCount
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
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
          //this.CategoryTree = func.recursiveCategoryTree(res.data.Results);
          var arr = []
          for (var item of func.recursiveCategoryTree(res.data.Results)) {
            if (item.Mat_Type != 'M') {
              arr.push(item)
            }
            // TODO 暂时开发机器类arr.push(item)
          }
          this.CategoryTree = arr
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //获取门店列表
    funcGetShopList(shopCode) {
      var url = basis.GetShopCodeList + '?shopCode=' + shopCode
      this.$axios
        .get(url)
        .then((res) => {
          this.shopList = res.data
          if (this.shopList.length == 1) {
            this.searchForm.shop = this.shopList[0].Code
            this.addForm.shop = this.shopList[0].Code
          }
          this.eventSearch()
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //获取仓库仓位列表
    funcGetWarehouseAndPosition(shopCode, whCode, type, which) {
      var url =
        basis.WhOrPositionInfo + '?shopCode=' + shopCode + '&whCode=' + whCode
      this.$axios
        .get(url)
        .then((res) => {
          if (type == 1 && which == 1) {
            this.warehouseList = res.data
          } else if (type == 2 && which == 1) {
            this.positionList = res.data
          } else if (type == 1 && which == 2) {
            this.productWarehouseList = res.data
          } else if (type == 2 && which == 2) {
            this.producPositionList = res.data
          }
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //生成编号
    funcGetCurrenCode(tableName, matType) {
      var url =
        basis.GeneratedNumber +
        '?tableName=' +
        tableName +
        '&matType=' +
        matType
      this.$axios
        .get(url)
        .then((res) => {
          this.addForm.Code = res.data
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

    funcRowClassName({ row, rowIndex }) {
      for (var item of this.tableDeteleData) {
        if (item == row) {
          return 'rowSelect'
        }
      }
    },

    eventPageSizeChange(val) {
      this.pageSize = val
      this.eventSearch()
    },
    eventPageChange(val) {
      this.page = val
      this.eventSearch()
    },
    eventPageSizeChange_nested(val) {
      this.nested_pageSize = val
      this.eventProductSearch()
    },
    eventPageChange_nested(val) {
      this.nested_page = val
      this.eventProductSearch()
    },
    eventSearch() {
      //console.log(this.searchForm.startTime, this.searchForm.endTime);
      this.funcGetTableData(
        this.searchForm.Code,
        this.searchForm.warehouseCode,
        this.searchForm.positionCode,
        this.searchForm.productInfo,
        this.searchForm.startTime,
        this.searchForm.endTime,
        this.searchForm.shop,
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType'),
        this.page,
        this.pageSize
      )
    },
    eventReset() {
      this.searchForm = {
        Code: '',
        warehouseCode: '',
        positionCode: '',
        shop: '',
        productInfo: '',
        date: null,
        startTime: '',
        endTime: '',
      }
    },
    eventProductSearch() {
      if (!this.productSearchForm.matTypeId) {
        this.productSearchForm.matTypeId = ''
      }
      if (typeof this.productSearchForm.matTypeId != 'string') {
        var length = this.productSearchForm.matTypeId.length - 1
        this.productSearchForm.matTypeId =
          this.productSearchForm.matTypeId[length]
      }
      this.funcGetProductTableData(
        this.productSearchForm.warehouseCode,
        this.productSearchForm.positionCode,
        this.productSearchForm.matTypeId,
        this.productSearchForm.productInfo,
        this.addForm.shop,
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType'),
        this.nested_page,
        this.nested_pageSize
      )
    },
    eventProductReset() {
      this.productSearchForm = {
        productInfo: '',
        warehouseCode: '',
        positionCode: '',
        matTypeId: '',
      }
    },

    eventProductTableSelect(val) {
      this.productTableDeteleData = val
    },
    eventOpenWindow() {
      this.addForm = {
        Code: '',
        shop: '',
        InDate: '',
        Creater: '',
        Details: [],
      }
      this.funcGetDate()
      this.addForm.Creater = localStorage.getItem('ms_username')
      var myDate = new Date()
      this.addForm.InDate = func.formatTimeToStr(myDate, 'yyyy-MM-dd')
      this.funcGetCurrenCode('PSI_Store_Checkin', '')
      this.supplierIsdisabled = false
      this.dialogVisible = true
    },
    eventSaveWindow() {
      if (this.addForm.Details.length == 0) {
        this.$message({
          message: '商品不能为空',
          type: 'warning',
        })
        return
      }
      for (var item of this.addForm.Details) {
        if (item.CheckinNum == 0 || item.CheckinNum == undefined) {
          this.$message({
            message: '调整数量要大于0',
            type: 'warning',
          })
          return
        }
      }
      var params = JSON.parse(JSON.stringify(this.addForm))
      var thisShopCode = params.shop
      delete params.shop
      //console.log(params);return;
      const loading = func.backgroundLoading('Loading')
      var url = stock.InventoryAdjustment.save + '?shopCode=' + thisShopCode
      this.$axios
        .post(url, params)
        .then((res) => {
          loading.close()
          ElMessage.success({
            message: '新增成功',
            type: 'success',
          })
          this.dialogVisible = false
          this.eventSearch()
        })
        .catch((err) => {
          loading.close()
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //删除弹窗表格里面的商品
    eventDeleteDetails(index, row) {
      this.addForm.Details.splice(index, 1)
      if (this.addForm.Details.length == 0) {
        this.supplierIsdisabled = false
      }
    },
    //打开增加商品弹窗
    eventOpenProductWindow() {
      if (!this.addForm.shop) {
        this.$message({
          message: '门店为空',
          type: 'warning',
        })
        return
      }
      this.nested_page = 1
      this.nested_pageSize = 15
      this.eventProductReset()
      this.funcGetWarehouseAndPosition(this.addForm.shop, '', 1, 2)
      this.funcGetProductTableData(
        '',
        '',
        '',
        '',
        this.addForm.shop,
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType'),
        this.nested_page,
        this.nested_pageSize
      )
      this.dialogVisibleProduct = true

      //弹窗根据搜索条件数量改变样式
      func.DialogSearchJudge()
    },
    //新增勾选的商品
    eventAddProduct() {
      for (var item of this.productTableDeteleData) {
        var obj = {
          ProductCode: item.ProductCode,
          ProductName: item.ProductName,
          CheckinNum: 0,
          UnitId: item.UnitId,
          UnitName: item.UnitName,
          WarehouseCode: item.WarehouseCode,
          WarehouseName: item.WarehouseName,
          PositionCode: item.PositionCode,
          PositionName: item.PositionName,
          StockNum: item.StockNum,
          Remark: item.Remark,
          ProductId: item.ProductId,
        }
        this.addForm.Details.push(obj)
      }
      this.dialogVisibleProduct = false
      if (this.addForm.Details.length != 0) {
        this.supplierIsdisabled = true
      }
    },
  },
  mounted() {
    func.SearchJudge()
    this.username = localStorage.getItem('ms_username')
    this.isShowPosition = localStorage.getItem('isShowPosition')
    // this.eventSearch();
    this.funcGetCategoryTableData(
      '',
      '',
      localStorage.getItem('shopCode'),
      localStorage.getItem('userType'),
      1,
      100000
    )
    this.funcGetShopList(localStorage.getItem('shopCode'))
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'InventoryAdjustment') {
        this.permissionsList = item.Rights
      }
    }
  },
  watch: {
    'searchForm.shop'(newVal, oldVal) {
      this.searchForm.warehouseCode = ''
      this.warehouseList = []
      if (newVal) {
        this.funcGetWarehouseAndPosition(newVal, '', 1, 1)
      }
    },
    'searchForm.warehouseCode'(newVal, oldVal) {
      this.searchForm.positionCode = ''
      this.positionList = []
      if (newVal) {
        this.funcGetWarehouseAndPosition(
          localStorage.getItem('shopCode'),
          newVal,
          2,
          1
        )
      }
    },
    'productSearchForm.warehouseCode'(newVal, oldVal) {
      this.productSearchForm.positionCode = ''
      this.producPositionList = []
      if (newVal) {
        this.funcGetWarehouseAndPosition(this.addForm.shop, newVal, 2, 2)
      }
    },
  },
}
