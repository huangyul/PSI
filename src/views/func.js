import $ from 'jquery'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import JsBarcode from 'jsbarcode'
import table2excel from 'js-table2excel'
class func {
	static that = null;
	//判断搜索栏是否显示下拉和是否左对齐
	static SearchJudge() {
		//整个搜索div的宽度
		var searchBoxWidth = $(".all .searchBox").outerWidth();
		//右边按钮的宽度
		var operationWidth = $(".all .searchBox .operation").outerWidth(true);
		//左边内容的宽度
		var conditionsBoxWidth = searchBoxWidth - operationWidth;
		//一整个搜索框内容的宽度
		var boxWidth = $(".all .searchBox .conditions .box").outerWidth(true);
		//一整个搜索框内容的显示数量
		var boxIndex = $(".all .searchBox .conditions .box:visible").length;
		if((boxIndex * boxWidth) > conditionsBoxWidth){
			$(".all .searchBox .operation i").click(function () {
				$(this).toggleClass("down");
				$(this).parent().parent().toggleClass("down");
			});
			$(".all .searchBox .operation i").click();
		}else{
			$(".all .searchBox .operation i").hide();
			$(".all .searchBox .conditions").css("flex","none");
		}
	}
	//判断商品弹窗搜索栏是否左对齐
	static DialogSearchJudge() {
		setTimeout(function(){
			//整个搜索div的宽度
			var searchBoxWidth = $(".all .dialogVisibleSearch .searchBox").outerWidth();
			//右边按钮的宽度
			var operationWidth = $(".all .dialogVisibleSearch .searchBox .operation").outerWidth(true);
			//左边内容的宽度
			var conditionsBoxWidth = searchBoxWidth - operationWidth;
			//一整个搜索框内容的宽度
			var boxWidth = $(".all .dialogVisibleSearch .searchBox .conditions .box").outerWidth(true);
			//一整个搜索框内容的显示数量
			var boxIndex = $(".all .dialogVisibleSearch .searchBox .conditions .box:visible").length;
			if((boxIndex * boxWidth) > conditionsBoxWidth){
				
			}else{
				$(".all .dialogVisibleSearch .searchBox .conditions").css("flex","none");
			}
		}, 100);
	}
	
	static uploadButtonCSS() {
		$(".uploadBox button").click(function () {
			$(this).parent().find("input").click();
		})
	}

	static TracingPointFunc() {
		//根据内容动态生成头部描点
		var rightDivUlHtml = "";
		$(".all .TracingPointBody .titleBox").each(function (index, element) {
			var text = $(this).text();
			if (index === 0) {
				rightDivUlHtml = rightDivUlHtml + "<div class='box active'><div class='point'></div><p>" + text + "</p></div>";
			} else {
				rightDivUlHtml = rightDivUlHtml + "<div class='box'><div class='point'></div><p>" + text + "</p></div>";
			}
		})
		$(".all .TracingPointContainer .append").empty();
		$(".all .TracingPointContainer .append").append(rightDivUlHtml);

		//头部描点控制内容
		$(".all .TracingPointTop .TracingPointContainer .append .box").click(function () {
			$(this).siblings().removeClass("active");
			$(this).addClass("active");
			var name = $(this).find("p").text();
			$(".TracingPointBody .titleBox").each(function (i, e) {
				var text = $(this).text();
				if (name == text) {
					var sum = $(this).offset().top - $(this).parent().offset().top + $(this).parent().scrollTop();
					$(this).parent().scrollTop(sum - 20);
					//先定位，再展开
					$(this).find("i").addClass("spin");
					$(this).next().show();
				}
			})
		})

		//内容反馈头部描点
		$(".TracingPointBody").on('scroll', function () {
			var scrollHeight = $(".TracingPointBody").scrollTop();
			var allHeight = $('.TracingPointBody').prop("scrollHeight");
			var boxHeight = $(".TracingPointBody").outerHeight();
			var sum = scrollHeight + boxHeight;
			// if (sum >= allHeight) {
			// 	$(this).prev().find(".TracingPointContainer .box").removeClass("active");
			// 	$(this).prev().find(".TracingPointContainer .box:last").addClass("active");
			// }
			var that = $(this);//$(".TracingPointBody")
			var thatBox = $(this).prev().find(".TracingPointContainer .box");
			$(this).find(".titleBox").each(function (i, e) {
				//each里面的$(this)是function返回的this不是外面的this
				var sumB = $(this).offset().top - that.offset().top;
				if (sumB < 150 && sumB > 15) {
					var text = $(this).text();
					thatBox.each(function (i, e) {
						var name = $(this).find("p").text();
						if (name == text) {
							thatBox.removeClass("active");
							$(this).addClass("active");
						}
					})
				}
			})

		})
		
		//伸缩模块
		//$(".all .TracingPointBody .stretch").hide();
		$(".all .TracingPointBody .titleBox").click(function(){
			$(this).find("i").toggleClass("spin");
			$(this).next().toggle();
		})

	}
	//快速导出没有图片表格，参数为表格id
	static exportTableFunc(val) {
		// 获取表格元素
		//const el = this.$refs.exportTableRef1.$el
		const el = $("#" + val);
		// 文件名
		const filename = '导出.xlsx'
		/* generate workbook object from table */
		//const wb = XLSX.utils.table_to_book(el)
		/* 或者用id */
		const wb = XLSX.utils.table_to_book(document.getElementById(val))
		/* get binary string as output */
		const wbout = XLSX.write(wb, {
			bookType: 'xlsx',
			bookSST: true,
			type: 'array',
		})
		try {
			FileSaver.saveAs(new Blob([wbout], {
				type: 'application/octet-stream'
			}), filename)
		} catch (e) {
			console.log(e)
		}
		return wbout
	}

