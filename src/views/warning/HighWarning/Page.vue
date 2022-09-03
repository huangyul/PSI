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
        <el-table-column
          prop="ShopName"
          label="门店名称"
          min-width="230"
        ></el-table-column>
        <el-table-column
          prop="ItemName"
          label="商品名称"
          min-width="240"
        ></el-table-column>
        <el-table-column prop="ItemCode" label="商品编号" min-width="120">
        </el-table-column>
        <el-table-column prop="MatTypeName" label="品类" min-width="104">
        </el-table-column>
        <el-table-column
          prop="WarningNum"
          label="库存预警数量"
          align="right"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="StockNum"
          label="当前库存数量"
          align="right"
          min-width="120"
        >
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
