<template>
    <div class="all">
        <div class="topBtnBox">
					<button v-show="permissionsList.Add" class="green" @click="eventOpenWindow()"><i class="el-icon-plus"></i>新增仓库</button>
					<button class="blue" @click="eventCheckPosition" v-show="isShowPosition == '1'"><i class="CheckPositions"></i>查看仓位</button>
					<!-- <button class="blue" @click="eventDetele"><i class="delete"></i>删除</button> -->
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
							<span>所属门店</span>
							<div class="inputBox">
								<el-select v-model="searchForm.shopInfo" clearable filterable>
									<el-option :label="item.Name" :value="item.Code" v-for="item in shopList" :key="item.Code"></el-option>
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
					  <!-- <el-table-column type="selection" width="55" align="center"> </el-table-column> -->
						<el-table-column prop="Code" label="编号">
							<template #default="scope">
								<span v-show="permissionsList.Edit" class="update" @click="eventOpenWindow(scope.row)">{{scope.row.Code}}</span>
								<span v-show="!permissionsList.Edit">{{scope.row.Code}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="Name" label="仓库名称"> </el-table-column>
						<el-table-column prop="Remark" label="备注"> </el-table-column>
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
								<span><span class="requiredTip">*</span>仓库名称：</span>
								<div class="regular">
									<el-input v-model="addForm.Name" maxlength="50"></el-input>
								</div>							
							</div>
							<div class="childBox">
								<span><span class="requiredTip">*</span>编号：</span>
								<div class="regular">
									<el-input v-model="addForm.Code" :disabled="true"></el-input>
								</div>
							</div>
						</div>
						<div class="addBox">
							<div class="childBox">
								<span><span class="requiredTip">*</span>所属门店：</span>
								<div class="regular">
									<el-select v-model="addForm.ShopCode" clearable filterable :disabled="isUpdate">
										<el-option :label="item.Name" :value="item.Code" v-for="item in shopList" :key="item.Code"></el-option>
									</el-select>
								</div>							
							</div>
						</div>
						<div class="addBox">
							<span>描述：</span>
							<el-input type="textarea" v-model="addForm.Remark" :autosize="{ minRows: 4}" maxlength="200"></el-input>
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
