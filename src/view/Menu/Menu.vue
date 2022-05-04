<template>
  <div style="height: 100%;">
    <Row :gutter="8" style="height: 100%;">
      <Col :span="6" :sm="24" :md="9" :lg="6" style="height: 100%;">
        <Card dis-hover style="height: 100%; overflow: auto;">
          <MenuTree :data.sync="menuTreeData" :edit.sync="editStatus" @addMenu="addMenuHandler" @nodeClick="nodeClickHandler" @onUpdate="updateMenuHandler" @onDelete="deleteHandler" />
        </Card>
      </Col>
      <Col :span="18" :sm="24" :md="15" :lg="18">
        <Card dis-hover>
          <p slot="title">
            <Icon type="ios-options" size="18" />
            菜单基础信息
          </p>
          <MenuInfo :form-data.sync="formData" :edit.sync="editStatus" @onSubmit="onSubmitHandler" />
        </Card>
        <Card style="margin-top: 10px;">
          <p slot="title">
            资源配置
          </p>
          <Tables ref="tables" v-model="formData.operations" :loading="dataLoading" :columns="columns">
            <template #btnGroup>
              <div v-if="!editStatus">
                <Button type="primary" icon="md-person-add" ghost @click="addResourceHandler">新增资源</Button>
              </div>
            </template>
            <template #action="slotProps">
              <Icon v-if="!editStatus" type="md-build" size="20" style="margin-right: 5px;" @click="updateResource(slotProps.row, slotProps.index)" />
              <Icon v-if="!editStatus" type="md-trash" size="20" />
            </template>
          </Tables>
          <AddResourceDiaLog :add-show.sync="resourceShow" :add-form.sync="resourceForm" :type="resourceType" :edit.sync="editStatus" @onSubmit="resourceSubmit" />
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
/**
 * 菜单管理
 */
import { addMenu, getMenu, updateMenu, deleteMenu } from '@/api/menu'
export default {
  name: 'MenuIndex',
  components: {
    MenuTree: () => import('./MenuTree'),
    MenuInfo: () => import('./MenuInfo'),
    AddResourceDiaLog: () => import('./AddResourceDiaLog')
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      // 表格列席
      columns: [
        {
          title: '资源名称',
          key: 'name',
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
        {
          title: '请求路径',
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
        },
        {
          title: '操作',
          key: 'action',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      // 数据加载状态
      dataLoading: false,
      // 菜单基础信息表单
      formData: {
        title: '',
        path: '',
        name: '',
        component: '',
        icon: '',
        redirect: '',
        type: 0,
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        pid: null,
        operations: []
      },
      /**
       * 编辑状态
       * true 不是
       * false 是
       */
      editStatus: true,
      // 树形数据
      menuTreeData: [],
      // 选中的树形数据
      selectTreeData: [],
      // 新增编辑资源弹窗显示开关
      resourceShow: false,
      // 新增编辑资源弹窗表单
      resourceForm: {},
      //  新增编辑资源弹窗操作类型 0新增 1编辑
      resourceType: 0,
      // 当前操作的资源索引
      currentResourceIdx: ''
    }
  },
  mounted() {
    this.getMenuRequest()
  },
  methods: {
    // 获取菜单数据
    getMenuRequest() {
      getMenu().then(res => {
        this.menuTreeData = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    // 新增按钮事件
    addMenuHandler(val) {
      if (!this.menuTreeData.length || this.selectTreeData.length > 0) {
        this.formData = {
          title: '',
          path: '',
          name: '',
          component: '',
          icon: '',
          redirect: '',
          type: 0,
          hideInBread: false,
          hideInMenu: false,
          notCache: false,
          pid: null,
          operations: []
        }
        if (this.selectTreeData.length > 0) {
          const selectData = this.selectTreeData[0]
          if (val === 'brother') { // 新增兄弟节点
            this.formData.pid = selectData.pid
          } else if (val === 'child') { // 新增子节点
            this.formData.pid = selectData._id
          }
        }
        this.editStatus = false
      } else {
        this.notifiyWarning('请先选择节点后再进行新增！')
      }
    },
    // 树形节点点击事件
    nodeClickHandler(item) {
      if (!this.editStatus) { // 编辑状态
        this.notifiyWarning('当前正在编辑，请先取消再进行选择！')
        return
      }
      this.selectTreeData = item
      this.formData = { ...item[0] }
    },
    // 菜单基础信息确定按钮事件
    async onSubmitHandler() {
      const res = this.formData._id ? await updateMenu(this.formData) : await addMenu(this.formData)
      this.notifiySuccess(res.msg)
      this.editStatus = true
      this.formData = {
        title: '',
        path: '',
        name: '',
        component: '',
        icon: '',
        redirect: '',
        type: 0,
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        pid: null,
        operations: []
      }
      this.getMenuRequest()
    },
    // 修改菜单按钮事件
    updateMenuHandler() {
      if (!this.selectTreeData.length) {
        this.notifiyWarning('请先选择菜单节点后再进行修改！')
      } else {
        this.editStatus = false
      }
    },
    // 新增资源按钮事件
    addResourceHandler() {
      this.resourceShow = true
    },
    // 资源弹窗确定按钮事件
    resourceSubmit(item, type) {
      if (type === 0) {
        this.formData.operations.push(item)
      } else {
        this.formData.operations.splice(this.currentResourceIdx, 1, item)
      }
    },
    // 修改资源按钮事件
    updateResource(row, index) {
      this.resourceType = 1
      this.currentResourceIdx = index
      this.resourceForm = { ...row }
      this.resourceShow = true
    },
    // 删除按钮事件
    deleteHandler() {
      if (!this.selectTreeData.length) {
        this.notifiyWarning('请先选择菜单节点后再进行删除！')
      } else {
        this.confirmBox(`确定要删除节点【${this.selectTreeData[0].title}】包括其所有子节点孙节点吗？`, () => {
          deleteMenu({
            _id: this.selectTreeData[0]._id
          }).then(res => {
            this.notifiySuccess(res.msg)
            this.getMenuRequest()
          })
        }, () => {})
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
