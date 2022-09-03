import func from '../../func.js'
import basis from '../../../api/basisApi.js'
import stock from '../../../api/stockApi.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import RangeDate from '../../../components/rangeDate.vue'
export default {
  name: 'SceneOutBase',
  components: { RangeDate },
  data() {
    return {
      permissionsList: '',
      isShowPosition: localStorage.getItem('isShowPosition'),
      searchForm: {
        searchCondition: {
          checkoutType: 0,
          Product: '',
          InTime: [new Date(), new Date()],
          startTime: '',
          endTime: '',
          companyCode: '',
          warehouseCode: '',
          positionCode: '',
          AssNum: '',
          noseNum: '',
          useWay: '',
        },
        page: 1,
        pageSize: 15,
        total: 0,
      },
      searchSubFrom: {
        searchCondition: {
          Product: '',
          MatTypeID: '',
          assetNoForSearch: '',
          warehouseCode: '',
          positionCode: '',
        },
        page: 1,
        pageSize: 15,
        total: 0,
      },
      Itemlist: [],
      useWayList: '',
      CompanyList: '',
      companyCode: '',
      useWay: '',
      subDialoguseWayList: '',
      assetNoForSearch: '',
      assetNoList: '',
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
      StoreIsdisabled: false,
      UnSelectedItemlist: [],
      tableSelectData: [],
      CategoryTree: [],
    }
  },
  methods: {
    //获取物品去向
    funcGetuseWay(shopCode) {
      var url = basis.GetMachineList + '?shopCode=' + shopCode
      this.$axios
        .get(url)
        .then((res) => {
          this.useWayList = res.data
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取deviceCode
    funcGetuseWayDeviceCode(shopCode) {
      if (shopCode == '') {
        return
      }
      var url = basis.GetMachineNameList + '?shopCode=' + shopCode
      this.$axios
        .get(url)
        .then((res) => {
          this.subDialoguseWayList = res.data
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
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
      var devId = '0'
      if (this.searchForm.searchCondition.useWay != '') {
        devId = this.searchForm.searchCondition.useWay
      }
      var url =
        stock.StockManagement.GetCheckoutDatas +
        '?productInfo=' +
        this.searchForm.searchCondition.Product +
        '&whCode=' +
        this.searchForm.searchCondition.warehouseCode +
        '&positionCode=' +
        this.searchForm.searchCondition.positionCode +
        '&startTime=' +
        this.searchForm.searchCondition.startTime +
        '&endTime=' +
        this.searchForm.searchCondition.endTime +
        '&deviceId=' +
        devId +
        '&assetNo=' +
        this.searchForm.searchCondition.AssNum +
        '&noseNum=' +
        this.searchForm.searchCondition.noseNum +
        '&inShopCode=' +
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
    funcGetMatType(shopCode, DeviceId) {
      var url =
        basis.CategoryManagement.tree +
        '?bussinessType=K&shopCode=' +
        shopCode +
        '&userType=' +
        localStorage.getItem('userType')
      this.$axios
        .get(url)
        .then((res) => {
          this.CategoryTree = func.recursiveCategoryTree(res.data)
          var url1 =
            basis.MachineAndLandscape.getMaxMatTypeId + '?deviceId=' + DeviceId
          this.$axios
            .get(url1)
            .then((res) => {
              if (res.data == '') {
                this.searchSubFrom.searchCondition.MatTypeID =
                  this.CategoryTree[0].Id
              } else {
                this.searchSubFrom.searchCondition.MatTypeID = res.data
              }
              this.funcGetCheckoutProducts(this.Itemlist)
            })
            .catch((err) => {
              this.$message({ message: err, type: 'warning' })
            })
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
        '&assetNum=' +
        this.searchSubFrom.searchCondition.assetNoForSearch +
        '&page=' +
        this.searchSubFrom.page +
        '&pageSize=' +
        this.searchSubFrom.pageSize +
        '&shopInfo=' +
        this.companyCode +
        '&isSale=true' +
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
      this.StoreIsdisabled = false
      this.dialogVisible = true
    },
    eventSearch() {
      this.GetCheckoutDatas()
    },
    eventReset() {
      this.searchForm = {
        searchCondition: {
          checkoutType: 0,
          Product: '',
          InTime: [new Date(), new Date()],
          startTime: new Date(),
          endTime: new Date(),
          companyCode: '',
          warehouseCode: '',
          positionCode: '',
          useWay: '',
          AssNum: '',
          noseNum: '',
        },
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
    RemoveItem(index) {
      this.Itemlist.splice(index, 1)
    },
    eventOpenSubWindow() {
      this.tableSelectData = []
      if (
        this.companyCode == '' ||
        this.useWay == '' ||
        this.assetNoForSearch == ''
      ) {
        ElMessage.warning({
          message: '请先选择门店/出库机器/固定资产编号！',
          type: 'warning',
        })
        return
      }
      this.funcGetWarehouseList('sub', this.companyCode)
      this.searchSubFrom = {
        searchCondition: {
          Product: '',
          MatTypeID: '',
          assetNoForSearch: this.assetNoForSearch,
          warehouseCode: '',
          positionCode: '',
        },
        page: 1,
        pageSize: 15,
        total: 0,
      }
      var assSearch = this.assetNoForSearch
      var DeviceId = this.assetNoList.find(function (item) {
        return item.AssetNum == assSearch
      }).Id
      this.funcGetMatType(this.companyCode, DeviceId)
      this.subDialogVisible = true

      //弹窗根据搜索条件数量改变样式
      func.DialogSearchJudge()
    },
    eventProductSearch() {
      if (!this.searchSubFrom.searchCondition.MatTypeID) {
        this.searchSubFrom.searchCondition.MatTypeID = ''
      }
      if (
        typeof this.searchSubFrom.searchCondition.MatTypeID != 'string' &&
        this.searchSubFrom.searchCondition.MatTypeID != null
      ) {
        var length = this.searchSubFrom.searchCondition.MatTypeID.length - 1
        this.searchSubFrom.searchCondition.MatTypeID =
          this.searchSubFrom.searchCondition.MatTypeID[length]
      } else if (
        typeof this.searchSubFrom.searchCondition.MatTypeID == 'string' &&
        this.searchSubFrom.searchCondition.MatTypeID != ''
      ) {
      } else {
        this.searchSubFrom.searchCondition.MatTypeID = this.CategoryTree[0].Id
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
        selectData.NoseNum = 'A'
        selectData.Remark = ''
      }
      this.Itemlist = this.Itemlist.concat(this.tableSelectData)
      this.StoreIsdisabled = true
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
      if (this.Itemlist.length == 0) {
        //没有商品时
        this.$message({ message: '请选择商品', type: 'warning' })
        return
      }
      var CCode = this.companyCode
      var CName = this.CompanyList.find(function (item) {
        return item.Code == CCode
      }).Name
      var url = stock.StockManagement.CreateCheckout
      var param = {
        Code: this.checkoutNum,
        CheckoutType: 0,
        OutDate: new Date().toLocaleDateString(),
        Remark: '',
        Creater: this.creator,
        Details: [],
      }
      var assSearch = this.assetNoForSearch
      var DeviceId = this.assetNoList.find(function (item) {
        return item.AssetNum == assSearch
      }).Id
      var usewayValue = this.useWay
      var submitUseWay = this.subDialoguseWayList.find(function (item) {
        return item.DeviceCode == usewayValue
      }).DeviceName
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
            DeviceId: DeviceId,
            DeviceIds: '',
            UseWay: submitUseWay,
            NoseNum: this.Itemlist[i].NoseNum,
            AmountMoney: 0,
            WarehouseCode: this.Itemlist[i].WarehouseCode,
            WarehouseName: this.Itemlist[i].WarehouseName,
            PositionCode: this.Itemlist[i].PositionCode,
            PositionName: this.Itemlist[i].PositionName,
            CategoryId: this.Itemlist[i].CategoryId,
            ShopCode: this.companyCode,
            ShopName: CName,
            InWarehouseCode: '',
            InWarehouseName: '',
            InPositionCode: '',
            InPositionName: '',
            Status: 0,
            Remark: this.Itemlist[i].Remark,
            Creater: this.creator,
            Modifier: this.creator,
            ProductId: this.Itemlist[i].ProductId,
          }
          param.Details.push(subRecord)
        }
      }

      //console.log([param]);return;
      const loading = func.backgroundLoading('Loading')
      this.$axios
        .post(url, [param])
        .then((res) => {
          loading.close()
          ElMessage.success({
            message: '出库成功',
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
    var AllPromossions = JSON.parse(localStorage.getItem('permissions'))
    this.permissionsList = AllPromossions.find(function (item) {
      return item.ModuleUrl == 'SceneOutBase'
    }).Rights
    this.searchForm.searchCondition.startTime = new Date()
    this.searchForm.searchCondition.endTime = new Date()
  },
  watch: {
    'searchForm.searchCondition.warehouseCode'(newVal, oldVal) {
      this.searchForm.searchCondition.positionCode = ''
      this.PositionList = []
      this.funcGetWhOrPositionInfo(
        newVal,
        'main',
        this.searchForm.searchCondition.companyCode
      ) //获取仓位列表
    },
    'searchSubFrom.searchCondition.warehouseCode'(newVal, oldVal) {
      this.searchSubFrom.searchCondition.positionCode = ''
      this.PositionSubList = []
      this.funcGetWhOrPositionInfo(newVal, 'sub', this.companyCode) //获取仓位列表
    },
    companyCode(newVal, oldVal) {
      this.useWay = ''
      this.funcGetuseWayDeviceCode(newVal)
    },
    useWay(newVal, oldVal) {
      this.assetNoForSearch = ''
      if (newVal != '') {
        var url =
          basis.GetMachineAssetNumList +
          '?shopCode=' +
          this.companyCode +
          '&deviceCode=' +
          this.useWay
        this.$axios
          .get(url)
          .then((res) => {
            this.assetNoList = res.data
          })
          .catch((err) => {
            this.$message({ message: err, type: 'warning' })
          })
      }
    },
    'searchForm.searchCondition.companyCode'(newVal, oldVal) {
      this.searchForm.searchCondition.warehouseCode = ''
      this.WarehouseList = []
      this.searchForm.searchCondition.positionCode = ''
      this.PositionList = []
      this.searchForm.searchCondition.useWay = ''
      this.useWayList = []
      if (newVal != '') {
        this.funcGetWarehouseList('main', newVal)
        this.funcGetuseWay(newVal)
      }
    },
  },
}
