<template>
  <div class="error">
    <el-dialog v-model="isShow" width="400px" :show-close="false">
      <template #title>
        <div class="tip-header">
          <img src="../../assets/img/purchase/warning.png" />
          <span>上传失败</span>
        </div>
      </template>
      <div class="dialog-tips">{{ text }}</div>

      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            style="margin-top: 30px"
            @click="$emit('update:isShow', false)"
          >
            知道了
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false,
      },
      text: {
        type: String,
        default: '',
      },
    },
    emits: ['update:isShow'],
  }
</script>

<style lang="scss" scoped>
  .tip-header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #2d323c;
    line-height: 42px;
    span {
      margin-left: 9px;
    }
  }
  ::v-deep .el-dialog__header {
    border-bottom: none !important;
  }
  ::v-deep .el-dialog__body {
    min-height: auto !important;
  }
  .dialog-tips {
    text-align: center;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #2d323c;
    line-height: 24px;
  }
</style>
