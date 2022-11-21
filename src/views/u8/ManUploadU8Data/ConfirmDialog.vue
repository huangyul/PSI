<!-- 确定样式对话框 -->
<template>
  <div>
    <el-dialog
      v-model="isShow"
      width="500px"
      custom-class="dialog"
      top="30vh"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="container">
        <div class="content">
          <div class="mr10" style="height: 32px">
            <img src="@/assets/image/common/inquiry.png" />
          </div>
          <slot></slot>
        </div>
        <div class="btn-list">
          <button class="btn btn-grey" @click="onCancel">取消</button>
          <button class="btn btn-blue" @click="onConfirm">确定</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    emits: ['update:isShow', 'confirm'],
    props: {
      isShow: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      onCancel() {
        this.$emit('update:isShow', false)
      },
      onConfirm() {
        this.$emit('confirm')
        onCancel()
      },
    },
  }
</script>

<style lang="scss">
  .dialog {
    min-height: 200px;
    .el-dialog__header {
      display: none !important;
    }
    .el-dialog__body {
      padding: 20px !important;
    }
    .container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 160px;
      .content {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 10px;
      }

      .btn-list {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .btn:not(:last-child) {
          margin-right: 12px;
        }
      }
    }
  }
</style>
