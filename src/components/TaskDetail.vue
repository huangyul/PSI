<template>
  <div class="all">
    <el-dialog
      v-model="isShow"
      title="任务详情"
      :width="800"
      top="5vh"
      :destroy-on-close="true"
      @close="$emit('update:isShow', false)"
    >
      <div class="desc" v-if="data">
        <div>任务类型：{{ importTypeMap.get(data?.ImportType) }}</div>
        <div>
          状态：
          <span :style="{ color: textColorMap.get(data?.Status)?.color }">
            {{ textColorMap.get(data?.Status)?.text }}
          </span>
        </div>
        <div>任务创建时间：{{ data?.CreateTime }}</div>
        <div>操作员：{{ data?.Creater }}</div>
        <div>任务结束时间：{{ data?.EndTime }}</div>
      </div>
      <div class="summary" v-if="data">
        <div class="title">详情</div>
        <div class="summary-box">
          <div class="summary-item">
            <span>导入原文件：</span>{{ data?.FileName
            }}<button
              @click="getFileDownUrl(data?.FilePath)"
              style="min-width: 84px; height: 28px"
            >
              下载原文件
            </button>
          </div>
          <div class="summary-item">
            <span>总数据：</span>{{ data?.TotalNum }}
          </div>
          <div class="summary-item">
            <span>成功导入数据：</span>{{ data?.SuccessNum
            }}<button v-if="data?.Status == 1" @click="toListPage">查看</button>
          </div>
          <div class="summary-item">
            <span>错误数据：</span>{{ data?.FailNum
            }}<button
              v-if="data?.Status == 2 && data?.FailNum > 0"
              @click="getErrorFileDownUrl(data?.ErrFilePath)"
            >
              下载错误数据
            </button>
          </div>
          <div
            class="summary-item"
            v-show="data?.Status == 2 && data?.FailNum == 0"
          >
            <span>失败原因：</span>
            <div class="error-reason" ref="error">
              {{ data.Messages }}
              <div
                class="error-btn"
                v-show="isErrorBtnShow"
                @click="isErrorDetailShow = true"
              >
                点击查看详情
              </div>
            </div>
          </div>
          <p class="tips">
            <Warning style="width: 16px; margin-right: 6px" />
            <span v-if="data?.Status == -1 || data?.Status == 0">
              数据处理过程中，需要一定的时间，请您耐心等待~
            </span>
            <span v-if="data?.Status == 1">
              数据导入成功，可点击查看按钮，查看导入成功的数据哦
            </span>
            <span v-if="data?.Status == 2">
              导入文件若有数据错误，全部数据都不会导入，需调整正确数据后，再重新导入
            </span>
          </p>
        </div>
      </div>
      <template #footer>
        <div class="footer">
          <button @click="$emit('update:isShow', false)">关闭</button>
        </div>
      </template>
    </el-dialog>

    <!-- 错误详情弹窗 -->
    <el-dialog
      v-model="isErrorDetailShow"
      title="失败详情"
      :width="800"
      top="5vh"
      :destroy-on-close="true"
    >
      <div style="max-height: 700px; overflow-y: auto; line-height: 24px">
        {{ data.Messages }}
      </div>
      <template #footer>
        <div class="footer">
          <button @click="isErrorDetailShow = false">关闭</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import { getTaskDetail } from '../api/apiv2/task'
  import { downloadFile } from '../api/apiv2/common'
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false,
      },
      transactionId: String,
    },
    emits: ['update:isShow', 'to-list'],
    data() {
      return {
        data: {},
        importTypeMap: new Map([
          [1, '商品管理导入'],
          [2, '采购计划导入'],
          [3, '采购订单导入'],
          [4, '外部调拨导入'],
        ]),
        textColorMap: new Map([
          [-1, { color: '#82b4f3', text: '待处理' }],
          [0, { color: '#82b4f3', text: '处理中' }],
          [1, { color: '#43c095', text: '导入成功' }],
          [2, { color: '#fd7575', text: '导入失败' }],
        ]),
        isErrorBtnShow: false,
        isErrorDetailShow: false,
      }
    },
    watch: {
      isShow: {
        immediate: true,
        handler(val) {
          if (val) {
            this.init()
          }
        },
      },
    },
    mounted() {
      // this.init()
    },
    methods: {
      async init() {
        const res = await getTaskDetail({ transactionId: this.transactionId })
        this.data = res
        // 如果行高超过5行，则显示按钮
        // debugger
        // if (this.isShow) {
        this.$nextTick(() => {
          if (this.$refs.error.offsetHeight > 140) {
            this.isErrorBtnShow = true
            this.$refs.error.style.height = '140px'
          } else {
            this.isErrorBtnShow = false
          }
        })
        // }
      },
      async getErrorFileDownUrl(path) {
        const res = await downloadFile(path, 0)
        const fileName = path.split('\\').pop()
        this.download(res, fileName)
      },
      async getFileDownUrl(path) {
        if (!path) {
          return
        } else {
          if (path.includes('&')) {
            path.split('&').forEach(async (p) => {
              if (p.length > 0) {
                const file = await downloadFile(p, 0)
                const fileName = p.split('/').pop()
                this.download(file, fileName)
              }
            })
          } else {
            const res = await downloadFile(path, 0)
            const fileName = path.split('/').pop()
            this.download(res, fileName)
          }
        }
      },
      download(file, fileName) {
        console.log(fileName)
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(file)
        link.download = fileName
        link.click()
        window.URL.revokeObjectURL(link.href)
      },
      // 跳往相应模块的列表页
      toListPage() {
        switch (this.data?.ImportType) {
          case 1: {
            this.$router.push('/CommodityManagement')
            this.mittBus.emit('on-product-refresh')
            break
          }
          case 2: {
            this.$router.push('/ProcurementPlan')
            this.mittBus.emit('on-plan-refresh')
            break
          }
          case 3: {
            this.$router.push('/PurchaseOrder')
            this.mittBus.emit('on-order-refresh')
            break
          }
          case 4: {
            this.$router.push('/ExternalTransferOutBase')
            this.mittBus.emit('on-dispatch-refresh')
            break
          }
        }
        this.$emit('update:isShow', false)
        this.$emit('to-list')
      },
    },
  }
