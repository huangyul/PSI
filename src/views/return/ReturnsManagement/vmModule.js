import $ from 'jquery'
import procurement from '../../../api/procurementApi.js'
import basis from '../../../api/basisApi.js'
import returns from '../../../api/returnApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import RangeDate from '../../../components/rangeDate.vue'
export default {
  name: 'ReturnsManagement',
  components: { RangeDate },
  data() {
    return {
      permissionsList: '',
      isShowPosition: '',
      username: '',
      addDate: '',
      searchForm: {
        date: [new Date(), new Date()],
        returnProductCode: '',
        warehouseCode: '',
        positionCode: '',
        productName: '',
        supllerInfo: '',
        orderCode: '',
        status: '',
        shopInfo: '',
        startTime: new Date(),
        endTime: new Date(),
      },
      tableData: [],
      dialogVisible: false,
      addForm: {
        Code: '',
        Details: [],
        SupplierCode: '',
        SupplierName: '',
      },
      productTableData: [],
      productSearchForm: {
        poCode: '',
        warehouseCode: '',
        productName: '',
        startTime: '',
        endTime: '',
        date: null,
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
      supplierList: [],
      warehouseList: [],
      positionList: [],
      shopList: [],
      supplierIsdisabled: false,
      productShopInfo: '',
      productWarehouseList: [],
    }
  },
  methods: {
    funcGetTableData(
      returnProductCode,
      warehouseCode,
      positionCode,
      applyDateStart,
      applyDateEnd,
      productName,
      supllerInfo,
      orderCode,
      status,
      shopInfo,
      shopCode,
      userType,
      page,
      pageSize
    ) {
      var url =
        returns.ReturnsManagement.query +
        '?returnProductCode=' +
        returnProductCode +
        '&warehouseCode=' +
        warehouseCode +
        '&positionCode=' +
        positionCode +
        '&applyDateStart=' +
        applyDateStart +
        '&applyDateEnd=' +
        applyDateEnd +
        '&productName=' +
        encodeURIComponent(productName) +
        '&supllerInfo=' +
        supllerInfo +
        '&orderCode=' +
        orderCode +
        '&status=' +
        status +
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
          //????????????rowspan????????????
          //this.tableData = func.oneSetrowspans(this.tableData, 'OrderCode');
          //console.log(this.tableData);
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //??????????????????
    funcGetProductTableData(
      shopInfo,
      poCode,
      supllerInfo,
      warehouseCode,
      productName,
      inDateStart,
      inDateEnd,
      shopCode,
      userType,
      page,
      pageSize
    ) {
      var url =
        returns.ReturnsManagement.addProduct +
        '?shopInfo=' +
        shopInfo +
        '&poCode=' +
        poCode +
        '&supllerInfo=' +
        supllerInfo +
        '&warehouseCode=' +
        warehouseCode +
        '&productName=' +
        encodeURIComponent(productName) +
        '&inDateStart=' +
        inDateStart +
        '&inDateEnd=' +
        inDateEnd +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      let ids = []
      console.log(this.addForm.Details)
      this.addForm.Details.forEach((i) => {
        ids.push(i.CheckInMId)
      })
      this.$axios
        .post(url, ids)
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

    //?????????????????????
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
    //?????????????????????????????????
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
    //?????????????????????????????????
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
    //????????????????????????
    funcGetShopCodeList(shopCode) {
      var url = basis.GetShopCodeList + '?shopCode=' + shopCode
      this.$axios
        .get(url)
        .then((res) => {
          this.shopList = res.data
          if (this.shopList.length == 1) {
            this.searchForm.shopInfo = this.shopList[0].Code
            this.productShopInfo = this.shopList[0].Code
          }
          this.eventSearch()
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

    //????????????
    funcTableDeteleList(prams) {
      prams = JSON.stringify(prams)
      var url = returns.ReturnsManagement.delete
      this.$axios
        .delete(url, {
          data: prams,
          headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => {
          ElMessage.success({
            message: '????????????',
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
    //????????????
    funcTableSubmitList(prams, userName) {
      var url = returns.ReturnsManagement.submit + '?userName=' + userName
      this.$axios
        .put(url, prams)
        .then((res) => {
          ElMessage.success({
            message: '????????????',
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
    //??????????????????
    funcTableApprovedList(prams, userName) {
      var url = returns.ReturnsManagement.approved + '?userName=' + userName
      this.$axios
        .put(url, prams)
        .then((res) => {
          ElMessage.success({
            message: '??????????????????',
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
    //????????????
    funcTableRejectList(prams, userName) {
      var url = returns.ReturnsManagement.reject + '?userName=' + userName
      this.$axios
        .put(url, prams)
        .then((res) => {
          ElMessage.success({
            message: '????????????',
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
        this.searchForm.returnProductCode,
        this.searchForm.warehouseCode,
        this.searchForm.positionCode,
        this.searchForm.startTime,
        this.searchForm.endTime,
        this.searchForm.productName,
        this.searchForm.supllerInfo,
        this.searchForm.orderCode,
        this.searchForm.status,
        this.searchForm.shopInfo,
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType'),
        this.page,
        this.pageSize
      )
    },
    eventReset() {
      this.searchForm = {
        date: null,
        returnProductCode: '',
        warehouseCode: '',
        positionCode: '',
        productName: '',
        supllerInfo: '',
        orderCode: '',
        status: '',
        shopInfo: '',
        startTime: new Date(),
        endTime: new Date(),
      }
    },
    eventProductSearch() {
      this.funcGetProductTableData(
        this.productShopInfo,
        this.productSearchForm.poCode,
        this.addForm.SupplierCode,
        this.productSearchForm.warehouseCode,
        this.productSearchForm.productName,
        this.productSearchForm.startTime,
        this.productSearchForm.endTime,
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType'),
        this.nested_page,
        this.nested_pageSize
      )
    },
    eventProductReset() {
      if (!this.supplierIsdisabled) {
        this.addForm.SupplierCode = ''
        this.productSearchForm = {
          poCode: '',
          warehouseCode: '',
          productName: '',
          startTime: '',
          endTime: '',
          date: null,
        }
      } else {
        this.productSearchForm = {
          poCode: this.addForm.Details[0].OrderCode,
          warehouseCode: '',
          productName: '',
          startTime: '',
          endTime: '',
          date: null,
        }
      }
    },
    eventTableSelect(val) {
      this.tableDeteleData = val
    },
    eventProductTableSelect(val) {
      this.productTableDeteleData = val
    },
    eventOpenWindow(row) {
      this.productShopInfo = ''
      this.funcGetDate()
      if (row) {
        this.OpenWindowTitle = '??????'
        var url = returns.ReturnsManagement.queryOne + '?mId=' + row.Id
        this.$axios
          .get(url)
          .then((res) => {
            for (var item of res.data.Details) {
              if (item.Status != 0 && item.Status != 4) {
                ElMessage.warning({
                  message: '???????????????????????????????????????????????????',
                  type: 'warning',
                })
                return
              }
            }
            //console.log(res);
            this.addForm = res.data
            this.productShopInfo = res.data.ShopCode
            //console.log(this.addForm);
            this.dialogVisible = true
            this.supplierIsdisabled = true
          })
          .catch((err) => {
            this.$message({
              message: err,
              type: 'warning',
            })
          })
      } else {
        this.OpenWindowTitle = '??????'
        this.supplierIsdisabled = false
        this.addForm = {
          Code: '',
          Details: [],
          SupplierCode: '',
          SupplierName: '',
        }
        this.funcGetCurrenCode('PSI_Store_ReturnProduct', '')
        this.dialogVisible = true
      }
    },
    eventSaveWindow() {
      //console.log(this.addForm);return;
      var myDate = new Date()
      myDate = func.formatTimeToStr(myDate, 'yyyy-MM-dd')
      if (this.addForm.Details.length == 0) {
        ElMessage.warning({ message: '??????????????????', type: 'warning' })
        return
      }
      for (var item of this.addForm.Details) {
        if (item.ReturnProductNum == 0 || item.ReturnProductNum == undefined) {
          ElMessage.warning({
            message: '??????????????????????????????0',
            type: 'warning',
          })
          return
        }
        if (item.ReturnProductNum > item.KTNum) {
          ElMessage.warning({
            message: '????????????????????????????????????',
            type: 'warning',
          })
          return
        }
      }
      // for (var i of this.supplierList) {
      // 	if (i.SupplierId == this.addForm.SupplierCode) {
      // 		this.addForm.SupplierName = i.SupplierName;
      // 	}
      // }
      const loading = func.backgroundLoading('Loading')
      if (this.OpenWindowTitle == '??????') {
        var form = JSON.parse(JSON.stringify(this.addForm))
        for (var item of form.Details) {
          item.Status = 0
          item.ReturnProductCode = form.Code
        }
        var params = {
          Code: form.Code,
          ApplyDate: myDate,
          Modifier: localStorage.getItem('ms_username'),
          Creater: localStorage.getItem('ms_username'),
          Store_ReturnProduct_M_List: form.Details,
        }
        //console.log(params);return;
        var url = returns.ReturnsManagement.add
        this.$axios
          .post(url, params)
          .then((res) => {
            loading.close()
            ElMessage.success({
              message: '????????????',
              type: 'success',
            })
            this.eventSearch()
            this.dialogVisible = false
          })
          .catch((err) => {
            loading.close()
            ElMessage.warning({
              message: err,
              type: 'warning',
            })
          })
      } else if (this.OpenWindowTitle == '??????') {
        var form = JSON.parse(JSON.stringify(this.addForm))
        for (var item of form.Details) {
          item.Status = 0
          item.ReturnProductCode = form.Code
        }
        var data = {
          Code: form.Code,
          ApplyDate: myDate,
          Modifier: localStorage.getItem('ms_username'),
          Store_ReturnProduct_M_List: form.Details,
        }
        var url =
          returns.ReturnsManagement.update + '?mId=' + form.Details[0].Id
        this.$axios
          .put(url, data)
          .then((res) => {
            loading.close()
            ElMessage.success({
              message: '????????????',
              type: 'success',
            })
            //return;
            this.eventSearch()
            this.dialogVisible = false
          })
          .catch((err) => {
            loading.close()
            ElMessage.warning({
              message: err,
              type: 'warning',
            })
          })
      }
      //this.dialogVisible = false;
    },
    //?????????????????????????????????
    eventDeleteDetails(index, row) {
      this.addForm.Details.splice(index, 1)
      if (this.addForm.Details.length == 0) {
        this.supplierIsdisabled = false
        this.addForm.SupplierCode = ''
      }
    },
    //????????????????????????????????????
    eventChangeaddFormGroupNum(val, index, row) {
      this.addForm.Details[index].ReturnAmount =
        val * this.addForm.Details[index].Price
      this.addForm.Details[index].ReturnAmountByTax =
        val * this.addForm.Details[index].PriceByTax
    },
    //????????????????????????
    eventOpenProductWindow() {
      this.productTableDeteleData = []
      if (!this.productShopInfo) {
        ElMessage.warning({
          message: '??????????????????',
          type: 'warning',
        })
        return
      }
      this.nested_page = 1
      this.nested_pageSize = 15
      this.eventProductReset()
      if (!this.supplierIsdisabled) {
        this.addForm.SupplierCode = ''
      }
      // this.funcGetProductTableData('','', this.addForm.SupplierCode, '', '', '', '',
      //     localStorage.getItem("shopCode"), localStorage.getItem("userType"), this.nested_page,
      //     this.nested_pageSize);
      this.eventProductSearch()
      this.dialogVisibleProduct = true

      //??????????????????????????????????????????
      func.DialogSearchJudge()
    },
    //?????????????????????
    eventAddProduct() {
      if (this.productTableDeteleData.length > 0) {
        var firstOrderCode = this.productTableDeteleData[0].OrderCode
        var firstSupplierCode = this.productTableDeteleData[0].SupplierCode
        for (var item of this.productTableDeteleData) {
          if (item.SupplierCode != firstSupplierCode) {
            ElMessage.warning({
              message: '???????????????????????????',
              type: 'warning',
            })
            return
          }
          if (item.OrderCode != firstOrderCode) {
            ElMessage.warning({
              message: '??????????????????????????????',
              type: 'warning',
            })
            return
          }
        }
      }
      var length = this.addForm.Details.length + 1
      for (var item of this.productTableDeteleData) {
        var obj = {
          AssetNum: item.AssetNum,
          BackedNum: item.ReturnAll,
          CheckInMId: item.Id,
          CheckinNum: item.CheckinNum,
          Id: func.guid,
          InDate: item.InDate,
          InStockNum: item.StockNum,
          IndexNo: length,
          OrderCode: item.OrderCode,
          Price: item.PriceNoTax,
          PriceByTax: item.PriceByTax,
          ProductName: item.ProductName,
          ReturnAmount: 0,
          ReturnAmountByTax: 0,
          ReturnProductCode: '',
          ReturnProductNum: 0,
          TaxRate: item.TaxRate,
          UnitName: item.UnitName,
          KTNum: item.KTNum,
          SupplierCode: item.SupplierCode,
          SupplierName: item.SupplierName,
        }
        this.addForm.Details.push(obj)
        length = length + 1
      }
      this.dialogVisibleProduct = false
      if (this.addForm.Details.length != 0) {
        this.supplierIsdisabled = true
        this.addForm.SupplierCode = this.addForm.Details[0].SupplierCode
        this.productSearchForm.poCode = this.addForm.Details[0].OrderCode
      }
    },
    //???????????????1????????????2??????????????????3????????????4?????????
    eventOperation(val) {
      if (this.tableDeteleData.length == 0) {
        ElMessage.warning({
          message: '????????????',
          type: 'warning',
        })
      } else {
        var ids = []
        for (var item of this.tableDeteleData) {
          var obj = { Id: item.Id }
          ids.push(obj)
        }
        //console.log(ids);return;
        if (val == 1) {
          var first = this.tableDeteleData[0].OrderCode
          for (var item of this.tableDeteleData) {
            if (first != item.OrderCode) {
              ElMessage.warning({
                message: '???????????????????????????????????????',
                type: 'warning',
              })
              return
            }
          }
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
        '?returnProductCode=' +
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
          //?????????
          var url_2 =
            basis.ExportDownload + '?filePath=' + res.data.data + '&delete=1'
          window.location.href = url_2
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
  },
  mounted() {
    func.SearchJudge()
    this.username = localStorage.getItem('ms_username')
    this.isShowPosition = localStorage.getItem('isShowPosition')
    //this.eventSearch();
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
    //this.funcGetWarehouseAndPosition(localStorage.getItem("shopCode"), '',1);
    this.funcGetShopCodeList(localStorage.getItem('shopCode'))
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'ReturnsManagement') {
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
        this.funcGetWarehouseAndPosition(
          localStorage.getItem('shopCode'),
          newVal,
          2
        )
      }
    },
    productShopInfo(newVal, oldVal) {
      this.productSearchForm.warehouseCode = ''
      this.productWarehouseList = []
      if (newVal) {
        this.funcGetWarehouse(newVal, '')
      }
    },
  },
}
