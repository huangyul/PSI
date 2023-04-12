<!--外部调拨出库  -->
<template>
  <div style="height: 100%">
    <div class="all">
      <div class="topBtnBox">
        <button
          v-show="permissionsList.Add"
          class="green"
          @click="eventOpenWindow()"
        >
          <i class="el-icon-plus"></i>新增
        </button>
        <!-- <button class="green" v-print="printObj" @click="funcPrintReady"><i class="el-icon-printer"></i>打印发货单</button> -->
        <button
          v-show="permissionsList.Print"
          class="blue"
          @click="eventPrintList()"
        >
          <i class="print"></i>打印调拨单
        </button>
        <el-tooltip
          effect="light"
          placement="top"
          v-if="
            permissionsList.TransferRevoke && mainTableSelectData.length === 0
          "
        >
          <template #content>请先选择需要撤销的记录</template>
          <button class="red" style="cursor: not-allowed">
            <i class="revoke"></i>撤销
          </button>
        </el-tooltip>
        <button
          v-show="
            permissionsList.TransferRevoke && mainTableSelectData.length > 0
          "
          class="red"
          @click="onRevoke"
        >
          <i class="revoke"></i>撤销
        </button>
        <span class="flex"></span>
        <!-- v-show="permissionsList.Import" -->
        <div class="uploadBox" v-show="permissionsList.Import">
          <button class="grey" @click="onItemImport">
            <i class="import"></i>导入
          </button>
        </div>
        <button
          class="grey"
          @click="eventExportTemplate"
          v-show="permissionsList.Import"
        >
          <i class="download"></i>导入模板下载
        </button>
      </div>
      <div class="searchBox">
        <div class="conditions">
          <div class="box">
            <span>调出门店</span>
            <div class="inputBox">
              <el-select
                v-model="searchForm.searchCondition.companyCode"
                filterable
                clearable
              >
                <el-option
                  :label="item.Name"
                  :value="item.Code"
                  v-for="item in CompanyList"
                  :key="item.Code"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="box">
            <span>调出仓库</span>
            <div class="inputBox">
              <el-select
                v-model="searchForm.searchCondition.warehouseCode"
                clearable
                :disabled="searchForm.searchCondition.companyCode == ''"
                filterable
              >
                <el-option
                  :label="item.Name"
                  :value="item.Code"
                  v-for="item in WarehouseList"
                  :key="item.Code"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="box" v-show="isShowPosition == '1'">
            <span>调出仓位</span>
            <div class="inputBox">
              <el-select
                v-model="searchForm.searchCondition.positionCode"
                clearable
                :disabled="searchForm.searchCondition.companyCode == ''"
                filterable
              >
                <el-option
                  :label="item.Name"
                  :value="item.Code"
                  v-for="item in PositionList"
                  :key="item.Code"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="box">
            <span>调入门店</span>
            <div class="inputBox">
              <el-select
                v-model="searchForm.searchCondition.inCompanyCode"
                filterable
                clearable
              >
                <el-option
                  :label="item.Name"
                  :value="item.Code"
                  v-for="item in InCompanyList"
                  :key="item.Code"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="box">
            <span>商品</span>
            <div class="inputBox">
              <el-input
                v-model="searchForm.searchCondition.Product"
                placeholder="编码/名称/条码"
              ></el-input>
            </div>
          </div>
          <div class="box">
            <span>固定资产编号</span>
            <div class="inputBox">
              <el-input
                v-model="searchForm.searchCondition.assetNo"
                placeholder="请输入固定资产编号"
              ></el-input>
            </div>
          </div>
          <div class="box">
            <span>生成日期</span>
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
              <el-select v-model="searchForm.searchCondition.status" clearable>
                <el-option label="调拨中" :value="1"></el-option>
                <el-option label="已完成" :value="2"></el-option>
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
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column
            prop="CheckoutCode"
            label="出库单号"
            min-width="190"
          ></el-table-column>
          <el-table-column prop="ProductName" label="商品名称" width="240">
          </el-table-column>
          <el-table-column prop="AssetNo" label="资产编号" width="100">
          </el-table-column>
          <el-table-column prop="UnitName" label="单位" width="50">
          </el-table-column>
          <el-table-column
            prop="OutNum"
            label="调拨数量"
            align="right"
            width="80"
          >
          </el-table-column>
          <el-table-column prop="ShopName" label="调出门店" width="230">
          </el-table-column>
          <el-table-column prop="WarehouseName" label="调出仓库" width="260">
          </el-table-column>
          <el-table-column
            prop="PositionName"
            label="调出仓位"
            v-if="isShowPosition == '1'"
          >
          </el-table-column>
          <el-table-column prop="InShopName" label="调入门店" width="230">
          </el-table-column>
          <el-table-column prop="OutDate" label="调入入库时间" width="160">
          </el-table-column>
          <el-table-column prop="Status" label="状态" width="80">
            <template #default="scope">
              <span v-if="scope.row.Status == 1" class="StatusGreen"
                >调拨中</span
              >
              <span v-if="scope.row.Status == 2" class="StatusGray"
                >已完成</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="Remark" label="备注" width="280">
          </el-table-column>
          <el-table-column prop="Creater" label="创建人" width="170">
          </el-table-column>
          <el-table-column prop="CreateTime" label="创建时间" min-width="170">
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
      <el-dialog :title="'外部调拨出库'" v-model="dialogVisible" width="1300px">
        <div class="dialogVisible">
          <div class="searchBox">
            <div class="conditions">
              <div class="box">
                <span>出库单号：</span>
                <div class="regular">
                  <div class="inputBox">
                    <!-- <el-input v-model="checkoutNum"></el-input> -->
                    {{ checkoutNum }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="topBtnBox">
            <div class="titleBox">
              <div class="mark"></div>
              <span>商品信息</span>
            </div>
            <span class="flex"></span>
            <span class="requiredTip" style="color: red">*</span>
            <span>调入门店：</span>
            <div class="regular" style="margin-right: 15px">
              <el-select v-model="inCompanyCode" filterable>
                <el-option
                  :label="item.Name"
                  :value="item.Code"
                  v-for="item in InCompanyList"
                  :key="item.Code"
                ></el-option>
              </el-select>
            </div>
            <span
              ><span class="requiredTip" style="color: red">*</span
              >调出门店：</span
            >
            <div class="regular" style="margin-right: 15px">
              <el-select
                v-model="companyCode"
                :disabled="outStoreIsdisabled"
                filterable
              >
                <el-option
                  :label="item.Name"
                  :value="item.Code"
                  v-for="item in CompanyList"
                  :key="item.Code"
                ></el-option>
              </el-select>
            </div>
            <button class="blue_plain" @click="eventOpenSubWindow()">
              添加商品
            </button>
          </div>
          <div class="middle haveBorderNoTop">
            <el-table
              stripe
              ref="multipleTable"
              :data="Itemlist"
              tooltip-effect="dark"
              style="width: 100%"
              height="350"
              :row-class-name="funcRowClassName"
            >
              <el-table-column
                prop="ProductCode"
                label="商品编号"
                min-width="120"
              >
              </el-table-column>
              <el-table-column
                prop="ProductName"
                label="商品名称"
                min-width="240"
              >
              </el-table-column>
              <el-table-column prop="AssetNum" label="资产编号" min-width="170">
              </el-table-column>
              <el-table-column prop="UnitName" label="单位" width="60">
              </el-table-column>
              <el-table-column
                prop="AllStockNum"
                label="在库数量"
                align="right"
                min-width="100"
              >
              </el-table-column>
              <el-table-column prop="CheckoutSum" label="出库数量" width="150">
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.CheckoutSum"
                    :min="1"
                    :max="scope.row.AllStockNum"
                    :precision="2"
                    controls-position="right"
                    size="small"
                  />
                </template>
              </el-table-column>
              <!-- <el-table-column prop="LogComCode1" label="物流公司1" width="160">
							<template #default="scope">
								<el-select v-model="scope.row.LogComCode1" clearable>
									<el-option :label="item.Name" :value="item.Code" v-for="item in ExCompanyList"
										:key="item.Code"></el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="LogFee1" label="运费1" width="160">
							<template #default="scope">
								<el-input-number v-model="scope.row.LogFee1" :min="0" :max="99999999" :precision="2"
									controls-position="right" size="small" />
							</template>
						</el-table-column>
						<el-table-column prop="LogComCode2" label="物流公司2" width="160">
							<template #default="scope">
								<el-select v-model="scope.row.LogComCode2" clearable>
									<el-option :label="item.Name" :value="item.Code" v-for="item in ExCompanyList"
										:key="item.Code"></el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="LogFee2" label="运费2" width="160">
							<template #default="scope">
								<el-input-number v-model="scope.row.LogFee2" :min="0" :max="99999999" :precision="2"
									controls-position="right" size="small" />
							</template>
						</el-table-column> -->
              <el-table-column prop="Remark" label="备注" min-width="280">
                <template #default="scope">
                  <el-input
                    v-model="scope.row.Remark"
                    :maxlength="50"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="WarehouseName"
                label="出库仓库"
                min-width="250"
              >
              </el-table-column>
              <el-table-column
                prop="PositionName"
                label="出库仓位"
                v-if="isShowPosition == '1'"
              >
              </el-table-column>
              <el-table-column prop="Operate" label="操作">
                <template #default="scope">
                  <span class="update" @click="RemoveItem(scope.$index)"
                    >删除</span
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="footerTip">
            <p>
              创建人：{{ creator }}<b>|</b>创建时间：{{
                new Date().toLocaleDateString()
              }}
            </p>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-checkbox
              v-show="permissionsList.Print"
              class="isPrint"
              v-model="isPrint"
              style="margin-right: 35px"
              >打印调拨单</el-checkbox
            >
            <el-button @click="dialogVisible = false">关闭</el-button>
            <el-button type="primary" @click="eventSave">保存</el-button>
            <!-- <el-button type="primary" @click="eventPrintTemplate">调拨单打印模板设计</el-button>
							<el-button type="primary" @click="eventPrint(1)">调拨单打印预览</el-button>
							<el-button type="primary" @click="eventPrint(2)">调拨单打印</el-button> -->
          </span>
        </template>
      </el-dialog>
      <el-dialog :title="'选择商品'" v-model="subDialogVisible" width="1300px">
        <div class="dialogVisible dialogVisibleSearch">
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
                      emitPath: false
                    }"
                    :options="SubCategoryTree"
                    v-model="searchSubFrom.searchCondition.MatTypeID"
                    clearable
                  ></el-cascader>
                </div>
              </div>
              <div class="box">
                <span>出货仓库</span>
                <div class="inputBox">
                  <el-select
                    v-model="searchSubFrom.searchCondition.warehouseCode"
                    clearable
                  >
                    <el-option
                      :label="item.Name"
                      :value="item.Code"
                      v-for="item in WarehouseSubList"
                      :key="item.Code"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="box" v-show="isShowPosition == '1'">
                <span>出货仓位</span>
                <div class="inputBox">
                  <el-select
                    v-model="searchSubFrom.searchCondition.positionCode"
                    clearable
                  >
                    <el-option
                      :label="item.Name"
                      :value="item.Code"
                      v-for="item in PositionSubList"
                      :key="item.Code"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="box">
                <span>商品</span>
                <div class="inputBox">
                  <el-input
                    v-model="searchSubFrom.searchCondition.Product"
                    placeholder="编码/名称/条码"
                  >
                  </el-input>
                </div>
              </div>
            </div>
            <div class="operation">
              <button class="search" @click="doProductSearch">查询</button>
              <button class="reset" @click="eventProductReset">重置</button>
            </div>
          </div>
          <div class="middle haveBorder">
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
                type="selection"
                width="55"
                align="center"
                :reserve-selection="true"
              >
              </el-table-column>
              <el-table-column
                prop="ProductCode"
                label="商品编号"
                min-width="120"
              >
              </el-table-column>
              <el-table-column
                prop="ProductName"
                label="商品名称"
                min-width="240"
              >
              </el-table-column>
              <el-table-column prop="AssetNum" label="资产编号" min-width="170">
              </el-table-column>
              <el-table-column
                prop="AllStockNum"
                label="在库数量"
                align="right"
                min-width="100"
              >
              </el-table-column>
              <el-table-column prop="UnitName" label="单位" min-width="50">
              </el-table-column>
              <el-table-column
                prop="WarehouseName"
                label="出货仓库"
                min-width="260"
              >
              </el-table-column>
              <el-table-column
                prop="PositionName"
                label="仓位"
                v-if="isShowPosition == '1'"
              >
              </el-table-column>
            </el-table>
          </div>
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
            <el-button type="primary" @click="eventSelect">选择</el-button>
          </span>
        </template>
      </el-dialog>
      <div id="printMe" v-show="false">
        <div id="Tips"></div>
        <div id="printMeSub" class="cccc">
          <div v-for="dwData in dealWithData" :key="dwData.CheckoutCode">
            <h1>调拨单</h1>
            <br />
            <span class="flex"></span>
            <p>出库单号</p>
            <br />
            <span class="flex"></span>
            <img :id="'barCode_' + dwData.CheckoutCode" />
            <br />
            <p>订单信息</p>
            <br />
            <p>调出门店：</p>
            <p>{{ dwData.OutShopName }}</p>
            <p>调入门店：</p>
            <p>{{ dwData.InShopName }}</p>
          </div>
        </div>
      </div>

      <!-- 导入弹窗 -->
      <el-dialog
        v-model="isImportDialog"
        title="外部调拨导入"
        @close="importDialogClose"
      >
        <div class="import-box">
          <div class="import-flex">
            <span class="requiredTip">*</span>导入文件：
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
            （支持 *.xls, *.xlsx)
          </div>
          <div class="file-list">
            <div
              v-for="(file, index) in fileList"
              class="file-item"
              :key="index"
            >
              <div>{{ file.name }}</div>
              <!-- <i class="el-icon-circle-close-filled"></i> -->
              <div class="delete-icon">
                <CircleCloseFilled
                  style="width: 16px; height: 16px"
                  @click="deleteFile(file.key)"
                />
              </div>
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
      <!-- 文件导入弹窗 -->
      <ImportDialog
        v-model:isShow="isItemImportDialogShow"
        type="dispatch"
        @upload-success="handelUploadSuccess"
      ></ImportDialog>
    </div>
    <TaskDetail
      v-if="isTaskDetailShow"
      v-model:is-show="isTaskDetailShow"
      :transactionId="taskId"
    ></TaskDetail>
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
      justify-content: center;
      align-items: center;
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
</style>
