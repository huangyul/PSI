//端口
//var port = "http://192.168.66.131:8055";
//var port = "";
var port = localStorage.getItem('apiUrl')
//采购
class procurement {
  //生成编号
  static GeneratedNumber = port + '/api/UserLoginInfo/GetCurrentCode'
  //查询单个门店的具体信息
  static GetShopInfo = port + '/api/Shop/GetShopByCode'
  //采购计划
  static ProcurementPlan = {
    //查询
    query: port + '/api/PurchasePlan/GetPurchasePlans',
    //查询单个信息
    queryOne: port + '/api/PurchasePlan/GetPurchasePlanByCode',
    //获取采购计划的商品信息集
    queryProduct: port + '/api/PurchasePlan/GetPlanProducts',
    //新增
    add: port + '/api/PurchasePlan/CreatePurchasePlans',
    //更新
    update: port + '/api/PurchasePlan/UpdatePurchasePlans',
    //删除
    delete: port + '/api/PurchasePlan/DeletePurchasePlans',
    //导出
    Export: port + '/api/PurchasePlan/GetPurchasePlansToExcel',
    //导入Excel
    Import: port + '/api/File/UploadFile',
    //导入成功之后把Excel保存到数据库
    ImportSuccess: port + '/api/PurchasePlan/ImporteExcelToPurchasePlans',
  }

  //采购单
  static PurchaseOrder = {
    //查询
    query: port + '/api/PurchaseOrder/GetPurchaseOrderInfo',
    //查询单个信息
    queryOne: port + '/api/PurchaseOrder/GetByCodeToEdit',
    //获取采购计划的商品信息集
    queryProduct: port + '/api​/PurchaseOrder​/GetByCodeToEdit',
    //新增
    add: port + '/api/PurchaseOrder/CreatePurchaseOrder',
    //更新
    update: port + '/api/PurchaseOrder/UpdatePurchaseOrderInfo',
    //删除
    delete: port + '/api/PurchaseOrder/DeletePurchaseOrderInfo',
    //下单
    placeOrder: port + '/api/PurchaseOrder/UpdateOrderStatus',
    //导出
    Export: port + '/api/PurchaseOrder/GetPurchaseOrderInfoToExcel',
    //明细导出
    ExportDetail: port + '/api/PurchaseOrderM/GetPurchaseOrderInfoToExcel',
    //获取该门店下的供应商
    getSupplier: port + '/api/PurchaseOrder/GetOrderSupplierList',
    // 获取供应商列表
    getSupplierList: port + '/api/PurchaseOrder/GetSupplierListByUserCode',
  }

  //采购单
  static PurchaseOrderDetail = {
    //查询
    query: port + '/api/PurchaseOrderM/GetPurchaseOrderMInfo',
    //批量更新状态
    updateStatus: port + '/api/PurchaseOrderM/UpdatePurchaseOrderMInfo',
  }
}

export default procurement
