/**
 * Constantes para mensajes de respuesta y errores
 */

/**
 * Mensajes de respuesta para el usuario
 */
const RESPONSE_MESSAGES = {
  // Mensajes de éxito
  SUCCESS: {
    USER_FOUND: 'Usuario encontrado',
    USER_VERIFIED: 'Usuario verificado',
    SCORE_RETRIEVED: 'Calificación obtenida correctamente',
  },
  
  // Mensajes de error
  ERROR: {
    USER_NOT_FOUND: 'Usuario no encontrado',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    SCORE_NOT_AVAILABLE: 'Calificación no disponible',
    SERVER_ERROR: 'Error interno del servidor',
    API_ERROR: 'Error en la comunicación con la API externa',
  },
};

/**
 * Códigos de estado HTTP
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export { RESPONSE_MESSAGES, HTTP_STATUS };