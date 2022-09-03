import $ from 'jquery'
import basis from '../../../api/basisApi.js'
import func from '../../func.js'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  name: 'CategoryManagement',
  data() {
    return {
      permissionsList: '',
      isShowPosition: '',
      username: '',
      addDate: '',
      searchForm: {
        Name: '',
        Mat_Type: '',
      },
      tableData: [],
      dialogVisible: false,
      addForm: {},
      tableDeteleData: [],
      OpenWindowTitle: '',
      page: 1,
      pageSize: 15,
      total: 0,
      treeListData: [],
      WhCodeList: [],
      PostionCodeList: [],
      ParentId: '',
      isUpdate_1: false,
      isUpdate_2: false,

      isCheckedAll: false,
      selectAllCount: 0,
      visible: true,
      treeData: [],
    }
  },
  computed: {
    // isSelectd() {
    //   return false
    // },
  },
  methods: {
    funcGetTableData(name, matType, shopCode, sysOrgId, page, pageSize) {
      var url =
        basis.CategoryManagement.query +
        '?name=' +
        name +
        '&matType=' +
        matType +
        '&shopCode=' +
        shopCode +
        '&sysOrgId=' +
        sysOrgId +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize
      this.$axios
        .get(url)
        .then((res) => {
          this.tableData = res.data.Results
          this.total = res.data.TotalCount
          for (var item of this.tableData) {
            this.setCheckedOrNot(item, true)
          }
          this.selectAllCount = this.tableDeteleData.length
          for (var item of this.tableData) {
            this.setCheckedOrNot(item, false)
          }
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    funcGetTreeData() {
      return new Promise((resolve) => {
        let shopCode = localStorage.getItem('shopCode')
        let sysOrgId = localStorage.getItem('OrganizationId')
        var url =
          basis.CategoryManagement.query +
          '?name=' +
          '' +
          '&matType=' +
          '' +
          '&shopCode=' +
          shopCode +
          '&sysOrgId=' +
          sysOrgId +
          '&page=' +
          1 +
          '&pageSize=' +
          10000
        this.$axios
          .get(url)
          .then((res) => {
            resolve(res.data.Results)
            return
          })
          .catch((err) => {
            this.$message({
              message: err,
              type: 'warning',
            })
          })
      })
    },

    //刷新表格
    funcUpdateTableData() {
      this.eventSearch()
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
          this.addForm.Mat_Type = res.data
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
        })

      //this.addForm.Mat_Type = func.randomString(2);
    },
    //单独删除
    funcTableDetele(id, updateTime, shopCode, userType) {
      var url =
        basis.CategoryManagement.delete +
        '?id=' +
        id +
        '&updateTime=' +
        updateTime +
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
          this.funcUpdateTableData()
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
          this.funcUpdateTableData()
        })
    },
    //批量删除
    funcTableDeteleList(ids, shopCode, userType) {
      var url = basis.CategoryManagement.deleteList
      this.$axios
        .delete(url, { params: { shopCode, userType }, data: ids })
        .then((res) => {
          ElMessage.success({
            message: '删除成功',
            type: 'success',
          })
          this.funcUpdateTableData()
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'warning',
          })
          this.funcUpdateTableData()
        })
        .finally(() => {
          this.tableDeteleData = []
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
    //获取仓库列表
    funcGetWhCodeList(shopCode, whCode) {
      var url =
        basis.WhOrPositionInfo + '?shopCode=' + shopCode + '&whCode=' + whCode
      this.$axios
        .get(url)
        .then((res) => {
          this.WhCodeList = res.data
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },
    //获取仓位列表
    funcGetPostionCodeList(shopCode, whCode) {
      var url =
        basis.WhOrPositionInfo + '?shopCode=' + shopCode + '&whCode=' + whCode
      this.$axios
        .get(url)
        .then((res) => {
          this.PostionCodeList = res.data
        })
        .catch((err) => {
          this.$message({ message: err, type: 'warning' })
        })
    },

    eventPageSizeChange(val) {
      this.pageSize = val
      this.funcUpdateTableData()
    },
    eventPageChange(val) {
      this.page = val
      this.funcUpdateTableData()
    },
    eventSearch() {
      this.funcGetTableData(
        this.searchForm.Name,
        this.searchForm.Mat_Type,
        localStorage.getItem('shopCode'),
        localStorage.getItem('OrganizationId'),
        this.page,
        this.pageSize
      )
    },
    eventReset() {
      this.searchForm = {
        Name: '',
        Mat_Type: '',
      }
    },
    judgeIsDelete(data, ids) {
      console.log(ids)
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        if (item.children.length > 0) {
          this.judgeIsDelete(item.children, ids)
        }
        if (!ids.includes(item.Id)) {
          return false
        }
      }
    },
    eventDetele() {
      if (this.tableDeteleData.length == 0) return
      let ids1 = [],
        ids2 = []
      this.tableDeteleData.forEach((i) => ids2.push(i.Id))
      if (ids2.length == 0) {
        return ElMessage({
          type: 'info',
          message: '选中的品类必须为最底层或者至少选中一个子品类',
          duration: 4000,
        })
      }
      this.tableDeteleData.forEach((i) => {
        if (i.children.length == 0) {
          ids1.push(i.Id)
        } else if (this.judgeIsDelete(i.children, ids2) != false) {
          ids1.push(i.Id)
        }
      })
      let para = [...new Set(ids1)]
      this.funcTableDeteleList(
        para,
        localStorage.getItem('shopCode'),
        localStorage.getItem('userType')
      )

      return
      for (var i of this.tableDeteleData) {
        if (
          i.Mat_Type == 'K' ||
          i.Mat_Type == 'S' ||
          i.Mat_Type == 'M' ||
          i.Mat_Type == 'G'
        ) {
          ElMessage.warning({
            message: '大类不能删除',
            type: 'warning',
          })
          this.funcUpdateTableData()
          return
        }
      }
      if (this.tableDeteleData.length == 1) {
        for (var item of this.tableDeteleData) {
          var url = basis.CategoryManagement.queryUpdate + '?id=' + item.Id
          this.$axios
            .get(url)
            .then((res) => {
              this.funcTableDetele(
                item.Id,
                res.data.UpdateTime,
                localStorage.getItem('shopCode'),
                localStorage.getItem('userType')
              )
            })
            .catch((err) => {
              this.$message({
                message: err,
                type: 'warning',
              })
              this.funcUpdateTableData()
            })
        }
      } else if (this.tableDeteleData.length == 0) {
        ElMessage.warning({
          message: '还未选择',
          type: 'warning',
        })
      } else if (this.tableDeteleData.length > 1) {
        var ids = []
        for (var item of this.tableDeteleData) {
          ids.push(item.Id)
        }
        ids = ids.join(',')
        this.funcTableDeteleList(
          ids,
          localStorage.getItem('shopCode'),
          localStorage.getItem('userType')
        )
      }
    },
    // eventTableSelect(val) {
    //     this.tableDeteleData = val;
    // },
    async eventOpenWindow(row) {
      this.funcGetDate()
      this.funcUpdateTableData()
      const res = await this.funcGetTreeData()
      var arr = JSON.parse(JSON.stringify(res))
      this.treeListData = func.recursiveCategoryTree(arr)
      if (row) {
        this.OpenWindowTitle = '编辑'
        this.isUpdate_1 = true
        this.isUpdate_2 = true
        this.ParentId = ''
        var url = basis.CategoryManagement.queryUpdate + '?id=' + row.Id
        this.$axios
          .get(url)
          .then((res) => {
            if (
              res.data.Mat_Type == 'M' ||
              res.data.Mat_Type == 'S' ||
              res.data.Mat_Type == 'K' ||
              res.data.Mat_Type == 'G'
            ) {
              this.$message({
                message: '该品类为大类，不能编辑',
                type: 'warning',
              })
              return
            }
            if (res.data.ShopCode) {
              this.funcGetPostionCodeList(res.data.ShopCode, res.data.WhCode)
            } else {
              this.funcGetPostionCodeList(
                localStorage.getItem('shopCode'),
                res.data.WhCode
              )
            }
            this.addForm = {
              Id: res.data.Id,
              Mat_Type: res.data.Mat_Type,
              Name: res.data.Name,
              BussinessType: res.data.BussinessType,
              Memo: res.data.Memo,
              ParentId: res.data.ParentId,
              ShopCode: res.data.ShopCode,
              WhCode: res.data.WhCode,
              PostionCode: res.data.PostionCode,
              UpdateTime: res.data.UpdateTime,
              Creater: res.data.Creater,
              Modifier: this.username,
              OrganizationId: res.data.OrganizationId,
            }
            this.addDate = res.data.ModifyTime
            this.dialogVisible = true
          })
          .catch((err) => {
            this.$message({
              message: err,
              type: 'warning',
            })
            this.funcUpdateTableData()
          })
      } else {
        this.OpenWindowTitle = '新增'
        this.isUpdate_1 = false
        this.isUpdate_2 = false
        this.ParentId = ''
        this.addForm = {
          Id: '',
          Mat_Type: '',
          Name: '',
          BussinessType: '',
          Memo: '',
          ParentId: '',
          ShopCode: localStorage.getItem('shopCode'),
          WhCode: '',
          PostionCode: '',
          UpdateTime: 0,
          Creater: this.username,
          Modifier: this.username,
        }
        this.dialogVisible = true
      }
    },
    eventSaveWindow() {
      if (
        !this.addForm.Name ||
        !this.addForm.Mat_Type ||
        !this.addForm.ParentId
      ) {
        ElMessage.warning({
          message: '品类名称，编号，上级品类不能为空',
          type: 'warning',
        })
        return
      }
      if (
        this.addForm.Name.startsWith('&') ||
        this.addForm.Name.startsWith('-')
      ) {
        ElMessage.warning({
          message: '品类名称中不能含有&和-字符',
          type: 'warning',
        })
        return
      }
      const loading = func.backgroundLoading('Loading')
      if (this.OpenWindowTitle == '新增') {
        var params = JSON.parse(JSON.stringify(this.addForm))
        var str = func.guid()
        params.Id = str
        if (this.ParentId) {
          params.ParentId = this.ParentId
        }
        params.OrganizationId = localStorage.getItem('OrganizationId')
        var url =
          basis.CategoryManagement.add +
          '?sysorgId=' +
          localStorage.getItem('OrganizationId')
        this.$axios
          .post(url, params)
          .then((res) => {
            loading.close()
            ElMessage.success({
              message: '新增成功',
              type: 'success',
            })
            this.funcUpdateTableData()
            this.dialogVisible = false
          })
          .catch((err) => {
            loading.close()
            ElMessage.warning({
              message: err,
              type: 'warning',
            })
            this.funcUpdateTableData()
          })
      } else if (this.OpenWindowTitle == '编辑') {
        var params = JSON.parse(JSON.stringify(this.addForm))
        if (this.ParentId) {
          params.ParentId = this.ParentId
        }
        var url =
          basis.CategoryManagement.update +
          '?sysOrgId=' +
          localStorage.getItem('OrganizationId') +
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
            this.funcUpdateTableData()
            this.dialogVisible = false
          })
          .catch((err) => {
            loading.close()
            ElMessage.warning({
              message: err,
              type: 'warning',
            })
            this.funcUpdateTableData()
          })
      }
      //this.dialogVisible = false;
    },
    //导出
    eventExport() {
      var ids = []
      for (var item of this.tableDeteleData) {
        ids.push(item.Id)
      }
      //ids = ids.join(",");
      var url_1 =
        basis.CategoryManagement.Export +
        '?matType=' +
        this.searchForm.Mat_Type +
        '&name=' +
        this.searchForm.Name +
        '&shopCode=' +
        localStorage.getItem('shopCode') +
        '&sysOrgId=' +
        localStorage.getItem('OrganizationId')
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

    /*注意在获取初始数据时，所有节点（包括子节点）都增加一个isChecked 标志参数*/
    //勾选单个
    funcRowSelect(selection, row) {
      var setChecked = selection.indexOf(row) >= 0
      this.setCheckedOrNot(row, setChecked)
    },
    setCheckedOrNot(rowData, checked) {
      this.$refs.multipleTable.toggleRowSelection(rowData, checked)
      if (checked) {
        if (this.tableDeteleData.indexOf(rowData) < 0) {
          this.tableDeteleData.push(rowData)
        }
      } else {
        this.tableDeteleData.forEach(function (item, index, arr) {
          if (item == rowData) {
            arr.splice(index, 1)
          }
        })
      }
      for (var ch of rowData.children) {
        this.setCheckedOrNot(ch, checked)
      }
    },
    //勾选全选按钮
    funcSelectAll(selection) {
      if (this.selectAllCount == this.tableDeteleData.length) {
        this.isCheckedAll = true
      }
      if (this.isCheckedAll) {
        this.$refs.multipleTable.clearSelection()
        for (var item of this.tableDeteleData) {
          this.setCheckedOrNot(item, false)
        }
        this.tableDeteleData = []
      } else {
        for (var item of selection) {
          this.setCheckedOrNot(item, true)
        }
      }
      this.isCheckedAll = !this.isCheckedAll
    },
  },
  mounted() {
    func.SearchJudge()
    this.username = localStorage.getItem('ms_username')
    this.isShowPosition = localStorage.getItem('isShowPosition')
    this.funcUpdateTableData()
    this.funcGetWhCodeList(localStorage.getItem('shopCode'), '')
    for (var item of JSON.parse(localStorage.getItem('permissions'))) {
      if (item.ModuleUrl == 'CategoryManagement') {
        this.permissionsList = item.Rights
      }
    }
  },
  watch: {
    'addForm.WhCode'(newVal, oldVal) {
      if (this.isUpdate_1) {
        this.isUpdate_1 = false
      } else {
        this.addForm.PostionCode = ''
        this.PostionCodeList = []
        if (newVal) {
          this.funcGetPostionCodeList(localStorage.getItem('shopCode'), newVal)
        }
      }
    },
    'addForm.ParentId'(newVal, oldVal) {
      if (newVal && !this.isUpdate_2) {
        var length = newVal.length - 1
        var value = newVal[length]
        this.funcGetCurrenCode('matType', value)
        for (var i in newVal) {
          if (i == 0) {
            for (var item of this.tableData) {
              if (item.Id == newVal[i]) {
                this.addForm.BussinessType = item.Mat_Type
              }
            }
          }
          if (i == length) {
            this.ParentId = newVal[i]
          }
        }
      } else if (newVal && this.isUpdate_2) {
        this.isUpdate_2 = false
      }
    },
  },
}
