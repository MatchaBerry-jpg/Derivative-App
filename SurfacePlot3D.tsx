
import React, { useEffect, useRef } from 'react';

interface SurfacePlot3DProps {
  expression: string;
  point?: { x: number; y: number };
}

const SurfacePlot3D: React.FC<SurfacePlot3DProps> = ({ expression, point }) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!plotRef.current || !expression) return;

    try {
      const math = (window as any).math;
      const compiled = math.compile(expression);
      
      const size = 45;
      const range = 5;
      const xRange = math.range(-range, range, (range * 2) / size).toArray();
      const yRange = math.range(-range, range, (range * 2) / size).toArray();
      
      const zData: number[][] = [];
      for (let i = 0; i < yRange.length; i++) {
        zData[i] = [];
        for (let j = 0; j < xRange.length; j++) {
          try {
            const val = compiled.evaluate({ x: xRange[j], y: yRange[i] });
            zData[i][j] = typeof val === 'number' && isFinite(val) ? val : 0;
          } catch {
            zData[i][j] = 0;
          }
        }
      }

      const data: any[] = [{
        z: zData,
        x: xRange,
        y: yRange,
        type: 'surface',
        colorscale: [
          [0, '#A8C69F'],   // Matcha Green
          [0.5, '#FFD1DC'], // Pastel Pink
          [1, '#FFB7C5']    // Strawberry Pink
        ],
        contours: {
          z: {
            show: true,
            usecolormap: true,
            project: { z: true }
          }
        },
        lighting: {
            ambient: 0.7,
            diffuse: 0.8,
            specular: 0.3,
            roughness: 0.4
        },
        showscale: false
      }];

      if (point) {
        try {
          const zVal = compiled.evaluate(point);
          data.push({
            x: [point.x],
            y: [point.y],
            z: [zVal],
            mode: 'markers',
            type: 'scatter3d',
            marker: {
              size: 12,
              color: '#FFB7C5',
              symbol: 'circle',
              line: { color: 'white', width: 2 }
            },
            name: 'Slice Point'
          });
        } catch {}
      }

      const layout = {
        autosize: true,
        height: 600,
        margin: { l: 0, r: 0, b: 0, t: 0 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        scene: {
          xaxis: { 
            title: 'X', 
            gridcolor: '#E8F3E9',
            showbackground: false
          },
          yaxis: { 
            title: 'Y', 
            gridcolor: '#E8F3E9',
            showbackground: false
          },
          zaxis: { 
            title: 'Z', 
            gridcolor: '#E8F3E9',
            showbackground: false
          },
          camera: {
            eye: { x: 1.6, y: 1.6, z: 1.1 }
          }
        }
      };

      (window as any).Plotly.newPlot(plotRef.current, data, layout, { 
        responsive: true, 
        displayModeBar: false,
        scrollZoom: false 
      });
    } catch (e) {
      console.error("Plotly error:", e);
    }
  }, [expression, point]);

  return (
    <div className="w-full h-full min-h-[500px] relative">
      <div ref={plotRef} className="w-full h-full" />
      <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-[#A8C69F] uppercase tracking-widest border border-[#A8C69F]/20 shadow-sm">
        Drag to Rotate Surface
      </div>
    </div>
  );
};

export default SurfacePlot3D;
