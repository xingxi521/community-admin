<template>
  <Modal
    v-model="modalShow"
    :title="type === 0 ? '新增角色' : '修改角色'"
  >
    <Form ref="form" :model="form" :rules="ruleValidate" :label-width="80">
      <FormItem label="角色名称" prop="name">
        <Input v-model="form.name" placeholder="请输入角色名称" />
      </FormItem>
      <FormItem label="角色编码" prop="code">
        <Input v-model="form.code" placeholder="请输入角色编码" />
      </FormItem>
      <FormItem label="描述" prop="desc">
        <Input v-model="form.desc" type="textarea" placeholder="请输入描述" />
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
 * 新增、编辑资源
 */
export default {
  name: 'AddResourceDiaLog',
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
    /**
     * 新增编辑状态
     * true 不是编辑状态
     * false 编辑状态
     */
    edit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      ruleValidate: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
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
    },
    isEdit: {
      get() {
        return this.edit
      },
      set(val) {
        this.$emit('update:edit', val)
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
            this.$emit('onSubmit', { ...this.form }, this.type)
            this.$refs.form.resetFields()
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

