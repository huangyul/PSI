<!-- 景品销售一览 -->
<template>
  <div class="all">
    <div class="topBtnBox" v-show="permissionsList.Export">
      <span class="flex"></span>
      <button class="grey" @click="eventExport">
        <i class="export"></i>导出
      </button>
    </div>
    <div class="searchBox">
      <div class="conditions">
        <div class="box">
          <span>日期</span>
          <div class="inputBox">
            <RangeDate
              v-model:props-start="searchForm.startTime"
              v-model:props-end="searchForm.endTime"
            ></RangeDate>
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
          <span>机器</span>
          <div class="inputBox">
            <el-input
              v-model="searchForm.deviceCode"
              placeholder="编号/名称/固定资产"
            ></el-input>
          </div>
        </div>
        <div class="box">
          <span>机头编号</span>
          <div class="inputBox">
            <el-select v-model="searchForm.warehouseCode">
              <el-option label="A" value="A"></el-option>
              <el-option label="B" value="B"></el-option>
              <el-option label="C" value="C"></el-option>
              <el-option label="D" value="D"></el-option>
              <el-option label="E" value="E"></el-option>
              <el-option label="F" value="F"></el-option>
            </el-select>
          </div>
        </div>

        <div class="box">
          <span>商品</span>
          <div class="inputBox">
            <el-input
              v-model="searchForm.productCode"
              placeholder="编号/名称/条码"
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
        :row-class-name="funcRowClassName"
      >
        <el-table-column
          prop="SaleDate"
          label="日期"
          width="130"
        ></el-table-column>
        <el-table-column
          prop="ShopName"
          label="门店名称"
          width="230"
        ></el-table-column>
        <el-table-column
          prop="DeviceName"
          label="机器名称"
          width="210"
        ></el-table-column>

        <el-table-column prop="AssetNum" label="固定资产编号" width="180">
        </el-table-column>
        <el-table-column prop="NoseNum" label="机头编号" width="180">
        </el-table-column>

        <el-table-column
          prop="ProductName"
          label="商品名称"
          width="240"
        ></el-table-column>
        <el-table-column prop="SaleType" label="业务类型" width="170">
        </el-table-column>
        <el-table-column prop="UnitName" label="单位" width="50">
        </el-table-column>
        <el-table-column
          prop="Num"
          label="数量"
          align="right"
          width="80"
        ></el-table-column>
        <el-table-column prop="Amount" label="金额" align="right" width="170">
        </el-table-column>

        <el-table-column prop="Remark" label="备注" width="260">
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
