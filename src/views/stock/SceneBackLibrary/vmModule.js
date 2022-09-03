import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import stock from '../../../api/stockApi.js'
import func from '../../func.js'
import RangeDate from '../../../components/rangeDate.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  components: { RangeDate },
  name: 'SceneBackLibrary',
  data() {
    return {
      permissionsList: '',
      isShowPosition: '',
      username: '',
      addDate: '',
      searchForm: {
        product: '',
        device: '',
        assetNum: '',
        noseNum: '',
        shopInfo: '',
        date: [new Date(), new Date()],
        startTime: new Date(),
        endTime: new Date(),
      },
      tableData: [],
      dialogVisible: false,
      addForm: {
        Code: '',
        ShopCode: '',
        ShopName: '',
        machine: '',
        AssetNum: '',
        InDate: '',
        Creater: '',
        Remark: '',
        Details: [],
      },
      productTableData: [],
      productSearchForm: {
        productInfo: '',
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
      machineList: [],
      assetsList: [],
      warehouseList: [],
      positionList: [],
      supplierIsdisabled: false,
    }
  },
  methods: {
    funcGetTableData(
      product,
      device,
      assetNum,
      noseNum,
      startTime,
      endTime,
      shopInfo,
      shopCode,
      page,
      pageSize
    ) {
      var url =
        stock.SceneBackLibrary.query +
        '?product=' +
        encodeURIComponent(product) +
        '&device=' +
        device +
        '&assetNum=' +
        assetNum +
        '&noseNum=' +
        noseNum +
        '&startTime=' +
        startTime +
        '&endTime=' +
        endTime +
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
    //获取商品列表
    funcGetProductTableData(
      categoryId,
      product,
      assetNum,
      shopCode,
      page,
      pageSize
    ) {
      var arr = []
      for (var item of this.addForm.Details) {
        var obj = {
          CheckinMIdList: item.ProductId,
        }
        arr.push(obj)
      }
      var url =
        stock.SceneBackLibrary.queryProduct +
        '?categoryId=' +
        categoryId +
        '&product=' +
        product +
        '&assetNum=' +
        assetNum +
        '&shopCode=' +
        shopCode +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .post(url, arr)
        .then((res) => {
          this.productTableData = res.data.Results
          this.nested_total = res.data.TotalCount
          //console.log(res.data.Results);
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
          this.CategoryTree = []
          var arr = []
          arr = func.recursiveCategoryTree(res.data.Results)
          for (var item of arr) {
            if (item.Mat_Type == 'K') {
              this.CategoryTree.push(item)
            }
          }
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
            this.searchForm.shopInfo = this.shopList[0].Code
            this.addForm.ShopCode = this.shopList[0].Code
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
    //获取机器列表
    funcGetMachineList(shopCode) {
      var url = basis.GetMachineNameList + '?shopCode=' + shopCode
      this.$axios
        .get(url)
        .then((res) => {
          this.machineList = res.data
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //获取资产编号列表
    funcGetAssetsList(shopCode, deviceCode) {
      var url =
        basis.GetMachineAssetNumList +
        '?shopCode=' +
        shopCode +
        '&deviceCode=' +
        deviceCode
      this.$axios
        .get(url)
        .then((res) => {
          this.assetsList = res.data
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //获取仓库仓位列表
    funcGetWarehouseAndPosition(shopCode, whCode, type, callback) {
      var url =
        basis.WhOrPositionInfo + '?shopCode=' + shopCode + '&whCode=' + whCode
      this.$axios
        .get(url)
        .then((res) => {
          if (type == 1) {
            this.warehouseList = res.data
          } else if (type == 2) {
            this.positionList = res.data
            callback(res.data)
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
        this.searchForm.product,
        this.searchForm.device,
        this.searchForm.assetNum,
        this.searchForm.noseNum,
        this.searchForm.startTime,
        this.searchForm.endTime,
        this.searchForm.shopInfo,
        localStorage.getItem('shopCode'),
        this.page,
        this.pageSize
      )
    },
    eventReset() {
      this.searchForm = {
        product: '',
        device: '',
        assetNum: '',
        noseNum: '',
        shopInfo: '',
        date: null,
        startTime: new Date(),
        endTime: new Date(),
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
        this.productSearchForm.matTypeId,
        this.productSearchForm.productInfo,
        this.addForm.AssetNum,
        this.addForm.ShopCode,
        this.nested_page,
        this.nested_pageSize
      )
    },
    eventProductReset() {
      this.productSearchForm = {
        productInfo: '',
        matTypeId: '',
      }
    },

    eventProductTableSelect(val) {
      this.productTableDeteleData = val
    },
    eventOpenWindow() {
      this.addForm = {
        Code: '',
        ShopCode: '',
        ShopName: '',
        machine: '',
        AssetNum: '',
        InDate: '',
        Creater: '',
        Remark: '',
        DeviceName: '',
        Details: [],
      }
      this.funcGetDate()
      this.addForm.Creater = localStorage.getItem('ms_username')
      this.funcGetCurrenCode('PSI_Store_Checkin', '')
      this.supplierIsdisabled = false
      this.dialogVisible = true
    },
    eventSaveWindow() {
      if (this.addForm.Details == 0) {
        this.$message({
          message: '商品不能为空',
          type: 'warning',
        })
        return
      }
      var params = JSON.parse(JSON.stringify(this.addForm))
      for (var item of this.shopList) {
        if (item.Code == params.ShopCode) {
          params.ShopName = item.Name
        }
      }
      for (var item of this.machineList) {
        if (this.addForm.machine == item.DeviceCode)
          params.DeviceName = item.DeviceName
      }
      delete params.machine
      for (var i of params.Details) {
        if (!i.CheckinNum || i.CheckinNum == 0) {
          this.$message({
            message: '回库数量不能为零或空',
            type: 'warning',
          })
          return
        }
        if (i.CheckinNum > i.OutNum) {
          this.$message({
            message: '回库数量不能大于净出库数量',
            type: 'warning',
          })
          return
        }
        if (!i.WarehouseCode) {
          this.$message({
            message: '回库仓库不能为空',
            type: 'warning',
          })
          return
        }

        if (!i.PositionCode && this.isShowPosition == '1') {
          this.$message({
            message: '回库仓位不能为空',
            type: 'warning',
          })
          return
        }
        delete i.positionList
      }
      var thisDate = new Date()
      params.InDate = func.formatTimeToStr(thisDate, 'yyyy-MM-dd')

      const loading = func.backgroundLoading('Loading')
      var url = stock.SceneBackLibrary.save
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
      if (!this.addForm.AssetNum) {
        this.$message({
          message: '资产编号为空',
          type: 'warning',
        })
        return
      }
      this.nested_page = 1
      this.nested_pageSize = 15
      this.eventProductReset()
      this.funcGetProductTableData(
        '',
        '',
        this.addForm.AssetNum,
        this.addForm.ShopCode,
        this.nested_page,
        this.nested_pageSize
      )
      this.dialogVisibleProduct = true

      //弹窗根据搜索条件数量改变样式
      func.DialogSearchJudge()
    },
    //更改表格中的仓库
    eventChangeRowWarehouseCode(val, index, row) {
      for (var item of this.warehouseList) {
        if (item.Code == val) {
          this.addForm.Details[index].WarehouseName = item.Name
        }
      }
      var that = this
      that.addForm.Details[index].PositionCode = ''
      if (val) {
        this.funcGetWarehouseAndPosition(
          this.addForm.ShopCode,
          val,
          2,
          function (data) {
            that.addForm.Details[index].positionList = that.positionList
          }
        )
      } else {
        that.addForm.Details[index].positionList = []
      }
    },
    //更改表格中的仓位
    eventChangeRowPositionCode(val, index, row) {
      for (var item of this.positionList) {
        if (item.Code == val) {
          this.addForm.Details[index].PositionName = item.Name
        }
      }
    },
    //新增勾选的商品
    eventAddProduct() {
      var that = this
      var length = this.addForm.Details.length + 1
      //解决for循环异步问题，for循环先循环完异步接口才完成，用$.each代替
      $.each(this.productTableDeteleData, function (index, value) {
        that.funcGetWarehouseAndPosition(
          that.addForm.ShopCode,
          value.WarehouseCode,
          2,
          function (data) {
            var obj = {
              OddNum: value.OddNum,
              IndexNo: length,
              ProductCode: value.ProductCode,
              ProductName: value.ProductName,
              OutNum: value.OutNum,
              //"CheckinNum": value.CheckinNum,
              CheckinNum: 0,
              UnitId: value.UnitId,
              UnitName: value.UnitName,
              WarehouseCode: value.WarehouseCode,
              WarehouseName: value.WarehouseName,
              PositionCode: value.PositionCode,
              PositionName: value.PositionName,
              CategoryId: value.CategoryId,
              NoseNum: value.NoseNum,
              Remark: '',
              positionList: data,
              ProductId: value.ProductId,
              NoseNum: value.NoseNum,
              Money: value.Money,
            }
            that.addForm.Details.push(obj)
            length = length + 1
            if (that.addForm.Details.length != 0) {
              that.supplierIsdisabled = true
            }
          }
        )
      })

      // for (var item of this.productTableDeteleData) {
      //     this.funcGetWarehouseAndPosition(localStorage.getItem("shopCode"), item.WarehouseCode, 2, function (data) {
      //       var obj = {
      //             "OddNum": item.OddNum,
      //             "IndexNo": length,
      //             "ProductCode": item.ProductCode,
      //             "ProductName": item.ProductName,
      //             "OutNum": item.OutNum,
      //             "CheckinNum": item.CheckinNum,
      //             "UnitId": item.UnitId,
      //             "UnitName": item.UnitName,
      //             "WarehouseCode": item.WarehouseCode,
      //             "WarehouseName": item.WarehouseName,
      //             "PositionCode": item.PositionCode,
      //             "PositionName": item.PositionName,
      //             "CategoryId": item.CategoryId,
      //             "NoseNum": item.NoseNum,
      //             "Remark": "",
      //             "positionList": that.positionList,
      // "ProductId":item.ProductId,
      //         }
      //         that.addForm.Details.push(obj);
      //         length = length + 1;
      //     });
      // }
      this.dialogVisibleProduct = false
      // if (this.addForm.Details.length != 0) {
      //     this.supplierIsdisabled = true;
      // }
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
    //this.funcGetWarehouseAndPosition(localStorage.getItem("shopCode"), '', 1);
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'SceneBackLibrary') {
        this.permissionsList = item.Rights
      }
    }
  },
  watch: {
    'addForm.ShopCode'(newVal, oldVal) {
      this.warehouseList = []
      for (var item of this.addForm.Details) {
        item.WarehouseCode = ''
      }
      this.addForm.machine = ''
      this.machineList = []
      if (newVal) {
        this.funcGetMachineList(newVal)
        this.funcGetWarehouseAndPosition(newVal, '', 1)
      }
    },
    'addForm.machine'(newVal, oldVal) {
      this.addForm.AssetNum = ''
      this.assetsList = []
      if (newVal) {
        this.funcGetAssetsList(this.addForm.ShopCode, newVal)
      }
    },
  },
}
