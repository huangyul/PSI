<template>
    <div class="all">
        <div class="TracingPointTop">
					<div class="TracingPointContainer">
						<i class="el-icon-map-location"></i>
						<span>当前位置：</span>
						<div class="append"></div>
					</div>
					<button class="reset" @click="closeThisRouter">关闭</button>
					<button class="search" @click="eventSave">保存</button>
				</div>
				<div class="TracingPointBody">
					
					<div class="titleBox">基本信息</div>
					<div class="formBox">
						<el-form ref="form" :model="form" label-width="180px" size="mini" >
						  <el-form-item label="供应商名称:" required>
								<div class="large">
									<el-input v-model="form.SupplierName"></el-input>
								</div>
						  </el-form-item>
							<el-form-item label="编号:" required>
								<div class="large">
									<el-input v-model="form.SupplierId" :disabled="true"></el-input>
								</div>
							</el-form-item>
						  <el-form-item label="供应商类别:" required>
								<div class="large">
									<el-select v-model="form.SupplierType" >
									  <el-option label="供应商" :value="1"></el-option>
									  <el-option label="生产厂" :value="2"></el-option>
										<el-option label="生产且供货" :value="3"></el-option>
										<el-option label="维修配件供应商" :value="4"></el-option>
									</el-select>
								</div>
						  </el-form-item>
							<el-form-item label="法人代表:">
								<div class="large">
									<el-input v-model="form.LegalPerson"></el-input>
								</div>
							</el-form-item>
							<el-form-item label="公司地址:">
								<div class="large">
									<el-input v-model="form.Address"></el-input>
								</div>
							</el-form-item>
							<el-form-item label="备注:">
								<div style="width: 620px;">
									<el-input type="textarea" v-model="form.Summary" :autosize="{ minRows: 4}"></el-input>
								</div>
							</el-form-item>
						</el-form>
					</div>
					
					<div class="titleBox">收款信息</div>
					<div class="piecesBox">
						<div class="twoPieces">
							<div class="inputBox">
								<span class="headline">银行账户名称：</span>
								<div class="regular">
									<el-input v-model="form.AccountName" ></el-input>
								</div>
							</div>
						</div>
						<div class="twoPieces">
							<div class="inputBox">
								<span class="headline">开户银行名称：</span>
								<div class="regular">
									<el-input v-model="form.AccountBank" ></el-input>
								</div>
							</div>
						</div>
						<div class="twoPieces">
							<div class="inputBox">
								<span class="headline">银行账户号码：</span>
								<div class="regular">
									<el-input v-model="form.AccountNumber" ></el-input>
								</div>
							</div>
						</div>
						<div class="twoPieces">
							<div class="inputBox">
								<span class="headline">结款方式：</span>
								<div class="regular">
									<el-select v-model="form.SettleMethod" >
									  <el-option label="月结" :value="0"></el-option>
									  <el-option label="现结" :value="1"></el-option>
									</el-select>
								</div>
							</div>
						</div>
						<div class="twoPieces">
							<div class="inputBox">
								<span class="headline">商品价税属性：</span>
								<div class="regular">
									<el-checkbox label="价格固定" name="type" v-model="form.IsPriceFixed"></el-checkbox>
									<el-checkbox label="税率固定" name="type" v-model="form.IsTaxFixed"></el-checkbox>
								</div>
							</div>
						</div>
					</div>
					
					<div class="titleBox">联系方式</div>
					<div class="piecesBox">
						<div class="twoPieces">
							<div class="inputBox">
								<span class="headline">联系人：</span>
								<div class="regular">
									<el-input v-model="form.Contact" ></el-input>
								</div>
							</div>
						</div>
						<div class="twoPieces">
							<div class="inputBox">
								<span class="headline">性别：</span>
								<div class="regular">
									<el-radio-group v-model="form.ContactSex">
									  <el-radio :label="1">男</el-radio>
									  <el-radio :label="0">女</el-radio>
									</el-radio-group>
								</div>
							</div>
						</div>
						<div class="twoPieces">
							<div class="inputBox">
								<span class="headline">联系电话：</span>
								<div class="regular">
									<el-input v-model="form.Mobile" ></el-input>
								</div>
							</div>
						</div>
						<div class="twoPieces">
							<div class="inputBox">
								<span class="headline">联系地址：</span>
								<div class="regular">
									<el-input v-model="form.ContactAddress" ></el-input>
								</div>
							</div>
						</div>
						<div class="twoPieces">
							<div class="inputBox">
								<span class="headline">职务：</span>
								<div class="regular">
									<el-input v-model="form.ContactPost" ></el-input>
								</div>
							</div>
						</div>
						<div class="twoPieces">
							<div class="inputBox">
								<span class="headline">邮编：</span>
								<div class="mini">
									<el-input v-model="form.ZIPCode" ></el-input>
								</div>
							</div>
						</div>
						<div class="twoPieces">
							<div class="inputBox">
								<span class="headline">邮箱：</span>
								<div class="regular">
									<el-input v-model="form.ContactEmail" ></el-input>
								</div>
							</div>
						</div>
					</div>
					
					<div class="titleBox">登录账号</div>
					<div class="piecesBox">
						<span class="Tip"><i class="el-icon-warning-outline"></i>用于设置供应商登录管理后台的账号和密码，如果保存时，未填写登录账号和登录密码，则登录账号默认为“供应商编号”，密码默认为“888888”。</span>
						<div class="twoPieces">
							<div class="inputBox">
								<span class="headline">登录账号：</span>
								<div class="regular">
									<el-input v-model="form.AccountLogin"></el-input>
								</div>
							</div>
						</div>
						<div class="twoPieces">
							<div class="inputBox">
								<span class="headline">登录密码：</span>
								<div class="regular">
									<el-input v-model="form.Password" type="password"></el-input>
								</div>
							</div>
						</div>
						<div class="twoPieces">
							<div class="inputBox">
								<span class="headline">状态：</span>
								<div class="regular">
									<el-radio-group v-model="form.ActiveStatus">
									  <el-radio :label="1">启用</el-radio>
									  <el-radio :label="0">停用</el-radio>
									</el-radio-group>
								</div>
							</div>
						</div>
					</div>

					
					<div class="TracingPointFoot">
						<button class="reset" @click="closeThisRouter">关闭</button>
						<button class="search" @click="eventSave">保存</button>
					</div>
				</div>
				
    </div>
</template>

<script src="./vmModule.js"></script>

<style scoped>
.TracingPointFoot button{height: 36px; padding: 0 50px;}
.all>>>.el-radio__inner{width: 16px; height: 16px;}
.all>>>.el-radio__label{padding-left: 6px;}
.all>>>.el-radio__inner::after{width: 6px; height: 6px;}
.all>>>.el-checkbox__inner{width: 16px; height: 16px;}
.all>>>.el-checkbox__label{padding-left: 6px;}
.all>>>.el-checkbox__inner::after{top:2px; left: 5px;}
.piecesBox,.piecesBoxLine{max-width: 1030px;}
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{margin-bottom: 15px;}
.onePieces>.inputBox, .twoPieces>.inputBox,.onePieces>.title, .twoPieces>.title{margin-bottom: 15px;}
</style>
