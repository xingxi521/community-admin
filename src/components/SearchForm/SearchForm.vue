<template>
  <Form
    ref="searchForm"
    class="w-search-form"
    :class="{ dialog: mode === 'dialog',
              'w-search-flex': Layout.inline=='flex'}"
    :label-position="Layout.labelPosition"
    :label-width="Layout.labelWidth"
    :model="value"
    :inline="true"
    @submit.native.prevent="handleQuery">
    <!-- 固定栅格布局-->
    <Row v-if="Layout.inline=='grid'" type="flex" :gutter="24">
      <template v-for="(item, index) in json">
        <Col :key="index" :xs="24" :sm="24" :md="item.md ? item.md : Layout.md" :lg="item.lg ? item.lg : Layout.lg" :xl="item.xl ? item.xl : Layout.xl" :offset="item.offset ? item.offset : Layout.offset" :class="{ hidden: index >= Layout.hiddenIndex && !Layout.isOpen, tipBottom : item.tips && item.tips.align === 'bottom'}">
          <SeachFormItem :key="index" :item="item" v-bind="item" :value="value[item.model]" @input="(val) => handleInput(item, val)" />
        </Col>
      </template>
      <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :offset="Layout.buttonOffset" class="text-right mb20 mr10">
        <Button @click="handleReset">重置</Button>
        <Button type="primary" style="margin-left: 10px;" @click="handleQuery">查询</Button>
        <Button v-if="Layout.showOpen" style="margin-left: 10px;" @click="handleOpen">
          {{ Layout.isOpen ? "收起" : "展开" }}
          <i :class="[Layout.isOpen ? 'ios-arrow-up' : 'ios-arrow-down']" />
        </Button>
      </Col>
    </Row>
    <!-- flex布局 -->
    <template v-else-if="Layout.inline=='flex'">
      <div class="w-form-item">
        <template v-for="(item, index) in json">
          <SeachFormItem :key="index" :item="item" v-bind="item" :value="value[item.model]" @input="(val) => handleInput(item, val)" />
        </template>
      </div>
      <div class="w-action">
        <Button @click="handleReset">重置</Button>
        <Button type="primary" @click="handleQuery">查询</Button>
      </div>
    </template>
    <!-- 行内布局 -->
    <template v-else-if="Layout.inline=='inline'">
      <template v-for="(item, index) in json">
        <SeachFormItem :key="index" :item="item" v-bind="item" :value="value[item.model]" @input="(val) => handleInput(item, val)" />
      </template>
      <FormItem>
        <Button @click="handleReset">重置</Button>
        <Button type="primary" @click="handleQuery">查询</Button>
      </FormItem>
    </template>
  </Form>
</template>
<script>
import SeachFormItem from '../SeachFormItem/index.vue'

/**
 * 根据屏幕宽度，做栅格列数适配
 * 弹框中表单和页面查询表单要区分开
 * 弹框一律最大显示2列，页面查询表单最大显示4列
 * @param {formLength} JSON表单总长度
 * @param {layout} 布局参数
 * @param {mode} 是否为弹框
 */
const getResult = (formLength, layout, mode) => {
  const w = document.documentElement.clientWidth
  let hiddenIndex = layout.hiddenIndex
  const offset = layout.offset
  let showOpen = layout.showOpen
  let md = layout.md // 1200px以下，一行2列
  let lg = layout.lg // 1200px以上，一行显示3列
  let xl = layout.xl // 1920px以上，一行显示4列
  if (mode === 'dialog') {
    if (layout.isOpen) {
      hiddenIndex = 0
      // offset = formLength % 2 === 0 ? 12 : 0
    } else {
      hiddenIndex = 1
      // offset = formLength > 1 ? 0 : 12
    }
    md = 12
    lg = 12
    xl = 12
  } else {
    if (w >= 1920) {
      hiddenIndex = 4
    } else if (w >= 1200) {
      // 一行显示三列
      hiddenIndex = 3
    } else if (w >= 992) {
      hiddenIndex = 2
    } else {
      hiddenIndex = 1
    }
    if (formLength <= hiddenIndex) {
      showOpen = false
    } else {
      showOpen = true
    }
  }

  return {
    hiddenIndex,
    offset,
    showOpen,
    md,
    lg,
    xl,
    w
  }
}

// 添加防抖，防止resize重复调用
function debounce(method, delay, immediate) {
  let timer = null
  if (immediate) {
    method && method()
  }
  return function () {
    const self = this
    const args = arguments
    timer && clearTimeout(timer)
    timer = setTimeout(function () {
      method.apply(self, args)
    }, delay)
  }
}

