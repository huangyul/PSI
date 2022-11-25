<template>
  <div style="height: 100%">
    <div class="all">
      <div class="topBtnBox">
        <button
          v-show="permissionsList.Add"
          class="green"
          @click="eventOpenWindow()"
        >
          <i class="el-icon-plus"></i>新增采购计划
        </button>
        <!-- <button v-show="permissionsList.Delete" class="blue" @click="eventDetele"><i class="delete"></i>删除</button> -->
        <el-popconfirm
          confirm-button-text="确认"
          cancel-button-text="取消"
          icon="el-icon-question"
          icon-color="#409EFF"
          title="确认删除吗？"
          @confirm="eventDetele"
        >
          <template #reference>
            <button class="blue" v-show="permissionsList.Delete">
              <i class="delete"></i>删除
            </button>
          </template>
        </el-popconfirm>
        <span class="flex"></span>
        <button
          v-show="permissionsList.Import"
          @click="eventExportTemplate"
          class="grey"
        >
          <i class="download"></i>导入模板下载
        </button>
        <div class="uploadBox">
          <button
            v-show="permissionsList.Import"
            class="grey"
            @click="onItemImport"
          >
            <i class="import"></i>导入
          </button>
        </div>
        <button
          v-show="permissionsList.Export"
          @click="eventExport"
          class="grey"
        >
          <i class="export"></i>导出
        </button>
      </div>
      <div class="searchBox">
        <div class="conditions">
          <div class="box">
            <span>创建日期</span>
            <div class="inputBox">
              <RangeDateVue
                v-model:props-start="searchForm.startTime"
                v-model:props-end="searchForm.endTime"
              ></RangeDateVue>
            </div>
          </div>
          <div class="box">
            <span>采购计划单号</span>
            <div class="inputBox">
              <el-input v-model="searchForm.PlanCode"></el-input>
            </div>
          </div>
          <div class="box">
            <span>商品</span>
            <div class="inputBox">
              <el-input
                v-model="searchForm.Product"
                placeholder="编号/名称/条形码"
              ></el-input>
            </div>
          </div>
          <div class="box">
            <span>门店名称</span>
            <div class="inputBox">
              <el-select v-model="searchForm.shopInfo" clearable filterable>
                <el-option
                  :label="item.Name"
                  :value="item.Code"
                  v-for="item in shopList"
                  :key="item.Code"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="box">
            <span>状态</span>
            <div class="inputBox">
              <el-select v-model="searchForm.Status">
                <el-option :key="-1" label="全部" :value="-1"></el-option>
                <el-option :key="0" label="待处理" :value="0"></el-option>
                <el-option :key="1" label="处理中" :value="1"></el-option>
                <el-option :key="5" label="已下单" :value="5"></el-option>
              </el-select>
            </div>
          </div>
          <div class="box">
            <span>紧急程度</span>
            <div class="inputBox">
              <el-select v-model="searchForm.Urgency">
                <el-option :key="-1" label="全部" :value="-1"></el-option>
                <el-option :key="0" label="普通" :value="0"></el-option>
                <el-option :key="1" label="紧急" :value="1"></el-option>
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
          :row-class-name="funcRowClassName"
          :span-method="funcObjectSpanMethod"
          :cell-style="funcColumnStyle"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column prop="PlanCode" label="采购计划编号" min-width="180">
            <template #default="scope">
              <span
                v-show="permissionsList.Edit && isEidt(scope.row)"
                class="update"
                @click="eventOpenWindow(scope.row)"
                >{{ scope.row.PlanCode }}</span
              >
              <span v-show="permissionsList.Edit && !isEidt(scope.row)">{{
                scope.row.PlanCode
              }}</span>
              <span v-show="!permissionsList.Edit">{{
                scope.row.PlanCode
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ProductName" label="商品名称" min-width="240">
          </el-table-column>
          <el-table-column
            prop="ApplyNum"
            label="申请数量"
            align="right"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            prop="OrderNum"
            label="下单数量"
            align="right"
            min-width="100"
          >
          </el-table-column>
          <el-table-column prop="UnitName" label="单位" min-width="50">
          </el-table-column>
          <el-table-column prop="ShopName" label="门店名称" min-width="230">
          </el-table-column>
          <el-table-column prop="SupplierName" label="供应商" min-width="180">
          </el-table-column>
          <el-table-column prop="Urgency" label="紧急状态" min-width="80">
            <template #default="scope">
              <span v-if="scope.row.Urgency == 0">普通</span>
              <span v-if="scope.row.Urgency == 1" class="StatusRed">紧急</span>
            </template>
          </el-table-column>
          <el-table-column prop="Status" label="计划状态" min-width="80">
            <template #default="scope">
              <span v-if="scope.row.Status == 0" class="StatusYellow"
                >待处理</span
              >
              <span v-if="scope.row.Status == 1" class="StatusGreen"
                >处理中</span
              >
              <span v-if="scope.row.Status == 5" class="StatusGray"
                >已下单</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="PlanDeliveryDate"
            label="预计到货日期"
            min-width="170"
          >
          </el-table-column>
          <el-table-column prop="Creater" label="创建人" min-width="170">
          </el-table-column>
          <el-table-column prop="CreateTime" label="创建时间" min-width="170">
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
      <el-dialog
        :title="OpenWindowTitle"
        v-model="dialogVisible"
        width="1300px"
      >
        <div class="dialogVisible">
          <div class="searchBox">
            <div class="conditions">
              <div class="box">
                <span>计划编号</span>
                <div class="auto">
                  <span>{{ addForm.Code }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="searchBox">
            <div class="conditions">
              <div class="box">
                <span><span class="requiredTip">*</span>门店名称</span>
                <div class="inputBox">
                  <el-select
                    v-model="productSearchForm.shopInfo"
                    clearable
                    :disabled="isEditShopName"
                    filterable
                  >
                    <el-option
                      :label="item.Name"
                      :value="item.Code"
                      v-for="item in shopList"
                      :key="item.Code"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="box">
                <span>收货地址</span>
                <div class="inputBox">
                  <el-input
                    v-model="addForm.ShopAddress"
                    maxlength="100"
                    clearable
                  ></el-input>
                </div>
              </div>
              <div class="box">
                <span>收货人</span>
                <div class="inputBox">
                  <el-input
                    v-model="addForm.Receiver"
                    maxlength="20"
                    clearable
                  ></el-input>
                </div>
              </div>
              <div class="box">
                <span>联系电话</span>
                <div class="inputBox">
                  <el-input
                    v-model="addForm.ContactTel"
                    maxlength="20"
                    clearable
                  ></el-input>
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
            <button class="blue_plain" @click="eventOpenProductWindow">
              添加商品
            </button>
            <!-- <button class="blue_plain" @click="dialogVisibleScanQRCodes = true">扫码录入</button> -->
          </div>

          <div class="middle haveBorderNoTop">
            <el-table
              stripe
              ref="multipleTable"
              :data="addForm.Details"
              tooltip-effect="dark"
              height="350"
              style="width: 100%"
              :row-class-name="funcRowClassName"
            >
              <el-table-column label="操作" fixed="left" width="50">
                <template #default="scope">
                  <div class="tableButtonBox">
                    <i
                      class="delete"
                      @click="eventDeleteDetails(scope.$index, scope.row)"
                    ></i>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="ProductCode"
                label="商品编号"
                min-width="120"
              ></el-table-column>
              <el-table-column
                prop="ProductName"
                label="商品名称"
                min-width="240"
              >
              </el-table-column>
              <el-table-column
                prop="SetNum"
                label="起订数量"
                align="right"
                min-width="100"
              >
              </el-table-column>
              <el-table-column
                prop="PerGroupNum"
                label="每组数量"
                align="right"
                min-width="100"
              >
              </el-table-column>
              <el-table-column prop="UnitName" label="单位" min-width="50">
              </el-table-column>
              <el-table-column
                prop="GroupNum"
                label="下单组数"
                width="150"
                min-width="100"
              >
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.GroupNum"
                    @change="
                      eventChangeaddFormGroupNum(
                        $event,
                        scope.$index,
                        scope.row
                      )
                    "
                    :precision="2"
                    :min="0"
                    :max="999999999.99"
                    :controls="false"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                prop="orderSum"
                label="下单数量"
                align="right"
                min-width="100"
              ></el-table-column>
              <el-table-column
                prop="PlanDeliveryDate"
                label="预计到货日期"
                width="160"
              >
                <template #default="scope">
                  <el-date-picker
                    v-model="scope.row.PlanDeliveryDate"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column
                prop="SupplierName"
                label="供应商"
                min-width="180"
              ></el-table-column>
              <el-table-column prop="Urgency" label="紧急状态" min-width="100">
                <template #default="scope">
                  <el-select v-model="scope.row.Urgency">
                    <el-option :key="0" label="普通" :value="0"></el-option>
                    <el-option :key="1" label="紧急" :value="1"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="Remark" label="备注" min-width="280">
              </el-table-column>
            </el-table>
          </div>
          <div class="footerTip">
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

      <!-- 增加商品弹窗 -->
      <el-dialog title="选择商品" v-model="dialogVisibleProduct" width="1300px">
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
                    }"
                    :options="CategoryTree"
                    v-model="productSearchForm.matTypeId"
                    clearable
                  ></el-cascader>
                </div>
              </div>
              <div class="box">
                <span>商品</span>
                <div class="inputBox">
                  <el-input
                    v-model="productSearchForm.productInfo"
                    placeholder="编号/名称/条形码"
                  ></el-input>
                </div>
              </div>
              <div class="box">
                <span>供应商</span>
                <div class="inputBox">
                  <el-input v-model="productSearchForm.supplierInfo"></el-input>
                </div>
              </div>
            </div>
            <div class="operation">
              <!-- <i class="doubleDown"></i> -->
              <button class="search" @click="doProductSearch">查询</button>
              <button class="reset" @click="eventProductReset">重置</button>
            </div>
          </div>

          <div class="middle haveBorder">
            <el-table
              v-if="dialogVisibleProduct"
              stripe
              ref="multipleProductTable"
              :data="productTableData"
              tooltip-effect="dark"
              height="400"
              style="width: 100%"
              :row-class-name="funcRowClassName"
              row-key="ProductId"
              @selection-change="eventProductTableSelect"
            >
              <el-table-column
                type="selection"
                width="55"
                align="center"
                :reserve-selection="true"
              >
              </el-table-column>
              <el-table-column
                prop="Mat_No"
                label="商品编号"
                min-width="120"
              ></el-table-column>
              <el-table-column prop="Mat_Name" label="商品名称" min-width="240">
              </el-table-column>
              <el-table-column
                prop="MatTypeName"
                label="商品类别"
                min-width="100"
              >
              </el-table-column>
              <el-table-column
                prop="SetNum"
                label="起订数量"
                align="right"
                min-width="100"
              >
              </el-table-column>
              <el-table-column
                prop="OrderNum"
                label="每组数量"
                align="right"
                min-width="100"
              >
              </el-table-column>
              <el-table-column prop="Mast_UnitName" label="单位" min-width="50">
              </el-table-column>
              <el-table-column
                prop="StockNum"
                label="在库库存"
                align="right"
                min-width="100"
              ></el-table-column>
              <el-table-column
                prop="PlanDeliveryDate"
                label="预计到货日期"
                min-width="170"
              ></el-table-column>
              <el-table-column
                prop="Manufacturer"
                label="供应商"
                min-width="180"
              ></el-table-column>
              <el-table-column
                prop="Remark"
                label="备注"
                min-width="280"
              ></el-table-column>
            </el-table>
          </div>

          <div class="footer">
            <el-pagination
              @size-change="eventPageSizeChange_nested"
              @current-change="eventPageChange_nested"
              :current-page="nested_page"
              :page-sizes="[10, 15, 20, 100]"
              :page-size="nested_pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="nested_total"
            >
            </el-pagination>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisibleProduct = false">关闭</el-button>
            <el-button type="primary" @click="eventAddProduct">选择</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 扫码弹窗 -->
      <el-dialog
        title="扫码添加商品"
        v-model="dialogVisibleScanQRCodes"
        width="50%"
      >
        <div class="dialogVisible">
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            "
          >
            <div class="imgScanQRCodes"></div>
            <h4 style="margin: 10px 0">
              请扫码商品条码添加，可以连续添加多个商品！
            </h4>
            <p>
              本次已添加<span>{{ 4 }}</span
              >条记录 拷贝
            </p>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="dialogVisibleScanQRCodes = false"
              >完成</el-button
            >
          </span>
        </template>
      </el-dialog>

      <div class="wx-tips">
        <!-- 温馨提示弹窗 -->
        <el-dialog v-model="tipDialogShow" :width="400">
          <div class="dialog-body">
            <div class="title">
              <img src="../../../assets/img/purchase/warning.png" />
              <div class="text">保存失败</div>
            </div>
            <div class="content">
              “商品名称商品名称”商品已有待处理或处理中的 申购计划<span
                class="blue-text"
                >{{ repeatPurchaseOrderNum }}</span
              >，不能重复添加哦！
            </div>
            <div class="btn" @click="tipDialogShow = false">知道了</div>
          </div>
        </el-dialog>
      </div>
      <!-- 文件导入弹窗 -->
      <ImportDialog
        v-model:isShow="isItemImportDialogShow"
        type="plan"
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
  .dialog-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      display: flex;
      align-items: center;
      .text {
        margin-left: 11px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #2d323c;
      }
    }

    .content {
      width: 340px;
      background: #ffffff;
      margin-top: 17px;
      margin-bottom: 20px;
      padding: 15px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #2d323c;
      line-height: 24px;
      .blue-text {
        color: #428feb;
      }
    }
    .btn {
      background: #579ff6;
      border-radius: 4px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ffffff;
      padding: 11px 38px;
      cursor: pointer;
      user-select: none;
      margin-bottom: 30px;
    }
  }
</style>
