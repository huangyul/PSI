var port = localStorage.getItem("apiUrl");

class warning{
    static MainDataRequest = {
        //设置不再提示
        notremind:port + '/api/UserWarn/NotRemind',
        //首页预览
        preview:port + '/api/UserWarn/WarningPreview',
    }
    static DetialRequest = {
        //库存过低预警
        Low:port + '/api/UserWarn/GetMinStockWarningList',
        //库存过高预警
        High:port + '/api/UserWarn/GetMaxStockWarningList',
        //滞留物品预警
        Stay:port + '/api/UserWarn/GetOverStockWarning',
        //库存过低预警导出
        LowExport:port + '/api/UserWarn/GetMinStockWarningToExcel',
        //库存过高预警导出
        HighExport:port + '/api/UserWarn/GetMaxStockWarningToExcel',
        //滞留物品预警导出
        StayExport:port + '/api/UserWarn/GetOverStockWarningToExcel',
    }
}

export default warning;