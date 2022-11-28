import $ from 'jquery'
import procurement from '../../../api/procurementApi.js'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import RangeDateVue from '../../../components/rangeDate.vue'
import { h } from 'vue'
import TaskDetail from '../../../components/TaskDetail.vue'
import ImportDialog from '../../../components/import-component/ImportDialog..vue'
export default {
  name: 'ProcurementPlan',
  data() {
    return {
      permissionsList: '',
      username: '',
      addDate: '',
      searchForm: {
        date: null,
        PlanCode: '',
        Product: '',
        shopInfo: '',
        Status: -1,
        Urgency: -1,
        startTime: '',
        endTime: '',
      },
      tableData: [],
      dialogVisible: false,
      addForm: {
        Code: '',
        CreateTime: '',
        Creater: '',
        Details: [],
        Modifier: '',
        ModifyTime: '',
        Plan_Date: '',
        ShopAddress: '',
        ShopCode: '',
        ShopName: '',
        UpdateTime: 0,
      },
      productTableData: [],
      productSearchForm: {
        productInfo: '',
        supplierInfo: '',
        matTypeId: '',
        shopInfo: '',
      },
      tableDeteleData: '',
      productTableDeteleData: [],
      OpenWindowTitle: '',
      page: 1,
      pageSize: 15,
      total: 0,
      nested_page: 1,
      nested_pageSize: 15,
      nested_total: 0,
      dialogVisibleProduct: false,
      dialogVisibleScanQRCodes: false,
      CategoryTree: [],
      shopList: [],
      isEditShopName: false,
      tipDialogShow: false,
      errMessage: '', // 提示弹窗重复的采购单编号
      isItemImportDialogShow: false,
      isTaskDetailShow: false,
      taskId: '',
    }
  },
  components: { TaskDetail, ImportDialog, RangeDateVue },
  methods: {
    funcGetTableData(
      shopInfo,
      planCode,
      productInfo,
      startTime,
      endTime,
      shopCode,
      userType,
      status,
      urgency,
      page,
      pageSize
    ) {
      var url =
        procurement.ProcurementPlan.query +
        '?shopInfo=' +
        shopInfo +
        '&planCode=' +
        planCode +
        '&productInfo=' +
        productInfo +
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
        '&urgency=' +
        urgency +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .post(url, [])
        .then((res) => {
          this.tableData = res.data.Results
          this.total = res.data.TotalCount
          //给表格加rowspan来合并列
          this.tableData = func.oneSetrowspans(this.tableData, 'PlanCode')
          //console.log(this.tableData);
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
      productInfo,
      supplierInfo,
      matTypeId,
      shopCode,
      userType,
      page,
      pageSize
    ) {
      var arr = []
      for (var item of this.addForm.Details) {
        var obj = {
          ProductId: item.ProductId,
        }
        arr.push(obj)
      }
      var url =
        procurement.ProcurementPlan.queryProduct +
        '?shopInfo=' +
        shopInfo +
        '&productInfo=' +
        productInfo +
        '&supplierInfo=' +
        supplierInfo +
        '&matTypeId=' +
        matTypeId +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .post(url, arr)
        .then((res) => {
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
    funcTableDeteleList(codes, shopCode, userType) {
      var url =
        procurement.ProcurementPlan.delete +
        '?shopCode=' +
        shopCode +
        '&userType=' +
        userType
      this.$axios
        .delete(url, { data: codes.split(',') })
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

    //查询单个门店具体信息
    funcGetOneShopInfo(code) {
      var url = procurement.GetShopInfo + '?code=' + code
      this.$axios
        .get(url)
        .then((res) => {
          //console.log(res);
          this.addForm.ShopAddress = res.data.Address
          this.addForm.ShopName = res.data.Name
          this.addForm.ContactTel = res.data.ContactTel
          this.addForm.Receiver = res.data.Salesmen
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
    //合并表格列
    funcObjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        return {
          rowspan: row.rowspan,
          colspan: 1,
        }
      }
    },
    //更改合并列样式
    funcColumnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        return 'border-right:1px solid #ECEDEE;'
      }
    },
    doProductSearch() {
      this.productTableDeteleData = []
      this.$refs.multipleProductTable.clearSelection()
      this.eventProductSearch()
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
      // if (this.searchForm.date) {
      //   this.searchForm.startTime = func.formatTimeToStr(
      //     this.searchForm.date[0],
      //     'yyyy-MM-dd'
      //   )
      //   this.searchForm.endTime = func.formatTimeToStr(
      //     this.searchForm.date[1],
      //     'yyyy-MM-dd'
      //   )
      // } else {
      //   this.searchForm.startTime = ''
      //   this.searchForm.endTime = ''
      // }
      this.funcGetTableData(
        this.searchForm.shopInfo,
        this.searchForm.PlanCode,
        this.searchForm.Product,
        this.searchForm.startTime,
        this.searchForm.endTime,
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType'),
        this.searchForm.Status,
        this.searchForm.Urgency,
        this.page,
        this.pageSize
      )
    },
    eventReset() {
      this.searchForm = {
        date: null,
        PlanCode: '',
        Product: '',
        shopInfo: '',
        Status: -1,
        Urgency: -1,
        startTime: '',
        endTime: '',
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
        this.productSearchForm.productInfo,
        this.productSearchForm.supplierInfo,
        this.productSearchForm.matTypeId,
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType'),
        this.nested_page,
        this.nested_pageSize
      )
    },
    eventProductReset() {
      this.productSearchForm = {
        productInfo: '',
        supplierInfo: '',
        matTypeId: '',
        shopInfo: this.productSearchForm.shopInfo,
      }
    },
    eventDetele() {
      if (this.tableDeteleData.length == 0) {
        ElMessage.warning({
          message: '还未选择',
          type: 'warning',
        })
      } else {
        var codes = []
        for (var item of this.tableDeteleData) {
          codes.push(item.PlanCode)
        }
        codes = codes.join(',')
        this.funcTableDeteleList(
          codes,
          localStorage.getItem('shopCode'),
          localStorage.getItem('userType')
        )
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
      if (row) {
        this.isEditShopName = true
        this.OpenWindowTitle = '编辑'
        var url = procurement.ProcurementPlan.queryOne + '?code=' + row.PlanCode
        this.$axios
          .get(url)
          .then((res) => {
            this.addForm = res.data
            this.addForm.Details.forEach((i) => {
              i.orderSum = i.ApplyNum // i.GroupNum * i.PerGroupNum
            })
            //console.log(res.data);
            for (var item of this.addForm.Details) {
              if (item.Status != 0) {
                ElMessage.warning({
                  message: '只有计划状态为待处理的采购计划单允许编辑！',
                  type: 'warning',
                })
                return
              }
            }
            this.productSearchForm.shopInfo = res.data.ShopCode
            //this.addDate = res.data.ModifyTime;
            this.dialogVisible = true
          })
          .catch((err) => {
            this.$message({
              message: err,
              type: 'warning',
            })
          })
      } else {
        this.isEditShopName = false
        this.OpenWindowTitle = '新增'
        this.productSearchForm.shopInfo = ''
        this.addForm = {
          Code: '',
          CreateTime: this.addDate,
          Creater: localStorage.getItem('ms_username'),
          Details: [],
          Modifier: localStorage.getItem('ms_username'),
          ModifyTime: this.addDate,
          Plan_Date: this.addDate,
          ShopAddress: '',
          ShopCode: this.productSearchForm.shopInfo,
          ShopName: '',
          UpdateTime: 0,
        }
        this.funcGetCurrenCode('PSI_Purchase_Plan', '')
        this.dialogVisible = true
      }
    },
    showNewTip(err) {
      this.errMessage = []
      let arr = err.split('，')[1].split('“')
      arr.forEach((i) => {
        if (i.length > 0) {
          this.errMessage.push({
            productName: i.match(/(.+?)”/g)[0],
            OrderNum: i.match(/\((.+?)\)/g)[0],
          })
        }
      })

      this.errMessage.forEach((e) => {
        setTimeout(() => {
          let notification = ElNotification({
            title: '保存失败',
            // <div>xxxxxx<span>xxxx</span>xxxxxxxx</div>
            message: h('div', { style: 'word-break: break-all;' }, [
              h('span', `“${e.productName}商品已有待处理或处理中的采购计划`),
              h(
                'span',
                {
                  style:
                    'cursor: pointer; color: #428feb;text-decoration:underline',
                  onclick: () => {
                    const no = e.OrderNum.match(/[0-9a-zA-Z]/g).join('')
                    // 关闭所有弹窗
                    this.dialogVisibleScanQRCodes = false
                    this.tipDialogShow = false
                    this.dialogVisibleProduct = false
                    this.dialogVisible = false
                    this.searchForm.PlanCode = no
                    this.eventSearch()
                    notification.close()
                  },
                },
                e.OrderNum
              ),
              h('span', '，不能重复添加哦'),
            ]),
            duration: 0,
            type: 'warning',
          })
          this.$store.commit('addNotification', notification)
        })
      }, 0)
    },
    eventSaveWindow() {
      this.addForm.ShopCode = this.productSearchForm.shopInfo
      if (
        !this.productSearchForm.shopInfo ||
        this.addForm.Details.length == 0
      ) {
        ElMessage.warning({ message: '门店,商品不能为空', type: 'warning' })
        return
      }
      if (this.addForm.ShopAddress == null) {
        this.addForm.ShopAddress = ''
      }
      if (this.addForm.Receiver == null) {
        this.addForm.Receiver = ''
      }
      if (this.addForm.ContactTel == null) {
        this.addForm.ContactTel = ''
      }
      // if (this.addForm.ShopAddress.length > 200 || this.addForm.Receiver.length > 50 || this.addForm.ContactTel.length > 50) {
      //     ElMessage.warning({message: '收货地址长度不能超过200，收货人长度不能超过50，联系电话长度不能超过50',type: 'warning',});
      //     return;
      // }
      for (var item of this.addForm.Details) {
        if (!item.GroupNum) {
          ElMessage.warning({
            message: '下单组数不能为0或者空',
            type: 'warning',
          })
          return
        }
        if (item.orderSum < item.SetNum) {
          ElMessage.warning({
            message: '商品下单数量不能少于起订数量',
            type: 'warning',
          })
          return
        }
        if (!item.PlanDeliveryDate) {
          ElMessage.warning({
            message: '预计到货日期不能为空',
            type: 'warning',
          })
          return
        }
        if (item.PlanDeliveryDate) {
          item.PlanDeliveryDate = func.formatTimeToStr(
            item.PlanDeliveryDate,
            'yyyy-MM-dd'
          )
        }
      }
      const loading = func.backgroundLoading('Loading')
      if (this.OpenWindowTitle == '新增') {
        var params = JSON.parse(JSON.stringify(this.addForm))
        var myDate = new Date()
        myDate = func.formatTimeToStr(myDate, 'yyyy-MM-dd')
        params.Plan_Date = myDate
        //console.log(params);return;
        var paramsList = []
        paramsList.push(params)
        var url = procurement.ProcurementPlan.add
        this.$axios
          .post(url, paramsList)
          .then((res) => {
            loading.close()
            ElMessage.success({
              message: '新增成功',
              type: 'success',
            })
            this.eventSearch()
            this.dialogVisible = false
          })
          .catch((err) => {
            loading.close()
            this.$store.commit('clearNotification')
            if (err.includes('商品已有待处理或处理中的申购计划')) {
              this.showNewTip(err)
            } else {
              ElMessage.warning({
                message: err,
                type: 'warning',
              })
            }
          })
      } else if (this.OpenWindowTitle == '编辑') {
        var params = JSON.parse(JSON.stringify(this.addForm))
        var paramsList = []
        paramsList.push(params)
        var url =
          procurement.ProcurementPlan.update +
          '?shopCode=' +
          localStorage.getItem('shopCode') +
          '&userType=' +
          localStorage.getItem('userType')
        this.$axios
          .put(url, paramsList)
          .then((res) => {
            loading.close()
            ElMessage.success({
              message: '更新成功',
              type: 'success',
            })
            this.eventSearch()
            this.dialogVisible = false
          })
          .catch((err) => {
            loading.close()
            this.$store.commit('clearNotification')
            if (err.includes('商品已有待处理或处理中的申购计划')) {
              this.showNewTip(err)
            } else {
              ElMessage.warning({
                message: err,
                type: 'warning',
              })
            }
          })
      }
      //this.dialogVisible = false;
    },
    //删除弹窗表格里面的商品
    eventDeleteDetails(index, row) {
      this.addForm.Details.splice(index, 1)
    },
    //当表格中的下单组数被改变
    eventChangeaddFormGroupNum(val, index, row) {
      //this.addForm.Details[index].OrderNum = val * this.addForm.Details[index].PerGroupNum;
      this.addForm.Details[index].orderSum =
        val * this.addForm.Details[index].PerGroupNum
    },
    //打开增加商品弹窗
    eventOpenProductWindow() {
      this.productTableDeteleData = []
      if (!this.productSearchForm.shopInfo) {
        ElMessage.warning({
          message: '门店不能为空',
          type: 'warning',
        })
        return
      }
      this.nested_page = 1
      this.nested_pageSize = 15
      this.productSearchForm = {
        productInfo: '',
        supplierInfo: '',
        matTypeId: '',
        shopInfo: this.productSearchForm.shopInfo,
      }
      this.funcGetProductTableData(
        this.productSearchForm.shopInfo,
        '',
        '',
        '',
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType'),
        this.nested_page,
        this.nested_pageSize
      )
      this.dialogVisibleProduct = true

      //弹窗根据搜索条件数量改变样式
      func.DialogSearchJudge()
    },
    //新增勾选的商品
    eventAddProduct() {
      var length = this.addForm.Details.length + 1
      for (var item of this.productTableDeteleData) {
        var obj = {
          CategoryId: item.MatTypeId,
          CreateTime: this.addDate,
          Creater: localStorage.getItem('ms_username'),
          GroupNum: 0,
          Id: func.guid(),
          ProductId: item.ProductId,
          IndexNo: length,
          Modifier: localStorage.getItem('ms_username'),
          ModifyTime: this.addDate,
          OrderCycle: item.OrderCycle,
          OrderNum: 0,
          PerGroupNum: item.OrderNum,
          PlanCode: this.addForm.Code,
          PlanDeliveryDate: item.PlanDeliveryDate,
          ProductCode: item.Mat_No,
          ProductName: item.Mat_Name,
          Remark: item.Remark,
          SetNum: item.SetNum,
          Status: 0,
          SupplierCode: item.SupplierInfoIds,
          SupplierName: item.Manufacturer,
          UnitId: item.Mast_UnitId,
          UnitName: item.Mast_UnitName,
          UpdateTime: 0,
          Urgency: 0,
          orderSum: 0,
        }
        this.addForm.Details.push(obj)
        length = length + 1
      }
      this.dialogVisibleProduct = false
    },
    //导出
    eventExport() {
      // if (this.searchForm.date) {
      //   this.searchForm.startTime = func.formatTimeToStr(
      //     this.searchForm.date[0],
      //     'yyyy-MM-dd'
      //   )
      //   this.searchForm.endTime = func.formatTimeToStr(
      //     this.searchForm.date[1],
      //     'yyyy-MM-dd'
      //   )
      // } else {
      //   this.searchForm.startTime = ''
      //   this.searchForm.endTime = ''
      // }
      if (typeof this.productSearchForm.matTypeId != 'string') {
        var length = this.productSearchForm.matTypeId.length - 1
        this.productSearchForm.matTypeId =
          this.productSearchForm.matTypeId[length]
      }
      var codes = []
      for (var item of this.tableDeteleData) {
        codes.push(item.PlanCode)
      }
      //codes = codes.join(",");
      var url_1 =
        procurement.ProcurementPlan.Export +
        '?shopInfo=' +
        this.searchForm.shopInfo +
        '&planCode=' +
        this.searchForm.PlanCode +
        '&supllerInfo=' +
        this.productSearchForm.supplierInfo +
        '&productInfo=' +
        this.searchForm.Product +
        '&categoryId=' +
        this.productSearchForm.matTypeId +
        '&startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType') +
        '&status=' +
        this.searchForm.Status +
        '&urgency=' +
        this.searchForm.Urgency

      this.$axios
        .post(url_1, codes)
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
    //导出模板
    eventExportTemplate() {
      window.location.href = './export/采购计划.xlsx'
    },

    //上传excel到后端
    eventUploadExcel(data) {
      var formData = new FormData()
      formData.append('file', data.target.files[0])
      formData.append('fileName', data.target.files[0].name)
      //把excel发给后端
      var url =
        procurement.ProcurementPlan.Import +
        '?fileModule=' +
        10 +
        '&userCode=' +
        localStorage.getItem('UserCode')
      this.$axios
        .post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
          //清空上传文件，不然不能重复上同一个文件
          this.$refs['uploadExcelValue'].value = ''
          //把excel发给后端成功后将数据保存
          var params = {
            OrgId: localStorage.getItem('OrganizationId'),
            Creater: localStorage.getItem('ms_username'),
            FilePath: res.data.data,
            IsOverride: 0,
          }
          var urlSuccess =
            procurement.ProcurementPlan.ImportSuccess +
            '?userCode=' +
            localStorage.getItem('UserCode')
          this.$axios
            .post(urlSuccess, params)
            .then((res) => {
              if (res.data.Success) {
                if (typeof res.data.data == 'string') {
                  //文件流
                  var url =
                    basis.ExportDownload +
                    '?filePath=' +
                    res.data.data +
                    '&delete=1'
                  window.location.href = url
                  ElMessage.warning({
                    message: '上传的数据中有错误，请查看下载的异常文件',
                    type: 'warning',
                  })
                } else {
                  ElMessage.success({ message: '上传成功', type: 'success' })
                  this.eventSearch()
                }
              } else {
                ElMessage.warning({ message: res.data.Msg, type: 'warning' })
              }
            })
            .catch((err) => {
              ElMessage.warning({ message: err, type: 'warning' })
            })
        })
        .catch((err) => {
          ElMessage.warning({ message: err, type: 'warning' })
        })
    },
    // 判断是否可编辑
    isEidt(row) {
      const PlanCode = row.PlanCode
      for (let i = 0; i < this.tableData.length; i++) {
        if (
          this.tableData[i].PlanCode == PlanCode &&
          this.tableData[i].Status != 0
        ) {
          return false
        }
      }
      return true
    },

    // 导入
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
    func.uploadButtonCSS()
    this.username = localStorage.getItem('ms_username')
    //this.eventSearch();
    this.funcGetCategoryTableData(
      '',
      '',
      localStorage.getItem('shopCode'),
      localStorage.getItem('userType'),
      1,
      100000
    )
    this.funcGetShopCodeList(localStorage.getItem('shopCode'))
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'ProcurementPlan') {
        this.permissionsList = item.Rights
      }
    }
    this.mittBus.on('close-detail', () => {
      this.isTaskDetailShow = false
    })
  },
  watch: {
    'productSearchForm.shopInfo'(newVal, oldVal) {
      this.addForm.ShopAddress = ''
      this.addForm.ShopName = ''
      this.addForm.ContactTel = ''
      this.addForm.Receiver = ''
      if (newVal) {
        this.funcGetOneShopInfo(newVal)
      }
    },
  },
}
