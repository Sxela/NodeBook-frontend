import dataService from '@/services/fetchData';
import * as d3 from 'd3';
import my_tree from '@/functions/layout';
import { update_nodes } from '@/functions/update_nodes';
import { update_links } from '@/functions/update_links';

export async function makeTree (body, address) {

  d3.selectAll('svg').selectAll("g").remove()
  var width = window.innerWidth
  const height = (window.innerHeight) - 120;

    async function getData(address, direction, block)  {
      if (!block && !direction) {
        const response = await dataService.fetchData(address);
        return response.data 
        }
      else 
      {
        const response = await dataService.fetchData(address, direction, block)
        return response.data 
        }
    }

    var margin = ({top: 50, right: 300, bottom: 50, left: 450})
    var dx = 25 //10
    var dy = 460 //280
    var size = 300

    var diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
    var vertical = d3.linkVertical().x(d => d.y).y(d => d.x)

    //pan&zoom------------------------------------------------------------------------------
      
    var zoom = d3.zoom()
    .on("zoom", zoomFunction);

function zoomFunction(){ 
  let x = d3.event.transform.x + width/2
  let y = d3.event.transform.y + height/2
  let k = d3.event.transform.k
  svg.attr("transform", 'translate('+x+','+ y +') scale('+k+','+k+')')  
};

const svgView = d3.select("svg")
//  .attr("width", width)
  .attr("height", height)
  .style("font", "10px courier")
  .style("user-select", "none")

var innerSpace = svgView.append("g")
    .attr("class", "inner_space")

const svg = innerSpace.append("g")
    .attr("class", "graph")

var view = innerSpace.append("rect").lower()
    .attr("class", "zoom")
//    .attr("width", width)
    .attr("height", height)
    .call(zoom)


svg.attr("transform", `translate(${width/2},${height/2})`)

//pan&zoom------------------------------------------------------------------------


const gLink = svg.append("g")
  .attr("class", "gLink")
  .attr("fill", "none")

const gdupLink = svg.append("g")
  .attr("class", "gdupLink")

const gNode = svg.append("g")
  .attr("class", "gNode")
  .attr("cursor", "pointer")

const gPopup = svg.append("g")
  .attr("class", "gPopup")

const duration = d3.event && d3.event.altKey ? 2500 : 250;

    async function addN(selected, item){
      var newNode = {
        _id: item._id,
        children: [],
      };

      if (selected.children && selected.children.findIndex(d => d.data._id == item._id) != -1) {}
      else {
      
      //Creates a Node from newNode object using d3.hierarchy(.)
      var newNode = d3.hierarchy(newNode);

      //later added some properties to Node like child,parent,depth
      newNode.data.type = selected.data.type;
      newNode.depth = selected.depth + 1; 
      newNode.height = selected.height - 1;
      newNode.parent = selected; 

      var nodedata1;
      
      if (newNode.data.type == 'out')
      {
        nodedata1 =  await getData(newNode.data._id, newNode.data.type, item.firstBlock) //look for txes from given address and after given block (to make sure we look for descending txes only)

        if (nodedata1.total_out && nodedata1.total_out[0] != null) 
          {
            newNode.data.tx_out = nodedata1.total_out[0].links,
            newNode.data.value_out = nodedata1.total_out[0].value  
          }

        newNode.data.children = nodedata1.tx_out
        newNode.data.tx_in = item.Txes;
        newNode.data.value_in = item.value;
        newNode.data.firstBlock = item.firstBlock; //adding the first incoming transaction block to look for outgoing transactions after this block
      }
      else
      {
        nodedata1 =  await getData(newNode.data._id, newNode.data.type, item.lastBlock) //look for txes from given address and after given block (to make sure we look for descending txes only)

        if (nodedata1.total_in && nodedata1.total_in[0] != null) 
          {
            newNode.data.tx_in = nodedata1.total_in[0].links,
            newNode.data.value_in = nodedata1.total_in[0].value  
          }

        newNode.data.children = nodedata1.tx_in
        newNode.data.tx_out = item.Txes;
        newNode.data.value_out = item.value;
        newNode.data.lastBlock = item.lastBlock; //adding the first incoming transaction block to look for outgoing transactions after this block
      }

      if (nodedata1.aliases[0] != null){newNode.data.alias = nodedata1.aliases[0].tokenName}
      //Selected is a node, to which we are adding the new node as a child
      //If no child array, create an empty array

      if(!selected.children){
        selected.children = [];
        selected.data.children = [];
      }
      
        selected.children.push(newNode);
        selected.data.children.push(newNode.data);

        selected._children = selected.children;

        if (newNode.data.type == 'out')
        {
          root_out.descendants().forEach((d, i) => {
            d.id = i
          });
          
        }
        else 
        {
          root_in.descendants().forEach((d, i) => {
            d.id = i
          });
          
        }
        update(selected)
      }
    }

  const nodedata =  await getData(address)
  //set main page data
  body.tree.name = body.input_val;
  body.txes = nodedata
  body.total_out = body.txes.total_out
  body.total_in = body.txes.total_in
 
  var newNode_out = {
    _id: address,
    children: []
  }

  var newNode_in = {
    _id: address,
    children: []
  }

  var root_out = d3.hierarchy(newNode_out);
  var root_in = d3.hierarchy(newNode_in);

  root_out.x0 = dy / 2;
  root_out.y0 = 0;

  root_in.x0 = dy / 2;
  root_in.y0 = -dy;

  root_out.data.type = 'out';
  root_in.data.type = 'in';

  if (nodedata.aliases[0] != null){root_out.data.alias = root_in.data.alias = nodedata.aliases[0].tokenName}


  if (nodedata.total_out && nodedata.total_out[0] != null) 
    {
      root_out.data.tx_out = nodedata.total_out[0].links,
      root_out.data.value_out = nodedata.total_out[0].value
      root_out.data.children = nodedata.tx_out
      await nodedata.tx_out.forEach(async item =>  {
        addN(root_out, item)
      })
    }
  
  if (nodedata.total_in && nodedata.total_in[0] != null) 
    {
      root_in.data.tx_in = nodedata.total_in[0].links,
      root_in.data.value_in = nodedata.total_in[0].value
      root_in.data.children = nodedata.tx_in
      await nodedata.tx_in.forEach(async item =>  {
        addN(root_in, item)
      })
    }
  
    root_out.descendants().forEach((d, i) => {
        d.id = i
      });

    root_in.descendants().forEach((d, i) => {
        d.id = i
      });  
    
//taking address as an argument, looking through all the tree data for duplicates. when duplicate found, return it 
      async function dupe(item, type) {
        let result = 0;
        if (type == 'out') 
        {
          await root_out.descendants().forEach((s,i)=>{
            if (item._id == s.data._id) 
            {
              if (item.firstBlock < s.data.firstBlock) {s.data.firstBlock = item.firstBlock; update_out(s)}
              result = s;
            }   
          }) 
        }
        else
        {
          await root_in.descendants().forEach((s,i)=>{
            if (item._id == s.data._id) 
            {
              if (item.lastBlock > s.data.lastBlock) {s.data.lastBlock = item.lastBlock; update_in(s)}
              result = s;
            }   
          })
          
        }
        return result
      } 

    function update(node)
    {
      if (node.data.type == 'out') update_out(node); else update_in(node);
    }

    function mouseover(d)
    {
      gPopup.selectAll('*').remove()
      const ddx = 15; //text fields margin

      var input_data = {

        id: d.data._id,
        alias: d.data.alias,
        'incoming connections': d.data.tx_in,
        'incoming ETH' : Math.round(d.data.value_in/1000000000000000000*100)/100,
        'outgoing transactions': d.data.tx_out,
        'outgoing ETH' : Math.round(d.data.value_out/1000000000000000000*100)/100,

      }

      var data = Array({a:'', b:''});
      for (let key in input_data){
        data.push({a: key, b: input_data[key]})
      }
      const popup = gPopup.selectAll("g")
          .data(data)

      gPopup.append("rect")
          .attr('class', 'popup')
          .attr("x", d.y+50)
          .attr("y", d.x + 50)
          .attr("width", 600)
          .attr("height", (data.length+1)*ddx)
          .attr("id", "t" + d.id)
          .style('opacity', 0)

      const popupEnter = popup.enter().append("g")

      popupEnter.append("text")
          .attr('class', 'gNode')
          .text(d => d.b )
          .attr("x",  d.y + 65 +150)
          .attr("text-anchor", "start")
          .attr("y", (n,i) => 70 +d.x + i*ddx)
          .style('opacity', 0)

      popupEnter.append("text")
          .attr('class', 'gNode')
          .text((n,i) => data[i].a + ':')
          .attr("x",  d.y + 65 + 145)
          .attr("text-anchor", "end")
          .attr("y", (n,i) => 70 +d.x + i*ddx)
          .style('opacity', 0)

      gPopup.selectAll("*").transition()
          .duration(700)
          .style('opacity', 1)
    }

    function mouseout(d)
    {
      gPopup.selectAll('*').transition()		
                .duration(200)
                .style('opacity', 0)		
                .remove()
    }
     //onclick function -----------------------------------------------------------

     async function onClick(d, g) {
              mouseout(d);
              console.log(d)
            if (d.data.tx_out || d.data.tx_in) { //if no outcoming txes, unclickable
              if (d.children || d.dupes) {
                  d._children = d.children; d._dupes = d.dupes;
                  d.children = null; d.dupes = null;
                    g.selectAll("rect")
                      .attr("fill-opacity", 1)
                } 
              else {
                  d.children = d._children; d.dupes = d._dupes;
                  console.log(g)
                    g.selectAll("rect")
                      .attr("fill-opacity", 0)

                  if (d._children == null && d.children == null && d.dupes == null && d._dupes == null){
                    d.data.children.forEach(async item =>  {

                      let dupe1 = await dupe(item, d.data.type)
                      if (dupe1!=0) 
                      {
                        if (!d.dupes) d.dupes = [];
                        d.dupes.push(dupe1)
                        update(d)
                      }
                      else  //no dupe checking as all the flow is time-based, so no infinite loops will happen
                      {
                        addN(d,item)}
                    })                 
                  }
                  d._children = null; d._dupes = null
               }
              update(d);
            } 
        }

    //main function------------------------------------------------------------------------    

    async function update_out(source) {

      
      let nodes = root_out.descendants().reverse();
    
      root_out.sort(function(a, b) { return - b.data.value_in + a.data.value_in; }); //sort by incoming value
      my_tree(root_out, dx, dy, size)

      let links = [];
      let duplinks = [];

      root_out.descendants().forEach((d,i) =>{
        if(d.children) {
          d.children.forEach(dd => links.push({source: d, target: dd}))
        }  
        if(d.dupes) {
          d.dupes.forEach(dd => duplinks.push({source: d, target: dd}))
        }
      })

      const transition = svg.transition()
        .duration(duration)

      update_nodes(source, gNode, nodes, dx, dy, transition, onClick, mouseover, mouseout, body)
      update_links(source, gLink, gdupLink, links, duplinks, dx, dy, transition)

      // Stash the old positions for transition.
      root_out.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // secondary function 

      function update_in(source) {

      const duration = d3.event && d3.event.altKey ? 2500 : 250;
      let nodes = root_in.descendants().reverse();
      root_in.sort(function(a, b) { return - b.data.value_out + a.data.value_out; }); //sort by incoming value
      
      let links = [];
      let duplinks = [];
      root_in.descendants().forEach((d,i) =>{
        if(d.children) {
          d.children.forEach(dd => links.push({source: d, target: dd}))
        }  
        if(d.dupes) {
          d.dupes.forEach(dd => duplinks.push({source: d, target: dd}))
        }
      })
      
      // Compute the new tree layout.

      my_tree(root_in, dx, dy, size)
      root_in.descendants().forEach(d=>{
        d.y = -d.y-dy/2.0-60;
        
      })

      const transition = svg.transition()
          .duration(duration)

          update_nodes(source, gNode, nodes, dx, dy, transition, onClick, mouseover, mouseout, body)
      update_links(source, gLink, gdupLink, links, duplinks, dx, dy, transition)

      // Stash the old positions for transition.
      root_in.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    update(root_out);
    update(root_in);
    console.log(root_out)
    console.log(root_in)
    
}