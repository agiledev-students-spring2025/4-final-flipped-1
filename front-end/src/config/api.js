const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:3001';
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://10.209.89.116:3001';

export const API_ENDPOINTS = {
  TASKS: {
    LIST: `${API_BASE_URL}/api/tasks`,
    CREATE: `${API_BASE_URL}/api/tasks`,
    UPDATE: (taskId) => `${API_BASE_URL}/api/tasks/${taskId}`,
    DELETE: (taskId) => `${API_BASE_URL}/api/tasks/${taskId}/delete`,
    GET_TIME: (taskId) => `${API_BASE_URL}/api/tasks/${taskId}/time`,
  },

  FLIPLOG: {
    INSERT: `${API_BASE_URL}/api/fliplog/insert`, 
    LIST: `${API_BASE_URL}/api/fliplog`,          
    GET_TODAY: (taskName) => `${API_BASE_URL}/api/today/${taskName}`,
  },

  PROFILE: {
    REGISTER: `${API_BASE_URL}/auth/api/signup`, 
    LOGIN: `${API_BASE_URL}/auth/api/login`,
    LOGOUT: `${API_BASE_URL}/auth/api/logout`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/api/changepassword`,
    CHANGE_USERNAME: `${API_BASE_URL}/auth/api/changeusername`,
  }

};
