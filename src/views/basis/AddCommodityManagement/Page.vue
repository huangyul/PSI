<template>
  <div class="all">
    <div class="TracingPointTop">
      <div class="TracingPointContainer">
        <i class="el-icon-map-location"></i>
        <span>当前位置：</span>
        <div class="append"></div>
      </div>
      <button class="reset" @click="closeThisRouter">关闭</button>
      <button class="search" @click="eventSave">保存</button>
    </div>
    <div class="TracingPointBody">
      <div class="titleBox">基本信息</div>
      <div class="formBox">
        <el-form
          ref="form"
          :model="form"
          label-width="180px"
          size="mini"
          :rules="rules"
        >
          <!-- <el-form-item label="商品名称:" prop="name">
						<div class="large">
							<el-input v-model="form.Mat_Name"></el-input>
						</div>
					</el-form-item> -->
          <el-form-item label="商品名称:" required>
            <div class="large" style="width: 600px">
              <el-input v-model="form.Mat_Name" prop="text"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="商品编号:" required>
            <div class="large" style="width: 600px">
              <el-input
                v-model="form.Mat_No"
                :disabled="true"
                placeholder="选择商品品类之后自动生成"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="商品品类:" required>
            <div class="large" style="width: 600px">
              <el-cascader
                :props="{
                  label: 'Name',
                  value: 'Id',
                  children: 'children',
                  checkStrictly: true,
                  expandTrigger: 'hover',
                }"
                :options="CategoryTree"
                v-model="form.MatTypeId"
                @change="eventChangeMatTypeId"
              ></el-cascader>
            </div>
          </el-form-item>
          <el-form-item label="供应商:" required>
            <div class="large" style="width: 600px">
              <el-select v-model="form.SupplierInfoIds" filterable>
                <el-option
                  :label="item.SupplierName"
                  :value="item.SupplierId"
                  v-for="item in SupplierList"
                  :key="item.SupplierId"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="商品主图:">
            <div class="uploadImgBox">
              <div class="imgBox" v-for="item in PhotoList" :key="item.url">
                <i @click="eventImgDetele(item)" style="">×</i>
                <el-image
                  :src="item.url"
                  fit="fill"
                  style="width: 100%; height: 100%"
                ></el-image>
              </div>
              <el-upload
                accept=".jpg,.png,.jpeg"
                class="upload-demo"
                :limit="5"
                list-type="picture"
                action="#"
                :auto-upload="false"
                multiple
                :show-file-list="false"
                :on-change="eventUploadImgChange"
              >
                <div class="uploadImgBtn">
                  <i class="el-icon-plus"></i>
                  <span>上传附图</span>
                </div>
              </el-upload>
            </div>
            <div class="uploadImgBoxTip">
              <i class="el-icon-warning-outline"></i>
              <span>单张图片小于2M，最多5张</span>
            </div>
          </el-form-item>
          <el-form-item label="用途:">
            <div class="large" style="width: 600px">
              <el-input v-model="form.Other.Purpose"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="计算库存:">
            <el-radio-group v-model="form.LinkInfo.IsStock">
              <el-radio :label="true">计算</el-radio>
              <el-radio :label="false">不计算</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="条形码类别:">
            <el-radio-group
              v-model="ProductBarCodes.BarCodeType"
              @change="eventChangeBarCodeType"
            >
              <el-radio :label="0">系统生成</el-radio>
              <el-radio :label="1">原始条形码</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="条形码:">
            <div class="large" style="width: 600px">
              <el-input v-model="ProductBarCodes.BarCode"></el-input>
            </div>
            <!-- <button class="search" @click="eventGenerateBarCode">系统生成</button>
						<img id="barcode" /> -->
          </el-form-item>
          <el-form-item label="宣传资料:">
            <div
              class="mgb20"
              ref="editor"
              id="editor"
              style="width: 600px"
            ></div>
            <!-- <el-button type="primary" @click="eventSyncHTML">提交</el-button> -->
          </el-form-item>
        </el-form>
      </div>

      <div class="titleBox">
        价格与订购信息
        <div class="flex"></div>
        <i class="el-icon-arrow-up"></i>
      </div>
      <div class="stretch">
        <div class="piecesBoxLine">
          <div class="twoPieces">
            <div class="title"><i></i><span>变更前价格</span></div>
            <div class="inputBox">
              <span class="headline">含税价格：</span>
              <div class="regular">
                <el-input-number
                  v-model="Prices.Before_PriceByTax"
                  :min="0"
                  :controls="false"
                  :disabled="true"
                ></el-input-number>
              </div>
            </div>
            <div class="inputBox">
              <span class="headline">商品税率：</span>
              <div class="mini">
                <el-input-number
                  v-model="Prices.Before_TaxRate"
                  :min="0"
                  :controls="false"
                  :disabled="true"
                ></el-input-number>
              </div>
              <span>%</span>
            </div>
            <div class="inputBox">
              <span class="headline">启用日期：</span>
              <div class="regular">
                <el-date-picker
                  v-model="Prices.Before_StartDate"
                  type="date"
                  :disabled="true"
                ></el-date-picker>
              </div>
            </div>
          </div>
          <div class="twoPieces">
            <div class="title"><i></i><span>变更后价格</span></div>
            <div class="inputBox">
              <span class="headline"
                ><span class="requiredTip">*</span>含税价格：</span
              >
              <div class="regular">
                <el-input-number
                  v-model="Prices.After_PriceByTax"
                  :min="0"
                  :max="999999999.99"
                  :precision="6"
                  :controls="false"
                ></el-input-number>
              </div>
            </div>
            <div class="inputBox">
              <span class="headline"
                ><span class="requiredTip">*</span>商品税率：</span
              >
              <div class="mini" style="width: 100px">
                <el-select v-model="Prices_After_TaxRate_1">
                  <el-option label="0%" :value="0" :key="0"></el-option>
                  <el-option label="3%" :value="3" :key="3"></el-option>
                  <el-option label="6%" :value="6" :key="6"></el-option>
                  <el-option label="9%" :value="9" :key="9"></el-option>
                  <el-option label="13%" :value="13" :key="13"></el-option>
                  <el-option label="17%" :value="17" :key="17"></el-option>
                  <el-option
                    label="自定义"
                    value="自定义"
                    key="自定义"
                  ></el-option>
                </el-select>
              </div>
              <div
                class="mini"
                style="width: 67px"
                v-show="Prices_After_TaxRate_1 == '自定义'"
              >
                <el-input-number
                  v-model="Prices_After_TaxRate_2"
                  :min="0"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </div>
              <span v-show="Prices_After_TaxRate_1 == '自定义'">%</span>
            </div>
            <div class="inputBox">
              <span class="headline"
                ><span class="requiredTip">*</span>启用日期：</span
              >
              <div class="regular">
                <el-date-picker
                  v-model="Prices.After_StartDate"
                  type="date"
                  :disabled-date="disabledDate"
                ></el-date-picker>
              </div>
            </div>
          </div>
        </div>
        <div class="divider"></div>

        <div class="piecesBox">
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline"
                ><span class="requiredTip">*</span>商品单位：</span
              >
              <div class="regular">
                <el-select v-model="form.Mast_UnitId">
                  <el-option
                    :label="item.Unit_Name"
                    :value="item.Id"
                    v-for="item in UnitList"
                    :key="item.Id"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline"
                ><span class="requiredTip">*</span>下单数量：</span
              >
              <div class="regular">
                <el-input-number
                  v-model="form.Other.OrderNum"
                  :min="0"
                  :max="9999999.99"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </div>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline"
                ><span class="requiredTip">*</span>起订数量：</span
              >
              <div class="regular">
                <el-input-number
                  v-model="form.Other.SetNum"
                  :min="0"
                  :max="9999999.99"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </div>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline"
                ><span class="requiredTip">*</span>订单周期：</span
              >
              <div class="regular">
                <el-input-number
                  v-model="form.Other.OrderCycle"
                  :min="0"
                  :max="9999999"
                  :precision="0"
                  :controls="false"
                ></el-input-number>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="titleBox">
        商品属性
        <div class="flex"></div>
        <i class="el-icon-arrow-down"></i>
      </div>
      <div class="stretch" style="display: none">
        <div class="piecesBoxLine">
          <div class="onePieces">
            <div class="title"><i></i><span>产品尺寸-净值</span></div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">长：</span>
              <div class="regular">
                <el-input-number
                  v-model="form.Other.NetLong"
                  :min="0"
                  :max="999999.999999"
                  :precision="6"
                  :controls="false"
                ></el-input-number>
              </div>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">宽：</span>
              <div class="regular">
                <el-input-number
                  v-model="form.Other.NetWide"
                  :min="0"
                  :max="999999.999999"
                  :precision="6"
                  :controls="false"
                ></el-input-number>
              </div>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">高：</span>
              <div class="regular">
                <el-input-number
                  v-model="form.Other.NetHigh"
                  :min="0"
                  :max="999999.999999"
                  :precision="6"
                  :controls="false"
                ></el-input-number>
              </div>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">重量：</span>
              <div class="regular">
                <el-input-number
                  v-model="form.Other.NetWeight"
                  :min="0"
                  :max="999999.999999"
                  :precision="6"
                  :controls="false"
                ></el-input-number>
              </div>
            </div>
          </div>
        </div>
        <div class="divider"></div>

        <div class="piecesBoxLine">
          <div class="onePieces">
            <div class="title"><i></i><span>包装尺寸</span></div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">长：</span>
              <div class="regular">
                <el-input-number
                  v-model="form.Other.PackLong"
                  :min="0"
                  :max="999999.999999"
                  :precision="6"
                  :controls="false"
                ></el-input-number>
              </div>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">宽：</span>
              <div class="regular">
                <el-input-number
                  v-model="form.Other.PackWide"
                  :min="0"
                  :max="999999.999999"
                  :precision="6"
                  :controls="false"
                ></el-input-number>
              </div>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">高：</span>
              <div class="regular">
                <el-input-number
                  v-model="form.Other.PackHigh"
                  :min="0"
                  :max="999999.999999"
                  :precision="6"
                  :controls="false"
                ></el-input-number>
              </div>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">重量：</span>
              <div class="regular">
                <el-input-number
                  v-model="form.Other.PackWeight"
                  :min="0"
                  :max="999999.999999"
                  :precision="6"
                  :controls="false"
                ></el-input-number>
              </div>
            </div>
          </div>
        </div>
        <div class="divider"></div>

        <div class="piecesBox">
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">电力：</span>
              <div class="regular">
                <el-input-number
                  v-model="form.Other.Power"
                  :min="0"
                  :max="999999.999999"
                  :precision="6"
                  :controls="false"
                ></el-input-number>
              </div>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">每局币数：</span>
              <div class="regular">
                <el-input-number
                  v-model="form.Other.CurrencyPerRound"
                  :min="0"
                  :max="999999.99"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </div>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">使用方法：</span>
              <div class="regular">
                <el-input v-model="form.Other.Usage"></el-input>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="titleBox">
        价格策略
        <div class="flex"></div>
        <i class="el-icon-arrow-down"></i>
      </div>
      <div class="stretch" style="display: none">
        <div class="piecesBox">
          <div class="onePieces">
            <div class="inputBox">
              <span class="headline">商品打折：</span>
              <div class="auto">
                <el-checkbox
                  label="参与"
                  name="type"
                  v-model="form.LinkInfo.IsDiscount"
                ></el-checkbox>
              </div>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">商品销售：</span>
              <div class="auto">
                <el-checkbox
                  label="允许"
                  name="type"
                  v-model="form.LinkInfo.IsSale"
                ></el-checkbox>
              </div>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">售价：</span>
              <div class="mini">
                <el-input-number
                  v-model="form.LinkInfo.SalePrice"
                  :min="0"
                  :max="999999999.99"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </div>
              <span>元</span>
              <span class="secondHeadline">会员价：</span>
              <div class="mini">
                <el-input-number
                  v-model="form.LinkInfo.SalePriceVIP"
                  :min="0"
                  :max="999999999.99"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </div>
              <span>元</span>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">兑换方式：</span>
              <div class="auto">
                <el-checkbox
                  label="积分兑换"
                  name="type"
                  v-model="form.LinkInfo.IsPointExchange"
                ></el-checkbox>
              </div>
              <span class="Tip">（用积分兑换商品）</span>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">散客兑换：</span>
              <div class="mini">
                <el-input-number
                  v-model="form.LinkInfo.IndividualExchange1"
                  :min="0"
                  :max="999999999.99"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </div>
              <span>分</span>
              <span class="secondHeadline">会员兑换：</span>
              <div class="mini">
                <el-input-number
                  v-model="form.LinkInfo.IndividualExchangeVIP1"
                  :min="0"
                  :max="999999999.99"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </div>
              <span>分</span>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline"></span>
              <div class="auto">
                <el-checkbox
                  label="奖票兑换"
                  name="type"
                  v-model="form.LinkInfo.IsPrizeTicketExchange"
                ></el-checkbox>
              </div>
              <span class="Tip">（用奖票兑换商品）</span>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">散客兑换：</span>
              <div class="mini">
                <el-input-number
                  v-model="form.LinkInfo.IndividualExchange2"
                  :min="0"
                  :max="999999999.99"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </div>
              <span>张</span>
              <span class="secondHeadline">会员兑换：</span>
              <div class="mini">
                <el-input-number
                  v-model="form.LinkInfo.IndividualExchangeVIP2"
                  :min="0"
                  :max="999999999.99"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </div>
              <span>张</span>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline"></span>
              <div class="auto">
                <el-checkbox
                  label="代币兑换"
                  name="type"
                  v-model="form.LinkInfo.IsTokenExchange"
                ></el-checkbox>
              </div>
              <span class="Tip">（用代币兑换商品）</span>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">散客兑换：</span>
              <div class="mini">
                <el-input-number
                  v-model="form.LinkInfo.IndividualExchange3"
                  :min="0"
                  :max="999999999.99"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </div>
              <span>枚</span>
              <span class="secondHeadline">会员兑换：</span>
              <div class="mini">
                <el-input-number
                  v-model="form.LinkInfo.IndividualExchangeVIP3"
                  :min="0"
                  :max="999999999.99"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </div>
              <span>枚</span>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline"></span>
              <div class="auto">
                <el-checkbox
                  label="特殊奖票兑换"
                  name="type"
                  v-model="form.LinkInfo.IsSpecialExchange"
                ></el-checkbox>
              </div>
              <span class="Tip">（用特殊奖票兑换商品）</span>
            </div>
          </div>
          <div class="twoPieces">
            <div class="inputBox">
              <span class="headline">散客兑换：</span>
              <div class="mini">
                <el-input-number
                  v-model="form.LinkInfo.IndividualExchange4"
                  :min="0"
                  :max="999999999.99"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </div>
              <span>张</span>
              <span class="secondHeadline">会员兑换：</span>
              <div class="mini">
                <el-input-number
                  v-model="form.LinkInfo.IndividualExchangeVIP4"
                  :min="0"
                  :max="999999999.99"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </div>
              <span>张</span>
            </div>
          </div>
        </div>
      </div>

      <div class="titleBox">
        预警设置
        <div class="flex"></div>
        <i class="el-icon-arrow-down"></i>
      </div>
      <div class="stretch" style="display: none">
        <div class="piecesBox">
          <div class="onePieces">
            <div class="inputBox">
              <span class="headline">最小库存量：</span>
              <div class="large">
                <el-input-number
                  v-model="form.LinkInfo.MinStockNum"
                  :min="0"
                  :max="9999999"
                  :precision="0"
                  :controls="false"
                ></el-input-number>
              </div>
              <span class="Tip"
                ><i class="el-icon-warning-outline"></i>为空代表不预警</span
              >
            </div>
          </div>
          <div class="onePieces">
            <div class="inputBox">
              <span class="headline">最大库存量：</span>
              <div class="large">
                <el-input-number
                  v-model="form.LinkInfo.MaxStockNum"
                  :min="0"
                  :max="9999999"
                  :precision="0"
                  :controls="false"
                ></el-input-number>
              </div>
              <span class="Tip"
                ><i class="el-icon-warning-outline"></i>为空代表不预警</span
              >
            </div>
          </div>
          <div class="onePieces">
            <div class="inputBox">
              <span class="headline">积压预警：</span>
              <span style="margin-right: 10px">入库时间大于</span>
              <div class="mini">
                <el-input-number
                  v-model="form.LinkInfo.OverStockDay"
                  :min="0"
                  :max="9999999"
                  :precision="0"
                  :controls="false"
                ></el-input-number>
              </div>
              <span style="margin-right: 10px">天</span>
              <span class="Tip"
                ><i class="el-icon-warning-outline"></i>为空代表不预警</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="titleBox">
        更多设置
        <div class="flex"></div>
        <i class="el-icon-arrow-down"></i>
      </div>
      <div class="stretch" style="display: none">
        <div class="piecesBox">
          <div class="onePieces">
            <div class="inputBox">
              <span class="headline">商品描述1：</span>
              <div class="large">
                <el-input v-model="form.LinkInfo.ProductDescOne"></el-input>
              </div>
            </div>
          </div>
          <div class="onePieces">
            <div class="inputBox">
              <span class="headline">商品描述2：</span>
              <div class="large">
                <el-input v-model="form.LinkInfo.ProductDescTwo"></el-input>
              </div>
            </div>
          </div>
          <div class="onePieces">
            <div class="inputBox">
              <span class="headline">备注：</span>
              <div class="large">
                <el-input v-model="form.Summary"></el-input>
              </div>
            </div>
          </div>
          <div class="onePieces">
            <div class="inputBox">
              <span class="headline">自定义编号：</span>
              <div class="large">
                <el-input v-model="form.LinkInfo.CustomNum"></el-input>
              </div>
            </div>
          </div>
          <div class="onePieces">
            <div class="inputBox">
              <span class="headline">商品型号：</span>
              <div class="large">
                <el-input v-model="form.LinkInfo.ProductModel"></el-input>
              </div>
            </div>
          </div>
          <div class="onePieces">
            <div class="inputBox">
              <span class="headline">物流设置：</span>
              <div class="large">
                <el-select v-model="form.LinkInfo.LogisticsSet" clearable>
                  <el-option key="0" label="普通货物" value="0"></el-option>
                  <el-option key="1" label="虚拟货物" value="1"></el-option>
                  <el-option key="2" label="加工成品" value="2"></el-option>
                  <el-option key="3" label="配料" value="3"></el-option>
                  <el-option key="4" label="套餐货品" value="4"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="onePieces">
            <div class="inputBox">
              <span class="headline">状态：</span>
              <div class="large">
                <el-radio-group v-model="form.Status">
                  <el-radio label="1">启用</el-radio>
                  <el-radio label="0">停用</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="TracingPointFoot">
        <button class="reset" @click="closeThisRouter">关闭</button>
        <button class="search" @click="eventSave">保存</button>
      </div>
    </div>
  </div>
