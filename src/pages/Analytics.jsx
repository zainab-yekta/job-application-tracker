import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  BarChart3,
  Briefcase,
  Lightbulb,
  PieChart as PieIcon,
  Table2,
  Trophy,
  Users,
  XCircle,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import EmptyState from '../components/EmptyState';
import { formatDisplayDate, parseLocalDate } from '../utils/formatDate';
import { getSuggestions } from '../utils/suggestions';
import { STATUSES, isOfferStatus } from '../constants/statuses';
import './Analytics.css';

// Each status keeps the same color in every chart (see styles/tokens.css)
const STATUS_COLORS = {
  Applied: 'var(--chart-1)',
  Interview: 'var(--chart-2)',
  Rejected: 'var(--chart-3)',
  Offer: 'var(--chart-4)',
  'Accepted Offer': 'var(--chart-5)',
};

const VIEWS = [
  { id: 'bar', label: 'Bar', icon: BarChart3 },
  { id: 'pie', label: 'Pie', icon: PieIcon },
  { id: 'table', label: 'Table', icon: Table2 },
];

// A line needs a few points before it shows a real trend
const MIN_TREND_POINTS = 4;

const tooltipStyle = {
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-fg)',
  fontSize: 'var(--text-sm)',
};

const axisTick = { fill: 'var(--chart-axis)', fontSize: 12 };

const shortDate = (isoDate) =>
  parseLocalDate(isoDate)?.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) ?? '';

