import func from '../../func.js'
import basis from '../../../api/basisApi.js'
import stock from '../../../api/stockApi.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import RangeDate from '../../../components/rangeDate.vue'
export default {
  name: 'ScrapOutBase',
  components: { RangeDate },
  data() {
    return {
      permissionsList: '',
      isShowPosition: localStorage.getItem('isShowPosition'),
      searchForm: {
        searchCondition: {
          checkoutType: 4,
          Machine: '',
          AssetNum: '',
          InTime: [new Date(), new Date()],
          companyCode: '',
          warehouseCode: '',
          positionCode: '',
        },
        startTime: new Date(),
        endTime: new Date(),
        page: 1,
        pageSize: 15,
        total: 0,
      },
      searchSubFrom: {
        searchCondition: {
          Machine: '',
          AssetNum: '',
          companyCode: '',
          warehouseCode: '',
          positionCode: '',
          MatTypeID: '',
        },
        page: 1,
        pageSize: 15,
        total: 0,
      },
      Itemlist: [],
      CompanyList: '',
      companyCode: '',
      WarehouseList: '',
      WarehouseSubList: '',
      PositionList: '',
      PositionSubList: '',
      tableData: [],
      dialogVisible: false,
      subDialogVisible: false,
      checkoutNum: '',
      creator: localStorage.getItem('ms_username'),
      storeIsdisabled: false,
      UnSelectedItemlist: [],
      tableSelectData: [],
      CategoryTree: [],
    }
  },
  methods: {
    //获取品类信息表
    funcGetMatType(shopCode) {
      var url =
        basis.CategoryManagement.tree +
        '?bussinessType=M&shopCode=' +
        shopCode +
        '&userType=' +
        localStorage.getItem('userType')
      this.$axios
        .get(url)
        .then((res) => {
          this.CategoryTree = func.recursiveCategoryTree(res.data)
          // this.searchSubFrom.searchCondition.MatTypeID = this.CategoryTree[0].Id
          this.funcGetCheckoutProducts(this.Itemlist)
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
      var url =
        stock.StockManagement.GetWarehouse +
        '?shopCode=' +
        shopCode +
        '&isBFFlag=true'
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
      var url =
        stock.StockManagement.GetCheckoutDatas +
        '?productInfo=' +
        this.searchForm.searchCondition.Machine +
        '&whCode=' +
        this.searchForm.searchCondition.warehouseCode +
        '&positionCode=' +
        this.searchForm.searchCondition.positionCode +
        '&startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&assetNo=' +
        this.searchForm.searchCondition.AssetNum +
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
    //获取未选择的商品
    funcGetCheckoutProducts(selectedItems) {
      const len = this.searchSubFrom.searchCondition.MatTypeID?.length
      let matTypeID = this.searchSubFrom.searchCondition.MatTypeID
        ? this.searchSubFrom.searchCondition.MatTypeID[len - 1]
        : ''
      var url =
        stock.StockManagement.GetCheckoutProducts +
        '?whcode=' +
        this.searchSubFrom.searchCondition.warehouseCode +
        '&positionCode=' +
        this.searchSubFrom.searchCondition.positionCode +
        '&matTypeID=' +
        matTypeID +
        '&strJoin=false' +
        '&productInfo=' +
        this.searchSubFrom.searchCondition.Machine +
        '&assetNum=' +
        this.searchSubFrom.searchCondition.AssetNum +
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
        '&isBFFlag=true'
      var list = []
      for (var i = 0; i < selectedItems.length; i++) {
        list.push({ CheckinMIdList: selectedItems[i].CheckinMId })
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
    eventReset() {
      this.searchForm = {
        searchCondition: {
          checkoutType: 4,
          Machine: '',
          AssetNum: '',
          InTime: [new Date(), new Date()],
          companyCode: '',
          warehouseCode: '',
          positionCode: '',
        },
        startTime: new Date(),
        endTime: new Date(),
        page: 1,
        pageSize: 15,
        total: 0,
      }
    },
    eventSearch() {
      this.GetCheckoutDatas()
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
      this.storeIsdisabled = false
      this.dialogVisible = true
    },
    eventSave() {
      var CCode = this.companyCode
      var CName = this.CompanyList.find(function (item) {
        return item.Code == CCode
      }).Name
      var url = stock.StockManagement.CreateCheckout
      var param = {
        Code: this.checkoutNum,
        CheckoutType: 4,
        OutDate: new Date().toLocaleDateString(),
        Remark: '',
        Creater: this.creator,
        Details: [],
      }
      if (this.Itemlist.length == 0) {
        //没有商品时
        loading.close()
        this.$message({ message: '请选择商品', type: 'warning' })
        return
      }
      for (var i = 0; i < this.Itemlist.length; i++) {
        if (
          this.Itemlist[i].AmountMoney == undefined ||
          this.Itemlist[i].AmountMoney == ''
        ) {
          this.Itemlist[i].AmountMoney = 0
        }
        var subRecord = {
          IndexNo: param.Details.length + 1,
          CheckoutCode: this.checkoutNum,
          CheckinMId: this.Itemlist[i].CheckinMId,
          ProductCode: this.Itemlist[i].ProductCode,
          ProductName: this.Itemlist[i].ProductName,
          InNum: this.Itemlist[i].StockNum,
          OutNum: 1,
          UnitId: this.Itemlist[i].UnitId,
          UnitName: this.Itemlist[i].UnitName,
          DeviceId: 0,
          DeviceIds: '',
          UseWay: this.Itemlist[i].UseType,
          NoseNum: '',
          AmountMoney: this.Itemlist[i].AmountMoney,
          WarehouseCode: this.Itemlist[i].WarehouseCode,
          WarehouseName: this.Itemlist[i].WarehouseName,
          PositionCode: this.Itemlist[i].PositionCode,
          PositionName: this.Itemlist[i].PositionName,
          CategoryId: this.Itemlist[i].CategoryId,
          ShopCode: this.companyCode,
          ShopName: CName,
          InShopCode: '',
          InShopName: '',
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
      const loading = func.backgroundLoading('报废提交中...请稍后')
      this.$axios
        .post(url, [param])
        .then((res) => {
          loading.close()
          ElMessage.success({
            message: '报废成功',
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
    RemoveItem(index) {
      this.Itemlist.splice(index, 1)
    },
    eventOpenSubWindow() {
      this.tableSelectData = []
      if (this.companyCode == '') {
        ElMessage.warning({
          message: '请选选择门店名称',
          type: 'warning',
        })
        return
      }
      this.funcGetWarehouseList('sub', this.companyCode)
      this.searchSubFrom = {
        searchCondition: {
          Machine: '',
          AssetNum: '',
          companyCode: this.companyCode,
          warehouseCode: '',
          positionCode: '',
        },
        page: 1,
        pageSize: 15,
        total: 0,
      }
      this.funcGetMatType(this.companyCode)
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
      }
      //  else {
      //   this.searchSubFrom.searchCondition.MatTypeID = this.CategoryTree[0].Id
      // }
      this.funcGetCheckoutProducts(this.Itemlist)
    },
    eventProductReset() {
      this.searchSubFrom.searchCondition.MatTypeID = ''
      this.searchSubFrom.searchCondition.warehouseCode = ''
      this.searchSubFrom.searchCondition.positionCode = ''
      this.searchSubFrom.searchCondition.Machine = ''
      this.searchSubFrom.searchCondition.AssetNum = ''
    },
    eventSelect() {
      for (var selectData of this.tableSelectData) {
        selectData.Money = 1
        selectData.UseType = '变卖'
        selectData.Remark = ''
      }
      this.Itemlist = this.Itemlist.concat(this.tableSelectData)
      this.storeIsdisabled = true
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
  },
  mounted() {
    func.SearchJudge()
    this.funcGetCompany()
    this.GetCheckoutDatas()
    var AllPromossions = JSON.parse(localStorage.getItem('permissions'))
    this.permissionsList = AllPromossions.find(function (item) {
      return item.ModuleUrl == 'ScrapOutBase'
    }).Rights
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
    'searchForm.searchCondition.companyCode'(newVal, oldVal) {
      this.searchForm.searchCondition.positionCode = ''
      this.PositionList = []
      this.searchForm.searchCondition.warehouseCode = ''
      this.WarehouseList = []
      if (newVal != '') {
        this.funcGetWarehouseList('main', newVal)
      }
    },
  },
}
