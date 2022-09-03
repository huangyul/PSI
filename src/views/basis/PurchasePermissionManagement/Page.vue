<!-- 采购权限管理 -->
<template>
  <div class="all">
    <div class="topBtnBox">
      <button
        class="green"
        @click="openDialog('edit')"
        v-if="permissionsList.Add"
      >
        <i class="el-icon-plus"></i>新增
      </button>
    </div>
    <div class="searchBox">
      <div class="conditions">
        <div class="box">
          <span>角色名称</span>
          <div class="inputBox">
            <el-input v-model="searchForm.roleName"></el-input>
          </div>
        </div>
        <div class="box">
          <span>授权用户</span>
          <div class="inputBox">
            <el-input v-model="searchForm.userName"></el-input>
          </div>
        </div>
      </div>

      <div class="operation">
        <button class="search" @click="doSearch" v-if="permissionsList.Query">
          查询
        </button>
        <button class="reset" @click="onReset">重置</button>
      </div>
    </div>
    <div class="middle">
      <el-table
        border
        stripe
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :row-class-name="funcRowClassName"
        height="100%"
        id="printTable"
      >
        <el-table-column prop="RoleName" label="角色名称" width="170">
        </el-table-column>
        <el-table-column prop="RoleDesc" label="角色描述" min-width="240">
        </el-table-column>
        <el-table-column
          prop="UserName"
          label="授权用户"
          width="280"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column prop="Creater" label="创建人" width="170">
        </el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" width="170">
        </el-table-column>
        <el-table-column prop="Modifier" label="最后修改人" width="120">
        </el-table-column>
        <el-table-column prop="ModifyTime" label="最后修改时间" width="170">
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="scope">
            <el-button
              link
              type="text"
              size="small"
              v-if="permissionsList.Edit"
              @click="openDialog('edit', scope.row.Id)"
              >编辑</el-button
            >
            <el-button
              link
              type="text"
              size="small"
              v-if="permissionsList.View"
              @click="openDialog('view', scope.row.Id)"
              >查看</el-button
            >
            <el-button
              link
              type="text"
              size="small"
              v-if="permissionsList.Delete"
              @click="onDelete(scope.row.Id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="onChangePageSize"
        @current-change="onChangePage"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <el-dialog
      top="8vh"
      :close-on-click-modal="false"
      v-model="dialogVisible"
      :width="900"
      title="采购权限设置"
    >
      <Edit
        :mode="mode"
        :id="currentId"
        @on-cancel="onCancel"
        :key="new Date().getTime()"
      ></Edit>
    </el-dialog>
    <el-dialog v-model="deleteDialog" title="提示" width="30%" center>
      <div style="text-align: center">您确认删除吗？</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmDelete" type="danger">确定</el-button>
          <el-button @click="deleteDialog = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import func from '../../func.js'
  import {
    downloadFile,
    exportExcel,
    getMatType,
    getPurchaseReturnList,
  } from '../../../api/apiv2/puchase.js'
  import {
    getPurchasePermissionList,
    deleteItem,
  } from '../../../api/apiv2/purchasePermission.js'
  import Edit from './component/edit.vue'
  export default {
    name: 'PurchasePowSet',
    components: { Edit },
    data() {
      return {
        searchForm: {
          roleName: '', // 角色名
          userName: '', // 用户名
        },
        // 数据列表
        tableData: [],
        // 每页大小
        pageSize: 10,
        // 当前页码
        currentPage: 1,
        // 列表总数
        total: 0,
        // 弹窗是否显示
        dialogVisible: false,
        permissionsList: [],
        mode: 'edit',
        currentId: 0,
        deleteDialog: false,
      }
    },
    async mounted() {
      // // 搜索栏伸缩
      // func.SearchJudge()
      // 判断权限
      for (var item of JSON.parse(localStorage.getItem('permissions'))) {
        if (item.ModuleUrl == 'PurchasePowSet') {
          this.permissionsList = item.Rights
        }
      }
      this.doSearch()
      // this.initData()
    },
    methods: {
      // 搜索
      async doSearch() {
        this.tableData = []
        const res = await getPurchasePermissionList({
          ...this.searchForm,
          page: this.currentPage,
          pageSize: this.pageSize,
        })
        this.total = res.TotalCount
        this.tableData = res.Results
      },
      // 改变每页大小
      onChangePageSize(value) {
        this.pageSize = value
        this.doSearch()
      },
      // 改变页码
      onChangePage(value) {
        this.currentPage = value
        this.doSearch()
      },

      // 重置
      onReset() {
        this.searchForm = {
          roleName: '',
          userName: '',
        }
        this.doSearch()
      },

      // 删除
      async onDelete(id) {
        this.currentId = id
        this.deleteDialog = true
      },

      // 确定删除
      async confirmDelete() {
        await deleteItem({ id: this.currentId })
        this.deleteDialog = false
        this.doSearch()
        this.$message.success('删除成功')
      },

      // 导出excel
      async onExport() {
        const res = await exportExcel(
          this.searchForm,
          this.searchForm.matTypeId
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

      // 数据初始化
      async initData() {},

      // 打开弹窗
      openDialog(type, id = 0) {
        this.mode = type
        this.currentId = id
        this.dialogVisible = true
      },

      // 编辑子组件关闭
      onCancel() {
        this.dialogVisible = false
        this.doSearch()
      },
    },
  }
</script>
<style scoped lang="scss">
  .add {
    padding: 10px 20px 0 20px;
    button {
      padding: 5px 30px;
    }
  }
</style>
