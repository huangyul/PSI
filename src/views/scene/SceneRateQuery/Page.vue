<!-- 景品率查询 -->
<template>
  <div class="all">
    <div class="topBtnBox" v-show="permissionsList.Export">
      <span class="flex"></span>
      <button @click="eventExport" class="grey">
        <i class="export"></i>导出
      </button>
    </div>
    <div class="searchBox" style="border-bottom: none">
      <div class="conditions">
        <div class="box">
          <span>统计日期</span>
          <div class="inputBox">
            <RangeDate
              v-model:props-start="searchForm.startTime"
              v-model:props-end="searchForm.endTime"
            ></RangeDate>
          </div>
        </div>
        <div class="box">
          <span>统计方法</span>
          <div class="inputBox">
            <el-select v-model="searchForm.statisticalMethods">
              <el-option label="销售出库" :value="'Sale'"></el-option>
              <el-option label="景品出库" :value="'Product'"></el-option>
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>机器</span>
          <div class="inputBox">
            <el-input
              v-model="searchForm.device"
              placeholder="编号/名称/固定资产"
            ></el-input>
          </div>
        </div>
        <div class="box">
          <span>机头编号</span>
          <div class="inputBox">
            <el-select v-model="searchForm.noseNum">
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
          <span>机器分组</span>
          <div class="inputBox">
            <el-select v-model="searchForm.deviceGroup">
              <el-option
                :label="item.GroupName"
                :value="item.GroupId"
                v-for="item in WarehouseList"
                :key="item.GroupId"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="box">
          <span>时间汇总方式</span>
          <div class="inputBox">
            <el-select v-model="searchForm.timeType" clearable>
              <el-option label="天" value="1"></el-option>
              <el-option label="周" value="2"></el-option>
              <el-option label="月" value="3"></el-option>
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
      <el-tabs style="width: 100%; height: 100%">
        <el-tab-pane label="按机位" class="tabPane">
          <el-table
            border
            stripe
            ref="multipleTable"
            :data="DataByNoseNum.tableData"
            tooltip-effect="dark"
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
              label="门店"
              width="230"
            ></el-table-column>
            <el-table-column prop="DeviceGroup" label="机器分组">
              <template #default="scope">
                <span>{{ funcGetDeviceGroupName(scope.row.DeviceGroup) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="DeviceName"
              label="机器名称"
              min-width="210"
            ></el-table-column>
            <el-table-column
              prop="AssetNum"
              label="固定资产编号"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="NoseNum"
              label="机头编号"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="Rate"
              label="景品率"
              align="right"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="Coins"
              label="投币数"
              align="right"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="PriceCoin"
              label="币单价"
              align="right"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="CoinAmount"
              label="投币收入"
              align="right"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="OutNum"
              label="景品出库金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Product'"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="BackNum"
              label="景品回库金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Product'"
              width="170"
            >
            </el-table-column>
            <el-table-column
              prop="OutAmount"
              label="出库金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Product'"
              width="170"
            ></el-table-column>

            <el-table-column
              prop="SaleOutAmount"
              label="销售出库金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Sale'"
              width="170"
            >
            </el-table-column>
            <el-table-column
              prop="BackAmount"
              label="销售回库金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Sale'"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="SaleAmount"
              label="销售金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Sale'"
              width="170"
            >
            </el-table-column>
            <el-table-column prop="Remark" label="备注" width="230">
            </el-table-column>
          </el-table>
          <div class="footer">
            <el-pagination
              @size-change="eventPageSizeChange($event, 'ByNoseNum')"
              @current-change="eventPageChange($event, 'ByNoseNum')"
              :current-page="DataByNoseNum.page"
              :page-sizes="[10, 15, 20, 100]"
              :page-size="DataByNoseNum.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="DataByNoseNum.total"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="按机器" class="tabPane">
          <el-table
            border
            stripe
            ref="multipleTable"
            :data="DataByAssetNum.tableData"
            tooltip-effect="dark"
            height="100%"
          >
            <el-table-column
              prop="SaleDate"
              label="日期"
              width="130"
            ></el-table-column>
            <el-table-column
              prop="ShopName"
              label="门店"
              width="230"
            ></el-table-column>
            <el-table-column prop="DeviceGroup" label="机器分组" width="170">
              <template #default="scope">
                <span>{{ funcGetDeviceGroupName(scope.row.DeviceGroup) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="DeviceName"
              label="机器名称"
              width="210"
            ></el-table-column>
            <el-table-column
              prop="AssetNum"
              label="固定资产编号"
              width="180"
            ></el-table-column>

            <el-table-column
              prop="Rate"
              label="景品率"
              align="right"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="Coins"
              label="投币数"
              align="right"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="PriceCoin"
              label="币单价"
              align="right"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="CoinAmount"
              label="投币收入"
              align="right"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="OutNum"
              label="景品出库金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Product'"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="BackNum"
              label="景品回库金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Product'"
              width="170"
            >
            </el-table-column>
            <el-table-column
              prop="OutAmount"
              label="出库金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Product'"
              width="170"
            ></el-table-column>

            <el-table-column
              prop="SaleOutAmount"
              label="销售出库金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Sale'"
              width="170"
            >
            </el-table-column>
            <el-table-column
              prop="BackAmount"
              label="销售回库金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Sale'"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="SaleAmount"
              label="销售金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Sale'"
              width="170"
            >
            </el-table-column>
            <el-table-column prop="Remark" label="备注" width="280">
            </el-table-column>
          </el-table>
          <div class="footer">
            <el-pagination
              @size-change="eventPageSizeChange($event, 'ByAssetNum')"
              @current-change="eventPageChange($event, 'ByAssetNum')"
              :current-page="DataByAssetNum.page"
              :page-sizes="[10, 15, 20, 100]"
              :page-size="DataByAssetNum.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="DataByAssetNum.total"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="按机器分组" class="tabPane">
          <el-table
            border
            stripe
            ref="multipleTable"
            :data="DataByGroupId.tableData"
            tooltip-effect="dark"
            height="100%"
          >
            <el-table-column
              prop="SaleDate"
              label="日期"
              width="130"
            ></el-table-column>
            <el-table-column
              prop="ShopName"
              label="门店"
              width="230"
            ></el-table-column>
            <el-table-column prop="DeviceGroup" label="机器分组">
              <template #default="scope">
                <span>{{ funcGetDeviceGroupName(scope.row.DeviceGroup) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="Rate"
              label="景品率"
              align="right"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="Coins"
              label="投币数"
              align="right"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="PriceCoin"
              label="币单价"
              align="right"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="CoinAmount"
              label="投币收入"
              align="right"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="OutNum"
              label="景品出库金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Product'"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="BackNum"
              label="景品回库金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Product'"
              width="170"
            >
            </el-table-column>
            <el-table-column
              prop="OutAmount"
              label="出库金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Product'"
              width="170"
            ></el-table-column>

            <el-table-column
              prop="SaleOutAmount"
              label="销售出库金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Sale'"
              width="170"
            >
            </el-table-column>
            <el-table-column
              prop="BackAmount"
              label="销售回库金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Sale'"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="SaleAmount"
              label="销售金额"
              align="right"
              v-if="searchForm.statisticalMethods == 'Sale'"
              width="170"
            >
            </el-table-column>
            <el-table-column prop="Remark" label="备注" width="280">
            </el-table-column>
          </el-table>
          <div class="footer">
            <el-pagination
              @size-change="eventPageSizeChange($event, 'ByGroupId')"
              @current-change="eventPageChange($event, 'ByGroupId')"
              :current-page="DataByGroupId.page"
              :page-sizes="[10, 15, 20, 100]"
              :page-size="DataByGroupId.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="DataByGroupId.total"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script src="./vmModule.js"></script>

<style scoped>
  .el-tabs {
    display: flex;
    flex-direction: column;
  }
  .el-tabs >>> .el-tabs__nav-wrap {
    padding: 0 20px;
  }
  .el-tabs >>> .el-tabs__content {
    flex: 1 !important;
  }
  .el-tabs >>> .el-tabs__header {
    margin: 0;
  }
  .el-tabs >>> .el-tabs__item {
  }
  .el-tabs >>> .el-tabs__item.is-active {
    font-weight: bold;
    color: #409eff;
  }
  .tabPane {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  .tabPane >>> .el-table {
    width: 100%;
    flex: 1;
  }
</style>
