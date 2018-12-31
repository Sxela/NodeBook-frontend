import api from '@/services/api'
export default {
  fetchData (params) {
    return api().get(`addresses/${params}`)
  },
  fetchData (prefix, params) {
    return api().get(`addresses/${prefix}/${params}`)
  },
  fetchData (prefix, address, block) {
    if (!block) block = -1
    console.log(`addresses/${prefix}/${address}/${block}`)
    return api().get(`addresses/${prefix}/${address}/${block}`)
  }
}
