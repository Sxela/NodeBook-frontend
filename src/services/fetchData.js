import api from '@/services/api'
export default {
  fetchData (params) {
    return api().get(`addresses/${params}`)
  }
}
