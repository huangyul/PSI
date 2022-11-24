import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage } from 'element-plus'
import router from '../../../router'
import Bus from '../../Bus.js'
import { ref, reactive, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import { getLodop } from '../../LodopFuncs.js'
import TaskDetail from '../../../components/TaskDetail.vue'
import ImportDialog from '../../../components/import-component/ImportDialog..vue'
export default {
  name: 'CommodityManagement',
  setup() {
    onUnmounted(() => {
      Bus.off('CommodityManagementGetTableData')
      localStorage.removeItem('CommodityManagementMat_No')
    })
  },
  data() {
    return {
      permissionsList: '',
      username: '',
      addDate: '',
      searchForm: {
        Name: '',
        Code: '',
        Type: '',
        Status: '',
      },
      tableData: [],
      dialogVisible: false,
      addForm: {},
      tableDeteleData: '',
      OpenWindowTitle: '',
      page: 1,
      pageSize: 15,
      total: 0,
      CommodityCategoriesList: [],

      printDialogVisible: false,
      printTableData: [],
      BarCodeTemplate: '',
      orderField: '', // 排序字段 统一小写
      orderType: '', // 排序方式：desc、asc两者之一
      isItemImportDialogShow: false,
      isTaskDetailShow: false,
      taskId: '',
    }
  },
  components: { TaskDetail, ImportDialog },
  methods: {
    funcGetTableData(
      productName,
      productCode,
      matType,
      shopCode,
      orgId,
      activeStatus,
      page,
      pageSize
    ) {
      productName = encodeURIComponent(productName)
      var url =
        basis.CommodityManagement.query +
        '?productName=' +
        productName +
        '&productCode=' +
        productCode +
        '&matType=' +
        matType +
        '&shopCode=' +
        shopCode +
        '&orgId=' +
        orgId +
        '&activeStatus=' +
        activeStatus +
        '&orderField=' +
        this.orderField +
        '&orderType=' +
        this.orderType +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .get(url)
        .then((res) => {
          this.tableData = res.data.Results
          this.total = res.data.TotalCount
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
        basis.GeneratedNumber +
        '?tableName=' +
        tableName +
        '&matType=' +
        matType
      this.$axios
        .get(url)
        .then((res) => {
          this.addForm.Unit_No = res.data
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //单独删除
    funcTableDetele(id, updateTime, shopCode, userType) {},
    //批量删除
    funcTableDeteleList(MatNos, shopCode, userType) {
      var url =
        basis.CommodityManagement.deleteList +
        '?MatNos=' +
        MatNos +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType
      this.$axios
        .delete(url)
        .then((res) => {
          ElMessage.success({ message: '删除成功', type: 'success' })
          this.eventSearch()
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
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
    //获取商品类别列表
    funcGetCommodityCategoriesList(bussinessType, shopCode, userType) {
      var url =
        basis.CategoryManagement.tree +
        '?bussinessType=' +
        bussinessType +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType
      this.$axios
        .get(url)
        .then((res) => {
          this.CommodityCategoriesList = func.recursiveCategoryTree(res.data)
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
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
              'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
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
              'LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");' +
              'LODOP.SET_PRINT_STYLEA(0,"FontSize",10);' +
              'LODOP.SET_PRINT_STYLEA(0,"Alignment",2);' +
              'LODOP.SET_PRINT_STYLEA(0,"ContentVName","InvoiceCode");'
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取打印商品信息
    funcGetPrintTableData() {
      var codes = []
      for (var item of this.tableDeteleData) {
        codes.push(item.Mat_No)
      }
      //ids = ids.join(",");
      var url = basis.CommodityManagement.getPrintData
      this.$axios
        .post(url, codes)
        .then((res) => {
          if (res.data.Success) {
            this.printTableData = []
            this.printTableData = res.data.data
            for (var item of this.printTableData) {
              item.PrintNum = 1
            }
          } else {
            ElMessage.warning({ message: res.data.Msg, type: 'warning' })
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
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
      if (!this.searchForm.Type) {
        this.searchForm.Type = ''
      }
      if (typeof this.searchForm.Type != 'string') {
        var length = this.searchForm.Type.length - 1
        this.searchForm.Type = this.searchForm.Type[length]
      }
      this.funcGetTableData(
        this.searchForm.Name,
        this.searchForm.Code,
        this.searchForm.Type,
        localStorage.getItem('shopCode'),
        localStorage.getItem('OrganizationId'),
        this.searchForm.Status,
        this.page,
        this.pageSize
      )
    },
    eventReset() {
      this.searchForm = {
        Name: '',
        Code: '',
        Type: '',
        Status: '',
      }
    },
    eventDetele() {
      if (this.tableDeteleData.length == 0) {
        ElMessage.warning({ message: '还未选择', type: 'warning' })
      } else {
        var MatNos = []
        for (var item of this.tableDeteleData) {
          MatNos.push(item.Id)
        }
        MatNos = MatNos.join(',')
        this.funcTableDeteleList(
          MatNos,
          localStorage.getItem('shopCode'),
          localStorage.getItem('userType')
        )
      }
    },
    eventTableSelect(val) {
      this.tableDeteleData = val
    },
    eventOpenWindow(row) {
      if (row) {
        localStorage.setItem('CommodityManagementId', row.Id)
        router.push('/UpdateCommodityManagement')
      } else {
        router.push('/AddCommodityManagement')
      }
    },
    //批量更新状态
    eventUpdateStatus(Status) {
      if (this.tableDeteleData.length == 0) {
        this.$message({ message: '还未选择', type: 'warning' })
        return
      }
      //console.log(Status);
      var Ids = []
      for (var item of this.tableDeteleData) {
        Ids.push(item.Id)
      }
      Ids = Ids.join(',')
      var url =
        basis.CommodityManagement.updateStatus +
        '?userName=' +
        localStorage.getItem('ms_username') +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType') +
        '&activeStatus=' +
        Status +
        '&Ids=' +
        Ids
      this.$axios
        .put(url)
        .then((res) => {
          ElMessage.success({ message: '更新成功', type: 'success' })
          this.eventSearch()
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //导出
    eventExport() {
      if (!this.searchForm.Type) {
        this.searchForm.Type = ''
      }
      if (typeof this.searchForm.Type != 'string') {
        var length = this.searchForm.Type.length - 1
        this.searchForm.Type = this.searchForm.Type[length]
      }
      var ids = []
      for (var item of this.tableDeteleData) {
        ids.push(item.Id)
      }
      //ids = ids.join(",");
      const productName = encodeURIComponent(this.searchForm.Name)
      var url_1 =
        basis.CommodityManagement.Export +
        '?productName=' +
        productName +
        '&productCode=' +
        this.searchForm.Code +
        '&matType=' +
        this.searchForm.Type +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&orgId=' +
        localStorage.getItem('OrganizationId') +
        '&activeStatus=' +
        this.searchForm.Status
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
    //导出模板
    eventExportTemplate() {
      window.location.href = './export/商品信息.xlsx'
    },
    //上传excel到后端
    eventUploadExcel(data) {
      var formData = new FormData()
      formData.append('file', data.target.files[0])
      formData.append('fileName', data.target.files[0].name)
      //把excel发给后端
      var url = basis.CommodityManagement.Import + '?fileModule=' + 10
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
            basis.CommodityManagement.ImportSuccess +
            '?shopCode=' +
            localStorage.getItem('shopCode')
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

    //打开打印窗口
    eventOpenPrint() {
      this.funcGetPrintTableData()
      this.printDialogVisible = true
    },
    //条形码打印模板设计
    eventPrintTemplate() {
      var InvoiceCode = 'AAAAAAAAAAAA'
      var shopName = '商品名称'
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
      LODOP.PRINT_INITA(0, 0, 152, 112, '')

      eval(this.BarCodeTemplate)

      var that = this
      if (LODOP.CVERSION)
        CLODOP.On_Return = function (TaskID, Value) {
          //console.log('Value:' + Value);  //这个是返回的完整的设计代码
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
                    message: '条形码模板已修改',
                    type: 'success',
                  })
                })
                .catch((err) => {
                  that.$message({ message: err, type: 'warning' })
                })
            }
          that.BarCodeTemplate = LODOP.GET_VALUE('ProgramCodes', 1) //参数1表示获取的是排除了初始化的JS代码
        }
      LODOP.PRINT_DESIGN() //打印设计或者打印维护需要放到最后
    },
    //条形码打印预览和打印
    eventPrint(val) {
      var arr = []
      for (var item of this.printTableData) {
        if (
          item.BarCode == '' ||
          item.BarCode == null ||
          item.BarCode == undefined
        ) {
          this.$message({
            message: '不能打印条形码为空的条码',
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
            message: '打印失败，未能识别到C-Lpdop，请检查是否安装好C-Lodop！',
            type: 'warning',
          })
        }, 100)
        return
      }
      LODOP.PRINT_INITA(0, 0, 152, 112, '')

      for (var item of arr) {
        // if(item.BarCode == '' || item.BarCode == null || item.BarCode == undefined){
        // 	this.$message({message: '不能打印条形码为空的条码',type: 'warning'});
        // 	return;
        // }
        // var InvoiceCode = item.BarCode;
        // var shopName = item.name;
        // console.log(shopName);
        // console.log(InvoiceCode);
        LODOP.NewPageA()
        eval(
          'var InvoiceCode = item.BarCode;var shopName = item.name;' +
            this.BarCodeTemplate
        )
      }

      if (val == 1) {
        //预览
        LODOP.PREVIEW()
      } else {
        //打印
        LODOP.PRINT()
        this.printDialogVisible = false
      }
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

    // 商品导入
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
    this.eventSearch()
    this.funcGetCommodityCategoriesList(
      '',
      localStorage.getItem('shopCode'),
      localStorage.getItem('userType')
    )
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'CommodityManagement') {
        this.permissionsList = item.Rights
      }
    }
    this.funcGetBarCodeTemplate()
    Bus.on('CommodityManagementGetTableData', () => {
      this.eventSearch()
    })
  },
  watch: {},
}
