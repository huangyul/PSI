import $ from 'jquery'
import procurement from '../../../api/procurementApi.js'
import basis from '../../../api/basisApi.js'
import returns from '../../../api/returnApi.js'
import func from '../../func.js'
import { getLodop } from '../../LodopFuncs.js'
import RangeDate from '../../../components/rangeDate.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getModifyCancelStock,
  updateCancelStockInfo,
} from '../../../api/apiv2/oldModule.js'
export default {
  name: 'CancelManagement',
  components: { RangeDate },
  data() {
    return {
      permissionsList: '',
      isShowPosition: '',
      username: '',
      addDate: '',
      searchForm: {
        date: [new Date(), new Date()],
        startTime: new Date(),
        endTime: new Date(),
        cancelStockCode: '',
        warehouseCode: '',
        positionCode: '',
        productName: '',
        shopInfo: '',
        inShopInfo: '',
        status: -1,
      },
      tableData: [],
      dialogVisible: false,
      addForm: {
        Code: '',
        Details: [],
      },
      productTableData: [],
      productSearchForm: {
        shopInfo: '',
        checkinCode: '',
        checkoutCode: '',
        inShopInfo: '',
        productName: '',
        matTypeId: '',
        assetNum: '',
        assetStatus: -1,
        startTime: '',
        endTime: '',
        date: [new Date(), new Date()],
      },
      tableDeteleData: '',
      productTableDeteleData: '',
      OpenWindowTitle: '',
      page: 1,
      pageSize: 15,
      total: 0,
      nested_page: 1,
      nested_pageSize: 15,
      nested_total: 0,
      dialogVisibleProduct: false,
      warehouseList: [],
      positionList: [],
      CategoryTree: [],
      shopList: [],
      shopListAll: [],
      supplierIsdisabled: false,
      productWarehouseList: [],
      isPrint: true,
    }
  },
  methods: {
    funcGetTableData(
      cancelStockCode,
      warehouseCode,
      positionCode,
      cancelDateStart,
      cancelDateEnd,
      productName,
      shopInfo,
      shopCode,
      inShopInfo,
      status,
      page,
      pageSize
    ) {
      var url =
        returns.CancelManagement.query +
        '?cancelStockCode=' +
        cancelStockCode +
        '&warehouseCode=' +
        warehouseCode +
        '&positionCode=' +
        positionCode +
        '&cancelDateStart=' +
        cancelDateStart +
        '&cancelDateEnd=' +
        cancelDateEnd +
        '&productName=' +
        encodeURIComponent(productName) +
        '&shopInfo=' +
        shopInfo +
        '&shopCode=' +
        shopCode +
        '&inShopInfo=' +
        inShopInfo +
        '&status=' +
        status +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .get(url)
        .then((res) => {
          //console.log(res);
          this.tableData = res.data.Results
          //给表格加rowspan来合并列
          this.tableData = func.oneSetrowspans(
            this.tableData,
            'CancelStockCode'
          )
          this.total = res.data.TotalCount
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
      shopInfo,
      checkinCode,
      checkoutCode,
      inShopInfo,
      productName,
      matTypeId,
      inDateStart,
      inDateEnd,
      assetNum,
      assetStatus,
      page,
      pageSize
    ) {
      var ids = []
      for (var item of this.addForm.Details) {
        ids.push(item.CheckInMId)
      }
      var url =
        returns.CancelManagement.addProduct +
        '?shopInfo=' +
        shopInfo +
        '&checkinCode=' +
        checkinCode +
        '&checkoutCode=' +
        checkoutCode +
        '&inShopInfo=' +
        inShopInfo +
        '&productName=' +
        productName +
        '&matTypeId=' +
        matTypeId +
        '&inDateStart=' +
        inDateStart +
        '&inDateEnd=' +
        inDateEnd +
        '&assetNum=' +
        assetNum +
        '&assetStatus=' +
        assetStatus +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .post(url, ids)
        .then((res) => {
          //console.log(res);
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
          this.CategoryTree = func.recursiveCategoryTree(res.data.Results)
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
    //获取仓库列表和仓位列表
    funcGetWarehouse(shopCode, whCode) {
      var url =
        basis.WhOrPositionInfo + '?shopCode=' + shopCode + '&whCode=' + whCode
      this.$axios
        .get(url)
        .then((res) => {
          this.productWarehouseList = res.data
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
            this.productSearchForm.shopInfo = this.shopList[0].Code
          }
          this.eventSearch()
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取所有门店信息列表
    funcGetAllShopCodeList(shopCode) {
      var url = basis.GetNoneShopCodeList + '?shopCode=' + shopCode
      this.$axios
        .get(url)
        .then((res) => {
          this.shopListAll = res.data
          if (this.shopListAll.length == 1) {
            this.searchForm.inShopInfo = this.shopListAll[0].Code
            this.productSearchForm.inShopInfo = this.shopListAll[0].Code
          }
          this.eventSearch()
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取打印模板
    funcGetTemplate() {
      var url = basis.getTemplate + '?templateType=' + 6
      this.$axios
        .get(url)
        .then((res) => {
          //console.log(res);
          this.Template = res.data.TemplateContent
          if (!this.Template) {
            this.Template =
              'LODOP.SET_PRINT_MODE("PRINT_SETUP_PROGRAM",true);' +
              'LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true);' +
              'LODOP.SET_PRINT_MODE("PROGRAM_CONTENT_BYVAR",true);' +
              'LODOP.ADD_PRINT_TEXT(29,41,720,31,"退库单");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",16);' +
              'LODOP.SET_PRINT_STYLEA(0,"Alignment",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(55,25,172,23,"退库单号");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"Alignment",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(155,25,172,23,OutBoundCode);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",9);' +
              'LODOP.SET_PRINT_STYLEA(0,"Alignment",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","OutBoundCode");' +
              'LODOP.ADD_PRINT_BARCODE(75,70,81,81,"QRCode",OutBoundCode);' +
              'LODOP.SET_PRINT_STYLEA(0,"AlignJustify",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","OutBoundCode");' +
              'LODOP.ADD_PRINT_TEXT(176,25,82,25,"订单信息");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",13);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(209,40,89,23,"申请门店：");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(209,111,200,23,OutStoresValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","OutStoresValue");' +
              'LODOP.ADD_PRINT_TEXT(209,320,90,23,"退入门店：");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(209,390,220,23,InStoresValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","InStoresValue");' +
              'LODOP.ADD_PRINT_TEXT(247,320,90,23,"创建时间：");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(247,390,220,23,CreaterTimeValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","CreaterTimeValue");' +
              'LODOP.ADD_PRINT_TEXT(247,53,90,23,"创建人：");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(247,111,200,23,CreaterValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","CreaterValue");' +
              'LODOP.ADD_PRINT_TEXT(247,580,138,23,"合计金额(含税)：");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(247,690,75,23,TotalAmountValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"TextFrame",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","TotalAmountValue");' +
              'LODOP.ADD_PRINT_TEXT(284,25,100,25,"商品信息");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",13);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_HTM(56,652,215,23,Paging);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","Paging");' +
              'LODOP.ADD_PRINT_TABLE(317,25,740,850,tableValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"Vorient",3);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","tableValue");'
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },

    funcGetDate() {
      var myDate = new Date()
      this.addDate = func.formatTimeToStr(myDate)
    },
    funcGetCurrenCode(tableName, matType) {
      var url =
        procurement.GeneratedNumber +
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

    //批量删除
    funcTableDeteleList(prams) {
      prams = JSON.stringify(prams)
      var url = returns.CancelManagement.delete
      this.$axios
        .delete(url, {
          data: prams,
          headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => {
          ElMessage.success({
            message: '删除成功',
            type: 'success',
          })
          this.eventSearch()
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //批量提交
    funcTableSubmitList(prams, userName) {
      var url = returns.CancelManagement.submit + '?userName=' + userName
      this.$axios
        .put(url, prams)
        .then((res) => {
          ElMessage.success({
            message: '提交成功',
            type: 'success',
          })
          this.eventSearch()
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //批量审核通过
    funcTableApprovedList(prams, userName) {
      var url = returns.CancelManagement.approved + '?userName=' + userName
      this.$axios
        .put(url, prams)
        .then((res) => {
          ElMessage.success({
            message: '审核通过成功',
            type: 'success',
          })
          this.eventSearch()
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //批量拒绝
    funcTableRejectList(prams, userName) {
      var url = returns.CancelManagement.reject + '?userName=' + userName
      this.$axios
        .put(url, prams)
        .then((res) => {
          ElMessage.success({
            message: '拒绝成功',
            type: 'success',
          })
          this.eventSearch()
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
        this.searchForm.cancelStockCode,
        this.searchForm.warehouseCode,
        this.searchForm.positionCode,
        this.searchForm.startTime,
        this.searchForm.endTime,
        this.searchForm.productName,
        this.searchForm.shopInfo,
        localStorage.getItem('shopCode'),
        this.searchForm.inShopInfo,
        this.searchForm.status,
        this.page,
        this.pageSize
      )
    },
    eventReset() {
      this.searchForm = {
        date: null,
        startTime: '',
        endTime: '',
        cancelStockCode: '',
        warehouseCode: '',
        positionCode: '',
        productName: '',
        shopInfo: '',
        inShopInfo: '',
        status: -1,
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
        this.productSearchForm.shopInfo,
        this.productSearchForm.checkinCode,
        this.productSearchForm.checkoutCode,
        this.productSearchForm.inShopInfo,
        this.productSearchForm.productName,
        this.productSearchForm.matTypeId,
        this.productSearchForm.startTime,
        this.productSearchForm.endTime,
        this.productSearchForm.assetNum,
        this.productSearchForm.assetStatus,
        this.nested_page,
        this.nested_pageSize
      )
    },
    eventProductReset() {
      var form = JSON.parse(JSON.stringify(this.productSearchForm))
      this.productSearchForm = {
        shopInfo: form.shopInfo,
        checkinCode: '',
        checkoutCode: '',
        inShopInfo: form.inShopInfo,
        productName: '',
        matTypeId: '',
        assetNum: '',
        assetStatus: -1,
        startTime: '',
        endTime: '',
        date: null,
      }
    },
    eventTableSelect(val) {
      this.tableDeteleData = val
    },
    eventProductTableSelect(val) {
      this.productTableDeteleData = val
    },
    eventOpenWindow(row) {
      this.funcGetDate()
      this.isPrint = true
      if (row) {
      } else {
        this.OpenWindowTitle = '新增'
        this.supplierIsdisabled = false
        this.addForm = {
          Code: '',
          Details: [],
        }
        this.productSearchForm = {
          shopInfo: '',
          checkinCode: '',
          checkoutCode: '',
          inShopInfo: '',
          productName: '',
          matTypeId: '',
          assetNum: '',
          assetStatus: -1,
          startTime: '',
          endTime: '',
          date: null,
        }
        this.funcGetCurrenCode('PSI_Store_CancelStock', '')
        this.dialogVisible = true
      }
    },
    async eventSaveWindow() {
      if (this.addForm.Details.length == 0) {
        ElMessage.warning({ message: '商品不能为空', type: 'warning' })
        return
      }
      for (var item of this.addForm.Details) {
        if (item.CancelNum == 0 || item.CancelNum == undefined) {
          ElMessage.warning({
            message: '退库数量不能为空或者0',
            type: 'warning',
          })
          return
        }
        // 退库数量不能大于调拨数量和在库数量
        if (item.CancelNum > item.TransferNum || item.CancelNum > item.InNum) {
          ElMessage.warning({
            message: '退库数量不能大于调拨数量和在库数量',
            type: 'warning',
          })
          return
        }
        // if (item.CancelNum > item.InNum) {
        //   ElMessage.warning({
        //     message: '退库数量不能超过在库数量',
        //     type: 'warning',
        //   })
        //   return
        // }
      }
      const loading = func.backgroundLoading('Loading')
      if (this.OpenWindowTitle == '新增') {
        var params = JSON.parse(JSON.stringify(this.addForm))
        //console.log(params);return;
        var url =
          returns.CancelManagement.add +
          '?userName=' +
          localStorage.getItem('ms_username')
        this.$axios
          .post(url, params)
          .then((res) => {
            loading.close()
            ElMessage.success({
              message: '新增成功',
              type: 'success',
            })
            this.eventSearch()
            this.dialogVisible = false
            if (this.permissionsList.Print && this.isPrint) {
              this.eventPrint(2)
            }
          })
          .catch((err) => {
            loading.close()
            ElMessage.warning({
              message: err,
              type: 'warning',
            })
          })
      } else if (this.OpenWindowTitle == '退库-编辑') {
        await updateCancelStockInfo(
          {
            userName: localStorage.getItem('ms_username'),
            mId: this.addForm.Details[0].Id,
          },
          this.addForm
        )
        loading.close()
        ElMessage.success({
          message: '保存成功',
          type: 'success',
        })
        this.eventSearch()
        this.dialogVisible = false
        if (this.permissionsList.Print && this.isPrint) {
          this.eventPrint(2)
        }
      }
      //this.dialogVisible = false;
    },
    //删除弹窗表格里面的商品
    eventDeleteDetails(index, row) {
      this.addForm.Details.splice(index, 1)
      if (this.addForm.Details.length == 0) {
        this.supplierIsdisabled = false
        this.addForm.SupplierCode = ''
      }
    },
    //当表格中的下单组数被改变
    eventChangeaddFormGroupNum(val, index, row) {},
    //打开增加商品弹窗
    eventOpenProductWindow() {
      if (
        !this.productSearchForm.shopInfo ||
        !this.productSearchForm.inShopInfo
      ) {
        ElMessage.warning({
          message: '请选择申请门店和退入门店',
          type: 'warning',
        })
        return
      }
      if (
        this.productSearchForm.shopInfo == this.productSearchForm.inShopInfo
      ) {
        ElMessage.warning({
          message: '申请门店和退入门店不能一样',
          type: 'warning',
        })
        return
      }
      this.eventProductReset()
      this.nested_page = 1
      this.nested_pageSize = 15
      this.productSearchForm.date = [new Date(), new Date()]
      this.eventProductSearch()
      this.dialogVisibleProduct = true

      //弹窗根据搜索条件数量改变样式
      func.DialogSearchJudge()
    },
    //新增勾选的商品
    eventAddProduct() {
      //var length = this.addForm.Details.length + 1;
      for (var item of this.productTableDeteleData) {
        var obj = {
          CheckinCode: item.CheckinCode,
          CheckoutCode: item.CheckoutCode,
          ProductName: item.ProductName,
          ProductCode: item.ProductCode,
          AssetNum: item.AssetNum,
          InNum: item.StockNum,
          TransferNum: item.TransferNum,
          CancelNum: undefined,
          Remark: '',
          PriceByTax: item.PriceByTax,
          TaxRate: item.TaxRate,
          UnitName: item.UnitName,
          WarehouseName: item.WarehouseName,
          PositionName: item.PositionName,
          CheckInMId: item.Id,
          CheckOutMId: item.CheckoutMId,
        }
        this.addForm.Details.push(obj)
        //length = length + 1;
      }
      this.dialogVisibleProduct = false
      if (this.addForm.Details.length != 0) {
        this.supplierIsdisabled = true
      }
    },
    //头部操作，1是提交，2是审核通过，3是拒绝，4是删除
    eventOperation(val) {
      if (this.tableDeteleData.length == 0) {
        ElMessage.warning({
          message: '还未选择',
          type: 'warning',
        })
      } else {
        var ids = []
        for (var item of this.tableDeteleData) {
          ids.push(item.Id)
        }
        // ids = this.getTrulyList()

        //console.log(ids);return;
        if (val == 1) {
          this.funcTableSubmitList(ids, localStorage.getItem('ms_username'))
        } else if (val == 2) {
          this.funcTableApprovedList(ids, localStorage.getItem('ms_username'))
        } else if (val == 3) {
          this.funcTableRejectList(ids, localStorage.getItem('ms_username'))
        } else if (val == 4) {
          this.funcTableDeteleList(ids)
        }
      }
    },

    /**
     * 因为表格数据合并后，勾选中的数据只是合并后的第一行，所以需要找出所有数据
     */
    getTrulyList() {
      let arr = []
      this.tableData.forEach((i) => {
        this.tableDeteleData.forEach((j) => {
          if (i.CancelStockCode == j.CancelStockCode) {
            arr.push(i.Id)
          }
        })
      })
      return arr
    },
    //导出
    eventExport() {
      var startData = ''
      var endDate = ''
      if (this.searchForm.date) {
        startData = func.formatTimeToStr(this.searchForm.date[0], 'yyyy-MM-dd')
        endDate = func.formatTimeToStr(this.searchForm.date[1], 'yyyy-MM-dd')
      }

      var ids = []
      for (var item of this.tableDeteleData) {
        ids.push(item.Id)
      }
      //ids = ids.join(",");
      var url_1 =
        returns.ReturnsManagement.Export +
        '?returnProductCode' +
        this.searchForm.returnProductCode +
        '&warehouseCode=' +
        this.searchForm.warehouseCode +
        '&positionCode=' +
        this.searchForm.positionCode +
        '&applyDateStart=' +
        this.searchForm.startTime +
        '&applyDateEnd=' +
        this.searchForm.endTime +
        '&productName=' +
        this.searchForm.productName +
        '&orderCode=' +
        this.searchForm.orderCode +
        '&supllerInfo=' +
        this.searchForm.supllerInfo +
        '&status=' +
        this.searchForm.status +
        '&shopInfo=' +
        this.searchForm.shopInfo +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType')
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

    //打印模板设计
    eventPrintTemplate() {
      var OutBoundCode = 'TK11111111111111111'
      var OutStoresValue = '申请门店的值'
      var InStoresValue = '退入门店的值'
      var CreaterValue = '创建人的值'
      var CreaterTimeValue = '创建时间的值'
      var TotalAmountValue = 888888888
      var Paging =
        '<div style="display:flex;text-align: center;">第<font tdata="PageNO">##</font>页</span>/共<font tdata="PageCount">##</font></span>页</div>'
      var tbody = ''
      for (var i = 1; i <= 50; i++) {
        var str =
          '<tr><td style="padding: 5px 10px; text-align: center;">' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">商品编号' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">商品名称' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">资产编号' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">退库数量' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">单位' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">单价(含税)' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">税率' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">小计' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">备注' +
          i +
          '</td></tr>'
        tbody = tbody + str
      }
      var tableValue =
        '<table border="1" style="border-collapse:collapse; width:100%; font-size:13px; height:auto;"><thead><tr><th style="padding: 5px 10px;">序号</th><th style="padding: 5px 10px;">商品编号</th><th style="padding: 5px 10px;">商品名称</th><th style="padding: 5px 10px;">资产编号</th><th style="padding: 5px 10px;">退库数量</th><th style="padding: 5px 10px;">单位</th><th style="padding: 5px 10px;">单价(含税)</th><th style="padding: 5px 10px;">税率</th><th style="padding: 5px 10px;">小计</th><th style="padding: 5px 10px;">备注</th></tr></thead><tbody>' +
        tbody +
        '</tbody></table>'

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
      LODOP.PRINT_INITA(0, 0, 800, 1200, '')

      eval(this.Template)

      var that = this
      if (LODOP.CVERSION)
        CLODOP.On_Return = function (TaskID, Value) {
          //console.log('Value:' + Value);  //这个是返回的完整的设计代码
          if (LODOP.CVERSION)
            LODOP.On_Return = function (TaskID, Value) {
              that.Template = Value
              //console.log(that.Template);

              var params = {
                TemplateContent: that.Template,
                TemplateType: 6,
              }
              var url = basis.updateTemplate
              that.$axios
                .post(url, params)
                .then((res) => {
                  ElMessage.success({
                    message: '退库单模板已修改',
                    type: 'success',
                  })
                })
                .catch((err) => {
                  that.$message({ message: err, type: 'warning' })
                })
            }
          that.Template = LODOP.GET_VALUE('ProgramCodes', 1) //参数1表示获取的是排除了初始化的JS代码
        }

      LODOP.PRINT_DESIGN() //打印设计或者打印维护需要放到最后
    },
    //调拨单打印或者预览
    eventPrint(val) {
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
        var OutBoundCode = this.addForm.Code
        var OutStoresValue = ''
        for (var item of this.shopList) {
          if (item.Code == this.productSearchForm.shopInfo) {
            OutStoresValue = item.Name
          }
        }
        var InStoresValue = ''
        for (var item of this.shopList) {
          if (item.Code == this.productSearchForm.inShopInfo) {
            InStoresValue = item.Name
          }
        }
        var CreaterValue = localStorage.getItem('ms_username')
        var CreaterTimeValue = new Date().toLocaleDateString()
        var TotalAmountValue = 0
        for (var item of this.addForm.Details) {
          TotalAmountValue = item.CancelNum * item.PriceByTax + TotalAmountValue
        }
        TotalAmountValue = TotalAmountValue.toFixed(2)
        var Paging =
          '<div style="display:flex;text-align: center;">第<font tdata="PageNO">##</font>页</span>/共<font tdata="PageCount">##</font></span>页</div>'
        var tbody = ''
        var tableData = this.addForm.Details
        for (var i = 0; i <= tableData.length - 1; i++) {
          var str =
            '<tr><td style="padding: 5px 10px; text-align: center;">' +
            (i + 1) +
            '</td><td style="padding: 5px 10px; text-align: center;">' +
            tableData[i].ProductCode +
            '</td><td style="padding: 5px 10px; text-align: center;">' +
            tableData[i].ProductName +
            '</td><td style="padding: 5px 10px; text-align: center;">' +
            tableData[i].AssetNum +
            '</td><td style="padding: 5px 10px; text-align: center;">' +
            tableData[i].CancelNum +
            '</td><td style="padding: 5px 10px; text-align: center;">' +
            tableData[i].UnitName +
            '</td><td style="padding: 5px 10px; text-align: center;">' +
            tableData[i].PriceByTax +
            '</td><td style="padding: 5px 10px; text-align: center;">' +
            (tableData[i].TaxRate * 100).toFixed(2) +
            '%' +
            '</td><td style="padding: 5px 10px; text-align: center;">' +
            (tableData[i].CancelNum * tableData[i].PriceByTax).toFixed(2) +
            '</td><td style="padding: 5px 10px; text-align: center;">' +
            tableData[i].Remark +
            '</td></tr>'
          tbody = tbody + str
        }
        var tableValue =
          '<table border="1" style="border-collapse:collapse; width:100%; font-size:13px; height:auto;"><thead><tr><th style="padding: 5px 10px;">序号</th><th style="padding: 5px 10px;">商品编号</th><th style="padding: 5px 10px;">商品名称</th><th style="padding: 5px 10px;">资产编号</th><th style="padding: 5px 10px;">退库数量</th><th style="padding: 5px 10px;">单位</th><th style="padding: 5px 10px;">单价(含税)</th><th style="padding: 5px 10px;">税率</th><th style="padding: 5px 10px;">小计</th><th style="padding: 5px 10px;">备注</th></tr></thead><tbody>' +
          tbody +
          '</tbody></table>'
        console.log(
          OutBoundCode,
          OutStoresValue,
          InStoresValue,
          CreaterValue,
          CreaterTimeValue,
          TotalAmountValue,
          Paging,
          tableValue
        )
        console.clear()
        LODOP.NewPageA()
        eval(this.Template)
      }
      if (val == 1) {
        //预览
        LODOP.PREVIEW()
      } else {
        //打印
        LODOP.PRINT()
      }
    },
    //打印多张退库单
    eventPrintList() {
      if (this.tableDeteleData.length == 0) {
        ElMessage.warning({
          message: '还未选择',
          type: 'warning',
        })
      } else {
        var ids = []
        for (var item of this.tableDeteleData) {
          ids.push(item.Id)
        }
        //ids = [...new Set(ids)];
        //console.log(ids);return;
        var url = returns.CancelManagement.print
        this.$axios
          .post(url, ids)
          .then((res) => {
            //console.log(res.data);
            var LODOP = getLodop()
            if (!LODOP) {
              setTimeout(function () {
                ElMessage.warning({
                  message:
                    '打印失败，未能识别到C-Lpdop，请检查是否安装好C-Lodop！',
                  type: 'warning',
                })
              }, 100)
              return
            }

            LODOP.PRINT_INIT('')
            for (var item of res.data) {
              var OutBoundCode = item.Code
              var OutStoresValue = item.OutShopName
              var InStoresValue = item.InShopName
              var CreaterValue = item.Creater
              var CreaterTimeValue = item.CreateTime
              var TotalAmountValue = 0
              for (var itemDetails of item.Details) {
                TotalAmountValue =
                  itemDetails.CancelNum * itemDetails.PriceByTax +
                  TotalAmountValue
              }
              TotalAmountValue = TotalAmountValue.toFixed(2)
              var Paging =
                '<div style="display:flex;text-align: center;">第<font tdata="PageNO">##</font>页</span>/共<font tdata="PageCount">##</font></span>页</div>'
              var tbody = ''
              var tableData = item.Details
              for (var i = 0; i <= tableData.length - 1; i++) {
                var str =
                  '<tr><td style="padding: 5px 10px; text-align: center;">' +
                  (i + 1) +
                  '</td><td style="padding: 5px 10px; text-align: center;">' +
                  tableData[i].ProductCode +
                  '</td><td style="padding: 5px 10px; text-align: center;">' +
                  tableData[i].ProductName +
                  '</td><td style="padding: 5px 10px; text-align: center;">' +
                  tableData[i].AssetNum +
                  '</td><td style="padding: 5px 10px; text-align: center;">' +
                  tableData[i].CancelNum +
                  '</td><td style="padding: 5px 10px; text-align: center;">' +
                  tableData[i].UnitName +
                  '</td><td style="padding: 5px 10px; text-align: center;">' +
                  tableData[i].PriceByTax +
                  '</td><td style="padding: 5px 10px; text-align: center;">' +
                  (tableData[i].TaxRate * 100).toFixed(2) +
                  '%' +
                  '</td><td style="padding: 5px 10px; text-align: center;">' +
                  (tableData[i].CancelNum * tableData[i].PriceByTax).toFixed(
                    2
                  ) +
                  '</td><td style="padding: 5px 10px; text-align: center;">' +
                  tableData[i].Remark +
                  '</td></tr>'
                tbody = tbody + str
              }
              var tableValue =
                '<table border="1" style="border-collapse:collapse; width:100%; font-size:13px; height:auto;"><thead><tr><th style="padding: 5px 10px;">序号</th><th style="padding: 5px 10px;">商品编号</th><th style="padding: 5px 10px;">商品名称</th><th style="padding: 5px 10px;">资产编号</th><th style="padding: 5px 10px;">退库数量</th><th style="padding: 5px 10px;">单位</th><th style="padding: 5px 10px;">单价(含税)</th><th style="padding: 5px 10px;">税率</th><th style="padding: 5px 10px;">小计</th><th style="padding: 5px 10px;">备注</th></tr></thead><tbody>' +
                tbody +
                '</tbody></table>'
              console.log(
                OutBoundCode,
                OutStoresValue,
                InStoresValue,
                CreaterValue,
                CreaterTimeValue,
                TotalAmountValue,
                Paging,
                tableValue
              )
              console.clear()
              LODOP.NewPageA()
              eval(this.Template)
              //打印
              LODOP.PRINT()
            }
          })
          .catch((err) => {
            this.$message({
              message: err,
              type: 'warning',
            })
          })
      }
    },
    //合并表格列
    funcObjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        return {
          rowspan: row.rowspan,
          colspan: 1,
        }
      }
    },

    async onEdit(row) {
      const res = await getModifyCancelStock({ mId: row.Id })
      this.OpenWindowTitle = '退库-编辑'
      this.supplierIsdisabled = false
      this.addForm = {
        Code: row.CancelStockCode,
        Details: res.Details,
      }
      this.productSearchForm = {
        shopInfo: res.ShopCode,
        checkinCode: '',
        checkoutCode: '',
        inShopInfo: res.InShopCode,
        productName: '',
        matTypeId: '',
        assetNum: '',
        assetStatus: -1,
        startTime: '',
        endTime: '',
        date: null,
      }
      this.dialogVisible = true
    },
  },
  mounted() {
    func.SearchJudge()
    this.username = localStorage.getItem('ms_username')
    this.isShowPosition = localStorage.getItem('isShowPosition')
    //this.eventSearch();
    //this.funcGetWarehouseAndPosition(localStorage.getItem("shopCode"), '',1);
    this.funcGetCategoryTableData(
      '',
      '',
      localStorage.getItem('shopCode'),
      localStorage.getItem('userType'),
      1,
      100000
    )
    this.funcGetShopCodeList(localStorage.getItem('shopCode'))
    this.funcGetAllShopCodeList(localStorage.getItem('shopCode'))
    this.funcGetTemplate()
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'CancelManagement') {
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
