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
    <span v-text="test"></span>
</div>
</template>
<script>
import dataService from '@/services/fetchData'
import * as d3 from 'd3'

export default {
    name: 'index',
    components: {
    
    },
    data ()
    {
        return {
            txes:{},
            input_val : '0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8',
            tree: {
                name: '',
                children: []
            },
            test: ''
            
        }
    },
    computed: {
    y() { return this.chartHeight / 2; },
    },
    methods: {
        
    async getData () {
        this.tree.name = this.input_val;
        const response = await dataService.fetchData(this.input_val)
        this.txes = response.data
        this.txes.tx_out.forEach(item => {
            this.tree.children.push({"name": item._id})
            })
        },

    
    async makeTree () {
var treeData =
  {
    "name": "Top Level",
    "children": [
      { 
        "name": "Level 2: A",
        "children": [
          { "name": "Son of A" },
          { "name": "Daughter of A" }
        ]
      },
      { "name": "Level 2: B" }
    ]
  };

// Set the dimensions and margins of the diagram
var margin = {top: 20, right: 90, bottom: 30, left: 300},
    width = 960 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
//var svg = d3.select("body").append("svg")
var svg = d3.select("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate("
          + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750;
    //root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

// Assigns parent, children, height, depth
await this.getData()
var root = d3.hierarchy(this.tree, d => { return d.children; });
root.x0 = height / 2;
root.y0 = 0;

// Collapse after the second level
root.children.forEach(collapse);

update(root);

// Collapse the node and all it's children
function collapse(d) {
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}


function update(source) {

  // Assigns the x and y position for the nodes
  //var treeData = treemap(root);
    var treeData = treemap(root);


  // Compute the new tree layout.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalize for fixed-depth.
  nodes.forEach(d =>{ d.y = d.depth * 180});

  // ****************** Nodes section ***************************

  // Update the nodes...
  var node = svg.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('click', click);

  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
      });

  // Add labels for the nodes
  nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", function(d) {
          return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
      })
      .text(function(d) { return d.data.name; });

  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 5)
    .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
    })
    .attr('cursor', 'pointer');


  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

  // Update the links...
  var link = svg.selectAll('path.link')
      .data(links, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

    

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

  // Remove any exiting links
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {

    var path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        if (d._children == null)     {
            var childs = [{ "name": d.id + " "+ d.x +" "+ d.y + " " +d.x0 +" " +d.y0},
          { "name": d.id + " "+ d.x +" "+ d.y + " " +d.x0 +" " +d.y0}]
          //var childs = this.tree.children
          childs.forEach(node => {addN(d,node.name)})
          
        

            var a = d3.select(this)
            a.select('text')
              .attr("text-anchor","end")
              .attr("x", -13 )
             }

        d._children = null;
      }
    update(d);
  }
function addN(selected, name){
var newNode = {
    type: 'node-type',
    name: name,
    children: [],
  };
  //Creates a Node from newNode object using d3.hierarchy(.)
  var newNode = d3.hierarchy(newNode);

  //later added some properties to Node like child,parent,depth
  newNode.depth = selected.depth + 1; 
  newNode.height = selected.height - 1;
  newNode.parent = selected; 
  newNode.id = name;
  newNode.x0 = selected.x;
  newNode.y0 = selected.y;
  //newNode.x = selected.x;
  //newNode.y = selected.y;

  //Selected is a node, to which we are adding the new node as a child
  //If no child array, create an empty array
  if(!selected.children){
    selected.children = [];
    selected.data.children = [];
  }

  //Push it to parent.children array  
  selected.children.push(newNode);
  selected.data.children.push(newNode.data);
  

  //update(selected);
  }



}
    }},
    mounted () {
        this.getData()
        this.makeTree()
    }
    
}
</script>
<style>
circle { fill: orange; }
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

.link {
  fill: none;
  
  stroke: #555;
stroke-opacity: 0.1;
  stroke-width: 1.5px;
}


</style>
