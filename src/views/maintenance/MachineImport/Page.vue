<!-- 机器导入  -->
<template>
  <div style="height: 100%">
    <div class="all">
      <div class="topBtnBox">
        <span class="flex"></span>
        <button class="grey" @click="eventExportTemplate">
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
            <div class="inputBox" style="width: 430px;">
              <RangeDate type="datetime" v-model:props-start="searchForm.startTime"
                v-model:props-end="searchForm.endTime"></RangeDate>
            </div>
          </div>
          <div class="box">
            <span>状态</span>
            <div class="inputBox">
              <el-select v-model="searchForm.status" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option label="处理中" :value="0"></el-option>
                <el-option label="成功" :value="1"></el-option>
                <el-option label="失败" :value="2"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="operation">
          <i class="doubleDown"></i>
          <button class="search" @click="handleSearch">查询</button>
          <button class="reset" @click="handleReset">重置</button>
        </div>
      </div>
      <div class="middle">
        <el-table border stripe ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
          height="100%" @selection-change="eventMainTableSelect">
          <el-table-column prop="FileName" label="导入文件名" min-width="180"></el-table-column>
          <el-table-column prop="CreateTime" label="导入时间" min-width="240">
          </el-table-column>
          <el-table-column prop="Remark" label="备注" min-width="200">
          </el-table-column>
          <el-table-column prop="Creater" label="操作员" width="180">
          </el-table-column>
          <el-table-column prop="Status" label="状态" width="80">
            <template #default="scope">
              <span v-if="scope.row.Status == 0">处理中</span>
              <span v-if="scope.row.Status == 1" class="StatusGreen">成功</span>
              <span v-if="scope.row.Status == 2" class="status-error">失败</span>
            </template>
          </el-table-column>
          <el-table-column prop="CreateTime" label="操作" min-width="80">
            <template #default="{ row }">
              <span v-if="row.Status == 1" class="can-click" @click="openDetail(row.ID)">查看明细</span>
              <span v-if="row.Status == 2" class="can-click" @click="downloadReason(row.ID)">下载失败原因</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-pagination @size-change="handleSearch" @current-change="handleSearch" v-model:current-page="searchForm.page"
          :page-sizes="[10, 15, 20, 100]" v-model:page-size="searchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <el-dialog title="明细" v-model="subDialogVisible" width="1300px">
        <div class="dialogVisible dialogVisibleSearch middle">
          <el-table v-if="subDialogVisible" stripe ref="multipleProductTable" :data="detailTableData" height="550"
            row-key="CheckinMIdList">
            <el-table-column prop="DeviceCode" label="商品编号">
            </el-table-column>
            <el-table-column prop="AssetNum" label="固定资产编号">
            </el-table-column>
            <el-table-column prop="Num" label="数量">
            </el-table-column>
            <el-table-column prop="Amount" label="金额（不含税）" min-width="120">
            </el-table-column>
            <el-table-column prop="AmountByTax" label="金额（含税）">
            </el-table-column>
            <el-table-column prop="Mast_No" label="门店编号">
            </el-table-column>
            <el-table-column prop="WarehouseCode" label="仓库编号">
            </el-table-column>
            <el-table-column prop="Status" label="资产状态">
              <template #default="{ row }">
                {{ map.status.get(row.Status) }}
              </template>
            </el-table-column>
            <el-table-column prop="Usage" label="使用标识">
              <template #default="{ row }">
                {{ map.usage.get(row.Usage) }}
              </template>
            </el-table-column>

            <el-table-column prop="InDate" label="入库日期" min-width="130">
            </el-table-column>
          </el-table>
          <div class="footer">
            <el-pagination @size-change="handleDetailSearch" @current-change="handleDetailSearch"
              v-model:current-page="detailPage" :page-sizes="[10, 15, 20, 100]" v-model:page-size="detailPageSize"
              layout="total, sizes, prev, pager, next, jumper" :total="detailTotal">
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
      <el-dialog v-model="isImportDialog" title="数据导入" @close="importDialogClose" width="800px">
        <div class="import-box">
          <div class="import-flex">
            <div class="import-label">
              <span class="requiredTip">*</span>请选择导入文件：
            </div>
            <div class="import-item">
              <div class="file-import">
                <span v-if="fileList.length > 0">{{ fileList[0].name }}</span>
                <CircleCloseFilled v-if="fileList.length > 0" style="width: 16px; height: 16px"
                  @click="deleteFile(fileList[0].key)" />
              </div>
              <el-button type="primary" size="small" class="file-btn">
                浏览
                <input class="input-file" type="file" accept=".xls, .xlsx" id="file" @change="chooseFiles"
                  ref="inputFile" />
              </el-button>

            </div>
          </div>
          <div class="import-flex">
            <div class="import-label"></div>
            <div class="import-tips">（支持 *.xls, *.xlsx）</div>
          </div>

          <div class="import-flex flex-items-start">
            <div class="import-label">备注：</div>
            <div class="import-item">
              <el-input v-model="remark" :rows="3" resize="none" show-word-limit :maxlength="128" type="textarea"></el-input>
            </div>
          </div>
          <div class="func">
            <el-tooltip v-if="fileList.length == 0" class="box-item" effect="dark" content="请选择导入文件"
              placement="top-start">
              <div class="faker-btn">导入</div>
            </el-tooltip>
            <el-button v-else type="primary" size="small" @click="onImport" style="margin-right:10px;">导入</el-button>
            <el-button size="small" @click="isImportDialog = false">取消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>

    <!-- 下载提示  -->
    <Teleport to="body">
      <div class="mask" v-if="isShow">
        <div class="import-status-box">
          <div class="loading" v-if="importStatus == 'importing'"></div>
          <i v-if="importStatus == 'error'" class="el-icon-circle-close"></i>
          <i v-if="importStatus == 'success'" class="el-icon-circle-check"></i>
          <div class="text">{{ importText }}</div>
        </div>
      </div>

    </Teleport>
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

.dialog-footer>>>.el-checkbox__label {
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
  align-items: flex-start !important;
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

.faker-btn {
  background-color: #a0cfff;
  border-color: #a0cfff;
  color: #ffffff;
  min-height: 32px;
  padding: 9px 15px;
  font-size: 12px;
  border-radius: 3px;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: .1s;
  transition: .1s;
  font-weight: 500;
  margin-right: 10px;
  cursor: not-allowed;
  min-height: 32px;
  padding: 9px 15px;
  font-size: 12px;
  border-radius: 3px;
}

.el-button+.el-button {
  margin: 0;
}

.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 10000;

  .import-status-box {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    transform: translateY(-50%, -50%);
    width: 300px;
    height: 124px;
    background: #2D323C;
    box-shadow: 0px 5px 10px 0px rgba(45, 50, 60, 0.2);
    opacity: 0.9;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 10px;
    text-align: center;

    .loading {
      border: 5px solid #f3f3f3;
      border-radius: 50%;
      border-top: 5px solid #76b0f8;
      border-right: 5px solid #76b0f8;
      width: 32px;
      height: 32px;
      animation: spin 2s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }

    i {
      font-size: 42px;
      margin-bottom: 16px;
    }

    .el-icon-circle-close {
      color: #FF5353;
    }

    .el-icon-circle-check {
      color: #0CBA63;
    }

    .text {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #FFFFFF;
    }
  }
}
</style>
