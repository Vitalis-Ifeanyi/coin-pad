import React, { useContext } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { DarkModeContext } from "../context/DarkModeContext";

interface MiniChartProps {
  prices: number[];
  isPositive: boolean;
  width?: number;
  height?: number;
}

const MiniChart: React.FC<MiniChartProps> = ({
  prices,
  isPositive,
  width = 100,
  height = 40,
}) => {
  const { isDark } = useContext(DarkModeContext);
  const data = prices.map((p, i) => ({ price: p, index: i }));

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? "#16a34a" : isDark ? "#f87171" : "#dc2626"}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniChart;
