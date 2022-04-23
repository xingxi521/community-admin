<template>
  <div>
    <Card>
      <tables ref="tables" v-model="tableData" :loading="dataLoading" editable searchable search-place="top" :columns="columns">
        <template #action="slotProps">
          <Icon type="md-build" size="20" style="margin-right: 5px;" @click="updateHandler(slotProps.row)" />
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
 * 文章管理
 */
import Tables from '_c/tables'
import dayjs from 'dayjs'
import Pagination from '@/components/Pagination'
import { getArticleList, deletePost } from '@/api/data'
import { ARTICLE_TYPE } from '@/libs/const/content'
export default {
  name: 'PostManagement',
  components: {
    Tables,
    Pagination
  },
  data () {
    return {
      columns: [
        {
          title: '标题',
          key: 'title',
          minWidth: 400,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '作者',
          key: 'nickName',
          width: 90,
          render: (h, { row }) => {
            return h('div', [
              h('span', row.userInfo.nickName)
            ])
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
          title: '分类',
          key: 'type',
          width: 90,
          render: (h, { row }) => {
            return h('span', ARTICLE_TYPE.getMapping()[row.type])
          }
        },
        {
          title: '积分',
          key: 'fav',
          width: 90
        },
        {
          title: '标签',
          key: 'tag',
          width: 150,
          render: (h, { row }) => {
            const result = row.tags.map(item => item.title)
            return h('span', result.join('，'))
          }
        },
        {
          title: '阅读次数',
          key: 'read',
          width: 90
        },
        {
          title: '回答次数',
          key: 'answer',
          width: 90
        },
        {
          title: '是否结贴',
          key: 'isEnd',
          render: (h, { row }) => {
            return h('span', row.isEnd ? '是' : '否')
          },
          width: 90
        },
        {
          title: '状态',
          key: 'status',
          width: 90,
          render: (h, { row }) => {
            return h('Tag', {
              props: {
                color: row.status ? 'warning' : 'success'
              },
              domProps: {
                innerHTML: row.status ? '关闭' : '开启'
              }
            })
          }
        },
        {
          title: '是否置顶',
          key: 'isTop',
          width: 90,
          render: (h, { row }) => {
            return h('Icon', {
              props: {
                type: row.isTop ? 'md-checkmark' : ''
              },
              style: {
                color: '#19BE6B',
                fontSize: '16px'
              }
            })
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
  activated() {
    this.getArticleListRequest()
  },
  mounted () {
    this.getArticleListRequest()
  },
  methods: {
    getArticleListRequest() {
      this.dataLoading = true
      getArticleList({
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
    // 修改按钮事件
    updateHandler(row) {
      this.$router.push({
        name: 'PostDetails',
        params: {
          tid: row._id
        },
        query: {
          title: row.title
        }
      })
    },
    // 删除按钮事件
    deleteHandler(row) {
      this.confirmBox(`确定要删除文章【${row.title}】吗？`, () => {
        deletePost({
          tid: row._id
        }).then(res => {
          this.notifiySuccess(res.msg)
          this.getArticleListRequest()
        })
      }, () => {})
    },
    onPageHandler() {

    }
  }
}
</script>

<style>

</style>
