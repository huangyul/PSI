import func from '../../func.js'
import basis from '../../../api/basisApi.js'
import stock from '../../../api/stockApi.js'
import { getLodop } from '../../LodopFuncs.js'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'WaitToWarehouse',
  data() {
    return {
      permissionsList: '',
      isShowPosition: '',
      CompanyList: '',
      searchForm: {
        product: '',
        expressNumber: '',
        logCompanyCode: '',
        purchaseType: -1,
        oddNum: '',
        companyCode: '',
        SupplierCode: '',
      },
      storeCompanyList: '',
      page: 1,
      pageSize: 15,
      total: 0,
      tableData: [],
      tableSelectData: '',
      OpenWindowTitle: '',
      dialogVisible: false,
      subdialogVisible: false,
      enterForm: '',
      selectedFixedItems: {},
      infoIndex: 0,

      printDialogVisible: false,
      printTableData: [],
      isSystem: true,
      BarCodeTemplate: '',
      afterInStockData: [],
      supplierList: [],
      isTrue: true,
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
          this.storeCompanyList = res.data
          if (this.storeCompanyList.length == 1) {
            this.searchForm.companyCode = this.storeCompanyList[0].Code
          }
          this.funcGetPendingCheckinList(
            this.searchForm.product,
            this.searchForm.expressNumber,
            this.searchForm.logCompanyCode,
            this.searchForm.purchaseType,
            this.searchForm.oddNum,
            this.searchForm.companyCode,
            this.page,
            this.pageSize
          )
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //仓库选择的变化
    selectChanged(rowData) {
      for (var i = 0; i < rowData.WarehouseList.length; i++) {
        if (rowData.EnterBase == rowData.WarehouseList[i].Code) {
          rowData.EnterBaseName = rowData.WarehouseList[i].Name
        }
      }
      this.funcGetWhOrPositionInfo(rowData.ShopCode, rowData.EnterBase, rowData)
    },
    //赋值仓位名称
    selectPos(rowData) {
      for (var i = 0; i < rowData.PositionList.length; i++) {
        if (rowData.BasePosition == rowData.PositionList[i].Code) {
          rowData.BasePositionName = rowData.PositionList[i].Name
        }
      }
    },
    //获取供应商列表
    funcGetSupplierTableData(
      supplierName,
      supplierId,
      shopCode,
      userType,
      topOrgId,
      activeStatus,
      page,
      pageSize
    ) {
      var url =
        basis.SupplierManagement.query +
        '?supplierName=' +
        supplierName +
        '&supplierId=' +
        supplierId +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType +
        '&topOrgId=' +
        topOrgId +
        '&activeStatus=' +
        activeStatus +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .get(url)
        .then((res) => {
          this.supplierList = res.data.Results
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //获取快递公司
    funcGetMatType() {
      var url =
        basis.LogisticsCompany.query +
        '?name=&code=&status=-1&page=1&pageSize=99999'
      this.$axios
        .get(url)
        .then((res) => {
          this.CompanyList = []
          this.CompanyList = res.data.Results
          this.CompanyList.unshift({ Code: '', Name: '全部' })
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取待入库列表
    funcGetPendingCheckinList(
      product,
      expressNumber,
      logCompanyCode,
      purchaseType,
      oddNum,
      companyCode,
      page,
      pageSize
    ) {
      // if (companyCode == '') {
      //     companyCode = localStorage.getItem("shopCode");
      // }
      var url =
        stock.StockManagement.GetPendingCheckinList +
        '?product=' +
        encodeURIComponent(product) +
        '&expressNumber=' +
        expressNumber +
        '&logCompanyCode=' +
        logCompanyCode +
        '&purchaseType=' +
        purchaseType +
        '&oddNum=' +
        oddNum +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&shopInfo=' +
        companyCode +
        '&supplierCode=' +
        this.searchForm.SupplierCode
      this.$axios
        .get(url)
        .then((res) => {
          this.tableData = res.data.Results
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].DeliveryDate =
              this.tableData[i].DeliveryDate.split(' ')[0]
          }
          this.total = res.data.TotalCount
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取仓位列表
    funcGetWhOrPositionInfo(shopCode, whCode, rowData) {
      rowData.BasePosition = ''
      var url =
        basis.WhOrPositionInfo + '?shopCode=' + shopCode + '&whCode=' + whCode
      this.$axios
        .get(url)
        .then((res) => {
          rowData.PositionList = res.data
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },

    funcGetBarCodeTemplate() {
      var url = basis.getTemplate + '?templateType=' + 3
      this.$axios
        .get(url)
        .then((res) => {
          //console.log(res);
          this.BarCodeTemplate = res.data.TemplateContent
          if (!this.BarCodeTemplate) {
            this.BarCodeTemplate =
              'LODOP.SET_PRINT_PAGESIZE(1,400,300,"");' +
              'LODOP.SET_PRINT_MODE("PRINT_SETUP_PROGRAM",true);' +
              'LODOP.SET_PRINT_MODE("PROGRAM_CONTENT_BYVAR",true);' +
              'LODOP.ADD_PRINT_TEXT(8,7,140,16,shopName);' +
              'LODOP.SET_PRINT_STYLEA(0,"Horient",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",10);' +
              'LODOP.SET_PRINT_STYLEA(0,"Alignment",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","shopName");' +
              'LODOP.ADD_PRINT_BARCODE(25,42,69,69,"QRCode",InvoiceCode);' +
              'LODOP.SET_PRINT_STYLEA(0,"Horient",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",6);' +
              'LODOP.SET_PRINT_STYLEA(0,"AlignJustify",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","InvoiceCode");' +
              'LODOP.ADD_PRINT_TEXT(95,7,140,16,InvoiceCode);' +
              'LODOP.SET_PRINT_STYLEA(0,"Horient",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",10);' +
              'LODOP.SET_PRINT_STYLEA(0,"Alignment",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","InvoiceCode");'
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取打印商品信息
    funcGetPrintTableData() {
      var ids = []
      for (var item of this.afterInStockData) {
        var obj = {
          ProductId: item.ProductId,
          InNum: item.SendNum,
        }
        ids.push(obj)
      }
      //ids = ids.join(",");
      var url = stock.StockManagement.getWaitToWarehousePrintList
      this.$axios
        .post(url, ids)
        .then((res) => {
          if (res.data.Success) {
            this.printTableData = []
            if (this.isSystem) {
              for (var item of res.data.data) {
                if (item.BarCodeTypeName == '系统生成') {
                  this.printTableData.push(item)
                }
              }
            } else {
              this.printTableData = res.data.data
            }
          } else {
            ElMessage.warning({ message: res.data.Msg, type: 'warning' })
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },

    eventPageSizeChange(val) {
      this.pageSize = val
      this.funcGetPendingCheckinList(
        this.searchForm.product,
        this.searchForm.expressNumber,
        this.searchForm.logCompanyCode,
        this.searchForm.purchaseType,
        this.searchForm.oddNum,
        this.searchForm.companyCode,
        1,
        this.pageSize
      )
    },
    eventPageChange(val) {
      this.page = val
      this.funcGetPendingCheckinList(
        this.searchForm.product,
        this.searchForm.expressNumber,
        this.searchForm.logCompanyCode,
        this.searchForm.purchaseType,
        this.searchForm.oddNum,
        this.searchForm.companyCode,
        this.page,
        this.pageSize
      )
    },
    eventSearch() {
      this.funcGetPendingCheckinList(
        this.searchForm.product,
        this.searchForm.expressNumber,
        this.searchForm.logCompanyCode,
        this.searchForm.purchaseType,
        this.searchForm.oddNum,
        this.searchForm.companyCode,
        1,
        this.pageSize
      )
    },
    //弹出入库窗口
    eventOpenWindow: async function (row) {
      if (row) {
        //单个
        this.enterForm = {
          OddNum: row.OddNum,
          OrderMId: row.OrderMId,
          CheckinTypeName: row.CheckinTypeName,
          ExpressNumber: row.ExpressNumber,
          LogCompanyCode: row.LogCompanyCode,
          SupplierName: row.SupplierName,
          CheckinType: row.CheckinType,
          DeliveryCode: row.DeliveryCode,
          Remark: row.Remark,
          ItemList: [
            {
              OrderMId: row.OrderMId,
              ProductId: row.ProductId,
              ShopCode: row.ShopCode,
              WarehouseList: [],
              ProductCode: row.ProductCode,
              ProductName: row.ProductName,
              UnitName: row.UnitName,
              UnitId: row.UnitId,
              SendNum: row.SendNum,
              DeliveryMId: row.DeliveryMId,
              EnterBase: '',
              EnterBaseName: '',
              BasePosition: '',
              BasePositionName: '',
              PositionList: '',
              BussinessType: row.BussinessType,
              FixedItemInfo: {
                assetStatus: '',
                CodeList: [],
              },
            },
          ],
        }
      } else {
        if (this.tableSelectData == '' || this.tableSelectData.length == 0) {
          //没有勾选
          this.$message({ message: '请勾选待入库数据', type: 'warning' })
          return
        } else {
          //有勾选
          var oddNoSum = []
          let shopCode = ''
          for (var i = 0; i < this.tableSelectData.length; i++) {
            console.log(this.tableSelectData[i])
            if (oddNoSum.indexOf(this.tableSelectData[i].OddNum) < 0) {
              oddNoSum.push(this.tableSelectData[i].OddNum)
            }
            if (!shopCode) {
              shopCode = this.tableSelectData[i].ShopCode
            } else if (shopCode != this.tableSelectData[i].ShopCode) {
              return this.$message({
                message: '不是同一门店，不能一批入库',
                type: 'warning',
              })
            }
          }
          if (oddNoSum.length > 1) {
            this.$message({
              message: '请勾选相同采购/调拨单号进行入库',
              type: 'warning',
            })
            return
          } else {
            //多个
            this.enterForm = {
              OddNum: this.tableSelectData[0].OddNum,
              OrderMId: this.tableSelectData[0].OrderMId,
              CheckinTypeName: this.tableSelectData[0].CheckinTypeName,
              ExpressNumber: this.tableSelectData[0].ExpressNumber,
              LogCompanyCode: this.tableSelectData[0].LogCompanyCode,
              SupplierName: this.tableSelectData[0].SupplierName,
              CheckinType: this.tableSelectData[0].CheckinType,
              DeliveryCode: this.tableSelectData[0].DeliveryCode,
              Remark: this.tableSelectData[0].Remark,
              ItemList: [],
            }
            var tempList = []
            for (var i = 0; i < this.tableSelectData.length; i++) {
              tempList.push({
                OrderMId: this.tableSelectData[i].OrderMId,
                ProductId: this.tableSelectData[i].ProductId,
                ShopCode: this.tableSelectData[i].ShopCode,
                WarehouseList: [],
                ProductCode: this.tableSelectData[i].ProductCode,
                ProductName: this.tableSelectData[i].ProductName,
                UnitName: this.tableSelectData[i].UnitName,
                UnitId: this.tableSelectData[i].UnitId,
                SendNum: this.tableSelectData[i].SendNum,
                DeliveryMId: this.tableSelectData[i].DeliveryMId,
                EnterBase: '',
                EnterBaseName: '',
                BasePosition: '',
                BasePositionName: '',
                PositionList: '',
                BussinessType: this.tableSelectData[i].BussinessType,
                FixedItemInfo: {
                  assetStatus: '',
                  CodeList: [],
                },
              })
            }
            this.enterForm.ItemList = tempList
          }
        }
      }
      for (var item of this.enterForm.ItemList) {
        for (var i = 0; i < item.SendNum; i++) {
          item.FixedItemInfo.CodeList.push({ SNumber: i + 1, FixedNumber: '' })
        }
        //动态数据源
        var url =
          stock.StockManagement.GetWarehouse + '?shopCode=' + item.ShopCode
        await this.$axios
          .get(url)
          .then((res) => {
            item.WarehouseList = res.data
          })
          .catch((err) => {
            this.$message({ message: err, type: 'warning' })
          })
        var url2 =
          basis.WarehouseManagement.getDefault +
          '?shopCode=' +
          item.ShopCode +
          '&productId=' +
          item.ProductId
        await this.$axios
          .get(url2)
          .then((res) => {
            if (res.data.length > 0) {
              item.EnterBase = res.data[0].WarehouseCode
              item.EnterBaseName = res.data[0].WarehouseName
              item.BasePosition = res.data[0].PositionCode
              item.BasePositionName = res.data[0].PositionName
            }
          })
          .catch((err) => {
            this.$message({ message: err, type: 'warning' })
          })
      }
      this.dialogVisible = true
    },
    //弹出录入资产编号窗口
    eventOpenSubWindow(row, index) {
      if (row.FixedItemInfo.CodeList.length == 0) {
        //如果是新增或者没录入
        for (var i = 0; i < row.SendNum; i++) {
          row.FixedItemInfo.CodeList.push({ SNumber: i + 1, FixedNumber: '' })
        }
      } else {
      }
      this.selectedFixedItems = JSON.parse(JSON.stringify(row.FixedItemInfo))
      this.infoIndex = index
      this.subdialogVisible = true
    },
    //打开子窗口
    RemoveItem(index) {
      this.enterForm.ItemList.splice(index, 1)
    },
    //资产状态变更
    AssetStatusChange(val) {
      if (val == 3 || val == 2 || val == 4) {
        var url = basis.MachineManagement.getAssetNum + '?status=' + val
        this.$axios
          .get(url)
          .then((res) => {
            var DBAssetNum = parseInt(res.data.replace(/[^0-9]/gi, ''))
            for (var i = 0; i < this.selectedFixedItems.CodeList.length; i++) {
              if (DBAssetNum + i < 100000) {
                var lastNum = (DBAssetNum + i).toString()
                var len = lastNum.length
                while (len < 5) {
                  lastNum = '0' + lastNum
                  len++
                }
                if (val == 3 || val == 2) {
                  this.selectedFixedItems.CodeList[i].FixedNumber =
                    'H' + lastNum
                }
                if (val == 4) {
                  this.selectedFixedItems.CodeList[i].FixedNumber =
                    'T' + lastNum
                }
                //this.selectedFixedItems.CodeList[i].FixedNumber = 'H' + lastNum;
              } else {
                this.$message({
                  message: '固定资产编号已超出范围',
                  type: 'warning',
                })
                return
              }
            }
          })
          .catch((err) => {
            ElMessage.warning({
              message: err,
              type: 'warning',
            })
          })
      } else {
        for (var i = 0; i < this.selectedFixedItems.CodeList.length; i++) {
          this.selectedFixedItems.CodeList[i].FixedNumber = ''
        }
      }
    },
    //点击入库
    eventEnterWareWindow() {
      this.afterInStockData = []
      this.afterInStockData = JSON.parse(
        JSON.stringify(this.enterForm.ItemList)
      )
      var processData = {
        OrderCode: this.enterForm.OddNum,
        CheckinType: this.enterForm.CheckinType.toString(),
        DeliveryCode: this.enterForm.DeliveryCode,
        Remark: this.enterForm.Remark,
        Details: [],
      }
      if (this.enterForm.ItemList.length == 0) {
        //没有商品时
        loading.close()
        this.$message({ message: '请选择商品', type: 'warning' })
        return
      }
      for (var i = 0; i < this.enterForm.ItemList.length; i++) {
        var NumList = []
        for (
          var j = 0;
          j < this.enterForm.ItemList[i].FixedItemInfo.CodeList.length;
          j++
        ) {
          var assetStatusT = 0
          if (
            this.enterForm.ItemList[i].FixedItemInfo.assetStatus != '' &&
            this.enterForm.ItemList[i].FixedItemInfo.assetStatus != undefined
          ) {
            assetStatusT = this.enterForm.ItemList[i].FixedItemInfo.assetStatus
          }
          NumList.push({
            Status: assetStatusT,
            AssetNum:
              this.enterForm.ItemList[i].FixedItemInfo.CodeList[j].FixedNumber,
          })
        }
        if (
          this.enterForm.ItemList[i].EnterBase == null ||
          this.enterForm.ItemList[i].EnterBase == ''
        ) {
          this.$message({ message: '请选择仓库', type: 'warning' })
          return
        }
        if (
          this.isShowPosition == '1' &&
          (this.enterForm.ItemList[i].BasePosition == null ||
            this.enterForm.ItemList[i].BasePosition == '')
        ) {
          this.$message({ message: '请选择仓位', type: 'warning' })
          return
        }
        processData.Details.push({
          OrderMId: this.enterForm.ItemList[i].OrderMId,
          BusinessType: this.enterForm.ItemList[i].BussinessType,
          DeliveryMId: this.enterForm.ItemList[i].DeliveryMId,
          CheckinNum: this.enterForm.ItemList[i].SendNum,
          WarehouseCode: this.enterForm.ItemList[i].EnterBase,
          WarehouseName: this.enterForm.ItemList[i].EnterBaseName,
          PositionCode: this.enterForm.ItemList[i].BasePosition,
          PositionName: this.enterForm.ItemList[i].BasePositionName,
          Remark: '',
          AssetNumList: NumList,
        })
      }
      const loading = func.backgroundLoading('入库中...请稍后')
      var params = [JSON.parse(JSON.stringify(processData))]
      var url =
        stock.StockManagement.CreateStorecheckin +
        '?currentUser=' +
        localStorage.getItem('ms_username')
      this.$axios
        .post(url, params)
        .then((res) => {
          loading.close()
          ElMessage.success({
            message: '入库成功',
            type: 'success',
          })
          //入库成功后打开打印弹窗
          if (this.permissionsList.Print) {
            this.eventOpenPrint()
          }

          this.dialogVisible = false
          this.funcGetPendingCheckinList(
            this.searchForm.product,
            this.searchForm.expressNumber,
            this.searchForm.logCompanyCode,
            this.searchForm.purchaseType,
            this.searchForm.oddNum,
            this.searchForm.companyCode,
            this.page,
            this.pageSize
          )
        })
        .catch((err) => {
          loading.close()
          ElMessage.warning({
            message: err,
            type: 'warning',
          })
        })
    },
    //保存资产固定编号
    SaveFixNumber(index) {
      this.enterForm.ItemList[index].FixedItemInfo = JSON.parse(
        JSON.stringify(this.selectedFixedItems)
      )
      this.subdialogVisible = false
    },
    //重置按钮
    eventReset() {
      this.searchForm = {
        product: '',
        expressNumber: '',
        logCompanyCode: '',
        purchaseType: -1,
        oddNum: '',
        companyCode: '',
        SupplierCode: '',
      }
    },
    eventTableSelect(val) {
      this.tableSelectData = val
    },
    funcRowClassName({ row, rowIndex }) {
      let className = ''
      if (rowIndex % 2 == 1) {
        className += 'double-row'
      }
      for (var item of this.tableSelectData) {
        if (item == row) {
          className += ' rowSelect'
        }
      }
      return className
    },
    //导出
    eventExport() {
      var ids = []
      for (var item of this.tableSelectData) {
        ids.push(item.OddNum)
      }
      //ids = ids.join(",");

      var cCode = this.searchForm.companyCode
      // if (this.searchForm.companyCode == '') {
      //     cCode = localStorage.getItem("shopCode");
      // }
      var url_1 =
        stock.StockManagement.PendingCheckinExport +
        '?product=' +
        this.searchForm.product +
        '&expressNumber=' +
        this.searchForm.expressNumber +
        '&logCompanyCode=' +
        this.searchForm.logCompanyCode +
        '&purchaseType=' +
        this.searchForm.purchaseType +
        '&oddNum=' +
        this.searchForm.oddNum +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&shopInfo=' +
        cCode +
        '&supplierCode=' +
        this.searchForm.SupplierCode
      this.$axios
        .post(url_1, ids)
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
    //打开打印窗口
    eventOpenPrint() {
      this.isSystem = true
      this.funcGetPrintTableData()
      this.printDialogVisible = true
    },
    //条形码打印模板设计
    eventPrintTemplate() {
      var InvoiceCode = 'AAAAAAAAAA1111111111'
      var shopName = '商品名称'

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
      LODOP.PRINT_INITA(0, 0, 152, 112, '')

      eval(this.BarCodeTemplate)

      var that = this
      if (LODOP.CVERSION)
        CLODOP.On_Return = function (TaskID, Value) {
          //console.log('Value:' + Value);  //这个是返回的完整的设计代码
          if (LODOP.CVERSION)
            LODOP.On_Return = function (TaskID, Value) {
              that.BarCodeTemplate = Value
              //console.log(that.BarCodeTemplate);

              var params = {
                TemplateContent: that.BarCodeTemplate,
                TemplateType: 3,
              }
              var url = basis.updateTemplate
              that.$axios
                .post(url, params)
                .then((res) => {
                  ElMessage.success({
                    message: '条形码模板已修改',
                    type: 'success',
                  })
                })
                .catch((err) => {
                  that.$message({ message: err, type: 'warning' })
                })
            }
          that.BarCodeTemplate = LODOP.GET_VALUE('ProgramCodes', 1) //参数1表示获取的是排除了初始化的JS代码
        }
      LODOP.PRINT_DESIGN() //打印设计或者打印维护需要放到最后
    },
    //条形码打印预览和打印
    eventPrint(val) {
      var arr = []
      for (var item of this.printTableData) {
        if (
          item.BarCode == '' ||
          item.BarCode == null ||
          item.BarCode == undefined
        ) {
          this.$message({
            message: '不能打印条形码为空的条码',
            type: 'warning',
          })
          return
        }
        for (var i = 0; i < item.PrintNum; i++) {
          var obj = {
            name: item.ProductName,
            BarCode: 'P' + item.BarCode,
          }
          arr.push(obj)
        }
      }

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
      LODOP.PRINT_INITA(0, 0, 152, 112, '')

      for (var item of arr) {
        // if(item.BarCode == '' || item.BarCode == null || item.BarCode == undefined){
        // 	this.$message({message: '不能打印条形码为空的条码',type: 'warning'});
        // 	return;
        // }
        // var InvoiceCode = item.BarCode;
        // var shopName = item.name;
        LODOP.NewPageA()
        eval(
          'var InvoiceCode = item.BarCode;var shopName = item.name;' +
            this.BarCodeTemplate
        )
      }

      if (val == 1) {
        //预览
        LODOP.PREVIEW()
      } else {
        //打印
        LODOP.PRINT()
        this.printDialogVisible = false
      }
    },
  },
  mounted() {
    func.SearchJudge()
    this.isShowPosition = localStorage.getItem('isShowPosition')
    this.funcGetSupplierTableData(
      '',
      '',
      localStorage.getItem('shopCode'),
      localStorage.getItem('userType'),
      localStorage.getItem('OrganizationId'),
      -1,
      1,
      100000
    )
    this.funcGetCompany()
    this.funcGetMatType()
    // this.funcGetPendingCheckinList(this.searchForm.product, this.searchForm.expressNumber, this.searchForm.logCompanyCode, this.searchForm.purchaseType, this.searchForm.oddNum, this.searchForm.companyCode, this.page, this.pageSize);
    var AllPromossions = JSON.parse(localStorage.getItem('permissions'))
    this.permissionsList = AllPromossions.find(function (item) {
      return item.ModuleUrl == 'WaitToWarehouse'
    }).Rights
    this.funcGetBarCodeTemplate()
  },
  watch: {
    //后续尝试使用watch去监视
    // 'enterForm.ItemList':{
    //     handler:function(newVal,oldVal){
    //     },
    //     immediate:true,
    //     deep:true,
    // }
    isSystem(newVal, oldVal) {
      this.funcGetPrintTableData()
    },
  },
}
