<!-- 消耗出库 -->
<template>
  <div class="all">
    <div class="topBtnBox">
      <button
        v-show="permissionsList.Add"
        class="green"
        @click="eventOpenWindow()"
      >
        <i class="el-icon-plus"></i>新增
      </button>
      <span class="flex"></span>
    </div>
    <div class="searchBox">
      <div class="conditions">
        <div class="box">
          <span>商品类别</span>
          <div class="inputBox">
            <el-cascader
              :props="{
                label: 'Name',
                value: 'Id',
                children: 'children',
                checkStrictly: true,
                expandTrigger: 'hover',
              }"
              :options="MainCategoryTree"
              v-model="searchForm.searchCondition.matTypeID"
              clearable
            ></el-cascader>
          </div>
        </div>
        <div class="box">
          <span>门店名称</span>
          <div class="inputBox">
            <el-select
              v-model="searchForm.searchCondition.companyCode"
              filterable
              clearable
            >
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
          <span>出库仓库</span>
          <div class="inputBox">
            <el-select
              v-model="searchForm.searchCondition.warehouseCode"
              clearable
              :disabled="searchForm.searchCondition.companyCode == ''"
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
          <span>出库仓位</span>
          <div class="inputBox">
            <el-select
              v-model="searchForm.searchCondition.positionCode"
              clearable
              :disabled="searchForm.searchCondition.companyCode == ''"
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
              v-model="searchForm.searchCondition.product"
              placeholder="编码/名称/条码"
            ></el-input>
          </div>
        </div>
        <div class="box">
          <span>出库日期</span>
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
          prop="CheckoutCode"
          label="出库单号"
          min-width="180"
        ></el-table-column>
        <el-table-column prop="ShopName" label="门店名称" width="230">
        </el-table-column>
        <el-table-column prop="WarehouseName" label="出库仓库" width="260">
        </el-table-column>
        <el-table-column
          prop="PositionName"
          label="出库仓位"
          v-if="isShowPosition == '1'"
        >
        </el-table-column>
        <el-table-column prop="ProductName" label="商品名称" width="240">
        </el-table-column>
        <el-table-column prop="UnitName" label="单位" width="50">
        </el-table-column>
        <el-table-column
          prop="Price"
          label="不含税单价"
          align="right"
          width="170"
        >
        </el-table-column>
        <el-table-column prop="OutNum" label="出库数量" align="right">
        </el-table-column>
        <el-table-column
          prop="Money"
          label="不含税金额"
          align="right"
          width="170"
        >
        </el-table-column>
        <el-table-column prop="UseWay" label="用途" width="100">
        </el-table-column>
        <el-table-column prop="Creater" label="创建人" width="170">
        </el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" min-width="170">
        </el-table-column>
        <el-table-column prop="Remark" label="备注" width="280">
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="eventPageSizeChange($event, 'main')"
        @current-change="eventPageChange($event, 'main')"
        :current-page="searchForm.page"
        :page-sizes="[10, 15, 20, 100]"
        :page-size="searchForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="searchForm.total"
      >
      </el-pagination>
    </div>
    <el-dialog :title="'消耗出库'" v-model="dialogVisible" width="1300px">
      <div class="dialogVisible">
        <div class="searchBox">
          <div class="conditions">
            <div class="box">
              <span>出库单号：</span>
              <div class="regular">
                <div class="inputBox">
                  <!-- <el-input v-model="checkoutNum"></el-input> -->
                  {{ checkoutNum }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="topBtnBox">
          <div class="titleBox">
            <div class="mark"></div>
            <span>商品信息</span>
          </div>
          <span class="flex"></span>
          <span><span class="requiredTip">*</span>门店名称：</span>
          <div class="regular" style="margin-right: 15px">
            <el-select
              v-model="companyCode"
              :disabled="storeIsdisabled"
              filterable
            >
              <el-option
                :label="item.Name"
                :value="item.Code"
                v-for="item in CompanyList"
                :key="item.Code"
              ></el-option>
            </el-select>
          </div>
          <button class="blue_plain" @click="eventOpenSubWindow()">
            添加商品
          </button>
        </div>
        <div class="middle haveBorderNoTop">
          <el-table
            stripe
            ref="multipleTable"
            :data="Itemlist"
            tooltip-effect="dark"
            style="width: 100%"
            height="350"
          >
            <el-table-column prop="ProductCode" label="商品编号" width="120">
            </el-table-column>
            <el-table-column prop="ProductName" label="商品名称" width="240">
            </el-table-column>
            <el-table-column prop="UnitName" label="单位" width="50">
            </el-table-column>
            <el-table-column
              prop="AllStockNum"
              label="在库数量"
              align="right"
              width="100"
            >
            </el-table-column>
            <el-table-column prop="CheckoutSum" label="出库数量" width="150">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.CheckoutSum"
                  @change="
                    eventChangeCheckoutSum($event, scope.$index, scope.row)
                  "
                  :min="0"
                  :max="scope.row.AllCheckinNum"
                  controls-position="right"
                  size="small"
                />
              </template>
            </el-table-column>
            <!-- <el-table-column prop="Price" label="不含税单价" width="170"> </el-table-column>
						<el-table-column prop="Money" label="不含税金额" width="170"> </el-table-column> -->
            <el-table-column prop="UseType" label="用途" width="170">
              <template #default="scope">
                <el-select v-model="scope.row.UseType">
                  <el-option label="办公领用" :value="'办公领用'"></el-option>
                  <el-option label="社会贡献" :value="'社会贡献'"></el-option>
                  <el-option label="促销活动" :value="'促销活动'"></el-option>
                  <el-option label="APP销售" :value="'APP销售'"></el-option>
                  <el-option label="损失出库" :value="'损失出库'"></el-option>
                  <el-option label="其他" :value="'其他'"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="Remark" label="备注" width="280">
              <template #default="scope">
                <el-input v-model="scope.row.Remark" :maxlength="50"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="WarehouseName" label="出库仓库" width="280">
            </el-table-column>
            <el-table-column
              prop="PositionName"
              label="出库仓位"
              v-if="isShowPosition == '1'"
            >
            </el-table-column>
            <el-table-column prop="Operate" label="操作" width="60">
              <template #default="scope">
                <span class="update" @click="RemoveItem(scope.$index)"
                  >删除</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footerTip">
          <p>
            创建人：{{ creator }}<b>|</b>创建时间：{{
              new Date().toLocaleDateString()
            }}
          </p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="eventSave">保存</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :title="'选择商品'" v-model="subDialogVisible" width="1300px">
      <div class="dialogVisible dialogVisibleSearch">
        <div class="searchBox">
          <div class="conditions">
            <div class="box">
              <span>商品类别</span>
              <div class="inputBox">
                <el-cascader
                  :props="{
                    label: 'Name',
                    value: 'Id',
                    children: 'children',
                    checkStrictly: true,
                    expandTrigger: 'hover',
                  }"
                  :options="SubCategoryTree"
                  v-model="searchSubFrom.searchCondition.matTypeID"
                  clearable
                ></el-cascader>
              </div>
            </div>
            <div class="box">
              <span>出货仓库</span>
              <div class="inputBox">
                <el-select
                  v-model="searchSubFrom.searchCondition.warehouseCode"
                  clearable
                >
                  <el-option
                    :label="item.Name"
                    :value="item.Code"
                    v-for="item in WarehouseSubList"
                    :key="item.Code"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="box" v-show="isShowPosition == '1'">
              <span>出货仓位</span>
              <div class="inputBox">
                <el-select
                  v-model="searchSubFrom.searchCondition.positionCode"
                  clearable
                >
                  <el-option
                    :label="item.Name"
                    :value="item.Code"
                    v-for="item in PositionSubList"
                    :key="item.Code"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="box">
              <span>商品</span>
              <div class="inputBox">
                <el-input
                  v-model="searchSubFrom.searchCondition.product"
                  placeholder="编码/名称/条码"
                >
                </el-input>
              </div>
            </div>
          </div>
          <div class="operation">
            <!-- <i class="doubleDown"></i> -->
            <button class="search" @click="doProductSearch">查询</button>
            <button class="reset" @click="eventProductReset">重置</button>
          </div>
        </div>
        <div class="middle haveBorder">
          <el-table
            v-if="subDialogVisible"
            stripe
            ref="multipleProductTable"
            :data="UnSelectedItemlist"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="eventTableSelect"
            :row-class-name="funcRowClassName"
            height="350"
            row-key="CheckinMIdList"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
              :reserve-selection="true"
            >
            </el-table-column>
            <el-table-column prop="ProductCode" label="商品编号" width="120">
            </el-table-column>
            <el-table-column prop="ProductName" label="商品名称" width="240">
            </el-table-column>
            <el-table-column
              prop="AllStockNum"
              label="在库数量"
              align="right"
              width="150"
            >
            </el-table-column>
            <el-table-column prop="UnitName" label="单位" width="50">
            </el-table-column>
            <el-table-column prop="MinInDate" label="最早入库时间" width="170">
            </el-table-column>
            <el-table-column prop="WarehouseName" label="仓库">
            </el-table-column>
            <el-table-column
              prop="PositionName"
              label="仓位"
              v-if="isShowPosition == '1'"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="footer">
          <el-pagination
            @size-change="eventPageSizeChange($event, 'sub')"
            @current-change="eventPageChange($event, 'sub')"
            :current-page="searchSubFrom.page"
            :page-sizes="[10, 15, 20, 100]"
            :page-size="searchSubFrom.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="searchSubFrom.total"
          >
          </el-pagination>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="subDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="eventSelect">选择</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script src="./vmModule.js"></script>

<style scoped></style>
