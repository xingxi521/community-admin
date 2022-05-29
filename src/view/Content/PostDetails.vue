<template>
  <div>
    <Card>
      <Row>
        <Col span="24">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="标题" prop="title">
              <Input v-model="formValidate.title" placeholder="请输入文章标题" />
            </FormItem>
            <FormItem label="分类" prop="type">
              <Select v-model="formValidate.type" placeholder="请选择分类">
                <Option v-for="item in typeOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="标签" prop="tags">
              <Select v-model="formValidate.tags" multiple placeholder="请选择标签">
                <Option v-for="item in tagsOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="是否结贴" prop="isEnd">
              <RadioGroup v-model="formValidate.isEnd">
                <Radio label="0">未结</Radio>
                <Radio label="1">已结</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="是否置顶" prop="isTop">
              <RadioGroup v-model="formValidate.isTop">
                <Radio label="0">未置顶</Radio>
                <Radio label="1">已置顶</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="奖赏积分" prop="fav">
              <Slider v-model="formValidate.fav" show-input />
            </FormItem>
            <FormItem label="文章内容" prop="content">
              <Editor v-model="formValidate.content" />
            </FormItem>
            <FormItem>
              <Button type="primary" :loading="loading" @click="saveHandler">保存</Button>
              <Button style="margin-left: 8px" @click="cancelHandller">取消</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
/**
 * 文章编辑
 */
import { ARTICLE_TYPE } from '@/libs/const/content'
import { mapMutations } from 'vuex'
import { getPostDetails, updatePost } from '@/api/data'
export default {
  name: 'PostDetails',
  components: {
    Editor: () => import('_c/editor')
  },
  data() {
    return {
      // 分类数据源
      typeOptions: ARTICLE_TYPE.getLabelData(null, null, false),
      // 标签数据源
      tagsOptions: [],
      formValidate: {
        title: '',
        type: '',
        tags: [],
        isEnd: 0,
        isTop: 0,
        fav: 20,
        content: ''
      },
      ruleValidate: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { type: 'string', max: 30, message: '文章标题最长30个字符' }
        ],
        type: [
          { required: true, message: '请选择文章类型', trigger: 'blur' }
        ],
        isEnd: [
          { required: true, message: '请选择是否结贴', trigger: 'change' }
        ],
        isTop: [
          { required: true, message: '请选择是否置顶', trigger: 'change' }
        ],
        fav: [
          { required: true, type: 'number', message: '请输入奖赏积分', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      },
      // 保存按钮加载状态
      loading: false
    }
  },
  mounted() {
    this.getPostDetailsRequest()
  },
  methods: {
    ...mapMutations('app', ['closeTag']),
    // 获取文章详情
    getPostDetailsRequest() {
      getPostDetails({
        tid: this.$route.params.tid
      }).then(res => {
        this.formValidate = res.data
        this.formValidate.isEnd = this.formValidate.isEnd + ''
        this.formValidate.isTop = this.formValidate.isTop + ''
      })
    },
    // 取消按钮事件
    cancelHandller() {
      this.closeTag({
        name: 'PostDetails',
        params: {
          tid: this.$route.params.tid
        },
        query: {
          title: this.$route.query.title
        }
      })
    },
    // 确定按钮事件
    saveHandler() {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.loading = true
          updatePost({
            ...this.formValidate,
            isTop: Number(this.formValidate.isTop),
            isEnd: Number(this.formValidate.isEnd)
          }).then(res => {
            this.notifiySuccess(res.msg)
            this.loading = false
            this.closeTag({
              name: 'PostDetails',
              params: {
                tid: this.$route.params.tid
              },
              query: {
                title: this.$route.query.title
              }
            })
          }).catch(error => {
            console.log('🚀 ~ file: PostDetails.vue ~ line 146 ~ updatePost ~ error', error)
            this.loading = false
          })
        } else {
          this.notifiyWarning('请填写完整数据再进行提交！')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
