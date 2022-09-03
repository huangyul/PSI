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
          <span>生成日期</span>
          <div class="inputBox">
            <RangeDate
              v-model:props-start="searchForm.startTime"
              v-model:props-end="searchForm.endTime"
            ></RangeDate>
          </div>
        </div>
        <div class="box">
          <span>单号</span>
          <div class="inputBox">
            <el-input v-model="searchForm.Code"></el-input>
          </div>
        </div>
        <div class="box">
          <span>门店名称</span>
          <div class="inputBox">
            <el-select v-model="searchForm.shop" clearable filterable>
              <el-option
                :key="item.Code"
                :label="item.Name"
                :value="item.Code"
                v-for="item in shopList"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>仓库</span>
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
          <span>仓位</span>
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
        <div class="box">
          <span>商品</span>
          <div class="inputBox">
            <el-input
              v-model="searchForm.productInfo"
              placeholder="名称/编号/条形码"
            ></el-input>
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
          prop="Code"
          label="单号"
          min-width="190"
        ></el-table-column>
        <el-table-column prop="ProductName" label="商品名称" width="240">
        </el-table-column>
        <el-table-column prop="ShopName" label="门店名称" width="230">
        </el-table-column>
        <el-table-column prop="inTypeName" label="调整类型" width="100">
        </el-table-column>
        <el-table-column prop="UnitName" label="单位" width="50">
        </el-table-column>
        <el-table-column
          prop="CheckinNum"
          label="调整数量"
          align="right"
          width="100"
        >
        </el-table-column>
        <el-table-column prop="WarehouseName" label="仓库名称" min-width="260">
        </el-table-column>
        <el-table-column
          prop="PositionName"
          label="仓位"
          v-if="isShowPosition == '1'"
        ></el-table-column>
        <el-table-column prop="Remark" label="备注" min-width="280">
        </el-table-column>
        <el-table-column prop="Creater" label="创建人" min-width="180">
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
    <el-dialog title="库存调整" v-model="dialogVisible" width="1300px">
      <div class="dialogVisible">
        <div class="searchBox">
          <div class="conditions">
            <div class="box">
              <span>单号：</span>
              <div class="auto">
                <span>{{ addForm.Code }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="topBtnBox">
          <div class="titleBox">
            <div class="mark"></div>
            <span>商品信息</span>
          </div>
          <div class="shopTip">
            <i class="el-icon-warning-outline"></i>
            <span>仅可添加同一个门店的商品</span>
          </div>
          <span class="flex"></span>
          <span>门店：</span>
          <div class="regular" style="margin-right: 15px">
            <el-select
              v-model="addForm.shop"
              :disabled="supplierIsdisabled"
              filterable
            >
              <el-option
                :key="item.Code"
                :label="item.Name"
                :value="item.Code"
                v-for="item in shopList"
              ></el-option>
            </el-select>
          </div>
          <button class="blue_plain" @click="eventOpenProductWindow">
            添加商品
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
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="ProductName"
              label="商品名称"
              min-width="240"
            >
            </el-table-column>
            <el-table-column prop="UnitName" label="单位" min-width="50">
            </el-table-column>
            <el-table-column
              prop="StockNum"
              label="在库数量"
              align="right"
              min-width="80"
            >
            </el-table-column>
            <el-table-column prop="CheckinNum" label="调整数量" min-width="120">
              <template #header>
                <!-- <el-tooltip class="item" effect="dark" content="正数为增加数量,负数为减少数量" placement="top"> -->
                <span
                  >调整数量
                  <!-- <i
                    class="el-icon-question"
                    style="margin-left: 5px; font-size: 16px"
                  ></i> -->
                </span>
                <!-- <span>调整数量<span class="theadTip">?</span></span> -->
                <!-- </el-tooltip> -->
              </template>
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.CheckinNum"
                  :controls="false"
                  :min="0"
                  :max="9999999.99"
                  :precision="2"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="Remark" label="备注" width="280">
              <template #default="scope">
                <el-input v-model="scope.row.Remark" :maxlength="50"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="WarehouseName"
              label="仓库"
              min-width="260"
            ></el-table-column>
            <el-table-column
              prop="PositionName"
              label="仓位"
              v-if="isShowPosition == '1'"
            ></el-table-column>
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
    <el-dialog title="选择商品" v-model="dialogVisibleProduct" width="1300px">
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
            <div class="box">
              <span>调整仓库</span>
              <div class="inputBox">
                <el-select
                  v-model="productSearchForm.warehouseCode"
                  clearable
                  filterable
                >
                  <el-option
                    :key="item.Code"
                    :label="item.Name"
                    :value="item.Code"
                    v-for="item in productWarehouseList"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="box" v-show="isShowPosition == '1'">
              <span>仓位</span>
              <div class="inputBox">
                <el-select
                  v-model="productSearchForm.positionCode"
                  clearable
                  filterable
                >
                  <el-option
                    :key="item.Code"
                    :label="item.Name"
                    :value="item.Code"
                    v-for="item in producPositionList"
                  ></el-option>
                </el-select>
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
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="ProductName"
              label="商品名称"
              min-width="240"
            ></el-table-column>
            <el-table-column prop="UnitName" label="单位" min-width="50">
            </el-table-column>
            <el-table-column
              prop="StockNum"
              label="在库数量"
              align="right"
              min-width="80"
            >
            </el-table-column>
            <el-table-column prop="WarehouseName" label="仓库" min-width="260">
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

<style scoped></style>
