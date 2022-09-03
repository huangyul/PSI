import func from '../../func.js'
import basis from '../../../api/basisApi.js'
import stock from '../../../api/stockApi.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import RangeDate from '../../../components/rangeDate.vue'
export default {
  name: 'StoreTransfer',
  components: { RangeDate },
  data() {
    return {
      permissionsList: '',
      isShowPosition: localStorage.getItem('isShowPosition'),
      searchForm: {
        searchCondition: {
          checkoutType: 21,
          Product: '',
          matTypeID: '',
          InTime: [new Date(), new Date()],
          companyCode: '',
          warehouseCode: '',
          inwarehouseCode: '',
          positionCode: '',
          inpositionCode: '',
          checkoutCode: '',
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
      Itemlist: [],
      CategoryTree: [],
      CompanyList: '',
      companyCode: '',
      WarehouseList: '',
      WarehouseSubList: '',
      dialogWarehouseList: '',
      PositionList: '',
      inPositionList: '',
      PositionSubList: '',
      dialogPositionList: '',
      tableData: [],
      dialogVisible: false,
      subDialogVisible: false,
      checkoutNum: '',
      ItemList: [],
      creator: localStorage.getItem('ms_username'),
      outStoreIsdisabled: false,
      UnSelectedItemlist: [],
      tableSelectData: [],
      inWarehouseCode: '',
      inPositionCode: '',
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
    //获取仓库
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
          } else if (type == 'dialog') {
            this.dialogWarehouseList = res.data
          } else {
            this.WarehouseSubList = res.data
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取仓位列表
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
          } else if (type == 'mainIn') {
            this.inPositionList = res.data
          } else if (type == 'dialog') {
            this.dialogPositionList = res.data
          } else {
            this.PositionSubList = res.data
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取出库列表
    GetCheckoutDatas() {
      var url =
        stock.StockManagement.GetCheckoutDatas +
        '?productInfo=' +
        this.searchForm.searchCondition.Product +
        '&whCode=' +
        this.searchForm.searchCondition.warehouseCode +
        '&positionCode=' +
        this.searchForm.searchCondition.positionCode +
        '&inWhCode=' +
        this.searchForm.searchCondition.inwarehouseCode +
        '&inPositionCode=' +
        this.searchForm.searchCondition.inpositionCode +
        '&startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&matTypeId=' +
        this.searchForm.searchCondition.matTypeID +
        '&inShopCode=' +
        this.searchForm.searchCondition.companyCode +
        '&checkoutType=' +
        this.searchForm.searchCondition.checkoutType +
        '&checkoutCode=' +
        this.searchForm.searchCondition.checkoutCode +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType') +
        '&page=' +
        this.searchForm.page +
        '&pageSize=' +
        this.searchForm.pageSize
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
    //获取商品类别
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
          this.CategoryTree = func.recursiveCategoryTree(res.data)
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取未选择的商品
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
        this.searchSubFrom.searchCondition.Product +
        '&page=' +
        this.searchSubFrom.page +
        '&pageSize=' +
        this.searchSubFrom.pageSize +
        '&shopInfo=' +
        this.searchSubFrom.searchCondition.companyCode +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType')
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
    eventOpenWindow() {
      this.Itemlist = []
      this.companyCode = ''
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
      if (
        typeof this.searchForm.searchCondition.matTypeID != 'string' &&
        this.searchForm.searchCondition.matTypeID != null
      ) {
        var length = this.searchForm.searchCondition.matTypeID.length - 1
        this.searchForm.searchCondition.matTypeID =
          this.searchForm.searchCondition.matTypeID[length]
      } else if (this.searchForm.searchCondition.matTypeID == null) {
        this.searchForm.searchCondition.matTypeID = ''
      }
      this.GetCheckoutDatas()
    },
    eventReset() {
      this.searchForm = {
        searchCondition: {
          checkoutType: 21,
          Product: '',
          InTime: [new Date(), new Date()],
          matTypeID: '',
          companyCode: '',
          warehouseCode: '',
          inwarehouseCode: '',
          positionCode: '',
          inpositionCode: '',
          checkoutCode: '',
        },
        startTime: new Date(),
        endTime: new Date(),
        page: 1,
        pageSize: 15,
        total: 0,
      }
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
    RemoveItem(index) {
      this.Itemlist.splice(index, 1)
    },
    eventOpenSubWindow() {
      if (this.companyCode == '') {
        ElMessage.warning({
          message: '请选选择门店名称',
          type: 'warning',
        })
        return
      }
      this.funcGetWarehouseList('sub', this.companyCode)
      //this.funcGetMatType(this.companyCode);
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

      //弹窗根据搜索条件数量改变样式
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
      this.searchSubFrom.searchCondition.Product = ''
      this.searchSubFrom.searchCondition.warehouseCode = ''
      this.searchSubFrom.searchCondition.positionCode = ''
    },
    eventSelect() {
      for (var selectData of this.tableSelectData) {
        selectData.CheckoutSum = 1
        selectData.Remark = ''
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
      if (this.companyCode == '') {
        ElMessage.warning({
          message: '门店名称不能为空',
          type: 'warning',
        })
        return
      }
      if (this.Itemlist.length == 0) {
        //没有商品时
        this.$message({ message: '请选择商品', type: 'warning' })
        return
      }
      if (this.inWarehouseCode == '') {
        ElMessage.warning({
          message: '转入仓库不能为空',
          type: 'warning',
        })
        return
      }
      if (this.inPositionCode == '' && this.isShowPosition == '1') {
        ElMessage.warning({
          message: '转入仓位不能为空',
          type: 'warning',
        })
        return
      }
      var CCode = this.companyCode
      var CName = this.CompanyList.find(function (item) {
        return item.Code == CCode
      }).Name

      var WCode = this.inWarehouseCode
      var WName = this.dialogWarehouseList.find(function (item) {
        return item.Code == WCode
      }).Name

      var PCode = this.inPositionCode
      var PName = ''
      if (this.isShowPosition == '1') {
        PName = this.dialogPositionList.find(function (item) {
          return item.Code == PCode
        }).Name
      }
      var url = stock.StockManagement.CreateCheckout
      var param = {
        Code: this.checkoutNum,
        CheckoutType: 21,
        OutDate: new Date().toLocaleDateString(),
        Remark: '',
        Creater: this.creator,
        Details: [],
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
            //剩余总数大于某个入库数量
            //减去剩余总数
            OutSum = OutSum - Num
            needCheckoutNumArray.push(Num)
          } else {
            //剩余总数小于或等于某个入库数量
            //把剩余总量添加到列表，并退出循环
            needCheckoutNumArray.push(OutSum)
            break
          }
        }
        for (var j = 0; j < needCheckoutNumArray.length; j++) {
          // if (this.Itemlist[i].AllCheckinNum < needCheckoutNumArray[j]) {
          //   return ElMessage.success({
          //     message: '出库数量不能大于在库数量',
          //     type: 'warning',
          //   })
          // }
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
            InShopCode: this.companyCode,
            InShopName: CName,
            InWarehouseCode: this.inWarehouseCode,
            InWarehouseName: WName,
            InPositionCode: this.inPositionCode,
            InPositionName: PName,
            Status: 0,
            Remark: this.Itemlist[i].Remark,
            Creater: this.creator,
            Modifier: this.creator,
            ProductId: this.Itemlist[i].ProductId,
          }
          param.Details.push(subRecord)
        }
      }
      for (var detail of param.Details) {
        if (
          detail.PositionCode == this.inPositionCode &&
          this.isShowPosition == '1'
        ) {
          ElMessage.warning({
            message: '存在与入库仓位相同仓位的商品',
            type: 'warning',
          })
          return
        }

        if (
          detail.WarehouseCode == this.inWarehouseCode &&
          this.isShowPosition != '1'
        ) {
          ElMessage.warning({
            message: '存在与入库仓库相同仓库的商品',
            type: 'warning',
          })
          return
        }
      }
      const loading = func.backgroundLoading('转仓中...请稍后')
      this.$axios
        .post(url, [param])
        .then((res) => {
          loading.close()
          ElMessage.success({
            message: '转仓成功',
            type: 'success',
          })
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
  },
  mounted() {
    func.SearchJudge()
    this.funcGetCompany()
    // this.GetCheckoutDatas();
    this.funcGetMatType(localStorage.getItem('shopCode'))
    var AllPromossions = JSON.parse(localStorage.getItem('permissions'))
    this.permissionsList = AllPromossions.find(function (item) {
      return item.ModuleUrl == 'StoreTransfer'
    }).Rights
  },
  watch: {
    'searchForm.searchCondition.companyCode'(newVal, oldVal) {
      this.WarehouseList = []
      this.searchForm.searchCondition.warehouseCode = ''
      this.searchForm.searchCondition.inwarehouseCode = ''
      this.PositionList = []
      this.searchForm.searchCondition.positionCode = ''
      this.inPositionList = []
      this.searchForm.searchCondition.inpositionCode = ''
      // this.searchForm.searchCondition.matTypeID = '';
      this.tempMatTypeList = []
      if (newVal != '') {
        //this.funcGetMatType(newVal);
        this.funcGetWarehouseList('main', newVal)
      }
    },
    'searchForm.searchCondition.warehouseCode'(newVal, oldVal) {
      this.searchForm.searchCondition.positionCode = ''
      this.PositionList = []
      this.funcGetWhOrPositionInfo(
        newVal,
        'main',
        this.searchForm.searchCondition.companyCode
      ) //获取仓位列表
    },
    'searchForm.searchCondition.inwarehouseCode'(newVal, oldVal) {
      this.searchForm.searchCondition.inpositionCode = ''
      this.inPositionList = []
      this.funcGetWhOrPositionInfo(
        newVal,
        'mainIn',
        this.searchForm.searchCondition.companyCode
      ) //获取仓位列表
    },
    'searchSubFrom.searchCondition.warehouseCode'(newVal, oldVal) {
      this.searchSubFrom.searchCondition.positionCode = ''
      this.PositionSubList = []
      this.funcGetWhOrPositionInfo(newVal, 'sub', this.companyCode) //获取仓位列表
    },
    companyCode(newVal, oldVal) {
      this.dialogWarehouseList = []
      this.dialogPositionList = []
      this.inWarehouseCode = ''
      this.inPositionCode = ''
      this.funcGetWarehouseList('dialog', newVal)
    },
    inWarehouseCode(newVal, oldVal) {
      this.inPositionCode = ''
      this.dialogPositionList = []
      this.funcGetWhOrPositionInfo(newVal, 'dialog', this.companyCode) //获取仓位列表
    },
  },
}
