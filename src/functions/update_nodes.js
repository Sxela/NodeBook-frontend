      
import * as d3 from 'd3';
export function update_nodes(source, gNode, nodes, dx, dy, transition, onClick, mouseover, mouseout, body)
{ 

if (source.data.type == 'out')
{

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
        .on("click", d => {
            body.$router.push(d.data._id)
            body.update(body, d.data._id)
        })
      .on("mouseover", d=> 
        {
          setTimeout(mouseover(d),3000)
        }
      )
      .on("mouseout", d=> 
        {
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
}
else
{
    // Update the nodes…
    const node_in = gNode.selectAll("g.g_in")
    .data(nodes, d => d.id);
  

  // Enter any new nodes at the parent's previous position.
  const nodeEnter_in = node_in.enter().append("g")
      .attr("class", "g_in")
      .attr("transform", d => `translate(${source.y0},${source.x0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)


      const nodeEnter_in_link = nodeEnter_in.append("g")
      .on("click", d => onClick(d,d3.select(this)))

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
        .on("click", d => {
            body.$router.push(d.data._id)
            body.update(body, d.data._id)
        })
      .on("mouseover", d=> 
        {
          setTimeout(mouseover(d),3000)
        }
      )
      .on("mouseout", d=> 
        {
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
}

}
