<!-- 已入库查询 -->
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
          <span>门店名称</span>
          <div class="inputBox">
            <el-select v-model="searchForm.companyCode" filterable clearable>
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
          <span>入库仓库</span>
          <div class="inputBox">
            <el-select
              v-model="searchForm.warehouseCode"
              clearable
              :disabled="searchForm.companyCode == ''"
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
          <span>仓位</span>
          <div class="inputBox">
            <el-select
              v-model="searchForm.positionCode"
              clearable
              :disabled="searchForm.companyCode == ''"
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
          <span>入库日期</span>
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
              v-model="searchForm.productCode"
              placeholder="编码/名称/条码"
            ></el-input>
          </div>
        </div>
        <div class="box">
          <span>采购/调拨单号</span>
          <div class="inputBox">
            <el-input v-model="searchForm.oddNum"></el-input>
          </div>
        </div>
        <div class="box">
          <span>入库类型</span>
          <div class="inputBox">
            <el-select v-model="searchForm.purchaseType">
              <el-option label="全部" :value="''"></el-option>
              <el-option label="采购" :value="'0'"></el-option>
              <el-option label="调拨" :value="'20'"></el-option>
              <el-option label="盘库" :value="'5'"></el-option>
              <el-option label="库存调整" :value="'6'"></el-option>
              <el-option label="期初导入" :value="'Z'"></el-option>
              <el-option label="景品回库" :value="'9'"></el-option>
              <el-option label="店内转仓" :value="'21'"></el-option>
              <el-option label="退库" :value="'7'"></el-option>
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
          prop="OrderCode"
          label="采购/调拨单号"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="InDate"
          label="入库时间"
          :formatter="funcTimeformat"
          width="100"
        ></el-table-column>
        <el-table-column prop="Creater" label="入库操作员" width="210">
        </el-table-column>
        <el-table-column prop="ShopName" label="门店名称" width="210">
        </el-table-column>
        <el-table-column prop="WarehouseName" label="入货仓库" width="240">
        </el-table-column>
        <el-table-column
          prop="PositionName"
          label="仓位"
          v-if="isShowPosition == '1'"
        >
        </el-table-column>
        <el-table-column
          prop="ProductName"
          label="商品名称"
          width="240"
        ></el-table-column>
        <el-table-column prop="UnitName" label="单位" width="50">
        </el-table-column>
        <el-table-column
          prop="CheckinNum"
          label="入库数量"
          align="right"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="Price"
          label="单价(不含税)"
          align="right"
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop="Amount"
          label="总金额(不含税)"
          align="right"
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop="CheckinTypeName"
          label="入库类型"
          width="120"
        ></el-table-column>
        <!-- <el-table-column prop="SupplierName" label="供应商" width="168"> </el-table-column> -->
        <el-table-column prop="Remark" label="备注" width="280">
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
