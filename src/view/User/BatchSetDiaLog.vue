<template>
  <Modal
    v-model="modalShow"
    title="批量设置用户'"
  >
    <Form ref="form" :model="form" :label-width="80">
      <FormItem label="角色" prop="role">
        <Select v-model="form.role" placeholder="请选择角色" multiple>
          <Option v-for="item in userRoleOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="是否禁用" prop="status">
        <Select v-model="form.status" placeholder="请选择是否禁用">
          <Option v-for="item in isNoOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="是否VIP" prop="vip">
        <Select v-model="form.vip" placeholder="请选择是否VIP">
          <Option v-for="item in isNoOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select>
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
 * 批量设置弹窗
 */
import { USER_ROLE } from '@/libs/const/user'
export default {
  name: 'BatchSetDiaLog',
  props: {
    // 弹窗显示开关
    addShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userRoleOptions: USER_ROLE.getLabelData(null, null, false),
      form: {
        role: ['user'],
        status: -1,
        vip: -1
      },
      isNoOptions: [
        {
          label: '不设置',
          value: -1
        },
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
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
    }
  },
  methods: {
    // 取消按钮事件
    cancelHandler() {
      this.modalShow = false
      this.form = {
        role: ['user']
      }
    },
    // 确定按钮事件
    submitHandler() {
      const params = { ...this.form }
      if (params.status === -1) {
        delete params.status
      }
      if (params.vip === -1) {
        delete params.vip
      }
      if (!params.role.length) {
        delete params.role
      }
      this.$emit('onSubmit', params)
      this.form = {
        role: ['user']
      }
      this.modalShow = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
