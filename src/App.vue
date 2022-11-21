<template>
  <router-view />
</template>

<script>
  export default {}
</script>

<style lang="scss">
  @import './assets/css/main.css';
  @import './assets/css/color-dark.css';
  @import './assets/css/index.scss';
</style>

<style>
  /* 打印的样式,修改打印不能分页问题 */
  @media print {
    html,
    body {
      overflow: visible !important;
    }
    .printBox {
      overflow: visible !important;
      height: auto !important;
    }
    .printBox .pageBox {
      page-break-after: always !important;
    }
  }

  .content-box {
    top: 36px;
    left: 80px;
    background-color: #fff;
  }
  .content-box .content {
    background-color: #fff;
    padding: 0;
  }
  /* .content-collapse{left:80px;} */
  body *::-webkit-scrollbar {
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 6px;
  }
  body *::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #f5f4f4;
  }
  body * {
    font-family: '微软雅黑' !important;
  }
  .content {
    overflow: visible;
  }
  .el-date-editor .el-range-separator {
    padding: 0 10px !important;
  }
  .el-cascader-menu__wrap.el-scrollbar__wrap {
    height: 350px !important;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner,
  .el-select,
  .el-input-number {
    width: 100% !important;
  }
  .el-input__inner {
    height: 28px !important;
    border: 1px solid #dddddd !important;
  }
  .all .el-input__inner {
    padding: 0 10px !important;
  }
  .all .el-input--prefix .el-input__inner {
    padding-left: 30px !important;
  }
  .all .el-input--suffix .el-input__inner {
    padding-right: 30px !important;
  }
  .el-input-number .el-input__inner {
    text-align: left !important;
  }
  .el-dialog .el-input-number--mini .el-input__inner {
    padding-left: 35px !important;
    padding-right: 35px !important;
    text-align: center !important;
  }
  .el-textarea__inner {
    padding: 5px 10px !important;
  }
  .el-input__inner,
  .el-textarea__inner {
    border-radius: 2px !important;
  }
  .el-input {
    line-height: 28px !important;
  }
  .el-input__icon {
    line-height: 28px !important;
  }
  .el-cascader {
    line-height: 28px !important;
    width: 100% !important;
  }
  .el-date-editor .el-range-separator {
    line-height: 26px !important;
    width: auto !important;
  }
  .el-input-number.is-controls-right[class*='small'] [class*='decrease'],
  .el-input-number.is-controls-right[class*='small'] [class*='increase'] {
    height: 50% !important;
    line-height: 14px !important;
  }
  .el-dialog__footer {
    text-align: center !important;
  }
  .el-dialog__footer .el-button {
    padding: 6px 25px;
    min-height: 34px;
  }
  .el-table .el-table__body tr:hover > td {
    background-color: #f8f8f8 !important;
  }
  .el-table .el-table__body tr.rowSelect > td {
    background-color: #eef5fe !important;
  }
  .el-table .update {
    text-decoration: underline;
    color: #579ff6;
    cursor: pointer;
  }
  .el-table th,
  .el-table td {
    border-right: 1px solid #eaeaeb !important;
    border-bottom: 1px solid #eaeaeb !important;
  }
  .el-table th {
    padding: 4px 0 !important;
    color: #314c6a;
  }
  .el-table td {
    padding: 3px 0 !important;
  }
  .el-table td .tableImgBox {
    display: flex;
    align-items: center;
  }
  .el-table .rowSelect {
    background-color: #eef5fe !important;
  }
  /* el-tabel hover颜色 */

  .el-table .double-row td {
    background: #f2f3f4 !important;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #efefff !important;
  }

  /* .el-table--striped .el-table__body tr.el-table__row--striped:hover td{background: #f6faff!important;} */
  .el-table td .cell {
    color: #2d323c;
  }
  .all .el-table--border {
    border: none;
  }
  .all .el-radio__inner {
    width: 16px;
    height: 16px;
  }
  .all .el-radio__label {
    padding-left: 6px;
  }
  .all .el-radio__inner::after {
    width: 6px;
    height: 6px;
  }
  .all .el-checkbox__inner {
    width: 16px;
    height: 16px;
  }
  .all .el-checkbox__label {
    padding-left: 6px;
  }
  .all .el-checkbox__inner::after {
    top: 2px;
    left: 5px;
  }
  .el-popconfirm p.el-popconfirm__main {
    margin-bottom: 10px;
  }
  .el-popconfirm p.el-popconfirm__main .el-popconfirm__icon {
    font-size: 18px;
  }
  .el-popconfirm .el-popconfirm__action .el-button--text {
    background-color: #ececed;
    border: 1px solid #dcdfe6;
    color: #606266;
    padding: 7px 15px;
  }
  .el-popconfirm .el-popconfirm__action .el-button--text:hover {
    border-color: #dcdfe6;
    background-color: #f5f5f8;
    color: #999;
  }
  .all {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    box-sizing: border-box;
  }
  .all * {
    box-sizing: border-box;
  }
  .all .topBtnBox,
  .all > .searchBox {
    padding: 10px 20px;
    border-bottom: 1px solid #e6e6e6;
    flex: none;
    display: flex;
    align-items: flex-start;
  }
  .all .topBtnBox > span.flex {
    flex: 1;
  }
  .all .topBtnBox .shopTip {
    position: relative;
    display: flex;
    align-items: center;
    padding: 3px 10px;
    margin-left: 15px;
    background-color: #fdf3d1;
    color: #e48f16;
    border-radius: 4px;
    font-size: 13px;
  }
  .all .topBtnBox .shopTip > i {
    margin-right: 5px;
    font-size: 18px;
    display: none;
  }
  .all .topBtnBox .shopTip::before {
    content: '';
    position: absolute;
    border-width: 7px;
    border-style: solid;
    border-color: transparent #fdf3d1 transparent transparent;
    left: -14px;
    top: 4.5px;
  }
  .all .searchBox {
    padding-bottom: 0;
    overflow: hidden;
    height: 48px;
    display: flex;
  }
  .all .searchBox.down {
    height: auto;
  }
  .all .searchBox > .conditions {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
  .all .searchBox > .conditions > .box {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .all .searchBox > .conditions > .box > span {
    width: 90px;
    height: 28px;
    color: #2d323c;
    display: flex;
    align-items: center;
    margin: 0 5px;
    justify-content: flex-end;
    text-align: right;
  }
  .all .searchBox > .conditions > .box > .inputBox {
    /* width: 250px; */
    width: 310px;
    display: flex;
    align-items: center;
  }
  @media screen and (max-width: 1439px) and (min-width: 1px) {
    .all .searchBox > .conditions > .box > .inputBox {
      /* width: 195px; */
      width: 310px;
    }
  }
  .all .searchBox > .conditions > .box > .inputBox .el-input__inner {
    height: 28px !important;
  }
  .all .searchBox > .conditions > .box > .inputBox .el-cascader {
    overflow: hidden !important;
  }
  .all
    .searchBox
    > .conditions
    > .box
    > .inputBox
    .el-cascader
    .el-cascader__tags {
    flex-wrap: nowrap;
  }
  .all .searchBox > .conditions > .box > .inputBox .el-input {
    line-height: 28px;
  }
  .all .searchBox > .conditions > .box > .inputBox .el-input__icon {
    line-height: 28px;
  }
  .all .searchBox > .operation {
    flex: none;
    height: 28px;
    display: flex;
    align-items: center;
    margin-left: 15px;
  }
  .all .searchBox > .operation > i {
    margin-right: 10px;
    cursor: pointer;
  }
  .all .searchBox > .operation > i.down {
    transform: rotate(180deg);
  }
  .all .middle {
    flex: 1;
    overflow-y: auto;
  }
  .all .middle .el-table th {
    background-color: #84c4ff !important;
  }
  /* .el-table__body, .el-table__footer, .el-table__header{width: auto!important;}
		.all .middle .el-table .cell{white-space: nowrap!important;overflow: visible!important;} */
  .all .middle.haveBorder .el-table {
    border: 1px solid #ebeef5;
    border-bottom: none;
  }
  .all .middle.haveBorder .el-table th,
  .all .middle.haveBorder .el-table td {
    border-right: 1px solid #ebeef5;
  }
  .all .middle.haveBorderNoTop .el-table {
    border: 1px solid #ebeef5;
    border-bottom: none;
    border-top: none;
  }
  .all .middle.haveBorderNoTop .el-table th,
  .all .middle.haveBorderNoTop .el-table td {
    border-right: 1px solid #ebeef5;
  }
  .all .footer {
    padding: 6px 12px;
    flex: none; /* border-top: 1px solid #ECEDEE; */
  }
  .all .el-pagination__total {
    margin-right: 15px;
  }
  .all .el-pagination__sizes {
    margin-right: 24px;
  }
  .all .el-pagination__editor {
    margin: 0 7px;
  }
  .all .el-pager li {
    color: #767b83;
  }
  .all .el-dialog {
    border-radius: 6px;
  }
  .all .el-dialog .el-dialog__header {
    background-color: #f9f9fa;
    border-radius: 6px 6px 0 0;
    padding: 10px 15px;
    border-bottom: 1px solid #dcdfe6;
  }
  .all .el-dialog .el-dialog__header .el-dialog__headerbtn {
    top: 10px;
    right: 10px;
  }
  .all .el-dialog .el-dialog__body {
    padding: 20px 40px 0 40px;
  }
  .all .el-dialog .el-dialog__footer .el-button--default {
    background-color: #ececed;
  }
  .all .el-dialog .el-dialog__footer {
    padding: 10px 20px 20px 20px;
  }
  .all .el-dialog .el-dialog__footer .el-button--default:hover {
    border-color: #dcdfe6;
    background-color: #f5f5f8;
    color: #999;
  }
  .all .el-dialog .el-dialog__close {
    font-weight: bold;
  }

  .all .el-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .all .el-overlay .el-dialog {
    margin: 0 !important;
    max-height: 1000px;
    display: flex;
    flex-direction: column;
  }
  .all .el-overlay .el-dialog .el-dialog__body {
    overflow-y: auto;
    flex: 1;
    min-height: 320px;
  }
  @media screen and (max-width: 1440px) and (min-width: 1px) {
    .all .el-overlay .el-dialog {
      max-height: 700px;
    }
  }

  .all .dialogVisible .searchBox {
    overflow: visible;
    height: auto;
    align-items: flex-start;
  }
  .all .dialogVisible .searchBox > .titleBox {
    display: flex;
    align-items: center;
    padding: 4.5px 0;
  }
  .all .dialogVisible .searchBox > .titleBox > .mark {
    width: 3px;
    height: 15px;
    background-color: #f9c02e;
    margin-right: 5px;
  }
  .all .dialogVisible .searchBox .conditions {
    flex: 1;
  }
  .all .dialogVisible .topBtnBox {
    padding: 15px 0;
    border-top: 1px solid #ecedee;
    align-items: center;
  }
  .all .dialogVisible .topBtnBox > span {
    margin-right: 5px;
  }
  .all .dialogVisible .topBtnBox > .titleBox {
    display: flex;
    align-items: center;
  }
  .all .dialogVisible .topBtnBox > .titleBox > .mark {
    width: 3px;
    height: 15px;
    background-color: #f9c02e;
    margin-right: 5px;
  }
  .all .dialogVisible .topBtnBox > .titleBox > span {
    font-weight: bold;
  }
  .all .dialogVisible .footerTip {
    padding: 15px 0;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #99a2a7;
    font-size: 14px;
  }
  .all .dialogVisible .footerTip b {
    margin: 0 10px;
  }
  .all .dialogVisible .footer {
    padding: 2px;
    border: 1px solid #ecedee;
    border-top: none;
  }
  .all .dialogVisible .PureTextBox {
  }
  .all .dialogVisible .PureTextBox .topBox {
    padding-bottom: 10px;
    border-bottom: 1px solid #ecedee;
  }
  .all .dialogVisible .PureTextBox .centreBox {
    padding-top: 10px;
    display: flex;
  }
  .all .dialogVisible .PureTextBox .centreBox .colBox {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .all .dialogVisible .PureTextBox .centreBox .colBox .titleBox {
    font-weight: bold;
    margin-bottom: 10px;
  }
  .all .dialogVisible .PureTextBox .centreBox .colBox .infoBox {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  .all .dialogVisible .PureTextBox .centreBox .colBox .infoBox .peer {
    min-width: 200px;
  }

  .all .addBox {
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;
  }
  .all .addBox > span {
    width: 120px;
    flex: none;
    text-align: right;
    line-height: 28px;
    margin-right: 10px;
  }
  .all .addBox > p {
    font-size: 12px;
    color: #99a2a7;
    font-size: 14px;
  }
  .all .addBox > p > b {
    margin: 0 15px;
  }
  .all .addBox .childBox {
    display: flex;
    align-items: center;
  }
  .all .addBox .childBox:first-child {
    margin-right: 20px;
  }
  .all .addBox .childBox > span {
    width: 120px;
    flex: none;
    text-align: right;
    line-height: 28px;
    margin-right: 10px;
  }
  .all .addBox .uploadImgBox {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }
  .all .addBox .uploadImgBox .imgBox {
    width: 66px;
    height: 66px;
  }
  .all .addBox .uploadImgBox .uploadImgBtn {
    width: 66px;
    height: 66px;
  }
  .all .addBox .uploadImgBox .imgBox i {
    font-style: normal;
    font-size: 12px;
  }

  .all > .TracingPointTop {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 1px solid #ecedee;
  }
  .all > .TracingPointTop > .TracingPointContainer {
    display: flex;
    align-items: center;
    flex: 1;
    color: #8e929a;
  }
  .all > .TracingPointTop > .TracingPointContainer > span {
    margin: 0 10px;
  }
  .all > .TracingPointTop > .TracingPointContainer > .append {
    display: flex;
    align-items: center;
    flex: 1;
  }
  .all > .TracingPointTop > .TracingPointContainer > .append > .box {
    display: flex;
    align-items: center;
    margin-right: 25px;
    cursor: pointer;
  }
  .all > .TracingPointTop > .TracingPointContainer > .append > .box > .point {
    width: 4px;
    height: 4px;
    background-color: #8e929a;
    margin-right: 5px;
    border-radius: 100%;
  }
  .all > .TracingPointTop > .TracingPointContainer > .append > .box.active {
    color: #579ff6;
    font-weight: bold;
  }
  .all
    > .TracingPointTop
    > .TracingPointContainer
    > .append
    > .box.active
    > .point {
    width: 8px;
    height: 8px;
    background-color: #579ff6;
  }
  .all > .TracingPointBody {
    padding: 20px 0px;
  }
  .all > .TracingPointBody > .titleBox {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 0 40px;
    padding: 7px 16px;
    background-color: #eef5fe;
    color: #2d323c;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .all > .TracingPointBody > .titleBox .flex {
    flex: 1;
  }
  .all > .TracingPointBody > .titleBox i {
    cursor: pointer;
    font-weight: bold;
    color: #767b83;
  }
  .all > .TracingPointBody > .titleBox i.spin {
    transform: rotate(180deg);
  }
  .all > .TracingPointBody > .formBox {
    width: 100%;
    margin-bottom: 20px;
  }
  .all > .TracingPointBody > .formBox .el-input--mini {
    font-size: 14px;
  }

  .large,
  .medium,
  .small,
  .mini {
    margin-right: 10px;
    display: inline-block;
  }
  .large {
    width: 300px;
  }
  .regular {
    width: 200px;
  }
  .small {
    width: 146px;
  }
  .mini {
    width: 100px;
  }
  .auto {
    width: auto;
  }
  .all {
    overflow: hidden;
  }
  .TracingPointBody {
    overflow: auto;
  }
  .uploadImgBox {
    display: flex;
    flex-wrap: wrap;
  }
  .uploadImgBox > .imgBox {
    width: 106px;
    height: 80px;
    margin-right: 15px;
    position: relative;
  }
  .uploadImgBox > .imgBox > i {
    width: 20px;
    height: 20px;
    background-color: #f56c6c;
    border-radius: 100%;
    position: absolute;
    top: -7px;
    right: -7px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    border: 1px solid #fff;
    z-index: 1;
    font-style: normal;
  }
  .uploadImgBox .uploadImgBtn {
    width: 106px;
    height: 80px;
    border: 1px dashed #d9dbdd;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: #f9f9fa;
    color: #8e929a;
  }
  .uploadImgBox .uploadImgBtn > span {
    margin-top: 5px;
  }
  .uploadImgBox .uploadImgBtn > i {
    font-size: 16px;
    font-weight: bold;
  }
  .uploadImgBoxTip {
    display: flex;
    align-items: center;
    color: #8e929a;
    font-size: 12px;
    margin-top: 10px;
  }
  .uploadImgBoxTip > i {
    margin-right: 5px;
    transform: rotate(180deg);
    font-size: 16px;
  }
  .piecesBox {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 0px;
    margin: 0 40px 20px 40px;
  }
  .piecesBox > .Tip {
    color: #99a2a7;
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
    font-size: 13px;
  }
  .piecesBox > .Tip > i {
    margin-right: 5px;
    font-size: 16px;
  }
  .piecesBoxLine {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #ecedee;
    margin: 0 40px 20px 40px;
  }
  .onePieces {
    width: 100%;
  }
  .twoPieces {
    width: 50%;
  }
  .onePieces > .title,
  .twoPieces > .title {
    color: #8e929a;
    display: flex;
    align-items: center;
    width: 175px;
    justify-content: flex-end;
    margin-bottom: 20px;
  }
  .onePieces > .title > i,
  .twoPieces > .title > i {
    width: 3px;
    height: 16px;
    background: #f9c02e;
    border-radius: 2px;
    margin-right: 5px;
  }
  .onePieces > .title > span,
  .twoPieces > .title > span {
    color: #767b83;
    font-weight: bold;
  }
  .onePieces > .inputBox,
  .twoPieces > .inputBox {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    height: 28px;
  }
  .onePieces > .inputBox > .headline,
  .twoPieces > .inputBox > .headline {
    width: 180px;
    text-align: right;
    margin-right: 10px;
    color: #606266;
  }
  .onePieces > .inputBox > .secondHeadline,
  .twoPieces > .inputBox > .secondHeadline {
    width: 100px;
    text-align: right;
    margin-left: 10px;
  }
  .onePieces .Tip,
  .twoPieces .Tip {
    color: #99a2a7;
    display: flex;
    align-items: center;
    font-size: 13px;
  }
  .onePieces .Tip > i,
  .twoPieces .Tip > i {
    font-size: 16px;
    margin-right: 5px;
    transform: rotate(180deg);
  }
  .TracingPointFoot {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 10px 0 10px;
    border-top: 1px solid #ecedee;
  }
  .TracingPointFoot > button {
    padding: 0 40px;
    height: 36px;
    line-height: 36px;
  }
  .TracingPointFoot > button:last-child {
    margin-right: 0;
  }
  .requiredTip {
    color: #f56c6c;
    margin-right: 4px;
  }
  .importBox {
    position: relative;
  }
  .importBox .upload-file {
    position: absolute;
    width: 68px;
    z-index: 1;
    opacity: 0;
    height: 28px;
  }
  .theadTip {
    padding: 0px 5px;
    border: 2px solid #909399;
    border-radius: 100%;
    font-size: 12px;
    margin-left: 5px;
  }

  /* 涉及状态的颜色 */
  .StatusGray {
    color: #767b83;
  }
  .StatusRed {
    color: #ff5353;
  }
  .StatusGreen {
    color: #06b177;
  }
  .StatusYellow {
    color: #f8991e;
  }

  button.green {
    display: flex;
    line-height: 1px;
    align-items: center;
    padding: 0 12px;
    height: 28px;
    border-radius: 4px;
    background-color: #13c287;
    color: #fff;
    border: none;
    cursor: pointer;
    margin-right: 10px;
    outline: none;
  }
  button.white {
    display: flex;
    line-height: 1px;
    align-items: center;
    padding: 0 12px;
    height: 28px;
    border-radius: 4px;
    background-color: #ffffff;
    color: #303133;
    border: 1px solid #dcdfe6;
    cursor: pointer;
    margin-right: 10px;
    outline: none;
  }
  button.white:hover {
    background: #e6e8eb;
  }

  button.white[disabled] {
    cursor: not-allowed;
    opacity: 0.7;
  }
  button.white i {
    line-height: 14px !important;
    font-weight: bold;
  }
  button.green:hover {
    background-color: #19cf91;
  }
  button.green i {
    line-height: 14px !important;
    font-weight: bold;
  }
  button.blue {
    display: flex;
    line-height: 1px;
    align-items: center;
    padding: 0 12px;
    height: 28px;
    border-radius: 4px;
    background-color: #ddecfd;
    color: #579ff6;
    border: none;
    cursor: pointer;
    margin-right: 10px;
    outline: none;
  }
  button.blue:hover {
    background-color: #e6eff9;
  }
  button.red {
    display: flex;
    line-height: 1px;
    align-items: center;
    padding: 0 12px;
    height: 28px;
    border-radius: 4px;
    background-color: #ffcbcb;
    color: #ff5353;
    border: none;
    cursor: pointer;
    margin-right: 10px;
    outline: none;
  }
  button.red:hover {
    background-color: rgba(#ffcbcb, 0.1);
  }
  button.grey {
    display: flex;
    line-height: 1px;
    align-items: center;
    padding: 0 12px;
    height: 28px;
    border-radius: 4px;
    background-color: #ededee;
    color: #8e929a;
    border: none;
    cursor: pointer;
    margin-right: 10px;
    outline: none;
  }
  button.grey:hover {
    background-color: #f2f2f3;
  }
  button.search {
    display: flex;
    line-height: 1px;
    align-items: center;
    padding: 0 12px;
    height: 28px;
    border-radius: 4px;
    background-color: #579ff6;
    color: #fff;
    border: none;
    cursor: pointer;
    margin-right: 10px;
    outline: none;
  }
  button.search:hover {
    background-color: #6cacf9;
  }
  button.reset {
    display: flex;
    line-height: 1px;
    align-items: center;
    padding: 0 12px;
    height: 28px;
    border-radius: 4px;
    background-color: #ededee;
    color: #767b83;
    border: none;
    cursor: pointer;
    margin-right: 10px;
    outline: none;
  }
  button.reset:hover {
    background-color: #f2f2f3;
  }
  button.blue_plain {
    display: flex;
    line-height: 1px;
    align-items: center;
    padding: 0 12px;
    height: 28px;
    border-radius: 4px;
    background-color: #fff;
    color: #579ff6;
    border: 1px solid #579ff6;
    cursor: pointer;
    margin-right: 10px;
    outline: none;
  }
  button.blue_plain:hover {
    background-color: #579ff6;
    color: #fff;
  }
  button > i {
    margin-right: 5px;
  }
  .tableButtonBox {
    display: flex;
    align-items: center;
  }
  .tableButtonBox i {
    cursor: pointer;
  }
  i.add {
    width: 12px;
    height: 12px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/add.png');
  }
  i.audit {
    width: 14px;
    height: 14px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/audit.png');
  }
  i.doubleDown {
    width: 10px;
    height: 9px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/doubleDown.png');
  }
  i.question {
    width: 18px;
    height: 18px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/question.png');
  }
  i.CheckPositions {
    width: 13px;
    height: 14px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/CheckPositions.png');
  }
  i.delete {
    width: 14px;
    height: 14px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/delete.png');
  }
  i.disable {
    width: 14px;
    height: 14px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/disable.png');
  }
  i.enable {
    width: 14px;
    height: 14px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/enable.png');
  }
  i.InputAssetNumber {
    width: 11px;
    height: 12px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/InputAssetNumber.png');
  }
  i.OrderTerminate {
    width: 13px;
    height: 14px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/OrderTerminate.png');
  }
  i.PlaceOrder {
    width: 13px;
    height: 14px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/PlaceOrder.png');
  }
  i.U8Sync {
    width: 13px;
    height: 14px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/U8Sync.png');
  }
  i.dispatchOrder {
    width: 13px;
    height: 14px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/dispatchOrder.png');
  }
  i.PutInStorage {
    width: 13px;
    height: 14px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/PutInStorage.png');
  }
  i.submit {
    width: 13px;
    height: 14px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/submit.png');
  }
  i.TerminationCancellation {
    width: 15px;
    height: 14px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/TerminationCancellation.png');
  }
  i.approved {
    width: 14px;
    height: 14px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/approved.png');
  }
  i.download {
    width: 10px;
    height: 12px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/download.png');
  }
  i.export {
    width: 13px;
    height: 13px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/export.png');
  }
  .print_d {
    width: 13px;
    height: 13px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/print_d.png');
  }
  i.import {
    width: 13px;
    height: 13px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/import.png');
  }
  i.print {
    width: 14px;
    height: 14px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/print.png');
  }
  i.revoke {
    width: 13px;
    height: 11px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/purchase/revoke.png');
  }
  i.reject {
    width: 14px;
    height: 14px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/reject.png');
  }
  i.write {
    width: 11px;
    height: 12px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/write.png');
  }

  .imgScanQRCodes {
    width: 218px;
    height: 164px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('./assets/img/ScanQRCodes.png');
  }

  /* 黑色 */
  .el-table td .cell,
  .all .searchBox > .conditions > .box > span,
  .sidebarBox .menu .first .second .secondBox > a span,
  .all .searchBox > .conditions > .box > .inputBox .el-input__inner,
  .all .el-input__inner,
  .all .el-checkbox,
  .all .el-radio,
  .all .el-form-item__label,
  .onePieces > .inputBox > .headline,
  .twoPieces > .inputBox > .headline,
  .inputBox,
  .w-e-text,
  .all > .TracingPointBody > .titleBox,
  .el-textarea__inner,
  .all .addBox > span,
  .all .addBox .childBox > span,
  .all .TracingPointBody .titleBox_1,
  .all .el-radio__input.is-disabled + span.el-radio__label,
  .all .el-tree,
  .auto,
  .all .dialogVisible .topBtnBox > .titleBox > span,
  .all .dialogVisible .topBtnBox > span,
  .all .dialogVisible .searchBox > .titleBox,
  .all .el-date-editor .el-range-input,
  .all .el-tabs__item {
    color: #2d323c;
  }

  /* 反映日期已经选择的颜色太浅,所以单独加深 */
  .all .el-date-editor .el-range-input {
    color: #000000;
  }

  /* 蓝色 */
  /* 字体 */
  .el-table .update,
  button.blue,
  #app .sidebarBox .menu .first:hover .firstTitle,
  #app .sidebarBox .menu .first.active .firstTitle,
  #app .tags-li.active .tags-li-title,
  .all > .TracingPointTop > .TracingPointContainer > .append > .box.active,
  .all .el-radio__input.is-checked + .el-radio__label,
  .all .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #4391ee;
  }
  /* 背景 */
  .all
    > .TracingPointTop
    > .TracingPointContainer
    > .append
    > .box.active
    > .point,
  .all .el-radio__input.is-checked .el-radio__inner,
  .all .el-checkbox__input.is-checked .el-checkbox__inner,
  .all .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #4391ee;
    background: #4391ee;
  }
  /* 边框 */
  .all .el-radio__input.is-checked .el-radio__inner,
  .all .el-checkbox__input.is-checked .el-checkbox__inner,
  .all .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    border-color: #4391ee;
  }

  /* 灰色 */
  button.grey,
  #app .sidebarBox .menu .first .firstTitle,
  #app .tags-li-title {
    color: #767b83;
  }

  /* 输入框提示文字灰色 */
  .all input::-webkit-input-placeholder {
    color: #99a2a7;
  }
  .all input::-moz-input-placeholder {
    color: #99a2a7;
  }
  .all input::-ms-input-placeholder {
    color: #99a2a7;
  }
  .all .el-date-editor input::-webkit-input-placeholder {
    color: #99a2a7;
  }
  .all .el-date-editor input::-moz-input-placeholder {
    color: #99a2a7;
  }
  .all .el-date-editor input::-ms-input-placeholder {
    color: #99a2a7;
  }

  /* 修改滚动条宽度 */
  body *::-webkit-scrollbar {
    height: 10px;
  }
  .el-table .caret-wrapper .sort-caret.ascending {
    border-bottom-color: #6287b2;
  }
  .el-table .caret-wrapper .sort-caret.descending {
    border-top-color: #6287b2;
  }
  .el-table .ascending .sort-caret.ascending {
    border-bottom-color: #2d323c !important;
  }
  .el-table .descending .sort-caret.descending {
    border-top-color: #2d323c !important;
  }
  .all .wx-tips .el-dialog__headerbtn {
    top: 10px;
    right: 5px;
  }
  .all .wx-tips .el-dialog {
    width: 400px;
    /* height: 320px; */
    background: #ffffff;
    border-radius: 6px;
  }
  .all .wx-tips .el-dialog__header {
    padding: 0;
    border-bottom: none;
  }
  .all .wx-tips .el-overlay .el-dialog .el-dialog__body {
    min-height: auto;
  }
</style>
