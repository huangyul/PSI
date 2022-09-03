import { getLodop } from './LodopFuncs.js' //这块就是引用的上面一大坨暴露出来的方法喽

const PrintAccount = (qrTitle, codetype, url, code) => {
    let qrAccount = `${url}/#/?type=${codetype}&code=${code}`
    // 调用打印对象
    LODOP = getLodop()
    // 打印页面配置
    LODOP.SET_PRINT_MODE('PRINT_NOCOLLATE', 1)
    LODOP.SET_PRINT_PAGESIZE(3, '5.7cm', '2cm', 2)
 
    // 条码内容
    LODOP.ADD_PRINT_TEXT(3, 32, 127, 20, qrTitle)
    LODOP.SET_PRINT_STYLEA(0, 'FontSize', 15)
    LODOP.ADD_PRINT_BARCODE(26, 15, 170, 147, 'QRCode', qrAccount)
    // LODOP.ADD_PRINT_TEXT(159, 11, 163, 42, qrAccount)
    // LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
}
 
export { PrintAccount }