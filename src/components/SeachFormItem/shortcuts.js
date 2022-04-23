/**
 * 时间选择框 快捷选项
 */
export const pickerOptions = {
  date: {
    shortcuts: [
      {
        text: '今天',
        onClick (picker) {
          picker.$emit('pick', new Date())
        }
      },
      {
        text: '昨天',
        onClick (picker) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24)
          picker.$emit('pick', date)
        }
      },
      {
        text: '一周前',
        onClick (picker) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', date)
        }
      }
    ]
  },
  daterange: {
    shortcuts: [
      {
        text: '最近一周',
        onClick (picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近一个月',
        onClick (picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近三个月',
        onClick (picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }
    ]
  },
  monthRange: {
    shortcuts: [{
      text: '本月',
      onClick (picker) {
        picker.$emit('pick', [new Date(), new Date()])
      }
    }, {
      text: '今年至今',
      onClick (picker) {
        const end = new Date()
        const start = new Date(new Date().getFullYear(), 0)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近六个月',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setMonth(start.getMonth() - 6)
        picker.$emit('pick', [start, end])
      }
    }]
  }
}
