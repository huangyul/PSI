import func from '../../func.js'
import basis from '../../../api/basisApi.js'
import stock from '../../../api/stockApi.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import RangeDate from '../../../components/rangeDate.vue'
export default {
  name: 'ConsumeOutBase',
  components: { RangeDate },
  data() {
    return {
      permissionsList: '',
      isShowPosition: localStorage.getItem('isShowPosition'),
      searchForm: {
        searchCondition: {
          checkoutType: 1,
          product: '',
          matTypeID: '',
          InTime: [new Date(), new Date()],
          companyCode: '',
          warehouseCode: '',
          positionCode: '',
        },
        page: 1,
        pageSize: 15,
        total: 0,
        startTime: new Date(),
        endTime: new Date(),
      },
      searchSubFrom: {
        searchCondition: {
          product: '',
          matTypeID: '',
          warehouseCode: '',
          positionCode: '',
        },
        page: 1,
        pageSize: 15,
        total: 0,
      },
      CompanyList: '',
      companyCode: '',
      WarehouseList: '',
      PositionList: '',
      WarehouseSubList: '',
      PositionSubList: '',
      tableData: [],
      dialogVisible: false,
      subDialogVisible: false,
      checkoutNum: '',
      Itemlist: [],
      UnSelectedItemlist: [],
      creator: localStorage.getItem('ms_username'),
      tableSelectData: '',
      storeIsdisabled: false,
      MainCategoryTree: [],
      SubCategoryTree: [],
      UseType: '',
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
    //获取商品类别
    funcGetMatType(type, shopCode) {
      var url =
        basis.CategoryManagement.tree +
        '?bussinessType=&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType')
      this.$axios
        .get(url)
        .then((res) => {
          res.data = res.data.filter((item, index, arr) => {
            return item.Mat_Type != 'M'
          })

          // if (type == 'main') {
          //     this.MainCategoryTree = func.recursiveCategoryTree(res.data);
          // } else {
          //     this.SubCategoryTree = func.recursiveCategoryTree(res.data);
          // }

          this.MainCategoryTree = func.recursiveCategoryTree(res.data)
          this.SubCategoryTree = this.MainCategoryTree
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
      var url =
        stock.StockManagement.GetCheckoutDatas +
        '?productInfo=' +
        this.searchForm.searchCondition.product +
        '&whCode=' +
        this.searchForm.searchCondition.warehouseCode +
        '&positionCode=' +
        this.searchForm.searchCondition.positionCode +
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
      var url =
        stock.StockManagement.GetCheckoutProducts +
        '?whcode=' +
        this.searchSubFrom.searchCondition.warehouseCode +
        '&positionCode=' +
        this.searchSubFrom.searchCondition.positionCode +
        '&matTypeID=' +
        this.searchSubFrom.searchCondition.matTypeID +
        '&productInfo=' +
        this.searchSubFrom.searchCondition.product +
        '&page=' +
        this.searchSubFrom.page +
        '&pageSize=' +
        this.searchSubFrom.pageSize +
        '&shopInfo=' +
        this.companyCode +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType') +
        '&isXHFlag=true'
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
    eventReset() {
      this.searchForm = {
        searchCondition: {
          checkoutType: 1,
          product: '',
          matTypeID: '',
          InTime: [new Date(), new Date()],
          startTime: new Date(),
          endTime: new Date(),
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
        CheckoutType: 1,
        OutDate: new Date().toLocaleDateString(),
        Remark: '',
        Creater: this.creator,
        Details: [],
      }
      if (this.Itemlist.length == 0) {
        //没有商品时
        this.$message({ message: '请选择商品', type: 'warning' })
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
      }
      const loading = func.backgroundLoading('出库中...请稍后')
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
      //this.funcGetMatType('sub', this.companyCode);
      this.searchSubFrom = {
        searchCondition: {
          product: '',
          matTypeID: '',
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
        typeof this.searchSubFrom.searchCondition.matTypeID != 'string' &&
        this.searchSubFrom.searchCondition.matTypeID != null
      ) {
        var length = this.searchSubFrom.searchCondition.matTypeID.length - 1
        this.searchSubFrom.searchCondition.matTypeID =
          this.searchSubFrom.searchCondition.matTypeID[length]
      } else if (this.searchSubFrom.searchCondition.matTypeID == null) {
        this.searchSubFrom.searchCondition.matTypeID = ''
      }
      this.funcGetCheckoutProducts(this.Itemlist)
    },
    eventProductReset() {
      this.searchSubFrom.searchCondition.matTypeID = ''
      this.searchSubFrom.searchCondition.warehouseCode = ''
      this.searchSubFrom.searchCondition.positionCode = ''
      this.searchSubFrom.searchCondition.product = ''
    },
    eventSelect() {
      if (this.tableSelectData.length > 0) {
        for (var selectData of this.tableSelectData) {
          selectData.CheckoutSum = 1
          selectData.UseType = this.UseType
          selectData.Remark = ''
          selectData.Money = selectData.Price * selectData.CheckoutSum
        }
        this.Itemlist = this.Itemlist.concat(this.tableSelectData)
      }
      this.storeIsdisabled = true
      this.subDialogVisible = false
    },
    eventTableSelect(val) {
      this.tableSelectData = val
    },
    //更改商品列表中的出库数量的回调
    eventChangeCheckoutSum(val, index, row) {
      this.Itemlist[index].Money = val * this.Itemlist[index].Price
      this.Itemlist[index].Money = parseFloat(
        this.Itemlist[index].Money.toFixed(2)
      )
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
    console.log(this.Itemlist)
    this.funcGetCheckoutProducts(this.Itemlist)
    func.SearchJudge()
    this.funcGetCompany()
    this.funcGetMatType()
    //this.GetCheckoutDatas();
    var AllPromossions = JSON.parse(localStorage.getItem('permissions'))
    this.permissionsList = AllPromossions.find(function (item) {
      return item.ModuleUrl == 'ConsumeOutBase'
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
      this.searchForm.searchCondition.WarehouseCode = ''
      this.WarehouseList = []
      //this.searchForm.searchCondition.matTypeID = "";
      this.tempMatTypeList = []
      if (newVal != '') {
        //this.funcGetMatType('main', newVal);
        this.funcGetWarehouseList('main', newVal)
      }
    },
    UseType(value) {
      this.Itemlist.forEach((i) => {
        i.UseType = value
      })
    },
  },
}
