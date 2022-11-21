<template>
  <div>
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

      <!-- 商品导入弹窗 -->
      <el-dialog 
        title="商品管理导入" 
        :width="600"
        v-model="isItemImportDialogShow">
        <div class="itemImport">
          <div class="file-item">
            <div class="label"><span class="required">* </span>请选择数据文件： </div>
            <div class="form">
              <el-input 
                clearable 
                v-model="dataFileName" 
                class="input"
                :disabled="true">
              </el-input>
              <el-upload
                :show-file-list="false"
                :before-upload="handleBeforeDataUpload"
                accept=".xls,.xlsx"
              >
                <div class="choose-btn">选择</div>
              </el-upload>
            </div>
            <div class="file-tips">支持 *.xls, *.xlsx</div>
          </div>
          <div class="file-item">
            <div class="label"><span class="required">* </span>请选择数据文件： </div>
            <div class="form">
              <el-input clearable class="input" v-model="imageFileName" :disabled="true"></el-input>
              <el-upload
                :show-file-list="false"
                :before-upload="handleBeforeImageUpload"
                accept=".zip"
              >
                <div class="choose-btn">选择</div>
              </el-upload>
            </div>
            <div class="file-tips">支持 *.zip，最大不超过100M</div>
          </div>
          <div class="tips">
            <span style="font-weight: bold;">提示：</span>支持 png、jpg 格式图片，且请确保压缩包中图片文件名与数据文件
  中的商品图片名称一致。
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="isItemImportDialogShow = false">取消</el-button>
            <el-button type="primary" @click="handleUpload">上传</el-button>
          </span>
        </template>
      </el-dialog>
    </div>

    <!-- 错误提示 -->
    <el-dialog
      v-model="isTipShow"
      width="400px"
      title="12132312"
      align-center
      :show-close="false"
    >
    <template #title>
      <div class="tip-header">
        <img src="../../../assets/img/purchase/warning.png" />
        <span>上传失败</span>
      </div>
    </template>
      <div class="dialog-tips">{{ tipText }}</div>

      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            style="margin-top: 30px"
            @click="isTipShow = false"
          >
          知道了
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 导入loading -->
    <ImportLoading 
      :isShow="isImportLoading"
      :text="loadingText"
      >
    </ImportLoading>
  </div>
</template>

<script src="./vmModule.js"></script>

<style scoped lang="scss">
.itemImport {
  padding-bottom: 20px;
  .file-item {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 60px;
    .label {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #2D323C;
      width: 123px;
      .required {
        color: #FF5353;
      }
    }
    .form {
      flex: 1;
      display: flex;
      ::v-deep .el-upload {
        width: 100%;
        height: 100%;
        overflow: visible;
        border: none;
      }
      .input {
        margin-right: 10px;
      }
      .choose-btn {
        width: 60px;
        height: 28px;
        background: #FFFFFF;
        border: 1px solid #579FF6;
        border-radius: 4px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #4391EE;
        line-height: 28px;
        text-align: center;
        cursor: pointer;
      }
    }
    .file-tips {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #767B83;
      position: absolute;
      left: 123px;
      top: calc(100% + 12px);
    }
  }
  .tips {
    font-size: 14px;
    font-family: Microsoft YaHei;
    color: #E48F16;
    line-height: 24px;
    background: #FDF3D1;
    border-radius: 6px;
    padding: 14px;
  }
}
.tip-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #2D323C;
  line-height: 42px;
  span {
    margin-left: 9px;
  }
}
.dialog-tips {
  text-align: center;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #2D323C;
  line-height: 24px;
}
</style>
