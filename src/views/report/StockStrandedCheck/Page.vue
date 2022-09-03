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
              :props="{
                label: 'Name',
                value: 'Id',
                children: 'children',
                checkStrictly: true,
                expandTrigger: 'hover',
              }"
              :options="CategoryTree"
              v-model="searchForm.matTypeId"
              clearable
            ></el-cascader>
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
          <span>滞留时间</span>
          <div class="inputBox">
            <el-select v-model="searchForm.inDate">
              <el-option :key="1" label="超过预警值" :value="1"></el-option>
              <el-option :key="2" label="自定义时间" :value="2"></el-option>
            </el-select>
          </div>
          <div class="moreThanBox" v-show="searchForm.inDate == 2">
            <span>超过</span>
            <div>
              <el-input-number
                v-model="searchForm.day"
                :precision="0"
                :min="0"
                :max="9999"
                :controls="false"
              ></el-input-number>
            </div>
            <span>天以上</span>
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
      >
        <el-table-column prop="ProductCode" label="商品编号" min-width="120">
        </el-table-column>
        <el-table-column
          prop="ProductName"
          label="商品名称"
          min-width="240"
        ></el-table-column>
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
        <el-table-column prop="CreateTime" label="最早批次入库日期" width="170">
        </el-table-column>
        <el-table-column
          prop="StockNum"
          label="库存数量"
          align="right"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="UnitName"
          label="单位"
          width="50"
        ></el-table-column>
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

<style scoped>
  .moreThanBox {
    display: flex;
    align-items: center;
    flex: none;
    margin-left: 10px;
  }
  .moreThanBox > div {
    width: 60px;
    margin: 0 10px;
  }
</style>
