<!--景品销售回库-->
<template>
  <div class="all">
    <div class="topBtnBox">
      <span class="flex"></span>
      <button
        v-show="permissionsList.Edit"
        class="search"
        @click="eventSaveWindow"
      >
        保存
      </button>
    </div>
    <div class="searchBox">
      <div class="conditions">
        <div class="box">
          <span>机器</span>
          <div class="inputBox">
            <el-input
              v-model="searchForm.device"
              placeholder="名称/固定资产"
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
          <span>商品</span>
          <div class="inputBox">
            <el-input
              v-model="searchForm.product"
              placeholder="名称"
            ></el-input>
          </div>
        </div>
        <div class="box">
          <span>销售日期</span>
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
        @selection-change="eventTableSelect"
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <!-- <el-table-column prop="Id" label="ID"> </el-table-column> -->
        <el-table-column prop="ShopName" label="门店名称" width="230">
        </el-table-column>
        <el-table-column prop="DeviceName" label="机器名称" width="210">
        </el-table-column>
        <el-table-column prop="AssetNum" label="固定资产编号" width="180">
        </el-table-column>
        <el-table-column prop="NoseNum" label="机头编号" width="180">
        </el-table-column>
        <el-table-column prop="ProductName" label="商品名称" width="240">
        </el-table-column>
        <el-table-column prop="UnitName" label="单位" width="50">
        </el-table-column>
        <el-table-column prop="Price" label="单价" align="right" width="170">
        </el-table-column>
        <el-table-column
          prop="SaleNum"
          label="销售数量"
          align="right"
          width="100"
        >
        </el-table-column>
        <el-table-column prop="BackNum" label="销售回库" width="180">
          <template #default="scope">
            <!-- <el-input v-model="scope.row.BackNum" min=0 max=99999 @keydown="handleInput" oninput="if(value.length > 5)value = value.slice(0, 5)" placeholder="请输入整数"></el-input> -->
            <el-input-number
              v-model="scope.row.BackNum"
              @change="eventChangeBackNum($event, scope.$index, scope.row)"
              :precision="0"
              :min="0"
              :controls="false"
            ></el-input-number>
          </template>
        </el-table-column>

        <el-table-column
          prop="BackAmount"
          label="销售回库金额"
          align="right"
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop="BackAmountByTax"
          label="销售回库金额(含税)"
          align="right"
          width="170"
        >
        </el-table-column>
        <!-- <el-table-column prop="Remark" label="备注"> </el-table-column> -->
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
