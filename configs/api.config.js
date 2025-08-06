/**
 * Configuración de endpoints de la API externa
 */

/**
 * Objeto con los endpoints de la API
 */
const API_ENDPOINTS = {
  // Endpoints de usuarios
  USERS: {
    GET_USER: '/v1/users', // Requiere prefijo (uuid, userName) y ID
    GET_COURSES: '/v1/users/{userId}/courses',
  },
  
  // Endpoints de cursos
  COURSES: {
    GET_COURSE: '/v3/courses/{courseId}',
    GET_GRADEBOOK: '/v2/courses/{courseId}/gradebook/columns/finalGrade/users',
  },
};

/**
 * Función para construir un endpoint con parámetros
 * @param {string} endpoint - Endpoint base
 * @param {Object} params - Parámetros a reemplazar
 * @returns {string} - Endpoint con parámetros reemplazados
 */
const buildEndpoint = (endpoint, params = {}) => {
  let result = endpoint;
  
  // Reemplazar parámetros en el endpoint
  Object.keys(params).forEach(key => {
    const placeholder = `{${key}}`;
    if (result.includes(placeholder)) {
      result = result.replace(placeholder, params[key]);
    }
  });
  
  return result;
};

export { API_ENDPOINTS, buildEndpoint };