<template>
  <div>
    <Tree ref="menuTree" :data="treeData" show-checkbox @on-check-change="checktHandler" @on-select-change="selectHandler" />
  </div>
</template>

<script>
/**
 * 权限菜单树
 */
import { getMenu } from '@/api/menu'
export default {
  name: 'RoleTree',
  props: {
    // 是否为编辑状态
    editStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 菜单数据
      treeData: []
    }
  },
  mounted() {
    this.getMenuRequest()
  },
  methods: {
    // 获取菜单数据
    getMenuRequest() {
      getMenu().then(res => {
        this.treeData = res.data
        localStorage.setItem('menuTree', JSON.stringify(this.treeData))
      }).catch(error => {
        console.log(error)
      })
    },
    // 节点复选框选择事件
    checktHandler(selection) {
      if (!this.editStatus) {
        const treeData = localStorage.getItem('menuTree')
        if (treeData) {
          this.treeData = JSON.parse(treeData)
        }
        this.notifiyWarning('无法修改，请选择权限进行编辑！')
      }
      this.$emit('onCheck', selection)
    },
    // 节点选中事件
    selectHandler(selection) {
      this.$emit('onSelect', selection)
    },
    // 获取勾选节点
    getCheckedNodes() {
      return this.$refs.menuTree.getCheckedNodes()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
