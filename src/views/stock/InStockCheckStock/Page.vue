<template>
  <div class="all">
    <div class="topBtnBox">
      <div style="display: flex; align-items: center">
        <span style="margin-right: 10px; color: #434a57; flex: none"
          >盘点日期</span
        >
        <div class="" style="width: 450px; margin-right: 15px">
          <RangeDate
            :disabled="true"
            v-model:props-start="takeStockDate[0]"
            v-model:props-end="takeStockDate[1]"
          ></RangeDate>
        </div>
        <span style="margin-right: 10px; color: #434a57; flex: none"
          >盘库日期</span
        >
        <div class="" style="width: 450px">
          <RangeDate
            v-model:props-start="searchForm.startTime"
            v-model:props-end="searchForm.endTime"
          ></RangeDate>
        </div>
        <div class="shopTip">
          <i class="el-icon-warning-outline"></i>
          <span>需要先选择盘库日期才显示数据</span>
        </div>
      </div>
      <span class="flex"></span>
    </div>
    <div class="searchBox">
      <div class="conditions">
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
            <el-select v-model="searchForm.warehouseCode" filterable>
              <el-option
                :key="item.Code"
                :label="item.Name"
                :value="item.Code"
                v-for="item in warehouseList"
              ></el-option>
            </el-select>
          </div>
        </div>
        <!-- <div class="box">
					<span>盘库日期</span>
					<div class="inputBox">
						<el-date-picker v-model="searchForm.date" type="datetimerange" start-placeholder="开始日期" range-separator=""
						 end-placeholder="结束日期" :clearable="false"></el-date-picker>
					</div>
				</div> -->
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
        <el-table-column prop="ShopName" label="门店名称" width="230">
        </el-table-column>
        <el-table-column prop="WarehouseCode" label="仓库编号" width="180">
        </el-table-column>
        <el-table-column prop="WarehouseName" label="仓库名称" min-width="260">
        </el-table-column>
        <el-table-column prop="Status" label="状态" width="80">
          <template #default="scope">
            <span v-if="scope.row.Status == 0" class="StatusYellow"
              >未盘点</span
            >
            <span v-if="scope.row.Status == 1" class="StatusGreen">盘点中</span>
            <span v-if="scope.row.Status == 3" class="StatusGray">已完成</span>
          </template>
        </el-table-column>
        <el-table-column prop="InventoryType" label="盘点类别" width="90">
          <template #default="scope">
            <span v-if="scope.row.InventoryType == 1">全部盘点</span>
            <span v-if="scope.row.InventoryType == 2">部分盘点</span>
          </template>
        </el-table-column>
        <el-table-column prop="IsShowZero" label="零库存" width="80">
          <template #default="scope">
            <span v-if="scope.row.IsShowZero == 1">显示</span>
            <span v-if="scope.row.IsShowZero == 0">不显示</span>
          </template>
        </el-table-column>
        <el-table-column prop="Modifier" label="操作员" width="230">
        </el-table-column>
        <el-table-column prop="ModifyTime" label="最后一次编辑时间" width="180">
        </el-table-column>
        <el-table-column prop="Operations" label="操作" width="140">
          <template #default="scope" v-if="isShowPosition == '0'">
            <div
              class="tableButtonBox"
              style="
                display: flex;
                align-items: flex-start;
                padding-top: 5px;
                flex-wrap: wrap;
              "
            >
              <span
                style="margin: 0 10px 5px 0"
                v-show="item.isShow"
                v-for="item in scope.row.Operations"
                @click="eventOpenWindow(scope.$index, scope.row, item.type)"
                >{{ item.name }}</span
              >
            </div>
          </template>
          <template #default="scope" v-if="isShowPosition == '1'">
            <div
              class="tableButtonBox"
              style="
                display: flex;
                align-items: flex-start;
                padding-top: 5px;
                flex-wrap: wrap;
              "
            >
              <span @click="eventOpenWindow(scope.$index, scope.row)"
                >操作</span
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer" style="display: none">
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
    <el-dialog
      :title="positionDialogTitle"
      v-model="dialogVisible"
      :width="positionDialogWidth"
    >
      <div class="dialogVisible">
        <div class="searchBox">
          <div class="conditions">
            <div class="box">
              <span>盘点仓库：</span>
              <div class="" style="width: 100px">
                {{ addForm.WarehouseName }}
              </div>
            </div>
            <div class="box">
              <span>状态：</span>
              <div class="" style="width: 100px">
                <span v-if="addForm.Status == 0">未盘点</span>
                <span v-if="addForm.Status == 1">盘点中</span>
                <span v-if="addForm.Status == 3">已完成</span>
              </div>
            </div>
          </div>
        </div>
        <div class="searchBox">
          <div class="conditions">
            <div class="box">
              <span>盘点类别：</span>
              <div class="">
                <el-radio-group v-model="addForm.category">
                  <!-- <el-radio :label="1" style="width: 100px;">全部盘点</el-radio> -->
                  <el-radio :label="2" style="width: 130px">部分盘点</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
        </div>
        <div class="searchBox">
          <div class="conditions">
            <div class="box">
              <span style="flex: none"></span>
              <div class="">
                <!-- <span style="color: #999999;">全部盘点：仓库中所有商品需录入数量，未录入的盘点后库存为0，部分盘点：录入需盘点的商品，未录入的库存不变</span> -->
                <span style="color: #999999"
                  >部分盘点：录入需盘点的商品，未录入的库存不变</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="searchBox">
          <div class="conditions">
            <div class="box">
              <span>零库存商品：</span>
              <div class="">
                <el-radio-group v-model="addForm.zero">
                  <el-radio :label="true" style="width: 130px">显示</el-radio>
                  <el-radio :label="false" style="width: 130px"
                    >不显示</el-radio
                  >
                </el-radio-group>
              </div>
            </div>
          </div>
        </div>
        <div class="searchBox" v-show="isShowPosition == '1'">
          <div class="conditions">
            <div class="box">
              <span>盘库日期：</span>
              <div class="">
                <RangeDate
                  v-model:props-start="searchForm.startTime"
                  :disabled="true"
                  v-model:props-end="searchForm.endTime"
                ></RangeDate>
              </div>
            </div>
          </div>
        </div>
        <div class="topBtnBox" v-show="isShowPosition == '1'">
          <div class="titleBox">
            <span>请选择仓位开始盘点</span>
          </div>
          <span class="flex"></span>
        </div>

        <div class="middle haveBorderNoTop" v-show="isShowPosition == '1'">
          <el-table
            stripe
            ref="multipleTable"
            :data="PositionTableData"
            tooltip-effect="dark"
            height="300"
            style="width: 100%"
            :row-class-name="funcRowClassName"
          >
            <el-table-column
              prop="PositionCode"
              label="仓位编号"
              width="170"
            ></el-table-column>
            <el-table-column
              prop="PositionName"
              label="仓位名称"
              min-width="230"
            >
            </el-table-column>
            <el-table-column prop="Status" label="状态" width="80">
              <template #default="scope">
                <span v-if="scope.row.Status == 0" class="StatusYellow"
                  >未盘点</span
                >
                <span v-if="scope.row.Status == 1" class="StatusGreen"
                  >盘点中</span
                >
                <span v-if="scope.row.Status == 3" class="StatusGray"
                  >已完成</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="Operations" label="操作" width="200">
              <template #default="scope">
                <div
                  class="tableButtonBox"
                  style="
                    display: flex;
                    align-items: flex-start;
                    padding-top: 5px;
                    flex-wrap: wrap;
                  "
                >
                  <span
                    style="margin: 0 10px 5px 0"
                    v-show="item.isShow"
                    v-for="item in scope.row.Operations"
                    @click="
                      eventOpenProductWindow(scope.$index, scope.row, item.type)
                    "
                    :key="item.type"
                    >{{ item.name }}</span
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="dialogVisible = false"
            v-show="isShowPosition == '1'"
            >关闭</el-button
          >
          <el-button
            type="primary"
            @click="eventFirstOpenWindow"
            v-show="isShowPosition == '0'"
            >开始盘点</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 盘点-录入数据/盘点-查看弹窗 -->
    <el-dialog
      :title="OpenWindowTitle"
      v-model="dialogVisibleProduct"
      width="1550px"
    >
      <div class="dialogVisible dialogVisibleSearch">
        <!-- <div class="topBtnBox" style="border-top: none;" v-show="!isCheck">
					<button class="green" @click="eventSave">保存</button>
					<span class="flex"></span>
					<div class="importBox">
						<input ref="uploadExcelValue" type="file" accept=".xls,.xlsx" class="upload-file" @change="eventImport($event,eventImportSave)" />
						<button v-show="permissionsList.Import" class="grey"><i class="import"></i>导入</button>
					</div>
					<button v-show="permissionsList.Export" @click="eventDownload" class="grey"><i class="download"></i>盘点表下载</button>
				</div>
				<div class="topBtnBox" style="border-top: none;" v-show="isCheck">
					<span class="flex"></span>
					<button v-show="permissionsList.Export" @click="eventExport" class="grey"><i class="export"></i>导出</button>
				</div> -->

        <div class="searchBox" style="border-bottom: 1px solid #ecedee">
          <div class="conditions">
            <div class="box">
              <span>仓库编号：</span>
              <div class="inputBox">
                {{ addForm.WarehouseCode }}
              </div>
            </div>
            <div class="box">
              <span>盘点仓库：</span>
              <div class="inputBox">
                {{ addForm.WarehouseName }}
              </div>
            </div>
            <div class="box" v-show="isShowPosition == '1'">
              <span>仓位：</span>
              <div class="inputBox">
                {{ addForm.PositionName }}
              </div>
            </div>
            <div class="box">
              <span>盘点类别：</span>
              <div class="inputBox">
                <span v-if="addForm.category === 1">全部盘点</span>
                <span v-if="addForm.category === 2">部分盘点</span>
              </div>
            </div>
            <div style="flex: 1"></div>
            <div style="border-top: none; display: flex" v-show="!isCheck">
              <button
                v-show="permissionsList.Export"
                @click="eventDownload"
                class="grey"
              >
                <i class="download"></i>盘点表下载
              </button>
              <button class="grey" @click="eventPrint(2)">打印</button>
              <div class="importBox">
                <input
                  ref="uploadExcelValue"
                  type="file"
                  accept=".xls,.xlsx"
                  class="upload-file"
                  @change="eventImport($event, eventImportSave)"
                />
                <button v-show="permissionsList.Import" class="grey">
                  <i class="import"></i>导入
                </button>
              </div>
            </div>
            <div style="border-top: none" v-show="isCheck">
              <button
                v-show="permissionsList.Export"
                @click="eventExport"
                class="grey"
              >
                <i class="export"></i>导出
              </button>
            </div>
            <!-- <div class="box">
							<span>盘点类别：</span>
							<div class="inputBox">
								<span v-if="addForm.category == 1">全部盘点</span>
								<span v-if="addForm.category == 2">部分盘点</span>
							</div>
						</div> -->
          </div>
        </div>
        <div
          class="searchBox"
          style="padding-top: 10px; border-bottom: 1px solid #ecedee"
        >
          <div class="titleBox">
            <div class="mark"></div>
            <span>商品信息</span>
          </div>
          <div class="conditions" style="flex: none">
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
                  placeholder="名称/编号/条形码"
                ></el-input>
              </div>
            </div>
            <div class="box" v-show="isCheck">
              <span>差异</span>
              <div class="inputBox">
                <el-select v-model="productSearchForm.differences">
                  <el-option :key="-1" label="全部" :value="-1"></el-option>
                  <el-option :key="0" label="无差异" :value="0"></el-option>
                  <el-option :key="1" label="有差异" :value="1"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="operation">
            <button class="search" @click="eventProductSearch">查询</button>
            <button class="reset" @click="eventProductReset">重置</button>
          </div>
        </div>
        <div class="middle haveBorderNoTop">
          <el-table
            stripe
            ref="multipleTable"
            :data="DisplayTableData"
            tooltip-effect="dark"
            height="400"
            style="width: 100%"
            :row-class-name="funcRowClassName"
            v-if="!isCheck"
          >
            <el-table-column
              prop="ProductCode"
              label="商品编号"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="ProductName"
              label="商品名称"
              width="240"
            ></el-table-column>
            <el-table-column prop="UnitName" label="单位" width="50">
            </el-table-column>
            <el-table-column
              prop="StockNum"
              label="应有数量"
              align="right"
              width="80"
            >
              <template #default="scope">
                <span>***</span>
              </template>
            </el-table-column>
            <el-table-column prop="TrueNum" label="实点数量" width="120">
              <template #default="scope">
                <el-input-number
                  :disabled="scope.row.BussinessType == 'M'"
                  v-model="scope.row.TrueNum"
                  :min="0"
                  :max="9999999.99"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="Remark" label="备注" width="260">
              <template #default="scope">
                <el-input v-model="scope.row.Remark" :maxlength="50"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Creater" label="操作员" width="250">
            </el-table-column>
            <el-table-column
              prop="CreateTime"
              label="录入时间"
              width="170"
            ></el-table-column>
          </el-table>

          <el-table
            ref="multipleTable"
            :data="GetViewTableData"
            tooltip-effect="dark"
            height="400"
            style="width: 100%"
            :row-class-name="funcRowClassName"
            v-if="isCheck"
          >
            <el-table-column
              prop="ProductCode"
              label="商品编号"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="ProductName"
              label="商品名称"
              width="240"
            ></el-table-column>
            <el-table-column prop="UnitName" label="单位" width="50">
            </el-table-column>
            <el-table-column
              prop="StockNum"
              label="应有数量"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="TrueNum"
              label="实点数量"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="InventoryNum"
              label="差异"
              width="140"
            ></el-table-column>
            <el-table-column
              prop="Remark"
              label="备注"
              width="280"
            ></el-table-column>
            <el-table-column prop="Creater" label="操作员" width="230">
            </el-table-column>
            <el-table-column
              prop="CreateTime"
              label="录入时间"
              width="170"
            ></el-table-column>
          </el-table>
        </div>
        <div class="footerTip">
          <p>最后修改人：{{ username }}<b>|</b>最后修改时间：{{ addDate }}</p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisibleProduct = false" :loading="isLoading"
            >关闭</el-button
          >
          <el-button
            type="primary"
            v-show="!isCheck"
            @click="eventSave"
            :loading="isLoading"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script src="./vmModule.js"></script>

<style scoped>
  .tableButtonBox > span {
    color: #409eff;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
