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
        <!-- <div class="box">
					<span>盘点日期</span>
					<div class="inputBox">
						<el-date-picker v-model="searchForm.date" type="daterange" start-placeholder="开始日期" range-separator="-"
						 end-placeholder="结束日期"></el-date-picker>
					</div>
				</div> -->
        <div class="box">
          <span>
            <el-tooltip
              v-if="searchForm.startTime"
              style="margin-right: 5px; font-size: 16px; color: #2d323c"
              class="item"
              effect="dark"
              :content="
                '（' + searchForm.startTime + ' - ' + searchForm.endTime + '）'
              "
              placement="top-start"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
            盘点周期
          </span>
          <div class="inputBox">
            <el-date-picker
              v-model="searchForm.date"
              type="month"
              placeholder="盘点周期"
            ></el-date-picker>
          </div>
        </div>
        <div class="box">
          <span>供应商</span>
          <div class="inputBox">
            <el-input v-model="searchForm.suppllerInfo"></el-input>
          </div>
        </div>
        <div class="box">
          <span>盘盈/盘亏</span>
          <div class="inputBox">
            <el-select v-model="searchForm.Inventory">
              <el-option label="全部" :value="-1" :key="-1"></el-option>
              <el-option label="正常" :value="0" :key="0"></el-option>
              <el-option label="盘盈" :value="1" :key="1"></el-option>
              <el-option label="盘亏" :value="2" :key="2"></el-option>
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>商品</span>
          <div class="inputBox">
            <el-input
              v-model="searchForm.productCode"
              placeholder="名称/编号/条形码"
            ></el-input>
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
          <span>汇总类型</span>
          <div class="inputBox">
            <el-select v-model="searchForm.reportType" filterable>
              <el-option :key="1" label="不汇总" :value="1"></el-option>
              <el-option :key="2" label="店铺汇总" :value="2"></el-option>
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>盘点仓库</span>
          <div class="inputBox">
            <el-select v-model="searchForm.warehouseCode" clearable filterable>
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
          <span>盘点仓位</span>
          <div class="inputBox">
            <el-select v-model="searchForm.positionCode" clearable filterable>
              <el-option
                :key="item.Code"
                :label="item.Name"
                :value="item.Code"
                v-for="item in positionList"
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
        show-summary
        :summary-method="funcGetSummaries"
        height="100%"
      >
        <el-table-column prop="ShopName" label="门店名称" min-width="230">
        </el-table-column>
        <el-table-column prop="WarehouseName" label="仓库" min-width="260">
        </el-table-column>
        <el-table-column
          prop="PositionName"
          label="仓位"
          v-if="isShowPosition == '1'"
        >
        </el-table-column>
        <el-table-column prop="MatTypeName" label="品类" width="104">
        </el-table-column>
        <el-table-column prop="MatTypeName1" label="大类" width="146">
        </el-table-column>
        <el-table-column prop="MatTypeName2" label="中类" width="146">
        </el-table-column>
        <el-table-column prop="MatTypeName3" label="小类" width="146">
        </el-table-column>
        <el-table-column prop="ProductCode" label="商品编号" width="120">
        </el-table-column>
        <el-table-column
          prop="ProductName"
          label="商品名称"
          width="240"
        ></el-table-column>
        <el-table-column prop="UnitName" label="单位" width="50">
        </el-table-column>
        <el-table-column
          prop="StockNum"
          label="库存数量"
          align="right"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="TrueNum"
          label="实际数量"
          align="right"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="InventoryNum"
          label="盘盈(盘亏)数量"
          align="right"
          min-width="140"
        >
        </el-table-column>
        <el-table-column prop="Price" label="单价" align="right">
          <template #default="scope">
            <span
              v-if="searchForm.reportType === 2 && scope.row.Price === 0"
            ></span>
            <span v-else>{{ scope.row.Price }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="StoreAmount"
          label="库存金额"
          align="right"
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop="TrueAmount"
          label="实际金额"
          align="right"
          width="170"
        ></el-table-column>
        <el-table-column
          prop="InventoryAmount"
          label="盘盈(盘亏)金额"
          align="right"
          min-width="170"
        >
        </el-table-column>
        <el-table-column prop="Remark" label="盘盈(盘亏)原因" min-width="200">
        </el-table-column>
        <el-table-column prop="InventoryDate" label="盘库时间" width="120">
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
