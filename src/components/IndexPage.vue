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
  
    <span>Address {{total_out[0]._id}} has {{total_out[0].links}} outgoing links with a total value of {{Math.round(total_out[0].value/1000000000000000000*100)/100}} ETH</span>
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
              td {{ Math.round(tx.value/1000000000000000000*100)/100 }}
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
              td {{ Math.round(tx.value/1000000000000000000*100)/100 }}
              td
        
    </div>
    
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
      
    update() {
      d3.selectAll('svg').selectAll("g").remove()

      this.getData()
      this.makeTree(this.input_val)
    }, 

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
    var dy = 280
    
    var diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
    var vertical = d3.linkVertical().x(d => d.y).y(d => d.x)
    var tree = d3.tree().nodeSize([dx, dy])
    
 
    async function addN(selected, item){
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

      if (nodedata1.total_out[0] != null) 
        {
          newNode.data.tx_out = nodedata1.total_out[0].links,
          newNode.data.value_out = nodedata1.total_out[0].value  
        }
      if (nodedata1.aliases[0] != null){newNode.data.alias = nodedata1.aliases[0].tokenName}

      newNode.data.children = nodedata1.tx_out
      newNode.data.tx_in = item.Txes;
      newNode.data.value_in = item.value;

      //Selected is a node, to which we are adding the new node as a child
      //If no child array, create an empty array
      if(!selected.children){
        selected.children = [];
        selected.data.children = [];
      }

      selected.children.push(newNode);
      selected.data.children.push(newNode.data);

      selected._children = selected.children;
       root.descendants().forEach((d, i) => {
      d.id = i
      ;selected._children = selected.children;
      });

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
  if (nodedata.aliases[0] != null){root.data.alias = nodedata.aliases[0].tokenName}

  //add each linked address as a child node
  await nodedata.tx_out.forEach(async item =>  {
     addN(root, item)
  })

    root.x0 = dy / 2;
    root.y0 = 0;

    root.descendants().forEach((d, i) => {
      d.id = i;
    });

    //pan+ zoom------------------------------------------------------------------------------
      var width = document.body.clientWidth
      var height = document.body.clientHeight/2
      var zoom = d3.zoom()
          .on("zoom", zoomFunction);

      function zoomFunction(){ 
        let x = d3.event.transform.x + width/4
        let y = d3.event.transform.y + height/4
        let k = d3.event.transform.k
        svg.attr("transform", 'translate('+x+','+ y +') scale('+k+','+k+')')  

      };

      const svgView = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .style("font", "10px courier")
        .style("user-select", "none")

      var innerSpace = svgView.append("g")
          .attr("class", "inner_space")

      const svg = innerSpace.append("g")
          .attr("class", "graph")

      var view = innerSpace.append("rect").lower()
          .attr("class", "zoom")
          .attr("width", width)
          .attr("height", height)
          .call(zoom)

      var mypath = svg.append("path")
          .attr("id", 'p')
          .attr('fill', 'red')
          .attr("d", diagonal({source: {x: 0, y: 0}, target: {x: 200, y: 200}}))
      svg.attr("transform", `translate(${width/4},${height/4})`)
      
     //pan+zoom ------------------------------------------------------------------------
    

    const gLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)

    const gdupLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 1.0)


    const gNode = svg.append("g")
        .attr("cursor", "pointer")

    
    
    

    //main function    

    function update(source) {
      const duration = d3.event && d3.event.altKey ? 2500 : 250;
      const nodes = root.descendants().reverse();
      var links = [];
      var duplinks = [];
      root.descendants().forEach((d,i) =>{
        if(d.children) { 
          d.children.forEach(dd => links.push({source: d, target: dd}))
        }  
        if(d.dupes) {     
          d.dupes.forEach(dd => duplinks.push({source: d, target: dd}))
        }
      })
      console.log(duplinks)
      // Compute the new tree layout.
      tree(root);


      const transition = svg.transition()
          .duration(duration)


      // Update the nodes…
      const node = gNode.selectAll("g")
        .data(nodes, d => d.id);
      
      
//taking address as an argument, looking through all the tree data for duplicates. when duplicate found, return it 
      async function dupe(_id) {
        let result = 0;
                        await root.descendants().forEach(s=>{
                          if (_id == s.data._id) {
                            console.log('dupe' +s.data._id)
                            result = s;
                          }   
                        }) 
        return result
      } 

      async function onClick(d) {
              console.log(d)
            if (d.data.tx_out) { //if no outcoming txes, unclickable
              if (d.children || d.dupes) {
                  d._children = d.children; d._dupes = d.dupes;
                  d.children = null; d.dupes = null;

                  var a = d3.select(this)
                    a.selectAll('circle')
                      .attr("fill", 'orange')
                } 
              else {
                  d.children = d._children; d.dupes = d._dupes;

                  var a = d3.select(this)
                    a.selectAll('circle')
                      .attr("fill", 'gray')

                  if (d._children == null && d.children == null && d.dupes == null && d._dupes == null){
                    d.data.children.forEach(async item =>  {

                      let dupe1 = await dupe(item._id)
                      console.log(dupe1)
                      if (dupe1!=0) 
                      {
                        if (!d.dupes) d.dupes = [];
                        d.dupes.push(dupe1)
                        update(d)
                      }
                      else 
                      {addN(d,item)}
                    })                 
                  }
                  d._children = null; d._dupes = null

               }
              update(d);
            } 
        
      
        }

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append("g")
          .attr("transform", d => `translate(${source.y0},${source.x0})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0)
          .on("click", d => onClick(d));

      

      nodeEnter.append("circle")
          .attr("r", 2.5)
          .attr("fill", d => {if (d.data.tx_out)  return 'orange';else return 'gray'});

      nodeEnter.append("text")
          .attr("class", "_id")
          .attr("dy", "0.31em")
          .attr("x", d => d.id==0 ? '-5' : '5')
          .attr("text-anchor", d => d.id==0 ? "end" : "start")
          .text(d => 
          {
            if (d.data.alias != null){ return d.data.alias} else 
          { return `[${d.data._id.substr(0,7)}..${d.data._id.substr(-7,7)}]`}
          })
        .clone(true).lower()
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 5)
          .attr("stroke", "white")

      nodeEnter.append("text")
          .attr("class", "tx_out")
          .attr("dy", "0.31em")
          .attr("text-anchor", d => d.id==0 ? "start" : "end")
          .attr("x", d => d.id==0 ? '6' : '135')

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

      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().append("path")
          .attr("d", d => {
            const o = {x: (source.x0), y: source.y0+50};
            return diagonal({source: o, target: o}); 
          });
      

      // Transition links to their new position.
      link.merge(linkEnter).transition(transition)
          .attr("d", d=> {
            let y2 = 0;
            if (d.source.x == 0 && d.source.y ==0) {y2 = d.source.y;} else {y2 = d.source.y+120;}
            
            return diagonal({source: {x:d.source.x,y:y2}, target: {x:d.target.x,y:d.target.y}})});

      

      // Transition exiting nodes to the parent's new position.
      link.exit().transition(transition).remove()
          .attr("d", d => {
            const o = {x: (source.x), y: source.y};
            return diagonal({source: o, target: o});
          });


      // Update the links…
      const duplink = gdupLink.selectAll("path")
        .data(duplinks, d=> d.target.id)

      // Enter any new links at the parent's previous position.
      const duplinkEnter = duplink.enter().append("path")
          .attr("d", d => {
            const o = {x: source.x0, y: source.y0};
            return vertical({source: o, target: o});
          });

      // Transition links to their new position.
      duplink.merge(duplinkEnter).transition(transition)
          .attr("d", d=> {
            let y2 = 0;
            if (d.source.x == 0 && d.source.y ==0) {y2 = d.source.y;} else {y2 = d.source.y+120;}
            
            return vertical({source: {x:d.source.x,y:y2}, target: {x:d.target.x,y:d.target.y}})});
        

      // Transition exiting nodes to the parent's new position.
      duplink.exit().transition(transition).remove()
          .attr("d", d => {
            const o = {x: source.x, y: source.y};
            return vertical({source: o, target: o});
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

.zoom{
  cursor: grab;
  fill: none;
  pointer-events: all;
  
}

.graph {
  margin-top: 120px;
  margin-left: 200px;
}
</style>
