
import React, { useMemo } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import { DataPoint } from '../types';

interface FunctionChartProps {
  data: DataPoint[];
  expression: string;
}

const FunctionChart: React.FC<FunctionChartProps> = ({ data, expression }) => {
  const domain = useMemo(() => {
    if (!data.length) return [0, 0];
    const ys = data.map(d => d.y).filter(y => !isNaN(y) && isFinite(y));
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    const padding = (max - min) * 0.1 || 1;
    return [min - padding, max + padding];
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 border border-[#FADADD] p-4 rounded-2xl shadow-xl backdrop-blur-md">
          <p className="text-[#E89393] text-xs font-bold uppercase mb-2">Coordinates</p>
          <div className="flex flex-col gap-1">
            <p className="text-[#709078] font-mono text-lg font-bold">x = {label.toFixed(4)}</p>
            <p className="text-[#E89393] font-mono text-lg font-bold">y = {payload[0].value.toFixed(4)}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[500px] bg-white border-4 border-[#D0E1D4] rounded-[3rem] overflow-hidden p-8 shadow-sm relative group">
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ 
        backgroundImage: `radial-gradient(#8FB996 1px, transparent 1px)`, 
        backgroundSize: '30px 30px' 
      }}></div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="matchaBerry" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FADADD" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#D0E1D4" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="5 5" stroke="#F1F5F2" vertical={false} />
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={['dataMin', 'dataMax']} 
            stroke="#B6D7A8" 
            tick={{ fill: '#709078', fontSize: 13, fontWeight: 600 }}
            tickFormatter={(val) => val.toFixed(1)}
          />
          <YAxis 
            stroke="#B6D7A8" 
            tick={{ fill: '#709078', fontSize: 13, fontWeight: 600 }}
            tickFormatter={(val) => val.toFixed(1)}
            domain={domain}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#E89393" strokeWidth={2} strokeDasharray="3 3" />
          <ReferenceLine x={0} stroke="#8FB996" strokeWidth={2} strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="y"
            stroke="#8FB996"
            strokeWidth={5}
            fillOpacity={1}
            fill="url(#matchaBerry)"
            animationDuration={2000}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="absolute top-8 right-10 pointer-events-none">
          <div className="px-5 py-2 bg-[#D0E1D4] rounded-2xl text-[#2D3A30] text-sm font-bold border-2 border-white shadow-sm">
              {expression || 'y = f(x)'}
          </div>
      </div>
    </div>
  );
};

export default FunctionChart;
