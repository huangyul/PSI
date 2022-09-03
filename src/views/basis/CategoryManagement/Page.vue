<template>
  <div class="all">
    <div class="topBtnBox">
      <button
        v-show="permissionsList.Add"
        class="green"
        @click="eventOpenWindow()"
      >
        <i class="el-icon-plus"></i>新增品类
      </button>
      <el-tooltip
        effect="light"
        placement="top"
        v-if="permissionsList.Delete && tableDeteleData.length == 0"
      >
        <template #content>请先选择需要删除的记录</template>
        <button class="blue" style="cursor: not-allowed">
          <i class="delete"></i>删除
        </button>
      </el-tooltip>
      <el-popconfirm
        v-if="permissionsList.Delete && tableDeteleData.length > 0"
        confirm-button-text="确认"
        cancel-button-text="取消"
        icon="el-icon-info"
        icon-color="red"
        title="此操作不可恢复，您确认删除吗？"
        @confirm="eventDetele"
      >
        <template #reference>
          <button class="blue"><i class="delete"></i>删除</button>
        </template>
      </el-popconfirm>
      <!-- <button v-show="permissionsList.Delete" class="blue" @click="eventDetele"><i class="delete"></i>删除</button> -->
      <span class="flex"></span>
      <button v-show="permissionsList.Export" @click="eventExport" class="grey">
        <i class="export"></i>导出
      </button>
    </div>
    <div class="searchBox">
      <div class="conditions">
        <div class="box">
          <span>名称</span>
          <div class="inputBox">
            <el-input v-model="searchForm.Name"></el-input>
          </div>
        </div>
        <div class="box">
          <span>编号</span>
          <div class="inputBox">
            <el-input v-model="searchForm.Mat_Type"></el-input>
          </div>
        </div>
      </div>
      <div class="operation">
        <i class="doubleDown"></i>
        <button class="search" @click="eventSearch">查询</button>
        <button class="reset" @click="eventReset">重置</button>
      </div>
    </div>
    <div class="middle treeTable">
      <el-table
        border
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :row-class-name="funcRowClassName"
        row-key="Id"
        :tree-props="{ children: 'children' }"
        height="100%"
        @select="funcRowSelect"
        @select-all="funcSelectAll"
        stripe
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="Mat_Type" label="编号">
          <template #default="scope">
            <div v-show="permissionsList.Edit">
              <span
                v-if="
                  scope.row.Mat_Type === 'M' ||
                  scope.row.Mat_Type === 'S' ||
                  scope.row.Mat_Type === 'K' ||
                  scope.row.Mat_Type === 'G'
                "
                >{{ scope.row.Mat_Type }}</span
              >
              <span v-else class="update" @click="eventOpenWindow(scope.row)">{{
                scope.row.Mat_Type
              }}</span>
            </div>
            <div v-show="!permissionsList.Edit">{{ scope.row.Mat_Type }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="Id" label="ID"> </el-table-column> -->
        <el-table-column prop="Name" label="品类名称"> </el-table-column>
        <!-- <el-table-column prop="WhName" label="仓库"></el-table-column>
				<el-table-column prop="PostionName" label="仓位" v-if="isShowPosition == '1'"></el-table-column> -->
        <el-table-column prop="Memo" label="描述" min-width="280">
        </el-table-column>
        <el-table-column prop="ModifyTime" label="修改时间" width="180">
        </el-table-column>
        <el-table-column prop="Modifier" label="修改用户" width="210">
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="eventPageSizeChange"
        @current-change="eventPageChange"
        :current-page="page"
        :page-sizes="[10, 15, 20, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog :title="OpenWindowTitle" v-model="dialogVisible" width="700px">
      <div>
        <div class="addBox">
          <span><span class="requiredTip">*</span>品类名称：</span>
          <div class="large">
            <el-input v-model="addForm.Name"></el-input>
          </div>
        </div>
        <div class="addBox">
          <span>编号：</span>
          <div class="large">
            <el-input
              v-model="addForm.Mat_Type"
              :disabled="true"
              placeholder="选择上级品类后自动生成"
            ></el-input>
          </div>
        </div>
        <div class="addBox">
          <span><span class="requiredTip">*</span>上级品类：</span>
          <div class="large">
            <el-cascader
              :props="{
                label: 'Name',
                value: 'Id',
                children: 'children',
                checkStrictly: true,
                expandTrigger: 'hover',
              }"
              :options="treeListData"
              v-model="addForm.ParentId"
              clearable
            ></el-cascader>
          </div>
        </div>
        <!-- <div class="addBox">
					<span><span class="requiredTip">*</span>默认仓库：</span>
					<div class="large">
						<el-select v-model="addForm.WhCode" placeholder="请选择" clearable>
						  <el-option v-for="item in WhCodeList" :key="item.Code" :label="item.Name" :value="item.Code"></el-option>
						</el-select>
					</div>
				</div>
				<div class="addBox" v-show="isShowPosition == '1'">
					<span>默认仓位：</span>
					<div class="large">
						<el-select v-model="addForm.PostionCode" placeholder="请先选择仓库" clearable>
						  <el-option v-for="item in PostionCodeList" :key="item.Code" :label="item.Name" :value="item.Code"></el-option>
						</el-select>
					</div>
				</div> -->
        <div class="addBox">
          <span>描述：</span>
          <el-input
            type="textarea"
            v-model="addForm.Memo"
            :autosize="{ minRows: 4 }"
          ></el-input>
        </div>
        <div class="addBox">
          <span></span>
          <p>最后修改人：{{ username }}<b>|</b>最后修改时间：{{ addDate }}</p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="eventSaveWindow">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
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
</style>
