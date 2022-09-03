<template>
    <div class="all">
        <div class="topBtnBox">
					<button v-show="permissionsList.Add" class="green" @click="eventOpenWindow()"><i class="el-icon-plus"></i>新增供应商</button>
					<button v-show="permissionsList.Edit" class="blue" @click="eventUpdateStatus(1)"><i class="enable"></i>启用</button>
					<button v-show="permissionsList.Edit" class="blue" @click="eventUpdateStatus(0)"><i class="disable"></i>禁用</button>
					<!-- <button v-show="permissionsList.Delete" class="blue" @click="eventDetele"><i class="delete"></i>删除</button> -->
					<!-- <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确认删除吗？" @confirm="eventDetele">
					  <template #reference >
					    <button class="blue" v-show="permissionsList.Delete"><i class="delete"></i>删除</button>
					  </template>
					</el-popconfirm> -->
					<span class="flex"></span>
				</div>
				<div class="searchBox">
					<div class="conditions">
						<div class="box">
							<span>供应商名称</span>
							<div class="inputBox">
								<el-input v-model="searchForm.SupplierName"></el-input>
							</div>
						</div>
						<div class="box">
							<span>编号</span>
							<div class="inputBox">
								<el-input v-model="searchForm.SupplierId" ></el-input>
							</div>
						</div>
						<div class="box">
							<span>状态</span>
							<div class="inputBox">
								<el-select v-model="searchForm.ActiveStatus" >
									<el-option label="全部" :value="-1"></el-option>
								  <el-option label="启用" :value="1"></el-option>
								  <el-option label="停用" :value="0"></el-option>
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
						<el-table-column prop="SupplierId" label="编号" width="100">
							<template #default="scope">
								<span v-show="permissionsList.Edit" class="update" @click="eventOpenWindow(scope.row)">{{scope.row.SupplierId}}</span>
								<span v-show="!permissionsList.Edit">{{scope.row.SupplierId}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="SupplierName" label="供应商名称" min-width="190"> </el-table-column>
						<el-table-column prop="Contact" label="联系人" width="150"> </el-table-column>
						<el-table-column prop="Address" label="公司地址" min-width="280"> </el-table-column>
						<el-table-column prop="Mobile" label="联系电话" width="120"> </el-table-column>
						<el-table-column prop="SettleMethod" label="结款方式" width="90">
							<template #default="scope">
								<span v-if="scope.row.SettleMethod == 1">现结</span>
								<span v-if="scope.row.SettleMethod == 0">月结</span>
							</template>
						</el-table-column>
						<el-table-column prop="AccountLogin" label="登录账号" width="90"> </el-table-column>
						<el-table-column prop="ActiveStatus" label="状态" width="60">
							<template #default="scope">
								<span v-if="scope.row.ActiveStatus == 1" class="StatusGreen">启用</span>
								<span v-if="scope.row.ActiveStatus == 0" class="StatusRed">停用</span>
							</template>
						</el-table-column>
						<el-table-column prop="Modifier" label="最后修改人" min-width="200"></el-table-column>
						<el-table-column prop="ModifyTime" label="最后修改时间" min-width="160"></el-table-column>
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

</style>
