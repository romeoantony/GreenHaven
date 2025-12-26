// Debug Logger
window.debugLogs = [];

export const log = (msg) => {
  if (!import.meta.env.DEV) return; // Only log in development
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const logMsg = `[${timestamp}] ${msg}`;
  window.debugLogs.push(logMsg);
  console.log(logMsg);
  const el = document.getElementById('debug-log-content');
  if (el) el.innerText = window.debugLogs.join('\n');
};

window.log = log;

export default log;
