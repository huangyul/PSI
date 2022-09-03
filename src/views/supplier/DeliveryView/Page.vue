<template>
  <div class="all">
    <div class="topBtnBox">
      <button
        v-show="permissionsList.DeliverGoods || isSupplier"
        class="green"
        @click="eventDetele"
      >
        <i class="el-icon-plus"></i>发货
      </button>
      <!-- <button v-show="isSupplier" class="green" @click="eventDetele"><i class="el-icon-plus"></i>发货</button> -->
      <button
        v-show="permissionsList.Print || isSupplier"
        class="blue"
        @click="eventPrintWindow"
      >
        <i class="print"></i>打印条形码
      </button>
      <span class="flex"></span>
      <button
        v-show="permissionsList.Export || isSupplier"
        class="grey"
        @click="eventExport"
      >
        <i class="export"></i>导出
      </button>
    </div>
    <div class="searchBox">
      <div class="conditions">
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
          <span>发货状态</span>
          <div class="inputBox">
            <el-select v-model="searchForm.status">
              <el-option :key="-1" label="全部" :value="-1"></el-option>
              <el-option :key="-1" label="未发货" :value="0"></el-option>
              <!-- <el-option :key="1" label="已发货" :value="1"></el-option> -->
              <el-option :key="2" label="部分发货" :value="2"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="operation">
        <i class="doubleDown"></i>
        <button class="search" @click="doSearch">查询</button>
        <button class="reset" @click="eventReset">重置</button>
      </div>
    </div>
    <div class="middle">
      <el-table
        border
        stripe
        ref="multipleProductTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        height="100%"
        @selection-change="eventTableSelect"
        :row-class-name="funcRowClassName"
        row-key="Id"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :reserve-selection="true"
        >
        </el-table-column>
        <el-table-column
          prop="Code"
          label="采购单编号"
          min-width="180"
        ></el-table-column>
        <el-table-column prop="ProductName" label="商品名称" min-width="240">
        </el-table-column>
        <el-table-column prop="ShopName" label="门店名称" min-width="230">
        </el-table-column>
        <el-table-column prop="ShopAddress" label="地址" min-width="280">
        </el-table-column>
        <el-table-column prop="UnitName" label="单位" min-width="80">
        </el-table-column>
        <el-table-column
          prop="OrderNum"
          label="下单数量"
          align="right"
          min-width="80"
        >
        </el-table-column>
        <el-table-column
          prop="SendNum"
          label="已发货数量"
          align="right"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="UndeliveredNum"
          label="未发货数量"
          align="right"
          min-width="100"
        ></el-table-column>
        <el-table-column prop="SupplierName" label="供应商" min-width="180">
        </el-table-column>
        <el-table-column
          prop="StatusName"
          label="发货状态"
          min-width="100"
        ></el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" min-width="170">
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
    <el-dialog title="发货" v-model="dialogVisible" width="1300px">
      <div class="dialogVisible">
        <!-- <div class="searchBox">
					<div class="conditions">
						<div class="box">
							<span>发货单号：</span>
							<div class="auto">
								<span>{{ addForm.Code }}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="topBtnBox" style="border: none; padding: 0 0 10px 0;">
					<div class="titleBox">
						<div class="mark"></div>
						<span>订单信息</span>
					</div>
					<span class="flex"></span>
				</div>
				<div class="searchBox">
					<div class="conditions">
						<div class="box">
							<span>采购单编号：</span>
							<div class="inputBox">
								{{addForm.OrderCode}}
							</div>
						</div>
						<div class="box">
							<span>供应商名称：</span>
							<div class="inputBox">
								{{addForm.SupplierName}}
							</div>
						</div>
						<div class="box">
							<span>备注：</span>
							<div class="inputBox">
								{{addForm.Remark}}
							</div>
						</div>
					</div>
				</div>
				<div class="topBtnBox" style="border: none; padding: 0 0 10px 0;">
					<div class="titleBox">
						<div class="mark"></div>
						<span>收货信息</span>
					</div>
					<span class="flex"></span>
				</div>
				<div class="searchBox">
					<div class="conditions">
						<div class="box">
							<span>收货地址：</span>
							<div class="inputBox">
								{{addForm.ShopAddress}}
							</div>
						</div>
						<div class="box">
							<span>联系人：</span>
							<div class="inputBox">
								{{addForm.Recevier}}
							</div>
						</div>
						<div class="box">
							<span>电话：</span>
							<div class="inputBox">
								{{addForm.ContactTel}}
							</div>
						</div>
						<div class="box">
							<span>收货门店：</span>
							<div class="inputBox">
								{{addForm.ShopName}}
							</div>
						</div>
					</div>
				</div> -->
        <div class="PureTextBox">
          <div class="topBox">
            <div class="sr-flex sr-row-start">
              <div class="sr-mr30">发货单号：{{ addForm.Code }}</div>
              <div class="box sr-flex sr-row-between sr-mr30">
                <span><span class="requiredTip">*</span>物流公司：</span>
                <div class="inputBox">
                  <el-select filterable v-model="addForm.LogCompanyCode">
                    <el-option
                      :key="item.Code"
                      :label="item.Name"
                      :value="item.Code"
                      v-for="item in LogisticsList"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div>
                操作员：<span>{{ operator }}</span>
              </div>
            </div>
            <div class="box sr-flex sr-row-start sr-col-start sr-mt10">
              <span>备注：</span>
              <div class="inputBox" style="min-width: 600px">
                <el-input v-model="addForm.Remark" :rows="2" type="textarea" />
              </div>
            </div>
          </div>
        </div>

        <div class="topBtnBox">
          <div class="titleBox">
            <div class="mark"></div>
            <span>订单信息</span>
          </div>
          <span class="flex"></span>
        </div>

        <div class="middle haveBorderNoTop">
          <el-table
            stripe
            ref="multipleTable"
            :data="addForm.PSI_Purchase_Delivery_Ms"
            tooltip-effect="dark"
            height="260"
            style="width: 100%"
            :row-class-name="funcRowClassName"
          >
            <el-table-column
              prop="OrderCode"
              label="采购单编号"
              min-width="180"
            ></el-table-column>
            <el-table-column
              prop="ShopName"
              label="门店名称"
              min-width="180"
            ></el-table-column>
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
            <el-table-column
              prop="OrderNum"
              label="待送货数量"
              align="right"
              min-width="120"
            >
            </el-table-column>
            <el-table-column prop="SendNum" label="发货数量" min-width="120">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.SendNum"
                  @input="
                    eventChangeaddFormGroupNum($event, scope.$index, scope.row)
                  "
                  :min="0"
                  :max="999999999.99"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column
              prop="ExpressNumber"
              label="物流单号"
              min-width="210"
            >
              <template #default="scope">
                <el-input
                  v-model="scope.row.ExpressNumber"
                  maxlength="20"
                ></el-input
              ></template>
            </el-table-column>
            <el-table-column prop="PackageNum" label="包数" min-width="130">
              <template #default="scope">
                <el-input
                  maxlength="10"
                  v-model="scope.row.PackageNum"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="UnitName" label="单位" min-width="50">
            </el-table-column>
            <el-table-column
              prop="Remark"
              label="备注"
              min-width="280"
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
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-checkbox
            v-show="permissionsList.Print || isSupplier"
            class="isPrint"
            v-model="isPrintInvoice"
            style="margin-right: 35px"
            >打印发货单</el-checkbox
          >
          <el-button type="primary" @click="eventSaveWindow">发货</el-button>
          <el-button @click="dialogVisible = false">关闭</el-button>

          <!-- <el-button type="primary" @click="eventInvoicePrintTemplate">发货单打印模板设计</el-button>
					<el-button type="primary" @click="eventInvoicePrint(1)">发货单打印预览</el-button>
					<el-button type="primary" @click="eventInvoicePrint(2)">发货单打印</el-button> -->
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
            <el-table-column
              prop="ProductName"
              label="商品名称"
              min-width="240"
            >
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
  .dialog-footer {
    position: relative;
  }
  .dialog-footer .isPrint {
    position: absolute;
    left: -135px;
    line-height: 34px;
    margin: 0;
  }
  .dialog-footer >>> .el-checkbox__label {
    padding-left: 6px;
  }
</style>
