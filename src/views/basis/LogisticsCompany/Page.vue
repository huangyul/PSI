<template>
    <div class="all">
        <div class="topBtnBox">
					<button v-show="permissionsList.Add" class="green" @click="eventOpenWindow()"><i class="el-icon-plus"></i>新增物流公司</button>
					<button v-show="permissionsList.Edit" class="blue" @click="eventUpdateStatus(1)"><i class="enable"></i>启用</button>
					<button v-show="permissionsList.Edit" class="blue" @click="eventUpdateStatus(0)"><i class="disable"></i>停用</button>
					<!-- <button v-show="permissionsList.Delete" class="blue" @click="eventDetele"><i class="delete"></i>删除</button>	 -->
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
							<span>物流公司名称</span>
							<div class="inputBox">
								<el-input v-model="searchForm.name"></el-input>
							</div>
						</div>
						<div class="box">
							<span>编号</span>
							<div class="inputBox">
								<el-input v-model="searchForm.code" ></el-input>
							</div>
						</div>
						<div class="box">
							<span>状态</span>
							<div class="inputBox">
								<el-select v-model="searchForm.status" >
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
						<el-table-column prop="Code" label="编号" width="160">
							<template #default="scope">
								<span v-show="permissionsList.Edit" class="update" @click="eventOpenWindow(scope.row)">{{scope.row.Code}}</span>
								<span v-show="!permissionsList.Edit">{{scope.row.Code}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="Name" label="物流公司名称" min-width="230"></el-table-column>
						<el-table-column prop="PathUrl" label="图标">
							<template #default="scope">
								<el-image style="width: 30px; height: 30px; text-align: center;"
								 v-show="scope.row.PathUrl"
								:src="scope.row.PathUrl" 
								:preview-src-list="[scope.row.PathUrl]">
								</el-image>
							</template>
						</el-table-column>
						<el-table-column prop="Status" label="状态" width="60">
							<template #default="scope">
								<span v-if="scope.row.Status == 1" class="StatusGreen">启用</span>
								<span v-if="scope.row.Status == 0" class="StatusRed">停用</span>
							</template>
						</el-table-column>
						<el-table-column prop="Remark" label="备注" width="280"> </el-table-column>
						<el-table-column prop="Modifier" label="最后修改人" min-width="240"> </el-table-column>
						<el-table-column prop="ModifyTime" label="最后修改时间" min-width="100" width="170"> </el-table-column>
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
				<el-dialog :title="OpenWindowTitle" v-model="dialogVisible" width="750px">
				  <div>
						<div class="addBox">
							<div style="display: flex; flex-direction: column;">
								<div class="childBox">
									<span><span class="requiredTip">*</span>物流公司名称：</span>
									<div class="regular">
										<el-input v-model="addForm.Name"></el-input>
									</div>
								</div>
								<div class="childBox" style="margin-top: 10px;">
									<span>编号：</span>
									<div class="regular">
										<el-input v-model="addForm.Code" :disabled="true"></el-input>
									</div>
								</div>
							</div>
							<div class="childBox">
								<span>图标：</span>
								<div class="regular">
									<div class="uploadImgBox">
										<div class="imgBox" v-show="addForm.PathUrl">
											<i @click="eventImgDetele" style="">×</i>
											<el-image :src="addForm.PathUrl" fit="fill" style="width: 100%; height: 100%;"></el-image>
										</div>
										<el-upload v-show="!addForm.PathUrl" accept=".jpg,.png,.jpeg,.JPG,.JPEG" class="upload-demo" :limit="100000" list-type="picture" action="#" :auto-upload="false" :show-file-list="false" :on-change="eventUploadImgChange">
											<div class="uploadImgBtn">
												<i class="el-icon-plus"></i>
											</div>
										</el-upload>
									</div>
								</div>
							</div>
						</div>
						<div class="addBox">
							<span>备注：</span>
							<el-input type="textarea" v-model="addForm.Remark" :autosize="{ minRows: 4}"></el-input>
						</div>
						<div class="addBox">
							<div class="childBox">
								<span>状态：</span>						
								<el-radio v-model="addForm.Status" :label="1">启用</el-radio>
								<el-radio v-model="addForm.Status" :label="0">停用</el-radio>
							</div>
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

<style scoped>
.uploadImgBox>.imgBox>i{align-items: baseline;}
</style>
