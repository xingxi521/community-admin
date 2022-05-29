<template>
  <div>
    <Row :gutter="20">
      <i-col v-for="(infor, i) in inforCardData" :key="`infor-${i}`" :xs="12" :md="8" :lg="4" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie :key="pieKey" style="height: 300px;" name="统计数据" :value="pieData" text="用户访问来源" />
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar :key="barKey" style="height: 300px;" :value="barData" text="近6月的累计发帖" />
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example :key="exampleKey" style="height: 310px;" :series="series" />
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
import { getStatistics } from '@/api/home'
import dayjs from 'dayjs'
export default {
  name: 'Home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '新增用户', icon: 'md-person-add', count: 0, color: '#2d8cf0' },
        { title: '累计发帖', icon: 'md-locate', count: 0, color: '#19be6b' },
        { title: '新增评论', icon: 'md-chatbubbles', count: 0, color: '#ff9900' },
        { title: '本周点赞', icon: 'md-checkmark-circle', count: 0, color: '#ed3f14' },
        { title: '本周签到', icon: 'md-contacts', count: 0, color: '#E46CBB' },
        { title: '本周发帖', icon: 'md-map', count: 0, color: '#9A66E4' }
      ],
      pieData: [
        { value: 0, name: '提问' },
        { value: 0, name: '分享' },
        { value: 0, name: '讨论' },
        { value: 0, name: '建议' }
      ],
      barData: {},
      // 近7天统计数据
      series: {},
      // 饼图key,为了后面刷新数据
      pieKey: new Date().getTime(),
      barKey: new Date().getTime(),
      exampleKey: new Date().getTime()
    }
  },
  mounted () {
    this.getStatisticsRequest()
  },
  methods: {
    // 获取首页统计数据
    getStatisticsRequest() {
      getStatistics().then(res => {
        const { cardData, pieData, nearSixPostData, weekData } = res.data
        // 设置卡片数据
        cardData.forEach((item, idx) => {
          this.$set(this.inforCardData[idx], 'count', item)
        })
        // 设置饼图数据
        pieData.forEach(pie => {
          if (pie._id === 'share') {
            this.$set(this.pieData[1], 'value', pie.count)
          } else if (pie._id === 'ask') {
            this.$set(this.pieData[0], 'value', pie.count)
          } else if (pie._id === 'disscussion') {
            this.$set(this.pieData[2], 'value', pie.count)
          } else if (pie._id === 'suggest') {
            this.$set(this.pieData[3], 'value', pie.count)
          }
        })
        this.pieKey = new Date().getTime()
        // 设置近6月发帖数据柱状图数据
        for (let i = 0; i < 6; i++) {
          const month = dayjs().subtract(i, 'M').format('YYYY-MM')
          this.$set(this.barData, month, 0)
        }
        nearSixPostData.forEach(near => {
          if (near._id in this.barData) {
            this.$set(this.barData, near._id, near.count)
          }
        })
        this.barKey = new Date().getTime()
        // 近7天统计数据处理
        this.series = weekData
        this.exampleKey = new Date().getTime()
      })
    }
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
