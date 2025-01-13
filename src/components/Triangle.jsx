import React, { useEffect, useRef } from 'react';

const Triangle = ({ width = 250, height = 250, color = 'blue', style={} }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set the fill color
      ctx.fillStyle = color;

      // Draw the downward-facing triangle
      ctx.beginPath();
      ctx.moveTo(width / 2, height); // Bottom vertex (center bottom)
      ctx.lineTo(0, 0); // Top-left vertex (top-left corner)
      ctx.lineTo(width, 0); // Top-right vertex (top-right corner)
      ctx.closePath();
      ctx.fill();
    }
  }, [width, height, color]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ padding: 0, margin: 0, ...style }} />;
};

export default Triangle;
