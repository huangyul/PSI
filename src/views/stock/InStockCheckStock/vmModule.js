import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import stock from '../../../api/stockApi.js'
import func from '../../func.js'
import { getLodop } from '../../LodopFuncs.js'
import RangeDate from '../../../components/rangeDate.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  name: 'InStockCheckStock',
  components: { RangeDate },
  data() {
    return {
      permissionsList: '',
      isLimitInventoryDate: false,
      InventoryStartDate: '',
      InventoryEndDate: '',
      isShowPosition: '',
      username: '',
      addDate: '',
      searchForm: {
        date: [
          new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        ],
        shop: '',
        warehouseCode: '',
        startTime: '',
        endTime: '',
      },
      takeStockDate: [
        new Date(new Date().getFullYear(), new Date().getMonth() - 1, 26),
        new Date(new Date().getFullYear(), new Date().getMonth(), 25),
      ],
      tableData: [],
      PositionTableData: [],
      DisplayTableData: [],
      GetViewTableData: [],
      dialogVisible: false,
      addForm: {
        WarehouseCode: '',
        WarehouseName: '',
        Status: 0,
        PositionCode: '',
        PositionName: '',
        operationType: '',
        category: 2,
        zero: false,
      },
      productSearchForm: {
        productInfo: '',
        matTypeId: '',
        differences: -1,
      },
      tableDeteleData: '',
      productTableDeteleData: '',
      OpenWindowTitle: '',
      page: 1,
      pageSize: 15,
      total: 0,
      dialogVisibleProduct: false,
      supplierList: [],
      warehouseList: [],
      positionList: [],
      CategoryTree: [],
      shopList: [],
      supplierIsdisabled: false,
      isCheck: false,
      positionDialogTitle: '盘点-选择仓位',
      positionDialogWidth: '1300px',
      checkStockStatus: 1,
      isLoading: false,
    }
  },
  methods: {
    //盘库-仓库列表
    funcGetTableData(whCode, startTime, endTime, shopInfo, shopCode, userType) {
      for (var item of JSON.parse(localStorage.getItem('permissions'))) {
        if (item.ModuleUrl == 'InStockCheckStock') {
          this.permissionsList = item.Rights
        }
      }
      var url =
        stock.InStockCheckStock.GetWarehouse +
        '?whCode=' +
        whCode +
        '&startTime=' +
        startTime +
        '&endTime=' +
        endTime +
        '&shopInfo=' +
        shopInfo +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType
      this.$axios
        .get(url)
        .then((res) => {
          this.tableData = res.data
          for (var item of this.tableData) {
            item.Operations = item.Operations.split(',')
            var arr = []
            var name = ''
            var isShow = false
            for (var i of item.Operations) {
              isShow = false
              if (i == 1 && this.permissionsList.Edit) {
                name = '开始盘点'
                isShow = true
              }
              if (i == 2 && this.permissionsList.Edit) {
                name = '编辑'
                isShow = true
              }
              if (i == 3 && this.permissionsList.Delete) {
                name = '删除'
                isShow = true
              }
              if (i == 4 && this.permissionsList.InventorySubmission) {
                name = '盘库提交'
                isShow = true
              }
              if (i == 5 && this.permissionsList.Edit) {
                name = '查看'
                isShow = true
              }
              if (
                i == 6 &&
                this.permissionsList.Edit &&
                localStorage.getItem('isTakeTime') == '1'
              ) {
                name = '撤销提交'
                isShow = true
              }
              var obj = {
                type: i,
                name: name,
                isShow: isShow,
              }
              arr.push(obj)
            }
            item.Operations = arr
          }
          //console.log(this.tableData);
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
          this.tableData = []
        })
    },
    //盘库-仓位列表
    funcGetPositionTableData(whCode, startTime, endTime, shopCode, userType) {
      for (var item of JSON.parse(localStorage.getItem('permissions'))) {
        if (item.ModuleUrl == 'InStockCheckStock') {
          this.permissionsList = item.Rights
        }
      }
      var url =
        stock.InStockCheckStock.GetPosition +
        '?whCode=' +
        whCode +
        '&startTime=' +
        startTime +
        '&endTime=' +
        endTime +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType
      this.$axios
        .get(url)
        .then((res) => {
          this.PositionTableData = res.data
          for (var item of this.PositionTableData) {
            item.Operations = item.Operations.split(',')
            var arr = []
            var name = ''
            var isShow = false
            for (var i of item.Operations) {
              isShow = false
              if (i == 1 && this.permissionsList.Edit) {
                name = '开始盘点'
                isShow = true
              }
              if (i == 2 && this.permissionsList.Edit) {
                name = '编辑'
                isShow = true
              }
              if (i == 3 && this.permissionsList.Delete) {
                name = '删除'
                isShow = true
              }
              if (i == 4 && this.permissionsList.InventorySubmission) {
                name = '盘库提交'
                isShow = true
              }
              if (i == 5 && this.permissionsList.Edit) {
                name = '查看'
                isShow = true
              }
              if (
                i == 6 &&
                this.permissionsList.Edit &&
                localStorage.getItem('isTakeTime') == '1'
              ) {
                name = '撤销提交'
                isShow = true
              }
              var obj = {
                type: i,
                name: name,
                isShow: isShow,
              }
              arr.push(obj)
            }
            item.Operations = arr
          }
          //console.log(this.PositionTableData);
          //this.total = res.data.TotalCount;
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //盘库-录入数据列表
    funcGetDisplayTableData(
      isInv,
      startDay,
      endDay,
      operationType,
      userName,
      whCode,
      startTime,
      endTime,
      positionCode,
      productInfo,
      matTypeId,
      shopCode,
      userType,
      page,
      pageSize
    ) {
      var url =
        stock.InStockCheckStock.GetDisplay +
        '?isInv=' +
        isInv +
        '&startDay=' +
        startDay +
        '&endDay=' +
        endDay +
        '&operationType=' +
        operationType +
        '&userName=' +
        userName +
        '&whCode=' +
        whCode +
        '&startTime=' +
        startTime +
        '&endTime=' +
        endTime +
        '&positionCode=' +
        positionCode +
        '&productInfo=' +
        productInfo +
        '&matTypeId=' +
        matTypeId +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType +
        '&isShowZero=' +
        this.addForm.zero +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .get(url)
        .then((res) => {
          this.DisplayTableData = res.data.Results
          //console.log(this.DisplayTableData);
          //this.total = res.data.TotalCount;
          for (var item of this.DisplayTableData) {
            if (!item.TrueNum) {
              if (item.BussinessType != 'M') {
                item.TrueNum = 0
              }
            }
            if (this.checkStockStatus == 1) {
              if (item.BussinessType != 'M') {
                item.TrueNum = undefined
              }
            }
          }
          this.dialogVisibleProduct = true
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //盘库-盘库提交
    funcCommit(userName, whCode, positionCode, startTime, endTime) {
      const loading = func.backgroundLoading('Loading')
      var url =
        stock.InStockCheckStock.Commit +
        '?userName=' +
        userName +
        '&whCode=' +
        whCode +
        '&positionCode=' +
        positionCode +
        '&startTime=' +
        startTime +
        '&endTime=' +
        endTime +
        '&inventoryType=' +
        this.addForm.category
      this.$axios
        .put(url)
        .then((res) => {
          ElMessage.success({
            message: '提交成功',
            type: 'success',
          })
          if (this.isShowPosition == '0') {
            this.eventSearch()
          } else {
            this.funcGetPositionTableData(
              this.addForm.WarehouseCode,
              this.searchForm.startTime,
              this.searchForm.endTime,
              localStorage.getItem('shopCode'),
              localStorage.getItem('userType')
            )
          }
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
        .finally(() => {
          loading.close()
        })
    },
    //盘库-查看盘库数据
    funcGetViewTableData(
      whCode,
      startTime,
      endTime,
      positionCode,
      productInfo,
      shopCode,
      userType,
      matTypeId,
      isDiff,
      page,
      pageSize
    ) {
      var url =
        stock.InStockCheckStock.GetView +
        '?whCode=' +
        whCode +
        '&startTime=' +
        startTime +
        '&endTime=' +
        endTime +
        '&positionCode=' +
        positionCode +
        '&productInfo=' +
        productInfo +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType +
        '&matTypeId=' +
        matTypeId +
        '&isDiff=' +
        isDiff +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .get(url)
        .then((res) => {
          this.GetViewTableData = res.data.Results
          //console.log(this.GetViewTableData);
          //this.total = res.data.TotalCount;
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

    //获取门店列表
    funcGetShopList(shopCode) {
      var url = basis.GetShopCodeList + '?shopCode=' + shopCode
      this.$axios
        .get(url)
        .then((res) => {
          this.shopList = res.data
          if (this.shopList.length == 1) {
            this.searchForm.shop = this.shopList[0].Code
          }
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
    //删除
    funcDetele(whCode, positionCode, startTime, endTime) {
      const loading = func.backgroundLoading('Loading')
      var url =
        stock.InStockCheckStock.Delete +
        '?whCode=' +
        whCode +
        '&positionCode=' +
        positionCode +
        '&startTime=' +
        startTime +
        '&endTime=' +
        endTime
      this.$axios
        .delete(url)
        .then((res) => {
          ElMessage.success({
            message: '删除成功',
            type: 'success',
          })
          if (this.isShowPosition == '0') {
            this.eventSearch()
          } else {
            this.funcGetPositionTableData(
              this.addForm.WarehouseCode,
              this.searchForm.startTime,
              this.searchForm.endTime,
              localStorage.getItem('shopCode'),
              localStorage.getItem('userType')
            )
          }
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
        .finally(() => {
          loading.close()
        })
    },
    //撤销提交
    funcUndo(whCode, positionCode, startTime, endTime) {
      const loading = func.backgroundLoading('Loading')
      var url =
        stock.InStockCheckStock.Undo +
        '?userName=' +
        localStorage.getItem('ms_username') +
        '&whCode=' +
        whCode +
        '&positionCode=' +
        positionCode +
        '&startTime=' +
        startTime +
        '&endTime=' +
        endTime
      this.$axios
        .post(url)
        .then((res) => {
          ElMessage.success({
            message: '撤销成功',
            type: 'success',
          })
          if (this.isShowPosition == '0') {
            this.eventSearch()
          } else {
            this.funcGetPositionTableData(
              this.addForm.WarehouseCode,
              this.searchForm.startTime,
              this.searchForm.endTime,
              localStorage.getItem('shopCode'),
              localStorage.getItem('userType')
            )
          }
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
        .finally(() => {
          loading.close()
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
    eventPageSizeChange(val) {
      this.pageSize = val
      this.eventSearch()
    },
    eventPageChange(val) {
      this.page = val
      this.eventSearch()
    },
    eventSearch() {
      if (!this.searchForm.startTime || !this.searchForm.endTime) {
        this.$message({
          message: '需要先选择盘库日期才显示数据',
          type: 'warning',
        })
        return
      }
      this.funcGetTableData(
        this.searchForm.warehouseCode,
        this.searchForm.startTime,
        this.searchForm.endTime,
        this.searchForm.shop,
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType')
      )
    },
    eventReset() {
      this.searchForm.shop = ''
      this.searchForm.warehouseCode = ''
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
      if (!this.isCheck) {
        this.funcGetDisplayTableData(
          this.isLimitInventoryDate,
          this.InventoryStartDate,
          this.InventoryEndDate,
          this.addForm.operationType,
          localStorage.getItem('ms_username'),
          this.addForm.WarehouseCode,
          this.searchForm.startTime,
          this.searchForm.endTime,
          this.addForm.PositionCode,
          this.productSearchForm.productInfo,
          this.productSearchForm.matTypeId,
          localStorage.getItem('shopCode'),
          localStorage.getItem('userType'),
          1,
          10000
        )
      } else {
        this.funcGetViewTableData(
          this.addForm.WarehouseCode,
          this.searchForm.startTime,
          this.searchForm.endTime,
          this.addForm.PositionCode,
          this.productSearchForm.productInfo,
          localStorage.getItem('shopCode'),
          localStorage.getItem('userType'),
          this.productSearchForm.matTypeId,
          this.productSearchForm.differences,
          1,
          1000
        )
      }
    },
    eventProductReset() {
      this.productSearchForm = {
        productInfo: '',
        matTypeId: '',
        differences: -1,
      }
    },
    eventTableSelect(val) {
      this.tableDeteleData = val
    },
    eventOpenWindow(index, row, type) {
      this.funcGetDate()
      //console.log(row);return;
      this.addForm.WarehouseCode = row.WarehouseCode
      this.addForm.WarehouseName = row.WarehouseName
      this.addForm.zero = row.IsShowZero
      //this.addForm.category = row.InventoryType;
      this.addForm.Status = row.Status
      if (this.isShowPosition == '1') {
        this.positionDialogTitle = '盘点-选择仓位'
        this.positionDialogWidth = '1300px'
        this.dialogVisible = true
        //console.log(index,row,type);return;
        this.funcGetPositionTableData(
          this.addForm.WarehouseCode,
          this.searchForm.startTime,
          this.searchForm.endTime,
          localStorage.getItem('shopCode'),
          localStorage.getItem('userType')
        )
      } else if (this.isShowPosition == '0') {
        this.positionDialogTitle = '盘点-' + this.addForm.WarehouseName
        this.positionDialogWidth = '700px'
        this.addForm.operationType = parseInt(type)
        this.checkStockStatus = parseInt(type)
        if (type == 4) {
          this.funcCommit(
            localStorage.getItem('ms_username'),
            this.addForm.WarehouseCode,
            this.addForm.PositionCode,
            this.searchForm.startTime,
            this.searchForm.endTime
          )
          return
        }
        if (type == 5) {
          this.OpenWindowTitle = '盘点-查看'
          this.isCheck = true
          this.funcGetViewTableData(
            this.addForm.WarehouseCode,
            this.searchForm.startTime,
            this.searchForm.endTime,
            this.addForm.PositionCode,
            '',
            localStorage.getItem('shopCode'),
            localStorage.getItem('userType'),
            '',
            -1,
            1,
            1000
          )
          this.dialogVisibleProduct = true
          return
        }
        //console.log(row);return;
        if (type == 1 || type == 2) {
          if (type == 1) {
            this.dialogVisible = true
            return
          }
          this.OpenWindowTitle = '盘点-录入数据'
          this.isCheck = false
          this.funcGetDisplayTableData(
            this.isLimitInventoryDate,
            this.InventoryStartDate,
            this.InventoryEndDate,
            this.addForm.operationType,
            localStorage.getItem('ms_username'),
            this.addForm.WarehouseCode,
            this.searchForm.startTime,
            this.searchForm.endTime,
            this.addForm.PositionCode,
            '',
            '',
            localStorage.getItem('shopCode'),
            localStorage.getItem('userType'),
            1,
            10000
          )
          //this.dialogVisibleProduct = true;
          return
        }
        if (type == 3) {
          this.funcDetele(
            this.addForm.WarehouseCode,
            this.addForm.PositionCode,
            this.searchForm.startTime,
            this.searchForm.endTime
          )
        }
        if (type == 6) {
          this.$confirm('确认要撤销盘库吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              this.funcUndo(
                this.addForm.WarehouseCode,
                this.addForm.PositionCode,
                this.searchForm.startTime,
                this.searchForm.endTime
              )
            })
            .catch(() => {})
        }
      }
    },
    eventFirstOpenWindow() {
      this.OpenWindowTitle = '盘点-录入数据'
      this.isCheck = false
      this.funcGetDisplayTableData(
        this.isLimitInventoryDate,
        this.InventoryStartDate,
        this.InventoryEndDate,
        this.addForm.operationType,
        localStorage.getItem('ms_username'),
        this.addForm.WarehouseCode,
        this.searchForm.startTime,
        this.searchForm.endTime,
        this.addForm.PositionCode,
        '',
        '',
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType'),
        1,
        10000
      )
    },
    //仓位操作
    eventOpenProductWindow(index, row, type) {
      this.addForm.PositionCode = row.PositionCode
      this.addForm.PositionName = row.PositionName
      this.addForm.operationType = parseInt(type)
      this.checkStockStatus = parseInt(type)
      if (type == 4) {
        this.funcCommit(
          localStorage.getItem('ms_username'),
          this.addForm.WarehouseCode,
          this.addForm.PositionCode,
          this.searchForm.startTime,
          this.searchForm.endTime
        )
        return
      }
      if (type == 5) {
        this.OpenWindowTitle = '盘点-查看'
        this.isCheck = true
        this.funcGetViewTableData(
          this.addForm.WarehouseCode,
          this.searchForm.startTime,
          this.searchForm.endTime,
          this.addForm.PositionCode,
          '',
          localStorage.getItem('shopCode'),
          localStorage.getItem('userType'),
          '',
          -1,
          1,
          1000
        )
        this.dialogVisibleProduct = true
        return
      }
      //console.log(row);return;
      if (type == 1 || type == 2) {
        this.OpenWindowTitle = '盘点-录入数据'
        this.isCheck = false
        this.funcGetDisplayTableData(
          this.isLimitInventoryDate,
          this.InventoryStartDate,
          this.InventoryEndDate,
          this.addForm.operationType,
          localStorage.getItem('ms_username'),
          this.addForm.WarehouseCode,
          this.searchForm.startTime,
          this.searchForm.endTime,
          this.addForm.PositionCode,
          '',
          '',
          localStorage.getItem('shopCode'),
          localStorage.getItem('userType'),
          1,
          10000
        )
        //this.dialogVisibleProduct = true;
        return
      }
      if (type == 3) {
        this.funcDetele(
          this.addForm.WarehouseCode,
          this.addForm.PositionCode,
          this.searchForm.startTime,
          this.searchForm.endTime
        )
      }
      if (type == 6) {
        this.$confirm('确认要撤销盘库吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.funcUndo(
              this.addForm.WarehouseCode,
              this.addForm.PositionCode,
              this.searchForm.startTime,
              this.searchForm.endTime
            )
          })
          .catch(() => {})
      }
    },
    //盘点-录入数据保存
    eventSave() {
      this.isLoading = true
      var params = JSON.parse(JSON.stringify(this.DisplayTableData))
      var arr = []
      for (var item of params) {
        item.InventoryType = this.addForm.category
        item.IsShowZero = this.addForm.zero
        if (this.addForm.zero) {
          item.IsShowZero = 1
        } else {
          item.IsShowZero = 0
        }
        if (this.addForm.category == 1 && item.TrueNum == undefined) {
          item.TrueNum = 0
        }
        if (this.addForm.category == 2 && item.TrueNum != undefined) {
          arr.push(item)
        }
      }
      if (this.addForm.category == 2) {
        params = JSON.parse(JSON.stringify(arr))
      }
      //console.log(params);return;
      const loading = func.backgroundLoading('Loading')
      var url = stock.InStockCheckStock.Save
      this.$axios
        .post(url, params)
        .then((res) => {
          loading.close()
          ElMessage.success({
            message: '保存成功',
            type: 'success',
          })
          if (this.isShowPosition == '1') {
            this.funcGetPositionTableData(
              this.addForm.WarehouseCode,
              this.searchForm.startTime,
              this.searchForm.endTime,
              localStorage.getItem('shopCode'),
              localStorage.getItem('userType')
            )
            this.dialogVisibleProduct = false
          } else if (this.isShowPosition == '0') {
            this.eventSearch()
            this.dialogVisibleProduct = false
            this.dialogVisible = false
          }
        })
        .catch((err) => {
          loading.close()
          this.$message({
            message: err,
            type: 'warning',
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    //导出
    eventExport() {
      if (!this.productSearchForm.matTypeId) {
        this.productSearchForm.matTypeId = ''
      }
      if (typeof this.productSearchForm.matTypeId != 'string') {
        var length = this.productSearchForm.matTypeId.length - 1
        this.productSearchForm.matTypeId =
          this.productSearchForm.matTypeId[length]
      }
      var url =
        stock.InStockCheckStock.Export +
        '?whCode=' +
        this.addForm.WarehouseCode +
        '&startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&positionCode=' +
        this.addForm.PositionCode +
        '&productInfo=' +
        this.productSearchForm.productInfo +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType') +
        '&matTypeId=' +
        this.productSearchForm.matTypeId +
        '&isDiff=' +
        this.productSearchForm.differences

      this.$axios
        .post(url, [])
        .then((res) => {
          if (!res.data.Success) {
            this.$message({
              message: res.data.Msg,
              type: 'warning',
            })
            return
          }
          //文件流
          var url_2 =
            basis.ExportDownload + '?filePath=' + res.data.data + '&delete=1'
          window.location.href = url_2
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })

      // if(localStorage.getItem("isExportEqual") == "yes"){
      // 	//路径下载
      // 	this.$axios.get(url).then(res => {
      // 		window.location.href = './export/' + res.data.data;
      // 	}).catch(err => {
      // 	    this.$message({message: err,type: 'warning'});
      // 	});
      // }else if(localStorage.getItem("isExportEqual") == "no"){
      // 	//文件流
      // 	this.$axios.get(url,{responseType: 'blob'}).then(res => {
      // 		const link = document.createElement('a');
      // 		let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
      // 		link.href = URL.createObjectURL(blob);
      // 		link.download = '盘库数据';
      // 		link.click();
      // 	}).catch(err => {
      // 	    this.$message({message: err,type: 'warning'});
      // 	});
      // }
    },
    //盘点表下载
    eventDownload() {
      if (typeof this.productSearchForm.matTypeId != 'string') {
        var length = this.productSearchForm.matTypeId.length - 1
        this.productSearchForm.matTypeId =
          this.productSearchForm.matTypeId[length]
      }
      var url =
        stock.InStockCheckStock.Download +
        '?isInv=' +
        this.isLimitInventoryDate +
        '&startDay=' +
        this.InventoryStartDate +
        '&endDay=' +
        this.InventoryEndDate +
        '&operationType=' +
        this.addForm.operationType +
        '&userName=' +
        localStorage.getItem('ms_username') +
        '&whCode=' +
        this.addForm.WarehouseCode +
        '&startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&positionCode=' +
        this.addForm.PositionCode +
        '&productInfo=' +
        this.productSearchForm.productInfo +
        '&matTypeId=' +
        this.productSearchForm.matTypeId +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType') +
        '&isShowZero=' +
        this.addForm.zero

      this.$axios
        .post(url, [])
        .then((res) => {
          if (!res.data.Success) {
            this.$message({
              message: res.data.Msg,
              type: 'warning',
            })
            return
          }
          //文件流
          var url_2 =
            basis.ExportDownload + '?filePath=' + res.data.data + '&delete=1'
          window.location.href = url_2
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    eventImport(e, callback) {
      func.importExcel(e, callback)
    },
    eventImportSave(data) {
      //console.log(data);
      if (data.length == 0) {
        this.$message({
          message: '导入数据失败，请检查导入数据是否正确',
          type: 'warning',
        })
        return
      }
      data.splice(0, 1)
      var arr = []
      for (var item of data) {
        //上传字段为字符串,注意把数字转换成字符串
        if (this.isShowPosition == '1') {
          //有仓位
          var obj = {
            ShopCode: item.Cell_0,
            ShopName: item.Cell_1,
            WarehouseCode: item.Cell_2,
            WarehouseName: item.Cell_3,
            PositionCode: item.Cell_4,
            PositionName: item.Cell_5,
            ProductId: item.Cell_6,
            ProductCode: item.Cell_7,
            ProductName: item.Cell_8,
            UnitName: item.Cell_9,
            TrueNum: item.Cell_10.toString(),
            Remark: item.Cell_11,
          }
        } else if (this.isShowPosition == '0') {
          //没仓位
          var obj = {
            ShopCode: item.Cell_0,
            ShopName: item.Cell_1,
            WarehouseCode: item.Cell_2,
            WarehouseName: item.Cell_3,
            PositionCode: '',
            PositionName: '',
            ProductId: item.Cell_4,
            ProductCode: item.Cell_5,
            ProductName: item.Cell_6,
            UnitName: item.Cell_7,
            TrueNum: item.Cell_8.toString(),
            Remark: item.Cell_9,
          }
        }
        arr.push(obj)
      }
      // console.log(arr);
      // return;
      //清空上传文件，不然不能重复上同一个文件
      this.$refs['uploadExcelValue'].value = ''
      var url =
        stock.InStockCheckStock.Import +
        '?startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&userName=' +
        localStorage.getItem('ms_username')
      this.$axios
        .post(url, arr)
        .then((res) => {
          //跟以往不一样，接口成功还得判断功能是否也成功
          if (res.data.Success) {
            ElMessage.success({
              message: '导入成功',
              type: 'success',
            })
          } else {
            this.$message({
              message: res.data.Msg,
              type: 'warning',
            })
            return
          }

          if (this.isShowPosition == '1') {
            this.funcGetPositionTableData(
              this.addForm.WarehouseCode,
              this.searchForm.startTime,
              this.searchForm.endTime,
              localStorage.getItem('shopCode'),
              localStorage.getItem('userType')
            )
            this.dialogVisibleProduct = false
          } else if (this.isShowPosition == '0') {
            this.eventSearch()
            this.dialogVisibleProduct = false
            this.dialogVisible = false
          }
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //打印
    eventPrint(val) {
      var Template =
        'LODOP.SET_PRINT_MODE("PRINT_SETUP_PROGRAM",true);' +
        'LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true);' +
        'LODOP.SET_PRINT_MODE("PROGRAM_CONTENT_BYVAR",true);' +
        'LODOP.ADD_PRINT_TEXT(29,41,720,31,"在库盘库");' +
        'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
        'LODOP.SET_PRINT_STYLEA(0,"FontSize",16);' +
        'LODOP.SET_PRINT_STYLEA(0,"Alignment",2);' +
        'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
        'LODOP.ADD_PRINT_TEXT(90,25,82,25,"盘库信息");' +
        'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
        'LODOP.SET_PRINT_STYLEA(0,"FontSize",13);' +
        'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
        'LODOP.ADD_PRINT_TEXT(125,40,89,23,"仓库编号：");' +
        'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
        'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
        'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
        'LODOP.ADD_PRINT_TEXT(125,111,220,23,WarehouseCodeValue);' +
        'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
        'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
        'LODOP.SET_PRINT_STYLEA(0,"ContentVName","WarehouseCodeValue");' +
        'LODOP.ADD_PRINT_TEXT(125,340,90,23,"盘点仓库：");' +
        'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
        'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
        'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
        'LODOP.ADD_PRINT_TEXT(125,410,220,23,WarehouseNameValue);' +
        'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
        'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
        'LODOP.SET_PRINT_STYLEA(0,"ContentVName","WarehouseNameValue");' +
        'LODOP.ADD_PRINT_TEXT(160,40,90,23,"盘点类别：");' +
        'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
        'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
        'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
        'LODOP.ADD_PRINT_TEXT(160,111,220,23,CategoryValue);' +
        'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
        'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
        'LODOP.SET_PRINT_STYLEA(0,"ContentVName","CategoryValue");' +
        'LODOP.ADD_PRINT_TEXT(195,25,100,25,"商品信息");' +
        'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
        'LODOP.SET_PRINT_STYLEA(0,"FontSize",13);' +
        'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
        'LODOP.ADD_PRINT_HTM(56,652,215,23,Paging);' +
        'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
        'LODOP.SET_PRINT_STYLEA(0,"ContentVName","Paging");' +
        'LODOP.ADD_PRINT_TABLE(230,25,740,910,tableValue);' +
        'LODOP.SET_PRINT_STYLEA(0,"Vorient",3);' +
        'LODOP.SET_PRINT_STYLEA(0,"ContentVName","tableValue");'
      //this.eventGetEvalStr();

      var LODOP = getLodop()
      if (!LODOP) {
        setTimeout(function () {
          ElMessage.warning({
            message: '打印失败，未能识别到C-Lpdop，请检查是否安装好C-Lodop！',
            type: 'warning',
          })
        }, 100)
        return
      }

      LODOP.PRINT_INIT('')
      for (var i = 0; i < 1; i++) {
        var WarehouseCodeValue = this.addForm.WarehouseCode
        var WarehouseNameValue = this.addForm.WarehouseName
        var CategoryValue = ''
        if (this.addForm.category == 1) {
          CategoryValue = '全部盘点'
        } else {
          CategoryValue = '部分盘点'
        }
        var Paging =
          '<div style="display:flex;text-align: center;">第<font tdata="PageNO">##</font>页</span>/共<font tdata="PageCount">##</font></span>页</div>'
        var tbody = ''
        var arrData = JSON.parse(JSON.stringify(this.DisplayTableData))
        for (var item of arrData) {
          if (item.BussinessType != 'M') {
            item.StockNum = '***'
          }
          if (item.TrueNum == undefined) {
            item.TrueNum = ''
          }
        }
        var tableData = arrData
        for (var i = 0; i <= tableData.length - 1; i++) {
          var str =
            '<tr><td style="padding: 5px 10px; text-align: center;">' +
            tableData[i].ProductCode +
            '</td><td style="padding: 5px 10px; text-align: center;">' +
            tableData[i].ProductName +
            '</td><td style="padding: 5px 10px; text-align: center;">' +
            tableData[i].UnitName +
            '</td><td style="padding: 5px 10px; text-align: center;">' +
            tableData[i].StockNum +
            '</td><td style="padding: 5px 10px; text-align: center;">' +
            tableData[i].TrueNum +
            '</td><td style="padding: 5px 10px; text-align: center;">' +
            tableData[i].Remark +
            '</td></tr>'
          tbody = tbody + str
        }
        var tableValue =
          '<table border="1" style="border-collapse:collapse; width:100%; font-size:13px; height:auto;"><thead><tr><th style="padding: 5px 10px;">商品编号</th><th style="padding: 5px 10px;">商品名称</th><th style="padding: 5px 10px;">单位</th><th style="padding: 5px 10px;">应有数量</th><th style="padding: 5px 10px;">实点数量</th><th style="padding: 5px 10px;">备注</th></tr></thead><tbody>' +
          tbody +
          '</tbody></table>'
        console.log(
          WarehouseCodeValue,
          WarehouseNameValue,
          CategoryValue,
          Paging,
          tableValue
        )
        console.clear()
        LODOP.NewPageA()
        eval(Template)
      }
      if (val == 1) {
        //预览
        LODOP.PREVIEW()
        //LODOP.PRINT_DESIGN();
      } else {
        //打印
        LODOP.PRINT()
      }
    },
  },
  mounted() {
    func.SearchJudge()
    this.username = localStorage.getItem('ms_username')
    this.isShowPosition = localStorage.getItem('isShowPosition')
    //this.funcGetTableData('', '', '', localStorage.getItem("shopCode"), localStorage.getItem("userType"));
    //this.funcGetWarehouseAndPosition(localStorage.getItem("shopCode"), '', 1);
    this.funcGetCategoryTableData(
      '',
      '',
      localStorage.getItem('shopCode'),
      localStorage.getItem('userType'),
      1,
      100000
    )
    this.funcGetShopList(localStorage.getItem('shopCode'))

    if (localStorage.getItem('isLimitInventoryDate') == '0') {
      this.isLimitInventoryDate = false
    } else if (localStorage.getItem('isLimitInventoryDate') == '1') {
      this.isLimitInventoryDate = true
    }
    if (this.isLimitInventoryDate) {
      console.log(1)
      this.searchForm.startTime = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        localStorage.getItem('InventoryStartDate')
      )
      this.searchForm.endTime = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        localStorage.getItem('InventoryEndDate')
      )
    }
    console.log(this.searchForm)
    this.InventoryStartDate = parseInt(
      localStorage.getItem('InventoryStartDate')
    )
    this.InventoryEndDate = parseInt(localStorage.getItem('InventoryEndDate'))

    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'InStockCheckStock') {
        this.permissionsList = item.Rights
      }
    }
    console.log(this.searchForm)
    // this.eventSearch()
  },
  watch: {
    'searchForm.startTime'(value, oldVal) {
      if (
        oldVal &&
        value &&
        typeof value === 'string' &&
        this.searchForm.endTime
      ) {
        this.eventSearch()
      }
    },
    'searchForm.endTime'(value, oldVal) {
      if (
        oldVal &&
        value &&
        typeof value === 'string' &&
        this.searchForm.startTime
      ) {
        this.eventSearch()
      }
    },
    dialogVisible(newVal, oldVal) {
      this.eventSearch()
    },
    'searchForm.shop'(newVal, oldVal) {
      this.searchForm.warehouseCode = ''
      this.warehouseList = []
      if (newVal) {
        this.funcGetWarehouseAndPosition(newVal, '', 1)
      }
    },
    dialogVisibleProduct(newVal, oldVal) {
      if (newVal) {
        this.eventProductReset()
      }
    },
  },
}
