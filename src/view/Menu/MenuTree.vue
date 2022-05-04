<template>
  <div>
    <Row type="flex" justify="center">
      <ButtonGroup size="small" class="btn-group" :class="{'edit-border': edit === false}">
        <Button size="small" :disabled="!edit">
          <Dropdown @on-click="addMenu">
            <a href="javascript:void(0)">
              <Icon type="md-add" />
              <span>新增</span>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="brother">兄弟节点</DropdownItem>
              <DropdownItem name="child" :disabled="!data.length">子节点</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Button>
        <Button size="small" type="primary" :disabled="!edit" @click="updateHandler">
          <Icon type="ios-create" />
          修改
        </Button>
        <Button size="small" type="error" :disabled="!edit" @click="deleteHandler">
          <Icon type="md-trash" />
          删除
        </Button>
      </ButtonGroup>
    </Row>
    <Tree :data="treeData" @on-select-change="treeClickHandler" />
  </div>
</template>

<script>
/**
 * 菜单树
 */
export default {
  name: 'MenuTree',
  props: {
    // 树形数据
    data: {
      type: Array,
      default: () => []
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
    }
  },
  computed: {
    treeData: {
      get() {
        return this.data
      },
      set(val) {
        this.$emit('update:data', val)
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
    // 新增按钮事件
    addMenu(val) {
      this.$emit('addMenu', val)
    },
    // 树节点选择事件
    treeClickHandler(item) {
      this.$emit('nodeClick', item)
    },
    // 修改按钮事件
    updateHandler() {
      this.$emit('onUpdate')
    },
    // 删除按钮事件
    deleteHandler() {
      this.$emit('onDelete')
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-group{
  ::v-deep{
    button{
      span{
        font-size: 14px;
      }
    }
  }
}
.edit-border{
  a{
    color: #c5c8ce;
  }
  .ivu-btn-primary{
    border-right-color: #DCDEE2 !important;
    border-left-color: #DCDEE2 !important;
  }
}
</style>
