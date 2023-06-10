//端口
//var port = "http://192.168.66.131:8055";
//var port = "";
var port = localStorage.getItem("apiUrl");

class stock{
    //库存管理
    static StockManagement = {
        //库存查询-按仓位排序
        SearchByPos: '/api/PSIStoreProduct/GetPSI_Store_ProductByPositionCodeListInfo',
        //库存查询-按仓库排序
        SearchByWar: '/api/PSIStoreProduct/GetPSI_Store_ProductByWarehouseCodeListInfo',
        //库存查询-按商品排序
        SearchByPro: '/api/PSIStoreProduct/GetPSI_Store_ProductByProductCodeListInfo',
        //库存初始化
        Init: '/api/PSIStoreProduct/CreateStoreProducts',
        //获取待入库列表
        GetPendingCheckinList: '/api/PendingCheckIn/GetPendingCheckinList',
        //获取收获仓库
        GetWarehouse: '/api/PendingCheckIn/GetWarehouse',
        //入库
        CreateStorecheckin: '/api/PendingCheckIn/CreateStorecheckin',
        //已入库查询
        CheckinQuery: '/api/PSIStoreCheckin/CheckinQuery',
        //获取出库信息集
        GetCheckoutDatas: '/api/StoreCheckout/GetCheckoutDatas',
        //查询待出库的商品信息
        GetCheckoutProducts: '/api/StoreCheckout/GetCheckoutProducts',
        //新增出库
        CreateCheckout: '/api/StoreCheckout/CreateCheckout',
		//已入库导出
		CheckinExport: '/api/PSIStoreCheckIn/GetStoreCheckinToExcelInfo',
		//出库一览导出
		CheckoutExport: '/api/StoreCheckout/GetStoreCheckoutToExcelInfo',
		//库存查询导出
		StoreProductExport: '/api/PSIStoreProduct/GetPSI_Store_ProductByToExcelListInfo',
		//待入库一览导出
		PendingCheckinExport: '/api/PendingCheckIn/GetStore_CheckinListInfoToExcel',
		//外部调拨出库根据勾选数据打印调拨单的数据
		getTransfersList: '/api/StoreCheckout/GetTransferringOrderAysnc',
		//待入库一览入库成功后，获取打印商品信息
		getWaitToWarehousePrintList: '/api/PendingCheckIn/GetCheckinListToPrintAysnc',
    }
		
		//在库盘库
		static InStockCheckStock = {
			//盘库-仓库列表
			GetWarehouse: '/api/PSIStoreInventory/GetInventoryWarehouse',
			//盘库-仓位列表
			GetPosition: '/api/PSIStoreInventory/GetInventoryPosition',
			//盘库-录入数据列表
			GetDisplay: '/api/PSIStoreInventory/GetInventoryDisplay',
			//盘库-查看盘库数据
			GetView: '/api/PSIStoreInventory/GetInventoryView',
			//盘库-保存录入数据
			Save: '/api/PSIStoreInventory/SaveStoreInventory',
			//盘库-删除盘库记录
			Delete: '/api/PSIStoreInventory/DeleteStoreInventory',
			//盘库-盘库提交
			Commit: '/api/PSIStoreInventory/CommitStoreInventory',
			//盘库-导出盘库数据
			Export: '/api/PSIStoreInventory/GetExportInventory',
			//盘库-导入模板下载，盘点表下载
			Download: '/api/PSIStoreInventory/GetExportData',
			//盘库-保存导入盘库数据
			Import: '/api/PSIStoreInventory/SaveImportInventory',
			//盘库-撤销提交
			Undo: '/api/PSIStoreInventory/BackCommitStoreInventory',
		}
		
		//库存调整
		static InventoryAdjustment = {
			//查询
			query: '/api/PSIStoreCheckin/GetStore_CheckinListInfo',
			//获取库存调整的商品信息
			queryProduct:'/api/PSIStoreCheckin/GetCheckinProductInfos',
			//保存库存调整信息
			save:'/api/PSIStoreCheckin/CreateCheckinAdjust',
		}
		
		//景品回库
		static SceneBackLibrary = {
			//查询
			query: '/api/ProductCheckin/GetCheckinList',
			//获取景品列表
			queryProduct:'/api/ProductCheckin/GetCheckinSource',
			//景品回库保存
			save:'/api/ProductCheckin/SaveProductCheck',
		}
}

export default stock;
