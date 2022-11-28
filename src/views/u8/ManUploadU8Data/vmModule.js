import func from '../../func.js'
import RangeDate from '../../../components/rangeDate.vue'
import { getU8Data, U8BatchUpload } from '../../../api/apiv2/u8.js'
export default {
  name: 'ManUploadU8Data',
  data() {
    return {
      permissionsList: '',
      isShowPosition: '',
      username: '',
      tableData: [],
      searchForm: {
        startTime: new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 1,
          26
        )
          .toLocaleDateString()
          .replaceAll('/', '-'),
        endTime: new Date().toLocaleDateString().replaceAll('/', '-'),
        orderNo: '',
        type: -1,
      },
      pageSize: 20,
      currentPage: 1,
      total: 0,
      typeList: [
        {
          label: '全部',
          value: -1,
        },
        {
          label: '采购',
          value: 0,
        },
        {
          label: '退货',
          value: 8,
        },
        {
          label: '调拨',
          value: 2,
        },
        {
          label: '退库',
          value: 7,
        },
        {
          label: '景品出库',
          value: 3,
        },
        {
          label: '景品回库',
          value: 9,
        },
        {
          label: '消耗',
          value: 1,
        },
        {
          label: '报废',
          value: 4,
        },
        {
          label: '盘库',
          value: 5,
        },
      ],
      tableDeteleData: [],
      isDialogShow: false,
    }
  },
  computed: {},
  components: { RangeDate },
  methods: {
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
    // 获取列表数据
    async getTableData() {
      const res = await getU8Data({
        ...this.searchForm,
        page: this.currentPage,
        pageSize: this.pageSize,
      })
      this.tableData = res.Results
      this.total = res.TotalCount
    },
    init() {
      this.getTableData()
    },
    onReset() {
      this.searchForm = {
        startTime: new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 1,
          26
        )
          .toLocaleDateString()
          .replaceAll('/', '-'),
        endTime: new Date().toLocaleDateString().replaceAll('/', '-'),
        orderNo: '',
        type: -1,
      }
    },
    // 将类型转为中文
    typeText(row) {
      return this.typeList.find((i) => i.value == row.TypeValue).label
    },
    // 手工同步
    async onU8Sync() {
      this.isDialogShow = true
      try {
        await U8BatchUpload()
      } catch (err) {
      } finally {
        this.isDialogShow = false
      }
    },
  },
  mounted() {
    func.SearchJudge()
    this.username = localStorage.getItem('ms_username')
    this.isShowPosition = localStorage.getItem('isShowPosition')
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'CategoryManagement') {
        this.permissionsList = item.Rights
      }
    }
    this.init()
  },
}
