<template>
	<div class="all">
		<div class="topBtnBox">
			<button v-show="permissionsList.Add" class="green" @click="eventOpenWindow()"><i class="el-icon-plus"></i>新增关联</button>

			<span class="flex"></span>

		</div>
		<div class="middle">
			<div class="MachineAndLandscapeBox">
				<div class="leftDiv">
					<div class="searchBox">
						<div class="regular" style="width: 220px;">
							<el-input placeholder="请输入机器分类名称进行搜索" v-model="leftInput"></el-input>
						</div>
						<button class="search" style="margin-left: 10px; display: none;" @click="eventNodeClickAll">全部</button>
					</div>
					<el-tree class="filter-tree" :props="{label: 'Name',value: 'Id',children: 'children'}"
					 :data="machineTreeLink"  default-expand-all :filter-node-method="funcFilterNodeLeft" ref="treeLeft" @node-click="eventNodeClick"></el-tree>
				</div>
				<div class="rightDiv">
					<div class="searchBox">
						<div class="regular" style="width: 220px;">
							<el-input placeholder="请输入景品分类名称进行搜索" v-model="rightInput"></el-input>
						</div>
					</div>
					<!-- <el-tree class="filter-tree" :props="{label: 'Name',value: 'Id',children: 'children'}" :expand-on-click-node="false"
					 :data="additionMachineTree"  default-expand-all :filter-node-method="funcFilterNodeRight" ref="treeRight">
					  <template #default="{ node, data }">
					    <span class="custom-tree-node" style="display: flex; align-items: center;">
					      <span>{{ node.label }}</span>
								<span v-show="!data.children"  style="display: flex; align-items: center; margin-left: 10px;"><i class="delete" @click="eventDetele(data)"></i></span>
					    </span>
					  </template>
					 </el-tree> -->
					 <el-table v-loading="loading" border stripe ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" height="100%" :row-class-name="funcRowClassName">
					 	<el-table-column prop="DevOrMatName" label="关联机器"></el-table-column>
						<el-table-column prop="ProdCodeList" label="景品"></el-table-column>
						<el-table-column label="操作" width="70" v-if="permissionsList.Delete" align="center">
						      <template #default="scope">
										<div class="tableButtonBox" style="justify-content: center;">
											<!-- <i class="delete" @click="eventDetele(scope.row)"></i> -->
											<el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon="el-icon-question" icon-color="#409EFF" title="确认删除吗？" @confirm="eventDetele(scope.row)">
											  <template #reference >
											    <i class="delete"></i>
											  </template>
											</el-popconfirm>
										</div>
						      </template>
						</el-table-column>
					 </el-table>
				</div>
			</div>
		</div>

		<el-dialog :title="OpenWindowTitle" v-model="dialogVisible" width="700px">
			<div>
				<div class="addBox">
					<span><span class="requiredTip">*</span>机器种类：</span>
					<el-cascader :props="{label: 'Name',value: 'Id',children: 'children',checkStrictly: true,expandTrigger: 'hover'}" :options="machineTree"
					 v-model="addForm.DevIdOrMatId" style="margin-right: 24px;" clearable></el-cascader>
				</div>
				<div class="addBox">
					<span><span class="requiredTip">*</span>关联景品：</span>
					<div class="ProdCodeOrMatIdList">
						<div class="ProdCodeOrMatIdBox" v-for="item in ProdCodeOrMatIdList" :key="item.value">
							<el-cascader :props="{label: 'Name',value: 'Id',children: 'children',checkStrictly: true,expandTrigger: 'hover'}" :options="additionMachineTree"
							 v-model="item.value" clearable></el-cascader>
							 <i class="delete" @click="eventDeteleAssociated(item)"></i>
						</div>
					</div>
				</div>
				<div class="addBox">
					<span></span>
					<button class="blue_plain" @click="eventAddAssociated">添加关联景品</button>
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

<script src="./vmModule.js">
	
</script>

<style>
.MachineAndLandscapeBox>.rightDiv>.el-tree>.el-tree-node{border: 1px solid #EBEEF5; border-bottom: none;}
</style>
<style scoped>
	.MachineAndLandscapeBox {
		display: flex;
		height: 100%;
	}

	.MachineAndLandscapeBox .leftDiv,.MachineAndLandscapeBox .rightDiv {
		display: flex;
		flex-direction: column;
	}
	.MachineAndLandscapeBox .leftDiv{flex:none; border-right: 1px solid #EBEEF5;}
	/* .MachineAndLandscapeBox .leftDiv>>>.el-tree-node__content:hover{background-color:#579FF6; color: #fff;}
	.MachineAndLandscapeBox .leftDiv>>>.is-current .el-tree-node__content{background-color:#579FF6; color: #fff;} */
	.MachineAndLandscapeBox .rightDiv{flex:1; overflow-y: auto;}
	.MachineAndLandscapeBox .rightDiv .el-tree{width: 100%; border-bottom: 1px solid #EBEEF5;}
	.MachineAndLandscapeBox .rightDiv>>>.el-tree-node{display: flex; align-items: center;}
	.MachineAndLandscapeBox .rightDiv>>>.el-tree-node__content{padding-left: 10px!important; width: 200px; background-color: #fff; cursor: auto;}
	.MachineAndLandscapeBox .rightDiv>>>.el-tree-node__content:hover{background-color: #fff;}
	.MachineAndLandscapeBox .rightDiv>>>.el-tree-node.is-expanded>.el-tree-node__children{border-left: 1px solid #EBEEF5;}
	.MachineAndLandscapeBox .rightDiv>>>.el-tree-node__content>.el-tree-node__expand-icon{display: none;}
	
	.all .addBox>span{line-height: 28px;}
	.ProdCodeOrMatIdList{display: flex; flex-direction: column; width: 100%;}
	.ProdCodeOrMatIdList>.ProdCodeOrMatIdBox{display: flex; align-items: center; margin-bottom: 15px;}
	.ProdCodeOrMatIdList>.ProdCodeOrMatIdBox:last-child{margin-bottom: 0px;}
	.ProdCodeOrMatIdList>.ProdCodeOrMatIdBox>i{margin-left: 10px; cursor: pointer;}
	
	.searchBox{padding: 10px 15px; border-bottom: 1px solid #EBEEF5; flex:none}
	.el-tree{overflow-y: auto;}
	
	.tableButtonBox{display: flex; align-items: center;}
</style>
