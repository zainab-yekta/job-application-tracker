export const GREETING =
  'Hi! Ask me how to add a job, set an interview reminder, export your list or read the analytics.';

// First topic whose keywords appear in the message wins, so specific topics come first
const TOPICS = [
  {
    keywords: ['backup', 'back up', 'restore', 'import', 'another browser', 'move'],
    reply:
      'Click Download backup on the Tracker page to save everything as a file. On another browser, log in and click Restore backup to load it.',
  },
  {
    keywords: ['export', 'excel', 'pdf', 'download'],
    reply:
      'Use the Export to Excel or Export to PDF buttons on the Tracker page. The file includes every application you have saved.',
  },
  {
    keywords: ['remind', 'notification', 'upcoming', 'interview'],
    reply:
      'Set the status to Interview and fill in the interview date and time. The Tracker page shows a reminder for interviews today or tomorrow.',
  },
  {
    keywords: ['analytics', 'chart', 'graph', 'stats', 'suggestion'],
    reply:
      'The Analytics page shows your interviews, rejections and offers as a bar or pie chart, your interviews over time and a few suggestions.',
  },
  {
    keywords: ['edit', 'change', 'update'],
    reply:
      'Click Edit on a job card. The form fills in with that job so you can change it and Save.',
  },
  {
    keywords: ['delete', 'remove'],
    reply: 'Click Delete on a job card and confirm. This cannot be undone.',
  },
  {
    keywords: ['search', 'filter', 'find'],
    reply:
      'Type in the search box to match a job title or company, or use the status and date filters under the form.',
  },
  {
    keywords: ['add', 'adding', 'new job', 'create', 'track'],
    reply:
      'Go to the Tracker page, fill in the title, company and the date you applied, pick a status and click Add Job.',
  },
  {
    keywords: ['data', 'save', 'stored', 'storage', 'privacy', 'private'],
    reply:
      'Everything is saved in your own browser and each account has its own list. Nothing is sent to a server, so clearing your browser data removes it. Download a backup to keep a copy.',
  },
  {
    keywords: ['login', 'log in', 'register', 'account', 'password', 'sign'],
    reply:
      'Create an account on the Register page, then log in. The account only exists in this browser.',
  },
  {
    keywords: ['what is', 'about', 'purpose'],
    reply: 'This is a Job Application Tracker to manage your job search.',
  },
  {
    keywords: ['how', 'help', 'use'],
    reply: 'Just login, add jobs, track status, and view analytics.',
  },
  { keywords: ['thank'], reply: "You're welcome! 😊" },
  { keywords: ['bye', 'goodbye', 'see you'], reply: 'Goodbye! Have a great day!' },
  { keywords: ['hello', 'hi', 'hey'], reply: 'Hi there! How can I assist you today?' },
];

const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export function getBotReply(message) {
  const text = ` ${normalize(message)} `;
  // Keywords match the start of a word ("remind" matches "reminders"), and short
  // ones must be the whole word so "hi" doesn't match "hire" or "this"
  const matches = (keyword) =>
    new RegExp(`\\b${keyword}${keyword.length <= 3 ? '\\b' : ''}`).test(text);
  const topic = TOPICS.find(({ keywords }) => keywords.some(matches));
  return topic
    ? topic.reply
    : "Sorry, I don't understand that. Try asking about adding jobs, reminders, exports or analytics.";
}
