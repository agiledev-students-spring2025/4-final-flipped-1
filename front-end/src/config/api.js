const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:3001';
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://10.209.89.116:3001';

export const API_ENDPOINTS = {
  TASKS: {
    LIST: `${API_BASE_URL}/tasks`,
    CREATE: `${API_BASE_URL}/tasks/add`,
    UPDATE: (taskName) => `${API_BASE_URL}/tasks/${taskName}/update`,
    DELETE: (taskName) => `${API_BASE_URL}/tasks/${taskName}/delete`,
    GET_TIME: (taskName) => `${API_BASE_URL}/tasks/${taskName}/time`, // if you use this route later
  },

  FLIPLOG: {
    INSERT: `${API_BASE_URL}/api/fliplog/insert`, 
    LIST: `${API_BASE_URL}/api/fliplog`,          
    GET_TODAY: (taskName) => `${API_BASE_URL}/api/today/${taskName}`,
    GET_RANGE: (startDate, endDate) => `${API_BASE_URL}/fliplog/api/range?start=${startDate}&end=${endDate}`,
    TODAY_LIST: (todayDate) => `${API_BASE_URL}/fliplog/api/date/${todayDate}`,
    TOTAL: `${API_BASE_URL}/api/fliplog/total`,
  },

  PROFILE: {
    REGISTER: `${API_BASE_URL}/auth/api/signup`, 
    LOGIN: `${API_BASE_URL}/auth/api/login`,
    LOGOUT: `${API_BASE_URL}/auth/api/logout`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/api/changepassword`,
    CHANGE_USERNAME: `${API_BASE_URL}/auth/api/changeusername`,
  },

  TODOS: {
    LIST: `${API_BASE_URL}/api/todos`,
    ADD: `${API_BASE_URL}/api/todos`,
    DELETE: (id) => `${API_BASE_URL}/api/todos/${id}`,
  }
};
