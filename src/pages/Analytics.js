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
  PieChart, Pie, Cell, Legend,LineChart, Line
} from 'recharts';
import { formatDisplayDate } from '../utils/FormatDate';

const COLORS = ['#8884d8', '#82ca9d', '#ff6b6b']; // Custom colors for Pie Chart

function Analytics({ jobs }) {
  const [chartType, setChartType] = useState('bar'); // toggle state

  const totalApplied = jobs.length;
  const interviewCount = jobs.filter(job => job.status === 'Interview').length;
  const rejectedCount = jobs.filter(job => job.status === 'Rejected').length;
  const offerCount = jobs.filter(job => job.status === 'Offer').length;

  const data = [
    { name: 'Interviews', value: interviewCount },
    { name: 'Rejections', value: rejectedCount },
    { name: 'Offers', value: offerCount },
  ];

  console.log('Analytics chart data:', data);
  const jobDates = jobs
  .filter(job => job.date) // filter out jobs with missing dates
  .map(job => new Date(job.date))
  .sort((a, b) => a - b);

  const earliestDate = jobDates.length ? formatDisplayDate(jobDates[0].toISOString()) : 'N/A';
  const latestDate = jobDates.length ? formatDisplayDate(jobDates[jobDates.length - 1].toISOString()) : 'N/A';

  const toggleChart = () => {
    setChartType(prev => (prev === 'bar' ? 'pie' : 'bar'));
  };

  // Interview trend data
  const interviewJobs = jobs.filter(job => job.status === 'Interview' && job.date);

  const interviewTrendData = interviewJobs.reduce((acc, job) => {
  const date = formatDisplayDate(job.date);
  const existing = acc.find(item => item.date === date);
  if (existing) {
    existing.count += 1;
  } else {
    acc.push({ date, count: 1 });
  }
  return acc;
  }, []);

    // Smart suggestions
  let suggestion = '';
  if (totalApplied >= 5 && interviewCount === 0 && offerCount === 0 && rejectedCount === 0) {
    suggestion.push("You've applied to many jobs but haven’t received responses. Consider reviewing your resume or matching job requirements better.");
  }

  if (jobs.filter(job => job.status === 'Applied').length >= 4) {
    suggestion.push("Several jobs are still marked as 'Applied'. Consider following up to show continued interest.");
  }

  if (interviewCount >= 3 && offerCount === 0) {
    suggestion.push("You're getting interviews but no offers yet. You may want to improve your interview skills or assess company fit.");
  }

  if (rejectedCount / totalApplied > 0.5) {
    suggestion = 'You have a high rejection rate. Consider improving your CV or revising your job search focus.';
  } else if (interviewCount === 0 && totalApplied > 3) {
    suggestion = 'You haven\'t received any interviews. Try tailoring your cover letter or applying to different job roles.';
  } else if (offerCount > 0 && interviewCount > 0) {
    suggestion = 'You\'re doing great! Keep up the good work and continue following up on your applications.';
  }
  return (
    <div style={{ padding: '20px' }}>
      <div className="analytics-section">
        <h2>📊 Job Application Summary</h2>
        <button onClick={toggleChart} style={{ marginBottom: '10px' }}>
          Switch to {chartType === 'bar' ? 'Pie Chart' : 'Bar Chart'}
        </button>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'bar' ? (
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => (value === 0 || value === totalApplied ? value : '')}
                domain={[0, totalApplied]}
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
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
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
          <p>📩 <strong>Total Jobs Applied:</strong> {totalApplied}</p>
          <p>🎯 <strong>Interviews:</strong> {interviewCount}</p>
          <p>❌ <strong>Rejections:</strong> {rejectedCount}</p>
          <p>🏆 <strong>Offers:</strong> {offerCount}</p>
          <p>🗓️ <strong>Applications Date Range:</strong> From {earliestDate} to {latestDate}</p>
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
      {suggestion && (
        <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
          <h3>🧠 Smart Suggestion</h3>
          <p>{suggestion}</p>
        </div>
      )}
    </div>
  );
}

export default Analytics;
