export default function my_tree(root, dx, dy, size)
{
  root.data.value_in = root.data.value_out
  root.x = 0
  root.y = 0

 
  function set_size(a){ //set node size based on % of parent value transferred
    if (a.parent) a.data.size = Math.min((a.data.value_in/a.parent.data.value_out)*a.parent.data.size, root.data.size) //size = % of parent size, but not bigger than root
    // a.data.size = Math.min((a.data.value_in/a.parent.data.value_out)*a.parent.data.size, root.data.size)
    else a.data.size = size //if root
    if(a.children) a.children.forEach(d=> set_size(d))

  }

  function move(a, shift) //move node and its children recursively
  {
    a.x += shift
    a.topx +=shift
    a.botx +=shift
    if (a.children) a.children.forEach(d=>move(d,shift))
  }

  function firstWalk(nodes){
    nodes.forEach((a,i)=>{
      a.y = root.y + dy*a.depth
      a.x = 0
      a.i = i //for testing only
      if(nodes[i-1])
      {
        let b= nodes[i-1]
        a.x = b.x + dx
      }
      a.topx = a.x + a.data.size/2.0 //adding node size 
      a.botx = a.x - a.data.size/2.0
    })
    secondWalk(nodes)
  }


  function secondWalk(nodes)
  {
    nodes.forEach((a,i)=>{
      if(nodes[i-1])
      {
        let b= nodes[i-1]
        if ((a.botx < b.topx + dx)){
          let shift = a.botx - b.topx - dx
          if (a.children && b.children && a.botx < b.topx + 2*dx) //if neighboring nodes children 
          {
            shift -= dx
          }
          move(a, -shift)
        }
      }
      if (a.parent){
        a.parent.topx = a.parent.children[0].topx
        a.parent.botx = a.parent.children[a.parent.children.length-1].botx
        a.parent.x = (a.parent.topx - a.parent.botx)/2.0 + a.parent.botx
      }
    })
  }

 
  set_size(root)
  const nodes = root.descendants().reverse()

  firstWalk(nodes)

   //move back the root
  move(root, -root.x)
  root.topx = root.x + root.data.size/2.0
  root.botx = root.x - root.data.size/2.0

  return root 
}