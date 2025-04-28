const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:3001';
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://10.209.89.116:3001';

export const API_ENDPOINTS = {
  TASKS: {
    LIST: `${API_BASE_URL}/tasks/api`,
    CREATE: `${API_BASE_URL}/tasks/api/add`,
    UPDATE: (taskName) => `${API_BASE_URL}/tasks/api/${taskName}/update`,
    DELETE: (taskName) => `${API_BASE_URL}/tasks/api/${taskName}/delete`,
    GET_TIME: (taskName) => `${API_BASE_URL}/tasks/api/${taskName}/time`,
  },

  FLIPLOG: {
    INSERT: `${API_BASE_URL}/api/fliplog/insert`, 
    LIST: `${API_BASE_URL}/api/fliplog`,          
    GET_TODAY: (taskName) => `${API_BASE_URL}/api/today/${taskName}`,
    GET_RANGE: (startDate, endDate) => 
      `${API_BASE_URL}/api/fliplog/range?start=${startDate}&end=${endDate}`,
    TOTAL: `${API_BASE_URL}/api/fliplog/total`,
  },

  PROFILE: {
    REGISTER: `${API_BASE_URL}/auth/api/signup`, 
    LOGIN: `${API_BASE_URL}/auth/api/login`,
    LOGOUT: `${API_BASE_URL}/auth/api/logout`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/api/changepassword`,
    CHANGE_USERNAME: `${API_BASE_URL}/auth/api/changeusername`,
  }

};
