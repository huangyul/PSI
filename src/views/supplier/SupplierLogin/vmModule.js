import $ from 'jquery'
import supplier from '../../../api/supplierApi.js'
import func from '../../func.js'
import XLSX from 'xlsx'
import axios from 'axios';
import {
	ElMessage,
	ElMessageBox
} from "element-plus"
import identify from './Identify.vue'
import { VueDraggableNext } from 'vue-draggable-next'

// import { getLodop } from './LodopFuncs.js'
// import { PrintAccount } from './doPrint.js'
import {getLodop} from '../../LodopFuncs.js'
export default {
	name: "SupplierLogin",
	// 注册验证码组件
	components: {
		draggable: VueDraggableNext,
		identify,
	},
	data() {
		return {
			username: '',
			addDate: '',
			account: '',
			password: '',
			verificationCode: '',
			// 验证码初始值
			identifyCode: '1234',
			// 验证码的随机取值范围
			identifyCodes: '1234567890',


			fileList: [],
			token: localStorage.getItem("Token"),
			
			drag:false,
			      //定义要被拖拽对象的数组
			      myArray:[
			        {people:'cn',id:1,name:'www.itxst.com111'},
			        {people:'cn',id:2,name:'www.baidu.com222'},
			        {people:'cn',id:3,name:'www.taobao.com333'},
			        {people:'us',id:4,name:'www.google.com444'}
			        ] ,
			MyData:'',
			testSum:0,
		}
	},
	methods: {
		// 生成一个随机整数  randomNum(0, 10) 0 到 10 的随机整数， 包含 0 和 10
		funcRandomNum(min, max) {
			max = max + 1
			return Math.floor(Math.random() * (max - min) + min)
		},
		// 随机生成验证码字符串
		funcMakeCode(data, len) {
			for (let i = 0; i < len; i++) {
				this.identifyCode += data[this.funcRandomNum(0, data.length - 1)]
			}
		},
		// 点击验证码刷新验证码
		eventChangeCode() {
			this.identifyCode = ''
			this.funcMakeCode(this.identifyCodes, 4)
		},
		//登录
		eventLogin() {
			if (this.verificationCode == this.identifyCode) {
				console.log("相等");
			} else {
				console.log("不相等");
			}
		},




		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		handlePreview(file) {
			console.log(file);
		},
		handleExceed(files, fileList) {
			this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		},
		beforeRemove(file, fileList) {
			return this.$confirm(`确定移除 ${ file.name }？`);
		},


		//导入Excel表格
		Excel(e, callback) {
			console.log(e.target.files);
			func.importExcel(e, callback);
		},
		//导入Excel表格
		submit_form(data) {
			console.log(data);
			var arr = [];
			for (var item of data) {
				var obj = {
					Code: item.Cell_0,
					remark: item.Cell_26,
				};
				arr.push(obj);
			}
			console.log(arr);
		},


		a() {
			window.location.href = './export/测试.xls';
			return;
			var url =
				'http://192.168.66.131:8011/api/PSIStoreInventory/GetExportData?operationType=1&userName=GroupAdmin&whCode=W211105160308095&startTime=2021-11-01&endTime=2021-11-30&positionCode=&productInfo=&matTypeId=&shopCode=SR003&userType=0&page=1&pageSize=10000&productIds=';
			axios.get(url, {
				responseType: 'blob'
			}).then((res) => {
				console.log(res);
				const link = document.createElement('a') // 首先创建一个a标签毕竟下载是要通过a标签来下载的。
				let blob = new Blob([res.data], {
					type: "application/vnd.ms-excel"
				}) // 第一个参数是后台返回的文件流变量，第二个参数是要转换的类型，由type的值来决定。
				link.href = URL.createObjectURL(blob) // 用URL.createObjectURL方法来创建一个URL对象并赋值给a标签的heft属性。
				link.download = '测试' // 设置文件名字。
				link.click() // 触发点击事件，开始下载。
			}).catch((err) => {
				ElMessage.warning({
					message: err,
					type: 'warning',
				});
			});
		},


		eventUploadImg(a) {
			console.log(a);
			return;
			let mf = new FormData();
			//将图片文件放入mf
			mf.append('file', a.file);
			axios.post('http://192.168.66.131:8055/img/', mf).then((res) => {
				console.log(res);
			}).catch((err) => {
				ElMessage.warning({
					message: err,
					type: 'warning',
				});
			});
		},



		//上传excel到后端
		eventUploadExcel(data) {
			var file = data.target.files[0];
			var name = data.target.files[0].name;
			var formData = new FormData();
			formData.append('file', file);
			formData.append('fileName', name);
			//console.log(formData.get("fileName"));return;
			var url = 'http://192.168.66.131:8011/Excel/Import/';
			axios.post(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}).then((res) => {
				console.log(res);
			}).catch((err) => {
				ElMessage.warning({
					message: err,
					type: 'warning',
				});
			});
		},

		//evt里面有两个值，一个evt.added 和evt.removed  可以分别知道移动元素的ID和删除元素的ID
		    change(evt) {
		      console.log(evt , 'change...')
		    },
		    //start ,end ,add,update, sort, remove 得到的都差不多
		    start(evt) {
		      this.drag = true
		      console.log(evt , 'start...')
		    },
		    end(evt) {
		      console.log(evt , 'end....')
		      this.drag = true
		      evt.item //可以知道拖动的本身
		      evt.to    // 可以知道拖动的目标列表
		      evt.from  // 可以知道之前的列表
		      evt.oldIndex  // 可以知道拖动前的位置
		      evt.newIndex  // 可以知道拖动后的位置
		    },
		    move(evt, originalEvent) {
		      console.log(evt , 'move')
		      console.log(originalEvent) //鼠标位置
		    },
				
				singlePrint() {
					
					//let  LODOP = getLodop();
										var that = this;
					          var LODOP = getLodop();
										var test = '0';
										if(this.MyData === ''){
											LODOP.PRINT_INIT("");
											LODOP.SET_PRINT_MODE("PRINT_SETUP_PROGRAM",true);
											LODOP.SET_PRINT_MODE("PROGRAM_CONTENT_BYVAR",true);

											// LODOP.ADD_PRINT_TEXT(256,61,324,30,test);
											// LODOP.SET_PRINT_STYLEA(0,"FontSize",13);
											// LODOP.SET_PRINT_STYLEA(0,"FontColor","#FF0000");
											// LODOP.SET_PRINT_STYLEA(0,"ContentVName","test");
											
											
											//LODOP.NewPageA();
											
											// LODOP.ADD_PRINT_HTM(88, 200, 100, 20,document.getElementById("a1").innerHTML);
											// LODOP.ADD_PRINT_HTM(88, 300, 100, 20,document.getElementById("a2").innerHTML);
											// LODOP.ADD_PRINT_HTM(88, 400, 100, 20,document.getElementById("a3").innerHTML);
											// var htmlTotal = '<table  cellpadding="0" cellspacing="0" border="1" style="border-collapse:collapse;border-spacing:0;margin:0;padding:0;"><thead><tr><th>id</th><th>编号</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr><tr><td>2</td><td>3</td></tr></tbody></table>';
											// LODOP.ADD_PRINT_TABLE(200,200,750,100,htmlTotal);
											LODOP.ADD_PRINT_BARCODE(0,0,250,86,"Code39","A11111111111111");
											LODOP.SET_PRINT_STYLEA(0,"AlignJustify",2);
											LODOP.ADD_PRINT_BARCODE(0,300,250,86,"EAN128C","B11111111111111111");
											LODOP.SET_PRINT_STYLEA(0,"AlignJustify",2);
											LODOP.ADD_PRINT_BARCODE(400,10,250,86,"EAN128C","C1111111111111111111");
											LODOP.SET_PRINT_STYLEA(0,"AlignJustify",2);
											LODOP.ADD_PRINT_BARCODE(400,10,250,86,"EAN128C","D11111111111111111111");
											LODOP.SET_PRINT_STYLEA(0,"AlignJustify",2);
											LODOP.ADD_PRINT_BARCODE(400,10,250,86,"EAN128C","E111111111111111111111");
											LODOP.SET_PRINT_STYLEA(0,"AlignJustify",2);
											LODOP.ADD_PRINT_BARCODE(400,10,250,86,"EAN128C","F11111111B111111111111111");
											LODOP.SET_PRINT_STYLEA(0,"AlignJustify",2);
											// LODOP.ADD_PRINT_TEXT(140,265,100,40,"演示发货地址信息");
											// LODOP.SET_PRINT_STYLEA(0,"ContentVName","test");//设置内容参数的变量名
											// LODOP.SET_PRINT_STYLEA(0,"FontSize",13);
											// LODOP.SET_PRINT_STYLEA(0,"FontColor","#FF0000");
											
											// LODOP.SET_PRINT_MODE("PROGRAM_CONTENT_BYVAR",true); //可以设置变量名
											// LODOP.SET_PRINT_MODE("PRINT_SETUP_PROGRAM",true); //一定要加上这句
											// LODOP.NewPageA();
											// LODOP.ADD_PRINT_HTM(88, 200, 100, 20,document.getElementById("a1").innerHTML);
											// LODOP.ADD_PRINT_HTM(88, 300, 100, 20,document.getElementById("a2").innerHTML);
											// LODOP.ADD_PRINT_HTM(88, 400, 100, 20,document.getElementById("a3").innerHTML);
											// var htmlTotal = '<table  cellpadding="0" cellspacing="0" border="1" style="border-collapse:collapse;border-spacing:0;margin:0;padding:0;"><thead><tr><th>id</th><th>编号</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr><tr><td>2</td><td>3</td></tr></tbody></table>';
											// LODOP.ADD_PRINT_TABLE(200,200,750,100,htmlTotal);
											// LODOP.ADD_PRINT_BARCODE(400,10,250,86,"EAN128C","A123456789012");
											// LODOP.SET_PRINT_STYLEA(0,"AlignJustify",2);
											// var a = '{value4}'
											// LODOP.ADD_PRINT_TEXT(140,265,100,40,a);
											
											// LODOP.SET_PRINT_MODE("PRINT_SETUP_PROGRAM",true);
											
										}else{
											eval(this.MyData);
										}
					
					          //窗口关闭后，回调函数中保存的设计代码
					          if (LODOP.CVERSION) CLODOP.On_Return=function(TaskID,Value){
					              //console.log('taskId:' + TaskID);
					              //console.log('Value:' + Value);  //这个是返回的完整的设计代码
					              //ww.ajaxSave(ctx+'/printTemplate/getContent',Value);
												that.MyData = Value;
					          };
					
					          LODOP.PRINT_DESIGN(); //打印设计或者打印维护需要放到最后
					//LODOP.PRINT_DESIGN();		
					
					
					
					
					
				},
				singlePrint_1(){
					//var test = '999999999999999';
					var LODOP = getLodop();
					var params = JSON.parse(JSON.stringify(this.MyData));
					//删除初始化语句
					var str = 'LODOP.PRINT_INIT("");';
					params = params.replaceAll(str,"");
					//console.log(params)
					for (var i = 1; i < 8; i++) {
								var test = i;
								LODOP.NewPageA();
								eval(params);			
					}
					LODOP.PREVIEW()
					return;
					//eval(params);
					//打印
					//LODOP.PRINT()
					//预览
					LODOP.PREVIEW()
				},
				singlePrint_2(){
					//var test = '999999999999999';
					var LODOP = getLodop();
					var params = JSON.parse(JSON.stringify(this.MyData));
					//删除初始化语句
					var str = 'LODOP.PRINT_INIT("");';
					params = params.replaceAll(str,"");
					//console.log(params)
					// for (var i = 1; i < 8; i++) {
					// 			var test = i;
					// 			LODOP.NewPageA();
					// 			eval(params);			
					// }
					eval(params);	
					LODOP.PRINT()
					return;
					//eval(params);
					//打印
					//LODOP.PRINT()
					//预览
					LODOP.PREVIEW()
				},
				abcd(){
					var LODOP=getLodop();
					LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_获得程序代码");
					LODOP.SET_PRINT_MODE("PRINT_SETUP_PROGRAM",true);
					LODOP.SET_PRINT_MODE("PROGRAM_CONTENT_BYVAR",true);
					LODOP.ADD_PRINT_TEXTA("htm-1",12,228,317,30,"关闭本设计窗口会看到程序代码");
					LODOP.SET_PRINT_STYLEA(0,"FontSize",15);
					LODOP.ADD_PRINT_ELLIPSE(168,29,100,60,0,1);
					LODOP.ADD_PRINT_BARCODE(190,483,213,60,"128A","123456789012");
					LODOP.SET_PRINT_STYLEA(0,"Color","#FF00FF");
					LODOP.ADD_PRINT_CHART(296,42,604,185,1,"");
					LODOP.ADD_PRINT_SHAPE(4,51,195,239,128,0,1,"#0080FF");
					LODOP.ADD_PRINT_HTM(141,377,261,161,"<!DOCTYPE>\n<style>table,td{border:1px solid black;}</style>\n<body style=\"background-color:transparent;margin:0\" >\n<table>\n<tr>\n<td>透明超文本表格</td>\n<td>预览就看出透明</td>\n<td>预览才看出透明</td>\n</tr>\n<tr>\n<td>非表格也能透明</td>\n<td>预览看出透明</td>\n<td>预览看出透明</td>\n</tr>\n</table>");
					//LODOP.ADD_PRINT_TEXT(256,61,324,30,MyData);
					LODOP.SET_PRINT_STYLEA(0,"FontSize",13);
					LODOP.SET_PRINT_STYLEA(0,"FontColor","#FF0000");
					LODOP.SET_PRINT_STYLEA(0,"ContentVName","MyData");
					//打印
					//LODOP.PRINT()
					//预览
					LODOP.PREVIEW()
				},


				

		
	},
	mounted() {
		// 刷新页面就生成随机验证码
		this.identifyCode = ''
		this.funcMakeCode(this.identifyCodes, 4)
		var a = '<el-button>默认按钮2</el-button>';
		$(".ceshi").append(a);
		
		
	},
	watch: {

	},
};
