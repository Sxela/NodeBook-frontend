import axios from 'axios'
export default () => {
  return axios.create({
  //  baseURL: 'http://localhost:8081'
  baseURL: 'https://api.nodel.ink:8081'
  //baseURL: 'http://95.220.165.203:8081'
  //baseURL: 'http://sxela.asuscomm.com:8081'
  })
}
