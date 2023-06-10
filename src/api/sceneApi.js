//端口
//var port = "http://192.168.66.131:8055";
//var port = "";
var port = localStorage.getItem("apiUrl");
//景品
class scene{
	//生成编号
	static GeneratedNumber = '/api/UserLoginInfo/GetCurrentCode';
	//景品销售出库
	static SceneSalesOutbound = {
		//查询
		query:'/api/ProductSaleOutIn/GetProductSaleOutList',
		//保存
		save:'/api/ProductSaleOutIn/SaveSaleOutSurplusNum',
	}
	
	//景品销售回库
	static SceneSalesInbound = {
		//查询
		query:'/api/ProductSaleOutIn/GetProductSaleInList',
		//保存
		save:'/api/ProductSaleOutIn/SaveSaleInBackNum',
	}
	
	//景品一览
	static SceneSelesList = {
		//查询
		GetProductSaleInOutList:'/api/ProductSaleOutIn/GetProductSaleInOutList',
		//导出
		Export:'/api/ProductSaleOutIn/GetProductSaleInOutToExcel',
	}

	//景品率查询
	static SceneRateQueryList = {
		//景品率查询-按机位排序
        SearchByNoseNum: '/api/ProductSaleOutIn/GetProductSaleInOutRate',
        //景品率查询-按机器排序
        SearchByAssetNum: '/api/ProductSaleOutIn/GetProductSaleInOutRate',
        //景品率查询-按机器分组排序
        SearchByGroupId: '/api/ProductSaleOutIn/GetProductSaleInOutRate',
				//导出
				Export:'/api/ProductSaleOutIn/GetSaleInOutRateToExcel',
	}
}


export default scene;
