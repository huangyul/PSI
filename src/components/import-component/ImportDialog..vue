<template>
  <el-dialog
    title="商品管理导入"
    :width="600"
    v-model="isShow"
    :before-close="handleBeforeClose"
  >
    <div class="itemImport">
      <div class="file-item">
        <div class="label">
          <span class="required">* </span>
          <span v-if="type == 'product'">请选择数据文件：</span>
          <span v-else>请选择导入文件：</span>
        </div>
        <div class="form">
          <el-input
            clearable
            v-model="dataFileName"
            class="input"
            :disabled="true"
          >
          </el-input>
          <el-upload
            :show-file-list="false"
            action=""
            :before-upload="handleBeforeDataUpload"
            accept=".xls,.xlsx"
          >
            <div class="choose-btn">选择</div>
          </el-upload>
        </div>
        <div class="file-tips">支持 *.xls, *.xlsx</div>
      </div>
      <div class="file-item" v-if="type == 'product'">
        <div class="label">
          <span class="required">* </span>请选择图片文件：
        </div>
        <div class="form">
          <el-input
            clearable
            class="input"
            v-model="imageFileName"
            :disabled="true"
          ></el-input>
          <el-upload
            :show-file-list="false"
            action=""
            :before-upload="handleBeforeImageUpload"
            accept=".zip"
          >
            <div class="choose-btn">选择</div>
          </el-upload>
        </div>
        <div class="file-tips">支持 *.zip，最大不超过100M</div>
      </div>
      <div class="tips" v-show="type == 'product'">
        <span style="font-weight: bold">提示：</span>支持 png、jpg
        格式图片，且请确保压缩包中图片文件名与数据文件 中的商品图片名称一致。
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:isShow', false)">取消</el-button>
        <el-button type="primary" @click="handleUpload">上传</el-button>
      </span>
    </template>
  </el-dialog>

  <ErrorTip v-model:isShow="isErrorTipShow" :text="errorText"></ErrorTip>
  <ImportLoading :isShow="isLoadingShow" :text="loadingText"></ImportLoading>
</template>

<script>
  import { ElMessage } from 'element-plus'
  import ErrorTip from './ErrorTip.vue'
  import ImportLoading from './ImportLoading.vue'
  import { uploadFileNew, dealUploadFile } from '../../api/apiv2/common'
  import { fileToBase64, dataURLToFile } from '../../utils/helper'

  const uploadTypeMap = new Map([
    ['product', 1],
    ['plan', 2],
    ['order', 3],
    ['dispatch', 4],
  ])
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false,
      },
      // product/商品管理 plan/采购计划 order/采购订单 dispatch/外部调拨
      type: {
        type: String,
        default: 'product',
      },
    },
    components: { ErrorTip, ImportLoading },
    emits: ['update:isShow', 'upload-success'],
    data() {
      return {
        dataFileName: '',
        imageFileName: '',
        dataFile: null,
        imageFile: null,
        file: null,
        isErrorTipShow: false,
        errorText: '',
        isLoadingShow: false,
        loadingText: '',
      }
    },
    watch: {
      isShow: {
        handler(val) {
          if (val) {
            this.dataFileName = ''
            this.imageFileName = ''
            this.dataFile = null
            this.imageFile = null
            this.file = null
          }
        },
      },
    },
    methods: {
      handleBeforeClose() {
        this.$emit('update:isShow', false)
      },
      // 获取选择的数据文件
      async handleBeforeDataUpload(file) {
        // 如果文件类型不是excel，不让上传
        if (
          ![
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ].includes(file.type)
        ) {
          ElMessage.warning('仅支持 *.xls, *.xlsx')
          return false
        }
        this.dataFile = await fileToBase64(file)
        this.dataFileName = file.name
        return false
      },
      // 获取选择的图片压缩包
      async handleBeforeImageUpload(file) {
        if (file.type != 'application/zip') {
          ElMessage.warning('仅支持 *.zip')
          return false
        }
        // 限制文件大小
        if (file.size > 100 * 1024 * 1024) {
          this.errorText = `${file.name}文件大小不能超过100M哦，请重新导入`
          this.isErrorTipShow = true
          return false
        }
        this.imageFile = await fileToBase64(file)
        this.imageFileName = file.name
        return false
      },
      // 点击上传
      async handleUpload() {
        if (!this.dataFile) {
          ElMessage.warning('请先选择导入文件，再进行上传操作')
          return
        }
        const formData = new FormData()
        if (this.dataFile) {
          formData.append(
            this.dataFileName,
            dataURLToFile(this.dataFile, this.dataFileName)
          )
        }
        if (this.imageFile) {
          formData.append(
            this.imageFile,
            dataURLToFile(this.imageFileName, this.imageFileName)
          )
        }
        this.loadingText = '文件上传中...'
        this.isLoadingShow = true
        const res = await uploadFileNew(uploadTypeMap.get(this.type), formData)
        await dealUploadFile()
        this.loadingText = '上传成功，文件正在处理...'
        setTimeout(() => {
          this.isLoadingShow = false
          this.$emit('upload-success', res.Msg)
        }, 3000)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .itemImport {
    padding-bottom: 20px;
    .file-item {
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 60px;
      .label {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #2d323c;
        width: 123px;
        .required {
          color: #ff5353;
        }
      }
      .form {
        flex: 1;
        display: flex;
        ::v-deep .el-upload {
          width: 100%;
          height: 100%;
          overflow: visible;
          border: none;
        }
        .input {
          margin-right: 10px;
        }
        .choose-btn {
          width: 60px;
          height: 28px;
          background: #ffffff;
          border: 1px solid #579ff6;
          border-radius: 4px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #4391ee;
          line-height: 28px;
          text-align: center;
          cursor: pointer;
        }
      }
      .file-tips {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #767b83;
        position: absolute;
        left: 123px;
        top: calc(100% + 12px);
      }
    }
    .tips {
      font-size: 14px;
      font-family: Microsoft YaHei;
      color: #e48f16;
      line-height: 24px;
      background: #fdf3d1;
      border-radius: 6px;
      padding: 14px;
    }
  }
</style>
