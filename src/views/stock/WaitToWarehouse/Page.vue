<!-- 待入库一览 -->
<template>
  <div class="all">
    <div class="topBtnBox">
      <button
        v-show="permissionsList.Warehousing"
        class="blue"
        @click="eventOpenWindow()"
      >
        <i class="PutInStorage"></i>入库
      </button>
      <span class="flex"></span>
      <button @click="eventExport" v-show="permissionsList.Export" class="grey">
        <i class="export"></i>导出
      </button>
    </div>
    <div class="searchBox">
      <div class="conditions">
        <div class="box">
          <span>入库门店</span>
          <div class="inputBox">
            <el-select v-model="searchForm.companyCode" filterable clearable>
              <el-option
                :label="item.Name"
                :value="item.Code"
                v-for="item in storeCompanyList"
                :key="item.Code"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>商品</span>
          <div class="inputBox">
            <el-input
              v-model="searchForm.product"
              placeholder="编码/名称/条码"
            ></el-input>
          </div>
        </div>
        <div class="box">
          <span>快递单号</span>
          <div class="inputBox">
            <el-input v-model="searchForm.expressNumber"></el-input>
          </div>
        </div>
        <div class="box">
          <span>快递公司</span>
          <div class="inputBox">
            <el-select v-model="searchForm.logCompanyCode" clearable>
              <el-option
                :label="company.Name"
                :value="company.Code"
                v-for="company in CompanyList"
                :key="company.Code"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>入库类型</span>
          <div class="inputBox">
            <el-select v-model="searchForm.purchaseType">
              <el-option label="全部" :value="-1"></el-option>
              <el-option label="采购" :value="0"></el-option>
              <el-option label="调拨" :value="2"></el-option>
              <el-option label="退库" :value="7"></el-option>
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>采购/调拨单号</span>
          <div class="inputBox">
            <el-input v-model="searchForm.oddNum"></el-input>
          </div>
        </div>
        <div class="box">
          <span>供应商</span>
          <div class="inputBox">
            <el-select v-model="searchForm.SupplierCode" filterable clearable>
              <el-option
                :key="item.SupplierId"
                :label="item.SupplierName"
                :value="item.SupplierId"
                v-for="item in supplierList"
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
        @selection-change="eventTableSelect"
        :row-class-name="funcRowClassName"
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="OddNum" label="采购/调拨单号" min-width="180">
          <template #default="scope">
            <span
              v-if="permissionsList.Warehousing"
              class="update"
              @click="eventOpenWindow(scope.row)"
              >{{ scope.row.OddNum }}</span
            >
            <span v-if="!permissionsList.Warehousing">{{
              scope.row.OddNum
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="ShopName"
          label="入库门店"
          min-width="240"
        ></el-table-column>
        <el-table-column
          prop="OutShopName"
          label="出库门店"
          min-width="240"
        ></el-table-column>
        <el-table-column prop="ProductName" label="商品名称" min-width="240">
        </el-table-column>
        <el-table-column prop="Photo" label="图片">
          <template #default="scope">
            <div class="demo-image__preview">
              <el-image
                style="width: 40px; height: 40px; text-align: center"
                :src="scope.row.Photo"
                :preview-src-list="[scope.row.Photo]"
                v-show="scope.row.Photo"
              ></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="UnitName" label="单位" min-width="50">
        </el-table-column>
        <el-table-column prop="SupplierName" label="供应商" min-width="260">
        </el-table-column>
        <el-table-column
          prop="SendNum"
          label="发货数量"
          align="right"
          min-width="120"
        >
        </el-table-column>
        <el-table-column prop="LogCompanyCode" label="物流公司" min-width="280">
          <template #default="scope">
            <template v-for="company in CompanyList" :key="company.Code">
              <span v-if="scope.row.LogCompanyCode == company.Code">{{
                company.Name
              }}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="ExpressNumber" label="物流单号" min-width="180">
        </el-table-column>
        <el-table-column prop="CheckinType" label="入库类型" min-width="80">
          <template #default="scope">
            <span v-if="scope.row.CheckinType == 2">调拨</span>
            <span v-if="scope.row.CheckinType == 0">采购</span>
            <span v-if="scope.row.CheckinType == 7">退库</span>
          </template>
        </el-table-column>
        <el-table-column prop="UseWay" label="用途"> </el-table-column>
        <el-table-column prop="DeliveryDate" label="发货日期" min-width="170">
        </el-table-column>
        <el-table-column prop="Remark" label="备注" min-width="280">
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
    <el-dialog :title="'入库'" v-model="dialogVisible" width="1300px">
      <div class="dialogVisible">
        <!-- <div class="searchBox" style="padding: 0px 0; background-color: #EEF5FE; font-weight: bold; margin-bottom: 10px;">
						<div class="conditions">
							<div class="box" style="margin: 0;">
								<span>采购单：</span>
								<div class="inputBox">
							        <span>{{enterForm.OddNum}}</span>
								</div>
							</div>
						</div>
					</div> -->
        <div class="searchBox">
          <div class="conditions" style="width: 100%">
            <div class="box">
              <span>采购单：</span>
              <div class="inputBox">
                <span>{{ enterForm.OddNum }}</span>
              </div>
            </div>
            <div class="box">
              <span>供货商：</span>
              <div class="inputBox">
                <span>{{ enterForm.SupplierName }}</span>
              </div>
            </div>
            <div class="box">
              <span>入库类型：</span>
              <div class="inputBox">
                <span>{{ enterForm.CheckinTypeName }}</span>
              </div>
            </div>
            <div class="box">
              <span>快递公司：</span>
              <div class="inputBox">
                <template v-for="company in CompanyList" :key="company.Code">
                  <span v-if="enterForm.LogCompanyCode == company.Code">{{
                    company.Name
                  }}</span>
                </template>
              </div>
            </div>
            <div class="box">
              <span>快递单号：</span>
              <div class="inputBox">
                <span>{{ enterForm.ExpressNumber }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="middle haveBorder">
          <el-table
            stripe
            ref="multipleTable"
            :data="enterForm.ItemList"
            tooltip-effect="dark"
            style="width: 100%"
            height="350"
          >
            <el-table-column
              prop="ProductCode"
              label="商品编号"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              prop="ProductName"
              label="商品名称"
              min-width="240"
            >
            </el-table-column>
            <el-table-column prop="UnitName" label="单位" min-width="50">
            </el-table-column>
            <el-table-column
              prop="SendNum"
              label="发货数量"
              align="right"
              min-width="80"
            >
            </el-table-column>
            <el-table-column
              prop="SendNum"
              label="入库数量"
              align="right"
              min-width="80"
            >
            </el-table-column>
            <el-table-column prop="EnterBase" label="入库仓库" min-width="260">
              <template #default="scope">
                <el-select
                  v-model="scope.row.EnterBase"
                  @change="selectChanged(scope.row)"
                  filterable
                >
                  <el-option
                    :label="item.Name"
                    :value="item.Code"
                    v-for="item in scope.row.WarehouseList"
                    :key="item.Code"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="BasePosition"
              label="仓位"
              v-if="isShowPosition == '1'"
            >
              <template #default="scope">
                <el-select
                  v-model="scope.row.BasePosition"
                  @change="selectPos(scope.row)"
                  filterable
                >
                  <el-option
                    :label="item.Name"
                    :value="item.Code"
                    v-for="item in scope.row.PositionList"
                    :key="item.Code"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="Operate" label="操作" width="80">
              <template #default="scope">
                <!-- <span style="margin-right: 5px;" v-if="scope.row.BussinessType == 'M' && enterForm.CheckinType != 2" class="update" @click="eventOpenSubWindow(scope.row,scope.$index)">录入资产编号</span>
												<span class="update" @click="RemoveItem(scope.$index)">删除</span> -->
                <div class="tableButtonBox">
                  <i
                    class="write update"
                    style="margin-right: 15px"
                    v-if="
                      scope.row.BussinessType == 'M' &&
                      enterForm.CheckinType != 2 &&
                      enterForm.CheckinType != 7
                    "
                    @click="eventOpenSubWindow(scope.row, scope.$index)"
                  ></i>
                  <i class="delete" @click="RemoveItem(scope.$index)"></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="eventEnterWareWindow"
            >入库</el-button
          >
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :title="'录入固定资产编号'"
      v-model="subdialogVisible"
      width="800px"
    >
      <div class="dialogVisible">
        <div class="searchBox">
          <div class="conditions">
            <div class="box">
              <span>采购单号：</span>
              <div class="inputBox">
                <span>{{ enterForm.OddNum }}</span>
              </div>
            </div>
            <div class="box">
              <span>供货商：</span>
              <div class="inputBox">
                <span>{{ enterForm.SupplierName }}</span>
              </div>
            </div>
            <div class="box">
              <span>入库类型：</span>
              <div class="inputBox">
                <span>{{ enterForm.CheckinTypeName }}</span>
              </div>
            </div>
            <div class="box">
              <span>快递公司：</span>
              <div class="inputBox">
                <template v-for="company in CompanyList" :key="company.Code">
                  <span v-if="enterForm.LogCompanyCode == company.Code">{{
                    company.Name
                  }}</span>
                </template>
              </div>
            </div>
            <div class="box">
              <span>快递单号：</span>
              <div class="inputBox">
                <span>{{ enterForm.ExpressNumber }}</span>
              </div>
            </div>
            <div class="box">
              <span><span class="requiredTip">*</span>资产状态：</span>
              <div class="inputBox">
                <el-select
                  v-model="selectedFixedItems.assetStatus"
                  @change="AssetStatusChange(selectedFixedItems.assetStatus)"
                >
                  <el-option label="自社资产" :value="1"></el-option>
                  <el-option label="租赁资产" :value="2"></el-option>
                  <el-option label="合作资产" :value="3"></el-option>
                  <el-option label="测试资产" :value="4"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="middle haveBorder">
          <el-table
            stripe
            ref="multipleTable"
            :data="selectedFixedItems.CodeList"
            tooltip-effect="dark"
            style="width: 100%; margin-top: 10px"
          >
            <el-table-column prop="SNumber" label="序号"> </el-table-column>
            <el-table-column prop="FixedNumber" label="固定资产编号">
              <template #default="scope">
                <el-input
                  v-model="scope.row.FixedNumber"
                  :maxlength="20"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="subdialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="SaveFixNumber(infoIndex)"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 打印条形码弹窗 -->
    <el-dialog title="打印条形码" v-model="printDialogVisible" width="800px">
      <div class="dialogVisible">
        <div class="topBtnBox" style="border-top: none">
          <span class="flex"></span>
          <el-checkbox v-model="isSystem">仅打印系统生成条形码</el-checkbox>
        </div>

        <div class="middle haveBorderNoTop">
          <el-table
            stripe
            ref="multipleTable"
            :data="printTableData"
            tooltip-effect="dark"
            height="350"
            style="width: 100%"
            :row-class-name="funcRowClassName"
          >
            <el-table-column prop="ProductName" label="商品名称" width="240">
            </el-table-column>
            <el-table-column prop="BarCodeTypeName" label="条形码类别">
            </el-table-column>
            <el-table-column prop="BarCode" label="条形码"> </el-table-column>
            <el-table-column prop="PrintNum" label="打印数量">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.PrintNum"
                  :min="0"
                  :max="200"
                  :precision="0"
                  :controls="true"
                  size="mini"
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="printDialogVisible = false">不打印</el-button>
          <!-- <el-button type="primary" @click="eventPrintTemplate">打印模板设计</el-button>
					<el-button type="primary" @click="eventPrint(1)">打印预览</el-button> -->
          <el-button type="primary" @click="eventPrint(2)">打印</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script src="./vmModule.js"></script>
<style scoped>
  .all .dialogVisible .searchBox > .conditions > .box {
    margin-bottom: 5px;
  }
</style>
