<template>
  <div class="all">
    <div class="topBtnBox">
      <button
        v-show="permissionsList.OrderTermination"
        class="blue"
        @click="eventDetele(4)"
      >
        <i class="OrderTerminate"></i>订单终止
      </button>
      <button
        v-show="permissionsList.TerminationRevocation"
        class="blue"
        @click="eventDetele(1)"
      >
        <i class="TerminationCancellation"></i>订单撤销
      </button>
      <span class="flex"></span>
      <button v-show="permissionsList.Export" @click="eventExport" class="grey">
        <i class="export"></i>导出
      </button>
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
            <el-input v-model="searchForm.Code"></el-input>
          </div>
        </div>
        <div class="box">
          <span>供应商</span>
          <div class="inputBox">
            <el-input v-model="searchForm.supplierInfo"></el-input>
          </div>
        </div>
        <div class="box">
          <span>订单状态</span>
          <div class="inputBox">
            <el-select v-model="searchForm.Status">
              <el-option :key="''" label="全部" :value="''"></el-option>
              <el-option :key="'0'" label="待处理" :value="'0'"></el-option>
              <el-option :key="'1'" label="已下单" :value="'1'"></el-option>
              <el-option :key="'2'" label="发货中" :value="'2'"></el-option>
              <el-option :key="'3'" label="已发货" :value="'3'"></el-option>
              <el-option :key="'4'" label="已完成" :value="'4'"></el-option>
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
          prop="Code"
          label="采购单编号"
          width="190"
        ></el-table-column>
        <el-table-column prop="Title" label="订单标题" width="190">
        </el-table-column>
        <el-table-column prop="ProductName" label="商品名称" width="240">
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
        <el-table-column prop="ShopName" label="门店名称" width="210">
        </el-table-column>
        <el-table-column prop="SupplierName" label="供应商" width="170">
        </el-table-column>
        <el-table-column prop="Status" label="订单状态" width="80">
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
        <el-table-column prop="Creater" label="创建人" width="170">
        </el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" width="170">
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
