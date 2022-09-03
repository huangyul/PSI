//端口
//var port = "http://192.168.66.131:8055";
//var port = "";
var port = localStorage.getItem("apiUrl");
//退货
class returns{
	//生成编号
	static GeneratedNumber = port+'/api/UserLoginInfo/GetCurrentCode';
	//退货管理
	static ReturnsManagement = {
		//查询
		query:port+'/api/PSIStoreReturnProduct/GetReturnProduct',
		//查询单个退货单
		queryOne:port+'/api/PSIStoreReturnProduct/GetModifyReturnProduct',
		//退货申请添加商品
		addProduct:port+'/api/PSIStoreReturnProduct/GetCheckinProduct',
		//更新
		update:port+'/api/PSIStoreReturnProduct/UpdateStoreReturnProductInfo',
		//新增
		add:port+'/api/PSIStoreReturnProduct/CreateStoreReturnProduct',
		//提交退货明细信息
		submit:port+'/api/PSIStoreReturnProduct/CommitReturnProduct',
		//审核通过
		approved:port+'/api/PSIStoreReturnProduct/UpdateApproveInfo',
		//审核拒绝
		reject:port+'/api/PSIStoreReturnProduct/UpdateRejectInfo',
		//删除
		delete:port+'/api/PSIStoreReturnProduct/DeleteReturnProduct',
		//导出
		Export:port+'/api/PSIStoreReturnProduct/GetReturnProductToExcel',
	}
	
	//退库管理
	static CancelManagement = {
		//查询退库信息
		query:port+'/api/CancelStock/GetCancelStockInfo',
		//查询待选择的退库商品
		addProduct:port+'/api/CancelStock/GetCancelCheckinProduct',
		//创建退库信息
		add:port+'/api/CancelStock/CreateStoreCancelStock',
		//提交退库信息
		submit:port+'/api/CancelStock/CommitCancelStock',
		//审核通过退库信息
		approved:port+'/api/CancelStock/CancelStoreApproveInfo',
		//审核拒绝
		reject:port+'/api/CancelStock/CancelStockRejectInfo',
		//删除退库信息
		delete:port+'/api/CancelStock/DeleteCancelStock',
		//打印退库信息
		print:port+'/api/CancelStock/GetPrintCancelStockInfo',
	}
	
	
	
}


export default returns;