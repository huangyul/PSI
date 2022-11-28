<template>
  <div class="header">
    <div class="logo">
      <div class="logoBox"></div>
    </div>
    <!-- <div class="message">
					<router-link to="/tabs">
							<p>消息</p>
							<span>{{message}}</span>
					</router-link>
				</div>
				<div class="help">
					<router-link to="/tabs">
						<i class="question"></i>
						<span>帮助</span>
					</router-link>
				</div> -->
    <div class="sr-flex">
      <div class="message" @click="$emit('openTaskList')">
        <div class="image">
          <img src="../assets/img/task.png" />
          <div class="hot-dot" v-show="taskList.length > 0"></div>
        </div>
        任务
      </div>
      <el-dropdown class="user-name" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{ username }}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <a href="https://github.com/lin-xin/vue-manage-system" target="_blank">
                            <el-dropdown-item>项目仓库</el-dropdown-item>
                        </a>
                        <el-dropdown-item command="user">个人中心</el-dropdown-item>
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item> -->
            <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <el-dialog
      :title="'预警提示'"
      v-model="dialogVisible"
      width="400px"
      :center="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closeDialog"
    >
      <span class="titleBox">您有新的预警提示，快去看看吧！</span>
      <div class="dialogVisible">
        <div class="middle" v-show="isShowTable">
          <el-table
            ref="multipleTable"
            :data="warningList"
            tooltip-effect="dark"
            style="width: 100%"
            :show-header="false"
          >
            <el-table-column prop="Warn" label="" align="center">
              <template #default="scope">
                <!-- <span v-if="scope.row.Count > 0" class="update" @click="OpenWarningTab(scope.row.type)">{{scope.row.Warn}}({{scope.row.Count}})</span>
				                            <span v-if="scope.row.Count == 0">{{scope.row.Warn}}({{scope.row.Count}})</span> -->
                <div
                  class="box goBox"
                  v-if="scope.row.Count > 0"
                  @click="OpenWarningTab(scope.row.type)"
                >
                  <div class="iconBox">
                    <div :class="scope.row.type"></div>
                  </div>
                  <span class="name">{{ scope.row.Warn }}</span>
                  <span class="num">{{ scope.row.Count }}</span>
                  <i class="el-icon-arrow-right"></i>
                </div>
                <div class="box" v-if="scope.row.Count == 0">
                  <div class="iconBox">
                    <div :class="scope.row.type"></div>
                  </div>
                  <span class="name">{{ scope.row.Warn }}</span>
                  <span class="num">{{ scope.row.Count }}</span>
                  <i class="el-icon-arrow-right"></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div
        style="
          padding: 12px 0;
          order-bottom: 1px solid #ebeef5;
          text-align: center;
        "
        v-show="!IsCommitInventory"
      >
        <span>当前为盘点期，尽快前往</span>
        <span
          style="cursor: pointer; color: #409eff"
          @click="eventGoInStockCheckStock"
          >盘点</span
        >
        <span>吧</span>
      </div>
      <span @slot="'footer'" class="dialog-footer">
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 15px;
          "
        >
          <el-checkbox v-model="todayNotShow">今天不再提示</el-checkbox>
          <el-button type="primary" @click="closeDialog">我知道啦</el-button>
        </div>
      </span>
    </el-dialog>
  </div>

  <TaskDetail
    v-model:is-show="isTaskDetailShow"
    v-if="isTaskDetailShow"
    :transactionId="taskId"
  ></TaskDetail>
