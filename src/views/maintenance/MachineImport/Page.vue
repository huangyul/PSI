<!-- 机器导入  -->
<template>
  <div style="height: 100%">
    <div class="all">
      <div class="topBtnBox">
        <span class="flex"></span>
        <button
          class="grey"
          @click="eventExportTemplate"
        >
          <i class="download"></i>导入模板下载
        </button>
        <div class="uploadBox">
          <button class="grey" @click="onItemImport">
            <i class="import"></i>导入
          </button>
        </div>
      </div>
      <div class="searchBox">
        <div class="conditions">
          <div class="box">
            <span>导入时间</span>
            <div class="inputBox">
              <RangeDate
                v-model:props-start="searchForm.startTime"
                v-model:props-end="searchForm.endTime"
              ></RangeDate>
            </div>
          </div>
          <div class="box">
            <span>状态</span>
            <div class="inputBox">
              <el-select v-model="searchForm.status" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option label="成功" :value="1"></el-option>
                <el-option label="失败" :value="2"></el-option>
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
          @selection-change="eventMainTableSelect"
          :row-class-name="funcMainRowClassName"
        >
          <el-table-column
            prop="FileName"
            label="导入文件名"
            min-width="180"
          ></el-table-column>
          <el-table-column prop="CreateTime" label="导入时间" min-width="240">
          </el-table-column>
          <el-table-column prop="Remark" label="备注" min-width="200">
          </el-table-column>
          <el-table-column prop="Creater" label="操作员" width="180">
          </el-table-column>
          <el-table-column prop="Status" label="状态" width="80">
            <template #default="scope">
              <span v-if="scope.row.Status == 1" class="StatusGreen"
                >成功</span
              >
              <span v-if="scope.row.Status == 2" class="status-error"
                >失败</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="CreateTime" label="操作" min-width="80">
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-pagination
          @size-change="eventPageSizeChange($event, 'main')"
          @current-change="eventPageChange($event, 'main')"
          :current-page="searchForm.page"
          :page-sizes="[10, 15, 20, 100]"
          :page-size="searchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="searchForm.total"
        >
        </el-pagination>
      </div>
      <el-dialog title="明细" v-model="subDialogVisible" width="1300px">
        <div class="dialogVisible dialogVisibleSearch">
            <el-table
              v-if="subDialogVisible"
              stripe
              ref="multipleProductTable"
              :data="UnSelectedItemlist"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="eventTableSelect"
              :row-class-name="funcRowClassName"
              height="350"
              row-key="CheckinMIdList"
            >
              <el-table-column
                prop="ProductCode"
                label="商品编号"
                min-width="120"
              >
              </el-table-column>
              <el-table-column
                prop="ProductName"
                label="固定资产编号"
                min-width="240"
              >
              </el-table-column>
              <el-table-column prop="AssetNum" label="数量" min-width="170">
              </el-table-column>
              <el-table-column
                prop="AllStockNum"
                label="金额（不含税）"
                align="right"
                min-width="100"
              >
              </el-table-column>
              <el-table-column prop="UnitName" label="金额（含税）" min-width="50">
              </el-table-column>
              <el-table-column
                prop="WarehouseName"
                label="门店编号"
                min-width="260"
              >
              </el-table-column>
              <el-table-column
                prop="PositionName"
                label="仓库编号"
              >
              </el-table-column>
              <el-table-column
                prop="PositionName"
                label="资产状态"
              >
              </el-table-column>
              <el-table-column
                prop="PositionName"
                label="使用标识"
              >
              </el-table-column>
              <el-table-column
                prop="PositionName"
                label="入库日期"
              >
              </el-table-column>
            </el-table>
          <div class="footer">
            <el-pagination
              @size-change="eventPageSizeChange($event, 'sub')"
              @current-change="eventPageChange($event, 'sub')"
              :current-page="searchSubFrom.page"
              :page-sizes="[10, 15, 20, 100]"
              :page-size="searchSubFrom.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="searchSubFrom.total"
            >
            </el-pagination>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="subDialogVisible = false">关闭</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 导入弹窗 -->
      <el-dialog
        v-model="isImportDialog"
        title="数据导入"
        @close="importDialogClose"
        width="800px"
      >
        <div class="import-box">
          <div class="import-flex">
            <div class="import-label">
              <span class="requiredTip">*</span>请选择导入文件：
            </div>
            <div class="import-item">
              <div class="file-import">
                <span v-if="fileList.length > 0">{{ fileList[0].name }}</span>
                <CircleCloseFilled v-if="fileList.length > 0" 
                  style="width: 16px; height: 16px"
                  @click="deleteFile(fileList[0].key)"
                />
              </div>
              <el-button type="primary" size="small" class="file-btn">
              浏览
              <input
                class="input-file"
                type="file"
                accept=".xls, .xlsx"
                id="file"
                @change="chooseFiles"
                ref="inputFile"
              />
            </el-button>

            </div>
          </div>
          <div class="import-flex">
            <div class="import-label"></div>
            <div class="import-tips">（支持 *.xls, *.xlsx)</div>
          </div>

          <div class="import-flex flex-items-start">
            <div class="import-label">备注：</div>
            <div class="import-item">
              <el-input :rows="3" resize="none" :maxlength="180"  type="textarea"></el-input>
            </div>
          </div>
          <div class="func">
            <el-button type="primary" size="small" @click="onImport"
              >导入</el-button
            >
            <el-button size="small" @click="isImportDialog = false"
              >取消</el-button
            >
          </div>
        </div>
      </el-dialog>
      <div class="wx-tips">
        <!-- 温馨提示弹窗 -->
        <el-dialog v-model="tipDialogShow" :width="400">
          <div class="dialog-body">
            <div class="tip-content">
              <img src="../../../assets/img/purchase/warning.png" /><span
                class="tip-text"
                >数据撤销后将无法恢复，确认撤销吗？</span
              >
            </div>
            <div class="tip-btn">
              <div class="btn-grey" @click="tipDialogShow = false">关闭</div>
              <div class="btn-blue" @click="confirmRevoke">确认</div>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script src="./vmModule.js"></script>
