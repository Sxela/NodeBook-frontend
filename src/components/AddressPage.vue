<template lang="pug">
<div>
    <Modal v-if="show_modal" @close="show_modal = false"/>
    <div v-if=loading class="spinner">
      <self-building-square-spinner :animation-duration="6000" :size="80" color="#FFD66E"/>
    </div>
    <InputForm class="form_address" v-model="input_val" v-on:explore-go="update()"></InputForm> 
    <svg class="svg">     
    <filter id="dropshadow" height="130%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/> <!-- stdDeviation is how much to blur -->
      <feOffset dx="2" dy="2" result="offsetblur"/> <!-- how much to offset -->
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.2"/> <!-- slope is the opacity of the shadow -->
      </feComponentTransfer>
      <feMerge> 
        <feMergeNode/> <!-- this contains the offset blurred image -->
        <feMergeNode in="SourceGraphic"/> <!-- this contains the element that the filter is applied to -->
      </feMerge>
    </filter>
    </svg>
    
    
</div>

</template>
<script>
import Modal from '@/components/Modal';
import * as d3 from 'd3';
import { makeTree } from '@/functions/makeTree';
import InputForm from '@/components/InputForm';
import { SelfBuildingSquareSpinner  } from 'epic-spinners'

export default {
  
    name: 'address',
    components:{
      InputForm,
      SelfBuildingSquareSpinner,
      Modal
    },
    data ()
    {
        return {
            input_val : this.id,
            loading: true,
            show_modal: true
        }
    },
    props: {
    id: {
      type: String,
      default: '0xD9a67CA12D7A22A8330e55FC704C5FcEB9a24E30'
      }
    },
    methods: { 
      update() {
        makeTree(this, this.input_val)
      }, 
      update(body, address) {
        if (!body) body = this
        if (address) body.input_val = address;
        makeTree(body, body.input_val)
      } 
    },
    mounted () {
        makeTree(this, this.input_val)
    } 
}
</script>
<style>
.spinner{
  position: fixed;
  top: calc(50% - 40px);
  right: calc(50% - 40px);
}

.svg{
  height: calc(100vh - 112px);
  width: 100%;
  border: 1px solid #d8d8d8;
}

.form_address{
  margin-bottom: 10px;
}

.node text {
  font: 12px sans-serif;
}

._id:hover {
  fill: blue;
  text-decoration: underline;
}

.zoom{
  cursor: grab;
  fill: none;
  pointer-events: all;
  width: 100%;
  height: calc(100vh - 112px);
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
  rx: 0;
  ry: 0;
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
