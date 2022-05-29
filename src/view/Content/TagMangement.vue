<template>
  <Card>
    <Tables ref="tables" v-model="tableData" :loading="dataLoading" :columns="columns" searchable>
      <template #btnGroup>
        <div>
          <Button type="primary" icon="md-add" ghost @click="addTagHandler">新增标签</Button>
        </div>
      </template>
      <template #action="slotProps">
        <Icon type="md-build" size="20" style="margin-right: 5px;" @click="updateHandler(slotProps.row)" />
        <Icon type="md-trash" size="20" @click="deleteHandler(slotProps.row)" />
      </template>
    </Tables>
    <Pagination
      :total="total"
      :page.sync="pageNum"
      :size.sync="pageSize"
      @pagination="onPageHandler"
    />
    <Modal
      v-model="addShow"
      title="新增标签"
    >
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="60">
        <FormItem label="名称" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入名称" />
        </FormItem>
        <FormItem label="类名" prop="className">
          <Select v-model="formValidate.className" placeholder="请选择类名">
            <Option v-for="item in tagClassNameOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
      <template #footer>
        <Button type="text" @click="cancelHandler">取消</Button>
        <Button type="primary" ghost @click="submitHandler">确定</Button>
      </template>
    </Modal>
  </Card>
</template>

<script>
/**
 * 标签管理
 */
import { getTagList, addTag, deleteTag } from '@/api/data'
import { TAG_CLASS_NAME } from '@/libs/const/content'
import { deepClone } from '@/libs/util'
import Tables from '_c/tables'
import Pagination from '@/components/Pagination'
export default {
  name: 'TagManagement',
  components: {
    Tables,
    Pagination
  },
  data () {
    return {
      TAG_CLASS_NAME,
      tagClassNameOptions: TAG_CLASS_NAME.getLabelData(null, null, false),
      columns: [
        {
          title: '序号',
          type: 'index',
          key: 'handle',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'name',
          ellipsis: true,
          tooltip: true
        },
        {
          title: '类名',
          key: 'className'
        },
        {
          title: '操作',
          key: 'action',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      tableData: [],
      // 每页显示条数
      pageSize: 20,
      // 当前页数
      pageNum: 1,
      total: 0,
      // 数据加载状态
      dataLoading: false,
      // 弹窗显示开关
      addShow: false,
      // 弹窗表单
      formValidate: {},
      // 表单验证规则
      ruleValidate: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        className: [{ required: true, message: '请选择类名', trigger: 'change' }]
      }
    }
  },
  mounted () {
    this.getTagListRequest()
  },
  methods: {
    // 获取标签分页数据
    getTagListRequest() {
      this.dataLoading = true
      getTagList({
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        this.tableData = res.data.records
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.total = res.data.total
        this.dataLoading = false
      }).catch(() => {
        this.dataLoading = false
      })
    },
    // 新增标签按钮事件
    addTagHandler() {
      this.addShow = true
    },
    // 弹窗确定按钮事件
    submitHandler() {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          addTag(this.formValidate).then(res => {
            this.notifiySuccess(res.msg)
            this.getTagListRequest()
            this.formValidate = {}
            this.addShow = false
          })
        } else {
          this.notifiyWarning('请填写完整信息再提交！')
        }
      })
    },
    // 弹窗取消按钮事件
    cancelHandler() {
      this.formValidate = {}
      this.addShow = false
    },
    onPageHandler() {
      this.getTagListRequest()
    },
    // 表格删除按钮事件
    deleteHandler(row) {
      this.confirmBox(`确定要删除标签【${row.name}】吗？`, () => {
        deleteTag({
          _id: row._id
        }).then(res => {
          this.notifiySuccess(res.msg)
          this.getTagListRequest()
        })
      }, () => {})
    },
    // 表格修改按钮事件
    updateHandler(row) {
      this.formValidate = deepClone(row)
      this.addShow = true
    }
  }
}
</script>

<style>

</style>
