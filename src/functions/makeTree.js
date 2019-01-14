import dataService from '@/services/fetchData';
import * as d3 from 'd3';
import my_tree from '@/functions/layout';

export async function makeTree (body, address) {

  var width = window.innerWidth

  const height = (window.innerHeight)*0.7

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

    var  margin = ({top: 50, right: 300, bottom: 50, left: 450})
    var dx = 25 //10
    var dy = 460 //280
    var size = 300

    function my(s, d) {

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

    //pan&zoom------------------------------------------------------------------------------
      

      var zoom = d3.zoom()
          .on("zoom", zoomFunction);

      function zoomFunction(){
        //svg.attr("transform", d3.event.transform)  
        let x = d3.event.transform.x + width/2
        let y = d3.event.transform.y + height/2
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
          .attr("class", "popup")
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
                      else 
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

      // Update the nodes…
      const node = gNode.selectAll("g.g_out")
        .data(nodes, d => d.id);

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append("g")
          .attr("transform", d => `translate(${source.y0},${source.x0})`)
          .attr("class", "g_out")
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0)

      const nodeEnter_link = nodeEnter.append("g")
          .on("click", d => onClick(d,d3.select(this)))
          .on("mouseover", d=> 
            {
              const text = nodeEnter_link.select('.tx_out')
              text.style('fill', 'blue')
              text.style('text-decoration', 'underline')
              const path = nodeEnter_link.select('path')
              path.attr('fill', 'blue')
            }
          )
          .on("mouseout", d=> 
            {
              const text = nodeEnter_link.selectAll('.tx_out')
              text.style('fill', 'black')
              text.style('text-decoration', 'none')
              const path = nodeEnter_link.selectAll('path')
              path.attr('fill', 'black')
            }
          )

      nodeEnter_link.append("rect")
          .attr("class", "node_rect_bg")
          .attr("y", d => -d.data.size/2.0)
          .attr("x", d => d.id ==0 ? -dy/2.0 : 0)
          .attr("height", d => d.data.size)
          .attr("width", dy/2)
          .attr("fill", "#F2F9FE")
          .attr("stroke-width", 1.5)

      nodeEnter_link.append("rect")
          .attr("class", "node_rect_link_click")
          .attr("y", d => -Math.max(d.data.size, dx)/2.0)
          .attr("x", d => d.id ==0 ? -60 : dy/2-60)
          .attr("height", d => Math.max(d.data.size, dx))
          .attr("width", 60)
          .attr("fill-opacity", "0")

      nodeEnter_link.append("rect")
          .attr("class", "node_rect_link")
          .attr("y", d => -d.data.size/2.0)
          .attr("x", d => d.id ==0 ? -60 : dy/2-60)
          .attr("height", d => d.data.size)
          .attr("width", 60)
          .attr("fill", 'orange')
          .attr("fill-opacity", d => {
            if (d.data.tx_out>0 && !d.children) return 1;
            if (d.children) return 0;
            return 0;
          })   

      nodeEnter_link.append("text")
          .attr("class", "tx_out")
          .attr("dy", "0.31em")
          .attr("text-anchor", "end")
          .attr("x", d => d.id==0 ? '-20' : dy/2.0-20)
          .text(d => d.data.tx_out ? `${d.data.tx_out}` : '')

      nodeEnter_link.append("text")
          .attr("class", "tx_in")
          .attr("dy", "0.31em")
          .attr("text-anchor", d => d.id==0 ? "end" : "start")
          .attr("x", d => d.id==0 ? '-5' : '5')
          .text(d => d.id==0 ? '' : `${Math.round((d.data.value_in/1000000000000000000)*100)/100}`)


      nodeEnter_link.append("text")
          .attr("class", "tx_in_ratio")
          .attr("dy", "0.31em")
          .attr("text-anchor", d => d.id==0 ? "end" : "start")
          .attr("x", 5)
          .attr("y", 10)
          .text(d => d.id==0 ? '' : `${Math.round((d.data.value_in/d.parent.data.value_out)*10000)/100}%`)


      nodeEnter_link.append("path")
          .attr("d","M7.39399 6.2781C6.87791 6.2781 6.41772 6.52403 6.12335 6.90411L3.65847 5.52727C3.71623 5.36146 3.7479 5.1826 3.7479 4.99815C3.7479 4.81184 3.71623 4.63485 3.65661 4.46717L6.11963 3.0922C6.41213 3.47414 6.87418 3.72193 7.39212 3.72193C8.27523 3.72193 8.99625 3.00277 8.99625 2.1178C8.99625 1.23283 8.27709 0.513672 7.39212 0.513672C6.50715 0.513672 5.78799 1.23283 5.78799 2.1178C5.78799 2.30411 5.81967 2.48297 5.87928 2.64878L3.41813 4.02375C3.12562 3.63995 2.66357 3.39402 2.14563 3.39402C1.26252 3.39402 0.541504 4.11318 0.541504 4.99815C0.541504 5.88313 1.26252 6.60228 2.1475 6.60228C2.66544 6.60228 3.12749 6.35449 3.42186 5.97069L5.88487 7.34752C5.82526 7.5152 5.79172 7.69592 5.79172 7.88223C5.79172 8.76534 6.51088 9.48636 7.39585 9.48636C8.28082 9.48636 8.99998 8.76721 8.99998 7.88223C8.99998 6.99726 8.27896 6.2781 7.39399 6.2781ZM7.39399 1.01857C8.00136 1.01857 8.49508 1.51229 8.49508 2.11966C8.49508 2.72703 8.00136 3.22076 7.39399 3.22076C6.78661 3.22076 6.29289 2.72703 6.29289 2.11966C6.29289 1.51229 6.78848 1.01857 7.39399 1.01857ZM2.1475 6.09925C1.54013 6.09925 1.0464 5.60552 1.0464 4.99815C1.0464 4.39078 1.54013 3.89706 2.1475 3.89706C2.75487 3.89706 3.24859 4.39078 3.24859 4.99815C3.24859 5.60552 2.753 6.09925 2.1475 6.09925ZM7.39399 8.98146C6.78661 8.98146 6.29289 8.48774 6.29289 7.88037C6.29289 7.273 6.78661 6.77928 7.39399 6.77928C8.00136 6.77928 8.49508 7.273 8.49508 7.88037C8.49508 8.48774 8.00136 8.98146 7.39399 8.98146Z")
          .attr("transform", d => `scale(1.0) translate(${d.id!=0 ? (dy/2.0-15) : -15}, -5)`)
          .attr("fill-opacity", d => {
            if (d.data.tx_out>0) return 1;
            else return 0;
          })

      const nodeEnter_node = nodeEnter.append("g")
          .on("click", d => body.update(body, d.data._id))
          .on("mouseover", d=> 
            {
              const text = nodeEnter_node.select('._id')
              text.style('fill', 'blue')
              text.style('text-decoration', 'underline')
              setTimeout(mouseover(d),3000)
            }
          )
          .on("mouseout", d=> 
            {
              const text = nodeEnter_node.select('._id')
              text.style('fill', 'black')
              text.style('text-decoration', 'none')
              mouseout(d)
            }
          )

      nodeEnter_node.append("text")
          .attr("class", "_id")
          .attr("dy", "0.31em")
          .attr("x", d => d.id==0 ? -dy/4.0-5 : dy/4.0-5)
          .attr("text-anchor", "middle")
          .text(d => 
          {
            if (d.data.alias != null){ return d.data.alias} else 
          { return `[${d.data._id.substr(0,7)}..${d.data._id.substr(-7,7)}]`}
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
      const link = gLink.selectAll("path.path_out")
        .data(links, d => d.target.id)
        
      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().append("path")
          .attr("class", "path_out")
          .attr("stroke-width", d => Math.max(d.target.data.size, 0.3))
          .on("mouseover", d=> console.log(d.target.data.size))
          .attr("d", d => {
            const o = {x: (source.x0), y: source.y0+dy/2.0};
            return diagonal({source: o, target: o}); 
          });
    
      // Transition links to their new position.
      link.merge(linkEnter).transition(transition)
          .attr("d", d=> 
            {
              let y2 = 0;
              if (d.source.id ==0) {y2 = d.source.y;} else {y2 = d.source.y+dy/2.0;}
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
      const duplink = gdupLink.selectAll("path.dup_path_out")
        .data(duplinks, d=> d.target.id+10000*d.source.id)

      // Enter any new links at the parent's previous position.
      const duplinkEnter = duplink.enter().append("path")
          .attr("class", "dup_path_out")
          .attr("d", d => {
            const o = {x: source.x0, y: source.y0+dy/2.0};
            return vertical({source: o, target: o});
          });

      duplink.merge(duplinkEnter).transition(transition)
          .attr("d", d=> {
            let y2 = 0;
            if (d.source.id ==0) {y2 = d.source.y;} else {y2 = d.source.y+dy/2.0;}
            if (d.source.depth >= d.target.depth) {return vertical({source: {x:d.source.x,y:y2}, target: {x:d.target.x,y:d.target.y}})}
            else {return diagonal({source: {x:d.source.x,y:y2}, target: {x:d.target.x,y:d.target.y}})}
            });
        
      // Transition exiting nodes to the parent's new position.
      duplink.exit().transition(transition).remove()
          .attr("d", d => {
            const o = {x: source.x, y: source.y+dy/2.0};
            return vertical({source: o, target: o});
          });

      // Stash the old positions for transition.
      root_out.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // secondary function 

      function update_in(source) {

      const duration = d3.event && d3.event.altKey ? 2500 : 250;
      let nodes_in = root_in.descendants().reverse();
      root_in.sort(function(a, b) { return - b.data.value_out + a.data.value_out; }); //sort by incoming value
      
      let links_in = [];
      let duplinks_in = [];
      root_in.descendants().forEach((d,i) =>{
        if(d.children) {
          d.children.forEach(dd => links_in.push({source: d, target: dd}))
        }  
        if(d.dupes) {
          d.dupes.forEach(dd => duplinks_in.push({source: d, target: dd}))
        }
      })
      
      // Compute the new tree layout.
      //tree(root);
      
      my_tree(root_in, dx, dy, size)
      root_in.descendants().forEach(d=>{
        d.y = -d.y-dy/2.0-60; 
      })
      
      const transition = svg.transition()
          .duration(duration)

      // Update the nodes…
      const node_in = gNode.selectAll("g.g_in")
        .data(nodes_in, d => d.id);
      
      // Enter any new nodes at the parent's previous position.
      const nodeEnter_in = node_in.enter().append("g")
          .attr("class", "g_in")
          .attr("transform", d => `translate(${source.y0},${source.x0})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0)

          const nodeEnter_in_link = nodeEnter_in.append("g")
          .on("click", d => onClick(d,d3.select(this)))
          .on("mouseover", d=> 
            {
              const text = nodeEnter_in_link.select('.tx_out')
              text.style('fill', 'blue')
              text.style('text-decoration', 'underline')
              const path = nodeEnter_in_link.select('path')
              path.attr('fill', 'blue')
            }
          )
          .on("mouseout", d=> 
            {
              const text = nodeEnter_in_link.selectAll('.tx_out')
              text.style('fill', 'black')
              text.style('text-decoration', 'none')
              const path = nodeEnter_in_link.selectAll('path')
              path.attr('fill', 'black')
            }
          )

      nodeEnter_in_link.append("rect")
          .attr("class", "node_rect_bg")
          .attr("y", d => -d.data.size/2.0)
          .attr("x", d => d.id ==0 ? -dy/2.0 : -dy/2.0)
          .attr("height", d => d.data.size)
          .attr("width", dy/2)
          .attr("fill", "#F2F9FE")
          .attr("stroke-width", 1.5)
          .attr("opacity", d=> d.id == 0 ? 0: 1 )

      nodeEnter_in_link.append("rect")
          .attr("class", "node_rect_link_click")
          .attr("y", d => -Math.max(d.data.size, dx)/2.0)
          .attr("x", d => d.id ==0 ? 0 : -dy/2.0)
          .attr("height", d => Math.max(d.data.size, dx))
          .attr("width", 60)
          .attr("fill-opacity", "0")

      nodeEnter_in_link.append("rect")
          .attr("class", "node_rect_link")
          .attr("y", d => -d.data.size/2.0)
          .attr("x", d => d.id ==0 ? 0 : -dy/2.0)
          .attr("height", d => d.data.size)
          .attr("width", 60)
          .attr("fill", 'orange')
          .attr("fill-opacity", d => {
            if (d.data.tx_in>0 && !d.children) return 1;
            else return 0;
          })  
          
      nodeEnter_in_link.append("text")
          .attr("class", "tx_out")
          .attr("dy", "0.31em")
          .attr("text-anchor", d => d.id==0 ? "end" :"start" )
          
          .attr("x", d => d.id==0 ? '45' : -dy/2.0+25)
          .text(d => d.data.tx_in ? `${d.data.tx_in}` : '')

      nodeEnter_in_link.append("text")
          .attr("class", "tx_in")
          .attr("dy", "0.31em")
          .attr("text-anchor", d => d.id==0 ? "start" : "end")
          .attr("x", d => d.id==0 ? '-20' : -5)
          .text(d => d.id==0 ? '' : `${Math.round((d.data.value_out/1000000000000000000)*100)/100}`)

      nodeEnter_in_link.append("text")
          .attr("class", "tx_in_ratio")
          .attr("dy", "0.31em")
          .attr("text-anchor", d => d.id==0 ? "start" : "end")
          .attr("x", d => d.id==0 ? -20-dy/2.0 : -5)
          .attr("y", 10)
          .text(d => d.id==0 ? '' : `${Math.round((d.data.value_out/d.parent.data.value_in)*10000)/100}%`)

      nodeEnter_in_link.append("path")
          .attr("d","M7.39399 6.2781C6.87791 6.2781 6.41772 6.52403 6.12335 6.90411L3.65847 5.52727C3.71623 5.36146 3.7479 5.1826 3.7479 4.99815C3.7479 4.81184 3.71623 4.63485 3.65661 4.46717L6.11963 3.0922C6.41213 3.47414 6.87418 3.72193 7.39212 3.72193C8.27523 3.72193 8.99625 3.00277 8.99625 2.1178C8.99625 1.23283 8.27709 0.513672 7.39212 0.513672C6.50715 0.513672 5.78799 1.23283 5.78799 2.1178C5.78799 2.30411 5.81967 2.48297 5.87928 2.64878L3.41813 4.02375C3.12562 3.63995 2.66357 3.39402 2.14563 3.39402C1.26252 3.39402 0.541504 4.11318 0.541504 4.99815C0.541504 5.88313 1.26252 6.60228 2.1475 6.60228C2.66544 6.60228 3.12749 6.35449 3.42186 5.97069L5.88487 7.34752C5.82526 7.5152 5.79172 7.69592 5.79172 7.88223C5.79172 8.76534 6.51088 9.48636 7.39585 9.48636C8.28082 9.48636 8.99998 8.76721 8.99998 7.88223C8.99998 6.99726 8.27896 6.2781 7.39399 6.2781ZM7.39399 1.01857C8.00136 1.01857 8.49508 1.51229 8.49508 2.11966C8.49508 2.72703 8.00136 3.22076 7.39399 3.22076C6.78661 3.22076 6.29289 2.72703 6.29289 2.11966C6.29289 1.51229 6.78848 1.01857 7.39399 1.01857ZM2.1475 6.09925C1.54013 6.09925 1.0464 5.60552 1.0464 4.99815C1.0464 4.39078 1.54013 3.89706 2.1475 3.89706C2.75487 3.89706 3.24859 4.39078 3.24859 4.99815C3.24859 5.60552 2.753 6.09925 2.1475 6.09925ZM7.39399 8.98146C6.78661 8.98146 6.29289 8.48774 6.29289 7.88037C6.29289 7.273 6.78661 6.77928 7.39399 6.77928C8.00136 6.77928 8.49508 7.273 8.49508 7.88037C8.49508 8.48774 8.00136 8.98146 7.39399 8.98146Z")
          .attr("transform", d => `scale(1.0) translate(${d.id!=0 ? 5-dy/2.0 : 5}, -5)`)
          .attr("fill-opacity", d => {
            if (d.data.tx_in>0 && !d.children) return 1;
            else return 0;
          }) 

      const nodeEnter_in_node = nodeEnter_in.append("g")
          .on("click", d => body.update(body, d.data._id))
          .on("mouseover", d=> 
            {
              const text = nodeEnter_in_node.select('._id')
              text.style('fill', 'blue')
              text.style('text-decoration', 'underline')
              setTimeout(mouseover(d),3000)
            }
          )
          .on("mouseout", d=> 
            {
              const text = nodeEnter_in_node.select('._id')
              text.style('fill', 'black')
              text.style('text-decoration', 'none')
              mouseout(d)
            }
          )

      nodeEnter_in_node.append("text")
          .attr("class", "_id")
          .attr("dy", "0.31em")
          .attr("x", d => d.id==0 ? -dy/4.0-5 : -dy/4.0+5)
          .attr("y", 0)
          .attr("text-anchor", "middle")
          .text(d => 
          {
            if (d.data.alias != null){ return d.data.alias} else 
          { return `[${d.data._id.substr(0,7)}..${d.data._id.substr(-7,7)}]`}
          })
          .attr("opacity", d=> d.id == 0 ? 0 : 1)

      // Transition nodes to their new position.
      const nodeUpdate_in = node_in.merge(nodeEnter_in).transition(transition)
          .attr("transform", d => `translate(${d.y},${d.x})`)
          .attr("fill-opacity", 1)
          .attr("stroke-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      const nodeExit_in = node_in.exit().transition(transition).remove()
          .attr("transform", d => `translate(${source.y},${source.x})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0);

      // Update the links…
      const link_in = gLink.selectAll("path.path_in")
        .data(links_in, d => d.target.id)

      // Enter any new links at the parent's previous position.
      const linkEnter_in = link_in.enter().append("path")
          .attr("class", "path_in")
          .attr("stroke-width", d => Math.max(d.target.data.size, 0.3))
          .attr("d", d => {
            const o = {x: (source.x0), y: source.y0-dy/2.0};
            return diagonal({source: o, target: o}); 
          });
      
      // Transition links to their new position.
      link_in.merge(linkEnter_in).transition(transition)
          .attr("d", d=> 
            {
              let y2 = 0;
              if (d.source.id ==0) {y2 = d.source.y;} else {y2 = d.source.y-dy/2.0;}
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
      link_in.exit().transition(transition).remove()
          .attr("d", d => {
            const o = {x: (source.x), y: source.y};
            return diagonal({source: o, target: o});
          });

      // Update the links…
      const duplink_in = gdupLink.selectAll("path.dup_path_in")
      //  .data(duplinks_in, d=> d.target.id)
        .data(duplinks_in, d=> d.target.id+10000*d.source.id)
      // .attr("stroke-width", d => d.target.id+1)

      // Enter any new links at the parent's previous position.
      const duplinkEnter_in = duplink_in.enter().append("path")
          .attr("class", "dup_path_in")
          .attr("d", d => {
            const o = {x: source.x0, y: source.y0};
            return vertical({source: o, target: o});
          });

      // Transition links to their new position.
      duplink_in.merge(duplinkEnter_in).transition(transition)
          .attr("d", d=> {
            let y2 = 0;
            if (d.source.id ==0) {y2 = d.source.y;} else {y2 = d.source.y-dy/2.0;}
            if (d.source.depth >= d.target.depth) {return vertical({source: {x:d.source.x,y:y2}, target: {x:d.target.x,y:d.target.y}})}
            else {return diagonal({source: {x:d.source.x,y:y2}, target: {x:d.target.x,y:d.target.y}})}
            });

      // Transition exiting nodes to the parent's new position.
      duplink_in.exit().transition(transition).remove()
          .attr("d", d => {
            const o = {x: source.x, y: source.y};
            return vertical({source: o, target: o});
          });

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