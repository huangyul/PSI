<template>
  <div class="all">
    <div class="topBtnBox" v-show="permissionsList.Edit && !isSupplier">
      <el-popconfirm
        confirm-button-text="确认"
        cancel-button-text="取消"
        icon="el-icon-question"
        icon-color="#409EFF"
        title="撤销发货后,所关联的发货信息以及待入库信息将会被取消,确认撤销吗？"
        @confirm="eventDetele"
      >
        <template #reference>
          <button class="green">撤销发货</button>
        </template>
      </el-popconfirm>
      <span class="flex"></span>
    </div>
    <div class="searchBox">
      <div class="conditions">
        <div class="box">
          <span>发货单号</span>
          <div class="inputBox">
            <el-input v-model="searchForm.deliveryCode"></el-input>
          </div>
        </div>
        <div class="box">
          <span>订单日期</span>
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
            <el-input v-model="searchForm.poCode"></el-input>
          </div>
        </div>
        <div class="box">
          <span>供应商</span>
          <div class="inputBox">
            <el-input v-model="searchForm.supllerInfo"></el-input>
          </div>
        </div>
        <div class="box">
          <span>发货状态</span>
          <div class="inputBox">
            <el-select v-model="searchForm.status">
              <el-option :key="-1" label="全部" :value="-1"></el-option>
              <el-option :key="0" label="待发货" :value="0"></el-option>
              <el-option :key="1" label="已发货" :value="1"></el-option>
              <el-option :key="2" label="部分发货" :value="2"></el-option>
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>物流公司</span>
          <div class="inputBox">
            <el-select v-model="searchForm.logCompanyCode" clearable>
              <el-option
                :key="item.Code"
                :label="item.Name"
                :value="item.Code"
                v-for="item in LogisticsList"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>物流单号</span>
          <div class="inputBox">
            <el-input v-model="searchForm.expressNumber"></el-input>
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
          label="发货单号"
          min-width="190"
        ></el-table-column>
        <el-table-column prop="ExpressNumber" label="物流单号" min-width="190">
        </el-table-column>
        <el-table-column prop="LogCompanyName" label="物流公司" min-width="260">
        </el-table-column>
        <el-table-column prop="OrderCode" label="采购单编号" min-width="180">
        </el-table-column>
        <el-table-column prop="ProductName" label="商品名称" min-width="240">
        </el-table-column>
        <el-table-column prop="ShopName" label="门店名称" min-width="230">
        </el-table-column>
        <el-table-column prop="Salesmen" label="联系人" min-width="180">
        </el-table-column>
        <el-table-column
          prop="ShopAddress"
          label="收货地址"
          min-width="280"
        ></el-table-column>
        <el-table-column prop="ContactTel" label="联系电话" min-width="120">
        </el-table-column>
        <el-table-column
          prop="UnitName"
          label="单位"
          min-width="50"
        ></el-table-column>
        <el-table-column
          prop="SendNum"
          label="发货数量"
          align="right"
          min-width="80"
        >
        </el-table-column>
        <el-table-column
          prop="CheckinStatus"
          label="入库状态"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="Remark"
          label="备注"
          min-width="280"
        ></el-table-column>
        <el-table-column prop="SupplierName" label="供应商" min-width="170">
        </el-table-column>
        <el-table-column
          prop="Creater"
          label="操作员"
          min-width="180"
        ></el-table-column>
        <el-table-column prop="CreateTime" label="发货时间" min-width="170">
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
