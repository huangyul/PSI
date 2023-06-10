//端口
//var port = "http://192.168.66.131:8055";
//var port = "";
var port = localStorage.getItem("apiUrl");
//退货
class report{
	//采购入库汇总
	static PurchaseInLibrarySummary = {
		//查询
		query:'/api/Report/GetPurchaseCheckInReport',
		//导出
		Export:'/api/Report/GetPurchaseCheckInReportToExcel',
	}
	
	//出库汇总表
	static OutLibrarySummary = {
		//查询
		query:'/api/Report/GetStoreCheckOutReport',
		//导出
		Export:'/api/Report/GetStoreCheckOutToExcel',
	}
	//调拨单汇总
	static RequisitionSummary = {
		//查询
		query:'/api/Report/GetStoreTransferReport',
		//导出
		Export:'/api/Report/GetStoreTransferToExcel',
	}
	
	//盘点汇总
	static CheckSummary = {
		//查询
		query:'/api/PSIStoreInventory/GetPSI_Store_InventoryListInfo',
		//导出
		Export:'/api/PSIStoreInventory/GetPSI_Store_InventoryListToExcelInfo',
	}
	
	//进销存汇总
	static EntersSellsSaves = {
		//查询
		query:'/api/PSIStoreProduct/GetProduct_SummaryListInfo',
		//导出
		Export:'/api/PSIStoreProduct/GetProduct_SummaryListToExcelInfo',
	}
	
	//在库滞留查询
	static StockStrandedCheck = {
		//查询
		query:'/api/PSIStoreProduct/GetDetentionInReservoir',
		//导出
		Export:'/api/PSIStoreProduct/GetDetentionInReservoirToExcel',
	}
		
}


export default report;
