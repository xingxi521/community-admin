<template>
  <div>
    <Card>
      <SearchForm :json="formConfig" :model.sync="queryForm" @handleQuery="onPageHandler" />
    </Card>
    <Card style="margin-top: 15px;">
      <Tables ref="tables" v-model="tableData" :loading="dataLoading" :columns="columns" @on-selection-change="selectionChange">
        <template #btnGroup>
          <div>
            <Button type="primary" icon="md-person-add" ghost @click="addUserHandler">新增用户</Button>
            <Button type="primary" icon="md-trash" ghost style="margin-left: 10px;" @click="deleteBatchHandler">批量删除</Button>
            <Button type="primary" icon="md-trash" ghost style="margin-left: 10px;" @click="bactchSetHandler">批量设置</Button>
          </div>
        </template>
        <template #action="slotProps">
          <Icon type="md-build" size="20" style="margin-right: 5px;" @click="updateHandler(slotProps.row)" />
          <Icon type="md-trash" size="20" @click="deleteHandler(slotProps.row)" />
        </template>
      </Tables>
      <Pagination
        :total="total"
        :page.sync="queryForm.pageNum"
        :size.sync="queryForm.pageSize"
        @pagination="onPageHandler"
      />
      <!-- 新增-编辑用户 -->
      <AddUserDiaLog :add-show.sync="addShow" :user-role-options="userRoleOptions" :add-form.sync="addForm" :type="diaLogType" />
      <!-- 批量设置 -->
      <BatchSetDiaLog :add-show.sync="batchShow" :user-role-options="userRoleOptions" @onSubmit="batchSetSubmit" />
    </Card>
  </div>

</template>

<script>
/**
 * 用户管理
 */
import { USER_ROLE } from '@/libs/const/user'
import dayjs from 'dayjs'
import { getRoleName } from '@/api/role'
import { getUserList, deleteUser, updateUser } from '@/api/user'
export default {
  name: 'User',
  components: {
    AddUserDiaLog: () => import ('./AddUserDiaLog'),
    BatchSetDiaLog: () => import('./BatchSetDiaLog')
  },
  data() {
    return {
      // 数据加载状态
      dataLoading: false,
      // 表格数据
      tableData: [],
      // 表格列项
      columns: [
        {
          type: 'selection',
          width: 60,
          key: 'handle',
          align: 'center'
        },
        {
          title: '用户昵称',
          key: 'nickName',
          ellipsis: true,
          tooltip: true
        },
        {
          title: '登录邮箱',
          key: 'userName',
          tooltip: true
        },
        {
          title: '角色',
          key: 'key',
          render: (h, { row }) => {
            const result = row.role.map(item => USER_ROLE.getMapping()[item])
            return h('span', result.join('，'))
          }
        },
        {
          title: '积分',
          key: 'favs'
        },
        {
          title: '是否禁用',
          key: 'status',
          render: (h, { row }) => {
            return h('span', row.status ? '是' : '否')
          }
        },
        {
          title: '是否VIP',
          key: 'vip',
          render: (h, { row }) => {
            return h('span', row.vip ? '是' : '否')
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          sortable: true,
          width: 150,
          render: (h, { row }) => {
            return h('span', dayjs(row.createTime).format('YYYY-MM-DD hh:mm:ss'))
          }
        },
        {
          title: '操作',
          key: 'action',
          slot: 'action',
          width: 150,
          align: 'center',
          fixed: 'right'
        }
      ],
      total: 0,
      // 弹窗显示开关
      addShow: false,
      // 弹窗表单
      addForm: {
        status: 0,
        vip: 0,
        favs: 100,
        role: []
      },
      // 弹窗操作类型 0新增 1编辑
      diaLogType: 0,
      // 选中数据
      selection: [],
      // 批量设置弹窗显示开关
      batchShow: false,
      queryForm: {
        pageNum: 1,
        pageSize: 20
      },
      formConfig: [
        {
          type: 'text',
          model: 'nickName',
          label: '用户昵称',
          placeholder: '请输入用户名称'
        },
        {
          type: 'text',
          model: 'userName',
          label: '登录邮箱',
          placeholder: '请输入登录邮箱'
        },
        {
          type: 'select',
          model: 'status',
          label: '是否禁用',
          placeholder: '请选择是否禁用',
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 }
          ]
        },
        {
          type: 'select',
          model: 'vip',
          label: '是否VIP',
          placeholder: '请选择是否vip',
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 }
          ]
        },
        {
          type: 'daterange',
          model: 'createTime',
          label: '创建时间',
          placeholder: '请选择创建时间',
          width: '100%'
        }
      ],
      // 角色数据
      userRoleOptions: []
    }
  },
  mounted() {
    this.getUserListRequest()
    this.getRoleNameRequest()
  },
  methods: {
    // 获取角色数据
    getRoleNameRequest() {
      getRoleName().then(res => {
        this.userRoleOptions = res.data
      })
    },
    // 获取用户列表数据
    getUserListRequest(params = this.queryForm) {
      this.dataLoading = true
      getUserList(params).then(res => {
        this.tableData = res.data.records
        this.queryForm.pageSize = res.data.pageSize
        this.queryForm.pageNum = res.data.pageNum
        this.total = res.data.total
        this.dataLoading = false
      }).catch(error => {
        console.log(error)
        this.dataLoading = false
      })
    },
    // 新增用户
    addUserHandler() {
      this.diaLogType = 0
      this.addShow = true
    },
    // 编辑用户
    updateHandler(row) {
      this.diaLogType = 1
      this.addForm = { ...row }
      this.addShow = true
    },
    // 删除用户
    deleteHandler(row) {
      this.confirmBox(`确定要删除用户【${row.nickName}】吗？`, () => {
        deleteUser({
          _id: row._id
        }).then(res => {
          this.notifiySuccess(res.msg)
          this.getUserListRequest()
        })
      }, () => {})
    },
    // 分页切换事件
    onPageHandler() {
      this.getUserListRequest()
    },
    // 批量删除按钮事件
    deleteBatchHandler() {
      if (!this.selection.length) {
        this.notifiyWarning('请先选择需要删除的用户！')
      } else {
        const delArr = this.selection.map(item => item._id)
        const delUser = this.selection.map(item => item.userName).join('，')
        this.confirmBox(`确定要批量删除用户【${delUser}】吗？`, () => {
          deleteUser({
            _id: delArr
          }).then(res => {
            this.notifiySuccess(res.msg)
            this.getUserListRequest()
          })
        }, () => {})
      }
    },
    // 表格选择事件
    selectionChange(selection) {
      this.selection = selection
    },
    // 批量设置按钮事件
    bactchSetHandler() {
      if (!this.selection.length) {
        this.notifiyWarning('请先选择需要删除的用户！')
      } else {
        this.batchShow = true
      }
    },
    // 批量设置弹窗确定按钮事件
    batchSetSubmit(params) {
      // 如果空对象 用户没设置任何东西，不需要请求
      const hasData = Object.keys(params)
      if (!hasData.length) return
      const ids = this.selection.map(item => item._id)
      updateUser({
        ids,
        params
      }).then(res => {
        this.notifiySuccess(res.msg)
        this.getUserListRequest()
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