</template>

<script src="./vmModule.js"></script>

<style scoped>
  #editor >>> .w-e-text-container {
    z-index: 999 !important;
  }
  #editor >>> .w-e-toolbar {
    z-index: 1000 !important;
  }
  .TracingPointFoot button {
    height: 36px;
    padding: 0 50px;
  }
  .all >>> .el-radio__inner {
    width: 16px;
    height: 16px;
  }
  .all >>> .el-radio__label {
    padding-left: 6px;
  }
  .all >>> .el-radio__inner::after {
    width: 6px;
    height: 6px;
  }
  .all >>> .el-checkbox__inner {
    width: 16px;
    height: 16px;
  }
  .all >>> .el-checkbox__label {
    padding-left: 6px;
  }
  .all >>> .el-checkbox__inner::after {
    top: 2px;
    left: 5px;
  }
  .piecesBox,
  .piecesBoxLine {
    max-width: 1030px;
  }
  .piecesBoxLine {
    margin-bottom: 0;
    border: none;
  }
  .divider {
    display: flex;
    height: 1px;
    background-color: #ecedee;
    margin: 0 40px 20px 40px;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 15px;
  }
  .onePieces > .inputBox,
  .twoPieces > .inputBox,
  .onePieces > .title,
  .twoPieces > .title {
    margin-bottom: 15px;
  }
</style>
