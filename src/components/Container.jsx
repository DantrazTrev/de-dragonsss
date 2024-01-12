import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Container = ({ data, nodeRef,renderLinks }) => {
  const containerRef = useRef(null);

  const renderContainer = () => {
    const g = d3.create('svg:g');
    containerRef.current = g.node();
    g.attr('transform', `translate(${data.x}, ${data.y})`);


    // Rectangle Container
     g.append('svg:rect')
      .attr('width', 300)
      .attr('height', 200)
      .attr('fill', 'transparent')
      .attr('stroke', 'black')
      .attr('rx', 10)
      .attr('ry', 10);

    // Title
     g.append('svg:text')
      .attr('x', 50)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bolder')
      .attr('dominant-baseline', 'central')
      .text(data.data.name);


      const dragHandler = d3.drag()
      .on('start', function () {
        d3.select(this).raise().classed('active', true);
      })
      .on('drag', function (event) {


        const [currentX, currentY] = d3.select(this).attr('transform').replace('translate(', '').replace(')', '').split(',');
        const relativePosition = {
          x: Number(currentX) + event.dx,
          y: Number(currentY) + event.dy
        };


        d3.select(this).attr('transform', `translate(${relativePosition.x}, ${relativePosition.y})`);
        
        // Update tree data
        data.x = relativePosition.x;
        data.y = relativePosition.y;

       renderLinks()
        
      })
      .on('end', function () {
        d3.select(this).classed('active', false);
      });

      g.call(dragHandler);

      // Elements Container
     g.append('svg:g')
      .attr('id', 'elements');

    nodeRef.append(() => g.node());

    
  };

  const renderElements = () => {
    if(!containerRef.current) return;
    const elements = d3.select(containerRef.current).select('#elements');

    data.data.elements.forEach((element, index) => {
      renderElement(elements, element, index);
    });
  };

  const renderElement = (parent, element, index) => {
    const g = parent.append('svg:g')
      .attr('id', element.name)
      .attr('transform', `translate(${(index * 80) + 20}, 100)`)
      .attr('width', 60)
      .attr('height', 60);

    const circleRadius = 20;
    if (element.image) {

      // Render image
      g.append('svg:image')
        .attr('xlink:href', element.image)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', circleRadius * 2)
        .attr('height', circleRadius * 2);
    } else {
      // Render circle
      g.append('svg:circle')
        .attr('cx', circleRadius)
        .attr('cy', 10)
        .attr('r', circleRadius)
        .attr('stroke', 'purple')
        .attr('fill', 'purple');

            // Render Label
     g.append('svg:text')
     .attr('x', circleRadius)
     .attr('y', 40)
     .attr('font-size', '10px')
     .attr('font-weight', 'bold')
     .attr('text-anchor', 'middle')
     .attr('dominant-baseline', 'central')
     .text(element.name);
    }



    const dragHandler = d3.drag()
      .on('start', function () {
        d3.select(this).raise().classed('active', true);
      })
      .on('drag', function (event) {
        const container = containerRef.current.select('rect');
        const containerRect = container.node().getBoundingClientRect();
        const [currentX, currentY] = d3.select(this).attr('transform').replace('translate(', '').replace(')', '').split(',');
        const relativePosition = {
          x: Number(currentX) + event.dx,
          y: Number(currentY) + event.dy
        };

        const boundedPosition = {
          x: Math.min(Math.max(relativePosition.x, 0), containerRect.width - circleRadius * 2),
          y: Math.min(Math.max(relativePosition.y, circleRadius / 2), containerRect.height - circleRadius * 2 - 10),
        };
        d3.select(this).attr('transform', `translate(${boundedPosition.x}, ${boundedPosition.y})`);
      });

    g.call(dragHandler);
  };

  useEffect(() => {
    renderContainer();
    renderElements();
  }, [data.x, data.y]);

  return <></>;
};

export default Container;
