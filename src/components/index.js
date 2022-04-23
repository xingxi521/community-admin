import Tables from '@/components/tables'
import Pagination from '@/components/Pagination'
import SearchForm from '@/components/SearchForm/SearchForm'
const components = [
  Tables,
  Pagination,
  SearchForm
]

function install(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

export default { install }
