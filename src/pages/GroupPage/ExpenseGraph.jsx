import React, { useMemo } from 'react';
import './ExpenseGraph.css';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

/**
 * ExpenseGraph
 * Props:
 * - expenses: array of expense objects (must include createTime and userShare)
 * - userId: optional, not used currently but available
 *
 * The graph shows the user's share (positive = paid, negative = borrowed) over the most recent expenses.
 * It renders two stacked areas: positive values (green) and negative values (red).
 */
export default function ExpenseGraph({ expenses = [], userId }) {
  // Prepare data: take most recent 20 expenses sorted oldest->newest for the timeline
  const data = useMemo(() => {
    if (!Array.isArray(expenses) || expenses.length === 0) return [];
    const byDate = [...expenses].sort((a, b) => new Date(a.createTime) - new Date(b.createTime));
    const recent = byDate.slice(-24); // keep last 24 points
    return recent.map((e, i) => {
      const val = Number(e.userShare) || 0;
      const dateObj = e.createTime ? new Date(e.createTime) : null;
      const dateLabel = dateObj ? dateObj.toLocaleDateString() : '';
      const timeLabel = dateObj ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      const v = Number(val.toFixed(2));
      return {
        id: e.id || i,
        label: `${dateLabel} ${timeLabel}`, // full label for tooltip
        short: dateLabel, // short label for X axis ticks
        value: v,
        pos: v > 0 ? v : 0,
        neg: v < 0 ? v : 0,
      };
    });
  }, [expenses]);

  if (!data || data.length === 0) {
    return (
      <div className="expense-graph-empty">
        <div className="graph-placeholder">No data for graph</div>
      </div>
    );
  }

  return (
    <div className="expense-graph-wrapper">
      <div className="graph-header">
        <div className="graph-title">Recent activity</div>
        <div className="graph-sub">Paid (green) vs Borrowed (red)</div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#2ecc71" stopOpacity={0.06}/>
            </linearGradient>
            <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#e74c3c" stopOpacity={0.06}/>
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
          {/* use unique id on X axis and map ticks back to short labels so tooltip picks correct item */}
          <XAxis
            dataKey="id"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
            tickFormatter={(val) => {
              const found = data.find((d) => d.id === val);
              return found ? found.short : '';
            }}
          />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: 'rgba(18,17,35,0.98)', border: '1px solid rgba(255,255,255,0.04)', color: '#fff' }}
            formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
            labelFormatter={(label, payload) => {
              // payload[0].payload.label contains the full date+time label we created
              if (payload && payload[0] && payload[0].payload && payload[0].payload.label) {
                return payload[0].payload.label;
              }
              return label;
            }}
          />

          {/* Invisible line used to drive tooltip & precise dots for the actual value */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="transparent"
            dot={{ r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            isAnimationActive={false}
          />

          {/* Area for positive values */}
          <Area
            type="monotone"
            dataKey="pos"
            stroke="#2ecc71"
            fill="url(#colorPos)"
            dot={false}
            isAnimationActive={false}
          />

          {/* Area for negative values */}
          <Area
            type="monotone"
            dataKey="neg"
            stroke="#e74c3c"
            fill="url(#colorNeg)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
