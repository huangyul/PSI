//端口
//var port = "http://192.168.66.131:8055";
//var port = "";
var port = localStorage.getItem("apiUrl");

//基础
class basis{
	//生成编号
	static GeneratedNumber = port+'/api/UserLoginInfo/GetCurrentCode';
	//获取仓库、仓位列表
	static WhOrPositionInfo = port+'/api/Common/GetWhOrPositionInfo';

	//获取设备分组信息列表,用于绑定查询条件
	static DeviceGroupsInfo = port+'/api/Common/GetDeviceGroups';
	
	//获取机器设备列表
	static GetMachineList = port+'/api/Common/GetDeviceInfos';
	
	//获取机器设备集-显示设备名称
	static GetMachineNameList = port+'/api/Common/GetDevicesByDeviceCode';
	
	//获取机器设备集-显示固定资产编号
	static GetMachineAssetNumList = port+'/api/Common/GetDevicesByAssetNum';

	//获取所属门店的门店信息
	//注意：总部用户，shopCode为空，取所有的门店；门店用户，shopCode为其所属门店编码，只取其所属门店
	static GetShopCodeList = port+'/api/Common/GetShopInfos';

	//获取非所属门店的门店信息
	static GetNoneShopCodeList = port+'/api/Common/GetNoneShopInfos';
	
	//导出-下载，参数为路径
	static ExportDownload = port+'/api/File/DownloadFile';
	
	//获取模板，1发货单，2挑拨单，3条形码
	static getTemplate = port + '/api/PSIBaseTemplate/GetPrintTemplateById';
	//修改模板，1发货单，2挑拨单，3条形码
	static updateTemplate = port + '/api/PSIBaseTemplate/CreatePSI_Base_Template';
	
