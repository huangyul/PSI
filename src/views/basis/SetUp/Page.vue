<template>
	<div class="all">

		<div class="TracingPointBody">

			<div class="titleBox_1"><span></span>预警设置</div>
			<div class="piecesBox">
				<div class="onePieces">
					<div class="inputBox">
						<span class="headline">预警：</span>
						<div class="">
							<el-checkbox v-model="checkbox1" style="width:100px;">库存预警</el-checkbox>
							<el-checkbox v-model="checkbox2">积压物品提醒</el-checkbox>
						</div>
					</div>
				</div>
			</div>

			<div class="titleBox_1"><span></span>盘点设置</div>
			<div class="piecesBox">
				<div class="onePieces">
					<div class="inputBox">
						<span class="headline">盘点日期：</span>
						<div class="" style="display: flex; align-items: center;">
							<el-radio-group v-model="form.IsLimitInvDate" :disabled="true" style="margin-top: 5px;">
								<el-radio :label="false" style="width:100px;">不限制</el-radio>
								<el-radio :label="true">限制日期</el-radio>
							</el-radio-group>
							<div class="dayBox" v-show="form.IsLimitInvDate">
								<span>每月</span>
								<div class="mini">
									<el-select v-model="form.StartDay" style="width: 50px;" :disabled="true">
										<el-option v-for="item in DayList" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</div>
								<span>~</span>
								<div class="mini">
									<el-select v-model="form.EndDay" :disabled="true">
										<el-option v-for="item in DayList" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="titleBox_1"><span></span>仓位设置</div>
			<div class="piecesBox">
				<div class="onePieces">
					<div class="inputBox">
						<span class="headline">仓位管理：</span>
						<div class="">
							<el-radio-group v-model="form.IsPosition" :disabled="true">
								<el-radio :label="true" style="width:100px;">开启</el-radio>
								<el-radio :label="false">不开启</el-radio>
							</el-radio-group>
						</div>
					</div>
				</div>
			</div>

			<div class="piecesBox" style="border:none;display: flex; justify-content: center;">
				<button v-show="permissionsList.Edit" class="search" @click="eventUpdateTableData" style="padding: 0 50px; height: 36px;">保存</button>
			</div>
			<!-- <div class="TracingPointFoot" style="border: none;">
				<button v-show="permissionsList.Edit" class="search" @click="eventUpdateTableData">保存</button>
			</div> -->
		</div>

	</div>
</template>

<script src="./vmModule.js"></script>


<style scoped>
	.dayBox {
		display: flex;
		align-items: center;
		margin-left: 20px;
	}

	.dayBox>span {
		margin-right: 10px;
	}

	.titleBox_1 {
		margin: 0 40px;
		padding: 7px 0px;
		color: #434A57;
		font-weight: bold;
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	.titleBox_1>span {
		width: 3px;
		height: 16px;
		background-color: #F9C02E;
		border-radius: 2px;
		margin-right: 5px;
	}

	.piecesBox {
		padding-top: 20px;
		border: 1px solid #ECEDEE;
		width: 800px;
	}

	.onePieces>.inputBox>.headline,
	.twoPieces>.inputBox>.headline {
		width: 240px;
	}
	.dayBox>span{
	}
	.all>>>.el-radio__input.is-disabled+span.el-radio__label{
	}
</style>
