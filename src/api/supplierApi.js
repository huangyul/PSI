//端口
//var port = "http://192.168.66.131:8055";
//var port = "";
var port = localStorage.getItem("apiUrl");
//供应商
class supplier{
	//生成编号
	static GeneratedNumber = '/api/UserLoginInfo/GetCurrentCode';
	//发货一览
	static DeliveryView = {
		//查询
		query:'/api/PurchaseDelivery/GetPurchaseOrderListInfo',
		//查询单个信息
		queryOne:'/api/PurchaseDelivery/GetPurDeliveryInfo',
		//发货保存
		add:'/api/PurchaseDelivery/CreatePurchaseDelivery',
		//导出
		export: '/api/PurchaseDelivery/GetPurchaseOrderListInfoToExcel',
		//获取打印数据打印
		getPrintData: '/api/PurchaseDelivery/GetPurchase_OrderItemToPrintList',
	}
	
	//发货明细
	static DeliveryDetail = {
		//查询
		query:'/api/PurchaseDelivery/GetPurchaseDeliveryInfo',
		//撤销发货
		undo:'/api/PurchaseDelivery/CancelDelivery',
	}
	
	//对账单
	static Statements = {
		//查询
		query:'/api/PurchaseDelivery/GetStatementOfAccountList',
	}
	
	//供应商登录
	static SupplierLogin = {
		//登录
		login:'/api/SupplierInfo/SupplierLogin',
	}
	
	
}


export default supplier;
