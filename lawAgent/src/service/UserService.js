

// Исправленные методы API
export const listOfUsers = async (token) => {
    return api.get('/users');
};

export const getComparison = async (token, documentId) => {
    return api.get(`/documents/${documentId}/latest-changes`);
};

// export const getDocument = async(token, documentId)=> {
//     return api.get(`/documents/${id}`);
// }
export const findDocuments = async (token, params) => {
    return api.get('/documents/search', {
      params,
      paramsSerializer: {
        indexes: null 
      }
    });
  };


  import axios from "axios";
  import { AUTH_TOKEN } from "../utils/Constants";
  
  export const getAuthToken = () => {
      return localStorage.getItem(AUTH_TOKEN);
  };
  
  export const setAuthToken = (token) => {
      if (token) {
          localStorage.setItem(AUTH_TOKEN, token);
      } else {
          localStorage.removeItem(AUTH_TOKEN);
      }
  };
  
  const api = axios.create({
      baseURL: 'http://localhost:8080/lawAgent',
      withCredentials: true,
  });
  
  // Только один интерцептор для добавления токена
  api.interceptors.request.use(config => {
      const token = getAuthToken();
      if (token) {
          config.headers = {
              ...config.headers,
              'Authorization': `Bearer ${token}`,
              'Content-Type': config.headers['Content-Type'] || 'application/json'
          };
      }
      return config;
  });
  
  api.interceptors.response.use(
      response => response,
      error => {
          if (error.response?.status === 401) {
              localStorage.removeItem(AUTH_TOKEN);
              //window.location.href = '/login';
          }
          return Promise.reject(error);
      }
  );
  
  // Унифицированные методы API без дублирования headers
  export const getVersion = (versionId) => api.get(`/documents/versions/${versionId}`);
  
  export const getHighlights = (versionId) => api.get(`/documents/versions/${versionId}/highlights`);
  
  export const createHighlight = (versionId, text, color) => 
      api.post(`/documents/versions/${versionId}/highlights`, { text, color });
  
  export const deleteHighlight = (highlightId) => api.delete(`/documents/highlights/${highlightId}`);
  
  export const updateContent = (versionId, content) => 
      api.put(`/documents/versions/${versionId}/content`, content, {
          headers: { 'Content-Type': 'text/plain' }
      });
  
      export const addToFavorites = (versionId) => api.post(`/documents/versions/${versionId}/favorites`, {});

      export const removeFromFavorites = (versionId) => api.delete(`/documents/versions/${versionId}/favorites`);
      
      export const checkIsFavorite = (versionId) => api.get(`/documents/versions/${versionId}/favorites/check`);
      
      export const getFavorites = () => api.get('/documents/favorites');

export const updateUserProfile = (userId, userData) => api.put(`/users/${userId}`, userData);
// Добавляем новые методы
export const getUserProfile = () =>api.get(`/user`);

  export default api;