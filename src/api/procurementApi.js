//端口
//var port = "http://192.168.66.131:8055";
//var port = "";
var port = localStorage.getItem('apiUrl')
//采购
class procurement {
  //生成编号
  static GeneratedNumber =  '/api/UserLoginInfo/GetCurrentCode'
  //查询单个门店的具体信息
  static GetShopInfo =  '/api/Shop/GetShopByCode'
  //采购计划
  static ProcurementPlan = {
    //查询
    query:  '/api/PurchasePlan/GetPurchasePlans',
    //查询单个信息
    queryOne:  '/api/PurchasePlan/GetPurchasePlanByCode',
    //获取采购计划的商品信息集
    queryProduct:  '/api/PurchasePlan/GetPlanProducts',
    //新增
    add:  '/api/PurchasePlan/CreatePurchasePlans',
    //更新
    update:  '/api/PurchasePlan/UpdatePurchasePlans',
    //删除
    delete:  '/api/PurchasePlan/DeletePurchasePlans',
    //导出
    Export:  '/api/PurchasePlan/GetPurchasePlansToExcel',
    //导入Excel
    Import:  '/api/File/UploadFile',
    //导入成功之后把Excel保存到数据库
    ImportSuccess:  '/api/PurchasePlan/ImporteExcelToPurchasePlans',
  }

  //采购单
  static PurchaseOrder = {
    //查询
    query:  '/api/PurchaseOrder/GetPurchaseOrderInfo',
    //查询单个信息
    queryOne:  '/api/PurchaseOrder/GetByCodeToEdit',
    //获取采购计划的商品信息集
    queryProduct:  '/api​/PurchaseOrder​/GetByCodeToEdit',
    //新增
    add:  '/api/PurchaseOrder/CreatePurchaseOrder',
    //更新
    update:  '/api/PurchaseOrder/UpdatePurchaseOrderInfo',
    //删除
    delete:  '/api/PurchaseOrder/DeletePurchaseOrderInfo',
    //下单
    placeOrder:  '/api/PurchaseOrder/UpdateOrderStatus',
    //导出
    Export:  '/api/PurchaseOrder/GetPurchaseOrderInfoToExcel',
    //明细导出
    ExportDetail:  '/api/PurchaseOrderM/GetPurchaseOrderInfoToExcel',
    //获取该门店下的供应商
    getSupplier:  '/api/PurchaseOrder/GetOrderSupplierList',
    // 获取供应商列表
    getSupplierList:  '/api/PurchaseOrder/GetSupplierListByUserCode',
  }

  //采购单
  static PurchaseOrderDetail = {
    //查询
    query:  '/api/PurchaseOrderM/GetPurchaseOrderMInfo',
    //批量更新状态
    updateStatus:  '/api/PurchaseOrderM/UpdatePurchaseOrderMInfo',
  }
}

export default procurement
