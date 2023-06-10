import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: '首页',
          //requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
      },
      {
        path: '/CommodityManagement',
        name: 'CommodityManagement',
        meta: {
          title: '商品管理',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/basis/CommodityManagement/Page.vue'
          ),
      },
      {
        path: '/AddCommodityManagement',
        name: 'AddCommodityManagement',
        meta: {
          title: '新增商品',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/basis/AddCommodityManagement/Page.vue'
          ),
      },
      {
        path: '/UpdateCommodityManagement',
        name: 'UpdateCommodityManagement',
        meta: {
          title: '编辑商品',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/basis/UpdateCommodityManagement/Page.vue'
          ),
      },
      {
        path: '/CommodityUnit',
        name: 'CommodityUnit',
        meta: {
          title: '单位管理',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/basis/CommodityUnit/Page.vue'
          ),
      },
      {
        path: '/LogisticsCompany',
        name: 'LogisticsCompany',
        meta: {
          title: '物流公司',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/basis/LogisticsCompany/Page.vue'
          ),
      },
      {
        path: '/WarehouseManagement',
        name: 'WarehouseManagement',
        meta: {
          title: '仓库管理',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/basis/WarehouseManagement/Page.vue'
          ),
      },
      {
        path: '/PositionsManagement',
        name: 'PositionsManagement',
        meta: {
          title: '仓位管理',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/basis/PositionsManagement/Page.vue'
          ),
      },
      {
        path: '/MachineManagement',
        name: 'MachineManagement',
        meta: {
          title: '机器管理',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/basis/MachineManagement/Page.vue'
          ),
      },
      {
        path: '/SupplierManagement',
        name: 'SupplierManagement',
        meta: {
          title: '供应商管理',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/basis/SupplierManagement/Page.vue'
          ),
      },
      {
        path: '/AddSupplierManagement',
        name: 'AddSupplierManagement',
        meta: {
          title: '新增供应商',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/basis/AddSupplierManagement/Page.vue'
          ),
      },
      {
        path: '/UpdateSupplierManagement',
        name: 'UpdateSupplierManagement',
        meta: {
          title: '编辑供应商',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/basis/UpdateSupplierManagement/Page.vue'
          ),
      },
      {
        path: '/MachineAndLandscape',
        name: 'MachineAndLandscape',
        meta: {
          title: '机器关联景品',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/basis/MachineAndLandscape/Page.vue'
          ),
      },
      {
        path: '/CategoryManagement',
        name: 'CategoryManagement',
        meta: {
          title: '品类管理',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/basis/CategoryManagement/Page.vue'
          ),
      },
      {
        path: '/CategorySetWhPosition',
        name: 'CategorySetWhPosition',
        meta: {
          title: '品类默认仓库/仓位',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/basis/CategorySetWhPosition/Page.vue'
          ),
      },
      {
        path: '/SetUp',
        name: 'SetUp',
        meta: {
          title: '设置',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/basis/SetUp/Page.vue'
          ),
      },
      {
        path: '/ShopManagement',
        name: 'ShopManagement',
        meta: {
          title: '门店管理',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/basis/ShopManagement/Page.vue'
          ),
      },
      {
        path: '/ProcurementPlan',
        name: 'ProcurementPlan',
        meta: {
          title: '采购计划',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/procurement/ProcurementPlan/Page.vue'
          ),
      },
      {
        path: '/PurchaseOrder',
        name: 'PurchaseOrder',
        meta: {
          title: '采购订单',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/procurement/PurchaseOrder/Page.vue'
          ),
      },
      {
        path: '/PurchaseOrderDetail',
        name: 'PurchaseOrderDetail',
        meta: {
          title: '采购单明细',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/procurement/PurchaseOrderDetail/Page.vue'
          ),
      },
      {
        path: '/StockResearch',
        name: 'StockResearch',
        meta: {
          title: '库存查询',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/stock/StockResearch/Page.vue'
          ),
      },
      {
        path: '/PurchaseReturnProduct',
        name: 'PurchaseReturnProduct',
        meta: {
          title: '采购退货打印',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/stock/PurchaseReturnProduct/Page.vue'
          ),
      },
      {
        path: '/WaitToWarehouse',
        name: 'WaitToWarehouse',
        meta: {
          title: '待入库一览',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/stock/WaitToWarehouse/Page.vue'
          ),
      },
      {
        path: '/CheckinQuery',
        name: 'CheckinQuery',
        meta: {
          title: '已入库查询',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/stock/CheckinQuery/Page.vue'
          ),
      },
      {
        path: '/ConsumeOutBase',
        name: 'ConsumeOutBase',
        meta: {
          title: '消耗出库',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/stock/ConsumeOutBase/Page.vue'
          ),
      },
      {
        path: '/ScrapOutBase',
        name: 'ScrapOutBase',
        meta: {
          title: '报废出库',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/stock/ScrapOutBase/Page.vue'
          ),
      },
      {
        path: '/ExternalTransferOutBase',
        name: 'ExternalTransferOutBase',
        meta: {
          title: '外部调拨',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/stock/ExternalTransferOutBase/Page.vue'
          ),
      },
      {
        path: '/SceneOutBase',
        name: 'SceneOutBase',
        meta: {
          title: '景品出库',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/stock/SceneOutBase/Page.vue'
          ),
      },
      {
        path: '/StoreTransfer',
        name: 'StoreTransfer',
        meta: {
          title: '店内转仓',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/stock/StoreTransfer/Page.vue'
          ),
      },
      {
        path: '/OutBaseList',
        name: 'OutBaseList',
        meta: {
          title: '出库一览',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/stock/OutBaseList/Page.vue'
          ),
      },
      {
        path: '/InStockCheckStock',
        name: 'InStockCheckStock',
        meta: {
          title: '在库盘库',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/stock/InStockCheckStock/Page.vue'
          ),
      },
      {
        path: '/InventoryAdjustment',
        name: 'InventoryAdjustment',
        meta: {
          title: '库存调整',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/stock/InventoryAdjustment/Page.vue'
          ),
      },
      {
        path: '/SceneBackLibrary',
        name: 'SceneBackLibrary',
        meta: {
          title: '景品回库',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/stock/SceneBackLibrary/Page.vue'
          ),
      },
      {
        path: '/SceneSalesOutbound',
        name: 'SceneSalesOutbound',
        meta: {
          title: '景品销售出库',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/scene/SceneSalesOutbound/Page.vue'
          ),
      },
      {
        path: '/SceneSalesInbound',
        name: 'SceneSalesInbound',
        meta: {
          title: '景品销售回库',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/scene/SceneSalesInbound/Page.vue'
          ),
      },
      {
        path: '/SceneSales',
        name: 'SceneSales',
        meta: {
          title: '景品销售一览',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/scene/SceneSales/Page.vue'
          ),
      },
      {
        path: '/SceneRateQuery',
        name: 'SceneRateQuery',
        meta: {
          title: '景品率查询',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/scene/SceneRateQuery/Page.vue'
          ),
      },
      {
        path: '/DeliveryView',
        name: 'DeliveryView',
        meta: {
          title: '发货一览',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/supplier/DeliveryView/Page.vue'
          ),
      },
      {
        path: '/DeliveryDetail',
        name: 'DeliveryDetail',
        meta: {
          title: '发货明细',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/supplier/DeliveryDetail/Page.vue'
          ),
      },
      {
        path: '/Statements',
        name: 'Statements',
        meta: {
          title: '对账单',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/supplier/Statements/Page.vue'
          ),
      },
      {
        path: '/SupplierLogin',
        name: 'SupplierLogin',
        meta: {
          title: '供应商登录',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/supplier/SupplierLogin/Page.vue'
          ),
      },
      {
        path: '/ReturnsManagement',
        name: 'ReturnsManagement',
        meta: {
          title: '退货管理',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/return/ReturnsManagement/Page.vue'
          ),
      },
      {
        path: '/CancelManagement',
        name: 'CancelManagement',
        meta: {
          title: '退库管理',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/return/CancelManagement/Page.vue'
          ),
      },
      {
        path: '/PurchaseInLibrarySummary',
        name: 'PurchaseInLibrarySummary',
        meta: {
          title: '采购入库汇总',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/report/PurchaseInLibrarySummary/Page.vue'
          ),
      },
      {
        path: '/OutLibrarySummary',
        name: 'OutLibrarySummary',
        meta: {
          title: '出库汇总表',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/report/OutLibrarySummary/Page.vue'
          ),
      },
      {
        path: '/RequisitionSummary',
        name: 'RequisitionSummary',
        meta: {
          title: '调拨单汇总',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/report/RequisitionSummary/Page.vue'
          ),
      },
      {
        path: '/CheckSummary',
        name: 'CheckSummary',
        meta: {
          title: '盘点汇总表',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/report/CheckSummary/Page.vue'
          ),
      },
      {
        path: '/EntersSellsSaves',
        name: 'EntersSellsSaves',
        meta: {
          title: '进销存汇总',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/report/EntersSellsSaves/Page.vue'
          ),
      },
      {
        path: '/StockStrandedCheck',
        name: 'StockStrandedCheck',
        meta: {
          title: '在库滞留查询',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/report/StockStrandedCheck/Page.vue'
          ),
      },
      {
        path: '/MaxStockWarn',
        name: 'MaxStockWarn',
        meta: {
          title: '库存过高预警',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/warning/HighWarning/Page.vue'
          ),
      },
      {
        path: '/MinStockWarn',
        name: 'MinStockWarn',
        meta: {
          title: '库存过低预警',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/warning/LowWarning/Page.vue'
          ),
      },
      {
        path: '/DayStockWarn',
        name: 'DayStockWarn',
        meta: {
          title: '滞留物品预警',
        },
        component: () =>
          import(
            /* webpackChunkName: "editor" */ '../views/warning/StayWarning/Page.vue'
          ),
      },
      {
        path: '/PurchasePowSet',
        name: 'PurchasePowSet',
        meta: {
          title: '采购权限设置',
        },
        component: () =>
          import('../views/basis/PurchasePermissionManagement/Page.vue'),
      },
      {
        path: '/ManUploadU8Data',
        name: 'ManUploadU8Data',
        meta: {
          title: '单据同步U8',
        },
        component: () =>
          import('../views/u8/ManUploadU8Data/index.vue'),
      },
      {
        path: '/MachineImport',
        name: 'MachineImport',
        meta: {
          title: '机器导入'
        },
        component: () => import('../views/maintenance/MachineImport/Page.vue')
      }
    ],
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
    },
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// router.beforeEach((to, from, next) => {
// 	//document.title = `${to.meta.title} | vue-manage-system`;
// 	document.title = `system`;
// 	const role = localStorage.getItem('ms_username');
// 	if (!role && to.path !== '/login') {
// 		next('/login');
// 	} else if (to.meta.permission) {
// 		// 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
// 		role === 'admin'
// 			? next()
// 			: next('/403');
// 	} else {
// 		next();
// 	}
// });

export default router
