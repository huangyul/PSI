<template>
	<div class="SupplierLogin">
		<div class="loginBox">
			<!-- <h1>供应商登录</h1>
			<div class="inputBox">
				<span>账号</span>
				<div class="large">
					<el-input v-model="account"></el-input>
				</div>
			</div>
			<div class="inputBox">
				<span>密码</span>
				<div class="large">
					<el-input v-model="password"></el-input>
				</div>
			</div>
			<div class="inputBox">
				<span>验证码</span>
				<div class="large" style="display: flex; align-items: center;">
					<el-input v-model="verificationCode" style="flex:1;"></el-input>
					<identify :identifyCode="identifyCode" @click="eventChangeCode()" style="flex:none; margin-left: 10px;"></identify>
				</div>
			</div> -->
			<!-- <button class="search" @click="eventLogin">登录</button> -->
			<!-- <img src="http://192.168.66.156:2021/image/20211117090134.png" alt=""> -->
			<!-- <el-upload
				accept=".jpg,.png,.jpeg,.JPG,.JPEG"
			  class="upload-demo"
			  action=""
				:http-request="eventUploadImg"
			  :on-preview="handlePreview"
			  :on-remove="handleRemove"
			  :before-remove="beforeRemove"
			  multiple
			  :limit="3"
			  :on-exceed="handleExceed"
			  :file-list="fileList">
			  <el-button size="small" type="primary">点击上传</el-button>
			  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
			<div>
				<span class="file-box">
					Excel上传
					<input 
					type="file" 
					accept=".xls,.xlsx" 
					class="upload-file" 
					@change="Excel($event,submit_form)" />
				</span>
			</div>
			<div>
				<button @click="a">导出</button>
			</div>
			
			<div>上传excel</div>
			<input type="file" @change="eventUploadExcel">
			
			<div class="ceshi">
				<el-button>默认按钮1</el-button>
			</div> -->
			<!-- <div id="printMe" class="printBox draggable" style="height: 200px; width: 200px; overflow: auto;">
				<div class="pageBox">
					<h1>123</h1>
					<h1>123</h1>
				</div>
				<div class="pageBox">456</div>
				<div class="pageBox">789</div>
			</div>
			<button v-print="'#printMe'">Print</button> -->
			<!-- <div>拖拽</div>
			<div id="printMe" class="printBox draggable" style="height: 200px; width: 200px; overflow: auto;">
				<draggable v-model="myArray" :options="{draggable:'.item'}">
				    <div v-for="element in myArray" :key="element.id" class="item pageBox">
				        {{element.name}}
				    </div>
				</draggable>
			</div>
			<button v-print="'#printMe'">Print</button> -->
<!-- 			<draggable v-model="myArray" :options="{draggable:'.item'}">
			    <div v-for="element in myArray" :key="element.id" class="item pageBox">
			        {{element.name}}
			    </div>
			</draggable> -->
			
				<div id="form1">
					<div id="a1">
						<span style="color: red;">123</span>
					</div>
					<div id="a2">
						<span style="color: blue;">456</span>
					</div>
					<div id="a3">
						<div id="val-1" style="color: green; width: 70px;">{value}</div>
					</div>
				</div>
			<el-button class="form_button" type="primary" @click="singlePrint" icon="el-icon-printer">打印设置</el-button>
			<el-button class="form_button" type="primary" @click="singlePrint_1" icon="el-icon-printer">打印预览</el-button>
			<el-button class="form_button" type="primary" @click="singlePrint_2" icon="el-icon-printer">打印</el-button>
			
			
			
			
			
			
			
			
		</div>
	</div>
</template>

<script src="./vmModule.js"></script>
<style scoped>
	.SupplierLogin {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		padding: 100px 0;
	}

	.SupplierLogin .loginBox {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.SupplierLogin .loginBox h1 {
		text-align: center;
		margin-bottom: 30px;
	}

	.SupplierLogin .loginBox .inputBox {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		margin-right: 110px;
	}

	.SupplierLogin .loginBox .inputBox span {
		width: 100px;
		text-align: right;
		margin-right: 10px;
	}
</style>
