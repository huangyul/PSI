<template>
    <div class="all">
        <div class="topBtnBox">
					<button v-show="permissionsList.Add" class="green" @click="eventOpenWindow()"><i class="el-icon-plus"></i>新增单位</button>
					<!-- <button v-show="permissionsList.Delete" class="blue" @click="eventDetele"><i class="delete"></i>删除</button> -->
					<!-- <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确认删除吗？" @confirm="eventDetele">
					  <template #reference >
					    <button class="blue" v-show="permissionsList.Delete"><i class="delete"></i>删除</button>
					  </template>
					</el-popconfirm> -->
					<span class="flex"></span>
					<button v-show="permissionsList.Export" @click="eventExport" class="grey"><i class="export"></i>导出</button>
				</div>
				<div class="searchBox">
					<div class="conditions">
						<div class="box">
							<span>名称</span>
							<div class="inputBox">
								<el-input v-model="searchForm.unitName"></el-input>
							</div>
						</div>
						<div class="box">
							<span>编号</span>
							<div class="inputBox">
								<el-input v-model="searchForm.unitNo"></el-input>
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
						<el-table-column prop="Unit_No" label="编号" width="120">
							<template #default="scope">
								<span v-show="permissionsList.Edit" class="update" @click="eventOpenWindow(scope.row)">{{scope.row.Unit_No}}</span>
								<span v-show="!permissionsList.Edit">{{scope.row.Unit_No}}</span>
							</template>
						</el-table-column>
						<!-- <el-table-column prop="Id" label="ID"> </el-table-column> -->
						<el-table-column prop="Unit_Name" label="单位名称" width="280"> </el-table-column>
						<el-table-column prop="Memo" label="备注" min-width="280"> </el-table-column>
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
								<span><span class="requiredTip">*</span>单位名称：</span>
								<div class="regular">
									<el-input v-model="addForm.Unit_Name"></el-input>
								</div>							
							</div>
							<div class="childBox">
								<span><span class="requiredTip">*</span>编码：</span>
								<div class="regular">
									<el-input v-model="addForm.Unit_No" :disabled="true"></el-input>
								</div>
							</div>
						</div>
						<div class="addBox">
							<span>备注：</span>
							<el-input type="textarea" v-model="addForm.Memo" :autosize="{ minRows: 4}"></el-input>
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
