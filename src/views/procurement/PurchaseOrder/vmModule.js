import $ from 'jquery'
import procurement from '../../../api/procurementApi.js'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  deletePruchase,
  getSupplierList,
  getTransferProductInfo,
  saveTransferOrder,
} from '../../../api/apiv2/puchase.js'
import RangeDate from '../../../components/rangeDate.vue'
import stock from '../../../api/stockApi.js'

import {
  uploadFile,
  purchaseOrderImport,
  purchaseTemplateExport,
  downloadFile,
} from '../../../api/apiv2/common'

export default {
  components: { RangeDate },
  name: 'PurchaseOrder',
  data() {
    return {
      dispatchData: [],
      whList: [],
      orderTypeList: [
        { label: '全部', value: -1 },
        { label: '未下单', value: 0 },
        { label: '采购', value: 1 },
        { label: '调拨', value: 2 },
      ],
      dispatchDislogVisible: false,
      dispatchForm: { shopInfo: '', whCode: '' },
      dispatchRules: {
        shopInfo: [
          { required: true, message: '请选择调出门店', trigger: 'change' },
        ],
        whCode: [
          { required: true, message: '请选择调出仓库', trigger: 'change' },
        ],
      },
      dispatchShopList: [],
      deleteDialogVisible: false,
      permissionsList: '',
      username: '',
      addDate: '',
      searchForm: {
        date: [new Date(), new Date()],
        PlanCode: '',
        Product: '',
        Status: '',
        Urgency: -1,
        shopInfo: '',
        startTime: new Date(),
        endTime: new Date(),
        orderType: -1,
        productInfo: '',
      },
      tableData: [],
      dialogVisible: false,
      addForm: {
        Code: '',
        CreateTime: '',
        Creater: '',
        PSI_Purchase_Order_Ms: [],
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
        code: '',
        matTypeId: '',
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
      dialogVisibleScanQRCodes: false,
      CategoryTree: [],
      supplierList: [],
      shopList: [],
      supplierIsdisabled: false,
      productShopInfo: '',
      mode: '',
      supplierList2: [],
      isImportDialog: false,
      fileList: [],
      orderType: '',
      orderField: '',
      typeNameArr: [],
      typeNamePos: 0,
      tableSum: [],
      dialogShopNameSearch: '', // 新建、编辑采购单弹窗门店名称搜索关键字
      tipDialogShow: false,
      countDown: 0,
      timer: null,
    }
  },
  computed: {
    isViewBtn() {
      return this.tableDeteleData.length == 1 ? false : true
    },
    tables() {
      const search = this.dialogShopNameSearch
      if (search) {
        return this.addForm.PSI_Purchase_Order_Ms.filter((data) => {
          return data.ShopName.includes(search)
        })
      } else {
        return this.addForm.PSI_Purchase_Order_Ms
      }
    },
  },
  methods: {
    merageInit() {
      // 在下文的时候会用到，对数据进行初始化是很有必要的
      this.typeNameArr = []
      this.typeNamePos = 0
    },
    funcGetTableData(
      shopInfo,
      startTime,
      endTime,
      Code,
      supllerInfo,
      status,
      shopCode,
      userType,
      page,
      pageSize
    ) {
      var url =
        procurement.PurchaseOrder.query +
        '?shopInfo=' +
        shopInfo +
        '&startTime=' +
        startTime +
        '&endTime=' +
        endTime +
        '&Code=' +
        Code +
        '&supllerInfo=' +
        supllerInfo +
        '&status=' +
        status +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType +
        '&orderModel=' +
        this.orderType +
        '&orderField=' +
        this.orderField +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize +
        '&orderType=' +
        this.searchForm.orderType +
        '&productInfo=' +
        this.searchForm.productInfo +
        '&userCode=' +
        localStorage.getItem('UserCode')
      this.$axios
        .get(url)
        .then((res) => {
          this.tableData = res.data.Results
          this.total = res.data.TotalCount
          this.tableSum = res.data.TjValues
          //给表格加rowspan来合并列
          // this.tableData = func.oneSetrowspans(this.tableData, 'OrderCode')
          this.merage()
          //console.log(this.tableData);
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    merage() {
      this.merageInit() // 前文的初始化数据函数
      for (let i = 0; i < this.tableData.length; i += 1) {
        if (i === 0) {
          // 第一行必须存在
          this.typeNameArr.push(1)
          this.typeNamePos = 0
        } else {
          // 判断当前元素与上一个元素是否相同,eg：this.typeNamePos 是 this.typeNameArr序号
          // 第一列 下面的是eslint的不限制语法
          // eslint-disable-next-line no-lonely-if
          if (this.tableData[i].OrderCode === this.tableData[i - 1].OrderCode) {
            this.typeNameArr[this.typeNamePos] += 1
            this.typeNameArr.push(0)
          } else {
            this.typeNameArr.push(1)
            this.typeNamePos = i
          }
        }
      }
    },
    funcObjectSpanMethod1({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // 第一列的合并方法
        const row1 = this.typeNameArr[rowIndex]
        const col1 = row1 > 0 ? 1 : 0 // 如果被合并了row = 0; 则他这个列需要取消
        return {
          rowspan: row1,
          colspan: col1,
        }
      }
      if (columnIndex === 1) {
        // 第一列的合并方法
        const row2 = this.typeNameArr[rowIndex]
        const col2 = row2 > 0 ? 1 : 0 // 如果被合并了row = 0; 则他这个列需要取消
        return {
          rowspan: row2,
          colspan: col2,
        }
      }
    },
    // 获取供应商列表
    getSupplierList() {
      getSupplierList().then((res) => {
        this.supplierList2 = res
      })
    },
    //获取商品列表
    funcGetProductTableData(
      shopInfo,
      planCode,
      supllerInfo,
      productInfo,
      categoryId,
      startTime,
      endTime,
      shopCode,
      userType,
      status,
      urgency,
      page,
      pageSize
    ) {
      var arr = []
      for (var item of this.addForm.PSI_Purchase_Order_Ms) {
        var obj = {
          Id: item.PlanMId,
        }
        arr.push(obj)
      }
      var url =
        procurement.ProcurementPlan.query +
        '?shopInfo=' +
        shopInfo +
        '&planCode=' +
        planCode +
        '&supllerInfo=' +
        supllerInfo +
        '&productInfo=' +
        productInfo +
        '&categoryId=' +
        categoryId +
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
        pageSize +
        '&isOrder=true' +
        '&userCode=' +
        localStorage.getItem('UserCode')
      this.$axios
        .post(url, arr)
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
    importDialogClose() {
      this.fileList = []
    },
    // 选择文件
    async chooseFiles(e) {
      if (this.fileList.length == 1) {
        return ElMessage.warning('每次只能导入一个文件')
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
    // 导入
    async onImport() {
      if (this.fileList.length == 0) {
        return ElMessage.warning('请选择文件')
      }
      const loading = func.backgroundLoading('文件已接收，正在处理中')
      let formData = new FormData()
      formData.append('file', this.fileList[0].file)
      try {
        const res = await uploadFile(formData)

        const importRes = await purchaseOrderImport({
          OrgId: localStorage.getItem('OrganizationId'),
          Creater: localStorage.getItem('ms_username'),
          FilePath: res.data,
          IsOverride: 0,
        })
        if (typeof importRes.data == 'string') {
          //文件流
          const file = await downloadFile(importRes.data)
          // 文件名
          let fileName = importRes.data.split('_').pop()
          // 新建一个a标签
          let link = document.createElement('a')
          // 获取临时文件地址
          link.href = window.URL.createObjectURL(file)
          // 设置文件名
          link.download = fileName
          // 模拟点击a标签
          link.click()
          // 释放内存
          window.URL.revokeObjectURL(link.href)
          ElMessage.warning({
            message: '上传的数据中有错误，请查看下载的异常文件',
            type: 'warning',
          })
        } else {
          ElMessage.success({ message: '上传成功', type: 'success' })
          this.isImportDialog = false
          this.eventSearch()
        }
      } catch (err) {
        loading.close()
        this.fileList = []
        return
      }
    },
    // 导出模板
    async eventExportTemplate() {
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
      var ordercodes = []
      for (var item of this.tableDeteleData) {
        // 只能导入处理中状态的订单
        if (item.Status == 0) {
          ordercodes.push(item.OrderCode)
        } else {
          return ElMessage.warning(`只能下载订单状态为“待处理”的订单`)
        }
      }
      if (ordercodes.length == 0) {
        return ElMessage.warning(`请勾选要导入的订单`)
      }
      const res = await purchaseTemplateExport(
        {
          shopInfo: this.searchForm.shopInfo,
          startTime: this.searchForm.startTime,
          endTime: this.searchForm.endTime,
          Code: this.searchForm.planCode,
          supplierInfo: '',
          status: this.searchForm.Status,
          shopCode: localStorage.getItem('shopCode'),
          userType: localStorage.getItem('userType'),
          userCode: localStorage.getItem('UserCode'),
        },
        ordercodes
      )
      const file = await downloadFile(res.data)
      // 文件名
      let fileName = res.data.split('_').pop()
      // 新建一个a标签
      let link = document.createElement('a')
      // 获取临时文件地址
      link.href = window.URL.createObjectURL(file)
      // 设置文件名
      link.download = fileName
      // 模拟点击a标签
      link.click()
      // 释放内存
      window.URL.revokeObjectURL(link.href)
    },
    // 删除文件
    deleteFile(key) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].key == key) {
          this.fileList.splice(i, 1)
          return
        }
      }
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
      console.log(url)
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
    //获取选择门店下供应商列表
    funcGetSupplierTableData(shopInfo) {
      var url = procurement.PurchaseOrder.getSupplier + '?shopInfo=' + shopInfo
      this.$axios
        .get(url)
        .then((res) => {
          this.supplierList = res.data
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

    //批量删除
    funcTableDeteleList(codes, shopCode, userType) {
      var url =
        procurement.ProcurementPlan.delete +
        '?codes=' +
        codes +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType
      this.$axios
        .delete(url)
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
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 4) {
          sums[index] = '合计'
          return
        } else if (index === 6) {
          sums[index] = this.tableSum[0]
          return
        } else if (index === 8) {
          sums[index] = this.tableSum[1]
          return
        }
      })

      return sums
    },
    //自定义表格底部合计
    funcGetSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        } else if (
          index === 3 ||
          index === 4 ||
          index === 8 ||
          index === 9 ||
          index === 10
        ) {
          const values = data.map((item) => Number(item[column.property]))
          if (!values.every((value) => isNaN(value))) {
            sums[index] = `${values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)}`
            if (
              index === 3 ||
              index === 4 ||
              index === 8 ||
              index === 9 ||
              index === 10
            ) {
              sums[index] = parseFloat(sums[index]).toFixed(2)
            }
          } else {
            sums[index] = ''
          }
        }
      })

      return sums
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
      //console.log(this.searchForm.startTime, this.searchForm.endTime);
      this.funcGetTableData(
        this.searchForm.shopInfo,
        this.searchForm.startTime,
        this.searchForm.endTime,
        this.searchForm.PlanCode,
        this.searchForm.Product,
        this.searchForm.Status,
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType'),
        this.page,
        this.pageSize
      )
    },
    eventReset() {
      this.searchForm = {
        date: null,
        PlanCode: '',
        Product: '',
        Status: '',
        Urgency: -1,
        shopInfo: '',
        startTime: new Date(),
        endTime: new Date(),
        productInfo: '',
        orderType: -1,
      }
    },
    // 商品列表搜索按钮
    eventProductSearch() {
      // console.log(this.)
      if (!this.productSearchForm.matTypeId) {
        this.productSearchForm.matTypeId = ''
      }
      if (typeof this.productSearchForm.matTypeId != 'string') {
        var length = this.productSearchForm.matTypeId.length - 1
        this.productSearchForm.matTypeId =
          this.productSearchForm.matTypeId[length]
      }
      this.funcGetProductTableData(
        this.productShopInfo,
        this.productSearchForm.code,
        this.addForm.SupplierCode,
        this.productSearchForm.productInfo,
        this.productSearchForm.matTypeId,
        '',
        '',
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType'),
        0,
        -1,
        this.nested_page,
        this.nested_pageSize
      )
    },
    eventProductReset() {
      this.productShopInfo = ''
      this.productSearchForm = {
        productInfo: '',
        code: '',
        matTypeId: '',
      }
    },
    async confirmDelete() {
      this.deleteDialogVisible = false
      let codes = ''
      this.tableDeteleData.forEach((i, index) => {
        console.log(index)
        if (index == 0) {
          codes += i.OrderCode
        } else {
          codes += `,${i.OrderCode}`
        }
      })
      await deletePruchase({ Codes: codes })
      ElMessage.success('删除成功')
      this.eventSearch()
    },
    async eventDetele() {
      if (this.tableDeteleData.length == 0) {
        return ElMessage.warning('请选择要删除的采购订单')
      }
      this.deleteDialogVisible = true

      //console.log(this.tableDeteleData);
      return
      if (this.tableDeteleData.length == 0) {
        ElMessage.warning({
          message: '还未选择',
          type: 'warning',
        })
      } else {
        // var codes = []
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
    eventOpenWindow(row, mode = 'edit') {
      this.mode = mode
      this.dialogShopNameSearch = ''
      if (mode == 'edit') {
        this.funcGetDate()
        if (row) {
          // 如果没有权限，则函数不继续
          if (!this.permissionsList.Edit) return
          if (row.StatusName != '待处理') return
          this.OpenWindowTitle = '编辑'
          var url =
            procurement.PurchaseOrder.queryOne + '?OrderCode=' + row.OrderCode
          this.$axios
            .post(url)
            .then((res) => {
              //console.log(res);
              //this.addForm = res.data[0];

              this.addForm = JSON.parse(JSON.stringify(res.data[0]))
              this.supplierList2 = [
                {
                  SupplierId: this.addForm.SupplierCode,
                  SupplierName: this.addForm.SupplierName,
                },
              ]
              console.log(this.supplierList2)
              this.addForm.DepositRate = this.addForm.DepositRate * 100
              this.productShopInfo =
                res.data[0].PSI_Purchase_Order_Ms[0].ShopCode
              //console.log(this.addForm);
              for (var item of this.addForm.PSI_Purchase_Order_Ms) {
                if (item.Status != 0) {
                  ElMessage.warning({
                    message: '只有计划状态为待处理的采购计划单允许编辑！',
                    type: 'warning',
                  })
                  return
                }
              }
              this.dialogVisible = true
              this.supplierIsdisabled = true
              //不知道为什么第一次打开编辑那里，底部合计有问题，只能只有处理
              var that = this
              setTimeout(function () {
                that.addForm.PSI_Purchase_Order_Ms =
                  res.data[0].PSI_Purchase_Order_Ms
              }, 100)
            })
            .catch((err) => {
              this.$message({
                message: err,
                type: 'warning',
              })
            })
        } else {
          this.getSupplierList()
          this.OpenWindowTitle = '新建采购单'
          this.supplierIsdisabled = false
          this.addForm = {
            Code: '',
            CreateTime: this.addDate,
            Creater: localStorage.getItem('ms_username'),
            DepositRate: 0,
            IsUrgent: 0,
            Modifier: localStorage.getItem('ms_username'),
            ModifyTime: this.addDate,
            OrderDate: new Date(),
            PSI_Purchase_Order_Ms: [],
            Remark: '',
            SupplierCode: '',
            SupplierName: '',
            Title: '',
            UpdateTime: 0,
          }
          this.productShopInfo = ''
          this.funcGetCurrenCode('PSI_Purchase_Order', '')
          this.dialogVisible = true
        }
      } else if (mode == 'view') {
        if (!this.permissionsList.View) return
        this.OpenWindowTitle = '查看采购单'
        var url =
          procurement.PurchaseOrder.queryOne +
          '?OrderCode=' +
          this.tableDeteleData[0].OrderCode
        this.$axios
          .post(url)
          .then((res) => {
            //console.log(res);
            //this.addForm = res.data[0];
            this.addForm = JSON.parse(JSON.stringify(res.data[0]))
            this.supplierList2 = [
              {
                SupplierId: this.addForm.SupplierCode,
                SupplierName: this.addForm.SupplierName,
              },
            ]
            this.addForm.DepositRate = this.addForm.DepositRate * 100
            this.productShopInfo = res.data[0].PSI_Purchase_Order_Ms[0].ShopCode
            //console.log(this.addForm);
            // for (var item of this.addForm.PSI_Purchase_Order_Ms) {
            //   if (item.Status != 0) {
            //     ElMessage.warning({
            //       message: '只有计划状态为待处理的采购计划单允许编辑！',
            //       type: 'warning',
            //     })
            //     return
            //   }
            // }
            this.dialogVisible = true
            this.supplierIsdisabled = true
            //不知道为什么第一次打开编辑那里，底部合计有问题，只能只有处理
            var that = this
            setTimeout(function () {
              that.addForm.PSI_Purchase_Order_Ms =
                res.data[0].PSI_Purchase_Order_Ms
            }, 100)
          })
          .catch((err) => {
            this.$message({
              message: err,
              type: 'warning',
            })
          })
      }
    },
    eventSaveWindow() {
      if (
        !this.addForm.Title ||
        !this.addForm.OrderDate ||
        this.addForm.DepositRate == undefined ||
        this.addForm.PSI_Purchase_Order_Ms.length == 0
      ) {
        ElMessage.warning({
          message: '订单标题，订购日期，紧急状态，定金百分比，商品不能为空',
          type: 'warning',
        })
        return
      }
      var firstSupplierId = this.addForm.PSI_Purchase_Order_Ms[0].SupplierId
      for (var item of this.addForm.PSI_Purchase_Order_Ms) {
        // item.OrderNum == 0 || 0或者
        if (item.OrderNum < 0) {
          ElMessage.warning({
            message: '下单数量不能小于0',
            type: 'warning',
          })
          return
        }
        // if (item.OrderNum > item.ApplyNum) {
        //     ElMessage.warning({
        //         message: '商品下单数量不能超过申请数量',
        //         type: 'warning',
        //     });
        //     return;
        // }
        // if (firstSupplierId != item.SupplierId) {
        //   console.log(firstSupplierId, item.SupplierCode)
        //   ElMessage.warning({
        //     message: '需要商品为同一供应商',
        //     type: 'warning',
        //   })
        //   return
        // }
        if (item.PriceByTax === 0) {
          this.tipDialogShow = true
          this.countDown = 5
          this.timer = setInterval(() => {
            if (this.countDown == 0) {
              clearInterval(this.timer)
            }
            this.countDown--
          }, 1000)
          return
        }
      }
      this.onSavePurchase()
    },
    // 提示语弹窗关闭
    onTipDialogClose() {
      clearInterval(this.timer)
    },
    // 保存
    onSavePurchase() {
      if (this.countDown > 0) return
      this.tipDialogShow = false
      for (var i of this.supplierList2) {
        if (i.SupplierId == this.addForm.SupplierCode) {
          this.addForm.SupplierName = i.SupplierName
        }
      }
      var params = JSON.parse(JSON.stringify(this.addForm))
      params.DepositRate = params.DepositRate / 100
      params.OrderDate = func.formatTimeToStr(params.OrderDate, 'yyyy-MM-dd')
      const loading = func.backgroundLoading('Loading')
      if (this.OpenWindowTitle == '新建采购单') {
        var url = procurement.PurchaseOrder.add
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
          })
          .catch((err) => {
            loading.close()
            ElMessage.warning({
              message: err,
              type: 'warning',
            })
          })
      } else if (this.OpenWindowTitle == '编辑') {
        var url =
          procurement.PurchaseOrder.update +
          '?shopCode=' +
          localStorage.getItem('shopCode') +
          '&userType=' +
          localStorage.getItem('userType')
        this.$axios
          .put(url, params)
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
            ElMessage.warning({
              message: err,
              type: 'warning',
            })
          })
      }
      //this.dialogVisible = false;
    },
    //删除弹窗表格里面的商品
    eventDeleteDetails(index, row) {
      for (let i = 0; i < this.addForm.PSI_Purchase_Order_Ms.length; i++) {
        if (this.addForm.PSI_Purchase_Order_Ms[i].Id === row.Id) {
          this.addForm.PSI_Purchase_Order_Ms.splice(i, 1)
        }
      }
      // this.addForm.PSI_Purchase_Order_Ms.splice(index, 1)
      if (this.addForm.PSI_Purchase_Order_Ms.length == 0) {
        this.supplierIsdisabled = false
        // this.addForm.SupplierCode = ''
      }
    },
    //当表格中的下单组数被改变
    eventChangeaddFormGroupNum(val, index, row) {
      this.addForm.PSI_Purchase_Order_Ms[index].TaxAmountMoney = parseFloat(
        (val * this.addForm.PSI_Purchase_Order_Ms[index].PriceByTax).toFixed(2)
      )
      this.addForm.PSI_Purchase_Order_Ms[index].ExcludingTaxAmountMoney =
        parseFloat(
          (
            val * this.addForm.PSI_Purchase_Order_Ms[index].PriceByExcludingTax
          ).toFixed(2)
        )
      this.addForm.PSI_Purchase_Order_Ms[index].CostAmount =
        this.addForm.PSI_Purchase_Order_Ms[index].TaxAmountMoney
    },
    //打开增加商品弹窗
    eventOpenProductWindow() {
      // if (!this.productShopInfo) {
      //   ElMessage.warning({
      //     message: '门店不能为空',
      //     type: 'warning',
      //   })
      //   return
      // }
      if (!this.addForm.SupplierCode) {
        return this.$message.warning('请先选择供应商')
      }
      this.nested_page = 1
      this.nested_pageSize = 15
      this.productSearchForm = {
        productInfo: '',
        code: '',
        matTypeId: '',
      }
      // if (!this.supplierIsdisabled) {
      //   this.addForm.SupplierCode = ''
      // }
      this.funcGetProductTableData(
        this.productShopInfo,
        '',
        this.addForm.SupplierCode,
        '',
        '',
        '',
        '',
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType'),
        0,
        -1,
        this.nested_page,
        this.nested_pageSize
      )
      this.dialogVisibleProduct = true

      //弹窗根据搜索条件数量改变样式
      func.DialogSearchJudge()
    },
    //新增勾选的商品
    eventAddProduct() {
      if (this.productTableDeteleData.length > 0) {
        var firstSupplierId = this.productTableDeteleData[0].SupplierId
        for (var item of this.productTableDeteleData) {
          if (item.SupplierId != firstSupplierId) {
            ElMessage.warning({
              message: '需要商品为同一供应商',
              type: 'warning',
            })
            return
          }
        }
      }
      var length = this.addForm.PSI_Purchase_Order_Ms.length + 1
      for (var item of this.productTableDeteleData) {
        var obj = {
          ApplyNum: item.ApplyNum,
          CategoryId: item.CategoryId,
          CostAmount: 0,
          CostPrice: item.PriceByTax,
          CreateTime: this.addDate,
          Creater: localStorage.getItem('ms_username'),
          DeliveryDate: item.PlanDeliveryDate,
          ExcludingTaxAmountMoney: item.ApplyNum * item.Price,
          Id: func.guid(),
          IndexNo: length,
          Modifier: localStorage.getItem('ms_username'),
          ModifyTime: this.addDate,
          OrderCode: this.addForm.Code,
          OrderNum: item.ApplyNum,
          OrderTime: this.addDate,
          PlanCode: item.PlanCode,
          //用于查询商品排除已经勾选
          PlanMId: item.Id,
          PriceByExcludingTax: item.Price,
          PriceByTax: item.PriceByTax,
          ProductCode: item.ProductCode,
          ProductName: item.ProductName,
          Remark: item.Remark,
          SendNum: 0,
          ShopAddress: item.ShopAddress,
          ShopCode: item.ShopCode,
          ShopName: item.ShopName,
          Status: 0,
          TaxAmountMoney: item.ApplyNum * item.PriceByTax,
          TaxRate: item.TaxRate,
          UnitId: item.UnitId,
          UnitName: item.UnitName,
          UpdateTime: item.UpdateTime,
          ProductId: item.ProductId,
          SupplierId: item.SupplierId,
          SupplierName: item.SupplierName,
        }
        this.addForm.PSI_Purchase_Order_Ms.push(obj)
        length = length + 1
      }
      this.dialogVisibleProduct = false
      if (this.addForm.PSI_Purchase_Order_Ms.length != 0) {
        this.supplierIsdisabled = true
        // this.addForm.SupplierCode =
        //   this.addForm.PSI_Purchase_Order_Ms[0].SupplierId
      }
    },
    //下单
    eventPlaceOrder() {
      if (this.tableDeteleData.length == 0) {
        ElMessage.warning({
          message: '还未选择',
          type: 'warning',
        })
        return
      }
      var codes = []
      for (var item of this.tableDeteleData) {
        if (item.Status != 0) {
          ElMessage.warning({
            message: '只有状态为待处理的采购单才能下单',
            type: 'warning',
          })
          return
        } else {
          codes.push(item.OrderCode)
        }
      }
      codes = codes.join(',')
      var url =
        procurement.PurchaseOrder.placeOrder +
        '?codes=' +
        codes +
        '&userName=' +
        localStorage.getItem('ms_username')
      this.$axios
        .put(url)
        .then((res) => {
          ElMessage.success({
            message: '下单成功',
            type: 'success',
          })
          this.eventSearch()
        })
        .catch((err) => {
          ElMessage.warning({
            message: err,
            type: 'warning',
          })
        })
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
      var ordercodes = []
      for (var item of this.tableDeteleData) {
        ordercodes.push(item.OrderCode)
      }
      //ordercodes = ordercodes.join(",");

      var url_1 =
        procurement.PurchaseOrder.Export +
        '?shopInfo=' +
        this.searchForm.shopInfo +
        '&startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&Code=' +
        this.searchForm.PlanCode +
        '&supllerInfo=' +
        this.searchForm.Product +
        '&status=' +
        this.searchForm.Status +
        '&orderType=' +
        this.searchForm.orderType +
        '&productInfo=' +
        this.searchForm.productInfo +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType') +
        '&userCode=' +
        localStorage.getItem('UserCode')

      this.$axios
        .post(url_1, ordercodes)
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
    // 调拨下单
    eventDispatchOrder() {
      // 没有选择不能下单
      if (this.tableDeteleData.length == 0) {
        return this.$message({
          message: '请先勾选需要下单的记录',
          type: 'warning',
        })
      }
      // 只有待处理的订单才能下单 字段：Status  0-待处理 1-已下单 2-发货中 3-已发货 4-已完成 5-已完结
      for (let i = 0; i < this.tableDeteleData.length; i++) {
        if (this.tableDeteleData[i].Status != 0) {
          return this.$message({
            type: 'warning',
            message: '只有待处理状态的订单可进行调拨下单',
          })
        }
      }
      // 已选择的订单的门店不能调拨
      let shopList = []
      this.tableData.forEach((j) => {
        this.tableDeteleData.forEach((i) => {
          if (j.OrderCode == i.OrderCode) {
            shopList.push(j.ShopName)
          }
        })
      })

      shopList = [...new Set(shopList)]
      this.dispatchShopList = []
      this.shopList.forEach((i) => {
        if (!shopList.includes(i.Name)) {
          this.dispatchShopList.push(i)
        }
      })
      this.dispatchDislogVisible = true
    },
    //获取仓库
    funcGetWarehouseList() {
      var url =
        stock.StockManagement.GetWarehouse +
        '?shopCode=' +
        this.dispatchForm.shopInfo
      this.$axios
        .get(url)
        .then((res) => {
          this.whList = res.data
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    // 获取调拨下单商品列表
    async getDispatchGoods() {
      const data = []
      this.tableDeteleData.forEach((i) => {
        data.push(i.OrderCode)
      })
      const res = await getTransferProductInfo(
        {
          shopInfo: this.dispatchForm.shopInfo,
          whCode: this.dispatchForm.whCode,
        },
        data
      )
      this.dispatchData = res
      console.log(res)
    },
    // 调拨下单
    async onDispatchSubmit() {
      this.$refs.dispatchForm.validate(async (valid) => {
        if (valid) {
          const data = []
          this.tableDeteleData.forEach((i) => {
            data.push(i.OrderCode)
          })
          await saveTransferOrder(
            {
              shopInfo: this.dispatchForm.shopInfo,
              whCode: this.dispatchForm.whCode,
              userName: localStorage.getItem('ms_username'),
            },
            data
          )
          this.dispatchDislogVisible = false
          ElMessage.success({
            message: '调拨下单成功',
            type: 'success',
          })
          this.eventSearch()
        }
      })
    },
    // 调拨弹窗关闭
    onDispatchClose() {
      this.dispatchData = []
      this.dispatchForm.whCode = ''
      this.dispatchForm.shopInfo = ''
    },
    // 表格排序方法
    onSortChange({ column, prop, order }) {
      if (prop) {
        if (order == 'ascending') {
          this.orderType = 'asc'
        } else if (order == 'descending') {
          this.orderType = 'desc'
        }
        this.orderField = prop.toLowerCase()
      } else {
        this.orderField = ''
        this.orderType = ''
      }
      this.eventSearch()
    },
  },
  mounted() {
    this.getSupplierList()
    func.SearchJudge()
    this.username = localStorage.getItem('ms_username')
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
      if (item.ModuleUrl == 'PurchaseOrder') {
        this.permissionsList = item.Rights
      }
    }
    this.searchForm.startTime = new Date()
    this.searchForm.endTime = new Date()
  },
  watch: {
    productShopInfo(newVal, oldVal) {
      // this.addForm.SupplierCode = ''
      this.supplierList = []
      if (newVal) {
        this.funcGetSupplierTableData(newVal)
      }
    },
    'dispatchForm.shopInfo'(newVal, oldVal) {
      if (!newVal) {
        this.dispatchForm.whCode = ''
        this.whList = []
        this.dispatchData = []
      } else if (newVal != oldVal) {
        this.dispatchForm.whCode = ''
        this.funcGetWarehouseList()
        this.dispatchData = []
      } else {
        this.funcGetWarehouseList()
      }
    },
    'dispatchForm.whCode'(val) {
      if (val) {
        this.getDispatchGoods()
      }
    },
  },
}
