<template>
  <div class="all">
    <!-- <div class="topBtnBox" v-show="permissionsList.Export">
			<span class="flex"></span>
			<button class="grey"><i class="export"></i>导出</button>
		</div>
		<div class="topBtnBox" v-show="isSupplier">
			<span class="flex"></span>
			<button class="grey"><i class="export"></i>导出</button>
		</div> -->
    <div class="searchBox">
      <div class="conditions">
        <div class="box">
          <span>下单日期</span>
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
            <el-input v-model="searchForm.poCode"></el-input>
          </div>
        </div>
        <div class="box">
          <span>供应商</span>
          <div class="inputBox">
            <el-input v-model="searchForm.supllerInfo"></el-input>
          </div>
        </div>
        <div class="box">
          <span>发货状态</span>
          <div class="inputBox">
            <el-select v-model="searchForm.status">
              <el-option :key="-1" label="全部" :value="-1"></el-option>
              <el-option :key="0" label="待发货" :value="0"></el-option>
              <el-option :key="1" label="已发货" :value="1"></el-option>
              <el-option :key="2" label="部分发货" :value="2"></el-option>
            </el-select>
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
        show-summary
        :summary-method="funcGetSummaries"
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column
          prop="OrderCode"
          label="采购单编号"
          min-width="180"
        ></el-table-column>
        <el-table-column prop="ProductName" label="商品名称" min-width="240">
        </el-table-column>
        <el-table-column prop="UnitName" label="单位" min-width="50">
        </el-table-column>
        <el-table-column
          prop="Price"
          label="单价"
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
            <!-- <span>{{scope.row.TaxRate * 100 + "%"}}</span> -->
            <span>{{ (scope.row.TaxRate * 100)?.toFixed(2) + '%' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="PriceByTax"
          label="单价（含税）"
          align="right"
          min-width="170"
        >
        </el-table-column>
        <el-table-column
          prop="DepositRate"
          label="定金百分比"
          align="right"
          min-width="170"
        >
          <template #default="scope">
            <!-- <span>{{scope.row.DepositRate * 100 + "%"}}</span> -->
            <span>{{ (scope.row.DepositRate * 100)?.toFixed(2) + '%' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单信息" align="center">
          <el-table-column
            prop="OrderNum"
            label="下单数量"
            align="right"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="OrderAmount"
            label="下单金额"
            align="right"
            min-width="170"
          >
          </el-table-column>
          <el-table-column
            prop="OrderAmountByTax"
            label="下单金额（含税）"
            align="right"
            min-width="170"
          ></el-table-column>
        </el-table-column>
        <el-table-column label="发货信息" align="center">
          <el-table-column
            prop="SendNum"
            label="已发货数量"
            align="right"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="ReturnProductNum"
            label="退货数量"
            align="right"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="CheckinNum"
            label="入库数量"
            align="right"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            prop="CheckInAmount"
            label="应结金额"
            align="right"
            min-width="170"
          ></el-table-column>
          <el-table-column
            prop="CheckInByTax"
            label="应结金额（含税）"
            align="right"
            min-width="170"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="SupplierName"
          label="供应商"
          min-width="180"
        ></el-table-column>
        <el-table-column
          prop="OrderDate"
          label="下单日期"
          min-width="170"
        ></el-table-column>
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

<style scoped>
  .shopTip {
    display: flex;
    align-items: center;
    padding: 3px 10px;
    margin-left: 15px;
    background-color: #fdf3d1;
    color: #e48f16;
    border-radius: 4px;
  }

  .shopTip > i {
    margin-right: 5px;
    font-size: 18px;
  }
</style>
