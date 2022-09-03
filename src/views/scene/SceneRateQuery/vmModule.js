import func from '../../func.js'
import basis from '../../../api/basisApi.js'
import stock from '../../../api/sceneApi.js'
import RangeDate from '../../../components/rangeDate.vue'
export default {
  components: { RangeDate },
  name: 'SceneRateQuery',
  data() {
    return {
      permissionsList: '',
      DataByNoseNum: {
        tableData: [],
        total: 0,
        page: 1,
        pageSize: 15,
      },
      DataByAssetNum: {
        tableData: [],
        total: 0,
        page: 1,
        pageSize: 15,
      },
      DataByGroupId: {
        tableData: [],
        total: 0,
        page: 1,
        pageSize: 15,
      },
      searchForm: {
        device: '', //机器
        noseNum: '', //机头编号
        deviceGroup: '', //机器分组
        InDate: [new Date(), new Date()], //统计日期-开始日期到结束日期
        timeType: '', //时间汇总方式
        startTime: new Date(),
        endTime: new Date(),
        statisticalMethods: 'Product', //统计方法
      },
      WarehouseList: '',
      PositionList: '',
      matTypeList: '',
    }
  },
  methods: {
    //获取设备分组信息列表,用于绑定查询条件
    funcGetWhOrPositionInfo() {
      var url = basis.DeviceGroupsInfo
      this.$axios
        .get(url)
        .then((res) => {
          this.WarehouseList = res.data
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取商品类别
    funcGetMatType() {
      var url =
        basis.CategoryManagement.tree +
        '?bussinessType=&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType')
      this.$axios
        .get(url)
        .then((res) => {
          this.matTypeList = []
          this.matTypeList.push({ ID: '', Name: '全部' })
          for (var j = 0; j < res.data.length; j++) {
            this.matTypeList.push({
              ID: res.data[j].Id,
              Name: res.data[j].Name,
            })
            for (var i = 0; i < res.data[j].children.length; i++) {
              this.matTypeList.push({
                ID: res.data[j].children[i].Id,
                Name: res.data[j].children[i].Name,
              })
            }
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取总数据
    funcGetTableData(
      type,
      device,
      noseNum,
      deviceGroup,
      timeType,
      statisticalMethods,
      InDate,
      page,
      pageSize
    ) {
      var startData = ''
      var endDate = ''
      if (InDate) {
        InDate[0] = func.formatTimeToStr(InDate[0], 'yyyy-MM-dd')
        InDate[1] = func.formatTimeToStr(InDate[1], 'yyyy-MM-dd')
        startData = InDate[0]
        endDate = InDate[1]
      }

      var stockApi = ''
      var deviceType = ''
      switch (type) {
        case 'ByNoseNum': //ByNoseNum 按机位排序
          stockApi = stock.SceneRateQueryList.SearchByNoseNum
          deviceType = 'NoseNum'
          break
        case 'ByAssetNum': //ByAssetNum按机器排序
          stockApi = stock.SceneRateQueryList.SearchByAssetNum
          deviceType = 'AssetNum'
          break
        case 'ByGroupId': //ByGroupId按机器分组排序
          stockApi = stock.SceneRateQueryList.SearchByGroupId
          deviceType = 'GroupId'
          break
      }
      var url =
        stockApi +
        '?device=' +
        encodeURIComponent(device) +
        '&noseNum=' +
        noseNum +
        '&deviceGroup=' +
        deviceGroup +
        '&timeType=' +
        timeType +
        '&statisticalMethods=' +
        statisticalMethods +
        '&saleDateStart=' +
        this.searchForm.startTime +
        '&saleDateEnd=' +
        this.searchForm.endTime +
        '&deviceType=' +
        deviceType +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&userType=' +
        localStorage.getItem('userType') +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .get(url)
        .then((res) => {
          switch (type) {
            case 'ByNoseNum':
              this.DataByNoseNum.tableData = res.data.Results
              //for(var i=0;i<this.DataByNoseNum.tableData.length; i++)	{
              //    this.DataByNoseNum.tableData[i].SumNum = this.DataByNoseNum.tableData[i].StockNum + this.DataByNoseNum.tableData[i].ZtNum;
              //}
              this.DataByNoseNum.total = res.data.TotalCount
              break
            case 'ByAssetNum':
              this.DataByAssetNum.tableData = res.data.Results
              //for(var i=0;i<this.DataByAssetNum.tableData.length; i++)	{
              //    this.DataByAssetNum.tableData[i].SumNum = this.DataByAssetNum.tableData[i].StockNum + this.DataByAssetNum.tableData[i].ZtNum;
              //}
              this.DataByAssetNum.total = res.data.TotalCount
              break
            case 'ByGroupId':
              this.DataByGroupId.tableData = res.data.Results
              //for(var i=0;i<this.DataByGroupId.tableData.length; i++)	{
              //   this.DataByGroupId.tableData[i].SumNum = this.DataByGroupId.tableData[i].StockNum + this.DataByGroupId.tableData[i].ZtNum;
              //}
              this.DataByGroupId.total = res.data.TotalCount
              break
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //根据机器分组查找机器分组名称
    funcGetDeviceGroupName(data) {
      var name = ''
      for (var item of this.WarehouseList) {
        if (item.GroupId == data) {
          name = item.GroupName
        }
      }
      return name
    },
    eventPageSizeChange(pagesize, type) {
      switch (type) {
        case 'ByNoseNum':
          this.DataByNoseNum.pageSize = pagesize
          break
        case 'ByAssetNum':
          this.DataAssetNum.pageSize = pagesize
          break
        case 'ByGroupId':
          this.DataByGroupId.pageSize = pagesize
          break
      }
      this.funcGetTableData(
        type,
        this.searchForm.device,
        this.searchForm.noseNum,
        this.searchForm.deviceGroup,
        this.searchForm.timeType,
        this.searchForm.statisticalMethods,
        this.searchForm.InDate,
        1,
        pagesize
      )
    },
    eventPageChange(page, type) {
      var pagesize = 15
      switch (type) {
        case 'ByNoseNum':
          this.DataByNoseNum.page = page
          pagesize = this.DataByNoseNum.pageSize
          break
        case 'ByAssetNum':
          this.DataByAssetNum.page = page
          pagesize = this.DataByAssetNum.pageSize
          break
        case 'ByGroupId':
          this.DataByGroupId.page = page
          pagesize = this.DataByGroupId.pageSize
          break
      }
      this.funcGetTableData(
        type,
        this.searchForm.device,
        this.searchForm.noseNum,
        this.searchForm.deviceGroup,
        this.searchForm.timeType,
        this.searchForm.statisticalMethods,
        this.searchForm.InDate,
        page,
        pagesize
      )
    },
    eventSearch() {
      this.funcGetTableData(
        'ByNoseNum',
        this.searchForm.device,
        this.searchForm.noseNum,
        this.searchForm.deviceGroup,
        this.searchForm.timeType,
        this.searchForm.statisticalMethods,
        this.searchForm.InDate,
        1,
        this.DataByNoseNum.pageSize
      )
      this.funcGetTableData(
        'ByAssetNum',
        this.searchForm.device,
        this.searchForm.noseNum,
        this.searchForm.deviceGroup,
        this.searchForm.timeType,
        this.searchForm.statisticalMethods,
        this.searchForm.InDate,
        1,
        this.DataByAssetNum.pageSize
      )
      this.funcGetTableData(
        'ByGroupId',
        this.searchForm.device,
        this.searchForm.noseNum,
        this.searchForm.deviceGroup,
        this.searchForm.timeType,
        this.searchForm.statisticalMethods,
        this.searchForm.InDate,
        1,
        this.DataByGroupId.pageSize
      )
    },
    //重置按钮
    eventReset() {
      this.searchForm = {
        device: '',
        noseNum: '',
        deviceGroup: '',
        timeType: '',
        statisticalMethods: 'Sale',
        InDate: '',
      }
    },
    //导出
    eventExport() {
      var startData = ''
      var endDate = ''
      if (this.searchForm.InDate) {
        startData = func.formatTimeToStr(
          this.searchForm.InDate[0],
          'yyyy-MM-dd'
        )
        endDate = func.formatTimeToStr(this.searchForm.InDate[1], 'yyyy-MM-dd')
      }
      var url_1 =
        stock.SceneRateQueryList.Export +
        '?device=' +
        this.searchForm.device +
        '&noseNum=' +
        this.searchForm.noseNum +
        '&deviceGroup=' +
        this.searchForm.deviceGroup +
        '&saleDateStart=' +
        this.searchForm.startTime +
        '&saleDateEnd=' +
        this.searchForm.endTime +
        '&timeType=' +
        this.searchForm.timeType +
        '&statisticalMethods=' +
        this.searchForm.statisticalMethods +
        '&shopCode=' +
        localStorage.getItem('shopCode')

      this.$axios
        .post(url_1, [])
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
    funcRowClassName({ row, rowIndex }) {
      let className = ''
      if (rowIndex % 2 == 1) {
        className += 'double-row'
      }
      return className
    },
  },
  mounted() {
    func.SearchJudge()
    this.funcGetWhOrPositionInfo() //获取仓库列表
    this.funcGetTableData(
      'ByNoseNum',
      this.searchForm.device,
      this.searchForm.noseNum,
      this.searchForm.deviceGroup,
      this.searchForm.timeType,
      this.searchForm.statisticalMethods,
      this.searchForm.InDate,
      1,
      this.DataByNoseNum.pageSize
    )
    this.funcGetTableData(
      'ByAssetNum',
      this.searchForm.device,
      this.searchForm.noseNum,
      this.searchForm.deviceGroup,
      this.searchForm.timeType,
      this.searchForm.statisticalMethods,
      this.searchForm.InDate,
      1,
      this.DataByAssetNum.pageSize
    )
    this.funcGetTableData(
      'ByGroupId',
      this.searchForm.device,
      this.searchForm.noseNum,
      this.searchForm.deviceGroup,
      this.searchForm.timeType,
      this.searchForm.statisticalMethods,
      this.searchForm.InDate,
      1,
      this.DataByGroupId.pageSize
    )
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'SceneRateQuery') {
        this.permissionsList = item.Rights
      }
    }
  },
  watch: {},
}
