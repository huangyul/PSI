import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import WangEditor from 'wangEditor'
import JsBarcode from 'jsbarcode'
import router from '../../../router'
import { useStore } from 'vuex'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { ref, reactive, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import Bus from '../../Bus.js'
export default {
  name: 'AddCommodityManagement',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    //关闭当前页面的标签页
    const closeThisRouter = () => {
      store.commit('closeCurrentTag', {
        $router: router,
        $route: route,
      })
    }

    return {
      closeThisRouter,
    }
  },
  data() {
    return {
      form: {
        Mat_No: '',
        Mat_Name: '',
        MatTypeId: '',
        Price: 0,
        PriceByTax: 0,
        TaxRate: 0,
        Mast_UnitId: '',
        SupplierInfoIds: '',
        Manufacturer: '',
        Status: '1',
        Summary: '',
        ShopCode: '',
        Creater: '',
        CreateTime: '',
        Modifier: '',
        ModifyTime: '',
        UpdateTime: 0,
        OrganizationId: '',
        Other: {
          Mat_No: '',
          Photo: '',
          OrderNum: 0,
          SetNum: 0,
          OrderCycle: 0,
          NetLong: 0,
          NetWide: 0,
          NetHigh: 0,
          NetWeight: 0,
          PackLong: 0,
          PackWide: 0,
          PackHigh: 0,
          PackWeight: 0,
          Power: 0,
          CurrencyPerRound: 0,
          PurchaseType: 0,
          OutWarehouseCode: '',
          Purpose: '',
          Usage: '',
          Information: '',
        },
        Prices: [],
        item_Photos: [],
        ProductBarCodes: [],
        LinkInfo: {
          Mat_No: '',
          IsDiscount: true,
          IsSale: true,
          SalePrice: 0,
          SalePriceVIP: 0,
          IsPointExchange: true,
          IndividualExchange1: 0,
          IndividualExchangeVIP1: 0,
          IsPrizeTicketExchange: true,
          IndividualExchange2: 0,
          IndividualExchangeVIP2: 0,
          IsTokenExchange: true,
          IndividualExchange3: 0,
          IndividualExchangeVIP3: 0,
          IsSpecialExchange: true,
          IndividualExchange4: 0,
          IndividualExchangeVIP4: 0,
          MinStockNum: undefined,
          MaxStockNum: undefined,
          OverStockDay: undefined,
          LabelName: '',
          LabelDesc: '',
          ProductDescOne: '',
          ProductDescTwo: '',
          CustomNum: '',
          ProductModel: '',
          LogisticsSet: '0',
          IsStock: true,
        },
      },

      CategoryTree: [],
      SupplierList: [],
      UnitList: [],
      PhotoList: [],
      formPhotoList: [],
      ProductBarCodes: {
        Id: 0,
        BarCode: '',
        ProductCode: '',
        BarCodeType: 0,
      },
      Prices: {
        Id: 0,
        Mat_No: '',
        Before_PriceByTax: 0,
        Before_TaxRate: 0,
        Before_StartDate: '',
        After_PriceByTax: 0,
        After_TaxRate: 0,
        After_StartDate: '',
      },
      machineTreeLastId: [],
      Prices_After_TaxRate_1: 0,
      Prices_After_TaxRate_2: 0,
      editor: null,
      editorData: '',
      rules: {
        name: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur',
          },
        ],
        desc: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // 日期选择禁止今天以后的日期
    disabledDate(time) {
      return time.getTime() >= Date.now()
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
          this.machineTreeLastId = []
          this.funcRecursiveCategoryTree(this.CategoryTree)
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //供应商列表
    funcGetSupplierListData(
      supplierName,
      supplierId,
      shopCode,
      userType,
      topOrgId,
      activeStatus,
      page,
      pageSize
    ) {
      var url =
        basis.SupplierManagement.query +
        '?supplierName=' +
        supplierName +
        '&supplierId=' +
        supplierId +
        '&shopCode=' +
        shopCode +
        '&userType=' +
        userType +
        '&topOrgId=' +
        topOrgId +
        '&activeStatus=' +
        activeStatus +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .get(url)
        .then((res) => {
          this.SupplierList = []
          for (var item of res.data.Results) {
            if (item.ActiveStatus == 1) {
              this.SupplierList.push(item)
            }
          }
          //this.SupplierList = res.data.Results;
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取商品单位列表
    funcGetUnitTableData(unitName, unitNo, shopCode, userType, page, pageSize) {
      var url =
        basis.CommodityUnit.query +
        '?unitName=' +
        unitName +
        '&unitNo=' +
        unitNo +
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
          this.UnitList = res.data.Results
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //生成编号
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
          this.form.Mat_No = res.data
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    //递归品类List
    funcRecursiveCategoryTree(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (!data[i].children) {
          this.machineTreeLastId.push(data[i].Id)
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.funcRecursiveCategoryTree(data[i].children)
        }
      }
    },

    eventUploadImgChange(file, fileList) {
      this.PhotoList = fileList
      for (var i in this.PhotoList) {
        if (
          this.PhotoList[i].raw.type != 'image/png' &&
          this.PhotoList[i].raw.type != 'image/jpg' &&
          this.PhotoList[i].raw.type != 'image/jpeg'
        ) {
          this.$message({
            message: '只能上传png，jpg，jpeg格式的图片',
            type: 'warning',
          })
          this.PhotoList.splice(i, 1)
          continue
        }
        var num = this.PhotoList[i].raw.size / 1024 / 1024
        if (num > 2) {
          setTimeout(function () {
            ElMessage.warning({
              message: '上传图片字节大小不能超过2M',
              type: 'warning',
            })
          }, 100)
          //this.$message({ message: '上传图片字节大小不能超过2M', type: 'warning' });
          this.PhotoList.splice(i, 1)
          continue
        }
      }
      //console.log(this.PhotoList);
    },
    eventImgDetele(row) {
      for (var i in this.PhotoList) {
        if (this.PhotoList[i] == row) {
          this.PhotoList.splice(i, 1)
          return
        }
      }
    },
    eventGenerateBarCode() {
      //func.Barcode('barcode',this.ProductBarCodes.ProductCode);
      //func.Barcode('barcode',11111);
      //this.ProductBarCodes.BarCode = $("#barcode").attr("src");
    },
    //
    eventA(val, that) {
      console.log(typeof val)
    },
    //改变品类生成编号
    eventChangeMatTypeId() {
      var length = this.form.MatTypeId.length - 1
      var val = this.form.MatTypeId[length]
      this.funcGetCurrenCode('Item', val)
    },
    //保存
    eventSave() {
      if (this.Prices_After_TaxRate_1 == '自定义') {
        this.Prices.After_TaxRate = this.Prices_After_TaxRate_2
      } else {
        this.Prices.After_TaxRate = this.Prices_After_TaxRate_1
      }

      if (!this.form.Mat_Name) {
        ElMessage.warning({ message: '商品名称不能为空', type: 'warning' })
        return
      }
      if (!this.form.Mat_No) {
        ElMessage.warning({ message: '商品编号不能为空', type: 'warning' })
        return
      }
      if (!this.form.MatTypeId) {
        ElMessage.warning({ message: '商品品类不能为空', type: 'warning' })
        return
      }
      if (!this.form.SupplierInfoIds) {
        ElMessage.warning({ message: '供应商不能为空', type: 'warning' })
        return
      }
      if (this.Prices.After_PriceByTax == undefined) {
        ElMessage.warning({ message: '含税价格不能为空', type: 'warning' })
        return
      }
      if (this.Prices.After_TaxRate == undefined) {
        ElMessage.warning({ message: '商品税率不能为空', type: 'warning' })
        return
      }
      if (!this.Prices.After_StartDate) {
        ElMessage.warning({ message: '启用日期不能为空', type: 'warning' })
        return
      }
      if (!this.form.Mast_UnitId) {
        ElMessage.warning({ message: '商品单位不能为空', type: 'warning' })
        return
      }
      if (this.form.Other.OrderNum == undefined) {
        ElMessage.warning({ message: '下单数量不能为空', type: 'warning' })
        return
      }
      if (this.form.Other.SetNum == undefined) {
        ElMessage.warning({ message: '起订数量不能为空', type: 'warning' })
        return
      }
      if (this.form.Other.OrderCycle == undefined) {
        ElMessage.warning({ message: '订单周期不能为空', type: 'warning' })
        return
      }

      var isLast = false
      if (typeof this.form.MatTypeId != 'string') {
        var length = this.form.MatTypeId.length - 1
        this.form.MatTypeId = this.form.MatTypeId[length]
      }
      for (var item of this.machineTreeLastId) {
        if (this.form.MatTypeId == item) {
          isLast = true
        }
      }
      if (!isLast) {
        ElMessage.warning({
          message: '商品品类不是最底层品类',
          type: 'warning',
        })
        return
      }

      for (var item of this.SupplierList) {
        if (this.form.SupplierInfoIds == item.SupplierId) {
          this.form.Manufacturer = item.SupplierName
        }
      }
      this.form.Price =
        this.Prices.After_PriceByTax / (this.Prices.After_TaxRate / 100 + 1)
      this.form.Price = this.form.Price.toFixed(2)
      this.form.Price = parseFloat(this.form.Price)
      this.form.PriceByTax = this.Prices.After_PriceByTax
      this.form.TaxRate = this.Prices.After_TaxRate / 100

      var that = this
      this.formPhotoList = []

      that.form.Other.Mat_No = that.form.Mat_No
      that.Prices.Mat_No = that.form.Mat_No
      that.form.LinkInfo.Mat_No = that.form.Mat_No
      var myDate = new Date()
      that.form.CreateTime = func.formatTimeToStr(myDate)
      that.form.ModifyTime = func.formatTimeToStr(myDate)
      // var length = that.form.MatTypeId.length - 1;
      // that.form.MatTypeId = that.form.MatTypeId[length];
      that.form.Other.Information = that.editor.txt.html()
      that.Prices.After_StartDate = func.formatTimeToStr(
        that.Prices.After_StartDate
      )
      that.Prices.Before_StartDate = that.Prices.After_StartDate
      that.form.Prices = []
      that.form.Prices.push(that.Prices)
      that.ProductBarCodes.ProductCode = that.form.Mat_No
      that.form.ProductBarCodes = []
      that.form.ProductBarCodes.push(that.ProductBarCodes)
      that.form.Creater = localStorage.getItem('ms_username')
      that.form.Modifier = localStorage.getItem('ms_username')
      that.form.ShopCode = ''
      var params = JSON.parse(JSON.stringify(that.form))
      if (!params.Other.NetLong) {
        params.Other.NetLong = 0
      }
      if (!params.Other.NetWide) {
        params.Other.NetWide = 0
      }
      if (!params.Other.NetHigh) {
        params.Other.NetHigh = 0
      }
      if (!params.Other.NetWeight) {
        params.Other.NetWeight = 0
      }
      if (!params.Other.PackLong) {
        params.Other.PackLong = 0
      }
      if (!params.Other.PackWide) {
        params.Other.PackWide = 0
      }
      if (!params.Other.PackHigh) {
        params.Other.PackHigh = 0
      }
      if (!params.Other.PackWeight) {
        params.Other.PackWeight = 0
      }
      if (!params.Other.Power) {
        params.Other.Power = 0
      }
      if (!params.Other.CurrencyPerRound) {
        params.Other.CurrencyPerRound = 0
      }
      if (!params.LinkInfo.SalePrice) {
        params.LinkInfo.SalePrice = 0
      }
      if (!params.LinkInfo.SalePriceVIP) {
        params.LinkInfo.SalePriceVIP = 0
      }
      if (!params.LinkInfo.IndividualExchange1) {
        params.LinkInfo.IndividualExchange1 = 0
      }
      if (!params.LinkInfo.IndividualExchangeVIP1) {
        params.LinkInfo.IndividualExchangeVIP1 = 0
      }
      if (!params.LinkInfo.IndividualExchange2) {
        params.LinkInfo.IndividualExchange2 = 0
      }
      if (!params.LinkInfo.IndividualExchangeVIP2) {
        params.LinkInfo.IndividualExchangeVIP2 = 0
      }
      if (!params.LinkInfo.IndividualExchange3) {
        params.LinkInfo.IndividualExchange3 = 0
      }
      if (!params.LinkInfo.IndividualExchangeVIP3) {
        params.LinkInfo.IndividualExchangeVIP3 = 0
      }
      if (!params.LinkInfo.IndividualExchange4) {
        params.LinkInfo.IndividualExchange4 = 0
      }
      if (!params.LinkInfo.IndividualExchangeVIP4) {
        params.LinkInfo.IndividualExchangeVIP4 = 0
      }
      if (params.LinkInfo.MinStockNum == undefined) {
        params.LinkInfo.MinStockNum = ''
      }
      if (params.LinkInfo.MaxStockNum == undefined) {
        params.LinkInfo.MaxStockNum = ''
      }
      if (params.LinkInfo.OverStockDay == undefined) {
        params.LinkInfo.OverStockDay = ''
      }
      if (typeof params.LinkInfo.MinStockNum == 'number') {
        params.LinkInfo.MinStockNum = params.LinkInfo.MinStockNum + ''
      }
      if (typeof params.LinkInfo.MaxStockNum == 'number') {
        params.LinkInfo.MaxStockNum = params.LinkInfo.MaxStockNum + ''
      }
      if (typeof params.LinkInfo.OverStockDay == 'number') {
        params.LinkInfo.OverStockDay = params.LinkInfo.OverStockDay + ''
      }

      params.TaxRate = parseFloat(params.TaxRate.toFixed(4))
      params.Prices[0].After_TaxRate = params.TaxRate
      params.Prices[0].Before_TaxRate = params.TaxRate
      params.OrganizationId = localStorage.getItem('OrganizationId')

      const loading = func.backgroundLoading('Loading')
      if (this.PhotoList.length == 0) {
        params.Other.Photo = ''
        //var params = JSON.parse(JSON.stringify(that.form));
        //console.log(params);return;
        var paramsList = []
        paramsList.push(params)
        var url =
          basis.CommodityManagement.add +
          '?sysorgId=' +
          localStorage.getItem('OrganizationId')
        that.$axios
          .post(url, paramsList)
          .then((res) => {
            loading.close()
            ElMessage.success({
              message: '新增成功',
              type: 'success',
            })
            Bus.emit('CommodityManagementGetTableData')
            that.closeThisRouter()
          })
          .catch((err) => {
            loading.close()
            ElMessage.warning({
              message: err,
              type: 'warning',
            })
            //that.form.Mat_No = func.randomString(8);
            // Bus.emit("CommodityManagementGetTableData");
            // that.closeThisRouter();
          })
      } else {
        func.getBase64List(
          this.PhotoList,
          this.formPhotoList,
          0,
          function (data) {
            that.formPhotoList = data

            params.Other.Photo = that.formPhotoList[0]
            for (var item of that.formPhotoList) {
              var obj = {
                Photo: item,
              }
              params.item_Photos.push(obj)
            }
            //var params = JSON.parse(JSON.stringify(that.form));
            //console.log(params);return;
            var paramsList = []
            paramsList.push(params)
            var url =
              basis.CommodityManagement.add +
              '?sysorgId=' +
              localStorage.getItem('OrganizationId')
            that.$axios
              .post(url, paramsList)
              .then((res) => {
                loading.close()
                ElMessage.success({
                  message: '新增成功',
                  type: 'success',
                })

                Bus.emit('CommodityManagementGetTableData')
                that.closeThisRouter()
              })
              .catch((err) => {
                loading.close()
                ElMessage.warning({
                  message: err,
                  type: 'warning',
                })
                //that.form.Mat_No = func.randomString(8);
                // Bus.emit("CommodityManagementGetTableData");
                // that.closeThisRouter();
              })
          }
        )
      }
    },
    eventChangeBarCodeType(data) {
      // console.log(data);
      // if(data == 0){
      // }else if(data == 1){
      // }
    },
  },
  mounted() {
    func.TracingPointFunc()
    this.funcGetCategoryTableData(
      '',
      '',
      localStorage.getItem('shopCode'),
      localStorage.getItem('userType'),
      1,
      100000
    )
    this.funcGetSupplierListData(
      '',
      '',
      localStorage.getItem('shopCode'),
      localStorage.getItem('userType'),
      localStorage.getItem('OrganizationId'),
      -1,
      1,
      100000
    )
    this.funcGetUnitTableData(
      '',
      '',
      localStorage.getItem('shopCode'),
      localStorage.getItem('userType'),
      1,
      100000
    )

    const editor = new WangEditor('#editor')
    // 配置 onchange 回调函数，将数据同步到 vue 中
    editor.config.onchange = (newHtml) => {
      this.editorData = newHtml
      this.$emit('editorContent', newHtml)
    }
    // 配置 server 接口地址
    // editor.config.uploadImgServer = basis.CommodityManagement.editorUploadImg;
    // editor.config.uploadImgParams = {
    //     token: localStorage.getItem("Token"),
    // }
    // 创建编辑器
    editor.create()
    this.editor = editor

    $('.all').click()
  },
  watch: {},
  beforeDestroy() {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
  },
}
