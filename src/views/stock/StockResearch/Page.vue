<!-- 库存查询 -->
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
          <span>商品类别</span>
          <div class="inputBox">
            <el-cascader
              :options="MainCategoryTree"
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
          <span>仓库名称</span>
          <div class="inputBox">
            <el-select
              v-model="searchForm.warehouseCode"
              :disabled="searchForm.companyCode == ''"
              clearable
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
          <span>仓位</span>
          <div class="inputBox">
            <el-select
              v-model="searchForm.positionCode"
              :disabled="searchForm.companyCode == ''"
              clearable
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
          <span>商品</span>
          <div class="inputBox">
            <el-input
              v-model="searchForm.productCode"
              placeholder="编码/名称/条码"
            ></el-input>
          </div>
        </div>
        <div class="box">
          <span>零库存</span>
          <div class="inputBox">
            <el-select v-model="searchForm.stockNum">
              <el-option label="不显示" :value="'0'"></el-option>
              <el-option label="显示" :value="''"></el-option>
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>最早入库时间</span>
          <div class="inputBox">
            <RangeDate
              v-model:props-start="searchForm.startTime"
              v-model:props-end="searchForm.endTime"
            ></RangeDate>
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
        <el-tab-pane
          label="按仓位"
          class="tabPane"
          v-if="isShowPosition == '1'"
        >
          <el-table
            border
            stripe
            ref="multipleTable"
            :data="DataByPos.tableData"
            tooltip-effect="dark"
            height="100%"
            :row-class-name="funcRowClassName"
          >
            <el-table-column
              prop="WarehouseCode"
              label="仓库编号"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="ShopName"
              label="门店名称"
              width="230"
            ></el-table-column>
            <el-table-column
              prop="WarehouseName"
              label="仓库名称"
              width="260"
            ></el-table-column>
            <el-table-column
              prop="PositionName"
              label="仓位名称"
            ></el-table-column>
            <el-table-column
              prop="ProductCode"
              label="商品编码"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="ProductName"
              label="商品名称"
              width="240"
            ></el-table-column>
            <el-table-column
              prop="UnitName"
              label="单位"
              width="50"
            ></el-table-column>
            <el-table-column
              prop="StockNum"
              label="库存数量"
              align="right"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="ZtNum"
              label="在途数量"
              align="right"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="SumNum"
              label="合计数量"
              align="right"
              width="100"
            ></el-table-column>
            <el-table-column prop="Remark" label="备注" width="280">
            </el-table-column>
          </el-table>
          <div class="footer">
            <el-pagination
              @size-change="eventPageSizeChange($event, 'ByPos')"
              @current-change="eventPageChange($event, 'ByPos')"
              :current-page="DataByPos.page"
              :page-sizes="[10, 15, 20, 100]"
              :page-size="DataByPos.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="DataByPos.total"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="按仓库" class="tabPane">
          <el-table
            border
            stripe
            ref="multipleTable"
            :data="DataByWar.tableData"
            tooltip-effect="dark"
            height="100%"
          >
            <el-table-column
              prop="WarehouseCode"
              label="仓库编号"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="ShopName"
              label="门店名称"
              width="230"
            ></el-table-column>
            <el-table-column
              prop="WarehouseName"
              label="仓库名称"
              width="260"
            ></el-table-column>
            <el-table-column
              prop="ProductCode"
              label="商品编码"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="ProductName"
              label="商品名称"
              width="240"
            ></el-table-column>
            <el-table-column
              prop="UnitName"
              label="单位"
              width="50"
            ></el-table-column>
            <el-table-column
              prop="StockNum"
              label="库存数量"
              align="right"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="ZtNum"
              label="在途数量"
              align="right"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="SumNum"
              label="合计数量"
              align="right"
              width="100"
            ></el-table-column>
            <el-table-column prop="Remark" label="备注" width="280">
            </el-table-column>
          </el-table>
          <div class="footer">
            <el-pagination
              @size-change="eventPageSizeChange($event, 'ByWar')"
              @current-change="eventPageChange($event, 'ByWar')"
              :current-page="DataByWar.page"
              :page-sizes="[10, 15, 20, 100]"
              :page-size="DataByWar.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="DataByWar.total"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="按商品" class="tabPane">
          <el-table
            border
            stripe
            ref="multipleTable"
            :data="DataByPro.tableData"
            tooltip-effect="dark"
            height="100%"
          >
            <el-table-column
              prop="ProductCode"
              label="商品编码"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="ShopName"
              label="门店名称"
              width="230"
            ></el-table-column>
            <el-table-column
              prop="ProductName"
              label="商品名称"
              width="240"
            ></el-table-column>
            <el-table-column
              prop="UnitName"
              label="单位"
              width="50"
            ></el-table-column>
            <el-table-column
              prop="StockNum"
              label="库存数量"
              align="right"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="ZtNum"
              label="在途数量"
              align="right"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="SumNum"
              label="合计数量"
              align="right"
              width="100"
            ></el-table-column>
            <el-table-column prop="Remark" label="备注" width="280">
            </el-table-column>
          </el-table>
          <div class="footer">
            <el-pagination
              @size-change="eventPageSizeChange($event, 'ByPro')"
              @current-change="eventPageChange($event, 'ByPro')"
              :current-page="DataByPro.page"
              :page-sizes="[10, 15, 20, 100]"
              :page-size="DataByPro.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="DataByPro.total"
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
  .searchBox {
    border: none;
  }
</style>
