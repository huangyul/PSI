<!--景品出库-->
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
          <span>商品去向</span>
          <div class="inputBox">
            <el-select
              v-model="searchForm.searchCondition.useWay"
              clearable
              :disabled="searchForm.searchCondition.companyCode == ''"
            >
              <el-option
                :label="item.DeviceName.split(' ')[0]"
                :value="item.Id"
                v-for="item in useWayList"
                :key="item.Id"
              >
                <span style="float: left">{{
                  item.DeviceName.split(' ')[0]
                }}</span>
                <span style="float: right; color: #cbcbcb; font-size: 13px">{{
                  item.DeviceName.split(' ')[1]
                }}</span>
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>资产编号</span>
          <div class="inputBox">
            <el-input v-model="searchForm.searchCondition.AssNum"></el-input>
          </div>
        </div>
        <div class="box">
          <span>机头编号</span>
          <div class="inputBox">
            <el-select v-model="searchForm.searchCondition.noseNum" clearable>
              <el-option label="A" :value="'A'"></el-option>
              <el-option label="B" :value="'B'"></el-option>
              <el-option label="C" :value="'C'"></el-option>
              <el-option label="D" :value="'D'"></el-option>
              <el-option label="E" :value="'E'"></el-option>
              <el-option label="F" :value="'F'"></el-option>
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>商品</span>
          <div class="inputBox">
            <el-input
              v-model="searchForm.searchCondition.Product"
              placeholder="编码/名称/条码"
            ></el-input>
          </div>
        </div>
        <div class="box">
          <span>出库日期</span>
          <div class="inputBox">
            <RangeDate
              v-model:props-start="searchForm.searchCondition.startTime"
              v-model:props-end="searchForm.searchCondition.endTime"
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
      >
        <el-table-column
          prop="CheckoutCode"
          label="出库单号"
          min-width="180"
        ></el-table-column>
        <el-table-column prop="ProductName" label="商品名称" width="240">
        </el-table-column>
        <el-table-column prop="ShopName" label="门店名称" width="230">
        </el-table-column>
        <el-table-column prop="UnitName" label="单位" width="50">
        </el-table-column>
        <el-table-column prop="Price" label="单价" align="right" width="170">
        </el-table-column>
        <el-table-column
          prop="PriceByTax"
          label="单价（含税）"
          align="right"
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop="OutNum"
          label="出库数量"
          align="right"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="Money"
          label="出库价值"
          align="right"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="MoneyByTax"
          label="出库价值（含税）"
          align="right"
          width="170"
        >
        </el-table-column>
        <el-table-column prop="UseWay" label="出库机器" width="170">
        </el-table-column>
        <el-table-column prop="NoseNum" label="机头编号" width="170">
        </el-table-column>
        <el-table-column prop="AssetNo" label="固定资产编号" min-width="120">
        </el-table-column>
        <el-table-column prop="WarehouseName" label="出库仓库" width="260">
        </el-table-column>
        <el-table-column
          prop="PositionName"
          label="出库仓位"
          v-if="isShowPosition == '1'"
        >
        </el-table-column>
        <el-table-column prop="Remark" label="备注" width="280">
        </el-table-column>
        <el-table-column prop="Modifier" label="操作人" width="170">
        </el-table-column>
        <el-table-column prop="OutDate" label="出库时间" width="170">
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
    <el-dialog :title="'景品出库'" v-model="dialogVisible" width="1300px">
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
              @change="assetNoForSearch = ''"
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
          <span><span class="requiredTip">*</span>出库机器：</span>
          <div class="regular" style="margin-right: 15px">
            <el-select
              v-model="useWay"
              :disabled="companyCode == ''"
              @change="assetNoForSearch = ''"
              clearable
              filterable
            >
              <el-option
                :label="item.DeviceName"
                :value="item.DeviceCode"
                v-for="item in subDialoguseWayList"
                :key="item.DeviceCode"
              ></el-option>
            </el-select>
          </div>
          <span><span class="requiredTip">*</span>固定资产编号：</span>
          <div class="regular" style="margin-right: 15px">
            <div class="inputBox">
              <el-select
                v-model="assetNoForSearch"
                :disabled="companyCode == '' || useWay == ''"
                clearable
                filterable
              >
                <el-option
                  :label="item.AssetNum"
                  :value="item.AssetNum"
                  v-for="item in assetNoList"
                  :key="item.AssetNum"
                ></el-option>
              </el-select>
            </div>
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
              width="80"
            >
            </el-table-column>
            <el-table-column prop="CheckoutSum" label="出库数量" width="150">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.CheckoutSum"
                  :min="0"
                  :max="scope.row.AllStockNum"
                  controls-position="right"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column prop="NoseNum" label="机头编号" width="170">
              <template #default="scope">
                <el-select v-model="scope.row.NoseNum" clearable>
                  <el-option label="A" :value="'A'"></el-option>
                  <el-option label="B" :value="'B'"></el-option>
                  <el-option label="C" :value="'C'"></el-option>
                  <el-option label="D" :value="'D'"></el-option>
                  <el-option label="E" :value="'E'"></el-option>
                  <el-option label="F" :value="'F'"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="Remark" label="备注" width="280">
              <template #default="scope">
                <el-input v-model="scope.row.Remark" :maxlength="50"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Operate" label="操作">
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
                  :options="CategoryTree"
                  v-model="searchSubFrom.searchCondition.MatTypeID"
                  clearable
                >
                </el-cascader>
              </div>
            </div>
            <div class="box">
              <span>商品</span>
              <div class="inputBox">
                <el-input
                  v-model="searchSubFrom.searchCondition.Product"
                  placeholder="编码/名称/条码"
                >
                </el-input>
              </div>
            </div>
            <div class="box">
              <span>出货仓库</span>
              <div class="inputBox">
                <el-select
                  v-model="searchSubFrom.searchCondition.warehouseCode"
                  clearable
                  filterable
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
                  filterable
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
          </div>
          <div class="operation">
            <button class="search" @click="doProductSearch">查询</button>
            <button class="reset" @click="eventProductReset">重置</button>
          </div>
        </div>
        <div class="middle stripe haveBorder">
          <el-table
            v-if="subDialogVisible"
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
            <el-table-column prop="CategoryName" label="商品类别" width="120">
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
            <el-table-column prop="WarehouseName" label="所属仓库" width="260">
            </el-table-column>
            <el-table-column
              prop="PositionName"
              label="所属仓位"
              v-if="isShowPosition == '1'"
            >
            </el-table-column>
            <el-table-column prop="Remark" label="备注" width="280">
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
