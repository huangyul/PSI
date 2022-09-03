import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getLodop } from '../../LodopFuncs.js'
import RangeDate from '../../../components/rangeDate.vue'
export default {
  name: 'MachineManagement',
  components: { RangeDate },
  data() {
    return {
      permissionsList: '',
      username: '',
      addDate: '',
      searchForm: {
        AssetNum: '',
        deviceInfo: '',
        Id: '',
        date: [
          new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        ],
        InPrice: '',
        InType: '',
        InWhCode: '',
        InWhName: '',
        ModifyTime: '',
        Photo: '',
        Remark: '',
        ShopName: '',
        Status: -1,
        UnitName: '',
        Usage: '',
        Modifier: '',
        startTime: '',
        endTime: '',
      },
      tableData: [],
      dialogVisible: false,
      addForm: {},
      tableDeteleData: '',
      OpenWindowTitle: '',
      page: 1,
      pageSize: 15,
      total: 0,
      shopCodeList: '',
      isUpdate: false,

      BarCodeTemplate: '',
      printTableData: [],
    }
  },
  methods: {
    funcGetTableData(
      assetNum,
      shopInfo,
      deviceInfo,
      startTime,
      endTime,
      inType,
      shopCode,
      userType,
      status,
      usage,
      page,
      pageSize
    ) {
      var url =
        basis.MachineManagement.query +
        '?assetNum=' +
        assetNum +
        '&shopInfo=' +
        shopInfo +
        '&deviceInfo=' +
        deviceInfo +
        '&startTime=' +
        startTime +
        '&endTime=' +
        endTime +
        '&inType=' +
        inType +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType +
        '&status=' +
        status +
        '&usage=' +
        usage +
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
    funcGetCurrenCode(tableName, matType) {},
    //单独删除
    funcTableDetele(id, updateTime, shopCode, userType) {},
    //批量删除
    funcTableDeteleList(ids, shopCode, userType) {},
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
    //获取门店信息列表
    funcGetShopCodeList(shopCode) {
      var url = basis.GetShopCodeList + '?shopCode=' + shopCode
      this.$axios
        .get(url)
        .then((res) => {
          this.shopCodeList = res.data
          if (this.shopCodeList.length == 1) {
            this.searchForm.ShopName = this.shopCodeList[0].Code
          }
          // this.eventSearch()
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
    eventPageSizeChange(val) {
      this.pageSize = val
      this.eventSearch()
    },
    eventPageChange(val) {
      this.page = val
      this.eventSearch()
    },
    eventSearch() {
      if (!this.searchForm.Status) {
        this.searchForm.Status = -1
      }
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
        this.searchForm.AssetNum,
        this.searchForm.ShopName,
        this.searchForm.deviceInfo,
        this.searchForm.startTime,
        this.searchForm.endTime,
        this.searchForm.InType,
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType'),
        this.searchForm.Status,
        -4,
        this.page,
        this.pageSize
      )
    },
    eventReset() {
      this.searchForm = {
        AssetNum: '',
        deviceInfo: '',
        Id: '',
        date: null,
        InPrice: '',
        InType: '',
        InWhCode: '',
        InWhName: '',
        ModifyTime: '',
        Photo: '',
        Remark: '',
        ShopName: '',
        Status: -1,
        UnitName: '',
        Usage: '',
        Modifier: '',
        startTime: '',
        endTime: '',
      }
    },
    eventDetele() {},
    eventTableSelect(val) {
      this.tableDeteleData = val
    },
    eventOpenWindow(row) {
      this.funcGetDate()
      if (row) {
        this.OpenWindowTitle = '编辑'
        var url = basis.MachineManagement.queryOne + '?id=' + row.Id
        this.$axios
          .get(url)
          .then((res) => {
            this.addForm = {
              ProductId: res.data.ProductId,
              AssetNum: res.data.AssetNum,
              DeviceCode: res.data.DeviceCode,
              DeviceName: res.data.DeviceName,
              Id: res.data.Id,
              InDate: res.data.InDate,
              InPrice: res.data.InPrice,
              InType: res.data.InType,
              InWhCode: res.data.InWhCode,
              InWhName: row.InWhName,
              ModifyTime: res.data.ModifyTime,
              Photo: row.Photo,
              Remark: res.data.Remark,
              ShopName: row.ShopName,
              Status: res.data.Status,
              UnitName: row.UnitName,
              Usage: res.data.Usage,
              Modifier: this.username,
              UpdateTime: res.data.UpdateTime,
            }
            if (this.addForm.Status == 0) {
              this.addForm.Status = ''
            }
          })
          .catch((err) => {
            this.$message({
              message: err,
              type: 'warning',
            })
            this.eventSearch()
          })
      } else {
      }
      this.dialogVisible = true
    },
    eventSaveWindow() {
      if (this.OpenWindowTitle == '新增') {
      } else if (this.OpenWindowTitle == '编辑') {
        if (!this.addForm.Status || !this.addForm.AssetNum) {
          ElMessage.warning({
            message: '资产状态，固定资产编号不能为空',
            type: 'warning',
          })
          return
        }
        if (this.addForm.Status == 2 || this.addForm.Status == 3) {
          if (
            this.addForm.AssetNum.length != 6 ||
            this.addForm.AssetNum.substr(0, 1) != 'H'
          ) {
            ElMessage.warning({
              message: '该资产状态下，固定资产编号长度为6并且要以H开头',
              type: 'warning',
            })
            return
          }
        } else {
          if (
            this.addForm.AssetNum.length > 20 ||
            this.addForm.AssetNum.substr(0, 1) == 'H' ||
            this.addForm.AssetNum.substr(0, 1) == 'h'
          ) {
            ElMessage.warning({
              message:
                '该资产状态下，固定资产编号长度不能超过20并且不能以H或者h开头',
              type: 'warning',
            })
            return
          }
        }
        const loading = func.backgroundLoading('Loading')
        var params = JSON.parse(JSON.stringify(this.addForm))
        if (!params.Status) {
          params.Status = 0
        }
        var url =
          basis.MachineManagement.update +
          '?shopCode=' +
          localStorage.getItem('shopCode') +
          '&userType=' +
          localStorage.getItem('userType')
        this.$axios
          .put(url, params)
          .then((res) => {
            loading.close()
            ElMessage.success({ message: '更新成功', type: 'success' })
            this.eventSearch()
            this.dialogVisible = false
          })
          .catch((err) => {
            loading.close()
            ElMessage.warning({ message: err, type: 'warning' })
          })
      }
      //this.dialogVisible = false;
    },
    //导出
    eventExport() {
      if (!this.searchForm.Status) {
        this.searchForm.Status = -1
      }
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
      var ids = []
      for (var item of this.tableDeteleData) {
        ids.push(item.Id.toString())
      }
      //ids = ids.join(",");
      var url_1 =
        basis.MachineManagement.Export +
        '?assetNum=' +
        this.searchForm.AssetNum +
        '&shopInfo=' +
        this.searchForm.ShopName +
        '&deviceInfo=' +
        this.searchForm.deviceInfo +
        '&startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
        '&inType=' +
        this.searchForm.InType +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType') +
        '&status=' +
        this.searchForm.Status +
        '&usage=' +
        -1
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

    //获取打印信息
    eventprint() {
      if (this.tableDeteleData.length == 0) {
        this.$message({ message: '还未选择', type: 'warning' })
        return
      }
      var ids = []
      for (var item of this.tableDeteleData) {
        ids.push(item.Id.toString())
      }
      //ids = ids.join(",");
      var url = basis.MachineManagement.getPrintData
      this.$axios
        .post(url, ids)
        .then((res) => {
          this.printTableData = []
          for (var item of res.data) {
            var obj = {
              PrintNum: 1,
              ProductName: item.DeviceName,
              BarCode: item.AssetNum,
            }
            this.printTableData.push(obj)
          }
          this.eventPrint(2)
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //条形码打印模板设计
    eventPrintTemplate() {
      var InvoiceCode = 'AAAAAAAAAA1111111111'
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
            message: '不能打印资产编号为空的机器条码',
            type: 'warning',
          })
          return
        }
        for (var i = 0; i < item.PrintNum; i++) {
          var obj = {
            name: item.ProductName,
            BarCode: 'M' + item.BarCode,
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
        // 	this.$message({message: '不能打印资产编号为空的机器条码',type: 'warning'});
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
        //预览
        LODOP.PREVIEW()
      } else {
        //打印
        LODOP.PRINT()
      }
    },
  },
  mounted() {
    func.SearchJudge()
    this.username = localStorage.getItem('ms_username')
    this.funcGetShopCodeList(localStorage.getItem('shopCode'))
    //this.eventSearch();
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'MachineManagement') {
        this.permissionsList = item.Rights
      }
    }
    this.funcGetBarCodeTemplate()
    // this.searchForm.startTime = new Date(
    //   new Date().getFullYear(),
    //   new Date().getMonth(),
    //   1
    // )
    // this.searchForm.endTime = new Date(
    //   new Date().getFullYear(),
    //   new Date().getMonth() + 1,
    //   0
    // )
  },
  watch: {
    'addForm.Status'(newVal, oldVal) {
      if (!this.isUpdate) {
        this.isUpdate = true
      } else {
        if (newVal == 2 || newVal == 3 || newVal == 4) {
          var url = basis.MachineManagement.getAssetNum + '?status=' + newVal
          this.$axios
            .get(url)
            .then((res) => {
              this.addForm.AssetNum = res.data
            })
            .catch((err) => {
              this.$message({ message: err, type: 'warning' })
            })
        }
      }
    },
    dialogVisible(newVal, oldVal) {
      if (newVal == false) {
        this.isUpdate = false
      }
    },
  },
}
