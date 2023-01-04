<template>
  <div class="login-wrap loginHtml" v-show="isShowLogin">
    <div class="loginLogo"></div>
    <div class="loginBottomTip">
      <span>中山市世软软件科技有限公司<b></b>联系电话 : 400-900-6688 </span>
    </div>
    <div class="ms-login">
      <div class="loginTitle"></div>
      <div class="loginContent">
        <div class="loginLeft"></div>
        <div class="loginRight">
          <p>供应商登录</p>
          <div class="inputBox">
            <div class="LoginUser"></div>
            <el-input
              v-model="param.username"
              placeholder="请输入账号"
              @keyup.enter.native="submitFormSupplier()"
            ></el-input>
          </div>
          <div class="inputBox">
            <div class="LoginPassword"></div>
            <el-input
              type="password"
              v-model="param.password"
              placeholder="请输入密码"
              @keyup.enter.native="submitFormSupplier()"
            ></el-input>
          </div>
          <div class="inputBox identifyBox" v-show="isShowIdentify">
            <div class="LoginVerification"></div>
            <el-input
              v-model="verificationCode"
              placeholder="请输入验证码"
              @keyup.enter.native="submitFormSupplier()"
            ></el-input>
            <!-- 引入验证码组件 -->
            <identify
              :identifyCode="identifyCode"
              @click="eventChangeCode()"
              class="identify"
            ></identify>
          </div>
          <button class="loginBtn" @click="submitFormSupplier()">登 录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, reactive, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter, useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import Qs from 'qs'
  import axios from 'axios'
  import identify from './supplier/SupplierLogin/Identify.vue'
  import { processExpression } from '@vue/compiler-core'

  export default {
    setup() {
      onMounted(() => {
        //localStorage.removeItem("Token");
        window.localStorage.clear() //清除所有key
        localStorage.setItem('orgId', route.query.OrgId)
        identifyCode.value = ''
        funcMakeCode(identifyCodes.value, 4)

        query.value = Qs.parse(location.hash.substring(8))
        //console.log(query.value);

        //var url = '../../public/table.json';
        var url = './table.json'
        axios
          .get(url)
          .then((res) => {
            localStorage.setItem('apiUrl', res.data.apiUrl)

            if (query.value.OrgId && query.value.UserId) {
              isShowLogin.value = false
              submitForm(query.value.OrgId, query.value.UserId)
            } else {
              isShowLogin.value = true
            }
          })
          .catch((err) => {
            ElMessage.warning({ message: err, type: 'warning' })
          })
      })
      const router = useRouter()
      const route = useRoute()
      const param = reactive({
        username: '',
        password: '',
      })
      const query = ref(null)
      const isShowLogin = ref(null)
      const rules = {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      }
      const isShowIdentify = ref(false)
      const nowTime = ref(0)
      const firstTime = ref(0)
      const isShowIdentifyNum = ref(0)
      const login = ref(null)
      //const port = ref("http://192.168.66.131:8055");

      //供应商登录
      const submitFormSupplier = () => {
        if (!param.username || !param.password) {
          ElMessage.warning({ message: '账号密码不能为空', type: 'warning' })
          return
        }
        if (
          verificationCode.value != identifyCode.value &&
          isShowIdentify.value
        ) {
          ElMessage.warning({ message: '验证码错误', type: 'warning' })
          return
        }
        var outTime = 36000
        //var outTime = 0;
        //console.log(param.username,param.password);return;
        localStorage.setItem('userType', '3') //测试环境参数，用户类型 0-总部用户 1-门店用户  3供应商
        var port = localStorage.getItem('apiUrl')
        var supplierUrl =
          port +
          '/api/UserLoginInfo/SupplierLogin?loginCode=' +
          param.username +
          '&password=' +
          param.password +
          '&timeOut=' +
          outTime
        localStorage.setItem('url2', supplierUrl)
        axios
          .post(supplierUrl)
          .then((res) => {
            //console.log(res);
            var token = 'Bearer ' + res.data.Token
            localStorage.setItem('Token', token)
            localStorage.setItem('loginTime', new Date().toLocaleDateString().replace(/\//g, '-'))
            localStorage.setItem('Expires', res.data.Expires)
            let Expires = new Date().getTime()
            Expires = Expires + (outTime - 3600 + 30) * 1000
            //注意这种存储全局变量会把存的值变成json字符串,注意转换！
            localStorage.setItem('Expires', Expires)
            localStorage.setItem('isShowPosition', '1') //测试环境参数，是否显示仓位下拉框,1是显示，0是隐藏
            localStorage.setItem('isLimitInventoryDate', '0') //测试环境参数，是否限制盘库日期,1是限制，0是不限制
            localStorage.setItem('InventoryStartDate', '') //测试环境参数，盘库开始日期
            localStorage.setItem('InventoryEndDate', '') //测试环境参数，盘库结束日期
            var arr = [
              {
                ModuleName: '供应商',
                ModuleUrl: 'supplier',
                Subs: [
                  {
                    ModuleName: '发货一览',
                    ModuleUrl: 'DeliveryView',
                    Rights: {
                      Query: false,
                      DeliverGoods: false,
                      Print: false,
                      Export: false,
                    },
                    Subs: null,
                  },
                  {
                    ModuleName: '发货明细',
                    ModuleUrl: 'DeliveryDetail',
                    Rights: {
                      Query: false,
                    },
                    Subs: null,
                  },
                  {
                    ModuleName: '对账单',
                    ModuleUrl: 'Statements',
                    IsShow: false,
                    Rights: {
                      Query: false,
                    },
                    Subs: null,
                  },
                ],
              },
            ]
            var arr_1 = []
            for (var i of arr) {
              arr_1.push(i)
              for (var j of i.Subs) {
                arr_1.push(j)
              }
            }
            localStorage.setItem('leftMenus', JSON.stringify(arr)) ///获取可以进去的菜单
            localStorage.setItem('permissions', JSON.stringify(arr_1)) ///获取可以进去哪些页面信息
            localStorage.setItem('ms_username', res.data.UserName) //测试环境参数，用户姓名
            localStorage.setItem('userCode', res.data.UserCode) //测试环境参数，用户登录帐号
            localStorage.setItem('userType', res.data.UserType) //测试环境参数，用户类型 0-总部用户 1-门店用户  3供应商
            localStorage.setItem('shopCode', res.data.SupplierCode) //测试环境参数，登录用户所属门店编码 总部用户默认空
            ElMessage.success('登录成功')
            router.push('/')
          })
          .catch((err) => {
            ElMessage.error(err)
            eventChangeCode()
            if (err == '登录失败，帐号或密码错误！') {
              if (isShowIdentifyNum.value == 0) {
                nowTime.value = new Date().getTime()
                firstTime.value = nowTime.value
              } else if (isShowIdentifyNum.value > 0) {
                nowTime.value = new Date().getTime()
              }
              if (nowTime.value - firstTime.value < 300000) {
                isShowIdentifyNum.value = isShowIdentifyNum.value + 1
                if (isShowIdentifyNum.value >= 3) {
                  isShowIdentify.value = true
                }
              } else {
                isShowIdentifyNum.value = 1
                nowTime.value = new Date().getTime()
                firstTime.value = nowTime.value
              }
            }
          })
      }
      //云后台过来直接登录
      const submitForm = (OrgId, UserId) => {
        //console.log(query.value);return;
        //var orgId = query.value.OrgId;
        // var OrgId = '4U4SZ1JN9Z7Z153YYXAF6KWM512Y75LLSD1FHD';
        // var UserId = '4U4SZ1LQALFZ12VCGVGWNO6KH3UVG1JOJMS874';
        var outTime = 36000 //0=0+30秒
        //var outTime = 0;
        //var url = 'http://192.168.66.131:8055/api/UserLoginInfo/CreateUserLogin?userCode='+'10001'+'&userType='+1;
        var port = localStorage.getItem('apiUrl')
        var url =
          port +
          '/api/UserLoginInfo/CreateUserLogin?userCode=' +
          UserId +
          '&orgId=' +
          OrgId +
          '&timeOut=' +
          outTime +
          '&userType=' +
          1
        localStorage.setItem('url1', url)
        axios
          .post(url)
          .then((res) => {
            //console.log(res);
            var token = 'Bearer ' + res.data.Token
            localStorage.setItem('Token', token)
            localStorage.setItem('loginTime', new Date().toLocaleDateString().replace(/\//g, '-'))
            //localStorage.setItem("ms_usercode", param.username);
            //localStorage.setItem("Expires", res.data.Expires);
            localStorage.setItem('UserCode', res.data.UserCode)
            let Expires = new Date().getTime()
            Expires = Expires + (outTime - 3600 + 30) * 1000
            //注意这种存储全局变量会把存的值变成json字符串,注意转换！
            localStorage.setItem('Expires', Expires)
            if (res.data.IsPosition) {
              //localStorage.setItem("isShowPosition","0");
              localStorage.setItem('isShowPosition', '1') //测试环境参数，是否显示仓位下拉框,1是显示，0是隐藏
            } else {
              //localStorage.setItem("isShowPosition","1");
              localStorage.setItem('isShowPosition', '0') //测试环境参数，是否显示仓位下拉框,1是显示，0是隐藏
            }
            if (res.data.IsInventory) {
              localStorage.setItem('isLimitInventoryDate', '1') //测试环境参数，是否限制盘库日期,1是限制，0是不限制
            } else {
              localStorage.setItem('isLimitInventoryDate', '0') //测试环境参数，是否限制盘库日期,1是限制，0是不限制
            }
            localStorage.setItem('InventoryStartDate', res.data.StartDay) //测试环境参数，盘库开始日期
            localStorage.setItem('InventoryEndDate', res.data.EndDay) //测试环境参数，盘库结束日期

            //判断是否在盘库日期内
            var thisDay = new Date().getDate()
            if (res.data.StartDay === 0 && res.data.EndDay === 0) {
              localStorage.setItem('isTakeTime', '1') //在盘点时间内
            } else if (
              thisDay >= res.data.StartDay &&
              thisDay <= res.data.EndDay
            ) {
              localStorage.setItem('isTakeTime', '1') //在盘点时间内
            } else {
              localStorage.setItem('isTakeTime', '0') //不在盘点时间内
            }

            var permissionsUrl = port + '/api/UserLoginInfo/GetModulesByUser'
            axios
              .get(permissionsUrl)
              .then((res) => {
                var arr = []
                for (var i of res.data) {
                  arr.push(i)
                  for (var j of i.Subs) {
                    arr.push(j)
                  }
                }
                localStorage.setItem('leftMenus', JSON.stringify(res.data)) ///获取可以进去的菜单
                localStorage.setItem('permissions', JSON.stringify(arr)) ///获取可以进去哪些页面信息


                var UserInfoUrl = port + '/api/UserLoginInfo/GetUserInfo'
                axios
                  .get(UserInfoUrl)
                  .then((res) => {
                    //console.log(res);
                    localStorage.setItem('ms_username', res.data.Name) //测试环境参数，用户姓名
                    localStorage.setItem('userCode', res.data.AccountCode) //测试环境参数，用户登录帐号
                    localStorage.setItem('userType', res.data.OrganizationType) //测试环境参数，用户类型 0-总部用户 1-门店用户
                    localStorage.setItem('OrganizationId', res.data.TopOrgId) //组织ID，辨别客户
                    var OrgsUrl = port + '/api/UserLoginInfo/GetOrgsFromUser'
                    axios
                      .get(OrgsUrl)
                      .then((res) => {
                        localStorage.setItem('shopCode', res.data.OrgIds) //测试环境参数，登录用户所属门店编码 总部用户默认空

                        ElMessage.success('登录成功')
                        router.push('/')
                      })
                      .catch((err) => {
                        ElMessage.error(err)
                      })
                  })
                  .catch((err) => {
                    ElMessage.error(err)
                  })
                // TODO 是否需要token校验，如果不需要直接这样使用，如果需要则启动下面注释的代码块
                // axios
                //   .get(
                //     `${port}/api/UserLoginInfo/IsUserToken?tokenId=${route.query.TokenId}`
                //   )
                //   .then((res) => {
                //     if (process.env.NODE_ENV === 'development') {
                //       var UserInfoUrl = port + '/api/UserLoginInfo/GetUserInfo'
                //       axios
                //         .get(UserInfoUrl)
                //         .then((res) => {
                //           //console.log(res);
                //           localStorage.setItem('ms_username', res.data.Name) //测试环境参数，用户姓名
                //           localStorage.setItem('userCode', res.data.AccountCode) //测试环境参数，用户登录帐号
                //           localStorage.setItem(
                //             'userType',
                //             res.data.OrganizationType
                //           ) //测试环境参数，用户类型 0-总部用户 1-门店用户
                //           localStorage.setItem(
                //             'OrganizationId',
                //             res.data.TopOrgId
                //           ) //组织ID，辨别客户

                //           var OrgsUrl =
                //             port + '/api/UserLoginInfo/GetOrgsFromUser'
                //           axios
                //             .get(OrgsUrl)
                //             .then((res) => {
                //               localStorage.setItem('shopCode', res.data.OrgIds) //测试环境参数，登录用户所属门店编码 总部用户默认空

                //               ElMessage.success('登录成功')
                //               router.push('/')
                //             })
                //             .catch((err) => {
                //               ElMessage.error(err)
                //             })
                //         })
                //         .catch((err) => {
                //           ElMessage.error(err)
                //         })
                //     }
                //     // else {
                //     //   if (res.data == true) {
                //     //     var UserInfoUrl =
                //     //       port + '/api/UserLoginInfo/GetUserInfo'
                //     //     axios
                //     //       .get(UserInfoUrl)
                //     //       .then((res) => {
                //     //         //console.log(res);
                //     //         localStorage.setItem('ms_username', res.data.Name) //测试环境参数，用户姓名
                //     //         localStorage.setItem(
                //     //           'userCode',
                //     //           res.data.AccountCode
                //     //         ) //测试环境参数，用户登录帐号
                //     //         localStorage.setItem(
                //     //           'userType',
                //     //           res.data.OrganizationType
                //     //         ) //测试环境参数，用户类型 0-总部用户 1-门店用户
                //     //         localStorage.setItem(
                //     //           'OrganizationId',
                //     //           res.data.TopOrgId
                //     //         ) //组织ID，辨别客户

                //     //         var OrgsUrl =
                //     //           port + '/api/UserLoginInfo/GetOrgsFromUser'
                //     //         axios
                //     //           .get(OrgsUrl)
                //     //           .then((res) => {
                //     //             localStorage.setItem(
                //     //               'shopCode',
                //     //               res.data.OrgIds
                //     //             ) //测试环境参数，登录用户所属门店编码 总部用户默认空

                //     //             ElMessage.success('登录成功')
                //     //             router.push('/')
                //     //           })
                //     //           .catch((err) => {
                //     //             ElMessage.error(err)
                //     //           })
                //     //       })
                //     //       .catch((err) => {
                //     //         ElMessage.error(err)
                //     //       })
                //     //   } else {
                //     //     ElMessage({
                //     //       message: '身份验证失败，请重新登录',
                //     //       type: 'warning',
                //     //       duration: 1000,
                //     //     })
                //     //     setTimeout(() => {
                //     //       var url = './table.json'
                //     //       axios
                //     //         .get(url)
                //     //         .then((res) => {
                //     //           window.location.href =
                //     //             'http://' + res.data.yunhoutaiUrl
                //     //           window.localStorage.clear() //清除所有key
                //     //         })
                //     //         .catch((err) => {
                //     //           // ElMessage.warning({ message: err, type: 'warning' })
                //     //         })
                //     //     }, 1000)
                //     //   }
                //     // }
                //   })
              })
              .catch((err) => {
                ElMessage.error(err)
              })

            // var UserInfoUrl = port + '/api/UserLoginInfo/GetUserInfo';
            // axios.get(UserInfoUrl).then(res => {
            // 	//console.log(res);
            // 	localStorage.setItem("ms_username", res.data.Name);//测试环境参数，用户姓名
            // 	localStorage.setItem("userCode", res.data.AccountCode);//测试环境参数，用户登录帐号
            // 	localStorage.setItem("userType", res.data.OrganizationType);//测试环境参数，用户类型 0-总部用户 1-门店用户
            // 	localStorage.setItem("OrganizationId", res.data.TopOrgId); //组织ID，辨别客户

            // 	var OrgsUrl = port + '/api/UserLoginInfo/GetOrgsFromUser';
            // 	axios.get(OrgsUrl).then(res => {
            // 		localStorage.setItem("shopCode", res.data.OrgIds);//测试环境参数，登录用户所属门店编码 总部用户默认空

            // 		ElMessage.success("登录成功");
            // 		router.push("/");
            // 	}).catch(err => {
            // 		ElMessage.error(err);
            // 	});

            // }).catch(err => {
            // 	ElMessage.error(err);
            // });
          })
          .catch((err) => {
            ElMessage.error(err)
          })
      }

      const verificationCode = ref(null)
      const identifyCode = ref('1234')
      const identifyCodes = ref('1234567890abcdefghijklmnopqrstuvwxyz')
      // 生成一个随机整数  randomNum(0, 10) 0 到 10 的随机整数， 包含 0 和 10
      const funcRandomNum = (min, max) => {
        max = max + 1
        return Math.floor(Math.random() * (max - min) + min)
      }
      // 随机生成验证码字符串
      const funcMakeCode = (data, len) => {
        for (let i = 0; i < len; i++) {
          identifyCode.value += data[funcRandomNum(0, data.length - 1)]
        }
      }
      // 点击验证码刷新验证码
      const eventChangeCode = () => {
        identifyCode.value = ''
        funcMakeCode(identifyCodes.value, 4)
      }

      const store = useStore()
      store.commit('clearTags')

      return {
        param,
        rules,
        login,
        submitForm,
        query,
        isShowLogin,
        submitFormSupplier,
        verificationCode,
        identifyCode,
        identifyCodes,
        eventChangeCode,
        isShowIdentify,
      }
    },

    components: {
      identify,
    },
  }
</script>
<style>
  .loginHtml .el-button {
    min-height: 26px;
    padding: 0 20px;
    border: none;
  }
  .loginHtml .el-input-group__append,
  .el-input-group__prepend {
    border: none !important;
  }
</style>
<style scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/LoginBackground.png);
    background-size: cover;
    display: flex;
    justify-content: center;
  }
  .loginLogo {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 97px;
    height: 22px;
    background-image: url(../assets/img/LoginLogo.png);
    background-size: 100%;
  }
  .loginBottomTip {
    position: absolute;
    bottom: 50px;
    color: #fff;
    font-size: 14px;
  }
  .loginBottomTip span {
    display: flex;
    align-items: center;
  }
  .loginBottomTip b {
    margin: 0 15px;
    width: 2px;
    height: 17px;
    background-color: #fff;
  }
  .login-wrap * {
    box-sizing: border-box;
  }
  .ms-login {
    width: 720px;
    height: 400px;
    border-radius: 6px;
    background-color: #fff;
    margin-top: 200px;
    position: relative;
  }
  @media screen and (max-width: 1367px) {
    .ms-login {
      margin-top: 120px;
    }
  }
  .loginTitle {
    position: absolute;
    top: -13px;
    left: 35px;
    width: 218px;
    height: 45px;
    background-image: url(../assets/img/LoginTitle.png);
    background-size: 100%;
  }
  .loginContent {
    padding: 80px 50px 60px 50px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .loginLeft {
    width: 270px;
    height: 227px;
    background-image: url(../assets/img/LoginLeft.png);
    background-size: 100%;
    margin-right: 70px;
  }
  .loginRight {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
  }
  .loginRight p {
    font-size: 20px;
    margin-bottom: 20px;
  }
  .inputBox {
    width: 100%;
    height: 34px;
    margin-bottom: 15px;
    position: relative;
    display: flex;
    align-items: center;
    position: relative;
  }
  .inputBox .LoginUser {
    position: absolute;
    z-index: 1;
    top: 10.5px;
    left: 12.5px;
    width: 13px;
    height: 13px;
    background-image: url(../assets/img/LoginUser.png);
    background-size: 100%;
  }
  .inputBox .LoginPassword {
    position: absolute;
    z-index: 1;
    top: 9px;
    left: 12.5px;
    width: 13px;
    height: 16px;
    background-image: url(../assets/img/LoginPassword.png);
    background-size: 100%;
  }
  .inputBox .LoginVerification {
    position: absolute;
    z-index: 1;
    top: 10px;
    left: 12.5px;
    width: 13px;
    height: 14px;
    background-image: url(../assets/img/LoginVerification.png);
    background-size: 100%;
  }
  .inputBox >>> .el-input {
    height: 100% !important;
  }
  .inputBox >>> .el-input__inner {
    height: 100% !important;
    padding-left: 34px;
  }
  .inputBox.identifyBox >>> .el-input__inner {
    padding-right: 115px;
  }
  .inputBox.identifyBox .identify {
    cursor: pointer;
    position: absolute;
    right: 2px;
    top: 2px;
  }
  .loginBtn {
    width: 100%;
    height: 40px;
    border: none;
    outline: none;
    background-color: #63a0fb;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    font-size: 16px;
    line-height: 1;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
