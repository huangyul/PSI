<!--出库一览-->
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
          <span>商品品类</span>
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
          <span>门店名称</span>
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
          <span>出库仓库</span>
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
          <span>出库仓位</span>
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
          <span>出库日期</span>
          <div class="inputBox">
            <RangeDate
              v-model:props-start="searchForm.startTime"
              v-model:props-end="searchForm.endTime"
            ></RangeDate>
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
          <span>出库类型</span>
          <div class="inputBox">
            <el-select
              v-model="searchForm.searchCondition.checkoutType"
              clearable
            >
              <el-option label="景品出库" :value="0"></el-option>
              <el-option label="景品回库" :value="9"></el-option>
              <el-option label="消耗" :value="1"></el-option>
              <el-option label="调拨(外部调拨)" :value="20"></el-option>
              <el-option label="报废" :value="4"></el-option>
              <el-option label="盘库" :value="5"></el-option>
              <el-option label="退货" :value="8"></el-option>
              <el-option label="店内转仓" :value="21"></el-option>
              <el-option label="日常销售" :value="10"></el-option>
              <el-option label="礼品兑换" :value="11"></el-option>
              <el-option label="活动赠送" :value="12"></el-option>
              <el-option label="AEMS出库" :value="30"></el-option>
              <el-option label="退库" :value="7"></el-option>
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>用途或去向</span>
          <div class="inputBox">
            <el-input v-model="searchForm.searchCondition.useWay"></el-input>
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
        <el-table-column
          prop="CheckoutCode"
          label="单号"
          min-width="180"
        ></el-table-column>
        <el-table-column prop="OutDate" label="出库日期" width="100">
        </el-table-column>
        <el-table-column prop="ShopName" label="门店名称" width="230">
        </el-table-column>
        <el-table-column prop="WarehouseName" label="出库仓库" width="260">
        </el-table-column>
        <el-table-column
          prop="PositionName"
          label="出库仓位"
          v-if="isShowPosition == '1'"
        >
        </el-table-column>
        <el-table-column prop="ProductCode" label="物品编号" width="170">
        </el-table-column>
        <el-table-column prop="ProductName" label="物品名称" width="230">
        </el-table-column>
        <el-table-column
          prop="OutNum"
          label="出库数量"
          align="right"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="Price"
          label="单价（不含税）"
          align="right"
          min-width="170"
        >
        </el-table-column>
        <el-table-column
          prop="Money"
          label="金额（不含税）"
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
        <el-table-column
          prop="TaxRate"
          label="税率"
          align="right"
          min-width="170"
        >
          <template #default="scope">
            <span>{{ (scope.row.TaxRate * 100)?.toFixed(0) + '%' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="MoneyByTax"
          label="金额（含税）"
          align="right"
          min-width="170"
        >
        </el-table-column>
        <el-table-column prop="UnitName" label="单位" min-width="50">
        </el-table-column>
        <el-table-column prop="CheckoutType" label="出库类型">
          <template #default="scope">
            <span v-if="scope.row.CheckoutType == 0">景品出库</span>
            <span v-if="scope.row.CheckoutType == 9">景品回库</span>
            <span v-if="scope.row.CheckoutType == 1">消耗</span>
            <span v-if="scope.row.CheckoutType == 20">调拨(外部调拨)</span>
            <span v-if="scope.row.CheckoutType == 4">报废</span>
            <span v-if="scope.row.CheckoutType == 5">盘库</span>
            <span v-if="scope.row.CheckoutType == 8">退货</span>
            <span v-if="scope.row.CheckoutType == 21">店内转仓</span>
            <span v-if="scope.row.CheckoutType == 10">日常销售</span>
            <span v-if="scope.row.CheckoutType == 11">礼品兑换</span>
            <span v-if="scope.row.CheckoutType == 12">活动赠送</span>
            <span v-if="scope.row.CheckoutType == 30">AEMS出库</span>
            <span v-if="scope.row.CheckoutType == 7">退库</span>
          </template>
        </el-table-column>
        <el-table-column prop="UseWay" label="用途或去向" min-width="120">
        </el-table-column>
        <el-table-column prop="AssetNo" label="资产编号" width="180">
        </el-table-column>
        <el-table-column prop="NoseNum" label="机头号" min-width="120">
        </el-table-column>
        <el-table-column prop="Modifier" label="操作员" min-width="230">
        </el-table-column>
        <el-table-column prop="Remark" label="备注" min-width="280">
        </el-table-column>
        <el-table-column prop="Creater" label="创建人" min-width="230">
        </el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" min-width="180">
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="eventPageSizeChange"
        @current-change="eventPageChange"
        :current-page="searchForm.page"
        :page-sizes="[10, 15, 20, 100]"
        :page-size="searchForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="searchForm.total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script src="./vmModule.js"></script>
<style scoped></style>
<style>
  /* .el-table .cell{white-space: nowrap;text-overflow: clip;} */
</style>
