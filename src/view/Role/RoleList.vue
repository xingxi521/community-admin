<template>
  <div>
    <ul class="role-list-box">
      <li v-for="(item,idx) in listData" :key="item.url" @click="onClick(item, idx)">
        <span class="role-name" :class="{'active-name': idx === currentIndex}">{{ item.name }}</span>
        <span class="role-i">
          <Icon type="ios-create" size="16" @click.stop="updateHandler(item, idx)" />
          <Icon type="md-build" size="16" color="#2D8CF0" @click.stop="editHandler(idx)" />
          <Icon type="md-trash" size="16" color="#ED4041" @click.stop="deleteHandler(item)" />
        </span>
      </li>
    </ul>
    <!-- 新增编辑角色弹窗 -->
    <AddRoleDiaLog :add-show.sync="modalShow" :add-form.sync="addForm" :type="addType" @onSubmit="addSubmit" />
  </div>
</template>

<script>
/**
 * 角色权限树
 */
export default {
  name: 'RoleList',
  components: {
    AddRoleDiaLog: () => import('./AddRoleDiaLog')
  },
  props: {
    addShow: {
      type: Boolean,
      default: false
    },
    listData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 当前选中的角色索引
      currentIndex: '',
      // 新增角色弹窗表单
      addForm: {},
      // 新增角色弹窗操作类型
      addType: 0
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
    // 角色项点击事件
    onClick(item, idx) {
      if (this.currentIndex === idx) {
        this.currentIndex = ''
        this.$emit('onNodeClick', {}, idx)
      } else {
        this.currentIndex = idx
        this.$emit('onNodeClick', item, idx)
      }
    },
    // 新增弹窗确定按钮事件
    addSubmit(form, type) {
      this.$emit('onSubmit', form, type)
    },
    // 修改按钮事件
    updateHandler(item, idx) {
      this.currentIndex = idx
      this.addType = 1
      this.addForm = { ...item }
      this.modalShow = true
    },
    // 编辑角色权限按钮事件
    editHandler(idx) {
      this.currentIndex = idx
      this.$emit('onEdit')
    },
    // 删除角色
    deleteHandler(item) {
      this.$emit('onDelete', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.role-list-box{
  list-style: none;
  li{
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    .role-i{
      display: none;
      cursor: auto;
      i {
        margin-right: 4px;
      }
    }
    .role-name{
      border-radius: 2px;
      padding: 0 2px;
    }
    .active-name{
      background: #d5e8fc;
    }
    &:hover .role-name{
      background-color: #eaf4fe;
    }
    &:hover .role-i{
      display: inline-block;
    }
  }
}
</style>
