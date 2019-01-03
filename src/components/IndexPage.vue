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
import my_tree from '@/services/layout';


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

    async function getData(address, block)  {
      const response = await dataService.fetchData('out', address, block)
      return response.data 
    }

    
    
    var  margin = ({top: 50, right: 300, bottom: 50, left: 450})
    var dx = 25 //10
    var dy = 460 //280
    var size = 300

    function diagonal_old(s, d) {

      var path = `M ${s.y} ${s.x}
              C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`

      return path
    }
    
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
      
      const nodedata1 =  await getData(newNode.data._id, item.firstBlock) //look for txes from given address and after given block (to make sure we look for descending txes only)
      //console.log(nodedata1)
      if (nodedata1.total_out[0] != null) 
        {
          newNode.data.tx_out = nodedata1.total_out[0].links,
          newNode.data.value_out = nodedata1.total_out[0].value  
        }
      if (nodedata1.aliases[0] != null){newNode.data.alias = nodedata1.aliases[0].tokenName}
      newNode.data.children = nodedata1.tx_out
      newNode.data.tx_in = item.Txes;
      newNode.data.value_in = item.value;
      newNode.data.firstBlock = item.firstBlock; //adding the first incoming transaction block to look for outgoing transactions after this block

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

    //test------------------------------------------------------------------------------
      var width = document.body.clientWidth
      var height = document.body.clientHeight/2
      var zoom = d3.zoom()
          .on("zoom", zoomFunction);

      function zoomFunction(){
        //svg.attr("transform", d3.event.transform)  
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

      
    svg.attr("transform", `translate(${width/4},${height/4})`)
      
     // test ------------------------------------------------------------------------
    

    const gLink = svg.append("g")
        .attr("class", "gLink")
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
        .attr("class", "gNode")
        .attr("cursor", "pointer")


    //main function------------------------------------------------------------------------    

    function update(source) {
      const duration = d3.event && d3.event.altKey ? 2500 : 250;
      const nodes = root.descendants().reverse();
      root.sort(function(a, b) { return - b.data.value_in + a.data.value_in; }); //sort by incoming value
      
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
      my_tree(root, dx, dy, size)
      const transition = svg.transition()
          .duration(duration)


      // Update the nodes…
      const node = gNode.selectAll("g")
        .data(nodes, d => d.id);
      
      
//taking address as an argument, looking through all the tree data for duplicates. when duplicate found, return it 
      async function dupe(item) {
        let result = 0;
                        await root.descendants().forEach(s=>{
                          if (item._id == s.data._id) {
                            if (item.firstBlock < s.data.firstBlock) {s.data.firstBlock = item.firstBlock; update(s)}
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

                      let dupe1 = await dupe(item)
                      //console.log(dupe1)
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

      nodeEnter.append("rect")
          .attr("class", "node_rect_bg")
          .attr("y", d => -d.data.size/2.0)
          .attr("x", d => d.id ==0 ? -dy/2.0 : 0)
          .attr("height", d => d.data.size)
          .attr("width", dy/2)
          .attr("fill", "none")
          .attr("stroke", "#555")
          .attr("stroke-opacity", 0.4)
          .attr("stroke-width", 1.5)

      nodeEnter.append("rect")
          .attr("class", "node_rect_link")
          .attr("y", d => -d.data.size/2.0)
          .attr("x", d => d.id ==0 ? -60 : dy/2-60)
          .attr("height", d => d.data.size)
          .attr("width", 60)
          .attr("fill", 'orange')
          .attr("fill-opacity", d => {
            if (d.data.tx_out>0 && !d.children) return 1;
            else return 0;
          })   

      nodeEnter.append("text")
          .attr("class", "_id")
          .attr("dy", "0.31em")
          .attr("x", d => d.id==0 ? -dy/4.0 : dy/4.0)
          .attr("text-anchor", "middle")
          .text(d => 
          {
            if (d.data.alias != null){ return d.data.alias} else 
          { return `[${d.data._id.substr(0,7)}..${d.data._id.substr(-7,7)}]`}
          })

      nodeEnter.append("text")
          .attr("class", "tx_out")
          .attr("dy", "0.31em")
          .attr("text-anchor", "end")
          .attr("x", d => d.id==0 ? '-20' : dy/2.0-20)

          .text(d => d.data.tx_out ? `${d.data.tx_out}` : '')

      nodeEnter.append("text")
          .attr("class", "tx_in")
          .attr("dy", "0.31em")
          .attr("text-anchor", d => d.id==0 ? "end" : "start")
          .attr("x", d => d.id==0 ? '-5' : '5')
          .text(d => d.id==0 ? '' : `${Math.round((d.data.value_in/1000000000000000000)*100)/100}`)

      nodeEnter.append("text")
          .attr("class", "tx_in_ratio")
          .attr("dy", "0.31em")
          .attr("text-anchor", d => d.id==0 ? "end" : "start")
          .attr("x", 5)
          .attr("y", 10)
          .text(d => d.id==0 ? '' : `${Math.round((d.data.value_in/d.parent.data.value_out)*10000)/100}%`)

      nodeEnter.append("path")
          .attr("d","M7.39399 6.2781C6.87791 6.2781 6.41772 6.52403 6.12335 6.90411L3.65847 5.52727C3.71623 5.36146 3.7479 5.1826 3.7479 4.99815C3.7479 4.81184 3.71623 4.63485 3.65661 4.46717L6.11963 3.0922C6.41213 3.47414 6.87418 3.72193 7.39212 3.72193C8.27523 3.72193 8.99625 3.00277 8.99625 2.1178C8.99625 1.23283 8.27709 0.513672 7.39212 0.513672C6.50715 0.513672 5.78799 1.23283 5.78799 2.1178C5.78799 2.30411 5.81967 2.48297 5.87928 2.64878L3.41813 4.02375C3.12562 3.63995 2.66357 3.39402 2.14563 3.39402C1.26252 3.39402 0.541504 4.11318 0.541504 4.99815C0.541504 5.88313 1.26252 6.60228 2.1475 6.60228C2.66544 6.60228 3.12749 6.35449 3.42186 5.97069L5.88487 7.34752C5.82526 7.5152 5.79172 7.69592 5.79172 7.88223C5.79172 8.76534 6.51088 9.48636 7.39585 9.48636C8.28082 9.48636 8.99998 8.76721 8.99998 7.88223C8.99998 6.99726 8.27896 6.2781 7.39399 6.2781ZM7.39399 1.01857C8.00136 1.01857 8.49508 1.51229 8.49508 2.11966C8.49508 2.72703 8.00136 3.22076 7.39399 3.22076C6.78661 3.22076 6.29289 2.72703 6.29289 2.11966C6.29289 1.51229 6.78848 1.01857 7.39399 1.01857ZM2.1475 6.09925C1.54013 6.09925 1.0464 5.60552 1.0464 4.99815C1.0464 4.39078 1.54013 3.89706 2.1475 3.89706C2.75487 3.89706 3.24859 4.39078 3.24859 4.99815C3.24859 5.60552 2.753 6.09925 2.1475 6.09925ZM7.39399 8.98146C6.78661 8.98146 6.29289 8.48774 6.29289 7.88037C6.29289 7.273 6.78661 6.77928 7.39399 6.77928C8.00136 6.77928 8.49508 7.273 8.49508 7.88037C8.49508 8.48774 8.00136 8.98146 7.39399 8.98146Z")
          .attr("transform", d => `scale(1.0) translate(${d.id!=0 ? (dy/2.0-15) : -15}, -5)`)
          .attr("fill-opacity", d => {
            if (d.data.tx_out>0 && !d.children) return 1;
            else return 0;
          }) 

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
        .attr("stroke-width", d => Math.max(d.target.data.size, 0.3))
      

      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().append("path")
          .attr("d", d => {
            const o = {x: (source.x0), y: source.y0+dy/2.0};
            return diagonal({source: o, target: o}); 
          });
      

      // Transition links to their new position.
      link.merge(linkEnter).transition(transition)
          .attr("d", d=> 
            {
              let y2 = 0;
              if (d.source.x == 0 && d.source.y ==0) {y2 = d.source.y;} else {y2 = d.source.y+dy/2.0;}
              let x2 = d.source.x - d.source.data.size/2.0 + d.target.data.size/2.0
              d.target.parent.children.forEach((a,i)=>{
                if (i > d.target.parent.children.findIndex(item => item == d.target))
                {
                  x2+= a.data.size
                }
              })
              return diagonal({source: {x:x2,y:y2}, target: {x:d.target.x,y:d.target.y}})
            });

      

      // Transition exiting nodes to the parent's new position.
      link.exit().transition(transition).remove()
          .attr("d", d => {
            const o = {x: (source.x), y: source.y};
            return diagonal({source: o, target: o});
          });


      // Update the links…
      const duplink = gdupLink.selectAll("path")
        .data(duplinks, d=> d.target.id)
      // .attr("stroke-width", d => d.target.id+1)

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
  fill: #F2F9FE;
  rx: 4;
  ry: 4;
  stroke-opacity: 0;
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

</style>
