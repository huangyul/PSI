<template>
    <div class="all">
        <div class="topBtnBox">
					<button v-show="permissionsList.Add" class="green" @click="eventOpenWindow()"><i class="el-icon-plus"></i>设置默认仓库/仓位</button>
					<!-- <button v-show="permissionsList.Delete" class="blue" @click="eventDetele"><i class="delete"></i>删除</button> -->
					<el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确认删除吗？" @confirm="eventDetele">
					  <template #reference >
					    <button class="blue" v-show="permissionsList.Delete"><i class="delete"></i>删除</button>
					  </template>
					</el-popconfirm>
					<span class="flex"></span>
					<!-- <button v-show="permissionsList.Export" @click="eventExport" class="grey"><i class="export"></i>导出</button> -->
				</div>
				<div class="searchBox">
					<div class="conditions">
						<div class="box">
							<span>品类</span>
							<div class="inputBox">
								<el-cascader :props="props" :options="CategoryTree"
								 v-model="searchForm.CategoryId" clearable ></el-cascader>
							</div>
						</div>
						<div class="box">
							<span>门店名称</span>
							<div class="inputBox">
								<el-select v-model="searchForm.shopInfo" clearable filterable>
									<el-option :label="item.Name" :value="item.Code" v-for="item in shopList" :key="item.Code"></el-option>
								</el-select>
							</div>
						</div>
						<div class="box">
							<span>仓库</span>
							<div class="inputBox">
								<el-select v-model="searchForm.warehouseCode" clearable filterable>
									<el-option :key="item.Code" :label="item.Name" :value="item.Code" v-for="item in warehouseList"></el-option>
								</el-select>
							</div>
						</div>
						<div class="box" v-show="isShowPosition == '1'">
							<span>仓位</span>
							<div class="inputBox">
								<el-select v-model="searchForm.positionCode" clearable filterable>
									<el-option :key="item.Code" :label="item.Name" :value="item.Code" v-for="item in positionList"></el-option>
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
					<el-table border stripe ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" height="100%" @selection-change="eventTableSelect" :row-class-name="funcRowClassName">
					  <el-table-column type="selection" width="55" align="center"> </el-table-column>
						<el-table-column prop="ShopName" label="门店名称"  min-width="230"> </el-table-column>
						<el-table-column prop="MatTypeName" label="品类" width="280">
							<template #default="scope">
								<span v-show="permissionsList.Edit" class="update" @click="eventOpenWindow(scope.row)">{{scope.row.MatTypeName}}</span>
								<span v-show="!permissionsList.Edit">{{scope.row.MatTypeName}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="WhName" label="默认仓库" min-width="250"> </el-table-column>
						<el-table-column prop="PositionName" label="默认仓位" v-if="isShowPosition == '1'"> </el-table-column>
						<el-table-column prop="ModifyTime" label="最后修改时间"  width="180"> </el-table-column>
						<el-table-column prop="Modifier" label="最后修改人"  width="230"> </el-table-column>
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
				<el-dialog :title="OpenWindowTitle" v-model="dialogVisible" width="700px">
				  <div>
						<div class="addBox">
							<span><span class="requiredTip">*</span>门店名称：</span>
							<div class="large">
								<el-select v-model="addForm.ShopCode" clearable filterable>
									<el-option :label="item.Name" :value="item.Code" v-for="item in shopList" :key="item.Code"></el-option>
								</el-select>
							</div>							
						</div>
						<div class="addBox">
							<span><span class="requiredTip">*</span>品类：</span>
							<div class="large">
								<el-cascader :props="{label: 'Name',value: 'Id',children: 'children',checkStrictly: true,expandTrigger: 'hover'}" :options="CategoryTree"
								 v-model="addForm.MatTypeId" clearable></el-cascader>
							</div>
						</div>
						<div class="addBox">
							<span><span class="requiredTip">*</span>默认仓库：</span>
							<div class="large">
								<el-select v-model="addForm.WhCode" clearable filterable>
									<el-option :label="item.Name" :value="item.Code" v-for="item in AddWarehouseList" :key="item.Code"></el-option>
								</el-select>
							</div>							
						</div>
						<div class="addBox" v-show="isShowPosition == '1'">
							<span><span class="requiredTip">*</span>默认仓位：</span>
							<div class="large">
								<el-select v-model="addForm.PositionCode" clearable filterable>
									<el-option :label="item.Name" :value="item.Code" v-for="item in AddPositionList" :key="item.Code"></el-option>
								</el-select>
							</div>							
						</div>
						<div class="addBox">
							<span></span>
							<p>最后修改人：{{username}}<b>|</b>最后修改时间：{{addDate}}</p>
						</div>
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

<style scoped>

</style>
