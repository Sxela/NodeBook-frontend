import axios from 'axios'
export default () => {

  var prod = true; //use false for staging
  var URL;
  URL = prod ? 'https://api1.nodel.ink' : 'http://localhost:8081'
  
  return axios.create({
    baseURL : URL
  })
}