function StatusChart({ view, data, total, animate }) {
  if (view === 'table') {
    return (
      <table className="data-table">
        <caption className="sr-only">Applications by status</caption>
        <thead>
          <tr>
            <th scope="col">Status</th>
            <th scope="col">Applications</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.name}>
              <th scope="row">
                <span className="status-cell">
                  <span className="legend-dot" style={{ backgroundColor: row.color }} />
                  {row.name}
                </span>
              </th>
              <td>{row.value}</td>
              <td>{total ? Math.round((row.value / total) * 100) : 0}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (view === 'pie') {
    const slices = data.filter((row) => row.value > 0);
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={slices}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            isAnimationActive={animate}
            label={({ x, y, value, textAnchor }) => (
              <text
                x={x}
                y={y}
                textAnchor={textAnchor}
                dominantBaseline="central"
                className="pie-label"
              >
                {Math.round((value / total) * 100)}%
              </text>
            )}
          >
            {slices.map((row) => (
              <Cell key={row.name} fill={row.color} stroke="var(--color-surface)" />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 13 }}
            formatter={(value) => <span className="legend-text">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* Horizontal bars keep every status name readable, even on a phone */}
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 32, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--chart-grid)" />
        <XAxis
          type="number"
          allowDecimals={false}
          tick={axisTick}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={112}
          tick={{ ...axisTick, fill: 'var(--color-fg-muted)', fontSize: 13 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-surface-muted)' }} />
        <Bar
          dataKey="value"
          name="Applications"
          radius={[0, 6, 6, 0]}
          maxBarSize={36}
          isAnimationActive={animate}
        >
          {data.map((row) => (
            <Cell key={row.name} fill={row.color} />
          ))}
          <LabelList dataKey="value" position="right" className="bar-label" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function Analytics({ jobs }) {
  const [view, setView] = useState('bar');
  const animate = !usePrefersReducedMotion();

  if (jobs.length === 0) {
    return (
      <main className="analytics container">
        <header className="page-header">
          <h1>Analytics</h1>
          <p>See how your job search is going.</p>
        </header>
        <EmptyState
          icon={BarChart3}
          title="No data yet"
          text="Add a few applications and your charts will appear here."
          action={
            <Link to="/dashboard" className="btn btn-primary">
              Go to the tracker
            </Link>
          }
        />
      </main>
    );
  }

  const total = jobs.length;
  const countOf = (status) => jobs.filter((job) => job.status === status).length;
  const interviewCount = countOf('Interview');
  const rejectedCount = countOf('Rejected');
  const offerCount = jobs.filter((job) => isOfferStatus(job.status)).length;

  // Largest first, as recommended for comparing categories
  const statusData = STATUSES.map((status) => ({
    name: status,
    value: countOf(status),
    color: STATUS_COLORS[status],
  })).sort((a, b) => b.value - a.value);

  // 'YYYY-MM-DD' strings sort correctly as plain text
  const appliedDates = jobs
    .map((job) => job.appliedDate)
    .filter(Boolean)
    .sort();

  // Every interview on record (including jobs that have since moved on),
  // grouped by day and kept in date order
  const interviewCountsByDay = jobs
    .filter((job) => job.interviewDate)
    .reduce((acc, job) => {
      acc[job.interviewDate] = (acc[job.interviewDate] || 0) + 1;
      return acc;
    }, {});
  const interviewTrend = Object.keys(interviewCountsByDay)
    .sort()
    .map((day) => ({ day, date: shortDate(day), count: interviewCountsByDay[day] }));
  // Running total, so the line shows how interviews add up over the search
  const interviewGrowth = interviewTrend.reduce(
    (points, point) => [...points, { ...point, total: (points.at(-1)?.total ?? 0) + point.count }],
    [],
  );
  const totalInterviews = interviewGrowth.at(-1)?.total ?? 0;

  const suggestions = getSuggestions({
    totalApplied: total,
    appliedCount: countOf('Applied'),
    interviewCount,
    rejectedCount,
    offerCount,
  });

  return (
    <main className="analytics container">
      <header className="page-header">
        <h1>Analytics</h1>
        <p>
          {appliedDates.length > 0
            ? `Applications from ${formatDisplayDate(appliedDates[0])} to ${formatDisplayDate(
                appliedDates[appliedDates.length - 1],
              )}.`
            : 'See how your job search is going.'}
        </p>
      </header>

      <section className="stats" aria-label="Summary">
        <StatCard icon={Briefcase} label="Total applied" value={total} tone="primary" />
        <StatCard icon={Users} label="Interviews" value={interviewCount} tone="interview" />
        <StatCard icon={XCircle} label="Rejections" value={rejectedCount} tone="rejected" />
        <StatCard icon={Trophy} label="Offers" value={offerCount} tone="offer" />
      </section>

      <div className="analytics-grid">
        <section className="panel card chart-card" aria-labelledby="status-title">
          <div className="chart-card-header">
            <h2 id="status-title" className="panel-title">
              Applications by status
            </h2>
            <div className="segmented" role="group" aria-label="Show as">
              {VIEWS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`segmented-option${view === id ? ' is-active' : ''}`}
                  aria-pressed={view === id}
                  onClick={() => setView(id)}
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <StatusChart view={view} data={statusData} total={total} animate={animate} />
        </section>

        <section className="panel card chart-card" aria-labelledby="trend-title">
          <h2 id="trend-title" className="panel-title">
            Interviews over time
          </h2>
          {interviewGrowth.length >= MIN_TREND_POINTS && (
            <p className="panel-text">
              {totalInterviews} interviews in total, counted by interview date.
            </p>
          )}
          {interviewTrend.length >= MIN_TREND_POINTS ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={interviewGrowth}
                margin={{ top: 16, right: 16, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="date" tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Interviews so far"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                    stroke: 'var(--chart-1)',
                    fill: 'var(--color-surface)',
                  }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={animate}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : interviewTrend.length > 0 ? (
            <>
              <p className="panel-text">
                A trend line appears once you have interviews on {MIN_TREND_POINTS} different days.
                So far:
              </p>
              <ul className="interview-days">
                {interviewTrend.map((point) => (
                  <li key={point.day}>
                    <span>{formatDisplayDate(point.day)}</span>
                    <strong>
                      {point.count} {point.count === 1 ? 'interview' : 'interviews'}
                    </strong>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="panel-text">
              No interviews yet. Set a job&apos;s status to Interview to start the timeline.
            </p>
          )}
        </section>
      </div>

      {suggestions.length > 0 && (
        <section className="panel card" aria-labelledby="suggestions-title">
          <h2 id="suggestions-title" className="panel-title">
            Suggestions
          </h2>
          <ul className="suggestions">
            {suggestions.map((text) => (
              <li key={text}>
                <span className="suggestion-icon" aria-hidden="true">
                  <Lightbulb size={18} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

export default Analytics;
