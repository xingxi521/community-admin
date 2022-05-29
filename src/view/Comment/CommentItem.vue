<template>
  <div class="comment-item-main">
    <div class="detail-userinfo">
      <img :src="env === 'development' ? config.baseUrl.dev + item.uid.pic : config.baseUrl.pro + item.uid.pic" alt="">
      <div class="userinfo-right">
        <div class="userinfo-right-top">
          <span class="top-nickname">{{ item.uid.nickName }}</span>
        </div>
        <div class="userinfo-right-bottom">
          <span class="top-time">{{ formatCreateTime(item.createTime) }}</span>
        </div>
      </div>
      <i v-if="item.isBest" class="iconfont icon-caina" />
    </div>
    <div class="comment-content" v-html="item.content" />
    <div class="comment-bottom">
      <div class="comment-bottom-left" />
      <div class="comment-bottom-right">
        <span v-if="item.isEnd !== 1" class="edit" @click="editHandler(item)">编辑</span>
      </div>
    </div>
    <!-- 回复盖楼 -->
    <div v-if="item.childrens.length > 0" class="relpy-box">
      <div v-for="(child,childIdx) in item.childrens" :key="child._id" class="reply-content">
        <img class="reply-pic" :src="env === 'development' ? config.baseUrl.dev + child.uid.pic : config.baseUrl.pro + child.uid.pic" alt="" style="cursor: pointer;">
        <div class="reply-content-right">
          <div class="content-right-top">
            <span>
              {{ child.uid.nickName }}
              <span v-if="child.replyToData" style="padding: 0 8px;color:#8a919f;">回复</span>
              <span v-if="child.replyToData">{{ child.replyToData.uid.nickName }}</span>
            </span>
            <span>{{ formatCreateTime(child.createTime) }}</span>
          </div>
          <div class="content-right-body" v-html="child.content" />
          <div v-if="child.replyToData" class="quote">
            <div>“</div>
            <div class="quote-wrapper">{{ child.replyToData.content }}</div>
            <div>”</div>
          </div>
          <div class="content-bottom-left">
            <span v-if="child.isEnd !== 1" class="edit" @click="editHandler(child, childIdx)">编辑</span>
            <span v-if="child.isEnd !== 1" class="del" style="margin-left:10px;" @click="delCommentHandler(child, childIdx)">删除</span>
            <!-- <i class="iconfont icon-zan" :class="{ 'zan-active': child.isNice }" /><span class="zan-conut">{{ child.niceCount }}</span> -->
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="isShow" :title="submitData.type === 'edit' ? '编辑评论': '回复评论'">
      <Input v-model="submitData.content" type="textarea" placeholder="请输入内容" :rows="4" />
      <template #footer>
        <Button type="text" @click="cancelHandler">取消</Button>
        <Button type="primary" ghost @click="handleOk">确定</Button>
      </template>
    </Modal>
  </div>

</template>

<script>
/**
 * 评论项组件
 */
import { formatCreateTime } from '@/libs/public'
import { updateComment, deleteComment } from '@/api/comment'
import config from '@/config'
export default {
  name: 'CommentItem',
  props: {
    // 数据
    item: {
      type: Object,
      default: () => {}
    },
    // 文章数据
    postData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      env: process.env.NODE_ENV,
      config,
      // 弹出显示开关
      isShow: false,
      // 提交数据
      submitData: {
        content: '',
        type: 'reply'
      }
    }
  },
  methods: {
    // 格式化时间
    formatCreateTime(time) {
      return formatCreateTime(time)
    },
    // 编辑按钮事件
    editHandler(item, idx) {
      this.isShow = true
      this.submitData = {
        type: 'edit',
        content: item.content,
        _id: item._id,
        idx
      }
    },
    // 弹窗提交事件
    handleOk() {
      if (this.submitData.type === 'edit') {
        if (!this.submitData.content) {
          this.notifiyWarning('请输入内容再提交！')
          return
        }
        updateComment(this.submitData).then(res => {
          if (this.submitData.idx != null || this.submitData.idx !== undefined) {
            this.item.childrens[this.submitData.idx].content = this.submitData.content
          } else {
            this.item.content = this.submitData.content
          }
          this.notifiySuccess(res.msg)
          this.submitData = {
            content: '',
            type: 'reply'
          }
          this.isShow = false
        })
      }
    },
    // 弹窗取消按钮事件
    cancelHandler() {
      this.isShow = false
      this.submitData = {
        content: '',
        type: 'reply'
      }
    },
    // 删除评论按钮事件
    delCommentHandler(item, idx) {
      this.confirmBox('确定要删除该评论吗？', () => {
        deleteComment({
          _id: item._id
        }).then(res => {
          this.notifiySuccess(res.msg)
          this.item.childrens.splice(idx, 1)
        })
      }, () => {})
    }
  }
}
</script>

<style lang="less" scoped>
.comment-item-main{
  padding-bottom: 12px;
  background: #fff;
  .detail-userinfo{
    color: #999;
    padding: 12px 15px;
    margin-top: 8px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img{
      width: 45px;
      height: 45px;
    }
    .userinfo-right{
      flex: 1;
      padding-left: 10px;
      .userinfo-right-top{
        .top-nickname{
          color: #01AAED;
          cursor: pointer;
          &:hover{
            color: #009688;
          }
        }
      }
      .userinfo-right-bottom{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn-group{
          .bottom-editpost{
            font-size: 12px;
            margin-left: 5px;
          }
        }
      }
    }
    i{
      font-size: 60px;
      color: #58A571;
    }
  }
  .comment-content{
    padding: 8px 15px;
  }
  .comment-bottom{
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .comment-bottom-left{
      i{
        font-size: 20px;
        color: #999;
        padding: 0 4px 0 15px;
        vertical-align: middle;
        cursor: pointer;
        &:first-child{
          padding: 0 4px 0 0;
        }
      }
      .icon-zan{
        &:hover{
          color: #c00;
        }
      }
      .zan-active{
        color: #c00;
      }
      .zan-conut{
        position: relative;
        top: 3px;
      }
    }
    .comment-bottom-right{
      span{
        color: #999;
        padding-right: 15px;
        cursor: pointer;
      }
    }
  }
  .relpy-box{
    background: #F9FBFA;
    margin: 12px 15px;
    .reply-content{
      padding: 15px;
      display: flex;
      .reply-pic{
        width: 34px;
        height: 34px;
        border-radius: 50%;
      }
      .reply-content-right{
        flex: 1;
        padding: 0 10px;
        .content-right-top{
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .content-right-body{
          margin: 10px 0;
        }
        .quote{
          display: flex;
          background: #f2f3f5;
          border: 1px solid #e4e6eb;
          box-sizing: border-box;
          border-radius: 4px;
          padding: 0 12px;
          line-height: 36px;
          height: 36px;
          font-size: 14px;
          color: #8a919f;
          margin: 8px 0;
          .quote-wrapper{
            flex-shrink: 1;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
        }
        .content-bottom-left{
          i{
            font-size: 16px;
            color: #999;
            padding: 0 4px 0 15px;
            vertical-align: middle;
            cursor: pointer;
            &:first-child{
              padding: 0 4px 0 0;
            }
          }
          .icon-zan{
            &:hover{
              color: #c00;
            }
          }
          .zan-active{
            color: #c00;
          }
          .zan-conut{
            position: relative;
            top: 3px;
          }
        }
      }
    }
  }
}

</style>
