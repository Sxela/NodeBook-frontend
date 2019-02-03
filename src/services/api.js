import axios from 'axios'
export default () => {

  var prod = true; //use false for staging
  var URL;
  URL = prod ? 'https://api.nodel.ink:8081' : 'http://localhost:8081'
  
  return axios.create({
    baseURL : URL
  })
}
