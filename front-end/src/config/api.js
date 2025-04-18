const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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
  }

};
