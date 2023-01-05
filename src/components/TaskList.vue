<template>
  <div class="all">
    <el-dialog
      v-model="isShow"
      title="任务列表"
      :width="1200"
      top="5vh"
      :destroy-on-close="true"
      @close="$emit('update:isShow', false)"
    >
      <div class="box">
        <div class="search">
          <div class="search-item">
            <div class="item-label">任务创建时间</div>
            <div class="item-form">
              <RangeDate
                type="datetime"
                v-model:propsStart="searchForm.startTime"
                v-model:propsEnd="searchForm.endTime"
              ></RangeDate>
            </div>
          </div>
          <div class="search-item">
            <div class="item-label">处理状态</div>
            <div class="item-form">
              <el-select v-model="searchForm.status">
                <el-option
                  v-for="i in statusList"
                  :label="i.label"
                  :value="i.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="search-item">
            <div class="item-label">导入文件名</div>
            <div class="item-form">
              <el-input v-model="searchForm.fileName"></el-input>
            </div>
          </div>

          <div class="search-item" style="margin-top: 10px">
            <button class="btn-blue" @click="init">查询</button>
            <button class="btn-grey" @click="reset">重置</button>
          </div>
        </div>
      </div>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="商品管理" name="1"> </el-tab-pane>
        <el-tab-pane label="采购计划" name="2"></el-tab-pane>
        <el-tab-pane label="采购订单" name="3"></el-tab-pane>
        <el-tab-pane label="外部调拨" name="4"></el-tab-pane>
      </el-tabs>
      <TaskTable
        :data="tableData"
        @to-list="$emit('update:isShow', false)"
      ></TaskTable>
      <el-pagination
        style="margin: 10px 0"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[15, 20]"
        :small="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="init"
        @current-change="init"
      />
      <template #footer>
        <div class="footer">
          <button @click="$emit('update:isShow', false)">关闭</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import RangeDate from './rangeDate.vue'
  import TaskTable from './TaskTable.vue'
  import { getTaskList } from '../api/apiv2/task'
  import dayjs from 'dayjs'
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:isShow'],
    components: { RangeDate, TaskTable },
    data() {
      return {
        currentPage: 1,
        pageSize: 20,
        total: 0,
        activeName: '1',
        tableData: [],
        searchForm: {
          status: -2,
          importType: 1,
          fileName: '',
          startTime: dayjs(
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
              0,
              0,
              0
            )
          ).format('YYYY/MM/DD HH:mm:ss'),
          endTime: dayjs(
            new Date(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate() + 1
              ).getTime() - 1000
            )
          ).format('YYYY/MM/DD HH:mm:ss'),
        },
        statusList: [
          { label: '全部', value: -2 },
          { label: '待处理', value: -1 },
          { label: '处理中', value: 0 },
          { label: '导入成功', value: 1 },
          { label: '导入失败', value: 2 },
        ],
      }
    },
    mounted() {
      this.init()
    },
    watch: {
      isShow(val) {
        if (val) {
          this.activeName = '1'
          this.searchForm.importType = 1
          this.reset()
          this.init()
        }
      },
    },
    methods: {
      handleClick(pane) {
        this.searchForm.importType = pane.paneName
        this.init()
      },
      reset() {
        this.searchForm.endTime = dayjs(
          new Date(
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate() + 1
            ).getTime() - 1000
          )
        ).format('YYYY/MM/DD HH:mm:ss')
        this.searchForm.startTime = dayjs(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            0,
            0,
            0
          )
        ).format('YYYY/MM/DD HH:mm:ss')
        this.searchForm.fileName = ''
        this.searchForm.status = -2
      },
      async init() {
        const res = await getTaskList({
          ...this.searchForm,
          page: this.currentPage,
          pageSize: this.pageSize,
          userCode: localStorage.getItem('UserCode'),
        })
        this.total = res.TotalCount
        this.tableData = res.Results
      },
    },
  }
</script>

<style scoped lang="scss">
  .box {
    .search {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .search-item {
        display: flex;
        align-items: center;
        .item-label {
          margin-right: 10px;
          width: 90px;
          text-align: right;
        }
        button {
          width: 60px;
          height: 28px;
          box-shadow: 0px 3px 46px 0px rgba(0, 0, 0, 0.05);
          border-radius: 4px;
          border: none;
          margin-left: 10px;
          cursor: pointer;
        }
        .btn-blue {
          background: #579ff6;
          color: #ffffff;
        }
        .btn-grey {
          background: #ececed;
          color: #767b83;
          border: 1px solid #d9dbdd;
        }
      }
    }
    ::v-deep .el-input {
      width: 180px !important;
    }
    ::v-deep .el-date-editor {
      width: 200px !important;
    }
  }
  .footer button {
    width: 120px;
    height: 34px;
    background: #ededee;
    border: 1px solid #d9dbdd;
    border-radius: 4px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #767b83;
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
  }
</style>
