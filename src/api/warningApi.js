var port = localStorage.getItem("apiUrl");

class warning{
    static MainDataRequest = {
        //设置不再提示
        notremind: '/api/UserWarn/NotRemind',
        //首页预览
        preview: '/api/UserWarn/WarningPreview',
    }
    static DetialRequest = {
        //库存过低预警
        Low: '/api/UserWarn/GetMinStockWarningList',
        //库存过高预警
        High: '/api/UserWarn/GetMaxStockWarningList',
        //滞留物品预警
        Stay: '/api/UserWarn/GetOverStockWarning',
        //库存过低预警导出
        LowExport: '/api/UserWarn/GetMinStockWarningToExcel',
        //库存过高预警导出
        HighExport: '/api/UserWarn/GetMaxStockWarningToExcel',
        //滞留物品预警导出
        StayExport: '/api/UserWarn/GetOverStockWarningToExcel',
    }
}

export default warning;
