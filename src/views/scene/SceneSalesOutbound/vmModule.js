import $ from 'jquery'
import scene from '../../../api/sceneApi.js'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  name: 'SceneSalesOutbound',
  data() {
    return {
      permissionsList: '',
      username: '',
      addDate: '',
      searchForm: {
        device: '',
        noseNum: '',
        product: '',
        shopInfo: '',
      },
      tableData: [],
      dialogVisible: false,
      addForm: {
        ProductSaleOutSurplusNum: [],
      },
      tableDeteleData: '',
      OpenWindowTitle: '',
      page: 1,
      pageSize: 15,
      total: 0,
      shopList: [],
    }
  },
  methods: {
    funcGetTableData(
      device,
      noseNum,
      product,
      shopInfo,
      shopCode,
      page,
      pageSize
    ) {
      var url =
        scene.SceneSalesOutbound.query +
        '?device=' +
        encodeURIComponent(device) +
        '&noseNum=' +
        noseNum +
        '&product=' +
        encodeURIComponent(product) +
        '&shopInfo=' +
        shopInfo +
        '&shopCode=' +
        shopCode +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .get(url)
        .then((res) => {
          //console.log(res);
          this.tableData = res.data.Results
          for (var item of this.tableData) {
            item.SurplusNum = undefined
            item.SaleNum = ''
            item.SaleAmount = ''
            item.SaleAmountByTax = ''
          }
          this.total = res.data.TotalCount
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
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
          }
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
    eventPageSizeChange(val) {
      this.pageSize = val
      this.eventSearch()
    },
    eventPageChange(val) {
      this.page = val
      this.eventSearch()
    },
    eventSearch() {
      this.funcGetTableData(
        this.searchForm.device,
        this.searchForm.noseNum,
        this.searchForm.product,
        this.searchForm.shopInfo,
        localStorage.getItem('shopCode'),
        this.page,
        this.pageSize
      )
    },
    eventReset() {
      this.searchForm = {
        device: '',
        noseNum: '',
        product: '',
        shopInfo: '',
      }
    },
    //当表格中的下单组数被改变
    eventChangeSaleNum(val, index, row) {
      if (val == undefined) {
        this.tableData[index].SaleNum = ''
        this.tableData[index].SaleAmount = ''
        this.tableData[index].SaleAmountByTax = ''
      } else {
        this.tableData[index].SaleNum =
          this.tableData[index].OutNum - this.tableData[index].SurplusNum
        this.tableData[index].SaleAmount =
          this.tableData[index].SaleNum * this.tableData[index].Price
        this.tableData[index].SaleAmount = parseFloat(
          this.tableData[index].SaleAmount.toFixed(2)
        )
        this.tableData[index].SaleAmountByTax =
          this.tableData[index].SaleNum * this.tableData[index].PriceByTax
        this.tableData[index].SaleAmountByTax = parseFloat(
          this.tableData[index].SaleAmountByTax.toFixed(2)
        )
      }
    },
    handleInput(e) {
      let a = e.key.replace(/[^\d]/g, '')
      if (!a && e.keyCode !== 8) {
        e.preventDefault()
      }
    },
    eventTableSelect(val) {
      this.tableDeteleData = val
    },
    eventSaveWindow() {
      if (this.tableDeteleData.length == 0) {
        ElMessage.warning({ message: '还未选择', type: 'warning' })
        return
      }
      var arr = []
      for (var item of this.tableDeteleData) {
        if (item.SurplusNum == undefined) {
          ElMessage.warning({ message: '陈列数量不能为空', type: 'warning' })
          return
        }
        item.SurplusNum = parseInt(item.SurplusNum)
        if (item.SurplusNum > item.OutNum) {
          ElMessage.warning({
            message: '陈列数量不能大于出库数量',
            type: 'warning',
          })
          return
        }
        // var obj = {
        // 	Id: item.Id,
        // 	SurplusNum: item.SurplusNum,
        // 	Remark: item.Remark,
        // }
        var obj = {
          IdList: item.IdList,
          DeviceCode: item.DeviceCode,
          DeviceName: item.DeviceName,
          AssetNum: item.AssetNum,
          NoseNum: item.NoseNum,
          ProductId: item.ProductId,
          ProductCode: item.ProductCode,
          ProductName: item.ProductName,
          UnitId: item.UnitId,
          UnitName: item.UnitName,
          Price: item.Price,
          OutNum: item.OutNum,
          SurplusNum: item.SurplusNum,
          SaleNum: item.SaleNum,
          SaleAmount: item.SaleAmount,
          SaleAmountByTax: item.SaleAmountByTax,
          ShopCode: item.ShopCode,
          ShopName: item.ShopName,
          PriceByTax: item.PriceByTax,
        }
        arr.push(obj)
      }
      //console.log(arr);return;
      var url =
        scene.SceneSalesOutbound.save +
        '?user=' +
        localStorage.getItem('userCode')
      this.$axios
        .post(url, arr)
        .then((res) => {
          ElMessage.success({ message: '保存成功', type: 'success' })
          this.eventSearch()
        })
        .catch((err) => {
          ElMessage.warning({ message: err, type: 'warning' })
        })
      // this.addForm.ProductSaleOutSurplusNum = [];
      //       for (var itemData of this.tableData) {
      //           if (itemData.SurplusNum > 0) {
      //               var obj = {
      //                   Id: itemData.Id,
      //                   SurplusNum: itemData.SurplusNum,
      //                   Remark: itemData.Remark
      //               };
      //               this.addForm.ProductSaleOutSurplusNum.push(obj);
      //           }
      //       }
      //       var params = JSON.parse(JSON.stringify(this.addForm.ProductSaleOutSurplusNum));
      // for(var item of params){
      // 	item.SurplusNum = parseInt(item.SurplusNum);
      // }
      //       var url = scene.SceneSalesOutbound.save + "?user=" + localStorage.getItem("ms_username");
      //       this.$axios.post(url, params).then(res => {
      //           ElMessage.success({
      //               message: '更新成功',
      //               type: 'success',
      //           });
      //           this.eventSearch();
      //       }).catch(err => {
      //           ElMessage.warning({
      //               message: err,
      //               type: 'warning',
      //           });
      //       });
    },
  },
  mounted() {
    func.SearchJudge()
    this.username = localStorage.getItem('ms_username')
    //this.eventSearch();
    this.funcGetShopCodeList(localStorage.getItem('shopCode'))
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'SceneSalesOutbound') {
        this.permissionsList = item.Rights
      }
    }
  },
  watch: {},
}
