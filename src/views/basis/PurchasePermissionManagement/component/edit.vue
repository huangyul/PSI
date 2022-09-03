<template>
  <div class="page">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="基本信息" name="first">
        <el-form label-width="100px" :model="form" :rules="rules" ref="form">
          <el-form-item label="角色名称" prop="RoleName">
            <el-input v-model="form.RoleName" :disabled="isDisabled"></el-input>
          </el-form-item>
          <el-form-item prop="RoleDesc" label="角色描述">
            <el-input v-model="form.RoleDesc" :disabled="isDisabled"></el-input>
          </el-form-item>
          <el-form-item prop="Remark" label="备注">
            <el-input
              :disabled="isDisabled"
              resize="none"
              type="textarea"
              v-model="form.Remark"
              :rows="5"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="权限设置" name="second" class="permission-set">
        <div class="title">
          <div>请输入品类名称或编号：</div>
          <el-input
            clearable
            v-model="searchList.name"
            @input="onInput"
            @clear="getPlList"
          ></el-input>
        </div>
        <el-tree
          class="permission-tree"
          :data="plList"
          show-checkbox
          node-key="Id"
          ref="elTree"
          :default-checked-keys="defaultCheckedKeys"
          :props="treeProps"
          :disabled="isDisabled"
          :filter-node-method="filterNode"
        />
      </el-tab-pane>

      <el-tab-pane label="授权用户" name="third" class="user-list">
        <el-form class="search">
          <el-form-item label="姓名">
            <el-input v-model="searchList.userName" />
          </el-form-item>
          <el-form-item label="账号">
            <el-input v-model="searchList.userLogin" />
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="searchUser"
              >查询</el-button
            >
            <el-button size="small" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="data-list">
          <el-row :gutter="16" class="item">
            <el-col :span="1"></el-col>
            <el-col :span="4">姓名</el-col>
            <el-col :span="4">登录账号</el-col>
            <el-col :span="6">所属组织</el-col>
            <el-col :span="5">手机号码</el-col>
            <el-col :span="4">账号状态</el-col>
          </el-row>
          <el-row
            :gutter="16"
            v-for="i in userList"
            :key="i.UserLogin"
            class="item"
          >
            <el-col :span="1">
              <el-checkbox
                v-model="i.IsCheck"
                :disabled="isDisabled"
              ></el-checkbox>
            </el-col>
            <el-col :span="4">{{ i.UserName }}</el-col>
            <el-col :span="4">{{ i.UserLogin }}</el-col>
            <el-col :span="6">{{ i.OrgName }}</el-col>
            <el-col :span="5">{{ i.Mobile }}</el-col>
            <el-col :span="4">{{ i.Status }}</el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="options">
      <el-button type="primary" @click="onSubmit" v-if="mode == 'edit'"
        >保存</el-button
      >
      <el-button @click="onCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  function checkRoleName(rule, value, cb) {
    checkLength(64, value, cb, '角色名称最多64个字符')
  }
  function checkRoleDesc(rule, value, cb) {
    checkLength(128, value, cb, '角色描述长度最多128个字符')
  }
  function checkRemark(rule, value, cb) {
    checkLength(256, value, cb, '备注长度最多256个字符')
  }
  function checkLength(length, value, cb, msg) {
    if (value.length > length) {
      cb(new Error(msg))
    } else {
      cb()
    }
  }
  import {
    getUserList,
    getPinLeiList,
    createPurchasePer,
    fetchById,
    updatePurchasePer,
  } from '../../../../api/apiv2/purchasePermission'
  export default {
    emits: ['on-cancel'],
    props: {
      // 模式 edit/编辑 view/查看
      mode: {
        type: String,
        default: 'edit',
      },
      // id
      id: {
        type: Number || String,
        default: 0,
      },
    },
    watch: {
      mode: {
        immediate: true,
        handler(value) {
          this.isDisabled = value == 'view' ? true : false
        },
      },
    },
    data() {
      return {
        form: {
          // 角色名称
          RoleName: '',
          // 角色描述
          RoleDesc: '',
          // 备注
          Remark: '',
        },
        activeName: 'first',
        rules: {
          RoleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { validator: checkRoleName, trigger: 'blur' },
          ],
          RoleDesc: [{ validator: checkRoleDesc, trigger: 'blur' }],
          Remark: [{ validator: checkRemark, trigger: 'blur' }],
        },
        // 搜索条件
        searchList: {
          name: '', // 品类名称
          userName: '', // 姓名
          userLogin: '', // 账号
        },
        userList: [],
        plList: [],
        originUserList: [],
        treeProps: {
          label: 'Name',
          children: 'children',
          disabled: 'disabled',
        },
        isDisabled: false,
        // 树型结构默认展开的
        defaultExpKeys: [],
        // 树型结构默认选中的
        defaultCheckedKeys: [],
        // 原本选中的用户
        originUsers: [],
        // 原本选中的
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      // 点击保存
      onSubmit() {
        // 数据校验
        this.$refs.form.validate(async (valid, fields) => {
          if (!valid) {
            for (let key in fields) {
              return this.$message({
                type: 'warning',
                message: fields[key][0].message,
              })
            }
          } else {
            // 整理选中的授权用户
            let UserCodes = []
            this.originUserList.forEach((u) => {
              if (u.IsCheck) {
                UserCodes.push(u.UserCode)
              }
            })
            if (this.id != 0) {
              await updatePurchasePer({
                ...this.form,
                Id: this.id,
                Modifier:
                  localStorage.getItem(
                    'ms_username'
                  ) /*创建人，即当前操作用户姓名*/,
                MatTypeMIds:
                  this.$refs.elTree.getCheckedKeys() /*勾选的品类Id数组，最底层，即中品类Id*/,
                UserCodes /*勾选的用户Id数组，UserCode值组*/,
              })
              this.onCancel()
              this.$message.success('保存成功')
            } else {
              await createPurchasePer({
                ...this.form,
                Creater:
                  localStorage.getItem(
                    'ms_username'
                  ) /*创建人，即当前操作用户姓名*/,
                MatTypeMIds:
                  this.$refs.elTree.getCheckedKeys() /*勾选的品类Id数组，最底层，即中品类Id*/,
                UserCodes /*勾选的用户Id数组，UserCode值组*/,
              })
              this.onCancel()
              this.$message.success('保存成功')
            }
          }
        })
      },
      // 点击取消
      onCancel() {
        this.$emit('on-cancel')
      },
      // 数据初始化
      async initData() {
        this.getUserList()
        this.getPlList()
        // 如果有传id，则获取详情
        if (this.id != 0) {
          const res = await fetchById({ id: this.id })
          this.form.Remark = res.Remark
          this.form.RoleDesc = res.RoleDesc
          this.form.RoleName = res.RoleName
          // 将role_users回填
          for (let i = 0; i < res.Role_Users.length; i++) {
            for (let j = 0; j < this.userList.length; j++) {
              if (
                res.Role_Users[i].IsCheck &&
                res.Role_Users[i].UserCode == this.userList[j].UserCode
              ) {
                this.userList[j].IsCheck = true
              }
            }
          }
          // 将品类回填
          this.defaultCheckedKeys = []
          res.Role_MatTypes.forEach((i) => {
            if (i.IsCheck) {
              this.defaultCheckedKeys.push(i.MatId)
            }
          })
        }
      },

      // 获取用户列表
      async getUserList() {
        this.userList = []
        const res = await getUserList({
          userName: this.searchList.userName,
          userLogin: this.searchList.userLogin,
        })
        res.forEach((i) => {
          i.Status = i.Status == '1' ? '有效' : '无效'
          i.IsCheck = false
          this.originUserList.push(i)
        })
        this.userList = Array.from(this.originUserList)
      },

      // 获取品类列表
      async getPlList() {
        this.plList = []
        const res = await getPinLeiList({
          name: this.searchList.name,
          sysOrgId: localStorage.getItem('OrganizationId'),
        })
        // 如果是查看模式，要在每条数据中加入disbaled
        let arr = this.dealData(res)
        this.plList = this.mode == 'view' ? arr : res
      },

      dealData(data) {
        data.forEach((d) => {
          if (d?.children.length > 0) {
            this.dealData(d.children)
          }
          if (this.mode == 'view') {
            d.disabled = true
          }
        })
        return data
      },

      // 输入框搜索
      onInput() {
        this.$refs.elTree.filter(this.searchList.name)
      },

      // element树型组件自带的过滤方法
      filterNode(value, data) {
        if (!value) return true
        return data.Name.includes(value)
      },

      searchUser() {
        this.userList = this.originUserList.filter((i) => {
          return (
            i.UserName.includes(this.searchList.userName) &&
            i.UserLogin.includes(this.searchList.userLogin)
          )
        })
      },

      reset() {
        this.searchList.userLogin = ''
        this.searchList.userName = ''
        this.userList = this.originUserList
      },
    },
  }
</script>

<style lang="scss" scoped>
  .page {
    &:deep .is-active {
      border-bottom: 1px solid #e4e7ed !important;
      // background: red !important;
    }
    .permission-set {
      .title {
        display: flex;
        div:nth-child(1) {
          min-width: 160px;
        }
      }
      .permission-tree {
        max-height: 400px;
        overflow: hidden auto;
      }
    }
    .user-list {
      .search {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .data-list {
        max-height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
        .item {
          margin: 5px 0;
        }
      }
    }
    .options {
      margin: 20px 0;
      text-align: center;
    }
  }
</style>
