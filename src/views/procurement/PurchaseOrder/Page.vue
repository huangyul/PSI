<template>
  <div class="all">
    <div class="topBtnBox">
      <button
        v-show="permissionsList.Add"
        class="green"
        @click="eventOpenWindow()"
      >
        <i class="el-icon-plus"></i>新增采购单
      </button>
      <button
        v-if="permissionsList.View"
        class="white"
        @click="eventOpenWindow(null, 'view')"
        :disabled="isViewBtn"
      >
        <i class="el-icon-view"></i>查看
      </button>
      <button class="blue" @click="eventDetele" v-show="permissionsList.Delete">
        <i class="delete"></i>删除
      </button>
      <button
        v-show="permissionsList.PlaceOrder"
        class="blue"
        @click="eventPlaceOrder"
      >
        <i class="PlaceOrder"></i>采购下单
      </button>
      <button
        v-show="permissionsList.TransferOrder"
        class="red"
        @click="eventDispatchOrder"
      >
        <i class="dispatchOrder"></i>调拨下单
      </button>
      <span class="flex"></span>
      <button
        class="grey"
        @click="eventExportTemplate"
        v-show="permissionsList.Import"
      >
        <i class="download"></i>待处理订单下载
      </button>
      <div class="uploadBox">
        <button class="grey" @click="isImportDialog = true">
          <i class="import"></i>导入
        </button>
      </div>

      <!-- <button v-show="permissionsList.Import" class="grey"><i class="import"></i>导入</button> -->
      <button v-show="permissionsList.Export" @click="eventExport" class="grey">
        <i class="export"></i>导出
      </button>
      <!-- <button v-show="permissionsList.Import" class="grey"><i class="download"></i>导入模板下载</button> -->
    </div>
    <div class="searchBox">
      <div class="conditions">
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
          <span>采购单编号</span>
          <div class="inputBox">
            <el-input v-model="searchForm.PlanCode"></el-input>
          </div>
        </div>
        <div class="box">
          <span>供应商</span>
          <div class="inputBox">
            <el-input v-model="searchForm.Product"></el-input>
          </div>
        </div>
        <div class="box">
          <span>订单状态</span>
          <div class="inputBox">
            <el-select v-model="searchForm.Status">
              <el-option key="" label="全部" value=""></el-option>
              <el-option :key="0" label="待处理" :value="0"></el-option>
              <el-option :key="1" label="已下单" :value="1"></el-option>
              <el-option :key="2" label="发货中" :value="2"></el-option>
              <el-option :key="3" label="已发货" :value="3"></el-option>
              <el-option :key="4" label="已完成" :value="4"></el-option>
              <el-option :key="5" label="已完结" :value="5"></el-option>
            </el-select>
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
          <span>商品</span>
          <div class="inputBox">
            <el-input
              v-model="searchForm.productInfo"
              placeholder="编号/名称/条码"
            ></el-input>
          </div>
        </div>
        <div class="box">
          <span>下单类型</span>
          <div class="inputBox">
            <el-select v-model="searchForm.orderType" clearable filterable>
              <el-option
                v-for="item in orderTypeList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="operation">
        <i class="doubleDown"></i>
        <button
          class="search"
          v-show="permissionsList.Query"
          @click="eventSearch()"
        >
          查询
        </button>
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
        :summary-method="getSummaries"
        show-summary
        :row-class-name="funcRowClassName"
        :span-method="funcObjectSpanMethod1"
        :cell-style="funcColumnStyle"
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column
          prop="OrderCode"
          label="采购单编号"
          min-width="180"
          sortable="custom"
        >
          <template #default="scope">
            <span
              :class="{
                update:
                  permissionsList.Edit && scope.row.StatusName == '待处理',
              }"
              @click="eventOpenWindow(scope.row)"
              >{{ scope.row.OrderCode }}</span
            >
            <!-- <span v-show="false" class="update">
              {{ scope.row.OrderCode }}
            </span> -->
          </template>
        </el-table-column>
        <el-table-column prop="Title" label="订单标题" width="210">
        </el-table-column>
        <el-table-column
          prop="ShopName"
          label="门店名称"
          sortable="custom"
          width="230"
        ></el-table-column>
        <el-table-column
          prop="ProductName"
          label="商品名称"
          width="240"
          sortable="custom"
        >
        </el-table-column>
        <el-table-column prop="UnitName" label="单位" width="50">
        </el-table-column>
        <el-table-column
          prop="OrderNum"
          label="下单数量"
          align="right"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="PriceByTax"
          label="单价（含税）"
          align="right"
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop="TaxAmountMoney"
          label="金额（含税）"
          align="right"
          width="170"
        >
        </el-table-column>
        <el-table-column prop="TaxRate" label="税率" align="right" width="170">
          <template #default="scope">
            <!-- <span>{{(scope.row.TaxRate)*100+"%"}}</span> -->
            <span>{{ (scope.row.TaxRate * 100)?.toFixed(0) + '%' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="DepositRate"
          label="定金百分比"
          align="right"
          width="100"
        >
          <template #default="scope">
            <!-- <span>{{(scope.row.DepositRate)*100+"%"}}</span> -->
            <span>{{ (scope.row.DepositRate * 100)?.toFixed(2) + '%' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="SupplierName" label="供应商" width="180">
        </el-table-column>
        <el-table-column prop="Status" label="订单状态" width="100">
          <template #default="scope">
            <span v-if="scope.row.Status == 0" style="color: #e6a23c"
              >待处理</span
            >
            <span v-if="scope.row.Status == 1">已下单</span>
            <span v-if="scope.row.Status == 2">发货中</span>
            <span v-if="scope.row.Status == 3">已发货</span>
            <span v-if="scope.row.Status == 4">已完成</span>
            <span v-if="scope.row.Status == 5">已完结</span>
          </template>
        </el-table-column>
        <el-table-column prop="OrderTypeName" label="下单类型" width="100">
        </el-table-column>
        <el-table-column prop="Creater" label="创建人" width="180">
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
    <el-dialog :title="OpenWindowTitle" v-model="dialogVisible" width="1350px">
      <div class="dialogVisible">
        <div class="searchBox">
          <div class="conditions">
            <div class="box">
              <span>采购单编号</span>
              <div class="auto">
                <span>{{ addForm.Code }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="searchBox" style="flex-wrap: wrap">
          <div class="conditions" style="width: 100%; flex: none">
            <div class="box">
              <span><span class="requiredTip">*</span>订单标题</span>
              <div class="inputBox">
                <el-input v-model="addForm.Title" :maxlength="50"></el-input>
              </div>
            </div>
            <div class="box">
              <span><span class="requiredTip">*</span>订购日期</span>
              <div class="inputBox">
                <el-date-picker
                  v-model="addForm.OrderDate"
                  type="date"
                ></el-date-picker>
              </div>
            </div>
            <div class="box">
              <span><span class="requiredTip">*</span>紧急状态</span>
              <div class="inputBox">
                <el-select v-model="addForm.IsUrgent">
                  <el-option :key="0" label="普通" :value="0"></el-option>
                  <el-option :key="1" label="紧急" :value="1"></el-option>
                </el-select>
              </div>
            </div>
            <div class="box">
              <span><span class="requiredTip">*</span>定金百分比</span>
              <div class="inputBox" style="width: 100px">
                <el-input-number
                  v-model="addForm.DepositRate"
                  :min="0"
                  :max="100"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
                <span style="margin-left: 5px">%</span>
              </div>
            </div>
            <div class="box">
              <span>备注</span>
              <div class="inputBox remark">
                <el-input v-model="addForm.Remark" :maxlength="100"></el-input>
              </div>
            </div>
          </div>
          <!-- <div class="conditions">
						<div class="box" style="align-items: flex-start;">
							<span>备注描述</span>
							<div class="inputBox remark">
								<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addForm.Remark" :maxlength="100"></el-input>
							</div>
						</div>
					</div> -->
        </div>
        <div class="topBtnBox" style="border-bottom: none">
          <div class="titleBox">
            <div class="mark"></div>
            <span>商品信息</span>
          </div>
          <span class="flex"></span>
          <span>供应商：</span>
          <div class="regular" style="margin-right: 15px">
            <el-select
              v-model="addForm.SupplierCode"
              filterable
              :disabled="supplierIsdisabled"
            >
              <el-option
                :key="item.SupplierId"
                :label="item.SupplierName"
                :value="item.SupplierId"
                v-for="item in supplierList2"
              ></el-option>
            </el-select>
          </div>
          <button
            class="blue_plain"
            @click="eventOpenProductWindow"
            v-show="mode == 'edit'"
          >
            添加商品
          </button>
        </div>
        <div class="shop-search">
          <span>门店名称：</span>
          <div class="inputBox remark">
            <el-input v-model="dialogShopNameSearch"></el-input>
          </div>
          <!-- <button>查询</button> -->
        </div>

        <div class="middle haveBorderNoTop">
          <!-- addForm.PSI_Purchase_Order_Ms -->
          <el-table
            stripe
            ref="multipleTable"
            :data="tables"
            tooltip-effect="dark"
            height="300"
            style="width: 100%"
            :row-class-name="funcRowClassName"
            show-summary
            :summary-method="funcGetSummaries"
          >
            <el-table-column
              prop="ProductCode"
              label="商品编号"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="ProductName"
              label="商品名称"
              width="240"
              sortable
            >
            </el-table-column>
            <el-table-column prop="UnitName" label="单位" width="50">
            </el-table-column>
            <el-table-column
              prop="ApplyNum"
              label="申请数量"
              align="right"
              width="100"
            >
            </el-table-column>
            <el-table-column prop="OrderNum" label="下单数量" width="150">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.OrderNum"
                  @change="
                    eventChangeaddFormGroupNum($event, scope.$index, scope.row)
                  "
                  :precision="2"
                  :min="-999999999.99"
                  :max="999999999.99"
                  :controls="false"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column
              prop="ShopName"
              label="门店名称"
              width="240"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="PriceByExcludingTax"
              label="单价（不含税）"
              align="right"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="TaxRate"
              label="税率"
              align="right"
              width="170"
            >
              <template #default="scope">
                <span>{{ (scope.row.TaxRate * 100)?.toFixed(0) + '%' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="PriceByTax"
              label="单价（含税）"
              align="right"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="ExcludingTaxAmountMoney"
              label="下单金额（不含税）"
              align="right"
              width="170"
            >
              <template #default="scope">
                <span>{{ scope.row.ExcludingTaxAmountMoney?.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="TaxAmountMoney"
              label="下单金额（含税）"
              align="right"
              width="170"
            >
              <template #default="scope">
                <span>{{ scope.row.TaxAmountMoney?.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="DeliveryDate"
              label="预计到货日期"
              width="170"
            >
              <template #default="scope">
                <el-date-picker
                  v-model="scope.row.DeliveryDate"
                  type="date"
                  :clearable="false"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="280">
              <template #default="scope">
                <div class="tableButtonBox">
                  <i
                    class="delete"
                    @click="eventDeleteDetails(scope.$index, scope.row)"
                  ></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footerTip footerText">
          <!-- <p>最后修改人：{{ username }}<b>|</b>最后修改时间：{{ addDate }}</p> -->
          <div>
            <span>创建人：{{ addForm.Creater }}</span
            >&emsp;
            <span>创建时间：{{ addForm.CreateTime }}</span>
          </div>
          <!-- <div>
            <span>审核人：</span>
            <span>审核时间：</span>
          </div> -->
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button
            type="primary"
            @click="eventSaveWindow"
            v-show="mode == 'edit'"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 增加商品弹窗 -->
    <el-dialog title="选择商品" v-model="dialogVisibleProduct" width="1350px">
      <div class="shopTip">
        <i class="el-icon-warning-outline"></i>
        <span
          >仅可添加已有采购计划的商品，所选商品必须为同一个供应商的商品</span
        >
      </div>
      <div class="dialogVisible dialogVisibleSearch">
        <div class="searchBox">
          <div class="conditions">
            <div class="box">
              <span>采购计划编号</span>
              <div class="inputBox">
                <el-input v-model="productSearchForm.code"></el-input>
              </div>
            </div>
            <div class="box">
              <!-- 门店选择开放 :disabled="supplierIsdisabled"-->
              <span>门店名称</span>
              <div class="inputBox">
                <el-select v-model="productShopInfo" filterable clearable>
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
              <span>商品</span>
              <div class="inputBox">
                <el-input
                  v-model="productSearchForm.productInfo"
                  placeholder="编号/名称/条形码"
                ></el-input>
              </div>
            </div>
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
          </div>

          <div class="operation">
            <!-- <i class="doubleDown"></i> -->
            <button class="search" @click="eventProductSearch">查询</button>
            <button class="reset" @click="eventProductReset">重置</button>
          </div>
        </div>

        <div class="middle haveBorder">
          <el-table
            stripe
            ref="multipleTable"
            :data="productTableData"
            tooltip-effect="dark"
            height="400"
            style="width: 100%"
            :row-class-name="funcRowClassName"
            @selection-change="eventProductTableSelect"
          >
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column
              prop="PlanCode"
              label="采购计划编号"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="ProductCode"
              label="商品编号"
              width="120"
            ></el-table-column>
            <el-table-column prop="ProductName" label="商品名称" width="240">
            </el-table-column>
            <el-table-column prop="CategoryName" label="商品类别" width="100">
            </el-table-column>
            <el-table-column
              prop="SetNum"
              label="下单单位数量"
              align="right"
              width="120"
            >
            </el-table-column>
            <el-table-column prop="UnitName" label="单位" width="50">
            </el-table-column>
            <el-table-column
              prop="StockNum"
              label="在库库存"
              align="right"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="PlanDeliveryDate"
              label="预计到货日期"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="ShopName"
              label="门店名称"
              width="230"
            ></el-table-column>
            <el-table-column
              prop="SupplierName"
              label="供应商"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="Remark"
              label="备注"
              width="280"
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

    <!-- 导入弹窗 -->
    <el-dialog
      v-model="isImportDialog"
      title="采购订单导入"
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
          <div v-for="(file, index) in fileList" class="file-item" :key="index">
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

    <!-- 删除操作提示框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="提示"
      width="30%"
      style="height: 200px !important"
    >
      <span>删除数据后不可恢复，请确认是否要删除</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmDelete">确定删除</el-button>
        </span>
      </template>
    </el-dialog>

    <!--  调拨下单弹窗 -->
    <el-dialog
      v-model="dispatchDislogVisible"
      title="调拨下单"
      width="800px"
      @close="onDispatchClose"
    >
      <div>
        <!-- 表单栏 -->
        <el-form
          :model="dispatchForm"
          :rules="dispatchRules"
          ref="dispatchForm"
        >
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item label="调出门店" prop="shopInfo">
                <el-select
                  v-model="dispatchForm.shopInfo"
                  placeholder="请选择"
                  clearable
                  filterable
                >
                  <el-option
                    :label="item.Name"
                    :value="item.Code"
                    v-for="item in dispatchShopList"
                    :key="item.Code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调出仓库" prop="whCode">
                <el-select
                  v-model="dispatchForm.whCode"
                  :disabled="!dispatchForm.shopInfo"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in whList"
                    :key="item.Code"
                    :label="item.Name"
                    :value="item.Code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!--列表数据-->
        <div>
          <h3>库存信息</h3>
          <el-table :data="dispatchData">
            <el-table-column
              label="商品编号"
              prop="ProductCode"
            ></el-table-column>
            <el-table-column
              label="商品名称"
              prop="ProductName"
            ></el-table-column>
            <el-table-column
              label="在库数量"
              prop="AllStockNum"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 功能按钮 -->
      <template #footer>
        <div class="sr-flex sr-row-center sr-col-center">
          <el-button type="primary" size="small" @click="onDispatchSubmit"
            >下单</el-button
          >
          <el-button size="small" @click="dispatchDislogVisible = false"
            >取消</el-button
          >
        </div>
      </template>
    </el-dialog>

    <div class="wx-tips">
      <!-- 温馨提示弹窗 -->
      <el-dialog v-model="tipDialogShow" :width="400" @close="onTipDialogClose">
        <div class="dialog-body">
          <div class="title">
            <img src="../../../assets/img/purchase/notice.png" />
            <div class="text">温馨提示</div>
          </div>
          <div class="content">
            <p>
              您添加的采购商品中存在单价为<span class="red-font"> 0 </span
              >、金额为<span class="red-font"> 0 </span
              >的商品，请确认商品单价设置是否有误。如果有误，请重新设置正确，再创建订单。
            </p>
            <p>
              <span class="red-font">商品一旦下单成功，订单无法修改</span
              >，请确认清楚再 进行下单！
            </p>
          </div>
          <div
            :class="['btn', { 'btn-disable': countDown > 0 }]"
            @click="onSavePurchase"
          >
            我已知晓，确认下单<span v-if="countDown > 0"
              >({{ countDown }}s)</span
            >
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script src="./vmModule.js"></script>

<style scoped lang="scss">
  .el-dialog__header {
    padding: 0;
  }
  .all .searchBox > .conditions > .box > .inputBox.remark {
    width: 600px;
  }
  @media screen and (max-width: 1439px) and (min-width: 1px) {
    .all .searchBox > .conditions > .box > .inputBox.remark {
      width: 490px;
    }
  }
  .footerText {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .shopTip {
    position: relative;
    display: flex;
    align-items: center;
    padding: 3px 10px;
    margin-left: 15px;
    background-color: #fdf3d1;
    color: #e48f16;
    border-radius: 4px;
    font-size: 13px;
    width: fit-content;
    margin-bottom: 15px;
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
  .shop-search {
    margin-top: -10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    input {
      width: 200px;
      margin-left: 10px;
    }
    button {
      display: flex;
      line-height: 1px;
      align-items: center;
      padding: 0 12px;
      height: 28px;
      border-radius: 4px;
      background-color: #579ff6;
      color: #fff;
      border: none;
      cursor: pointer;
      outline: none;
      margin-left: 10px;
    }
  }
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
      border: 1px solid #d9dbdd;
      margin-top: 17px;
      margin-bottom: 20px;
      padding: 15px;
      p {
        font-size: 14px;
        font-family: Microsoft YaHei;
        color: #2d323c;
      }
      .red-font {
        color: #ff5353;
        font-weight: bold;
      }
      p:not(:last-child) {
        margin-bottom: 24px;
      }
    }
    .btn {
      background: #579ff6;
      border-radius: 4px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ffffff;
      padding: 10px 30px;
      cursor: pointer;
      user-select: none;
      margin-bottom: 16px;
    }
    .btn-disable {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
</style>
