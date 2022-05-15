<template>
  <Form ref="formData" :model="form" :rules="rule" :label-width="80" :disabled="isEdit">
    <FormItem label="菜单标题" prop="title">
      <Input v-model="form.title" placeholder="请输入菜单标题" />
    </FormItem>
    <FormItem label="前端路由" prop="path">
      <Input v-model="form.path" placeholder="请输入前端跳转路由路径" />
    </FormItem>
    <FormItem label="菜单类型" prop="type">
      <Select v-model="form.type" placeholder="请选择菜单类型">
        <Option v-for="item in menuTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <FormItem label="组件名称" prop="name">
      <Input v-model="form.name" placeholder="请输入前端组件名称" />
    </FormItem>
    <template v-if="form.type !== MENU_TYPE.LINK">
      <FormItem label="前端组件" prop="component">
        <Input v-model="form.component" placeholder="请输入前端组件文件路径">
          <span slot="prepend">()=>import('@</span>
          <span slot="append">.vue')</span>
        </Input>
      </FormItem>
      <FormItem label="面包屑隐藏" prop="hideInBread">
        <i-switch v-model="form.hideInBread">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
      <FormItem label="菜单隐藏" prop="hideInMenu">
        <i-switch v-model="form.hideInMenu">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
      <FormItem label="页面不缓存" prop="notCache">
        <i-switch v-model="form.notCache">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
    </template>

    <FormItem label="菜单图标" prop="icon">
      <Input v-model="form.icon" placeholder="请输入菜单显示图标（iview支持的icon才行）" />
    </FormItem>
    <FormItem label="重定向" prop="redirect">
      <Input v-model="form.redirect" placeholder="请输入重定向地址" />
    </FormItem>
    <FormItem v-if="!isEdit">
      <Button type="primary" @click="submitHandler">确定</Button>
      <Button style="margin-left: 8px" @click="cancel">取消</Button>
    </FormItem>
  </Form>
</template>

<script>
/**
 * 菜单基础信息
 */
import { MENU_TYPE } from '@/libs/const/menu'
export default {
  name: 'MenuInfo',
  props: {
    // 表单数据
    formData: {
      type: Object,
      default: () => {}
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
      MENU_TYPE,
      menuTypeOptions: MENU_TYPE.getLabelData(),
      // 表单校验规则
      rule: {
        title: [
          { required: true, message: '请输入菜单标题', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入前端路由路径', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择菜单类型', trigger: 'change', type: 'number' }
        ],
        name: [
          { required: true, message: '请输入组件名称', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请输入前端组件文件路径', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    form: {
      get() {
        return this.formData
      },
      set(val) {
        this.$emit('update:formData', val)
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
    cancel() {
      this.$refs.formData.resetFields()
      this.form.operations = []
      this.isEdit = true
    },
    // 确定按钮事件
    submitHandler() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.$emit('onSubmit')
        } else {
          this.notifiyWarning('请输入完整数据后再提交！')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
