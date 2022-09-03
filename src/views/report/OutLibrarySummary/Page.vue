<template>
  <div class="all">
    <div class="topBtnBox" v-show="permissionsList.Export">
      <span class="flex"></span>
      <button @click="eventExport" class="grey">
        <i class="export"></i>导出
      </button>
    </div>
    <div class="searchBox">
      <div class="conditions">
        <div class="box">
          <span>品类</span>
          <div class="inputBox">
            <el-cascader
              :options="CategoryTree"
              :props="cascaderProps"
              v-model="cascaderValue"
              collapse-tags
              ref="elCascader"
              clearable
              @change="onCascaderChange"
            ></el-cascader>
          </div>
        </div>
        <div class="box">
          <span>出库时间</span>
          <div class="inputBox">
            <RangeDate
              v-model:props-start="searchForm.startTime"
              v-model:props-end="searchForm.endTime"
            ></RangeDate>
          </div>
        </div>
        <div class="box">
          <span>供应商</span>
          <div class="inputBox">
            <el-input v-model="searchForm.supplier"></el-input>
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
          <span>出库仓库</span>
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
          <span>出库仓位</span>
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
          <span>出库类型</span>
          <div class="inputBox">
            <el-select v-model="searchForm.checkOutType" clearable>
              <!-- <el-option key="0" label="销售" value="0" ></el-option> -->
              <el-option key="0" label="景品出库" :value="0"></el-option>
              <el-option key="1" label="消耗" :value="1"></el-option>
              <el-option key="4" label="报废" :value="4"></el-option>
              <el-option key="9" label="景品回库" :value="9"></el-option>
              <!-- <el-option key="2" label="调拨" :value="2" ></el-option> -->
              <!-- <el-option key="3" label="损耗" value="3" ></el-option> -->
              <!-- <el-option key="5" label="盘库" :value="5" ></el-option>
							<el-option key="8" label="退货" :value="8" ></el-option>
							<el-option key="8" label="AEMS出库" :value="30" ></el-option>
							<el-option key="7" label="退库" :value="7" ></el-option> -->
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>商品</span>
          <div class="inputBox">
            <el-input
              v-model="searchForm.product"
              placeholder="名称/编号/条形码"
            ></el-input>
          </div>
        </div>
        <div class="box">
          <span>单据编号</span>
          <div class="inputBox">
            <el-input v-model="searchForm.code"></el-input>
          </div>
        </div>
        <div class="box">
          <span>汇总类型</span>
          <div class="inputBox">
            <el-select v-model="searchForm.reportType" filterable>
              <el-option :key="1" label="不汇总" :value="1"></el-option>
              <el-option :key="2" label="店铺汇总" :value="2"></el-option>
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
        show-summary
        :summary-method="funcGetSummaries"
        height="100%"
      >
        <el-table-column prop="CheckoutCode" label="出库单号" min-width="180">
        </el-table-column>
        <el-table-column prop="CheckoutType" label="出库类型" width="100">
          <template #default="scope">
            <!-- <span v-if="scope.row.CheckoutType == '0'">销售</span> -->
            <span v-if="scope.row.CheckoutType == '0'">景品出库</span>
            <span v-if="scope.row.CheckoutType == '1'">消耗</span>
            <span v-if="scope.row.CheckoutType == '2'">调拨</span>
            <span v-if="scope.row.CheckoutType == '3'">损耗</span>
            <span v-if="scope.row.CheckoutType == '4'">报废</span>
            <span v-if="scope.row.CheckoutType == '5'">盘库</span>
            <span v-if="scope.row.CheckoutType == '8'">退货</span>
            <span v-if="scope.row.CheckoutType == '30'">AEMS出库</span>
            <span v-if="scope.row.CheckoutType == '7'">退库</span>
            <span v-if="scope.row.CheckoutType == '9'">景品回库</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="ShopName"
          label="门店名称"
          width="230"
        ></el-table-column>
        <el-table-column
          prop="MatTypeNameAll"
          label="品类"
          width="104"
        ></el-table-column>
        <el-table-column
          prop="MatTypeNameB"
          label="大类"
          width="146"
        ></el-table-column>
        <el-table-column
          prop="MatTypeNameM"
          label="中类"
          width="146"
        ></el-table-column>
        <el-table-column
          prop="MatTypeName"
          label="小类"
          width="146"
        ></el-table-column>
        <el-table-column
          prop="ProductName"
          label="商品名称"
          width="240"
        ></el-table-column>
        <el-table-column prop="UnitName" label="单位" width="80">
        </el-table-column>
        <el-table-column
          prop="Price"
          label="单价（不含税）"
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
        </el-table-column>
        <el-table-column
          prop="PriceByTax"
          label="单价（含税）"
          align="right"
          min-width="170"
        >
        </el-table-column>
        <el-table-column prop="OutNum" label="出库数量" align="right">
        </el-table-column>
        <el-table-column
          prop="Amount"
          label="出库金额"
          align="right"
          min-width="170"
        ></el-table-column>
        <el-table-column
          prop="AmountByTax"
          label="出库金额（含税）"
          align="right"
          min-width="170"
        >
        </el-table-column>
        <el-table-column prop="UseWay" label="用途" min-width="170">
        </el-table-column>
        <el-table-column prop="SupplierName" label="供应商" width="170">
        </el-table-column>
        <el-table-column prop="WarehouseName" label="出库仓库" width="260">
        </el-table-column>
        <el-table-column
          prop="PositionName"
          label="出库仓位"
          v-if="isShowPosition == '1'"
        >
        </el-table-column>
        <el-table-column prop="OutDate" label="出库时间" width="160">
        </el-table-column>
        <el-table-column prop="Creater" label="操作员" width="210">
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
  </div>
</template>

<script src="./vmModule.js"></script>

<style scoped></style>
