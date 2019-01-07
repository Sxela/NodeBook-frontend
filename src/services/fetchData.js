import api from '@/services/api'
export default {
 
  fetchData (address, prefix, block) {

    if (address)
    {
      if (prefix)
      {
        if (block)
        {
          return api().get(`addresses/${prefix}/${address}/${block}`) 
        }
        else
        {
          return api().get(`addresses/${prefix}/${address}`)
        }
      }
      else
      {
        return api().get(`addresses/${address}`)
      }
    }
  }
}
