import { useRef,useEffect } from 'react';
import Container from './Container';
import { createRoot } from 'react-dom/client';
import * as d3 from 'd3';


const ContainerTree = ({ data }) => {

    const svgRef = useRef(null);
    const treeGroupRef = useRef(null);
    const root = d3.hierarchy(data);
    const linksRef = useRef([]);  

  

    const renderLinks = () => {
      // Clear all links and render new ones    
      const links = treeGroupRef.current.selectAll(".link")
        .data(root.links())
        .enter()

        //Clear all links


      links.each(function (d) {
        const link = d3.select(this);
        const source = d.source;
        const target = d.target;
        const [sourceX, sourceY] = [source.x + 150, source.y + 200];
        const [targetX, targetY] = [target.x + 150, target.y];

        const path = `M${sourceX},${sourceY}L${targetX},${targetY}`;

        // Check if link with source and target already exists
      

        // If link already exists for the given path, update it, otherwise create a new one

        if(linksRef.current.includes(`${source.data.name}->${target.data.name}`)){
          // find the link and update it
          const existingLink = treeGroupRef.current.selectAll(`path[source="${source.data.name}"][target="${target.data.name}"]`);
          existingLink.attr("d", path).attr("fill", "none").attr("stroke", "blue");
        }
        else{
          console.log('Does not exist')
          link.append("path").attr("d", path).attr("fill", "none").attr("stroke", "blue").attr("source", source.data.name).attr("target", target.data.name);
          linksRef.current.push(`${source.data.name}->${target.data.name}`);

        }
        
      })
    }

    useEffect(() => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const svg = d3.select(svgRef.current);


        // Calculate max number of nodes on a level
        const maxNodes = Math.max(...root.descendants().map((d) => d.depth));      
          

        const treeLayout = d3.tree().size([screenWidth,screenHeight]).nodeSize([200,300]).separation((a, b) => a.parent === b.parent ? 2 : 1);
         treeGroupRef.current = svg.append("g");
      
        
        // Center the tree        
        treeLayout(root);
       
        // Center the tree
        treeGroupRef.current.attr("transform", `translate(${screenWidth/6 + maxNodes*300 }, ${screenHeight / 4})`);

        const nodes = treeGroupRef.current
          .selectAll(".node")
          .data(root.descendants())
          .enter()
    
         // Render custom React component for each node
        nodes.each(function (d) {
            const node = d3.select(this);
            const reactContainer = document.createElement('div');
            const reactRoot = createRoot(reactContainer);
            reactRoot.render(<Container
              renderLinks={renderLinks}
              nodeRef={node} data={d} />);
          });

          renderLinks();

          return () => {
            treeGroupRef.current.selectAll(".node").each(function (d) {
              const node = d3.select(this);
              const reactContainer = node.select('div');
              const reactRoot = reactContainer._reactRootContainer;
              reactRoot.unmountComponentAtNode(reactContainer);
            });
            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove();
          }
      }, []);

    
      

    return (
        <>
          <svg 
          width={window.innerWidth}
            height={window.innerHeight}
          ref={svgRef}>
            
          </svg>
        </>
    );
}

export default ContainerTree;