export default {
  name: 'SearchForm',
  components: { SeachFormItem },
  props: {
    layout: {
      type: Object,
      default: () => {}
    }, // 布局参数
    mode: String, // 当设置为dialog时，说明QueryForm在dialog中使用，会调整QueryForm背景色
    json: Array, // 表单JSON对象
    model: Object // 默认v-model参数
  },
  data() {
    return {
      value: { ...this.model }, // 初始化表单值
      Layout: {
        // el-form
        inline: 'grid', // 默认栅格布局
        labelPosition: 'right', // 默认label靠右
        labelWidth: null, // 默认label宽度
        // el-col
        md: 12, // 992-1200 , 默认加载两列
        lg: 8, // 1200 - 1920 , 默认加载3列
        xl: 6, // >=1920 , 默认加载四列
        showOpen: true, // 显示展开/收起按钮
        isOpen: false, // 当前是否为展开状态
        hiddenIndex: 0, // 需要隐藏的索引
        offset: 0, // 偏移的列数
        screenWidth: 0, // 当前屏幕可用宽度
        buttonOffset: 0 // 查询/重置偏移的列数
      } // 默认布局
    }
  },
  /**
   * 当父组件修改model时，需要同步修改子组件
   */
  watch: {
    model: function (val) {
      this.value = { ...val }
    },
    json: function (val) {
      this.handleLayout()
    }
  },
  created() {
    Object.assign(this.Layout, this.layout) // 自定义布局
  },
  mounted() {
    window.onresize = debounce(this.handleLayout, 500, true)
  },
  methods: {
    /**
     * 触发自定义事件
     * @callback(val,values,model)当前值/所有值/当前model
     */
    handleInput(item, val) {
      const { action } = item
      /**
       * type: 'reset' 重置对应表单
       * model: 'all' 重置所有表单
       * model: ['state'] 重置指定表单
       * 重置也可以通过change事件进行之重置
       */
      if (action && action.type === 'reset') {
        const modelList = action.model
        // 重置所有表单
        if (modelList === 'all') {
          this.handleReset()
          this.value[item.model] = val
        } else if (modelList) {
          // 重置部分表单
          modelList.map(key => {
            if (Array.isArray(this.value[key])) {
              this.value[key] = []
            } else {
              this.value[key] = undefined
            }
            return key
          })
        }
      }
      if (typeof item.change === 'function') {
        item.change(val, this.value, item.model)
      }
      // 把日期数字拆解为两个字段，方便前端使用
      if (['daterange', 'monthrange', 'datetimerange'].includes(item.type) && item.export) {
        if (!Array.isArray(item.export)) {
          throw Error('item.export must be a Array')
        }
        this.value = {
          ...this.value,
          [item.model]: val || '',
          [item.export[0] || 'startTime']: val ? val[0] : '',
          [item.export[1] || 'endTime']: val ? val[1] : ''
        }
      } else {
        this.value = { ...this.value, [item.model]: val }
      }
    },
    /**
     * 表单重置
     * 外部也可通过$refs进行内部API调用
     */
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.$emit('update:model', { ...this.value })
      this.$emit('handleReset', 1)
    },
    /**
     * 点击查询，回传数据，重置页码
     */
    handleQuery() {
      this.$emit('update:model', { ...this.value })
      this.$emit('handleQuery', 1)
    },
    /**
     * 点击展开/收起
     */
    handleOpen() {
      const Layout = this.Layout
      Layout.isOpen = !Layout.isOpen
      const res = getResult(this.json.length, Layout, this.mode)
      Layout.hiddenIndex = res.hiddenIndex
      Layout.offset = res.offset
      Layout.md = res.md
      Layout.xl = res.xl
    },
    /**
     * 监听resize事件，并通过防抖控制重复触发
     */
    handleLayout() {
      const Layout = this.Layout
      // 根据当前屏幕尺寸，计算需要展示的列数以及隐藏列数
      const { hiddenIndex, offset, showOpen, md, lg, xl, w } = getResult(this.json.length, Layout, this.mode)
      Layout.hiddenIndex = hiddenIndex
      Layout.offset = offset
      Layout.showOpen = showOpen
      Layout.md = md
      Layout.lg = lg
      Layout.xl = xl
      Layout.screenWidth = w
    }
  },
  /**
   * 销毁全局事件
   */
  unmounted() {
    window.onresize = null
  }
}
</script>
<style lang="scss" scoped>
// 默认为白色背景，当在弹框中时为灰色背景
.w-search-form {
  &.w-search-flex {
    display: flex;
    justify-content: space-between;
    .w-form-item {
      flex: 1;
    }
    .w-action {
      width: 200px;
      text-align: right;
    }
  }
  .text-right {
    text-align: right;
  }
  .mb20{
    margin-bottom: 20px;
  }
  .mr10{
    margin-right: 10px;
  }
  &.dialog {
    background-color: #f7f8fa;
    border: none;
  }
  .hidden {
    display: none;
  }

  .ivu-row-flex {
    flex-wrap: wrap;
    .ivu-form-item {
      display: flex;
      ::v-deep .ivu-form-item-label {
        min-width: 60px;
      }
      ::v-deep .ivu-form-item-content {
        flex: 1;
        display: flex;
        align-items: center;
        .el-date-editor {
          width: 100%;
        }
      }
    }
  }
  .tipBottom ::v-deep .ivu-form-item-content {
    flex-direction: column;
  }
}
</style>
