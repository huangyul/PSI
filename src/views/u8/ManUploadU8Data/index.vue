<template>
  <div class="all">
    <div class="topBtnBox">
      <button v-show="permissionsList.Add" class="blue" @click="onU8Sync">
        <i class="U8Sync"></i>批量手工同步
      </button>
    </div>
    <div class="searchBox">
      <div class="conditions">
        <div class="box">
          <span>单据日期</span>
          <div class="inputBox">
            <RangeDate
              v-model:props-start="searchForm.startTime"
              v-model:props-end="searchForm.endTime"
            ></RangeDate>
          </div>
        </div>
        <div class="box">
          <span>记录单号</span>
          <div class="inputBox">
            <el-input v-model="searchForm.orderNo"></el-input>
          </div>
        </div>
        <div class="box">
          <span>类型</span>
          <div class="inputBox">
            <el-select v-model="searchForm.type">
              <el-option
                v-for="item in typeList"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="operation">
        <i class="doubleDown"></i>
        <button class="search" @click="getTableData">查询</button>
        <button class="reset" @click="onReset">重置</button>
      </div>
    </div>
    <div class="middle treeTable">
      <el-table
        :data="tableData"
        border
        tooltip-effect="dark"
        style="width: 100%"
        :row-class-name="funcRowClassName"
        row-key="Id"
        height="100%"
        stripe
        :total="total"
      >
        <el-table-column prop="UploadTime" label="单据日期" width="200"></el-table-column>
        <el-table-column prop="OrderNo" label="记录单号" min-width="500"></el-table-column>
        <el-table-column prop="TypeValue" label="类型" width="170">
          <template #default="{ row }">
            {{ typeText(row) }}
          </template>
        </el-table-column>
        <el-table-column prop="Messages" label="状态" width="170">
          <template #default="{ row }">
            <span class="error-text">{{ row.Messages }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 15, 20, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getTableData"
        @current-change="getTableData"
      >
      </el-pagination>
    </div>
  </div>

  <el-dialog
    v-model="isDialogShow"
    title=""
    width="400px"
    align-center
    :show-close="false"
  >
    <div class="sr-flex sr-col-center">
      <SuccessFilled
        style="width: 2em; height: 2em; margin-right: 8px; color: green"
      />
      <span class="tips">全部失败单据已激活，同步已经开始</span>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          style="margin-top: 30px"
          @click="isDialogShow = false"
        >
          好的
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script src="./vmModule.js"></script>

<style scoped>
  .all .addBox > span {
    line-height: 28px;
  }
  .treeTable >>> .cell {
    display: flex;
  }
  .treeTable >>> .cell i {
    font-size: 13px;
    font-weight: bold;
  }
  .treeTable >>> .cell .el-checkbox {
    margin: 0 auto;
  }
  .tips {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #2d323c;
  }
</style>
