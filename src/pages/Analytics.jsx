import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { formatDisplayDate } from '../utils/formatDate';
import { getSuggestions } from '../utils/suggestions';
import { isOfferStatus } from '../constants/statuses';

const COLORS = ['#8884d8', '#82ca9d', '#ff6b6b']; // Custom colors for Pie Chart

function Analytics({ jobs }) {
  const [chartType, setChartType] = useState('bar'); // toggle state

  const totalApplied = jobs.length;
  const appliedCount = jobs.filter((job) => job.status === 'Applied').length;
  const interviewCount = jobs.filter((job) => job.status === 'Interview').length;
  const rejectedCount = jobs.filter((job) => job.status === 'Rejected').length;
  const offerCount = jobs.filter((job) => isOfferStatus(job.status)).length;

  const data = [
    { name: 'Interviews', value: interviewCount },
    { name: 'Rejections', value: rejectedCount },
    { name: 'Offers', value: offerCount },
  ];

  // 'YYYY-MM-DD' strings sort correctly as plain text
  const jobDates = jobs
    .map((job) => job.date)
    .filter(Boolean)
    .sort();

  const earliestDate = jobDates.length ? formatDisplayDate(jobDates[0]) : 'N/A';
  const latestDate = jobDates.length ? formatDisplayDate(jobDates[jobDates.length - 1]) : 'N/A';

  const toggleChart = () => {
    setChartType((prev) => (prev === 'bar' ? 'pie' : 'bar'));
  };

  // Interview trend data, grouped by day and kept in date order
  const interviewCountsByDay = jobs
    .filter((job) => job.status === 'Interview' && job.date)
    .reduce((acc, job) => {
      acc[job.date] = (acc[job.date] || 0) + 1;
      return acc;
    }, {});

  const interviewTrendData = Object.keys(interviewCountsByDay)
    .sort()
    .map((day) => ({ date: formatDisplayDate(day), count: interviewCountsByDay[day] }));

  const suggestions = getSuggestions({
    totalApplied,
    appliedCount,
    interviewCount,
    rejectedCount,
    offerCount,
  });

  return (
    <div style={{ padding: '20px' }}>
      <div className="analytics-section">
        <h2>📊 Job Application Summary</h2>
        <button onClick={toggleChart} style={{ marginBottom: '10px' }}>
          Switch to {chartType === 'bar' ? 'Pie Chart' : 'Bar Chart'}
        </button>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => (value === 0 || value === totalApplied ? value : '')}
                domain={[0, Math.max(totalApplied, 1)]}
                allowDecimals={false}
              >
                <Label
                  value="Total Applied"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: 'middle', fill: '#666' }}
                />
              </YAxis>
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>

        <div style={{ marginTop: '20px' }} className="analytics-stats">
          <p>
            📩 <strong>Total Jobs Applied:</strong> {totalApplied}
          </p>
          <p>
            🎯 <strong>Interviews:</strong> {interviewCount}
          </p>
          <p>
            ❌ <strong>Rejections:</strong> {rejectedCount}
          </p>
          <p>
            🏆 <strong>Offers:</strong> {offerCount}
          </p>
          <p>
            🗓️ <strong>Applications Date Range:</strong> From {earliestDate} to {latestDate}
          </p>
        </div>
      </div>

      <div className="analytics-section">
        <h2>📈 Interview Growth Trend</h2>
        {interviewTrendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={interviewTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No interview data available to show growth trend.</p>
        )}
      </div>
      {suggestions.length > 0 && (
        <div
          style={{
            marginTop: '30px',
            padding: '15px',
            border: '1px solid #ccc',
            backgroundColor: '#f5f5f5',
          }}
        >
          <h3>🧠 Smart Suggestions</h3>
          <ul>
            {suggestions.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Analytics;
