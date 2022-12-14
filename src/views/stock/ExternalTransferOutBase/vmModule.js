import func from '../../func.js'
import basis from '../../../api/basisApi.js'
import stock from '../../../api/stockApi.js'
import JsBarcode from 'jsbarcode'
import $ from 'jquery'
import { getLodop } from '../../LodopFuncs.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { uploadFile, dispatchImport } from '../../../api/apiv2/common'
import RangeDate from '../../../components/rangeDate.vue'
import { revokeDispatch } from '../../../api/apiv2/oldModule.js'
import TaskDetail from '../../../components/TaskDetail.vue'
import ImportDialog from '../../../components/import-component/ImportDialog..vue'
export default {
  name: 'ExternalTransferOutBase',
  components: { RangeDate, TaskDetail, ImportDialog },
  data() {
    return {
      permissionsList: '',
      isShowPosition: localStorage.getItem('isShowPosition'),
      searchForm: {
        searchCondition: {
          checkoutType: 20,
          Product: '',
          InTime: [new Date(), new Date()],
          companyCode: '',
          warehouseCode: '',
          positionCode: '',
          status: '',
          inCompanyCode: '',
          assetNo: '',
        },
        startTime: new Date(),
        endTime: new Date(),
        page: 1,
        pageSize: 15,
        total: 0,
      },
      searchSubFrom: {
        searchCondition: {
          Product: '',
          MatTypeID: '',
          companyCode: '',
          warehouseCode: '',
          positionCode: '',
        },
        page: 1,
        pageSize: 15,
        total: 0,
      },
      SubCategoryTree: [],
      Itemlist: [],
      CompanyList: '',
      InCompanyList: '',
      companyCode: '',
      inCompanyCode: '',
      WarehouseList: '',
      WarehouseSubList: '',
      PositionList: '',
      PositionSubList: '',
      tableData: [],
      dialogVisible: false,
      subDialogVisible: false,
      checkoutNum: '',
      ItemList: [],
      creator: localStorage.getItem('ms_username'),
      outStoreIsdisabled: false,
      UnSelectedItemlist: [],
      tableSelectData: [],
      mainTableSelectData: [],
      dealWithData: [],
      ExCompanyList: [],
      // printObj: {
      //     id: "printMeSub",
      //     popTitle: '',
      //     extraCss: '',
      //     extraHead: '',
      //     beforeOpenCallback(data) {

      //     },
      // },
      Template: '',
      isPrint: true,
      isImportDialog: false,
      fileList: [],
      revokeList: [],
      tipDialogShow: false,
      isItemImportDialogShow: false,
      isTaskDetailShow: false,
      taskId: '',
    }
  },
  methods: {
    // //????????????????????? v-print ??? click????????????????????????
    // funcPrintReady() {
    //     if (this.mainTableSelectData.length == 0) {
    //         $("#Tips").html('?????????????????????');
    //         this.printObj.id = "Tips";
    //         ElMessage.warning({
    //             message: '?????????????????????',
    //             type: 'warning',
    //         });
    //     }
    //     else {
    //         this.printObj.id = "printMeSub";
    //         for(var dwData of this.dealWithData){
    //             if($("#barCode_" + dwData.CheckoutCode).length > 0){
    //                 JsBarcode("#barCode_" + dwData.CheckoutCode, dwData.CheckoutCode);
    //             }
    //         }
    //     }
    // },
    importDialogClose() {
      this.fileList = []
    },
    //??????????????????
    funcGetCompany() {
      var url =
        basis.GetShopCodeList + '?shopCode=' + localStorage.getItem('shopCode')
      this.$axios
        .get(url)
        .then((res) => {
          this.CompanyList = res.data
          if (this.CompanyList.length == 1) {
            this.searchForm.searchCondition.companyCode =
              this.CompanyList[0].Code
            this.companyCode = this.CompanyList[0].Code
          }
          this.GetCheckoutDatas()
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //????????????????????????
    funcGetAllCompany() {
      var url =
        basis.GetNoneShopCodeList +
        '?shopCode=' +
        localStorage.getItem('shopCode')
      this.$axios
        .get(url)
        .then((res) => {
          this.InCompanyList = res.data
          if (this.InCompanyList.length == 1) {
            this.searchForm.searchCondition.inCompanyCode =
              this.InCompanyList[0].Code
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //????????????
    funcGetWarehouseList(type, shopCode) {
      if (shopCode == '') {
        return
      }
      var url = stock.StockManagement.GetWarehouse + '?shopCode=' + shopCode
      this.$axios
        .get(url)
        .then((res) => {
          if (type == 'main') {
            this.WarehouseList = res.data
          } else {
            this.WarehouseSubList = res.data
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //??????????????????
    funcGetWhOrPositionInfo(whCode, type, shopCode) {
      if (shopCode == '') {
        return
      }
      var url =
        basis.WhOrPositionInfo + '?shopCode=' + shopCode + '&whCode=' + whCode
      this.$axios
        .get(url)
        .then((res) => {
          if (type == 'main') {
            this.PositionList = res.data
          } else {
            this.PositionSubList = res.data
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //??????????????????
    GetCheckoutDatas() {
      var status = -1
      if (this.searchForm.searchCondition.status != '') {
        status = this.searchForm.searchCondition.status
      }
      var url =
        stock.StockManagement.GetCheckoutDatas +
        '?productInfo=' +
        encodeURIComponent(this.searchForm.searchCondition.Product) +
        '&whCode=' +
        this.searchForm.searchCondition.warehouseCode +
        '&positionCode=' +
        this.searchForm.searchCondition.positionCode +
        '&startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&assetNo=' +
        this.searchForm.searchCondition.assetNo +
        '&status=' +
        status +
        '&inShopCode=' +
        this.searchForm.searchCondition.inCompanyCode +
        '&shopInfo=' +
        this.searchForm.searchCondition.companyCode +
        '&checkoutType=' +
        this.searchForm.searchCondition.checkoutType +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType') +
        '&page=' +
        this.searchForm.page +
        '&pageSize=' +
        this.searchForm.pageSize +
        '&isTransfer=true'
      this.$axios
        .post(url, [])
        .then((res) => {
          this.tableData = res.data.Results
          this.searchForm.total = res.data.TotalCount
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //??????????????????
    funcGetMatType(shopCode) {
      var url =
        basis.CategoryManagement.tree +
        '?bussinessType=&shopCode=' +
        shopCode +
        '&userType=' +
        localStorage.getItem('userType')
      this.$axios
        .get(url)
        .then((res) => {
          this.SubCategoryTree = func.recursiveCategoryTree(res.data)
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //????????????????????????
    getExCompany() {
      var url =
        basis.LogisticsCompany.query +
        '?name=&code=&status=-1&page=1&pageSize=99999'
      this.$axios
        .get(url)
        .then((res) => {
          this.ExCompanyList = res.data.Results
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //????????????????????????
    funcGetCheckoutProducts(selectedItems) {
      var url =
        stock.StockManagement.GetCheckoutProducts +
        '?whcode=' +
        this.searchSubFrom.searchCondition.warehouseCode +
        '&positionCode=' +
        this.searchSubFrom.searchCondition.positionCode +
        '&matTypeID=' +
        this.searchSubFrom.searchCondition.MatTypeID +
        '&productInfo=' +
        encodeURIComponent(this.searchSubFrom.searchCondition.Product) +
        '&page=' +
        this.searchSubFrom.page +
        '&pageSize=' +
        this.searchSubFrom.pageSize +
        '&shopInfo=' +
        this.searchSubFrom.searchCondition.companyCode +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType') +
        '&trflag=true'
      var list = []
      for (var i = 0; i < selectedItems.length; i++) {
        list.push({ CheckinMIdList: selectedItems[i].CheckinMIdList })
      }
      this.$axios
        .post(url, list)
        .then((res) => {
          this.UnSelectedItemlist = res.data.Results
          this.searchSubFrom.total = res.data.TotalCount
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    funcGetTemplate() {
      var url = basis.getTemplate + '?templateType=' + 2
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
              'LODOP.ADD_PRINT_TEXT(29,41,720,31,"?????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",16);' +
              'LODOP.SET_PRINT_STYLEA(0,"Alignment",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(55,25,172,23,"????????????");' +
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
              'LODOP.ADD_PRINT_TEXT(176,25,82,25,"????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",13);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(209,40,89,23,"???????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(209,111,220,23,OutStoresValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","OutStoresValue");' +
              'LODOP.ADD_PRINT_TEXT(209,340,90,23,"???????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(209,410,220,23,InStoresValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","InStoresValue");' +
              'LODOP.ADD_PRINT_TEXT(247,340,90,23,"???????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(247,410,220,23,CreaterTimeValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","CreaterTimeValue");' +
              'LODOP.ADD_PRINT_TEXT(247,53,90,23,"????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.ADD_PRINT_TEXT(247,111,217,23,CreaterValue);' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",11);' +
              'LODOP.SET_PRINT_STYLEA(0,"ItemType",1);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","CreaterValue");' +
              'LODOP.ADD_PRINT_TEXT(284,25,100,25,"????????????");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontName","??????");' +
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
    eventOpenWindow() {
      this.isPrint = true
      this.Itemlist = []
      this.companyCode = ''
      this.inCompanyCode = ''
      var url = basis.GeneratedNumber + '?tableName=PSI_Store_Checkout&matType='
      this.$axios
        .get(url)
        .then((res) => {
          this.checkoutNum = res.data
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
      this.outStoreIsdisabled = false
      this.dialogVisible = true
    },
    eventSearch() {
      this.GetCheckoutDatas()
    },
    eventReset() {
      this.searchForm = {
        searchCondition: {
          checkoutType: 20,
          Product: '',
          InTime: [new Date(), new Date()],
          companyCode: '',
          warehouseCode: '',
          positionCode: '',
          status: '',
          inCompanyCode: '',
          assetNo: '',
        },
        startTime: new Date(),
        endTime: new Date(),
        page: 1,
        pageSize: 15,
        total: 0,
      }
    },
    doProductSearch() {
      this.$refs.multipleProductTable.clearSelection()
      this.tableSelectData = []
      this.funcGetCheckoutProducts(this.Itemlist)
    },
    eventPageSizeChange(val, type) {
      if (type == 'main') {
        this.searchForm.page = 1
        this.searchForm.pageSize = val
        this.GetCheckoutDatas()
      } else {
        this.searchSubFrom.page = 1
        this.searchSubFrom.pageSize = val
        this.funcGetCheckoutProducts(this.Itemlist)
      }
    },
    eventPageChange(val, type) {
      if (type == 'main') {
        this.searchForm.page = val
        this.GetCheckoutDatas()
      } else {
        this.searchSubFrom.page = val
        this.funcGetCheckoutProducts(this.Itemlist)
      }
    },
    eventMainTableSelect(val) {
      this.mainTableSelectData = val
      this.dealWithData = []
      this.mainTableSelectData.map((item) => {
        var existData = this.dealWithData.find((wdata) => {
          return wdata.CheckoutCode == item.CheckoutCode
        })
        if (existData == undefined) {
          this.dealWithData.push({
            CheckoutCode: item.CheckoutCode,
            OutShopName: item.ShopName,
            InShopName: item.InShopName,
            Creater: item.Creater,
            CreateTime: item.CreateTime,
            GoodsList: [
              {
                ProductCode: item.ProductCode,
                ProductName: item.ProductName,
                UnitName: item.UnitName,
                OutNum: item.OutNum,
                Remark: item.Remark,
              },
            ],
          })
        } else {
          existData.GoodsList.push({
            ProductCode: item.ProductCode,
            ProductName: item.ProductName,
            UnitName: item.UnitName,
            OutNum: item.OutNum,
            Remark: item.Remark,
          })
        }
      })
    },
    funcMainRowClassName({ row, rowIndex }) {
      for (var item of this.mainTableSelectData) {
        if (item == row) {
          return 'rowSelect'
        }
      }
    },
    RemoveItem(index) {
      this.Itemlist.splice(index, 1)
    },
    eventOpenSubWindow() {
      this.tableSelectData = []
      if (this.inCompanyCode == this.companyCode) {
        return ElMessage.warning({
          message: '???????????????????????????????????????',
        })
      }
      if (this.companyCode == '') {
        ElMessage.warning({
          message: '?????????????????????',
          type: 'warning',
        })
        return
      }
      this.funcGetWarehouseList('sub', this.companyCode)
      this.funcGetMatType(this.companyCode)
      this.searchSubFrom = {
        searchCondition: {
          Product: '',
          MatTypeID: '',
          companyCode: this.companyCode,
          warehouseCode: '',
          positionCode: '',
        },
        page: 1,
        pageSize: 15,
        total: 0,
      }
      this.funcGetCheckoutProducts(this.Itemlist)
      this.subDialogVisible = true

      //??????????????????????????????????????????
      func.DialogSearchJudge()
    },
    eventProductSearch() {
      if (
        typeof this.searchSubFrom.searchCondition.MatTypeID != 'string' &&
        this.searchSubFrom.searchCondition.MatTypeID != null
      ) {
        var length = this.searchSubFrom.searchCondition.MatTypeID.length - 1
        this.searchSubFrom.searchCondition.MatTypeID =
          this.searchSubFrom.searchCondition.MatTypeID[length]
      } else if (this.searchSubFrom.searchCondition.MatTypeID == null) {
        this.searchSubFrom.searchCondition.MatTypeID = ''
      }
      this.funcGetCheckoutProducts(this.Itemlist)
    },
    eventProductReset() {
      this.searchSubFrom.searchCondition.MatTypeID = ''
      this.searchSubFrom.searchCondition.warehouseCode = ''
      this.searchSubFrom.searchCondition.positionCode = ''
      this.searchSubFrom.searchCondition.Product = ''
    },
    eventSelect() {
      for (var selectData of this.tableSelectData) {
        selectData.CheckoutSum = 1
        selectData.Remark = ''
        selectData.ExCompanyList = this.ExCompanyList
        selectData.LogComCode1 = ''
        selectData.LogFee1 = 0
        selectData.LogComCode2 = ''
        selectData.LogFee2 = 0
      }
      this.Itemlist = this.Itemlist.concat(this.tableSelectData)
      this.outStoreIsdisabled = true
      this.subDialogVisible = false
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
    eventSave() {
      if (this.companyCode == this.inCompanyCode) {
        ElMessage.warning({
          message: '???????????????????????????????????????',
          type: 'warning',
        })
        return
      }
      if (this.companyCode == '' || this.inCompanyCode == '') {
        ElMessage.warning({
          message: '???????????????????????????????????????',
          type: 'warning',
        })
        return
      }
      var iCCode = this.inCompanyCode
      var iCName = this.InCompanyList.find(function (item) {
        return item.Code == iCCode
      }).Name
      var CCode = this.companyCode
      var CName = this.CompanyList.find(function (item) {
        return item.Code == CCode
      }).Name
      var url = stock.StockManagement.CreateCheckout
      var param = {
        Code: this.checkoutNum,
        CheckoutType: 20,
        OutDate: new Date().toLocaleDateString(),
        Remark: '',
        Creater: this.creator,
        Details: [],
      }
      if (this.Itemlist.length == 0) {
        //???????????????
        this.$message({ message: '???????????????', type: 'warning' })
        return
      }
      for (var i = 0; i < this.Itemlist.length; i++) {
        var CheckinMIdArray = this.Itemlist[i].CheckinMIdList.split(',')
        var CheckinNumArray = this.Itemlist[i].CheckinNumList.split(',')
        var CheckinNumArrayDeal = []
        for (var Num of CheckinNumArray) {
          try {
            var realNum = parseFloat(Num)
            CheckinNumArrayDeal.push(realNum)
          } catch {
            CheckinNumArrayDeal.push(0)
          }
        }
        var needCheckoutNumArray = []
        var OutSum = parseFloat(this.Itemlist[i].CheckoutSum.toString())
        for (var Num of CheckinNumArrayDeal) {
          if (OutSum > Num) {
            //????????????????????????????????????
            //??????????????????
            OutSum = OutSum - Num
            needCheckoutNumArray.push(Num)
          } else {
            //?????????????????????????????????????????????
            //????????????????????????????????????????????????
            needCheckoutNumArray.push(OutSum)
            break
          }
        }
        for (var j = 0; j < needCheckoutNumArray.length; j++) {
          var subRecord = {
            IndexNo: param.Details.length + 1,
            CheckoutCode: this.checkoutNum,
            CheckinMId: CheckinMIdArray[j],
            ProductCode: this.Itemlist[i].ProductCode,
            ProductName: this.Itemlist[i].ProductName,
            InNum: this.Itemlist[i].AllCheckinNum,
            OutNum: needCheckoutNumArray[j],
            UnitId: this.Itemlist[i].UnitId,
            UnitName: this.Itemlist[i].UnitName,
            DeviceId: 0,
            DeviceIds: '',
            UseWay: this.Itemlist[i].UseType,
            NoseNum: '',
            AmountMoney: 0,
            WarehouseCode: this.Itemlist[i].WarehouseCode,
            WarehouseName: this.Itemlist[i].WarehouseName,
            PositionCode: this.Itemlist[i].PositionCode,
            PositionName: this.Itemlist[i].PositionName,
            CategoryId: this.Itemlist[i].CategoryId,
            ShopCode: this.companyCode,
            ShopName: CName,
            InShopCode: this.inCompanyCode,
            InShopName: iCName,
            InWarehouseCode: '',
            InWarehouseName: '',
            InPositionCode: '',
            InPositionName: '',
            Status: 0,
            Remark: this.Itemlist[i].Remark,
            Creater: this.creator,
            Modifier: this.creator,
            ProductId: this.Itemlist[i].ProductId,
            LogComCode1: this.Itemlist[i].LogComCode1,
            LogFee1: this.Itemlist[i].LogFee1,
            LogComCode2: this.Itemlist[i].LogComCode2,
            LogFee2: this.Itemlist[i].LogFee2,
          }
          param.Details.push(subRecord)
        }
      }
      const loading = func.backgroundLoading('?????????...?????????')
      this.$axios
        .post(url, [param])
        .then((res) => {
          loading.close()
          ElMessage.success({
            message: '????????????',
            type: 'success',
          })
          //??????
          if (this.isPrint && this.permissionsList.Print) {
            this.eventPrint(2)
          }

          this.dialogVisible = false
          this.GetCheckoutDatas()
        })
        .catch((err) => {
          loading.close()
          ElMessage.warning({
            message: err,
            type: 'warning',
          })
        })
    },

    //???????????????????????????
    eventPrintTemplate() {
      var OutBoundCode = 'CK11111111111111111'
      var OutStoresValue = '??????????????????'
      var InStoresValue = '??????????????????'
      var CreaterValue = '???????????????'
      var CreaterTimeValue = '??????????????????'
      var Paging =
        '<div style="display:flex;text-align: center;">???<font tdata="PageNO">##</font>???</span>/???<font tdata="PageCount">##</font></span>???</div>'
      var tbody = ''
      for (var i = 1; i <= 50; i++) {
        var str =
          '<tr><td style="padding: 5px 10px; text-align: center;">' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">????????????' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">????????????' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">????????????' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">??????' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">????????????' +
          i +
          '</td><td style="padding: 5px 10px; text-align: center;">??????' +
          i +
          '</td></tr>'
        tbody = tbody + str
      }
      var tableValue =
        '<table border="1" style="border-collapse:collapse; width:100%; font-size:13px; height:auto;"><thead><tr><th style="padding: 5px 10px;">??????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">??????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">??????</th></tr></thead><tbody>' +
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

      eval(this.Template)

      var that = this
      if (LODOP.CVERSION)
        CLODOP.On_Return = function (TaskID, Value) {
          //console.log('Value:' + Value);  //???????????????????????????????????????
          if (LODOP.CVERSION)
            LODOP.On_Return = function (TaskID, Value) {
              that.Template = Value
              //console.log(that.Template);

              var params = {
                TemplateContent: that.Template,
                TemplateType: 2,
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
          that.Template = LODOP.GET_VALUE('ProgramCodes', 1) //??????1???????????????????????????????????????JS??????
        }

      LODOP.PRINT_DESIGN() //????????????????????????????????????????????????
    },
    //???????????????????????????
    eventPrint(val) {
      //this.eventGetEvalStr();

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
        var OutBoundCode = this.checkoutNum
        var OutStoresValue = '??????????????????'
        var InStoresValue = '??????????????????'
        for (var item of this.CompanyList) {
          if (item.Code == this.companyCode) {
            OutStoresValue = item.Name
          }
        }
        for (var item of this.InCompanyList) {
          if (item.Code == this.inCompanyCode) {
            InStoresValue = item.Name
          }
        }
        var CreaterValue = localStorage.getItem('ms_username')
        var CreaterTimeValue = new Date().toLocaleDateString()
        var Paging =
          '<div style="display:flex;text-align: center;">???<font tdata="PageNO">##</font>???</span>/???<font tdata="PageCount">##</font></span>???</div>'
        var tbody = ''
        var tableData = this.Itemlist
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
            tableData[i].UnitName +
            '</td><td style="padding: 5px 10px; text-align: center;">' +
            tableData[i].CheckoutSum +
            '</td><td style="padding: 5px 10px; text-align: center;">' +
            tableData[i].Remark +
            '</td></tr>'
          tbody = tbody + str
        }
        var tableValue =
          '<table border="1" style="border-collapse:collapse; width:100%; font-size:13px; height:auto;"><thead><tr><th style="padding: 5px 10px;">??????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">??????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">??????</th></tr></thead><tbody>' +
          tbody +
          '</tbody></table>'
        console.log(
          OutBoundCode,
          OutStoresValue,
          InStoresValue,
          CreaterValue,
          CreaterTimeValue,
          Paging,
          tableValue
        )
        console.clear()
        LODOP.NewPageA()
        eval(this.Template)
      }
      if (val == 1) {
        //??????
        LODOP.PREVIEW()
      } else {
        //??????
        LODOP.PRINT()
      }
    },
    //js??????????????????
    eventGetEvalStr() {},
    //?????????????????????
    eventPrintList() {
      if (this.mainTableSelectData.length == 0) {
        this.$message({ message: '????????????', type: 'warning' })
        return
      } else {
        var codes = []
        for (var item of this.mainTableSelectData) {
          codes.push(item.CheckoutCode)
        }
        codes = Array.from(new Set(codes))
        var url = stock.StockManagement.getTransfersList
        this.$axios
          .post(url, codes)
          .then((res) => {
            //console.log(res.data);

            var LODOP = getLodop()
            if (!LODOP) {
              setTimeout(function () {
                ElMessage.warning({
                  message:
                    '??????????????????????????????C-Lpdop???????????????????????????C-Lodop???',
                  type: 'warning',
                })
              }, 100)
              return
            }
            LODOP.PRINT_INIT('')
            for (var item of res.data) {
              var OutBoundCode = item.CheckoutCode
              var OutStoresValue = item.ShopName
              var InStoresValue = item.InShopName
              var CreaterValue = item.Creater
              var CreaterTimeValue = item.CreateTime
              var Paging =
                '<div style="display:flex;text-align: center;">???<font tdata="PageNO">##</font>???</span>/???<font tdata="PageCount">##</font></span>???</div>'
              var tbody = ''
              var tableData = item.PrintDetails
              for (var i = 0; i <= tableData.length - 1; i++) {
                var str =
                  '<tr><td style="padding: 5px 10px; text-align: center;">' +
                  (i + 1) +
                  '</td><td style="padding: 5px 10px; text-align: center;">' +
                  tableData[i].ProductCode +
                  '</td><td style="padding: 5px 10px; text-align: center;">' +
                  tableData[i].ProductName +
                  '</td><td style="padding: 5px 10px; text-align: center;">' +
                  tableData[i].AssetNo +
                  '</td><td style="padding: 5px 10px; text-align: center;">' +
                  tableData[i].UnitName +
                  '</td><td style="padding: 5px 10px; text-align: center;">' +
                  tableData[i].OutNum +
                  '</td><td style="padding: 5px 10px; text-align: center;">' +
                  tableData[i].Remark +
                  '</td></tr>'
                tbody = tbody + str
              }
              var tableValue =
                '<table border="1" style="border-collapse:collapse; width:100%; font-size:13px; height:auto;"><thead><tr><th style="padding: 5px 10px;">??????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">??????</th><th style="padding: 5px 10px;">????????????</th><th style="padding: 5px 10px;">??????</th></tr></thead><tbody>' +
                tbody +
                '</tbody></table>'

              console.log(
                OutBoundCode,
                OutStoresValue,
                InStoresValue,
                CreaterValue,
                CreaterTimeValue,
                Paging,
                tableValue
              )
              console.clear()
              LODOP.NewPageA()
              eval(this.Template)
              LODOP.PRINT()
            }

            //??????
            //LODOP.PREVIEW();
            //??????
            //LODOP.PRINT();
          })
          .catch((err) => {
            this.$message({ message: err, type: 'warning' })
          })
      }
    },
    // ????????????
    async chooseFiles(e) {
      if (this.fileList.length == 1) {
        return ElMessage.warning('??????????????????????????????')
      }
      const files = this.$refs.inputFile.files
      for (let i = 0; i < files.length; i++) {
        this.fileList.push({
          key: i,
          name: files[i].name,
          file: files[i],
        })
      }
      e.target.value = ''
    },
    // ??????????????????????????????
    deleteFile(key) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].key == key) {
          this.fileList.splice(i, 1)
          return
        }
      }
    },
    // ??????
    async onImport() {
      if (this.fileList.length == 0) {
        return ElMessage.warning('???????????????')
      }
      const loading = func.backgroundLoading('?????????????????????????????????')
      let formData = new FormData()
      formData.append('file', this.fileList[0].file)
      try {
        const res = await uploadFile(formData)
        const importRes = await dispatchImport({
          OrgId: localStorage.getItem('OrganizationId'),
          Creater: localStorage.getItem('ms_username'),
          FilePath: res.data,
          IsOverride: 0,
        })
        loading.close()
        if (typeof importRes.data == 'string') {
          //?????????
          const file = await downloadFile(importRes.data)
          // ?????????
          let fileName = importRes.data.split('_').pop()
          // ????????????a??????
          let link = document.createElement('a')
          // ????????????????????????
          link.href = window.URL.createObjectURL(file)
          // ???????????????
          link.download = fileName
          // ????????????a??????
          link.click()
          // ????????????
          window.URL.revokeObjectURL(link.href)
          ElMessage.warning({
            message: '????????????????????????????????????????????????????????????',
            type: 'warning',
          })
        } else {
          ElMessage.success({ message: '????????????', type: 'success' })
          this.isImportDialog = false
          this.eventSearch()
        }
      } catch (err) {
        this.fileList = []
        loading.close()
        return
      }
    },
    // ????????????
    eventExportTemplate() {
      window.location.href = './export/????????????.xlsx'
    },
    // ??????
    async onRevoke() {
      this.revokeList = []
      for (let i = 0, len = this.mainTableSelectData.length; i < len; i++) {
        let item = this.mainTableSelectData[i]
        if (item.Status != 1) {
          ElMessage.warning('?????????????????????????????????????????????????????????????????????!')
          return
        }
        this.revokeList.push(item.Id)
      }
      this.tipDialogShow = true
    },
    // ??????????????????
    async confirmRevoke() {
      await revokeDispatch(this.revokeList)
      ElMessage.success('????????????')
      this.tipDialogShow = false
      this.eventSearch()
    },
    // ??????
    onItemImport() {
      this.isItemImportDialogShow = true
    },

    handelUploadSuccess(id) {
      this.taskId = id
      this.isItemImportDialogShow = false
      this.isTaskDetailShow = true
    },
  },
  mounted() {
    func.SearchJudge()
    this.funcGetCompany()
    this.funcGetAllCompany()
    // this.GetCheckoutDatas();
    var AllPromossions = JSON.parse(localStorage.getItem('permissions'))
    this.permissionsList = AllPromossions.find(function (item) {
      return item.ModuleUrl == 'ExternalTransferOutBase'
    }).Rights
    this.funcGetTemplate()
    this.getExCompany()
    this.mittBus.on('close-detail', () => {
      this.isTaskDetailShow = false
    })
    this.mittBus.on('on-dispatch-refresh', () => {
      this.eventSearch()
    })
  },
  watch: {
    'searchForm.searchCondition.warehouseCode'(newVal, oldVal) {
      this.searchForm.searchCondition.positionCode = ''
      this.PositionList = []
      this.funcGetWhOrPositionInfo(
        newVal,
        'main',
        this.searchForm.searchCondition.companyCode
      ) //??????????????????
    },
    'searchSubFrom.searchCondition.warehouseCode'(newVal, oldVal) {
      this.searchSubFrom.searchCondition.positionCode = ''
      this.PositionSubList = []
      this.funcGetWhOrPositionInfo(newVal, 'sub', this.companyCode) //??????????????????
    },
    'searchForm.searchCondition.companyCode'(newVal, oldVal) {
      this.searchForm.searchCondition.positionCode = ''
      this.PositionList = []
      this.searchForm.searchCondition.WarehouseCode = ''
      this.WarehouseList = []
      if (newVal != '') {
        this.funcGetWarehouseList('main', newVal)
      }
    },
  },
}
