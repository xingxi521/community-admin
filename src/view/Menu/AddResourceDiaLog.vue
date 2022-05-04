<template>
  <Modal
    v-model="modalShow"
    :title="type === 0? '新增资源' : '修改资源'"
  >
    <Form ref="form" :model="form" :rules="ruleValidate" :label-width="80">
      <FormItem label="资源名称" prop="name">
        <Input v-model="form.name" placeholder="请输入资源名称" />
      </FormItem>
      <FormItem label="请求路径" prop="path">
        <Input v-model="form.path" placeholder="请输入请求路径" />
      </FormItem>
      <FormItem label="资源类型" prop="type">
        <Select v-model="form.type" placeholder="请选择资源类型">
          <Option value="api">接口</Option>
          <Option value="btn">按钮</Option>
        </Select>
      </FormItem>
      <FormItem label="请求类型" prop="method">
        <Select v-model="form.method" placeholder="请选择请求类型">
          <Option value="PUT">PUT</Option>
          <Option value="POST">POST</Option>
          <Option value="GET">GET</Option>
          <Option value="DELETE">DELETE</Option>
        </Select>
      </FormItem>
      <FormItem label="描述" prop="remark">
        <Input v-model="form.remark" type="textarea" placeholder="请输入描述" />
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
          { required: true, message: '请输入资源名称', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入请求路径', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择资源类型', trigger: 'change' }
        ],
        method: [
          { required: true, message: '请选择请求类型', trigger: 'change' }
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

