<template>
  <div class="task-table">
    <el-table :data="data" :height="500">
      <el-table-column label="ID" prop="ID" width="180">
        <template #default="{ row }">
          <span class="can-click" @click="openDetail(row)">{{ row?.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="任务创建时间"
        prop="CreateTime"
        width="170"
      ></el-table-column>
      <el-table-column label="导入文件名" prop="FileName"></el-table-column>
      <el-table-column label="状态" prop="Status" width="100">
        <template #default="{ row }">
          <span :style="{ color: textColorMap.get(row?.Status).color }">{{
            textColorMap.get(row?.Status)?.text
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="任务结束时间"
        prop="EndTime"
        width="170"
      ></el-table-column>
      <el-table-column
        label="操作员"
        prop="Creater"
        width="170"
      ></el-table-column>
    </el-table>
  </div>
  <TaskDetail
    v-model:is-show="isDetailShow"
    :transactionId="currentId"
    @to-list="toList"
  ></TaskDetail>
</template>

<script>
  import TaskDetail from './TaskDetail.vue'
  export default {
    components: { TaskDetail },
    emits: ['to-list'],
    props: {
      data: {
        type: Array,
        default() {
          return []
        },
      },
    },
    data() {
      return {
        isDetailShow: false,
        currentId: '',
        textColorMap: new Map([
          [-1, { color: '#f89b22', text: '待处理' }],
          [0, { color: '#82b4f3', text: '处理中' }],
          [1, { color: '#43c095', text: '导入成功' }],
          [2, { color: '#fd7575', text: '导入失败' }],
        ]),
      }
    },
    mounted() {
      console.log(this.textColorMap.get(-1).text)
    },
    methods: {
      openDetail(row) {
        this.currentId = row.ID
        this.isDetailShow = true
      },
      toList() {
        this.isDetailShow = false
        this.$emit('to-list')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .task-table {
    ::v-deep .el-table th {
      background: #84c4ff !important;
    }
  }
</style>
