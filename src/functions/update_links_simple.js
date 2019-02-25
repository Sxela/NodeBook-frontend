import * as d3 from 'd3';

var diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
var vertical = d3.linkVertical().x(d => d.y).y(d => d.x)

export function update_links_simple(source, gLink, gdupLink, links, duplinks, dx, dy, transition)
{
  links.forEach(d=>{

    d.link ={ //setting up link data
      class: '', 
      stroke_width:0,
      source:{}, //source coords
      transition:{}, //transition target coords
      exit:{} //exit coords
    };

    d.link.stroke_width = Math.max(d.target.data.size, 0.3)

    var shift = 0;
    if (source.data.type == 'out') {
      d.link.class = 'path_out'
      shift = dy/2.0
    }
    else {
      d.link.class = 'path_in'
      shift = -dy/2.0
    }

    const o = {x: (source.x0), y: source.y0+shift};
    d.link.source = diagonal({source: o, target: o})

    let y2 = 0;
    if (d.source.id ==0) {y2 = d.source.y;} else {y2 = d.source.y+shift;}
    let x2 = d.source.x - d.source.data.size/2.0 + d.target.data.size/2.0
    d.target.parent.children.forEach((a,i)=>{
      if (i > d.target.parent.children.findIndex(item => item == d.target))
      {
          x2+= a.data.size
      }
    })
    d.link.transition = diagonal({source: {x:x2,y:y2}, target: {x:d.target.x,y:d.target.y}})

    const o2 = {x: (source.x), y: source.y};
    d.link.exit = diagonal({source: o2, target: o2});
  })

  var link;
  if(source.data.type == 'out')
  {
    link = gLink.selectAll("path.path_out")
    .data(links, d => d.target.id)
  }
  else
  {
    link = gLink.selectAll("path.path_in")
    .data(links, d => d.target.id)
  }    
    
  // Enter any new links at the parent's previous position.
  const linkEnter = link.enter().append("path")
    .attr("class", d => d.link.class)
    .attr("stroke-width", d => d.link.stroke_width)
    .attr("d", d => d.link.source); 
   
  // Transition links to their new position.
  link.merge(linkEnter).transition(transition)
    .attr("d", d=> d.link.transition)

  // Transition exiting nodes to the parent's new position.
  link.exit().transition(transition).remove()
    .attr("d", d => d.link.exit)
}