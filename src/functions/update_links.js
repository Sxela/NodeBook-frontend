import * as d3 from 'd3';

var diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
var vertical = d3.linkVertical().x(d => d.y).y(d => d.x)

export function update_links(source, gLink, gdupLink, links, duplinks, dx, dy, transition)
{
if(source.data.type == 'out')
{
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
}
else
{
    // Update the links…
    const link_in = gLink.selectAll("path.path_in")
    .data(links, d => d.target.id)
    
  

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
    .data(duplinks, d=> d.target.id+10000*d.source.id)
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
}  
}