import $ from 'jquery'
import supplier from '../../../api/supplierApi.js'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { getLodop } from '../../LodopFuncs.js'
import RangeDate from '../../../components/rangeDate.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import JsBarcode from 'jsbarcode'
export default {
  // name: 'DeliveryView',
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
        status: -1,
        startTime: '',
        endTime: '',
        shopInfo: '',
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
        PackageNum: 0,
        Remark: '',
      },

      tableDeteleData: '',
      page: 1,
      pageSize: 15,
      total: 0,
      LogisticsList: [],
      isSupplier: false,
      printDialogVisible: false,
      printTableData: [],
      isSystem: true,
      BarCodeTemplate: '',
      isPrintInvoice: true,
      InvoiceTemplate: '',
      shopList: [],
    }
  },
  computed: {
    operator() {
      return localStorage.getItem('ms_username')
    },
  },
  methods: {
    funcGetTableData(
      poCode,
      supllerInfo,
      startTime,
      endTime,
      shopCode,
      userType,
      status,
      page,
      pageSize
    ) {
      var url =
        supplier.DeliveryView.query +
        '?poCode=' +
        poCode +
        '&supllerInfo=' +
        supllerInfo +
        '&startTime=' +
        startTime +
        '&endTime=' +
        endTime +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType +
        '&status=' +
        status +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize +
        '&shopInfo=' +
        this.searchForm.shopInfo
      this.$axios
        .get(url)
        .then((res) => {
          this.tableData = res.data.Results
          this.total = res.data.TotalCount
          //????????????rowspan????????????
          //this.tableData = func.oneSetrowspans(this.tableData, 'Code');
          //console.log(res);
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //???????????????????????????
    funcGetPrintTableData() {
      var ids = []
      for (var item of this.tableDeteleData) {
        ids.push(item.Id)
      }
      //ids = ids.join(",");
      var url = supplier.DeliveryView.getPrintData
      this.$axios
        .post(url, ids)
        .then((res) => {
          if (res.data.Success) {
            this.printTableData = []
            if (this.isSystem) {
              for (var item of res.data.data) {
                if (item.BarCodeTypeName == '????????????') {
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
    //????????????????????????
    funcGetLogisticsTableData(name, code, status, page, pageSize) {
      var url =
        basis.LogisticsCompany.query +
        '?name=' +
        name +
        '&code=' +
        code +
        '&status=' +
        status +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .get(url)
        .then((res) => {
          this.LogisticsList = []
          for (var item of res.data.Results) {
            if (item.Status == 1) {
              this.LogisticsList.push(item)
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
    funcGetCurrenCode(tableName, matType) {
      var url =
        supplier.GeneratedNumber +
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
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
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
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",10);' +
              'LODOP.SET_PRINT_STYLEA(0,"Alignment",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","InvoiceCode");'
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    funcGetInvoiceTemplate() {
      var url = basis.getTemplate + '?templateType=' + 1
      this.$axios
        .get(url)
        .then((res) => {
          //console.log(res);
          this.InvoiceTemplate = res.data.TemplateContent
          if (!this.InvoiceTemplate) {
            this.InvoiceTemplate =
              'LODOP.SET_PRINT_MODE("PRINT_SETUP_PROGRAM",true);' +
              'LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true);' +
              'LODOP.SET_PRINT_MODE("PROGRAM_CONTENT_BYVAR",true);' +
              'LODOP.ADD_PRINT_TEXT(29,41,720,31,"?????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",16);' +
              'LODOP.SET_PRINT_STYLEA(0,"Alignment",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(55,25,172,23,"????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"Alignment",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(155,25,172,23,InvoiceCode);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",9);' +
              'LODOP.SET_PRINT_STYLEA(0,"Alignment",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","InvoiceCode");' +
              'LODOP.ADD_PRINT_BARCODE(75,70,81,81,"QRCode",InvoiceCode);' +
              'LODOP.SET_PRINT_STYLEA(0,"AlignJustify",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","InvoiceCode");' +
              'LODOP.ADD_PRINT_TEXT(98,218,105,23,"??????????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(98,305,167,23,PurchaseOrderValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","PurchaseOrderValue");' +
              'LODOP.ADD_PRINT_TEXT(98,489,105,23,"??????????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(98,576,185,23,SupplierValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","SupplierValue");' +
              'LODOP.ADD_PRINT_TEXT(137,262,60,23,"?????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(137,305,455,23,RemarkValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","RemarkValue");' +
              'LODOP.ADD_PRINT_TEXT(176,25,82,25,"????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",13);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(209,40,89,23,"???????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(209,111,220,23,StoresValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","StoresValue");' +
              'LODOP.ADD_PRINT_TEXT(209,340,73,23,"????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(209,394,133,23,ContactValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","ContactValue");' +
              'LODOP.ADD_PRINT_TEXT(209,579,60,23,"?????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(209,618,142,23,PhoneValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","PhoneValue");' +
              'LODOP.ADD_PRINT_TEXT(247,40,90,23,"???????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(247,111,651,23,AddressValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","AddressValue");' +
              'LODOP.ADD_PRINT_TEXT(381,25,100,25,"????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",13);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(284,25,84,25,"????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",13);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(314,40,90,23,"???????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(314,111,167,23,CourierCompanyValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","CourierCompanyValue");' +
              'LODOP.ADD_PRINT_TEXT(314,326,90,23,"???????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(314,397,146,23,LogisticsCodeValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","LogisticsCodeValue");' +
              'LODOP.ADD_PRINT_TEXT(314,552,90,23,"???????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(314,618,143,23,ParcelNumberValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","ParcelNumberValue");' +
              'LODOP.ADD_PRINT_TEXT(351,40,90,23,"???????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(351,111,167,23,DeliveryTimeValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","DeliveryTimeValue");' +
              'LODOP.ADD_PRINT_TEXT(351,340,75,23,"????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(351,397,221,23,OperatorValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","OperatorValue");' +
              'LODOP.ADD_PRINT_HTM(56,652,215,23,Paging);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","Paging");' +
              'LODOP.ADD_PRINT_TABLE(410,25,740,750,tableValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"Vorient",3);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","tableValue");'
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    doSearch() {
      this.$refs.multipleProductTable.clearSelection()
      this.tableDeteleData = []
      this.eventSearch()
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
        status: -1,
        startTime: '',
        endTime: '',
        shopInfo: '',
      }
    },

    eventDetele() {
      if (this.tableDeteleData.length == 0) {
        ElMessage.warning({
          message: '????????????',
          type: 'warning',
        })
      } else {
        var firstCode = this.tableDeteleData[0].Code
        var firstShopCode = this.tableDeteleData[0].ShopCode
        var ids = []
        for (var item of this.tableDeteleData) {
          // if (item.Code != firstCode) {
          //   ElMessage.warning({
          //     message: '??????????????????????????????????????????',
          //     type: 'warning',
          //   })
          //   return
          // }
          // if (item.ShopCode != firstShopCode) {
          //   ElMessage.warning({
          //     message: '????????????????????????????????????',
          //     type: 'warning',
          //   })
          //   return
          // }
          ids.push(item.Id)
        }
        ids = ids.join(',')
        this.eventOpenWindow(ids)
      }
    },
    eventTableSelect(val) {
      this.tableDeteleData = val
    },

    eventOpenWindow(ids) {
      this.isPrintInvoice = true
      this.funcGetDate()

      var url =
        supplier.DeliveryView.queryOne +
        '?userName=' +
        localStorage.getItem('userType')
      this.$axios
        .post(url, ids.split(','))
        .then((res) => {
          console.log(res.data)
          this.addForm = res.data
          this.addForm.PackageNum = undefined
          this.funcGetCurrenCode('PSI_Purchase_Delivery', '')
          this.dialogVisible = true
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    eventSaveWindow() {
      console.log(this.addForm)
      if (!this.addForm.LogCompanyCode) {
        ElMessage.warning({
          message: '??????????????????????????????',
          type: 'warning',
        })
        return
      }
      this.addForm.CreateTime = this.addDate
      this.addForm.ModifyTime = this.addDate
      this.addForm.Creater = localStorage.getItem('ms_username')
      this.addForm.Modifier = localStorage.getItem('ms_username')
      for (var item of this.addForm.PSI_Purchase_Delivery_Ms) {
        if (item.SendNum == undefined || item.SendNum == 0) {
          ElMessage.warning({
            message: '??????????????????????????????0??????????????????',
            type: 'warning',
          })
          return
        }
        if (item.SendNum > item.OrderNum) {
          ElMessage.warning({
            message: '???????????????????????????????????????',
            type: 'warning',
          })
          return
        }
      }
      var params = JSON.parse(JSON.stringify(this.addForm))
      const loading = func.backgroundLoading('Loading')
      var url = supplier.DeliveryView.add
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
          if (this.isPrintInvoice) {
            if (this.permissionsList.Print || this.isSupplier) {
              this.onPrint()
            }
          }
        })
        .catch((err) => {
          loading.close()
          ElMessage.warning({
            message: err,
            type: 'warning',
          })
        })
      //this.dialogVisible = false;
    },
    //?????????????????????????????????
    eventDeleteDetails(index, row) {
      this.addForm.PSI_Purchase_Delivery_Ms.splice(index, 1)
    },
    //????????????????????????????????????
    eventChangeaddFormGroupNum(val, index, row) {
      // this.addForm.PSI_Purchase_Order_Ms[index].TaxAmountMoney = val * this.addForm.PSI_Purchase_Order_Ms[index].PriceByTax;
      // this.addForm.PSI_Purchase_Order_Ms[index].ExcludingTaxAmountMoney = val * this.addForm.PSI_Purchase_Order_Ms[index]
      // 	.PriceByExcludingTax;
      // this.addForm.PSI_Purchase_Order_Ms[index].CostAmount = this.addForm.PSI_Purchase_Order_Ms[index].TaxAmountMoney;
    },
    //??????
    eventExport() {
      var ids = []
      for (var item of this.tableDeteleData) {
        ids.push(item.Code)
      }
      //ids = ids.join(",");

      var url_1 =
        supplier.DeliveryView.export +
        '?poCode=' +
        this.searchForm.poCode +
        '&supllerInfo=' +
        this.searchForm.supllerInfo +
        '&startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType') +
        '&status=' +
        this.searchForm.status +
        '&shopInfo=' +
        this.searchForm.shopInfo

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
    //???????????????????????????
    eventPrintWindow() {
      if (this.tableDeteleData.length == 0) {
        ElMessage.warning({ message: '????????????', type: 'warning' })
        return
      }
      this.isSystem = true
      this.funcGetPrintTableData()
      this.printDialogVisible = true
    },
    //???????????????????????????
    eventPrintTemplate() {
      var InvoiceCode = 'AAAAAAAAAA1111111111'
      var shopName = '????????????'

      var LODOP = getLodop()
      if (!LODOP) {
        setTimeout(function () {
          ElMessage.warning({
            message: '??????????????????????????????C-Lpdop???????????????????????????C-Lodop???',
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
          //console.log('Value:' + Value);  //???????????????????????????????????????
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
                    message: '????????????????????????',
                    type: 'success',
                  })
                })
                .catch((err) => {
                  that.$message({ message: err, type: 'warning' })
                })
            }
          that.BarCodeTemplate = LODOP.GET_VALUE('ProgramCodes', 1) //??????1???????????????????????????????????????JS??????
        }
      LODOP.PRINT_DESIGN() //????????????????????????????????????????????????
    },
    //??????????????????????????????
    eventPrint(val) {
      var arr = []
      for (var item of this.printTableData) {
        if (
          item.BarCode == '' ||
          item.BarCode == null ||
          item.BarCode == undefined
        ) {
          this.$message({
            message: '????????????????????????????????????',
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
            message: '??????????????????????????????C-Lpdop???????????????????????????C-Lodop???',
            type: 'warning',
          })
        }, 100)
        return
      }
      LODOP.PRINT_INITA(0, 0, 152, 112, '')

      for (var item of arr) {
        // if(item.BarCode == '' || item.BarCode == null || item.BarCode == undefined){
        // 	this.$message({message: '????????????????????????????????????',type: 'warning'});
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
        //??????
        LODOP.PREVIEW()
      } else {
        //??????
        LODOP.PRINT()
        this.printDialogVisible = false
      }
    },

    //???????????????????????????
    eventInvoicePrintTemplate() {
      var InvoiceCode = 'SH11111111111111111'
      var PurchaseOrderValue = '?????????????????????'
      var SupplierValue = '?????????????????????'
      var RemarkValue = '????????????'
      var StoresValue = '??????????????????'
      var ContactValue = '???????????????'
      var PhoneValue = '????????????'
      var AddressValue = '??????????????????'
      var CourierCompanyValue = '??????????????????'
      var LogisticsCodeValue = '??????????????????'
      var ParcelNumberValue = '??????????????????'
      var DeliveryTimeValue = '??????????????????'
      var OperatorValue = '???????????????'
      var Paging =
        '<div style="display:flex;text-align: center;">???<font tdata="PageNO">##</font>???</span>/???<font tdata="PageCount">##</font></span>???</div>'
      var tbody = ''
      for (var i = 1; i <= 2; i++) {
        var str =
          '<tr><td style="padding: 5px 10px; text-align: center;">' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">????????????' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">????????????' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">??????' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">??????????????????' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">????????????' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">??????' +
          i +
          '</td></tr>'
        tbody = tbody + str
      }
      var tableValue =
        '<table border="1" style="border-collapse:collapse; width:100%; font-size:13px; height:auto;"><thead><tr><th style="padding: 5px 10px;">??????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">??????</th><th style="padding: 5px 10px;">??????????????????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">??????</th></tr></thead><tbody>' +
        tbody +
        '</tbody></table>'

      var LODOP = getLodop()
      if (!LODOP) {
        setTimeout(function () {
          ElMessage.warning({
            message: '??????????????????????????????C-Lpdop???????????????????????????C-Lodop???',
            type: 'warning',
          })
        }, 100)
        return
      }
      LODOP.PRINT_INITA(0, 0, 800, 1200, '')

      eval(this.InvoiceTemplate)

      var that = this
      if (LODOP.CVERSION)
        CLODOP.On_Return = function (TaskID, Value) {
          //console.log('Value:' + Value);  //???????????????????????????????????????
          if (LODOP.CVERSION)
            LODOP.On_Return = function (TaskID, Value) {
              that.InvoiceTemplate = Value
              //console.log(that.InvoiceTemplate);

              var params = {
                TemplateContent: that.InvoiceTemplate,
                TemplateType: 1,
              }
              var url = basis.updateTemplate
              that.$axios
                .post(url, params)
                .then((res) => {
                  ElMessage.success({
                    message: '????????????????????????',
                    type: 'success',
                  })
                })
                .catch((err) => {
                  that.$message({ message: err, type: 'warning' })
                })
            }
          that.InvoiceTemplate = LODOP.GET_VALUE('ProgramCodes', 1) //??????1???????????????????????????????????????JS??????
        }

      LODOP.PRINT_DESIGN() //????????????????????????????????????????????????
    },

    //????????????????????????
    funcGetShopCodeList() {
      var url =
        basis.GetShopCodeList + '?shopCode=' + localStorage.getItem('shopCode')
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

    //???????????????????????????
    eventInvoicePrint(val) {
      var InvoiceCode = this.addForm.Code
      var PurchaseOrderValue = this.addForm.OrderCode
      var SupplierValue = this.addForm.SupplierName
      var RemarkValue = this.addForm.Remark
      var StoresValue = this.addForm.ShopName
      var ContactValue = this.addForm.Recevier
      var PhoneValue = this.addForm.ContactTel
      var AddressValue = this.addForm.ShopAddress
      var CourierCompanyValue = '??????????????????'
      for (var item of this.LogisticsList) {
        if (item.Code == this.addForm.LogCompanyCode) {
          CourierCompanyValue = item.Name
        }
      }
      var LogisticsCodeValue = this.addForm.ExpressNumber
      var ParcelNumberValue = this.addForm.PackageNum
      var DeliveryTimeValue = this.addDate
      var OperatorValue = localStorage.getItem('ms_username')
      var Paging =
        '<div style="display:flex;text-align: center;">???<font tdata="PageNO">##</font>???</span>/???<font tdata="PageCount">##</font></span>???</div>'
      var tbody = ''
      var tableData = this.addForm.PSI_Purchase_Delivery_Ms
      for (var i = 0; i <= tableData.length - 1; i++) {
        var str =
          '<tr><td style="padding: 5px 10px; text-align: center;">' +
          (i + 1) +
          '</td><td style="padding: 5px 10px; text-align: center;">' +
          tableData[i].ProductCode +
          '</td><td style="padding: 5px 10px; text-align: center;">' +
          tableData[i].ProductName +
          '</td><td style="padding: 5px 10px; text-align: center;">' +
          tableData[i].UnitName +
          '</td><td style="padding: 5px 10px; text-align: center;">' +
          tableData[i].OrderNum +
          '</td><td style="padding: 5px 10px; text-align: center;">' +
          tableData[i].SendNum +
          '</td><td style="padding: 5px 10px; text-align: center;">' +
          tableData[i].Remark +
          '</td></tr>'
        tbody = tbody + str
      }
      var tableValue =
        '<table border="1" style="border-collapse:collapse; width:100%; font-size:13px; height:auto;"><thead><tr><th style="padding: 5px 10px;">??????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">??????</th><th style="padding: 5px 10px;">??????????????????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">??????</th></tr></thead><tbody>' +
        tbody +
        '</tbody></table>'

      var LODOP = getLodop()
      if (!LODOP) {
        setTimeout(function () {
          ElMessage.warning({
            message: '??????????????????????????????C-Lpdop???????????????????????????C-Lodop???',
            type: 'warning',
          })
        }, 100)
        return
      }

      LODOP.PRINT_INIT('')
      for (var i = 0; i < 1; i++) {
        console.log(
          InvoiceCode,
          PurchaseOrderValue,
          SupplierValue,
          RemarkValue,
          StoresValue,
          ContactValue,
          PhoneValue,
          AddressValue,
          CourierCompanyValue,
          LogisticsCodeValue,
          ParcelNumberValue,
          DeliveryTimeValue,
          OperatorValue,
          Paging,
          tableValue
        )
        console.clear()
        LODOP.NewPageA()
        eval(this.InvoiceTemplate)
      }
      if (val == 1) {
        //??????
        LODOP.PREVIEW()
      } else {
        //??????
        LODOP.PRINT()
      }
    },
    // ??????
    onPrint() {
      // ??????????????????
      let companyName = '123'
      console.log(this.addForm, this.LogisticsList)
      for (let i = 0; i < this.LogisticsList.length; i++) {
        if (this.addForm.LogCompanyCode == this.LogisticsList[i].Code) {
          companyName = this.LogisticsList[i].Name
          break
        }
      }

      if (!this.addForm.Remark) {
        this.addForm.Remark = ''
      }

      const printStr = `<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>`
      // ????????????
      const style = `<style>@page{margin: 1em;}table{font-size:14px;width:100%;}
      table tr th span{display:inline-block;
      white-space:nowrap;}
      table tr th {padding: 5px;-webkit-print-color-adjust: exact;text-align: center;}
      td{text-align: center;}
      table tr td span{display:inline-block;white-space:nowrap;}</style></head>`
      const contentStr1 = `
      <body>
      <h1 style="text-align: center;">?????????</h1>
      <div style="display: flex;
      flex-direction: column;
      text-align: center;
      align-items: flex-end;">
      <div>
      <div>????????????</div>
      <svg id="barcode"></svg>
      </div>
      </div>
      <div>
      <h4>????????????</h4>`
      console.log(this.addForm.PSI_Purchase_Delivery_Ms)
      let tableContent = ``
      this.addForm.PSI_Purchase_Delivery_Ms.forEach((i) => {
        i.PackageNum = i.PackageNum ? i.PackageNum : 0
        tableContent += `
        <tr><td><span>${i.OrderCode}</span></td>
        <td><span>${i.ShopName}</span></td>
        <td><span>${i.ProductCode}</span></td>
        <td><span>${i.ProductName}</span></td>
        <td><span>${i.OrderNum}</span></td>
        <td><span>${i.SendNum}</span></td>
        <td><span>${i.ExpressNumber}</span></td>
        <td><span>${i.PackageNum}</span></td>
        <td><span>${i.UnitName}</span></td>
        <td><span>${i.Remark}</span></td></tr>
        `
      })
      const tableHeader = `
      <table border="1" cellspacing="0">
      <tr><th><span>???????????????</span></th>
      <th><span>????????????</span></th>
      <th><span>????????????</span></th>
      <th><span>????????????</span></th>
      <th><span>???????????????</span></th>
      <th><span>????????????</span></th>
      <th><span>????????????</span></th>
      <th><span>??????</span></th>
      <th><span>??????</span></th>
      <th><span>??????</span></th></tr>
      
      `
      const contentStr2 = `
      </table>
      </div>
      <div style="margin-top: 30px;display: flex;justify-content: space-between;text-align: left;">
      <div style="flex: 1;">???????????????${companyName}</div>
      <div style="flex: 1;">???????????????${new Date()
        .toLocaleString()
        .replaceAll('/', '-')
        .slice(0, 15)}</div>
      <div style="flex: 1;">????????????${localStorage.getItem('ms_username')}</div>
      <div style="flex: 1;">?????????${this.addForm.Remark}</div>
      </div>
      <script>
      JsBarcode("#barcode", '${this.addForm.Code}');
      </script>
      </body>
      </html>
      `
      const content =
        printStr +
        style +
        contentStr1 +
        tableHeader +
        tableContent +
        contentStr2
      let pwin = window.open('_blank')
      pwin.document.write(content)
      pwin.document.close()
      pwin.focus()
      setTimeout(() => {
        pwin.print()
        pwin.close()
      }, 500)
      return
    },
  },
  mounted() {
    func.SearchJudge()
    this.username = localStorage.getItem('ms_username')
    this.eventSearch()
    this.funcGetLogisticsTableData('', '', -1, 1, 10000)
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'DeliveryView') {
        this.permissionsList = item.Rights
      }
    }
    if (localStorage.getItem('userType') == '3') {
      this.isSupplier = true
    }
    this.funcGetInvoiceTemplate()
    this.funcGetBarCodeTemplate()
    this.funcGetShopCodeList()
  },
  watch: {
    isSystem(newVal, oldVal) {
      this.funcGetPrintTableData()
    },
  },
}