	//商品单位
	static CommodityUnit = {
		//查询
		query:port+'/api/MastUnit/GetMastUnit',
		//查询单个
		queryOne:port+'/api/MastUnit/GetMastUnitById',
		//新增
		add:port+'/api/MastUnit/CreateMastUnit',
		//编辑更新
		update:port+'/api/MastUnit/UpdateMastUnit',
		//删除
		delete:port+'/api/MastUnit/DeleteMastUnit',
		//批量删除
		deleteList:port+'/api/MastUnit/DeleteMastUnitList',
		//导出
		Export:port+'/api/MastUnit/GetMastUnitToExcelInfo',
	}
	//物流公司
	static LogisticsCompany = {
		//查询
		query:port+'/api/BaseLogCompany/GetLogCompany',
		//查询单个
		queryOne:port+'/api/BaseLogCompany/GetLogCompanyByCode',
		//新增
		add:port+'/api/BaseLogCompany/CreateLogCompany',
		//编辑更新
		update:port+'/api/BaseLogCompany/UpdateLogCompany',
		//批量更新状态
		updateStatus:port+'/api/BaseLogCompany/UpdateStatus',
		//删除
		delete:port+'/api/BaseLogCompany/DeleteLogCompany',
		//批量删除
		deleteList:port+'/api/BaseLogCompany/DeleteLogCompList',
	}
	//仓位管理
	static PositionsManagement = {
		//查询
		query:port+'/api/BasePosition/GetPosition',
		//查询单个
		queryOne:port+'/api/BasePosition/GetPositionByCode',
		//新增
		add:port+'/api/BasePosition/CreatePosition',
		//编辑更新
		update:port+'/api/BasePosition/UpdatePosition',
		//删除
		delete:port+'/api/BasePosition/DeletePosition',
		//批量删除
		deleteList:port+'/api/BasePosition/DeletePositionList',
	}
	//仓库管理
	static WarehouseManagement = {
		//查询
		query:port+'/api/BaseWarehouse/GetWarehouse',
		//查询单个
		queryOne:port+'/api/BaseWarehouse/GetWarehouseByCode',
		//新增
		add:port+'/api/BaseWarehouse/CreateWarehouse',
		//编辑更新
		update:port+'/api/BaseWarehouse/UpdateWarehouse',
		//删除
		delete:port+'/api/BaseWarehouse/DeleteWarehouse',
		//批量删除
		deleteList:port+'/api/BaseWarehouse/DeleteWarehouseList',
		//获取默认仓库仓位
		getDefault:port + '/api/ProductCheckin/GetDefaultWarehouses',
	}
	//商品管理
	static CommodityManagement = {
		//查询
		query:port+'/api/Item/GetItemInfo',
		//新增
		add:port+'/api/Item/CreateItem',
		//根据商品编号集获取数据
		getUpdate:port+'/api/Item/GetByItemMatNo',
		//编辑更新
		update:port+'/api/Item/UpdateItemInfo',
		//批量更新状态
		updateStatus:port+'/api/Item/UpdateItemStatus',
		//删除
		delete:port+'/api/Item/DeleteItemInfo',
		//批量删除
		deleteList:port+'/api/Item/DeleteItemInfo',
		//导出
		Export:port+'/api/Item/GetItemToExcelInfo',
		//导入Excel
		Import:port+'/api/File/UploadFile',
		//导入成功之后把Excel保存到数据库
		ImportSuccess:port+'/api/Item/ImportItem',
		//获取打印信息
		getPrintData:port+'/api/Item/GetItemToPrintList',
		//富文本上传图片
		editorUploadImg:port+'/api/File/UploadPhoto',
	}
	//品类管理
	static CategoryManagement = {
		//查询
		query:port+'/api/MatType/GetMatType',
		//新增
		add:port+'/api/MatType/CreateMatType',
		//获取编辑更新要展示的数据
		queryUpdate:port+'/api/MatType/GetMatTypeById',
		//编辑更新
		update:port+'/api/MatType/UpdateMatType',
		//树形产品类
		tree:port+'/api/MatType/GetMatTypeByBussType',
		//删除
		delete:port+'/api/MatType/DeleteMatType',
		//批量删除
		deleteList:port+'/api/MatType/DeleteMatTypeList',
		//导出
		Export:port+'/api/MatType/GetMatTypeToExcelInfo',
	}
	//品类默认仓库/仓位
	static CategoryAndDefault = {
		//查询
		query:port+'/api/MatTypeWh/GetmatTypeWh',
		//新增
		add:port+'/api/MatTypeWh/CreatematTypeWh',
		//获取编辑更新要展示的数据
		queryOne:port+'/api/MatTypeWh/GetmatTypeWhByCode',
		//编辑更新
		update:port+'/api/MatTypeWh/UpdatematTypeWh',
		//批量删除
		deleteList:port+'/api/MatTypeWh/DeleteMatTypeWhList',
	}
	//机器管理
	static MachineManagement = {
		//查询
		query:port+'/api/BaseDevice/GetDevices',
		//查询单个
		queryOne:port+'/api/BaseDevice/GetDeviceById',
		//编辑更新
		update:port+'/api/BaseDevice/UpdateBaseDeviceInfo',
		//导出
		Export:port+'/api/BaseDevice/GetDevicesToExcel',
		//获取固定资产编号
		getAssetNum:port+'/api/BaseDevice/GetSysAssetNum',
		//获取打印数据
		getPrintData:port+'/api/BaseDevice/GetBase_DeviceToCodePrintAysnc',
	}
	//供应商管理
	static SupplierManagement = {
		//查询
		query:port+'/api/SupplierInfo/GetSupplierInfo',
		//查询单个
		queryOne:port+'/api/SupplierInfo/GetSupplierInfoById',
		//新增
		add:port+'/api/SupplierInfo/CreateSupplierInfo',
		//编辑更新
		update:port+'/api/SupplierInfo/UpdateSupplierInfo',
		//批量更新状态
		updateStatus:port+'/api/SupplierInfo/UpdateSupplierStatus',
		//删除
		delete:port+'/api/SupplierInfo/DeleteSupplierInfo',
		//批量删除
		deleteList:port+'/api/SupplierInfo/DeleteSuppInfoList',
	}
	//机器关联景品
	static MachineAndLandscape = {
		//查询
		query:port+'/api/ProductDevice/GetProductDevice',
		//新增
		add:port+'/api/ProductDevice/CreateProductDevice',
		//删除
		delete:port+'/api/ProductDevice/DeleteProductDevice',
		//获取最近设置的某个机器的景品类
		getMaxMatTypeId:port + '/api/ProductDevice/GetMaxMatTypeId',
	}
	//设置
	static SetUp = {
		//查询
		query:port+'/api/SysWarnSet/GetSysWarnSet',
		//编辑更新
		update:port+'/api/SysWarnSet/SaveSysWarnSet',
	}
	
	//门店信息
	static ShopManagement = {
		//查询
		query:port+'/api/Shop/GetShopInfo',
		//查询单个
		queryOne:port+'/api/Shop/GetShopByCode',
		//编辑更新
		update:port+'/api/Shop/UpdateShop',
	}

  // 采购退货
  static PurchaseReturn = {
    // 查询
    query:port+'/api/Report/GetPurchaseReturnPrint',
    // 导出
    export:port+'/api/Report/GetPurchaseReturnPrintToExcel',
  }
	
}


export default basis;