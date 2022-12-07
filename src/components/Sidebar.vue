<template>
  <div class="sidebar">
    <div class="sidebarBox">
      <div class="menu">
        <div
          v-for="item in items"
          :key="item.ModuleUrl"
          @mouseenter="onMouseenter(item)"
          @mouseleave="onMouseleave"
        >
          <div class="first">
            <div :class="item.ModuleUrl" class="firstIcon"></div>
            <span class="firstTitle">{{ item.ModuleName }}</span>
          </div>
        </div>
      </div>

      <!-- 二级菜单 -->
      <div
        class="menu-second second"
        v-show="isSecondShow"
        @mouseenter="onMouseenterMenu"
        @mouseleave="onMouseleave"
      >
        <span>{{ secondTitle + '信息' }}</span>
        <div
          v-for="subItem in secondMenu"
          :index="subItem.ModuleUrl"
          :key="subItem.ModuleUrl"
          class="secondBox"
        >
          <router-link :to="subItem.ModuleUrl">
            <div :class="subItem.ModuleUrl" class="secondIcon"></div>
            <span>{{ subItem.ModuleName }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import { computed, watch, ref } from 'vue'
  import { useStore } from 'vuex'
  import { useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import axios from 'axios'
  //import logoUrl from "../assets/img";
  export default {
    setup() {
      //权限菜单
      var items = JSON.parse(localStorage.getItem('leftMenus'))
      //console.log(items);

      //根据全局变量判断是否显示仓位管理
      if (localStorage.getItem('isShowPosition') == '0') {
        for (var i in items[0].Subs) {
          if (items[0].Subs[i].ModuleUrl == 'PositionsManagement') {
            items[0].Subs.splice(i, 1)
          }
        }
      }

      //判断导出前后端是否部署在同一服务器yes是，no不是
      axios
        .get('./table.json')
        .then((res) => {
          if (res.data.isExportEqual) {
            localStorage.setItem('isExportEqual', 'yes')
          } else {
            localStorage.setItem('isExportEqual', 'no')
          }
        })
        .catch((err) => {
          ElMessage.warning({ message: err, type: 'warning' })
        })

      const route = useRoute()

      const onRoutes = computed(() => {
        return route.path
      })

      // 二级菜单是否显示
      let isSecondShow = ref(false)

      // 二级菜单
      const secondMenu = ref([])
      // 二级菜单标题
      const secondTitle = ref('')
      // 一级菜单鼠标移入
      const onMouseenter = (item) => {
        if (item) {
          secondMenu.value = item.Subs
          secondTitle.value = item.ModuleName
        }
        isSecondShow.value = true
      }

      // 一级菜单鼠标移出
      const onMouseleave = () => {
        isSecondShow.value = false
      }

      // 菜单移入
      const onMouseenterMenu = () => {
        isSecondShow.value = true
      }

      const store = useStore()
      const collapse = computed(() => store.state.collapse)

      return {
        items,
        onRoutes,
        collapse,
        onMouseenter,
        onMouseleave,
        secondMenu,
        secondTitle,
        isSecondShow,
        onMouseenterMenu,
      }
    },
    mounted() {
      $('.first').click(function () {
        $('.first').removeClass('active')
        $(this).addClass('active')
        $('.first .second').hide()
        $(this).find('.second').show()
      })
      $('.first').eq(0).click()
    },
  }
</script>

<style scoped>
  .sidebarBox {
    display: flex;
    width: 250px;
    position: relative;
    height: 100%;
    background-color: #f6f6f7;
    font-size: 14px;
  }
  .sidebarBox * {
    box-sizing: border-box;
  }
  .sidebarBox .menu {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-right: 1px solid #e8e8e8;
    width: 80px;
  }
  .sidebarBox .menu .first {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 78px;
    justify-content: center;
    padding: 5px;
    cursor: pointer;
  }
  .sidebarBox .menu .first:hover,
  .sidebarBox .menu .first.active {
    background-color: #eef5fe;
  }
  .sidebarBox .menu .first:hover .firstTitle,
  .sidebarBox .menu .first.active .firstTitle {
    color: #579ff6;
    font-weight: bold;
  }
  .sidebarBox .menu .first .firstTitle {
    margin-top: 5px;
    font-size: 12px;
    color: #8e929a;
  }
  .sidebarBox .menu .first > .firstIcon {
    width: 22px;
    height: 21px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .sidebarBox .menu .first > .basis {
    background-image: url('../assets/img/basis.png');
  }
  .sidebarBox .menu .first:hover > .basis,
  .sidebarBox .menu .first.active > .basis {
    background-image: url('../assets/img/basisActive.png');
  }
  .sidebarBox .menu .first > .procurement {
    background-image: url('../assets/img/procurement.png');
  }
  .sidebarBox .menu .first:hover > .procurement,
  .sidebarBox .menu .first.active > .procurement {
    background-image: url('../assets/img/procurementActive.png');
  }
  .sidebarBox .menu .first > .stock {
    background-image: url('../assets/img/inventory.png');
  }
  .sidebarBox .menu .first:hover > .stock,
  .sidebarBox .menu .first.active > .stock {
    background-image: url('../assets/img/inventoryActive.png');
  }
  .sidebarBox .menu .first > .scene {
    background-image: url('../assets/img/scene.png');
  }
  .sidebarBox .menu .first:hover > .scene,
  .sidebarBox .menu .first.active > .scene {
    background-image: url('../assets/img/sceneActive.png');
  }
  .sidebarBox .menu .first > .return {
    background-image: url('../assets/img/return.png');
  }
  .sidebarBox .menu .first:hover > .return,
  .sidebarBox .menu .first.active > .return {
    background-image: url('../assets/img/returnActive.png');
  }
  .sidebarBox .menu .first > .supplier {
    background-image: url('../assets/img/supplier.png');
  }
  .sidebarBox .menu .first:hover > .supplier,
  .sidebarBox .menu .first.active > .supplier {
    background-image: url('../assets/img/supplierActive.png');
  }
  .sidebarBox .menu .first > .report {
    background-image: url('../assets/img/report.png');
  }
  .sidebarBox .menu .first:hover > .report,
  .sidebarBox .menu .first.active > .report {
    background-image: url('../assets/img/reportActive.png');
  }
  .sidebarBox .menu .first > .warn {
    background-image: url('../assets/img/warning.png');
  }
  .sidebarBox .menu .first:hover > .warn,
  .sidebarBox .menu .first.active > .warn {
    background-image: url('../assets/img/warningActive.png');
  }
  .sidebarBox .menu .first > .u8data {
    background-image: url('../assets/img/u8data.png');
  }
  .sidebarBox .menu .first:hover > .u8data,
  .sidebarBox .menu .first.active > .u8data {
    background-image: url('../assets/img/u8dataActive.png');
  }
  .sidebarBox .menu .first .second {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 0;
    width: 170px;
    display: none;
    padding: 0px;
    border: 1px solid #e6e6e6;
    height: 100%;
  }
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 36px;
    bottom: 0;
    overflow-y: scroll;
  }
  .sidebar::-webkit-scrollbar {
    width: 0;
  }
  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
  }
  .sidebar > ul {
    height: 100%;
  }

  .menu-second {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 80px;
    background: #f5f4f4;
    width: 170px;
    z-index: 999;
  }

  .sidebarBox .second {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 0;
    width: 170px;
    padding: 0px;
    border: 1px solid #e6e6e6;
    border-left: none;
    height: 100%;
  }
  .sidebarBox .second > span {
    color: #8e929a;
    font-weight: bold;
    padding: 0 20px;
    height: 50px;
    display: flex;
    align-items: center;
  }
  .sidebarBox .second .secondBox {
    display: flex;
    align-items: center;
    height: auto;
  }
  .sidebarBox .second .secondBox:hover {
    background-color: #ecedee;
  }
  .sidebarBox .second .secondBox > a {
    color: #000000;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 20px;
    height: 100%;
  }
  .sidebarBox .second .secondBox > a span {
    margin-left: 10px;
    color: #2d323c;
  }
  .sidebarBox .second .secondBox > a .secondIcon {
    width: 17px;
    height: 16px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .sidebarBox .second .secondBox > a .CategoryManagement {
    background-image: url('../assets/img/CategoryManagement.png');
  }
  .sidebarBox .second .secondBox > a .WarehouseManagement {
    background-image: url('../assets/img/WarehouseManagement.png');
  }
  .sidebarBox .second .secondBox > a .CommodityUnit {
    background-image: url('../assets/img/CommodityUnit.png');
  }
  .sidebarBox .second .secondBox > a .PositionsManagement {
    background-image: url('../assets/img/PositionsManagement.png');
  }
  .sidebarBox .second .secondBox > a .CommodityManagement {
    background-image: url('../assets/img/CommodityManagement.png');
  }
  .sidebarBox .second .secondBox > a .SetUp {
    background-image: url('../assets/img/SetUp.png');
  }
  .sidebarBox .second .secondBox > a .MachineManagement {
    background-image: url('../assets/img/MachineManagement.png');
  }
  .sidebarBox .second .secondBox > a .LogisticsCompany {
    background-image: url('../assets/img/LogisticsCompany.png');
  }
  .sidebarBox .second .secondBox > a .ProcurementPlan {
    background-image: url('../assets/img/ProcurementPlan.png');
  }
  .sidebarBox .second .secondBox > a .SupplierManagement {
    background-image: url('../assets/img/SupplierManagement.png');
  }
  .sidebarBox .second .secondBox > a .MachineAndLandscape {
    background-image: url('../assets/img/MachineAndLandscape.png');
  }
  .sidebarBox .second .secondBox > a .PurchaseOrder {
    background-image: url('../assets/img/PurchaseOrder.png');
  }
  .sidebarBox .second .secondBox > a .PurchaseOrderDetail {
    background-image: url('../assets/img/PurchaseOrderDetail.png');
  }
  .sidebarBox .second .secondBox > a .WaitToWarehouse {
    background-image: url('../assets/img/WaitToWarehouse.png');
  }
  .sidebarBox .second .secondBox > a .CheckinQuery {
    background-image: url('../assets/img/CheckinQuery.png');
  }
  .sidebarBox .second .secondBox > a .SceneOutBase {
    background-image: url('../assets/img/SceneOutBase.png');
  }
  .sidebarBox .second .secondBox > a .ConsumeOutBase {
    background-image: url('../assets/img/ConsumeOutBase.png');
  }
  .sidebarBox .second .secondBox > a .ExternalTransferOutBase {
    background-image: url('../assets/img/ExternalTransferOutBase.png');
  }
  .sidebarBox .second .secondBox > a .ScrapOutBase {
    background-image: url('../assets/img/ScrapOutBase.png');
  }
  .sidebarBox .second .secondBox > a .OutBaseList {
    background-image: url('../assets/img/OutBaseList.png');
  }
  .sidebarBox .second .secondBox > a .SceneBackLibrary {
    background-image: url('../assets/img/SceneBackLibrary.png');
  }
  .sidebarBox .second .secondBox > a .InventoryAdjustment {
    background-image: url('../assets/img/InventoryAdjustment.png');
  }
  .sidebarBox .second .secondBox > a .StoreTransfer {
    background-image: url('../assets/img/StoreTransfer.png');
  }
  .sidebarBox .second .secondBox > a .InStockCheckStock {
    background-image: url('../assets/img/InStockCheckStock.png');
  }
  .sidebarBox .second .secondBox > a .StockResearch {
    background-image: url('../assets/img/StockResearch.png');
  }
  .sidebarBox .second .secondBox > a .SceneSalesOutbound {
    background-image: url('../assets/img/SceneSalesOutbound.png');
  }
  .sidebarBox .second .secondBox > a .SceneSalesInbound {
    background-image: url('../assets/img/SceneSalesInbound.png');
  }
  .sidebarBox .second .secondBox > a .SceneSales {
    background-image: url('../assets/img/SceneSales.png');
  }
  .sidebarBox .second .secondBox > a .SceneRateQuery {
    background-image: url('../assets/img/SceneRateQuery.png');
  }
  .sidebarBox .second .secondBox > a .ReturnsManagement {
    background-image: url('../assets/img/ReturnsManagement.png');
  }
  .sidebarBox .second .secondBox > a .DeliveryView {
    background-image: url('../assets/img/DeliveryView.png');
  }
  .sidebarBox .second .secondBox > a .DeliveryDetail {
    background-image: url('../assets/img/DeliveryDetail.png');
  }
  .sidebarBox .second .secondBox > a .Statements {
    background-image: url('../assets/img/Statements.png');
  }
  .sidebarBox .second .secondBox > a .PurchaseInLibrarySummary {
    background-image: url('../assets/img/PurchaseInLibrarySummary.png');
  }
  .sidebarBox .second .secondBox > a .OutLibrarySummary {
    background-image: url('../assets/img/OutLibrarySummary.png');
  }
  .sidebarBox .second .secondBox > a .RequisitionSummary {
    background-image: url('../assets/img/RequisitionSummary.png');
  }
  .sidebarBox .second .secondBox > a .CheckSummary {
    background-image: url('../assets/img/CheckSummary.png');
  }
  .sidebarBox .second .secondBox > a .EntersSellsSaves {
    background-image: url('../assets/img/EntersSellsSaves.png');
  }
  .sidebarBox .second .secondBox > a .StockStrandedCheck {
    background-image: url('../assets/img/StockStrandedCheck.png');
  }
  .sidebarBox .second .secondBox > a .ShopManagement {
    background-image: url('../assets/img/ShopManagement.png');
  }
  .sidebarBox .second .secondBox > a .MinStockWarn {
    background-image: url('../assets/img/LowWarning.png');
  }
  .sidebarBox .second .secondBox > a .ManUploadU8Data {
    background-image: url('../assets/img/ManUploadU8Data.png');
  }
  .sidebarBox .second .secondBox > a .MaxStockWarn {
    background-image: url('../assets/img/HighWarning.png');
  }
  .sidebarBox .second .secondBox > a .DayStockWarn {
    background-image: url('../assets/img/StayWarning.png');
  }
  .sidebarBox .second .secondBox > a .CategorySetWhPosition {
    background-image: url('../assets/img/CategorySetWhPosition.png');
  }
  .sidebarBox .second .secondBox > a .CancelManagement {
    background-image: url('../assets/img/CancelManagement.png');
  }
  .sidebarBox .second .secondBox > a .PurchaseReturnProduct {
    background-image: url('../assets/img/PurchaseReturnProduct.png');
  }

  .sidebarBox .second .secondBox > a .PurchasePowSet {
    background-image: url('../assets/img/PurchasePowSet.png');
  }

  .sidebarBox .second .secondBox > a:hover .CategoryManagement {
    background-image: url('../assets/img/CategoryManagement_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .WarehouseManagement {
    background-image: url('../assets/img/WarehouseManagement_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .CommodityUnit {
    background-image: url('../assets/img/CommodityUnit_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .PositionsManagement {
    background-image: url('../assets/img/PositionsManagement_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .CommodityManagement {
    background-image: url('../assets/img/CommodityManagement_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .ManUploadU8Data {
    background-image: url('../assets/img/ManUploadU8Data_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .SetUp {
    background-image: url('../assets/img/SetUp_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .MachineManagement {
    background-image: url('../assets/img/MachineManagement_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .LogisticsCompany {
    background-image: url('../assets/img/LogisticsCompany_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .ProcurementPlan {
    background-image: url('../assets/img/ProcurementPlan_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .SupplierManagement {
    background-image: url('../assets/img/SupplierManagement_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .MachineAndLandscape {
    background-image: url('../assets/img/MachineAndLandscape_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .PurchaseOrder {
    background-image: url('../assets/img/PurchaseOrder_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .PurchaseOrderDetail {
    background-image: url('../assets/img/PurchaseOrderDetail_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .WaitToWarehouse {
    background-image: url('../assets/img/WaitToWarehouse_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .CheckinQuery {
    background-image: url('../assets/img/CheckinQuery_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .SceneOutBase {
    background-image: url('../assets/img/SceneOutBase_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .ConsumeOutBase {
    background-image: url('../assets/img/ConsumeOutBase_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .ExternalTransferOutBase {
    background-image: url('../assets/img/ExternalTransferOutBase_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .ScrapOutBase {
    background-image: url('../assets/img/ScrapOutBase_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .OutBaseList {
    background-image: url('../assets/img/OutBaseList_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .SceneBackLibrary {
    background-image: url('../assets/img/SceneBackLibrary_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .InventoryAdjustment {
    background-image: url('../assets/img/InventoryAdjustment_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .StoreTransfer {
    background-image: url('../assets/img/StoreTransfer_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .InStockCheckStock {
    background-image: url('../assets/img/InStockCheckStock_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .StockResearch {
    background-image: url('../assets/img/StockResearch_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .SceneSalesOutbound {
    background-image: url('../assets/img/SceneSalesOutbound_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .SceneSalesInbound {
    background-image: url('../assets/img/SceneSalesInbound_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .SceneSales {
    background-image: url('../assets/img/SceneSales_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .SceneRateQuery {
    background-image: url('../assets/img/SceneRateQuery_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .ReturnsManagement {
    background-image: url('../assets/img/ReturnsManagement_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .DeliveryView {
    background-image: url('../assets/img/DeliveryView_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .DeliveryDetail {
    background-image: url('../assets/img/DeliveryDetail_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .Statements {
    background-image: url('../assets/img/Statements_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .PurchaseInLibrarySummary {
    background-image: url('../assets/img/PurchaseInLibrarySummary_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .OutLibrarySummary {
    background-image: url('../assets/img/OutLibrarySummary_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .RequisitionSummary {
    background-image: url('../assets/img/RequisitionSummary_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .CheckSummary {
    background-image: url('../assets/img/CheckSummary_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .EntersSellsSaves {
    background-image: url('../assets/img/EntersSellsSaves_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .StockStrandedCheck {
    background-image: url('../assets/img/StockStrandedCheck_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .ShopManagement {
    background-image: url('../assets/img/ShopManagement_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .MinStockWarn {
    background-image: url('../assets/img/LowWarning_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .MaxStockWarn {
    background-image: url('../assets/img/HighWarning_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .DayStockWarn {
    background-image: url('../assets/img/StayWarning_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .CategorySetWhPosition {
    background-image: url('../assets/img/CategorySetWhPosition_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .CancelManagement {
    background-image: url('../assets/img/CancelManagement_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .PurchaseReturnProduct {
    background-image: url('../assets/img/PurchaseReturnProduct_h.png');
  }
  .sidebarBox .second .secondBox > a:hover .PurchasePowSet {
    background-image: url('../assets/img/PurchasePowSet_h.png');
  }
</style>
