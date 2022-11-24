<template>
  <div style="height: 100%;">
    <div class="all">
      <div class="topBtnBox">
        <button
          v-show="permissionsList.Add"
          class="green"
          @click="eventOpenWindow()"
        >
          <i class="el-icon-plus"></i>新增商品
        </button>
        <button
          v-show="permissionsList.Edit"
          class="blue"
          @click="eventUpdateStatus(1)"
        >
          <i class="enable"></i>启用
        </button>
        <button
          v-show="permissionsList.Edit"
          class="blue"
          @click="eventUpdateStatus(0)"
        >
          <i class="disable"></i>停用
        </button>
        <!-- <button v-show="permissionsList.Delete" class="blue" @click="eventDetele"><i class="delete"></i>删除</button> -->
        <!-- <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确认删除吗？" @confirm="eventDetele">
              <template #reference >
                <button class="blue" v-show="permissionsList.Delete"><i class="delete"></i>删除</button>
              </template>
            </el-popconfirm> -->
        <button
          v-show="permissionsList.Print"
          class="blue"
          @click="eventOpenPrint()"
        >
          <i class="print"></i>打印条形码
        </button>
        <span class="flex"></span>
        <!-- <button v-show="permissionsList.Import" class="grey"><i class="import"></i>导入</button> -->
        <button
          v-show="permissionsList.Import"
          class="grey"
          @click="eventExportTemplate"
        >
          <i class="download"></i>导入模板下载
        </button>
        <div class="uploadBox">
          <button v-show="permissionsList.Import" class="grey" @click="onItemImport">
            <i class="import"></i>导入
          </button>
        </div>
        <button v-show="permissionsList.Export" class="grey" @click="eventExport">
          <i class="export"></i>导出
        </button>
      </div>
      <div class="searchBox">
        <div class="conditions">
          <div class="box">
            <span>商品类别</span>
            <div class="inputBox">
              <el-cascader
                :props="{
                  label: 'Name',
                  value: 'Id',
                  children: 'children',
                  checkStrictly: true,
                  expandTrigger: 'hover',
                }"
                :options="CommodityCategoriesList"
                v-model="searchForm.Type"
                clearable
              ></el-cascader>
            </div>
          </div>
          <div class="box">
            <span>商品名称</span>
            <div class="inputBox">
              <el-input v-model="searchForm.Name"></el-input>
            </div>
          </div>
          <div class="box">
            <span>商品编号</span>
            <div class="inputBox">
              <el-input v-model="searchForm.Code"></el-input>
            </div>
          </div>
          <div class="box">
            <span>状态</span>
            <div class="inputBox">
              <el-select v-model="searchForm.Status">
                <el-option label="全部" value=""></el-option>
                <el-option label="启用" value="1"></el-option>
                <el-option label="停用" value="0"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="operation">
          <i class="doubleDown"></i>
          <button class="search" @click="eventSearch">查询</button>
          <button class="reset" @click="eventReset">重置</button>
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
          height="100%"
          @selection-change="eventTableSelect"
          @sort-change="onSortChange"
          :row-class-name="funcRowClassName"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column
            prop="Mat_No"
            label="商品编号"
            width="120"
            sortable="custom"
          >
            <template #default="scope">
              <span
                v-show="permissionsList.Edit"
                class="update"
                @click="eventOpenWindow(scope.row)"
                >{{ scope.row.Mat_No }}</span
              >
              <span v-show="!permissionsList.Edit">{{ scope.row.Mat_No }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Photo" label="商品图片">
            <template #default="scope">
              <el-image
                style="width: 40px; height: 40px; text-align: center"
                v-show="scope.row.Photo"
                :src="scope.row.Photo"
                :preview-src-list="[scope.row.Photo]"
              >
              </el-image>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="Id" label="ID"> </el-table-column> -->
          <el-table-column prop="Mat_Name" label="商品名称" width="240">
          </el-table-column>
          <el-table-column
            prop="MatTypeName"
            label="商品类别"
            width="110"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            prop="PriceByTax"
            label="单价(含税)"
            width="170"
            align="right"
          >
          </el-table-column>
          <el-table-column
            prop="Price"
            label="单价(不含税)"
            width="170"
            align="right"
          >
          </el-table-column>
          <el-table-column prop="OrderNum" label="下单数量" align="right">
          </el-table-column>
          <el-table-column prop="Unit_Name" label="单位"> </el-table-column>
          <el-table-column prop="Status" label="状态" sortable="custom">
            <template #default="scope">
              <span v-if="scope.row.Status == 1" class="StatusGreen">启用</span>
              <span v-if="scope.row.Status == 0" class="StatusRed">停用</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="CreateTime"
            label="商品生成时间"
            min-width="170"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            prop="Creater"
            label="商品生成人"
            min-width="180"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column prop="ModifyTime" label="最后修改时间" min-width="170">
          </el-table-column>
          <el-table-column prop="Modifier" label="最后修改人" min-width="180">
          </el-table-column>

          <el-table-column prop="Summary" label="备注" width="280">
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

      <!-- 打印条形码弹窗 -->
      <el-dialog title="打印条形码" v-model="printDialogVisible" width="800px">
        <div class="dialogVisible">
          <div class="middle haveBorder">
            <el-table
              stripe
              ref="multipleTable"
              :data="printTableData"
              tooltip-effect="dark"
              height="350"
              style="width: 100%"
              :row-class-name="funcRowClassName"
            >
              <el-table-column prop="ProductName" label="商品名称" width="240">
              </el-table-column>
              <el-table-column prop="BarCodeTypeName" label="条形码类别">
              </el-table-column>
              <el-table-column prop="BarCode" label="条形码"> </el-table-column>
              <el-table-column prop="PrintNum" label="打印数量">
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.PrintNum"
                    :min="0"
                    :max="99"
                    :precision="0"
                    :controls="true"
                    size="mini"
                  ></el-input-number>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="printDialogVisible = false">不打印</el-button>
            <!-- <el-button type="primary" @click="eventPrintTemplate">打印模板设计</el-button>
                <el-button type="primary" @click="eventPrint(1)">打印预览</el-button> -->
            <el-button type="primary" @click="eventPrint(2)">打印</el-button>
          </span>
        </template>
      </el-dialog>
      
      <!-- 文件导入弹窗 -->
      <ImportDialog 
        v-model:isShow="isItemImportDialogShow"
        type="product"
        @upload-success="handelUploadSuccess"></ImportDialog>
    </div>


    <TaskDetail 
      v-if="isTaskDetailShow"
      v-model:is-show="isTaskDetailShow" :transactionId="taskId"></TaskDetail>
  </div>
</template>

<script src="./vmModule.js"></script>

<style scoped lang="scss">


</style>
