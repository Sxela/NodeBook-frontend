<template>
    <div class="InputForm">
        <div class="input-group">
            <input type="text" class="address-form" v-bind:value="value" v-on:input="$emit('input', $event.target.value)" :placeholder="value">
            <router-link :to="value" ><button class="address-button"  v-on:click="$emit('explore-go')">Explore</button></router-link>
        </div> 
        <div class="button-subscript">*alpha is limited to blocks 3`000`000 to 5`000`000, ETH direct transfers only</div>
    </div>
</template>
<script>
export default {
  props: {
    value:{
        type: String,
        default: '0xD9a67CA12D7A22A8330e55FC704C5FcEB9a24E30'
    }
  }
}
</script>
<style>
.InputForm{
  max-width: 750px;
  margin-left: auto;
  margin-right: auto;
}

.address-form{
  background: #F9F9F9;
  border: 1px solid #DFDFDF;
  box-sizing: border-box;
  border-radius: 4px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  padding-left: 10px;
  width:615px;
  height: 40px;
}

.address-button{
  width: 135px;
  height: 40px;
  background: #FFD66E;
  border-radius: 4px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  align-self:flex-end;
  font-size: 14px;
  font-weight:600;
  border: none;
}

.address-button:hover{
  background: #f9c43e;
  transition: .2s ease-in-out;
  cursor: pointer;
}

.button-subscript{
  font-weight: normal;
  font-size: 11px;
  color: #858585;
  text-align: right;
  margin-top: 10px;
}
</style>