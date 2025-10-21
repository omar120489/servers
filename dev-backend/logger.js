const levels = ['error', 'warn', 'info', 'debug'];

const envLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'warn' : 'debug');
const currentLevelIndex = levels.indexOf(envLevel.toLowerCase());

function canLog(level) {
  const levelIndex = levels.indexOf(level);
  return levelIndex <= (currentLevelIndex === -1 ? levels.length - 1 : currentLevelIndex);
}

export const logger = {
  debug: (...args) => {
    if (canLog('debug')) {
      console.log('[debug]', ...args);
    }
  },
  info: (...args) => {
    if (canLog('info')) {
      console.log('[info]', ...args);
    }
  },
  warn: (...args) => {
    if (canLog('warn')) {
      console.warn('[warn]', ...args);
    }
  },
  error: (...args) => {
    if (canLog('error')) {
      console.error('[error]', ...args);
    }
  },
};
