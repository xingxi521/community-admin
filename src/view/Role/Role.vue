<template>
  <div>
    <Row :gutter="12">
      <Col span="5" :sm="24" :md="24" :lg="5">
        <Card dis-hover>
          <p slot="title">
            <Icon type="md-contacts" size="16" />
            角色列表
          </p>
          <Button slot="extra" type="primary" ghost size="small" :disabled="isEdit" @click="createRoleHandler"><Icon type="md-add" />新增</Button>
          <RoleList :list-data="listData" :add-show.sync="addShow" @onNodeClick="onNodeClick" @onSubmit="onSubmitDiaLog" @onEdit="onEditHandler" />
        </Card>
      </Col>
      <Col span="6" :sm="24" :md="8" :lg="6">
        <Card dis-hover>
          <p slot="title">
            <Icon type="md-menu" size="16" />
            菜单权限
          </p>
          <ButtonGroup slot="extra" size="small" class="btn-group">
            <Button :disabled="!isEdit" size="small" type="primary" @click="confirmHandler">
              <Icon type="ios-create" />
              确定
            </Button>
            <Button :disabled="!isEdit" size="small" @click="menuCancel">
              <Icon type="md-trash" />
              取消
            </Button>
          </ButtonGroup>
          <RoleTree ref="roleTree" :edit-status="isEdit" @onCheck="onCheckHandler" @onSelect="onTreeSelectHandler" />
        </Card>
      </Col>
      <Col span="13" :sm="24" :md="16" :lg="13">
        <Card dis-hover>
          <p slot="title">
            <Icon type="md-exit" size="16" />
            资源权限
          </p>
          <Tables ref="tables" v-model="operations" :columns="columns" @on-select="onTableSelect" />
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
/**
 * 角色权限页面
 */
import { getRoleList, addRole } from '@/api/role'
import { getFieldArr } from '@/libs/public'
export default {
  name: 'RoleIndex',
  components: {
    RoleList: () => import('./RoleList'),
    RoleTree: () => import('./RoleTree')
  },
  data() {
    return {
      // 新增弹窗显示开关
      addShow: false,
      isEdit: false,
      // 资源权限表格数据
      operations: [],
      backUpOperations: [],
      // 表格列席
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '资源名称',
          key: 'name',
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
        {
          title: '资源路径',
          key: 'path',
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
        {
          title: '请求类型',
          key: 'method',
          align: 'center'
        },
        {
          title: '资源类型',
          key: 'type',
          align: 'center'
        },
        {
          title: '描述',
          key: 'remark',
          align: 'center'
        }
      ],
      // 角色列表数据
      listData: [],
      // 当前选中的菜单树节点
      currentTreeId: '',
      // 当前选中的角色
      currentRole: {}
    }
  },
  mounted() {
    this.getRoleListRequest()
  },
  methods: {
    // 获取角色列表
    getRoleListRequest() {
      getRoleList().then(res => {
        this.listData = res.data
      })
    },
    // 角色节点点击事件
    onNodeClick(item, idx) {
      this.currentRole = { ...item }
      const menuTreeLocal = JSON.parse(localStorage.getItem('menuTree'))
      if (item._id) { // 证明选中有数的
        const { menus } = item
        this.setChecked(menuTreeLocal, menus)
      } else {
        this.$refs.roleTree.treeData = menuTreeLocal
      }
    },
    // 根据权限id设置节点选中
    setChecked(data, menus) {
      data.forEach(item => {
        if (menus.indexOf(item._id) !== -1) {
          this.$set(item, 'checked', true)
        }
        if (item.operations && item.operations.length > 0) {
          item.operations.forEach(ope => {
            if (menus.indexOf(ope._id) !== -1) {
              this.$set(ope, '_checked', true)
            }
          })
        }
        if (item.children && item.children.length > 0) {
          this.setChecked(item.children, menus)
        }
      })
      this.$refs.roleTree.treeData = data
    },
    // 新增角色弹窗确定按钮事件
    onSubmitDiaLog(form) {
      addRole(form).then(res => {
        this.notifiySuccess(res.msg)
        this.getRoleListRequest()
        this.addShow = false
      })
    },
    // 新增角色按钮事件
    createRoleHandler() {
      this.addShow = true
    },
    // 编辑按钮事件
    onEditHandler() {
      this.isEdit = true
    },
    // 菜单取消按钮事件
    menuCancel() {
      this.isEdit = false
    },
    // 树节点复选框勾选事件
    onCheckHandler(selection) {
    },
    // 树节点选中事件
    onTreeSelectHandler(selection) {
      if (selection.length > 0) {
        this.operations = selection[0].operations
        this.currentTreeId = selection[0]._id
        this.backUpOperations = [...selection[0].operations]
      } else {
        this.operations = []
        this.backUpOperations = []
      }
    },
    // 表格复选框选择事件
    onTableSelect(selection, row) {
      if (!this.isEdit) {
        this.$nextTick(() => {
          this.operations = [...this.backUpOperations]
        })
        this.notifiyWarning('无法修改，请选择权限进行编辑！')
      }
      this.setMenuTableChecked(row._id, this.$refs.roleTree.treeData)
    },
    // 菜单权限确定按钮事件
    confirmHandler() {
      const checkedNode = this.$refs.roleTree.getCheckedNodes()
      const checkedTreeNode = getFieldArr(checkedNode, '_id')
      const chekedResource = this.getMenuResource(checkedNode)
      console.log(checkedTreeNode, chekedResource)
      addRole({
        _id: this.currentRole._id,
        menus: [...checkedTreeNode, ...chekedResource]
      }).then(res => {
        this.notifiySuccess(res.msg)
        this.getRoleListRequest()
        this.isEdit = false
      })
    },
    // 设置菜单树节点选中的资源权限
    setMenuTableChecked(id, treeData) {
      treeData.forEach(item => {
        if (this.currentTreeId === item._id) {
          item.operations.forEach(ope => {
            if (ope._id === id) {
              this.$set(ope, '_checked', !ope._checked)
            }
          })
        } else if (item.children && item.children.length > 0) {
          this.setMenuTableChecked(id, item.children)
        }
      })
    },
    // 获取菜单树节点所有勾选的资源权限ID
    getMenuResource(treeData) {
      const result = []
      treeData.forEach(item => {
        if (item.operations && item.operations.length > 0) {
          item.operations.forEach(ope => {
            if (ope._checked) {
              result.push(ope._id)
            }
          })
        }
        if (item.children && item.children.length > 0) {
          result.concat(this.getMenuResource(item.children))
        }
      })
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep{
  .ivu-btn > span{
    vertical-align: unset;
  }
}

</style>
