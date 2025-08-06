/**
 * Servicio para manejar las peticiones a la API externa
 */
import fetch from 'node-fetch';
import { API_ENDPOINTS, buildEndpoint } from '../configs/api.config.js';

const apiService = {};

/**
 * Configuración base para las peticiones a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {string} authToken - Token de autorización
 * @param {string} method - Método HTTP (GET, POST, etc.)
 * @param {Object} body - Cuerpo de la petición (opcional)
 * @returns {Object} - Configuración de la petición
 */
const createRequestConfig = (authToken, method = 'GET', body = null) => {
  const config = {
    method,
    headers: {
      'Authorization': authToken,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return config;
};

/**
 * Construye la URL completa para la API
 * @param {string} endpoint - Endpoint de la API
 * @returns {string} - URL completa
 */
const buildApiUrl = (endpoint) => {
  const baseUrl = process.env.URL || '';
  // Asegurarse de que no haya doble barra entre baseUrl y endpoint
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${formattedEndpoint}`;
};

/**
 * Realiza una petición a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {string} authToken - Token de autorización
 * @param {string} method - Método HTTP (GET, POST, etc.)
 * @param {Object} body - Cuerpo de la petición (opcional)
 * @returns {Promise<Object>} - Respuesta de la API
 */
apiService.request = async (endpoint, authToken, method = 'GET', body = null) => {
  try {
    const url = buildApiUrl(endpoint);
    const config = createRequestConfig(authToken, method, body);
    
    const response = await fetch(url, config);
    return await response.json();
  } catch (error) {
    console.error(`Error en petición a ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Obtiene información de un usuario por su ID
 * @param {string} userId - ID del usuario
 * @param {string} authToken - Token de autorización
 * @param {string} prefix - Prefijo para el ID (uuid, userName, etc.)
 * @returns {Promise<Object>} - Información del usuario
 */
apiService.getUserById = async (userId, authToken, prefix = 'uuid') => {
  const endpoint = `${API_ENDPOINTS.USERS.GET_USER}/${prefix}:${userId}`;
  return await apiService.request(endpoint, authToken);
};

/**
 * Obtiene información de un usuario por su ID Primary
 * @param {string} userId - ID del usuario
 * @param {string} authToken - Token de autorización
 * @returns {Promise<Object>} - Información del usuario
 */
apiService.getUserByIdPrimary = async (userId, authToken) => {
  const endpoint = `${API_ENDPOINTS.USERS.GET_USER}/${userId}`;
  return await apiService.request(endpoint, authToken);
};

/**
 * Obtiene la calificación de un usuario en un curso
 * @param {string} courseId - ID del curso
 * @param {string} userId - ID del usuario
 * @param {string} authToken - Token de autorización
 * @returns {Promise<Object>} - Calificación del usuario
 */
apiService.getUserCourseScore = async (courseId, userId, authToken) => {
  // Construir el endpoint usando la configuración centralizada
  const baseEndpoint = buildEndpoint(API_ENDPOINTS.COURSES.GET_GRADEBOOK, { courseId });
  const endpoint = `${baseEndpoint}/userName:${userId}`;
  return await apiService.request(endpoint, authToken);
};

/**
 * Obtiene los cursos de un usuario
 * @param {string} userId - ID del usuario
 * @param {string} authToken - Token de autorización
 * @param {string} prefix - Prefijo para el ID (uuid, userName, etc.)
 * @returns {Promise<Object>} - Lista de cursos del usuario
 */
apiService.getUserCourses = async (userId, authToken, prefix = 'userName') => {
  const endpoint = buildEndpoint(API_ENDPOINTS.USERS.GET_COURSES, { userId: `${prefix}:${userId}` });
  return await apiService.request(endpoint, authToken);
};

/**
 * Obtiene información de un curso
 * @param {string} courseId - ID del curso
 * @param {string} authToken - Token de autorización
 * @returns {Promise<Object>} - Información del curso
 */
apiService.getCourseById = async (courseId, authToken) => {
  const endpoint = buildEndpoint(API_ENDPOINTS.COURSES.GET_COURSE, { courseId });
  return await apiService.request(endpoint, authToken);
};

/**
 * Obtiene información de un curso
 * @param {string} courseId - ID del curso
 * @param {string} authToken - Token de autorización
 * @returns {Promise<Object>} - Información del curso
 */
apiService.getCourseByCourseId = async (courseId, authToken) => {
  const endpoint = buildEndpoint(API_ENDPOINTS.COURSES.GET_COURSE, { courseId: `courseId:${courseId}` });
  return await apiService.request(endpoint, authToken);
};

export default apiService;