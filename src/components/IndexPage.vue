<template lang="pug">
<div>
    
    <div class="container" id="button1">
    <div class="input-group mb-3">
        <div class="input-group-prepend">
           <span class="input-group-text" id="basic-addon1">#</span>
        </div>
        <input type="text" class="form-control" v-model="input_val" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
        <button class="btn btn-primary" v-on:click="getData()">Get connections</button>
    </div>
    
    </div>
  
    <div class="container" id="table1">
    table.table.table-striped
        thead.thead-dark
            tr
              th Address
              th Number of txes
              th Sum
        tbody
            tr( v-for="tx in txes.tx_out")
            
              td {{ tx._id }}
              td {{ tx.Txes }}
              td {{ tx.value/1000000000000000000 }}
              td
        thead.thead-dark     
            tr
              th Address
              th Number of txes
              th Sum
        tbody
            tr( v-for="tx in txes.tx_in")
              td {{ tx._id }}
              td {{ tx.Txes }}
              td {{ tx.value/1000000000000000000 }}
              td
        
    </div>
</div>
</template>
<script>
import dataService from '@/services/fetchData'
import {tree} from 'vued3tree'
import * as d3 from 'd3'

export default {
    name: 'index',
    components: {
    tree
    },
    data ()
    {
        return {
            txes:{},
            input_val : '0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8'
        }
    }, 
    methods: {        
    async getData () {
        const response = await dataService.fetchData(this.input_val)
        this.txes = response.data
        },
        
    },
    mounted () {
        this.getData()
    }
    
}
</script>
<style>
#table1 {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #000000;
  margin-top: 120px;
  margin-left: 200px;
  width: 1024px;
  font-size: 8;
  align-self: center;
}
#button1 {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  font-size: 6;
  color: #000000;
  margin-top: 120px;
  margin-left: 200px;
  width: 1024px;
  align-self: center;
}
</style>