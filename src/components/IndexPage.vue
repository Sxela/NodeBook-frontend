<template>
<div class="IndexPage">
  <head>
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,400i,600,700,700i,900" rel="stylesheet">
  </head>
  <div class="main-page">
    <div class="alpha">v1.0.0-alpha*</div>
    <div class="header">NodeLink</div>
    <div class="lead">Visual Blockchain Explorer</div>
    <InputForm class="form" v-model="input_val"></InputForm>   
    <div class="description">
      <div>
        <div class="sub-header">Explore Connections</div>
        <div class="text">Check if a guy is from a bad neighborhood and is messing with phishing or gambling.</div>
      </div>
      <div>
        <div class="sub-header">Inspect the Cashflow</div>
        <div class="text">Take a look at income sources and expenditures of any address.</div>
      </div>
    </div>
  </div>
</div>

</template>
<script>
import InputForm from '@/components/InputForm'

export default {
  
    name: 'index',
    data ()
    {
        return {
          input_val : '0xD9a67CA12D7A22A8330e55FC704C5FcEB9a24E30'
        }
    },
    components:{
      InputForm
    }
}
</script>
<style>

.form {
  margin-top: 135px;
}

.IndexPage {
  position: absolute;
  background: #F1F1F1;
  padding: 120px;
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000000;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
}

.main-page {
  max-width: 1000px;
  height: 800px;
  margin-left: auto;
  margin-right: auto;
  background-color: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); 
  padding: 125px;
}

.alpha{
  font-weight: normal;
  font-size: 11px;
  color: #858585;
}

.header{
  font-size: 64px;
  margin-top: -7px;
  font-weight: 100;
  margin-left: -7px;
}

.lead{
  font-size: 36px;
  margin-top: 10px;
}

.description{
  display: flex;
  justify-content:left;
}

.sub-header {
  font-size: 24px;
  font-weight: normal;
  margin-top: 98px;
  width: 425px;
}

.text {
  font-size: 18px;
  margin-top: 20px;
  max-width: 300px;
}

</style>
