const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:3001';
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://10.209.89.116:3001';

export const API_ENDPOINTS = {
  TASKS: {
    LIST: `${API_BASE_URL}/tasks/api`,
    CREATE: `${API_BASE_URL}/tasks/api/add`,
    // UPDATE: (taskId) => `${API_BASE_URL}/tasks/api/${taskId}`,
    DELETE: (taskName) => `${API_BASE_URL}/tasks/api/${taskName}/delete`,
    // GET_TIME: (taskId) => `${API_BASE_URL}/tasks/api/${taskId}/time`,
  },

  FLIPLOG: {
    INSERT: `${API_BASE_URL}/api/fliplog/insert`, 
    LIST: `${API_BASE_URL}/api/fliplog`,          
    GET_TODAY: (taskName) => `${API_BASE_URL}/api/today/${taskName}`,
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
