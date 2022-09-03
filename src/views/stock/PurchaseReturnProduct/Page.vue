<template>
  <div class="all">
    <!-- Export: true
Print: true
Query: true -->
    <div class="topBtnBox">
      <span class="flex"></span>
      <button v-if="permissionsList.Export" @click="onExport" class="grey">
        <i class="export"></i>导出
      </button>
      <button v-if="permissionsList.Print" @click="onPrint" class="grey">
        <i class="print_d"></i>打印
      </button>
    </div>
    <div class="searchBox">
      <div class="conditions">
        <div class="box">
          <span>品类</span>
          <div class="inputBox">
            <el-cascader
              :options="matTypeOptions"
              :props="cascaderProps"
              v-model="cascaderValue"
              collapse-tags
              ref="elCascader"
              clearable
              @change="onCascaderChange"
            ></el-cascader>
          </div>
        </div>
        <div class="box">
          <span>采购单编号</span>
          <div class="inputBox">
            <el-input v-model="searchForm.code"></el-input>
          </div>
        </div>
        <div class="box">
          <span>供应商</span>
          <div class="inputBox">
            <el-input v-model="searchForm.supplier"></el-input>
          </div>
        </div>
        <div class="box">
          <span>商品名称</span>
          <div class="inputBox">
            <el-input v-model="searchForm.product"></el-input>
          </div>
        </div>
        <div class="box">
          <span>入库日期</span>
          <div class="inputBox">
            <RangeDateVue
              v-model:props-start="searchForm.inDateStart"
              v-model:props-end="searchForm.inDateEnd"
            ></RangeDateVue>
          </div>
        </div>
        <div class="box">
          <span>入库类型</span>
          <div class="inputBox">
            <el-select v-model="searchForm.checkinType">
              <el-option label="采购" value="0" />
              <el-option label="退货" value="8" />
            </el-select>
          </div>
        </div>
        <div class="box">
          <span>入货仓库</span>
          <div class="inputBox">
            <el-input v-model="searchForm.warehouseCode"></el-input>
          </div>
        </div>
        <div class="box">
          <span>下单日期</span>
          <div class="inputBox">
            <RangeDateVue
              v-model:props-start="searchForm.orderStart"
              v-model:props-end="searchForm.orderEnd"
            ></RangeDateVue>
          </div>
        </div>
      </div>

      <div class="operation">
        <i class="doubleDown"></i>
        <button class="search" @click="doSearch" v-if="permissionsList.Query">
          查询
        </button>
        <button class="reset" @click="onReset">重置</button>
      </div>
    </div>
    <div class="middle">
      <!-- :summary-method="funcGetSummaries" -->
      <el-table
        border
        stripe
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        show-summary
        :summary-method="funcGetSummaries"
        :row-class-name="funcRowClassName"
        height="100%"
        id="printTable"
      >
        <el-table-column prop="InDate" label="入库日期" width="180">
        </el-table-column>
        <el-table-column prop="PurchaseOrderCode" label="采购单号" width="180">
        </el-table-column>
        <el-table-column prop="WarehouseName" label="入库仓库" width="260">
        </el-table-column>
        <el-table-column prop="ProductName" label="商品名称" width="240">
        </el-table-column>
        <el-table-column prop="UnitName" label="单位" width="60">
        </el-table-column>
        <el-table-column prop="CheckinType" label="入库类型" width="80">
          <template #default="scope">
            <span v-if="scope.row.CheckinType == '0'">采购</span>
            <span v-if="scope.row.CheckinType == '8'">退货</span>
          </template>
        </el-table-column>
        <el-table-column prop="ShopName" label="入库门店" width="260">
        </el-table-column>
        <el-table-column prop="SupplierName" label="供应商" width="230">
        </el-table-column>
        <el-table-column prop="SendNum" label="发货数量" width="80">
        </el-table-column>
        <el-table-column prop="CheckinNum" label="入库数量" width="80">
        </el-table-column>
        <el-table-column prop="Cy" label="差异" width="170"> </el-table-column>
        <el-table-column prop="PriceByTax" label="单价(含税)" width="170">
        </el-table-column>
        <el-table-column prop="AmountByTax" label="金额(含税)" width="170">
        </el-table-column>
        <el-table-column
          prop="TaxRate"
          label="税率"
          width="170"
        ></el-table-column>
        <el-table-column
          prop="Price"
          label="单价(不含税)"
          width="170"
        ></el-table-column>
        <el-table-column
          prop="Amount"
          label="金额(不含税)"
          width="170"
        ></el-table-column>
        <el-table-column prop="Tax" label="税额" width="170"></el-table-column>
        <el-table-column
          prop="Hj"
          label="价税合计"
          width="170"
        ></el-table-column>
        <el-table-column
          prop="YFK"
          label="已付款(含税)"
          width="170"
        ></el-table-column>
        <el-table-column
          prop="WK"
          label="尾款(含税)"
          width="170"
        ></el-table-column>
        <el-table-column
          prop="OrderCreater"
          label="下单人"
          width="180"
        ></el-table-column>
        <!-- <el-table-column prop="PrintStatus" label="打印状态" width="230">
          <template #default="scope">
            <span v-if="scope.row.PrintStatus == '0'">未打印</span>
            <span v-if="scope.row.PrintStatus == '1'">已打印</span>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="onChangePageSize"
        @current-change="onChangePage"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import func from '../../func.js'
  import print from 'print-js'
  import html2canvas from 'html2canvas'
  import JsPdf from 'jspdf'
  import RangeDateVue from '../../../components/rangeDate.vue'
  import {
    downloadFile,
    exportExcel,
    getMatType,
    getPurchaseReturnList,
  } from '../../../api/apiv2/puchase.js'
  export default {
    name: 'PurchaseReturnRroduct',
    components: { RangeDateVue },
    data() {
      return {
        searchForm: {
          orderStart: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          ).toLocaleDateString(), // 下单日期（开始）
          orderEnd: new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0
          ).toLocaleDateString(), // 下单日期（结束）
          inDateStart: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          ).toLocaleDateString(), //入库日期（开始）
          inDateEnd: new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0
          ).toLocaleDateString(), //入库日期（结束）
          supplier: '', //供应商编号/名称
          code: '', //采购订单编号
          matTypeId: [], //品类ID
          product: '', //商品
          warehouseCode: '', //入库仓库编号
          positionCode: '', //入库仓位编号
          checkinType: '', //类型：0-采购入库，8-退货
          shopInfo: '', //所选门店编码
          shopCode: '', //登录用户门店编号，多个英文逗号分隔
        },
        // 数据列表
        tableData: [],
        // 每页大小
        pageSize: 10,
        // 当前页码
        currentPage: 1,
        // 列表总数
        total: 0,
        // 入库类型搜索下拉列表
        checkinTypeOptions: [
          // 0-采购入库，8-退货
          { value: 0, label: '采购入库' },
          { value: 8, label: '退货' },
        ],
        // 品类搜索下拉列表
        matTypeOptions: [],
        // 时间选择器
        date1: [],
        date2: [],
        // 级联选择器
        cascaderValue: [],
        cascaderProps: {
          multiple: true,
          // checkStrictly: true,、
          expandTrigger: 'hover',
        },
        permissionsList: [],
        TjValues: [],
      }
    },
    methods: {
      // 搜索
      async doSearch() {
        this.tableData = []
        // 处理时间
        // if (this.date2.length > 0) {
        //   this.searchForm.orderStart = new Date(this.date2[0])
        //     .toLocaleDateString()
        //     .replaceAll('/', '-')
        //   this.searchForm.orderEnd = new Date(this.date2[0])
        //     .toLocaleDateString()
        //     .replaceAll('/', '-')
        // } else {
        //   this.searchForm.orderStart = ''
        //   this.searchForm.orderEnd = ''
        // }
        // if (this.date1.length > 0) {
        //   this.searchForm.inDateStart = new Date(this.date1[0])
        //     .toLocaleDateString()
        //     .replaceAll('/', '-')
        //   this.searchForm.inDateEnd = new Date(this.date1[1])
        //     .toLocaleDateString()
        //     .replaceAll('/', '-')
        // } else {
        //   this.searchForm.inDateEnd = ''
        //   this.searchForm.inDateStart = ''
        // }
        const res = await getPurchaseReturnList(
          {
            ...this.searchForm,
            page: this.currentPage,
            pageSize: this.pageSize,
            shopCode: localStorage.getItem('shopCode'),
          },
          this.searchForm.matTypeId
        )
        this.total = res.TotalCount
        // 处理小数位
        res.Results.forEach((d) => {
          // d.PriceByTax = d.PriceByTax.toFixed(6)
          d.Price = d.Price.toFixed(6)
          d.AmountByTax = d.AmountByTax.toFixed(2)
          d.Amount = d.Amount.toFixed(2)
          d.Tax = d.Tax.toFixed(2)
          d.Hj = d.Hj.toFixed(2)
          d.YFK = d.YFK.toFixed(2)
          d.WK = d.WK.toFixed(2)
        })
        this.TjValues = res.TjValues
        this.tableData = res.Results
        return res.Results
      },
      // 改变每页大小
      onChangePageSize(value) {
        this.pageSize = value
        this.doSearch()
      },
      // 改变页码
      onChangePage(value) {
        this.currentPage = value
        this.doSearch()
      },
      // 联机选择器
      onCascaderChange(value) {
        this.searchForm.matTypeId = []
        value.forEach((v) => {
          this.searchForm.matTypeId.push(v[v.length - 1])
        })
      },

      // 重置
      onReset() {
        this.searchForm = {
          inboundDate: '', // 入库日期
          inDateStart: '', //入库日期（开始）
          inDateEnd: '', //入库日期（结束）
          supplier: '', //供应商编号/名称
          code: '', //采购订单编号
          matTypeId: [], //品类ID
          product: '', //商品
          warehouseCode: '', //入库仓库编号
          positionCode: '', //入库仓位编号
          checkinType: '', //类型：0-采购入库，8-退货
          shopInfo: '', //所选门店编码
          shopCode: '', //登录用户门店编号，多个英文逗号分隔}
        }
        console.log(this.searchForm)
        this.date1 = [
          new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        ]
        this.date2 = [
          new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        ]
        this.cascaderValue = []
        this.doSearch()
      },

      createPDFObject(imgData) {
        let doc = new JsPdf('p', 'pt', 'a4') //	参数：纵向横向选择：'p'纵向，'l'横向，第二个单位，第三个尺寸格式，如[200,300]，可以也直接写'a4'等标准纸张大小
        doc.addImage(imgData, 0, 0, 595, 841, 'img') //	参数：图片内容，左偏移，上偏移，宽度，高度，a4大小的宽高为595.28，841.89
        doc.save('表格.pdf') // 参数：导出文件的命名
      },

      // 导出excel
      async onExport() {
        const res = await exportExcel(
          this.searchForm,
          this.searchForm.matTypeId
        )
        const file = await downloadFile(res.data)
        // 文件名
        let fileName = res.data.split('_').pop()
        // 新建一个a标签
        let link = document.createElement('a')
        // 获取临时文件地址
        link.href = window.URL.createObjectURL(file)
        // 设置文件名
        link.download = fileName
        // 模拟点击a标签
        link.click()
        // 释放内存
        window.URL.revokeObjectURL(link.href)
      },

      // 打印
      async onPrint() {
        // 获取数据
        const data = await this.doSearch()
        // 构建空白页面
        const printStr =
          "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'></head>"
        // 构建样式
        const style = `<style>@page{margin: 1em;}table{font-size:12px;width:100%;}
        table tr th span{transform:scale(0.6);display:inline-block;
        white-space:nowrap;}
        table tr th {background: #99CEFF;-webkit-print-color-adjust: exact;}
        table tr td span{transform:scale(0.6);display:inline-block;white-space:nowrap;}
        .title{width:100%;text-align:center;margin:5px auto;}
        </style><body><div class="title">采购和退货打印</div>`
        // 构建表体
        let tableContent = ''
        // 合计数量的计算
        let sum1 = 0, // 发货数量
          sum2 = 0, // 入库数量
          sum3 = 0, // 金额（含税）
          sum4 = 0, // 金额(不含税)
          sum5 = 0, // 价税合计
          sum6 = 0, // 已付款(含税)
          sum7 = 0 // 尾款(含税)
        data.forEach((d) => {
          // 转换采购类型
          if (d.CheckinType == '0') {
            d.CheckinType = '采购'
          } else if (d.CheckinType == '8') {
            d.CheckinType = '退货'
          }
          // 计算各种合计
          sum1 += Number(d.SendNum)
          sum2 += Number(d.CheckinNum)
          sum3 += Number(d.AmountByTax)
          sum4 += Number(d.Amount)
          sum5 += Number(d.Hj)
          sum6 += Number(d.YFK)
          sum7 += Number(d.WK)

          // 构建表格体数据内容
          tableContent += `<tr><td><span>${d.InDate}</span></td>
          <td><span>${d.PurchaseOrderCode}</span></td>
          <td><span>${d.PositionName}</span></td>
          <td><span>${d.ProductName}</span></td>
          <td><span>${d.UnitName}</span></td>
          <td><span>${d.CheckinType}</span></td>
          <td><span>${d.ShopName}</span></td>
          <td><span>${d.SupplierName}</span></td>
          <td><span>${d.SendNum}</span></td>
          <td><span>${d.CheckinNum}</span></td>
          <td><span>${d.Cy}</span></td>
          <td><span>${d.PriceByTax}</span></td>
          <td><span>${d.AmountByTax}</span></td>
          <td><span>${d.TaxRate}</span></td>
          <td><span>${d.Price}</span></td>
          <td><span>${d.Amount}</span></td>
          <td><span>${d.Tax}</span></td>
          <td><span>${d.Hj}</span></td>
          <td><span>${d.YFK}</span></td>
          <td><span>${d.WK}</span></td>
          <td><span>${d.OrderCreater}</span></td>
          </tr>`
        })

        // 加上合计数量
        tableContent += `<tr><td><span>合计</span></td>
          <td><span></span></td>
          <td><span></span></td>
          <td><span></span></td>
          <td><span></span></td>
          <td><span></span></td>
          <td><span></span></td>
          <td><span></span></td>
          <td><span>${sum1}</span></td>
          <td><span>${sum2}</span></td>
          <td><span></span></td>
          <td><span></span></td>
          <td><span>${sum3.toFixed(2)}</span></td>
          <td><span></span></td>
          <td><span></span></td>
          <td><span>${sum4.toFixed(2)}</span></td>
          <td><span></span></td>
          <td><span>${sum5.toFixed(2)}</span></td>
          <td><span>${sum6.toFixed(2)}</span></td>
          <td><span>${sum7.toFixed(2)}</span></td>
          <td><span></span></td>
          </tr>`

        // 构建表头
        const tableHeaderStr = `<table border="1" cellspacing="0"><tr><th><span>入库日期</span></th><th><span>采购单号</span></th><th><span>入库仓库</span></th><th><span>商品名称</span></th><th><span>单位</span></th><th><span>入库类型</span></th><th><span>入库门店</span></th><th><span>供应商</span></th><th><span>发货数量</span></th><th><span>入库数量</span></th><th><span>差异</span></th><th><span>单价(含税)</span></th><th><span>金额(含税)</span></th><th><span>税率</span></th><th><span>单价(不含税)</span></th><th><span>金额(不含税)</span></th><th><span>税额</span></th><th><span>价税合计</span></th><th><span>已付款(含税)</span></th><th><span>尾款(含税)</span></th><th><span>下单人</span></th></tr>${tableContent}</table>`

        const content = printStr + style + tableHeaderStr + '</body></html>'
        let pwin = window.open('_blank')
        pwin.document.write(content)
        pwin.document.close()
        pwin.focus()
        setTimeout(() => {
          pwin.print() // 打印功能。 例如 window.print() 直接打印当前整个页面。
          pwin.close() // 关闭 打印创建的当前页面
        }, 500)
        return
      },

      // 数据初始化
      async initData() {
        // 获取品类搜索列表
        const res = await getMatType()
        this.matTypeOptions = this.dealMatTypeData(res.Results)
      },

      // 处理品类的数据结构
      dealMatTypeData(data) {
        let item = []
        data.forEach((d, i) => {
          item[i] = {}
          if (d?.children.length > 0) {
            item[i].children = this.dealMatTypeData(d.children)
          }
          item[i].value = d.Id
          item[i].label = d.Name
        })
        return item
      },

      onCalendarChangeA(value) {
        console.log(value)
      },
      onCalendarChangeB(value) {
        console.log(value)
      },
      //自定义表格底部合计
      funcGetSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 7) {
            sums[index] = '合计'
            return
          }
          //8 9 10 12 15 16 17
          if (index == 8) {
            sums[index] = this.TjValues[0]
          }
          if (index == 9) {
            sums[index] = this.TjValues[1]
          }
          if (index == 10) {
            sums[index] = this.TjValues[2]
          }
          if (index == 12) {
            sums[index] = this.TjValues[3]
          }
          if (index == 15) {
            sums[index] = this.TjValues[4]
          }
          if (index == 16) {
            sums[index] = this.TjValues[5]
          }
          if (index == 17) {
            sums[index] = this.TjValues[6]
          }
        })

        return sums
      },
    },
    async mounted() {
      // 搜索栏伸缩
      func.SearchJudge()
      // 判断权限
      for (var item of JSON.parse(localStorage.getItem('permissions'))) {
        if (item.ModuleUrl == 'PurchaseReturnProduct') {
          this.permissionsList = item.Rights
        }
      }
      this.doSearch()
      this.initData()
    },
  }
</script>
<style scoped lang="scss">
  /* #all .searchBox > .conditions > .box > .inputBox .el-input__inner {
    height: 28px !important;
    color: red;
  }
  .el-input__inner {
    height: 28px !important;
    border: 1px solid #dddddd !important;
  } */
</style>
