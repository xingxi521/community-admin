<template>
  <Modal
    v-model="modalShow"
    :title="type === 0? '新增用户' : '修改用户'"
  >
    <Form ref="form" :model="form" :rules="ruleValidate" :label-width="80">
      <FormItem label="用户昵称" prop="nickName">
        <Input v-model="form.nickName" placeholder="请输入用户昵称" />
      </FormItem>
      <FormItem label="登录邮箱" prop="userName">
        <Input v-model="form.userName" prefix="md-mail" placeholder="请输入登录邮箱" />
      </FormItem>
      <FormItem
        label="登录密码"
        prop="passWord"
        :rules="type === 0 ?
          [
            { required: true, message: '请输入登录密码', trigger: 'blur' }
          ]:
          []
        "
      >
        <Input v-model="form.passWord" type="password" prefix="md-lock" placeholder="请输入登录密码" />
      </FormItem>
      <FormItem label="角色" prop="role">
        <Select v-model="form.role" placeholder="请选择角色" multiple>
          <Option v-for="item in userRoleOptions" :key="item._id" :value="item.code">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="用户积分" prop="favs">
        <InputNumber v-model="form.favs" placeholder="请输入用户积分" />
      </FormItem>
      <FormItem label="是否禁用" prop="status">
        <i-switch v-model="form.status" :true-value="1" :false-value="0">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
      <FormItem label="是否VIP" prop="vip">
        <i-switch v-model="form.vip" :true-value="1" :false-value="0">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
      <FormItem label="所在城市" prop="location">
        <Input v-model="form.location" prefix="md-pin" placeholder="请输入所在城市" />
      </FormItem>
      <FormItem label="性别" prop="gender">
        <RadioGroup v-model="form.gender">
          <Radio label="0">男</Radio>
          <Radio label="1">女</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="个性签名" prop="personSign">
        <Input v-model="form.personSign" type="textarea" placeholder="请输入个性签名" />
      </FormItem>
    </Form>
    <template #footer>
      <Button type="text" @click="cancelHandler">取消</Button>
      <Button type="primary" ghost @click="submitHandler">确定</Button>
    </template>
  </Modal>
</template>

<script>
/**
 * 新增、编辑用户
 */
import { createUser, updateUser } from '@/api/user'
export default {
  name: 'AddUserDiaLog',
  props: {
    // 弹窗显示开关
    addShow: {
      type: Boolean,
      default: false
    },
    // 弹窗表单
    addForm: {
      type: Object,
      default: () => {}
    },
    /**
     * 操作类型
     * 0新增
     * 1编辑
     */
    type: {
      type: Number,
      default: 0
    },
    // 角色数据
    userRoleOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      ruleValidate: {
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { type: 'string', min: 4, message: '最少4个字符', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入登录邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不对', trigger: 'blur' }
        ],
        role: [
          { required: true, type: 'array', min: 1, message: '请选择角色', trigger: 'change' }
        ],
        favs: [
          { required: true, type: 'number', message: '请输入用户积分', trigger: 'blur' },
          { required: true, pattern: /^\d+$/, message: '请输入非负整数', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择是否禁用', type: 'number', trigger: 'change' }
        ],
        vip: [
          { required: true, message: '请选择是否vip', type: 'number', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    modalShow: {
      get() {
        return this.addShow
      },
      set(val) {
        this.$emit('update:addShow', val)
      }
    },
    form: {
      get() {
        return this.addForm
      },
      set(val) {
        this.$emit('update:addForm', val)
      }
    }
  },
  methods: {
    // 取消按钮事件
    cancelHandler() {
      this.modalShow = false
    },
    // 确定按钮事件
    submitHandler() {
      this.$refs.form.validate(async (valid) => {
        try {
          if (valid) {
            const res = this.type === 0 ? await createUser(this.form) : await updateUser(this.form)
            this.notifiySuccess(res.msg)
            this.$parent.$parent.getUserListRequest()
            this.form = {
              status: 0,
              vip: 0,
              role: []
            }
            this.modalShow = false
          } else {
            this.notifiyWarning('请填写完整再进行提交！')
          }
        } catch (error) {
          console.log(error)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
