import axios from 'axios'
export default () => {
  return axios.create({
  //  baseURL: 'http://localhost:8081'
  baseURL: 'https://api1.nodel.ink/'

  })
}
