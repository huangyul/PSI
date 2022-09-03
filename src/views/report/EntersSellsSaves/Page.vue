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
          <span><span class="requiredTip">*</span>查看日期</span>
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
              v-model="searchForm.productInfo"
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
          <span>仓库</span>
          <div class="inputBox">
            <el-select v-model="searchForm.whCode" filterable>
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
          <span>仓位</span>
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
        height="100%"
        show-summary
        :summary-method="funcGetSummaries"
      >
        <el-table-column
          prop="ShopName"
          label="门店名称"
          width="230"
        ></el-table-column>
        <el-table-column prop="WarehouseName" label="所属仓库" width="260">
        </el-table-column>
        <el-table-column
          prop="PositionName"
          label="所属仓位"
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
        <el-table-column label="期初库存" align="center">
          <el-table-column prop="LastNum" label="数量" align="right" width="80">
          </el-table-column>
          <el-table-column prop="Price1" label="单价" align="right" width="170">
          </el-table-column>
          <el-table-column
            prop="Amount1"
            label="金额"
            align="right"
            width="170"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column label="采购入库" align="center">
          <el-table-column
            prop="PurchaseNum"
            label="数量"
            align="right"
            width="80"
          >
          </el-table-column>
          <el-table-column prop="Price2" label="单价" align="right" width="170">
          </el-table-column>
          <el-table-column
            prop="Amount2"
            label="金额"
            align="right"
            width="170"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column label="调拨入库" align="center">
          <el-table-column prop="TBRNum" label="数量" align="right" width="80">
          </el-table-column>
          <el-table-column prop="Price5" label="单价" align="right" width="170">
          </el-table-column>
          <el-table-column
            prop="Amount5"
            label="金额"
            align="right"
            width="170"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column label="退库入库" align="center">
          <el-table-column prop="TKRKNum" label="数量" align="right" width="80">
          </el-table-column>
          <el-table-column prop="Price7" label="单价" align="right" width="170">
          </el-table-column>
          <el-table-column
            prop="Amount7"
            label="金额"
            align="right"
            width="170"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column label="销售出库" align="center">
          <el-table-column prop="XSTZNum" label="数量" align="right" width="80">
          </el-table-column>
          <el-table-column prop="Price3" label="单价" align="right" width="170">
          </el-table-column>
          <el-table-column
            prop="Amount3"
            label="金额"
            align="right"
            width="170"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column label="消耗出库" align="center">
          <el-table-column prop="XHNum" label="数量" align="right" width="80">
          </el-table-column>
          <el-table-column prop="Price4" label="单价" align="right" width="170">
          </el-table-column>
          <el-table-column
            prop="Amount4"
            label="金额"
            align="right"
            width="170"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column label="调拨出库" align="center">
          <el-table-column prop="TBCNum" label="数量" align="right" width="80">
          </el-table-column>
          <el-table-column prop="Price6" label="单价" align="right" width="170">
          </el-table-column>
          <el-table-column
            prop="Amount6"
            label="金额"
            align="right"
            width="170"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column label="退库出库" align="center">
          <el-table-column prop="TKCKNum" label="数量" align="right" width="80">
          </el-table-column>
          <el-table-column prop="Price8" label="单价" align="right" width="170">
          </el-table-column>
          <el-table-column
            prop="Amount8"
            label="金额"
            align="right"
            width="170"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column label="退货" align="center">
          <el-table-column prop="THNum" label="数量" align="right" width="80">
          </el-table-column>
          <el-table-column prop="Price9" label="单价" align="right" width="170">
          </el-table-column>
          <el-table-column
            prop="Amount9"
            label="金额"
            align="right"
            width="170"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column label="盘盈/盘亏" align="center">
          <el-table-column prop="PDNum" label="数量" align="right" width="80">
          </el-table-column>
          <el-table-column
            prop="Price10"
            label="单价"
            align="right"
            width="170"
          >
          </el-table-column>
          <el-table-column
            prop="Amount10"
            label="金额"
            align="right"
            width="170"
          >
          </el-table-column>
        </el-table-column>
        <!-- <el-table-column label="其他" align="center">
					<el-table-column prop="BFNum" label="数量" align="right"> </el-table-column>
					<el-table-column prop="Price11" label="单价" align="right"> </el-table-column>
					<el-table-column prop="Amount11" label="金额" align="right"> </el-table-column>
				</el-table-column> -->
        <el-table-column label="期末库存" align="center">
          <el-table-column prop="NextNum" label="数量" align="right">
          </el-table-column>
          <el-table-column
            prop="NextPrice"
            label="单价"
            align="right"
            width="170"
          >
          </el-table-column>
          <el-table-column
            prop="NextAmount"
            label="金额"
            align="right"
            width="170"
          >
          </el-table-column>
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