<style scoped lang="scss">
  @page {
    size: auto;
    margin: 5mm;
  }

  .cccc {
    overflow: inherit;
  }

  .dialog-footer {
    position: relative;
  }

  .dialog-footer .isPrint {
    position: absolute;
    left: -135px;
    line-height: 34px;
    margin: 0;
  }

  .dialog-footer >>> .el-checkbox__label {
    padding-left: 6px;
  }

  .import-box {
    text-align: center;
    padding-bottom: 70px;
    .import-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .import-label {
        width: 140px;
        text-align: right;
      }
      .import-item {
        flex: 1;
        display: flex;
        align-items: center;
      }
      .upload {
        display: inline-block;
        ::v-deep .el-upload {
          width: 70px;
          border: none;
          height: 40px;
        }
      }
      .file-btn {
        position: relative;
        .input-file {
          opacity: 0;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }
      }
    }
    .file-list {
      margin: 10px 0;
      // height: 300px;
      // overflow-y: auto;
      color: #7a7a7a;
      // font-size: 12px;
      .file-item {
        margin: 5px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          .delete-icon {
            display: block;
          }
        }
      }
      .delete-icon {
        display: none;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    .func {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .tip-content {
    margin-top: 45px;
    display: flex;
    align-items: center;
  }
  .tip-text {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #2d323c;
    margin-left: 9px;
  }
  .tip-btn {
    margin-top: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    .btn-blue {
      width: 80px;
      height: 34px;
      background: #579ff6;
      border-radius: 4px;
      line-height: 34px;
      text-align: center;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ffffff;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
    .btn-grey {
      width: 80px;
      height: 34px;
      background: #ededee;
      border: 1px solid #d9dbdd;
      border-radius: 4px;
      text-align: center;
      line-height: 34px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #767b83;
      cursor: pointer;
      margin-right: 12px;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .status-error {
    color: #FF5353;
  }
  .flex-items-start {
    align-items: flex-start!important;
  }
  .file-import {
    width: 300px;
    height: 28px;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
    border-radius: 2px;
    flex: 1;
    margin-right: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
  }
  .import-tips {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #767B83;
    text-align: left;
    flex: 1;
    margin: 12px 0 30px 0;
  }
</style>
