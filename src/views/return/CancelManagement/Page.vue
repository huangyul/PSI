<template>
  <div class="all">
    <div class="topBtnBox">
      <button
        v-show="permissionsList.Add"
        class="green"
        @click="eventOpenWindow()"
      >
        <i class="el-icon-plus"></i>新增退库申请
      </button>
      <button
        v-show="permissionsList.Print"
        class="blue"
        @click="eventPrintList()"
      >
        <i class="print"></i>打印退库单
      </button>
      <button
        v-show="permissionsList.Submission"
        class="blue"
        @click="eventOperation(1)"
      >
        <i class="submit"></i>提交
      </button>
      <!-- <button v-show="permissionsList.Delete" class="blue" @click="eventOperation(4)"><i class="delete"></i>删除</button> -->
      <el-popconfirm
        confirm-button-text="确认"
        cancel-button-text="取消"
        icon="el-icon-question"
        icon-color="#409EFF"
        title="确认删除吗？"
        @confirm="eventOperation(4)"
      >
        <template #reference>
          <button class="blue" v-show="permissionsList.Delete">
            <i class="delete"></i>删除
          </button>
        </template>
      </el-popconfirm>
      <button
        v-show="permissionsList.ToExamine"
        class="blue"
        @click="eventOperation(2)"
      >
        <i class="approved"></i>审核通过
      </button>
      <button
        v-show="permissionsList.ToExamine"
        class="blue"
        @click="eventOperation(3)"
      >
        <i class="reject"></i>拒绝
      </button>
      <span class="flex"></span>
      <!-- <button @click="eventExport" class="grey" v-show="permissionsList.Export"><i class="export"></i>导出</button> -->
    </div>
    <div class="searchBox">
      <div class="conditions">
        <div class="box">
          <span>申请日期</span>
          <div class="inputBox">
            <RangeDate
              v-model:props-start="searchForm.startTime"
              v-model:props-end="searchForm.endTime"
            ></RangeDate>
          </div>
        </div>
        <div class="box">
          <span>退库单号</span>
          <div class="inputBox">
            <el-input v-model="searchForm.cancelStockCode"></el-input>
          </div>
        </div>
        <div class="box">
          <span>商品</span>
          <div class="inputBox">
            <el-input
              v-model="searchForm.productName"
              placeholder="名称/编号/条形码"
            ></el-input>
          </div>
        </div>
        <div class="box">
          <span>申请门店</span>
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
          <span>退入门店</span>
          <div class="inputBox">
            <el-select v-model="searchForm.inShopInfo" clearable filterable>
              <el-option
                :label="item.Name"
                :value="item.Code"
                v-for="item in shopListAll"
                :key="item.Code"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>退出仓库</span>
          <div class="inputBox">
            <el-select v-model="searchForm.warehouseCode" filterable>
              <el-option
                :key="item.Code"
                :label="item.Name"
                :value="item.Code"
                v-for="item in warehouseList"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="box" v-show="isShowPosition == '1'">
          <span>退出仓位</span>
          <div class="inputBox">
            <el-select v-model="searchForm.positionCode" filterable>
              <el-option
                :key="item.Code"
                :label="item.Name"
                :value="item.Code"
                v-for="item in positionList"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>退库状态</span>
          <div class="inputBox">
            <el-select v-model="searchForm.status">
              <el-option :key="-1" label="全部" :value="-1"></el-option>
              <el-option :key="0" label="未提交" :value="0"></el-option>
              <el-option :key="1" label="待审批" :value="1"></el-option>
              <el-option :key="4" label="未通过" :value="4"></el-option>
              <el-option :key="5" label="已审批" :value="5"></el-option>
              <el-option :key="6" label="已入库" :value="6"></el-option>
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
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column label="退库单号" min-width="180">
          <template #default="scope">
            <div
              v-show="permissionsList.Edit && [0, 4].includes(scope.row.Status)"
              class="update"
              @click="onEdit(scope.row)"
            >
              {{ scope.row.CancelStockCode }}
            </div>
            <div
              v-show="
                !permissionsList.Edit ||
                (permissionsList.Edit && ![0, 4].includes(scope.row.Status))
              "
            >
              {{ scope.row.CancelStockCode }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="CheckinCode" label="调拨单号" min-width="180">
        </el-table-column>
        <el-table-column prop="ShopName" label="申请门店" width="230">
        </el-table-column>
        <el-table-column prop="WarehouseName" label="退出仓库" width="260">
        </el-table-column>
        <el-table-column
          prop="PositionName"
          label="退出仓位"
          v-if="isShowPosition == '1'"
        >
        </el-table-column>
        <el-table-column prop="InShopName" label="退入门店" width="230">
        </el-table-column>
        <el-table-column prop="ProductName" label="商品名称" width="240">
        </el-table-column>
        <el-table-column prop="AssetNum" label="资产编号" width="80">
        </el-table-column>
        <el-table-column prop="UnitName" label="单位" width="50">
        </el-table-column>
        <el-table-column
          prop="TransferNum"
          label="调拨数量"
          align="right"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="CancelNum"
          label="退库数量"
          align="right"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="PriceByTax"
          label="单价(含税)"
          align="right"
          min-width="170"
        >
        </el-table-column>
        <el-table-column
          prop="TaxRate"
          label="税率"
          align="right"
          min-width="170"
        >
          <template #default="scope">
            {{ (scope.row.TaxRate * 100)?.toFixed(0) + '%' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="CancelAmount"
          label="退库金额（含税）"
          align="right"
          min-width="170"
        >
        </el-table-column>
        <el-table-column prop="StatusName" label="退库状态" width="80">
        </el-table-column>
        <el-table-column prop="Remark" label="备注" width="280">
        </el-table-column>
        <el-table-column
          prop="Creater"
          label="创建人"
          width="170"
        ></el-table-column>
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
    <el-dialog :title="OpenWindowTitle" v-model="dialogVisible" width="1300px">
      <div class="dialogVisible">
        <div class="searchBox">
          <div class="conditions">
            <div class="box">
              <span>退库单号：</span>
              <div class="auto">
                <span>{{ addForm.Code }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="topBtnBox" style="border-top: none; padding-top: 0">
          <div class="titleBox">
            <div class="mark"></div>
            <span>商品信息</span>
          </div>
          <div class="shopTip">
            <i class="el-icon-warning-outline"></i>
            <span>所选商品必须为同一个申请门店和退入门店的商品</span>
          </div>
          <span class="flex"></span>
          <span>申请门店：</span>
          <div class="regular" style="margin-right: 15px">
            <el-select
              v-model="productSearchForm.shopInfo"
              filterable
              :disabled="supplierIsdisabled || addForm.Details.length > 0"
            >
              <el-option
                :label="item.Name"
                :value="item.Code"
                v-for="item in shopList"
                :key="item.Code"
              ></el-option>
            </el-select>
          </div>
          <span>退入门店：</span>
          <div class="regular" style="margin-right: 15px">
            <el-select
              v-model="productSearchForm.inShopInfo"
              filterable
              :disabled="supplierIsdisabled || addForm.Details.length > 0"
            >
              <el-option
                :label="item.Name"
                :value="item.Code"
                v-for="item in shopListAll"
                :key="item.Code"
              ></el-option>
            </el-select>
          </div>
          <button class="blue_plain" @click="eventOpenProductWindow">
            添加商品
          </button>
        </div>

        <div class="middle haveBorderNoTop">
          <el-table
            stripe
            ref="multipleTable"
            :data="addForm.Details"
            tooltip-effect="dark"
            height="450"
            style="width: 100%"
            :row-class-name="funcRowClassName"
          >
            <el-table-column
              prop="CheckinCode"
              label="入库单号"
              min-width="180"
            ></el-table-column>
            <el-table-column
              prop="CheckoutCode"
              label="调拨单号"
              min-width="180"
            >
            </el-table-column>
            <el-table-column
              prop="ProductName"
              label="商品名称"
              min-width="240"
            >
            </el-table-column>
            <el-table-column prop="AssetNum" label="资产编号" width="80">
            </el-table-column>
            <el-table-column
              prop="InNum"
              label="在库数量"
              align="right"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="TransferNum"
              label="调拨数量"
              align="right"
              width="80"
            >
            </el-table-column>
            <el-table-column prop="CancelNum" label="退库数量" width="120">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.CancelNum"
                  @input="
                    eventChangeaddFormGroupNum($event, scope.$index, scope.row)
                  "
                  :min="0"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="Remark" label="备注" width="230">
              <template #default="scope">
                <el-input v-model="scope.row.Remark"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="PriceByTax"
              label="单价(含税)"
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
                {{ (scope.row.TaxRate * 100)?.toFixed(0) + '%' }}
              </template>
            </el-table-column>
            <el-table-column prop="UnitName" label="单位"></el-table-column>
            <el-table-column
              prop="WarehouseName"
              label="退库仓库"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="PositionName"
              label="退库仓位"
              v-if="isShowPosition == '1'"
            ></el-table-column>
            <el-table-column label="操作" width="100">
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
        <div class="footerTip">
          <p>最后修改人：{{ username }}<b>|</b>最后修改时间：{{ addDate }}</p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-checkbox
            v-show="permissionsList.Print"
            class="isPrint"
            v-model="isPrint"
            style="margin-right: 35px"
            >打印退库单</el-checkbox
          >
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="eventSaveWindow">保存</el-button>
          <!-- <el-button type="primary" @click="eventPrintTemplate">退库单打印模板设计</el-button>
					<el-button type="primary" @click="eventPrint(1)">退库单打印预览</el-button>
					<el-button type="primary" @click="eventPrint(2)">退库单打印</el-button> -->
        </span>
      </template>
    </el-dialog>

    <!-- 增加商品弹窗 -->
    <el-dialog title="选择商品" v-model="dialogVisibleProduct" width="1300px">
      <div class="dialogVisible dialogVisibleSearch">
        <div class="searchBox">
          <div class="conditions">
            <div class="box">
              <span>品类</span>
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
              <span>入库单号</span>
              <div class="inputBox">
                <el-input v-model="productSearchForm.checkinCode"></el-input>
              </div>
            </div>
            <div class="box">
              <span>调拨单号</span>
              <div class="inputBox">
                <el-input v-model="productSearchForm.checkoutCode"></el-input>
              </div>
            </div>
            <div class="box">
              <span>商品</span>
              <div class="inputBox">
                <el-input
                  v-model="productSearchForm.productName"
                  placeholder="编号/名称/条形码"
                ></el-input>
              </div>
            </div>
            <div class="box">
              <span>资产编号</span>
              <div class="inputBox">
                <el-input v-model="productSearchForm.assetNum"></el-input>
              </div>
            </div>
            <div class="box">
              <span>资产状态</span>
              <div class="inputBox">
                <el-select v-model="productSearchForm.assetStatus">
                  <el-option :key="-1" label="全部" :value="-1"></el-option>
                  <el-option :key="1" label="自社资产" :value="1"></el-option>
                  <el-option :key="2" label="租赁资产" :value="2"></el-option>
                  <el-option :key="3" label="合作资产" :value="3"></el-option>
                  <el-option :key="4" label="测试资产" :value="4"></el-option>
                </el-select>
              </div>
            </div>
            <div class="box">
              <span>入库日期</span>
              <div class="inputBox">
                <RangeDate
                  v-model:props-start="productSearchForm.startTime"
                  v-model:props-end="productSearchForm.endTime"
                ></RangeDate>
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
              prop="CheckinCode"
              label="入库单号"
              min-width="180"
            ></el-table-column>
            <el-table-column
              prop="CheckoutCode"
              label="调拨单号"
              min-width="180"
            ></el-table-column>
            <el-table-column prop="ShopName" label="调出门店" min-width="230">
            </el-table-column>
            <el-table-column
              prop="ProductName"
              label="商品名称"
              min-width="240"
            >
            </el-table-column>
            <el-table-column prop="AssetNum" label="资产编号" width="120">
            </el-table-column>
            <el-table-column prop="TransferNum" label="调拨数量" align="right">
            </el-table-column>
            <el-table-column prop="StockNum" label="在库数量" align="right">
            </el-table-column>
            <el-table-column prop="UnitName" label="单位"></el-table-column>
            <el-table-column
              prop="PriceByTax"
              label="单价（含税）"
              width="170"
              align="right"
            ></el-table-column>
            <el-table-column prop="TaxRate" label="税率" align="right">
              <template #default="scope">
                {{ (scope.row.TaxRate * 100)?.toFixed(0) + '%' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="StrInDate"
              label="入库时间"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="WarehouseName"
              label="入库仓库"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="PositionName "
              label="入库仓位"
              v-if="isShowPosition == '1'"
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
  </div>
</template>

<script src="./vmModule.js"></script>

<style scoped></style>
