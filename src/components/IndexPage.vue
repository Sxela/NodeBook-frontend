<<<<<<< HEAD
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
    <div>
    
    <p>Address {{total_out[0]._id}} has {{total_out[0].links}} outgoing links with a total value of {{total_out[0].value/1000000000000000000}} ETH</p>
    <span>Address {{total_out[0]._id}} has {{total_out[0].links}} outgoing links with a total value of {{total_out[0].value/1000000000000000000}} ETH</span>
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
import dataService from '@/services/fetchData';
import * as d3 from 'd3';

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
            total_out: {}
            
        }
    },
    methods: {      
    async getData () {
        this.tree.name = this.input_val;
        const response = await dataService.fetchData('out',this.input_val)
        this.txes = response.data
        this.txes.tx_out.forEach(item => {
            this.tree.children.push({"name": item._id})
            })
        this.total_out = this.txes.total_out
        },
    async makeTree (address) {

    async function getData(address)  {
      const response = await dataService.fetchData('out',address)
      return response.data 
    }
    
    var  margin = ({top: 50, right: 300, bottom: 50, left: 450})
    var dx = 10
    var dy = 10
    var dy = 360

    function diagonal(s, d) {

      var path = `M ${s.y} ${s.x}
              C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`

      return path
    }
    
    var diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
    var tree = d3.tree().nodeSize([dx, dy])
 
    async function addN(selected, _id, item){
      var newNode = {
        _id: item._id,
        children: [],
      };

      //Creates a Node from newNode object using d3.hierarchy(.)
      var newNode = d3.hierarchy(newNode);

      //later added some properties to Node like child,parent,depth
      newNode.depth = selected.depth + 1; 
      newNode.height = selected.height - 1;
      newNode.parent = selected; 
      
      const nodedata1 =  await getData(newNode.data._id)
      //console.log(nodedata1)
      if (nodedata1.total_out[0] != null) 
        {
          newNode.data.tx_out = nodedata1.total_out[0].links,
          newNode.data.value_out = nodedata1.total_out[0].value
        }
      newNode.data.children = nodedata1.tx_out
      newNode.data.tx_in = item.Txes;
      newNode.data.value_in = item.value;

      //Selected is a node, to which we are adding the new node as a child
      //If no child array, create an empty array
      if(!selected.children){
        selected.children = [];
        selected.data.children = [];
      }
      //Push it to parent.children array  
      selected.children.push(newNode);
      selected.data.children.push(newNode.data);
      selected._children = selected.children;
      update(selected)
    }


  const nodedata =  await getData(address)
 
  var newNode = {
    _id: address,
    children: []
  }

  var root = d3.hierarchy(newNode)
      if (nodedata.total_out[0] != null) 
        {
          root.data.tx_out = nodedata.total_out[0].links,
          root.data.value_out = nodedata.total_out[0].value
        }
      root.data.children = nodedata.tx_out
  
  //add each linked address as a child node
  nodedata.tx_out.forEach(async item =>  {
    await addN(root, item._id)
  })

    root.x0 = dy / 2;
    root.y0 = 0;

    root.descendants().forEach((d, i) => {
      d.id = i;
    });

    const svg = d3.select("svg")
        .attr("width", dy)
        .attr("height", dx)
        .attr("viewBox", [-margin.left, -margin.top, dy, dx])
        .style("font", "10px courier")
        .style("user-select", "none");

    const gLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
        .attr("cursor", "pointer");



    //main function    

    function update(source) {
      const duration = d3.event && d3.event.altKey ? 2500 : 250;
      const nodes = root.descendants().reverse();
      const links = root.links();

      // Compute the new tree layout.
      tree(root);
      
      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + margin.top + margin.bottom;

      let top = root;
      let bottom = root;
      root.eachBefore(node => {
        if (node.y < top.y) top = node;
        if (node.y > bottom.y) bottom = node;
      });
      
      const width = bottom.y - top.y + margin.left + margin.right;

      const transition = svg.transition()
          .duration(duration)
          .attr("height", height)
          .attr("width", width)
          .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
          .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

      // Update the nodes…
      const node = gNode.selectAll("g")
        .data(nodes, d => d.id);

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append("g")
          .attr("transform", d => `translate(${source.y0},${source.x0})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0)
          .on("click", async function (d) {
              console.log(d)
            if (d.data.tx_out) { //if no outcoming txes, unclickable
              if (d.children) {
                  d._children = d.children;
                  d.children = null;
                  var a = d3.select(this)
                    a.selectAll('circle')
                      .attr("fill", 'orange')
                } else {
                  d.children = d._children;
                  var a = d3.select(this)
                    a.selectAll('circle')
                      .attr("fill", 'gray')
                  if (d._children == null && d.children == null){
                  d.data.children.forEach(item => {  
                      {addN(d,item._id,item)}
                      console.log(item)
                  })

                    
                    
                    root.descendants().forEach((d, i) => {
                                        d.id = i;})
                  }
                  d._children = null;              
              }
              update(d);
            } 
        
      
          });

    

      nodeEnter.append("circle")
          .attr("r", 2.5)
          .attr("fill", d => {if (d.data.tx_out)  return 'orange';else return 'gray'});

      nodeEnter.append("text")
          .attr("class", "_id")
          .attr("dy", "0.31em")
          .attr("x", d => d.id==0 ? '-5' : '5')
          .attr("text-anchor", d => d.id==0 ? "end" : "start")
          .text(d => d.data._id)
        .clone(true).lower()
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 5)
          .attr("stroke", "white")

      nodeEnter.append("text")
          .attr("class", "tx_out")
          .attr("dy", "0.31em")
          .attr("text-anchor", d => d.id==0 ? "start" : "end")
          .attr("x", d => d.id==0 ? '6' : '280')

          .text(d => d.data.tx_out ? `${d.data.tx_out}>` : '')
        .clone(true).lower()
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 5)
          .attr("stroke", "white")

      nodeEnter.append("text")
          .attr("class", "tx_in")
          .attr("dy", "0.31em")
          .attr("text-anchor", d => d.id==0 ? "start" : "end")
          .attr("x", d => d.id==0 ? '30' : '-30')
          .text(d => d.id==0 ? '' : ` ${Math.round((d.data.value_in/1000000000000000000)*100)/100}ETH`)
        .clone(true).lower()
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 5)
          .attr("stroke", "white")

      nodeEnter.append("text")
          .attr("class", "tx_in")
          .attr("dy", "0.31em")
          .attr("text-anchor", d => d.id==0 ? "end" : "start")
          .attr("x", d => d.id==0 ? '30' : '-30')
          .text(d => d.id==0 ? '' : `:${d.data.tx_in}>`)
        .clone(true).lower()
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 5)
          .attr("stroke", "white")


      // Transition nodes to their new position.
      const nodeUpdate = node.merge(nodeEnter).transition(transition)
          .attr("transform", d => `translate(${d.y},${d.x})`)
          .attr("fill-opacity", 1)
          .attr("stroke-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node.exit().transition(transition).remove()
          .attr("transform", d => `translate(${source.y},${source.x})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0);

      // Update the links…
      const link = gLink.selectAll("path")
        .data(links, d => d.target.id)
      // .attr("stroke-width", d => d.target.id+1)

      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().append("path")
          .attr("d", d => {
            const o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          });

      // Transition links to their new position.
      link.merge(linkEnter).transition(transition)
          .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition(transition).remove()
          .attr("d", d => {
            const o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          });

      // Stash the old positions for transition.
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    update(root);
}
    },
    mounted () {
        this.getData()
        this.makeTree(this.input_val)
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

.link {
  fill: none;
  
  stroke: #555;
stroke-opacity: 0.1;
  stroke-width: 1.5px;
}


</style>
=======
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
>>>>>>> 6bfe90fbcc731d452c8f79ff1806abdf7ed22a34
