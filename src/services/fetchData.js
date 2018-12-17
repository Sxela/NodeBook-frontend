import api from '@/services/api'
export default {
  fetchData (params) {
    return api().get(`addresses/${params}`)
  },
  fetchData (prefix, params) {
    return api().get(`addresses/${prefix}/${params}`)
  }
}
