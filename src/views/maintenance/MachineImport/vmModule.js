import func from '../../func.js'
import basis from '../../../api/basisApi.js'
import { ElMessage } from 'element-plus'
import RangeDate from '../../../components/rangeDate.vue'
import TaskDetail from '../../../components/TaskDetail.vue'
import ImportDialog from '../../../components/import-component/ImportDialog..vue'
import {  getDetail, getList, importMachineFile } from '../../../api/apiv2/machineImport.js'
export default {
  name: 'ExternalTransferOutBase',
  components: { RangeDate, TaskDetail, ImportDialog },
  data() {
    return {
      searchForm: {
        status: "",
        startTime: new Date(new Date(new Date().toLocaleDateString()).getTime()),
        endTime: new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),
        page: 1,
        pageSize: 15,
      },
      tableData: [],
      total: 0,
      subDialogVisible: false,
      detailTableData: [],
      detailPage: 1,
      detailPageSize: 15,
      detailTotal: 0,
      detailId: 0,
      isImportDialog: false,
      fileList: [],
      remark: "",
      importText: "文件正在处理，请勿关闭窗口...",
      importStatus: "importing",
      isShow: false,
      map: {
        status: new Map([[1, "自社资产"], [2, "租赁资产"], [3, "合作资产"], [4, "测试资产"]]),
        usage: new Map([[0, "新入库"], [1, "可使用"]])
      }
    }
  },
  methods: {
    importDialogClose() {
      this.fileList = []
    },
    async handleSearch() {
      const res = await getList({
        BeginDate: this.searchForm.startTime ? this.searchForm.startTime : null,
        EndDate: this.searchForm.endTime ? this.searchForm.endTime : null,
        Status: this.searchForm.status !== "" ? this.searchForm.status : null,
        Skip: (this.searchForm.page - 1) * this.searchForm.pageSize,
        Limit: this.searchForm.pageSize,
        Order: "-CreateTime"
      })
      this.tableData = res.data.Datas
      this.total = res.data.Total
    },
    handleReset() {
      this.searchForm.status = ""
      this.searchForm.startTime = new Date(new Date(new Date().toLocaleDateString()).getTime())
      this.searchForm.endTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
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
    // 删除文件列表中的文件
    deleteFile(key) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].key == key) {
          this.fileList.splice(i, 1)
          this.$refs.inputFile.value = ""
          return
        }
      }

    },
    // 导入
    async onImport() {
      if (this.fileList.length == 0) {
        return ElMessage.warning('请选择文件')
      }
      this.importText = "文件正在处理，请勿关闭窗口..."
      this.isShow = true
      this.importStatus = 'importing'
      let formData = new FormData()
      formData.append('File', this.fileList[0].file)
      try {
        // const res = await uploadFile(formData)
        const res = await importMachineFile(formData, { "Remark": this.remark })
        console.log(res)
        if (res.Success == true) {
          this.importStatus = 'success'
          this.importText = `导入成功，共导入${res.data.Num}条数据`
        } else {
          this.importStatus = 'error'
          this.importText = res.Msg
        }
      } catch (err) {
        this.fileList = []
        return
      } finally {
        setTimeout(() => {
          this.isShow = false
          this.isImportDialog = false
          this.handleSearch()
        }, 5000)
      }
    },
    // 导出模板
    eventExportTemplate() {
      window.location.href = './export/期初商品导入模板.xlsx'
    },
    // 导入
    onItemImport() {
      this.isImportDialog = true
    },

    handelUploadSuccess(id) {
      this.taskId = id
      this.isItemImportDialogShow = false
      this.isTaskDetailShow = true
    },
    async openDetail(id) {
      this.detailId = id
      await this.handleDetailSearch()
      this.subDialogVisible = true
    },
    async handleDetailSearch() {
      const res = await getDetail({
        LogID: this.detailId,
        Skip: (this.detailPage - 1) * this.detailPageSize,
        Limit: this.detailPageSize,
        Order: ""
      })
      this.detailTableData = res.data.Datas
      this.detailTableData.forEach(d => {
        d.Amount = d?.Amount.toFixed(2) || ""
        d.AmountByTax = d?.AmountByTax.toFixed(2) || ""
      })
      this.detailTotal = res.data.Total
    },
    async downloadReason(id) {
      //文件流
      var url_2 =
        basis.ExportDownload + '?filePath=' + `Excel\\Export\\ImportDeviceFail\\${id}.xlsx`
      window.location.href = url_2
    }
  },
  mounted() {
    func.SearchJudge()
    this.handleSearch()
  },
  watch: {
    isImportDialog(val) {
      if (!val) {
        this.remark = ""
        this.fileList = []
      }
    }
  }
}
