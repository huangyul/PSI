import $, { timers } from 'jquery'
import scene from '../../../api/sceneApi.js'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import RangeDate from '../../../components/rangeDate.vue'
export default {
  components: { RangeDate },
  name: 'SceneSalesInbound',
  data() {
    return {
      permissionsList: '',
      username: '',
      addDate: '',
      searchForm: {
        device: '',
        noseNum: '',
        product: '',
        InTime: '',
        startTime: '',
        endTime: '',
        shopInfo: '',
      },
      tableData: [],
      dialogVisible: false,
      addForm: {
        ProductSaleOutBackNum: [],
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
      var startData = ''
      var endDate = ''
      if (this.searchForm.InTime) {
        startData = func.formatTimeToStr(
          this.searchForm.InTime[0],
          'yyyy-MM-dd'
        )
        endDate = func.formatTimeToStr(this.searchForm.InTime[1], 'yyyy-MM-dd')
      }
      var url =
        scene.SceneSalesInbound.query +
        '?device=' +
        encodeURIComponent(device) +
        '&noseNum=' +
        noseNum +
        '&product=' +
        encodeURIComponent(product) +
        '&startTime=' +
        this.searchForm.startTime +
        '&endTime=' +
        this.searchForm.endTime +
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
          this.tableData = res.data.Datas //res.data.Results;
          this.total = res.data.Total
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
        InTime: '',
        startTime: '',
        endTime: '',
        shopInfo: '',
      }
    },
    eventTableSelect(val) {
      this.tableDeteleData = val
    },
    eventChangeBackNum(val, index, row) {
      if (val == undefined) {
        this.tableData[index].BackAmount = ''
        this.tableData[index].BackAmountByTax = ''
      } else {
        this.tableData[index].BackAmount =
          this.tableData[index].BackNum * this.tableData[index].Price
        this.tableData[index].BackAmount = parseFloat(
          this.tableData[index].BackAmount.toFixed(2)
        )
        this.tableData[index].BackAmountByTax =
          this.tableData[index].BackNum * this.tableData[index].PriceByTax
        this.tableData[index].BackAmountByTax = parseFloat(
          this.tableData[index].BackAmountByTax.toFixed(2)
        )
      }
    },
    eventSaveWindow() {
      if (this.tableDeteleData.length == 0) {
        ElMessage.warning({ message: '还未选择', type: 'warning' })
        return
      }
      var arr = []
      for (var item of this.tableDeteleData) {
        if (item.BackNum == undefined || item.BackNum == 0) {
          ElMessage.warning({
            message: '销售回库数量不能为0或者空',
            type: 'warning',
          })
          return
        }
        item.BackNum = parseInt(item.BackNum)
        if (item.BackNum > item.SaleNum) {
          ElMessage.warning({
            message: '销售回库数量不能大于销售数量',
            type: 'warning',
          })
          return
        }
        var obj = {
          IdList: item.IdList,
          Id: item.Id,
          DeviceName: item.DeviceName,
          AssetNum: item.AssetNum,
          NoseNum: item.NoseNum,
          ProductId: item.ProductId,
          ProductCode: item.ProductCode,
          ProductName: item.ProductName,
          UnitId: item.UnitId,
          UnitName: item.UnitName,
          Price: item.Price,
          SaleNum: item.SaleNum,
          BackNum: item.BackNum,
          BackAmount: item.BackAmount,
          BackAmountByTax: item.BackAmountByTax,
          Remark: item.Remark,
          ShopCode: item.ShopCode,
          ShopName: item.ShopName,
          PriceByTax: item.PriceByTax,
        }
        arr.push(obj)
      }
      //console.log(arr);return;
      var url =
        scene.SceneSalesInbound.save +
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
      // for (var itemData of this.tableData) {
      //     if (itemData.BackNum > 0) {
      //         var obj = {
      //             Id: itemData.Id,
      //             BackNum: itemData.BackNum,
      //             Remark: itemData.Remark
      //         };
      //         this.addForm.ProductSaleOutBackNum.push(obj);
      //     }
      // }
      // var params = JSON.parse(JSON.stringify(this.addForm.ProductSaleOutBackNum));
      // var url = scene.SceneSalesInbound.save + "?user=" +localStorage.getItem("ms_username");
      // this.$axios.post(url, params).then(res => {
      //     ElMessage.success({
      //         message: '更新成功',
      //         type: 'success',
      //     });
      //     this.eventSearch();
      // }).catch(err => {
      //     ElMessage.warning({
      //         message: err,
      //         type: 'warning',
      //     });
      // });
    },
    handleInput(e) {
      let a = e.key.replace(/[^\d]/g, '')
      if (!a && e.keyCode !== 8) {
        e.preventDefault()
      }
    },
  },
  mounted() {
    func.SearchJudge()
    this.username = localStorage.getItem('ms_username')
    //this.eventSearch();
    this.funcGetShopCodeList(localStorage.getItem('shopCode'))
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'SceneSalesInbound') {
        this.permissionsList = item.Rights
      }
    }
  },
  watch: {},
}
