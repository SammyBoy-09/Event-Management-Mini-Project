/**
 * Environment Configuration
 * Centralized configuration for different environments
 */

const ENV = {
  dev: {
    apiUrl: 'auto', // 'auto' will use dynamic IP detection
    enableLogging: true,
  },
  staging: {
    apiUrl: 'https://staging-api.your-domain.com/api',
    enableLogging: true,
  },
  production: {
    apiUrl: 'https://api.your-domain.com/api',
    enableLogging: false,
  },
};

// Function to get current environment
const getEnvVars = (env = 'dev') => {
  if (env === 'dev' || env === 'development') {
    return ENV.dev;
  } else if (env === 'staging') {
    return ENV.staging;
  } else if (env === 'production') {
    return ENV.production;
  }
  return ENV.dev;
};

export default getEnvVars;
