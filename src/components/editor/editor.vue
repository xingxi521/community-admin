<template>
  <div class="editor-wrapper">
    <div :id="editorId" />
  </div>
</template>

<script>
import Editor from 'wangeditor'
import { oneOf } from '@/libs/tools'
import { getToken } from '@/libs/util'
import config from '@/config'
export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: 'html',
      validator: (val) => {
        return oneOf(val, ['html', 'text'])
      }
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200
    },
    /**
     * @description 是否开启本地存储
     */
    cache: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    }
  },
  mounted () {
    this.editor = new Editor(`#${this.editorId}`)
    this.editor.config.onchange = (html) => {
      const text = this.editor.txt.text()
      if (this.cache) localStorage.editorCache = html
      this.$emit('input', this.valueType === 'html' ? html : text)
      this.$emit('on-change', html, text)
    }
    this.editor.config.uploadImgHeaders = {
      Authorization: 'bearer ' + getToken() || ''
    }
    this.editor.config.uploadFileName = 'file'
    this.editor.config.uploadImgServer = process.env.NODE_ENV === 'development' ? `${config.baseUrl.dev}content/uploadFile` : `${config.baseUrl.pro}content/uploadFile`
    this.editor.config.uploadImgHooks = {
      customInsert: function(insertImgFn, result) {
        // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
        insertImgFn(process.env.NODE_ENV === 'development' ? `${config.baseUrl.dev}${result.data.pic}` : `${config.baseUrl.pro}${result.data.pic}`)
      }
    }
    this.editor.config.onchangeTimeout = this.changeInterval
    // create这个方法一定要在所有配置项之后调用
    this.editor.create()
    // 如果本地有存储加载本地存储内容
    const html = this.value || localStorage.editorCache
    if (html) this.editor.txt.html(html)
  },
  methods: {
    setHtml (val) {
      this.editor.txt.html(val)
    }
  }
}
</script>