</script>

<style scoped lang="scss">
  .desc {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    div {
      width: 50%;
      line-height: 28px;
    }
  }
  .summary {
    margin-top: 20px;
    button {
      margin-left: 10px;
      background: #ffffff;
      padding: 3px 6px;
      font-size: 14px;
      line-height: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #4391ee;
      border: 1px solid #579ff6;
      border-radius: 4px;
      cursor: pointer;
    }
    .title {
      position: relative;
      padding-left: 8px;
      &::before {
        content: '';
        position: absolute;
        width: 3px;
        background: #f9c02e;
        border-radius: 2px;
        left: 0;
        top: 0;
        bottom: 0;
      }
    }
    .summary-box {
      padding: 15px;
      margin-top: 10px;
      border: 1px solid #d9dbdd;
      .summary-item {
        line-height: 28px;
        display: flex;
        span {
          text-align: right;
          width: 150px;
          display: inline-block;
        }
        .error-reason {
          color: #fd7575;
          flex: 1;
          text-align: left;
          line-height: 28px;
          overflow: hidden;
          position: relative;
          .error-btn {
            margin-left: 10px;
            background: #ffffff;
            padding: 3px 6px;
            font-size: 14px;
            line-height: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #4391ee;
            border: 1px solid #579ff6;
            border-radius: 4px;
            cursor: pointer;
            position: absolute;
            bottom: 2px;
            right: 0;
            &:hover {
              opacity: 0.9;
            }
          }
        }
      }
      .tips {
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #767b83;
        line-height: 31px;
        margin-top: 40px;
        display: flex;
        align-items: center;
      }
    }
  }
  .footer button {
    width: 120px;
    height: 34px;
    background: #ededee;
    border: 1px solid #d9dbdd;
    border-radius: 4px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #767b83;
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
  }
</style>
