<template>
	<div class="all">
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
						<el-input v-model="searchForm.unitNo" placeholder="门店编号/组织编号"></el-input>
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
			<el-table border stripe ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
				height="100%" :row-class-name="funcRowClassName">
				<el-table-column prop="Code" label="组织编号" width="120"></el-table-column>
				<el-table-column prop="Mast_No" label="门店编号"></el-table-column>
				<el-table-column prop="Name" label="门店名称" min-width="230"></el-table-column>
				<el-table-column prop="Mast_Name" label="U8仓库名称" min-width="120"></el-table-column>
				<el-table-column prop="Modifier" label="最后修改人" min-width="230"></el-table-column>
				<el-table-column prop="ModifyTime" label="修改时间" width="170"></el-table-column>
				<el-table-column label="操作" v-if="permissionsList.Edit">
					<template #default="scope">
						<span class="update" @click="eventOpenWindow(scope.row)">编辑</span>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="Id" label="ID"> </el-table-column> -->
				<!-- <el-table-column prop="Name" label="名称"> </el-table-column>
						<el-table-column prop="Address" label="地址"> </el-table-column> -->
			</el-table>
		</div>
		<div class="footer">
			<el-pagination @size-change="eventPageSizeChange" @current-change="eventPageChange" :current-page="page"
				:page-sizes="[10, 15, 20, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
				:total="total">
			</el-pagination>
		</div>
		<el-dialog :title="OpenWindowTitle" v-model="dialogVisible" width="800px">
			<div>
				<div class="addBox">
					<span>组织编号：</span>
					<div class="regular">
						<el-input v-model="addForm.Code" :disabled="true"></el-input>
					</div>
				</div>
				<div class="addBox">
					<span>门店编号：</span>
					<div class="regular">
						<el-input v-model="addForm.Mast_No" :disabled="true"></el-input>
					</div>
				</div>
				<div class="addBox">
					<span>门店名称：</span>
					<div class="regular">
						<el-input v-model="addForm.Name" :disabled="true"></el-input>
					</div>
				</div>
				<div class="addBox">
					<span>U8仓库名称：</span>
					<div class="regular">
						<el-input v-model="addForm.Mast_Name"></el-input>
					</div>	
				</div>
				<div class="addBox">
					<span></span>
					<p>最后修改人：{{addForm.Modifier}}<b>|</b>最后修改时间：{{addForm.ModifyTime}}</p>
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
