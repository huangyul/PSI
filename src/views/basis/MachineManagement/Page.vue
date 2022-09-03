<template>
  <div class="all">
    <div class="topBtnBox">
      <button v-show="permissionsList.Print" class="blue" @click="eventprint">
        <i class="print"></i>打印机器条码
      </button>
      <span class="flex"></span>
      <button v-show="permissionsList.Export" class="grey" @click="eventExport">
        <i class="export"></i>导出
      </button>
    </div>
    <div class="searchBox">
      <div class="conditions">
        <div class="box">
          <span>机器</span>
          <div class="inputBox">
            <el-input
              v-model="searchForm.deviceInfo"
              placeholder="名称/编码"
            ></el-input>
          </div>
        </div>
        <div class="box">
          <span>固定资产编号</span>
          <div class="inputBox">
            <el-input v-model="searchForm.AssetNum"></el-input>
          </div>
        </div>
        <div class="box">
          <span>入库日期</span>
          <div class="inputBox">
            <RangeDate
              v-model:props-start="searchForm.startTime"
              v-model:props-end="searchForm.endTime"
            ></RangeDate>
          </div>
        </div>
        <div class="box">
          <span>入库区分</span>
          <div class="inputBox">
            <el-select v-model="searchForm.InType">
              <el-option label="采购" value="采购"></el-option>
              <el-option label="调拨" value="调拨"></el-option>
              <el-option label="期初导入" value="期初导入"></el-option>
            </el-select>
            <!-- <el-input v-model="searchForm.InType" ></el-input> -->
          </div>
        </div>
        <div class="box">
          <span>所属门店</span>
          <div class="inputBox">
            <el-select v-model="searchForm.ShopName" clearable filterable>
              <el-option
                :label="item.Name"
                :value="item.Code"
                v-for="item in shopCodeList"
                :key="item.Code"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>资产状态</span>
          <div class="inputBox">
            <el-select v-model="searchForm.Status">
              <el-option label="全部" :value="-1"></el-option>
              <el-option label="自社资产" :value="1"></el-option>
              <el-option label="租赁资产" :value="2"></el-option>
              <el-option label="合作资产" :value="3"></el-option>
              <el-option label="测试资产" :value="4"></el-option>
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
        <el-table-column prop="DeviceCode" label="编号" width="90">
          <template #default="scope">
            <span class="update" @click="eventOpenWindow(scope.row)">{{
              scope.row.DeviceCode
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="DeviceName" label="机器名称" min-width="210">
        </el-table-column>
        <el-table-column prop="Photo" label="图片">
          <template #default="scope">
            <el-image
              style="width: 30px; height: 30px; text-align: center"
              v-show="scope.row.Photo"
              :src="scope.row.Photo"
              :preview-src-list="[scope.row.Photo]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="InDate"
          label="入库日期"
          width="100"
        ></el-table-column>
        <el-table-column prop="UnitName" label="单位" width="50">
        </el-table-column>
        <el-table-column prop="AssetNum" label="固定资产编号" width="120">
        </el-table-column>
        <el-table-column prop="ShopName" label="所属门店" min-width="230">
        </el-table-column>
        <el-table-column prop="InWhName" label="入库仓库" width="260">
        </el-table-column>
        <el-table-column prop="InType" label="入库区分" width="80">
        </el-table-column>
        <el-table-column prop="Status" label="资产状态" width="80">
          <template #default="scope">
            <span v-if="scope.row.Status == 1">自社资产</span>
            <span v-if="scope.row.Status == 2">租赁资产</span>
            <span v-if="scope.row.Status == 3">合作资产</span>
            <span v-if="scope.row.Status == 4">测试资产</span>
          </template>
        </el-table-column>
        <el-table-column prop="Usage" label="使用标识" width="80">
          <template #default="scope">
            <span v-if="scope.row.Usage == 0">新入库</span>
            <span v-if="scope.row.Usage == 1">可使用</span>
            <span v-if="scope.row.Usage == 2">调拨中</span>
            <span v-if="scope.row.Usage == 3">调拨完</span>
            <span v-if="scope.row.Usage == 4">报废</span>
            <span v-if="scope.row.Usage == 5">已退货</span>
          </template>
        </el-table-column>
        <el-table-column prop="Remark" label="备注" width="280">
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
    <el-dialog :title="OpenWindowTitle" v-model="dialogVisible" width="800px">
      <div>
        <div class="addBox">
          <div class="childBox">
            <span>机器名称：</span>
            <div class="regular">
              <el-input
                v-model="addForm.DeviceName"
                :disabled="true"
              ></el-input>
            </div>
          </div>
          <div class="childBox">
            <span>机器编号：</span>
            <div class="regular">
              <el-input
                v-model="addForm.DeviceCode"
                :disabled="true"
              ></el-input>
            </div>
          </div>
        </div>
        <div class="addBox">
          <div class="childBox">
            <span><span class="requiredTip">*</span>资产状态：</span>
            <div class="regular">
              <el-select v-model="addForm.Status" clearable>
                <el-option label="自社资产" :value="1"></el-option>
                <el-option label="租赁资产" :value="2"></el-option>
                <el-option label="合作资产" :value="3"></el-option>
                <el-option label="测试资产" :value="4"></el-option>
              </el-select>
            </div>
          </div>
          <div class="childBox">
            <span><span class="requiredTip">*</span>固定资产编号：</span>
            <div class="regular">
              <el-input v-model="addForm.AssetNum"></el-input>
            </div>
          </div>
        </div>
        <div class="addBox">
          <div class="childBox">
            <span>入库日期：</span>
            <div class="regular">
              <el-input v-model="addForm.InDate" :disabled="true"></el-input>
            </div>
          </div>
          <div class="childBox">
            <span>入库区分：</span>
            <div class="regular">
              <el-input v-model="addForm.InType" :disabled="true"></el-input>
            </div>
          </div>
        </div>
        <div class="addBox">
          <div class="childBox">
            <span>所属门店：</span>
            <div class="regular">
              <el-input v-model="addForm.ShopName" :disabled="true"></el-input>
            </div>
          </div>
          <div class="childBox">
            <span>入库仓库：</span>
            <div class="regular">
              <el-input v-model="addForm.InWhName" :disabled="true"></el-input>
            </div>
          </div>
        </div>
        <div class="addBox">
          <div class="childBox">
            <span>入库单价：</span>
            <div class="regular">
              <el-input v-model="addForm.InPrice" :disabled="true"></el-input>
            </div>
          </div>
          <div class="childBox">
            <span>单位：</span>
            <div class="regular">
              <el-input v-model="addForm.UnitName" :disabled="true"></el-input>
            </div>
          </div>
        </div>
        <div class="addBox">
          <span>备注：</span>
          <el-input
            type="textarea"
            v-model="addForm.Remark"
            :autosize="{ minRows: 4 }"
          ></el-input>
        </div>
        <!-- <div class="addBox">
							<span></span>
							<p>最后修改人：{{username}}<b>|</b>最后修改时间：{{addDate}}</p>
						</div> -->
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="eventSaveWindow">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script src="./vmModule.js"></script>

<style scoped></style>