</template>
<script>
  import func from '../../src/views/func.js'
  import { computed, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  import router from '../router'
  import { getTaskList, updateTaskStatus } from '../api/apiv2/task'
  import { ElNotification } from 'element-plus'
  import { h } from 'vue'
  import TaskDetail from './TaskDetail.vue'
  export default {
    emits: ['openTaskList'],
    data() {
      return {
        permissionsListMax: {},
        permissionsListMin: {},
        permissionsListMDay: {},
        permissionsListU8: {},
        dialogVisible: false,
        todayNotShow: false,
        warningList: [
          { type: 'U8', Warn: '单据同步U8失败，请点击处理', Count: 0 },
          { type: 'Min', Warn: '库存过低预警', Count: 0 },
          { type: 'Max', Warn: '库存过高预警', Count: 0 },
          { type: 'Day', Warn: '滞留物品预警', Count: 0 },
        ],
        IsCommitInventory: true,
        isShowTable: false,
        taskList: [],
        taskId: '',
        isTaskDetailShow: false,
      }
    },
    components: { TaskDetail },
    methods: {
      //点击盘点去在库盘库
      eventGoInStockCheckStock() {
        this.dialogVisible = false
        router.push('InStockCheckStock')
      },
      //打开预警tab
      OpenWarningTab(type) {
        this.dialogVisible = false
        if (type == 'U8') {
          router.push('/ManUploadU8Data')
          return
        }
        router.push('/' + type + 'StockWarn')
      },
      //关闭
      closeDialog() {
        this.dialogVisible = false
        if (this.todayNotShow) {
          var t_url = './table.json'
          axios.get(t_url).then((res) => {
            localStorage.setItem('apiUrl', res.data.apiUrl)
            var url = res.data.apiUrl + '/api/UserWarn/NotRemind'
            this.$axios
              .post(url)
              .then((res) => {})
              .catch((err) => {
                this.$message({ message: err, type: 'warning' })
              })
          })
        }
      },
      //获取预警信息
      funcLoadWaning(rooturl) {
        var url =
          rooturl +
          '/api/UserWarn/WarningPreview?shopCode=' +
          localStorage.getItem('shopCode')
        this.$axios
          .get(url)
          .then((res) => {
            //console.log(res);
            if (res.data.data == null) {
              this.dialogVisible = false
            } else {
              if (res.data.Success == true) {
                this.IsCommitInventory = res.data.data.IsCommitInventory
                if (this.permissionsListU8?.Rights?.Query) {
                  this.warningList[0].Count = res.data.data.ErrorToU8
                } else {
                  this.warningList[0].Count = -1
                }
                if (
                  this.permissionsListMin != undefined &&
                  this.permissionsListMin.Rights.Query
                ) {
                  this.warningList[1].Count = res.data.data.MinStockWarning
                } else {
                  this.warningList[1].Count = -1
                }
                if (
                  this.permissionsListMax != undefined &&
                  this.permissionsListMax.Rights.Query
                ) {
                  this.warningList[2].Count = res.data.data.MaxStockWarning
                } else {
                  this.warningList[2].Count = -1
                }
                if (
                  this.permissionsListMDay != undefined &&
                  this.permissionsListMDay.Rights.Query
                ) {
                  this.warningList[3].Count = res.data.data.OverStockWarning
                } else {
                  this.warningList[3].Count = -1
                }
                this.warningList = this.warningList.filter(
                  (item, index, arr) => {
                    return item.Count >= 0
                  }
                )
                if (this.warningList.length > 0) {
                  var zeroList = this.warningList.filter((item, index, arr) => {
                    return item.Count == 0
                  })
                  if (zeroList.length == 4) {
                    //this.dialogVisible = false;
                    this.isShowTable = false
                  } else {
                    //this.dialogVisible = true;
                    this.isShowTable = true
                  }
                } else {
                  //this.dialogVisible = false;
                  this.isShowTable = false
                }
                // 警告数量为0的不显示
                this.warningList = this.warningList.filter((i) => {
                  return i.Count > 0
                })
                if (
                  this.IsCommitInventory === false ||
                  this.isShowTable === true
                ) {
                  this.dialogVisible = true
                } else {
                  this.dialogVisible = false
                }
              } else {
                this.$message({ message: res.data.Msg, type: 'warning' })
              }
            }
          })
          .catch((err) => {
            this.$message({ message: err, type: 'warning' })
          })
      },
      // 获取任务的新消息
      async fetchTaskStatus() {
        const importTypeMap = new Map([
          [1, '商品管理'],
          [2, '采购计划'],
          [3, '采购订单'],
          [4, '外部调拨'],
        ])
        const res = await getTaskList({
          startTime: localStorage.getItem('loginTime'),
          userCode: localStorage.getItem('UserCode'),
          importType: 0,
          status: 3,
          page: 1,
          pageSize: 10000,
        })
        res.Results.forEach((i) => {
          if (!this.taskList.includes(i.ID)) {
            this.taskList.push(i.ID)
            setTimeout(() => {
              let notification = ElNotification({
                title: '任务完成',
                message: h('div', {}, [
                  h(
                    'span',
                    {},
                    `ID:${i.ID}${importTypeMap.get(
                      i.ImportType
                    )}导入任务完成，点击`
                  ),
                  h(
                    'span',
                    {
                      style:
                        'cursor: pointer; color: #428feb;text-decoration:underline;',
                      onclick: async () => {
                        for (
                          let index = 0;
                          index < this.taskList.length;
                          index++
                        ) {
                          if (this.taskList[index] == i.ID) {
                            this.taskList.splice(index, 1)
                            break
                          }
                        }
                        this.mittBus.emit('close-detail')
                        notification.close()
                        await updateTaskStatus({ transactionId: i.ID })
                        this.taskId = i.ID
                        this.isTaskDetailShow = true
                      },
                    },
                    '查看详情'
                  ),
                ]),
                type: 'success',
                duration: 0,
                onClose: async () => {
                  for (let index = 0; index < this.taskList.length; index++) {
                    if (this.taskList[index] == i.ID) {
                      this.taskList.splice(index, 1)
                      break
                    }
                  }
                  notification.close()
                  await updateTaskStatus({ transactionId: i.ID })
                },
              })
            }, 0)
          }
        })
      },
    },
    mounted() {
      func.that = this
      if (localStorage.getItem('userType') == '3') {
        //供应商登录直接截停
        return
      }
      var AllPromossions = JSON.parse(localStorage.getItem('permissions'))
      this.permissionsListU8 = AllPromossions.find((i) => {
        return i.ModuleUrl == 'ManUploadU8Data'
      })
      this.permissionsListMax = AllPromossions.find(function (item) {
        return item.ModuleUrl == 'MaxStockWarn'
      })
      this.permissionsListMin = AllPromossions.find(function (item) {
        return item.ModuleUrl == 'MinStockWarn'
      })
      this.permissionsListMDay = AllPromossions.find(function (item) {
        return item.ModuleUrl == 'DayStockWarn'
      })
      var url = './table.json'
      axios.get(url).then((res) => {
        localStorage.setItem('apiUrl', res.data.apiUrl)
        this.funcLoadWaning(res.data.apiUrl)
      })
      // 获取任务更新提示
      setTimeout(() => {
        this.fetchTaskStatus()
      }, 2000)
      setInterval(() => {
        this.fetchTaskStatus()
      }, 1000 * 10)
    },
    setup() {
      const username = localStorage.getItem('ms_username')
      const message = 2

      const store = useStore()
      const collapse = computed(() => store.state.collapse)
      // 侧边栏折叠
      const collapseChage = () => {
        store.commit('handleCollapse', !collapse.value)
      }

      onMounted(() => {
        if (document.body.clientWidth < 1500) {
          collapseChage()
        }
      })

      // 用户名下拉菜单选择事件
      const router = useRouter()
      const handleCommand = (command) => {
        if (localStorage.getItem('userType') == '3') {
          router.push('/login')
        } else {
          //var url = '../../public/table.json'
          var url = './table.json'
          axios
            .get(url)
            .then((res) => {
              window.location.href = 'http://' + res.data.yunhoutaiUrl
              window.localStorage.clear() //清除所有key
            })
            .catch((err) => {
              ElMessage.warning({ message: err, type: 'warning' })
            })
        }
        // return;
        //        if (command == "loginout") {
        //            localStorage.removeItem("ms_username");
        // 			localStorage.removeItem("Token");
        //            router.push("/login");
        //        } else if (command == "user") {
        //            router.push("/user");
        //        }
      }

      return {
        username,
        message,
        collapse,
        collapseChage,
        handleCommand,
      }
    },
  }
</script>

<style scoped>
  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 36px;
    color: #fff;
    display: flex;
    align-items: center;
    padding: 0 15px;
    background-image: linear-gradient(to right, #659efd, #61a3f9, #57b1ef);
    font-size: 12px;
  }
  .header .logo {
    display: flex;
    align-items: center;
    flex: 1;
  }
  .header .logo > .logoBox {
    width: 97px;
    height: 22px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('../assets/img/logo.png');
  }
  .header >>> .el-badge__content {
    top: 11px;
    right: -5px;
    border: none;
  }
  .header a {
    color: #ffffff;
  }
  .header .message {
    margin-right: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .header .message .image {
    position: relative;
    margin-right: 4px;
    height: 16px;
  }
  .header .message .image .hot-dot {
    content: ' ';
    position: absolute;
    background-color: red;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    right: 0;
    top: 0;
  }
  .header .message .message-number {
    background: #f9c02e;
    padding: 1px 6px;
    border-radius: 40%;
    cursor: pointer;
  }
  .header .message > a {
    display: flex;
    align-items: center;
  }
  .header .message > a > span {
    padding: 0 7px;
    height: 18px;
    border-radius: 9px;
    background-color: #f9c02e;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
  }
  .header .help > a {
    margin: 0 30px 0 20px;
    display: flex;
    align-items: center;
  }
  .header .help > a > span {
    line-height: 18px;
    margin-left: 5px;
  }

  .header >>> .el-dialog__header {
    display: none;
  }
  .header >>> .el-checkbox__inner {
    width: 16px;
    height: 16px;
  }
  .header >>> .el-checkbox__label {
    padding-left: 6px;
  }
  .header >>> .el-checkbox__inner::after {
    top: 2px;
    left: 5px;
  }
  .header >>> .el-checkbox__input.is-checked .el-checkbox__inner,
  .header >>> .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #4391ee;
    background: #4391ee;
  }
  .header >>> .el-checkbox__input.is-checked .el-checkbox__inner,
  .header >>> .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    border-color: #4391ee;
  }
  .header >>> .el-radio__input.is-checked + .el-radio__label,
  .header >>> .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #4391ee;
  }

  .titleBox {
    display: flex;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    color: #2d323c;
    margin-bottom: 30px;
  }
  .el-table >>> td {
    padding: 0 !important;
  }
  .el-table >>> .cell {
    padding: 0;
  }
  .el-table .box {
    display: flex;
    align-items: center;
    padding: 12px 0;
  }
  .el-table .box.goBox {
    cursor: pointer;
  }
  .el-table .box .iconBox {
    width: 32px;
    height: 32px;
  }
  .el-table .box .iconBox .Min,
  .el-table .box .iconBox .Max,
  .el-table .box .iconBox .Day,
  .el-table .box .iconBox .U8 {
    width: 100%;
    height: 100%;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .el-table .box .iconBox .Min {
    background-image: url(/src/assets/img/LowWarningTip.png);
  }
  .el-table .box .iconBox .Max {
    background-image: url(/src/assets/img/HighWarningTip.png);
  }
  .el-table .box .iconBox .Day {
    background-image: url(/src/assets/img/StayWarningTip.png);
  }
  .el-table .box .iconBox .U8 {
    background-image: url(/src/assets/img/U8.png);
  }
  .el-table .box .name {
    flex: 1;
    color: #2d323c;
    text-align: left;
    margin-left: 12px;
  }
  .el-table .box .num {
    color: #ff5353;
    margin: 0 12px;
    font-weight: bold;
  }
  .el-table .box i {
    font-size: 14px;
    color: #acacac;
  }

  .collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
  }
  .header-right {
    float: right;
    padding-right: 50px;
  }
  .header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
  }
  .btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
  }
  .btn-bell,
  .btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
  }
  .btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
  }
  .btn-bell .el-icon-bell {
    color: #fff;
  }
  .user-name {
    margin-left: 10px;
  }
  .user-avator {
    margin-left: 20px;
  }
  .user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .el-dropdown-link {
    color: #fff;
    cursor: pointer;
  }
  .el-dropdown-menu__item {
    text-align: center;
  }
</style>
