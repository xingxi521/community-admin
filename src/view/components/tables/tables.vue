<template>
  <div>
    <Card>
      <tables ref="tables" v-model="tableData" editable searchable search-place="top" :columns="columns" @on-delete="handleDelete" />
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getTableData } from '@/api/data'
export default {
  name: 'TablesPage',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        { title: 'Name', key: 'name', sortable: true },
        { title: 'Email', key: 'email', editable: true },
        { title: 'Create-Time', key: 'createTime' }
      ],
      tableData: []
    }
  },
  mounted () {
    getTableData().then(res => {
      this.tableData = res
    })
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    }
  }
}
</script>

<style>

</style>
