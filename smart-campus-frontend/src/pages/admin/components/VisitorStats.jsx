import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { toast } from 'react-toastify';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const VisitorStats = () => {
  const [visitors, setVisitors] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await api.get('/visitors');
      const data = response.data.data;
      setVisitors(data);

      // Process data for the chart (grouped by month/year)
      const grouped = data.reduce((acc, visitor) => {
        const date = new Date(visitor.entryTime);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthYear] = (acc[monthYear] || 0) + 1;
        return acc;
      }, {});

      const formattedData = Object.keys(grouped).sort().map(key => ({
        name: key,
        visitors: grouped[key]
      }));

      setChartData(formattedData);
    } catch (error) {
      toast.error('Failed to load visitors');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Visitor Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card text-center bg-gradient-to-br from-secondary to-green-500 text-white p-6">
          <div className="text-4xl mb-2">👥</div>
          <div className="text-2xl font-bold">{visitors.length}</div>
          <div className="opacity-80">Total Visitors</div>
        </div>
      </div>

      <div className="card p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Visitors Over Time (Month/Year)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="visitors" stroke="#10b981" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Visitor Log & Feedback</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-color">
                <th className="p-4 font-semibold text-text-muted">ID</th>
                <th className="p-4 font-semibold text-text-muted">Name</th>
                <th className="p-4 font-semibold text-text-muted">Entry Time</th>
                <th className="p-4 font-semibold text-text-muted">Exit Time</th>
                <th className="p-4 font-semibold text-text-muted">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length > 0 ? visitors.map(v => (
                <tr key={v.id} className="border-b border-border-color">
                  <td className="p-4">{v.id}</td>
                  <td className="p-4">{v.name}</td>
                  <td className="p-4">{new Date(v.entryTime).toLocaleString()}</td>
                  <td className="p-4">{v.exitTime ? new Date(v.exitTime).toLocaleString() : 'Currently Active'}</td>
                  <td className="p-4">{v.feedback || '-'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-text-muted">No visitors logged.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitorStats;
