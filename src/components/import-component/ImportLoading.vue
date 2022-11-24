<!-- 文件导入loading -->
<template>
  <div class="loading-mask" v-if="isShow">
    <div class="loading-box">
      <div class="loading"></div>
      <p class="loading-text">{{ text }}</p>
    </div>
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
        default: '文件上传中...',
      },
    },
  }
</script>

<style scoped lang="scss">
  .loading-mask {
    height: 100vh;
    width: 100vw;
    z-index: 99998;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    .loading-box {
      position: fixed;
      top: 30%;
      width: 300px;
      left: 50%;
      transform: translateX(-150px);
      height: 124px;
      background: #2d323c;
      box-shadow: 0px 5px 10px 0px rgba(45, 50, 60, 0.2);
      opacity: 0.9;
      z-index: 99999;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .loading {
        border: 5px solid #f3f3f3;
        border-radius: 50%;
        border-top: 5px solid #76b0f8;
        border-right: 5px solid #76b0f8;
        width: 32px;
        height: 32px;
        animation: spin 2s linear infinite;
      }
      .loading-text {
        margin-top: 16px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
