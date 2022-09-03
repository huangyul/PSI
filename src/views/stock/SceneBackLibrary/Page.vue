<template>
  <div class="all">
    <div class="topBtnBox" v-show="permissionsList.Add">
      <button class="green" @click="eventOpenWindow">
        <i class="el-icon-plus"></i>新增
      </button>
      <span class="flex"></span>
    </div>
    <div class="searchBox">
      <div class="conditions">
        <div class="box">
          <span>回库日期</span>
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
              v-model="searchForm.product"
              placeholder="名称/编号/条形码"
            ></el-input>
          </div>
        </div>
        <div class="box">
          <span>回库机器</span>
          <div class="inputBox">
            <el-input v-model="searchForm.device"></el-input>
          </div>
        </div>
        <div class="box">
          <span>资产编号</span>
          <div class="inputBox">
            <el-input v-model="searchForm.assetNum"></el-input>
          </div>
        </div>
        <div class="box">
          <span>机头编号</span>
          <div class="inputBox">
            <!-- <el-input v-model="searchForm.noseNum"></el-input> -->
            <el-select v-model="searchForm.noseNum" clearable>
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
          <span>门店名称</span>
          <div class="inputBox">
            <el-select v-model="searchForm.shopInfo" clearable filterable>
              <el-option
                :key="item.Code"
                :label="item.Name"
                :value="item.Code"
                v-for="item in shopList"
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
      >
        <el-table-column
          prop="CheckinCode"
          label="回库单号"
          min-width="190"
        ></el-table-column>
        <el-table-column prop="ShopName" label="门店名称" width="230">
        </el-table-column>
        <el-table-column prop="ProductName" label="商品名称" width="240">
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
          prop="CheckinNum"
          label="回库数量"
          align="right"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="Amount"
          label="回库价值"
          align="right"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="AmountByTax"
          label="回库价值（含税）"
          align="right"
          width="170"
        >
        </el-table-column>
        <el-table-column prop="DeviceName" label="回库机器名称" min-width="210">
        </el-table-column>
        <el-table-column
          prop="PositionName"
          label="回库仓位"
          v-if="isShowPosition == '1'"
        ></el-table-column>
        <el-table-column prop="NoseNum" label="机头编号" width="170">
        </el-table-column>
        <el-table-column
          prop="AssetNum"
          label="资产编号"
          width="170"
        ></el-table-column>
        <el-table-column prop="Remark" label="备注" width="280">
        </el-table-column>
        <el-table-column prop="Creater" label="创建人" width="180">
        </el-table-column>
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          min-width="180"
        ></el-table-column>
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
    <el-dialog title="景品回库" v-model="dialogVisible" width="1300px">
      <div class="dialogVisible">
        <div class="searchBox">
          <div class="conditions">
            <div class="box">
              <span>回库单号：</span>
              <div class="auto">
                <span>{{ addForm.Code }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="topBtnBox">
          <div class="titleBox">
            <div class="mark"></div>
            <span>景品信息</span>
          </div>
          <span class="flex"></span>
          <span><span class="requiredTip">*</span>门店：</span>
          <div class="regular" style="margin-right: 15px">
            <el-select
              v-model="addForm.ShopCode"
              clearable
              filterable
              :disabled="supplierIsdisabled"
            >
              <el-option
                :key="item.Code"
                :label="item.Name"
                :value="item.Code"
                v-for="item in shopList"
              ></el-option>
            </el-select>
          </div>
          <span><span class="requiredTip">*</span>机器：</span>
          <div class="regular" style="margin-right: 15px">
            <el-select
              v-model="addForm.machine"
              clearable
              filterable
              :disabled="supplierIsdisabled"
            >
              <el-option
                :key="item.DeviceCode"
                :label="item.DeviceName"
                :value="item.DeviceCode"
                v-for="item in machineList"
              ></el-option>
            </el-select>
          </div>
          <span><span class="requiredTip">*</span>资产编号：</span>
          <div class="regular" style="margin-right: 15px">
            <el-select
              v-model="addForm.AssetNum"
              clearable
              filterable
              :disabled="supplierIsdisabled"
            >
              <el-option
                :key="item.AssetNum"
                :label="item.AssetNum"
                :value="item.AssetNum"
                v-for="item in assetsList"
              ></el-option>
            </el-select>
          </div>
          <button class="blue_plain" @click="eventOpenProductWindow">
            添加景品
          </button>
        </div>

        <div class="middle haveBorderNoTop">
          <el-table
            stripe
            ref="multipleTable"
            :data="addForm.Details"
            tooltip-effect="dark"
            height="350"
            style="width: 100%"
            :row-class-name="funcRowClassName"
          >
            <el-table-column
              prop="ProductCode"
              label="商品编号"
              width="120"
            ></el-table-column>
            <el-table-column prop="ProductName" label="商品名称" width="240">
            </el-table-column>
            <el-table-column prop="NoseNum" label="机头编号" width="180">
            </el-table-column>
            <el-table-column prop="UnitName" label="单位" width="50">
            </el-table-column>
            <el-table-column
              prop="OutNum"
              label="允许回库数量"
              align="right"
              width="120"
            >
            </el-table-column>
            <el-table-column prop="CheckinNum" label="回库数量" width="120">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.CheckinNum"
                  :min="0"
                  :controls="false"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="WarehouseCode" label="回库仓库" width="260">
              <template #default="scope">
                <el-select
                  v-model="scope.row.WarehouseCode"
                  clearable
                  @change="
                    eventChangeRowWarehouseCode($event, scope.$index, scope.row)
                  "
                  placeholder="请先选择门店"
                  filterable
                >
                  <el-option
                    :key="item.Code"
                    :label="item.Name"
                    :value="item.Code"
                    v-for="item in warehouseList"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="PositionCode"
              label="回库仓位"
              width="150"
              v-if="isShowPosition == '1'"
            >
              <template #default="scope">
                <el-select
                  v-model="scope.row.PositionCode"
                  clearable
                  @change="
                    eventChangeRowPositionCode($event, scope.$index, scope.row)
                  "
                  placeholder="请先选择仓库"
                  filterable
                >
                  <el-option
                    :key="item.Code"
                    :label="item.Name"
                    :value="item.Code"
                    v-for="item in scope.row.positionList"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="Remark" label="备注" width="280">
              <template #default="scope">
                <el-input v-model="scope.row.Remark" :maxlength="50"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <div class="tableButtonBox">
                  <i
                    class="delete"
                    @click="eventDeleteDetails(scope.$index, scope.row)"
                  ></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footerTip">
          <p>最后修改人：{{ username }}<b>|</b>最后修改时间：{{ addDate }}</p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="eventSaveWindow">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 增加商品弹窗 -->
    <el-dialog title="选择景品" v-model="dialogVisibleProduct" width="1300px">
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
                  v-model="productSearchForm.matTypeId"
                  clearable
                ></el-cascader>
              </div>
            </div>
            <div class="box">
              <span>商品</span>
              <div class="inputBox">
                <el-input
                  v-model="productSearchForm.productInfo"
                  placeholder="编号/名称/条形码"
                ></el-input>
              </div>
            </div>
          </div>
          <div class="operation">
            <!-- <i class="doubleDown"></i> -->
            <button class="search" @click="eventProductSearch">查询</button>
            <button class="reset" @click="eventProductReset">重置</button>
          </div>
        </div>

        <div class="middle haveBorder">
          <el-table
            stripe
            ref="multipleTable"
            :data="productTableData"
            tooltip-effect="dark"
            height="400"
            style="width: 100%"
            :row-class-name="funcRowClassName"
            @selection-change="eventProductTableSelect"
          >
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column
              prop="ProductCode"
              label="商品编号"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="ProductName"
              label="商品名称"
              min-width="240"
            ></el-table-column>
            <el-table-column prop="UnitName" label="单位" width="50">
            </el-table-column>
            <el-table-column
              prop="OutNum"
              label="允许回库数量"
              align="right"
              width="120"
            >
            </el-table-column>
            <el-table-column prop="DeviceName" label="机器名称" width="210">
            </el-table-column>
            <el-table-column prop="NoseNum" label="机头编号" width="180">
            </el-table-column>
            <el-table-column prop="AssetNum" label="固定资产编号" width="180">
            </el-table-column>
            <el-table-column prop="Remark" label="备注" width="280">
            </el-table-column>
          </el-table>
        </div>

        <div class="footer">
          <el-pagination
            @size-change="eventPageSizeChange_nested"
            @current-change="eventPageChange_nested"
            :current-page="nested_page"
            :page-sizes="[10, 15, 20, 100]"
            :page-size="nested_pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="nested_total"
          >
          </el-pagination>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisibleProduct = false">关闭</el-button>
          <el-button type="primary" @click="eventAddProduct">选择</el-button>
        </span>
      </template>
    </el-dialog>
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
