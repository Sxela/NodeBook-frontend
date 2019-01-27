<template lang="pug">
<div>
    <svg>
    </svg>
    <div class="container" id="button1">
        <div class="input-group mb-3">
            <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">#</span>
            </div>
            <input type="text" class="form-control" v-model="input_val" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
            <button class="btn btn-primary" v-on:click="update()">Get connections</button>
        </div>
    <div>
  
    <span v-if="(txes.total_out && total_out[0])">Address {{txes.total_out[0]._id}} has {{txes.total_out[0].links}} outgoing links with a total value of {{Math.round(txes.total_out[0].value/1000000000000000000*100)/100}} ETH</span>
    <span v-if="(total_in && total_in[0])">and {{txes.total_in[0].links}} incoming links with a total value of {{Math.round(txes.total_in[0].value/1000000000000000000*100)/100}} ETH</span>
    </div>
    </div>
    <div class="container" id="table1">
    table.table.table-striped
        thead.thead-dark
            tr
              th Address
              th Number of txes out
              th Sum
        tbody
            tr( v-for="tx in txes.tx_out")
            
              td {{ tx._id }}
              td {{ tx.Txes }}
              td {{ Math.round(tx.value/1000000000000000000*100)/100 }}
              td
        thead.thead-dark     
            tr
              th Address
              th Number of txes in
              th Sum
        tbody
            tr( v-for="tx in txes.tx_in")
              td {{ tx._id }}
              td {{ tx.Txes }}
              td {{ Math.round(tx.value/1000000000000000000*100)/100 }}
              td
        
    </div>
    
</div>
</template>
<script>
import * as d3 from 'd3';
import { makeTree } from '@/functions/makeTree';

export default {
  
    name: 'index',
    components: {
    
    },
    data ()
    {
        return {
            txes:{},
            //input_val : '0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8',
            input_val : '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
            tree: {
                name: '',
                children: []
            },
            total_out: {},
            total_in: {}
            
        }
    },
    methods: { 
      
      update() {
        d3.selectAll('svg').selectAll("g").remove()
        makeTree(this, this.input_val)
      }, 

      update(body, address) {
        if (!body) body = this
        if (address) body.input_val = address;
        d3.selectAll('svg').selectAll("g").remove()
        makeTree(body, body.input_val)
      } 

    },
    mounted () {
        makeTree(this, this.input_val)
    }
    
}
</script>
<style>
.treeclass{
    font-family: 'Courier', Helvetica, Arial, sans-serif;
max-height: 100%;
height: 600px;
width: 1000px;
align-self: center;
}
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

.node circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 3px;
}

.node text {
  font: 12px sans-serif;
}


.zoom{
  cursor: grab;
  fill: none;
  pointer-events: all;
  
}

.graph {
  margin-top: 120px;
  margin-left: 200px;
}

.node_rect_bg
{
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  rx: 4;
  ry: 4;
  
}

.popup {
  width: 300;
  height: 100;
  
  fill: #F2F9FE;

  rx: 4;
  ry: 4;
  stroke-opacity: 0;
  
   }

.shadow {
fill: rgb(83, 99, 110);
opacity : 0.2;
}


.node_rect_link
{
  fill: #FFD66E;
  rx: 4;
  ry: 4;
  stroke-opacity: 0;
  
}

.gLink
{
  stroke-opacity: 0.5;
  stroke: #B1CBDE;
}

.gNode
{
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 12px;
  

color: #000000;
}

.tx_in_ratio
{
  font-size: 8px;
}


.gdupLink{
  fill: none;
  stroke: orange;
  opacity: 0.5;
  
}
</style>
