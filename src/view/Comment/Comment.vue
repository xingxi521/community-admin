<template>
  <div>
    <Card>
      <tables ref="tables" v-model="tableData" :loading="dataLoading" :columns="columns">
        <template #action="slotProps">
          <Icon type="md-trash" size="20" @click="deleteHandler(slotProps.row)" />
        </template>
      </tables>
      <Pagination
        :total="total"
        :page.sync="pageNum"
        :size.sync="pageSize"
        @pagination="onPageHandler"
      />
    </Card>
  </div>
</template>

<script>
/**
 * 评论管理页面
 */
import Tables from '_c/tables'
import dayjs from 'dayjs'
import Pagination from '@/components/Pagination'
import CommentItem from './CommentItem.vue'
import { getCommentList, deleteComment } from '@/api/comment'
export default {
  name: 'Comment',
  components: {
    Tables,
    Pagination
  },
  data() {
    return {
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(CommentItem, {
              props: {
                item: params.row
              }
            })
          }
        },
        {
          title: '文章标题',
          key: 'tid',
          ellipsis: true,
          tooltip: true,
          render: (h, { row }) => {
            return h('div', row.tid.title)
          }
        },
        {
          title: '评论人',
          key: 'uid',
          render: (h, { row }) => {
            return h('span', row.uid.nickName)
          }
        },
        {
          title: '一级回复内容',
          key: 'content',
          render: (h, { row }) => {
            return h('span', row.content)
          }
        },
        {
          title: '是否采纳',
          key: 'isBest',
          render: (h, { row }) => {
            return h('span', row.isBest ? '是' : '否')
          }
        },
        {
          title: '点赞数',
          key: 'niceCount'
        },
        {
          title: '创建时间',
          key: 'createTime',
          sortable: true,
          render: (h, { row }) => {
            return h('span', dayjs(row.createTime).format('YYYY-MM-DD hh:mm:ss'))
          }
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
      dataLoading: false
    }
  },
  mounted() {
    this.getCommentListRequest()
  },
  methods: {
    // 获取评论列表数据
    getCommentListRequest() {
      getCommentList({
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        this.tableData = res.data.records
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.total = res.data.total
      })
    },
    updateHandler() {},
    // 删除评论
    deleteHandler(row) {
      this.confirmBox(`确定要删除该一级评论吗？`, () => {
        deleteComment({
          _id: row._id
        }).then(res => {
          this.notifiySuccess(res.msg)
          this.getCommentListRequest()
        })
      }, () => {})
    },
    onPageHandler() {}
  }
}
</script>

<style lang="scss" scoped>

</style>