	//导出带有图片表格，参数为表头，数据，导出表的名字，下面是表头例子
	/** column数据的说明 */
	//title为column的标题
	//key为column对应的key
	//type默认是text，若为图片格式type为image , 并且可以设置图片的宽高
	// const column = [
	//   {
	//     title: '编号', 
	//     key: 'Code',
	//     type: 'text'
	//   },
	// 	{
	// 	  title: '物流公司名称', 
	// 	  key: 'Name',
	// 	  type: 'text'
	// 	},
	//   {
	//     title: '图标',
	//     key: 'PathUrl',
	//     type: 'image',
	//     width: 50,
	//     height: 50
	//   },
	//   {
	//     title: '状态',
	//     key: 'Status',
	//     type: 'text'
	//   },
	// 	{
	// 	  title: '备注',
	// 	  key: 'Remark',
	// 	  type: 'text'
	// 	},
	// ]
	static exportImgTableFunc(column, data, title) {
		table2excel(column, data, title);
	}

	//导入Excel表格
	static importExcel(e, callback) {
		//console.log(e);
		let that = this
		// 错误情况判断
		const files = e.target.files
		if (files.length <= 0) {
			return false;
		} else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
			this.$message({
				message: "上传格式不正确，请上传xls或者xlsx格式",
				type: "warning"
			});
			return false
		} else {
			that.upload_file = files[0].name
		}
		// 读取表格
		const fileReader = new FileReader()
		fileReader.onload = ev => {
			try {
				const data = ev.target.result;
				const workbook = XLSX.read(data, {
					type: "binary"
				})
				// 读取第一张表
				const wsname = workbook.SheetNames[0];
				const wsdata = XLSX.utils.sheet_to_json(workbook.Sheets[wsname], { defval: '' });
				// 打印 ws 就可以看到读取出的表格数据
				for (var d of wsdata) {
					var index = 0;
					for (var key in d) {
						d["Cell_" + index] = d[key];
						delete d[key];
						index++;
					}
				}
				callback(wsdata);
			} catch (e) {
				return false
			}
		}
		fileReader.readAsBinaryString(files[0])
	}

	static formatTimeToStr(times, pattern) {
		// 对Date的扩展，将 Date 转化为指定格式的String
		// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
		// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
		// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
		// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
		Date.prototype.Format = function (fmt) {
			var o = {
				"M+": this.getMonth() + 1, //月份
				"d+": this.getDate(), //日
				"h+": this.getHours(), //小时
				"m+": this.getMinutes(), //分
				"s+": this.getSeconds(), //秒
				"q+": Math.floor((this.getMonth() + 3) / 3), //季度
				"S": this.getMilliseconds() //毫秒
			};
			if (/(y+)/.test(fmt))
				fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o)
				if (new RegExp("(" + k + ")").test(fmt))
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		};
		var d = new Date(times).Format("yyyy-MM-dd hh:mm:ss");
		if (pattern) {
			d = new Date(times).Format(pattern);
		}
		return d.toLocaleString();
	}

	// 获取图片转base64,因为是异步的不能直接返回结果需要用下面的回调返回结果
	// func.getBase64(file).then(res => {
	// 	console.log(res);
	// })
	static getBase64(file) {
		file = file.raw;
		return new Promise(function (resolve, reject) {
			const reader = new FileReader()
			let imgResult = ''
			reader.readAsDataURL(file)
			reader.onload = function () {
				imgResult = reader.result
			}
			reader.onerror = function (error) {
				reject(error)
			}
			reader.onloadend = function () {
				imgResult = imgResult.split(',');
				if (imgResult.length > 0) {
					imgResult = 'data:image/jpeg;base64,' + imgResult[1];
				}
				resolve(imgResult)
			}
		})
	}

	//上传多张图片转base64
	//用法如下，this.PhotoList是你的图片数组，this.formPhotoList是获得结果的数组，i=0,callback是方法
	// var that = this;
	// this.formPhotoList = [];
	// func.getBase64List(this.PhotoList,this.formPhotoList,0,function(data){
	// 	that.formPhotoList = data;
	//   console.log(that.formPhotoList);
	// });
	static getBase64List(list, res, i, callback) {
		func.getBase64(list[i]).then(data => {
			res.push(data);
			i++;
			if (i < list.length) {
				func.getBase64List(list, res, i, callback);
			} else {
				callback(res);
			}
		})
	}



	/**
		 * @see 把文件转换为base64字符
		 * @param obj:document file input元素
		 * @param callback:function 回调函数
		 * @param fsize:int(字节) 文件最大的大小 默认100K
		 * @param type:array 支持的后缀名(小写)
		 * @return: {success:0出错/1中断/2类型不支持/3文件过大/4成功,
		 * 		data:{data:string base64,filename:string文件名,type:string文件后缀名}
		}
		*/
	static file2Base64(obj, callback, fsize, ftype) {
		var maxsize = 100 * 1024, type = [];
		if (fsize != undefined) maxsize = fsize;
		if (ftype != undefined && $.isArray(ftype)) type = ftype;

		var result = { success: 0, data: { data: '', filename: '', type: '' } }
		if (typeof FileReader == 'undefined') {
			if (callback != undefined && $.isFunction(callback)) {
				result.success = 0;
				callback(result);
			}
			return;
		}
		var dom = '';
		if (obj.html != undefined) {
			dom = obj.get(0);
		} else if (obj.nodeType != undefined) {
			dom = obj;
		}
		if (dom.files == undefined || dom.value == '') {
			if (callback != undefined && $.isFunction(callback)) {
				result.success = 0;
				callback(result);
			}
			return;
		}
		var file = dom.files[0];
		var tmp = file.name.split('.');
		var filetype = tmp[tmp.length - 1];
		result.data.filename = file.name;
		result.data.type = filetype;
		if (type.length > 0 && $.inArray(filetype.toLowerCase(), type) == -1) {
			if (callback != undefined && $.isFunction(callback)) {
				result.success = 2;
				callback(result);
			}
			return;
		}
		if (file.size > maxsize) {
			if (callback != undefined && $.isFunction(callback)) {
				result.success = 3;
				callback(result);
			}
			return;
		}
		var reader = new FileReader();
		reader.readAsDataURL(file);
		//中断事件
		reader.onabort = function () {
			if (callback != undefined && $.isFunction(callback)) {
				result.success = 1;
				callback(result);
			}
		};
		//出错事件
		reader.onerror = function () {
			if (callback != undefined && $.isFunction(callback)) {
				result.success = 0;
				callback(result);
			}
		};
		//完成事件
		reader.onload = function () {
			if (callback != undefined && $.isFunction(callback)) {
				result.success = 4;
				var tmp_data = this.result;
				var index = tmp_data.lastIndexOf(',') + 1;
				result.data.data = tmp_data.slice(index < tmp_data.length ? index : 0);
				callback(result);
			}
		};
	}

	//生成条形码
	static Barcode(id, val) {
		id = '#' + id;
		JsBarcode(id, val, {
			format: "CODE39",//选择要使用的条形码类型
			width: 1,//设置条之间的宽度
			height: 70,//高度
			displayValue: true,//是否在条形码下方显示文字
			//fontOptions:"bold italic",//使文字加粗体或变斜体
			//font:"fantasy",//设置文本的字体
			textAlign: "content",//设置文本的水平对齐方式
			textPosition: "bottom",//设置文本的垂直位置
			textMargin: 0,//设置条形码和文本之间的间距
			fontSize: 18,//设置文本的大小
			background: "#F0F1F1",//设置条形码的背景
			lineColor: "#000",//设置条和文本的颜色。
			margin: 10,//设置条形码周围的空白边距
			marginLeft: 20,
			marginRight: 20,
		})
	}

	//递归品类List
	static recursiveCategoryTree(data) {
		// 循环遍历json数据
		for (var i = 0; i < data.length; i++) {

			if (data[i].children.length < 1) {
				// children若为空数组，则将children设为undefined
				data[i].children = undefined;
			} else {
				// children若不为空数组，则继续 递归调用 本方法
				func.recursiveCategoryTree(data[i].children);
			}
		}
		return data;
	}

	//参数说明：tableData：要合并的表格，colName：根据某个参数相同来合并
	static oneSetrowspans(tableData, colName) {
		// 先给所有的数据都加一个v.rowspan = 1
		tableData.forEach(v => {
			v.rowspan = 1;
		});
		// 双层循环
		for (let i = 0; i < tableData.length; i++) {
			// 内层循环，上面已经给所有的行都加了v.rowspan = 1
			// 这里进行判断
			// 如果当前行的colName和下一行的colName相等
			// 就把当前v.rowspan + 1
			// 下一行的v.rowspan - 1
			for (let j = i + 1; j < tableData.length; j++) {
				//此处可根据相同字段进行合并，此处是根据的colName
				if (tableData[i][colName] === tableData[j][colName]) {
					tableData[i].rowspan++;
					tableData[j].rowspan--;
				}
			}
			// 这里跳过已经重复的数据
			i = i + tableData[i].rowspan - 1;
		}
		return tableData;
	}

	static uuid() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}

	static guid() {
		return (func.uuid() + func.uuid() + "-" + func.uuid() + "-" + func.uuid() + "-" + func.uuid() + "-" + func.uuid() + func.uuid() + func.uuid());
	}

	//随机生成大小写数字字符串
	static randomString(strLength) {
		var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		var randomString = '';
		for (var i = 0; i < strLength; i++) {
			var randomPoz = Math.floor(Math.random() * charSet.length);
			randomString += charSet.substring(randomPoz, randomPoz + 1);
		}
		return randomString;
	}
	//随机数字字符串
	static randomNum(strLength) {
		var charSet = '0123456789';
		var randomString = '';
		for (var i = 0; i < strLength; i++) {
			var randomPoz = Math.floor(Math.random() * charSet.length);
			randomString += charSet.substring(randomPoz, randomPoz + 1);
		}
		return randomString;
	}
	
	//计算字符串字节
	static GetStrLength(str) {
		return str.replace(/[\u0391-\uFFE5]/g,"aa").length; //"g" 表示全局匹配
	}

	//整页loading
	static backgroundLoading(str) {
		return this.that.$loading({
			lock: true,
			text: str,
			spinner: 'el-icon-loading',
			background: 'rgba(0, 0, 0, 0.7)'
		  });
	}

}


export default func;
