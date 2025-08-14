import { RESPONSE_MESSAGES, HTTP_STATUS } from '../constants/messages.js';

import userRepo from '../repositories/user.repository.js';
import certificateRepo from '../repositories/certificate.repository.js';
import userCertificate from '../repositories/userCertificate.repository.js';

import apiService from '../services/api.service.js';

const createUserCertificate = async (req, userId, courseId) => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: RESPONSE_MESSAGES.ERROR.INVALID_CREDENTIALS
      });
    }

    // get user data
    const userData = await apiService.getUserByIdPrimary(userId, authToken);

    if (userData.status === HTTP_STATUS.NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        payload: {
          message: RESPONSE_MESSAGES.ERROR.USER_NOT_FOUND
        }
      });
    }

    // get certificate data
    const certificate = await certificateRepo.getOne(courseId);
    if (!certificate) {
      throw new Error('Certificado no encontrado para este curso');
    }

    // Get course data
    const courseData = await apiService.getCourseByCourseId(courseId, authToken);

    if (!courseData || courseData.status === HTTP_STATUS.NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'Curso no encontrado'
      });
    }

    const studentName = `${userData.name.given} ${userData.name.family}`.trim();
    const studentDocument = userData.userName;
    const courseName = courseData.name;

    // Crear issue usando el ID de MongoDB del usuario
    const issue = await userCertificate.createIssue(
      userId,
      certificate._id,
      courseId,
      studentName,
      studentDocument,
      courseName
    );

    return issue;
  } catch (error) {
    console.error('Error al crear userCertificate:', error);
    throw error;
  }
};

const getUserCertificate = async (req, res) => {
  try {
    const userId = req.params.userId;
    const courseId = req.params.courseId;

    // Buscamos si ya existe un certificado para este usuario y curso
    let userCertificateData = await userCertificate.getByUserAndCourse(userId, courseId);

    // Si no existe, lo creamos
    if (!userCertificateData) {
      userCertificateData = await createUserCertificate(req, userId, courseId);
    }

    if (!userCertificateData) {
      return res.status(500).json({
        error: 'No se pudo obtener ni crear el certificado'
      });
    }

    const certificate = await certificateRepo.getOne(courseId);
    if (!certificate) {
      throw new Error('Certificado no encontrado para este curso');
    }

    res.json({
      message: 'Certificado emitido correctamente',
      payload: {
        userId: userCertificateData.userId,
        certificate: {
          fileName: userCertificateData.certificateId.fileName,
          courseId: userCertificateData.certificateId.courseId,
          
          // Coordenadas y estilos para el nombre
          nameX: userCertificateData.certificateId.nameX,
          nameY: userCertificateData.certificateId.nameY,
          nameFontSize: userCertificateData.certificateId.nameFontSize,
          nameFontFamily: userCertificateData.certificateId.nameFontFamily,
          nameColor: userCertificateData.certificateId.nameColor,
          nameItalic: userCertificateData.certificateId.nameItalic,
          nameBold: userCertificateData.certificateId.nameBold,
          
          // Coordenadas y estilos para el documento
          documentX: userCertificateData.certificateId.documentX,
          documentY: userCertificateData.certificateId.documentY,
          documentFontSize: userCertificateData.certificateId.documentFontSize,
          documentFontFamily: userCertificateData.certificateId.documentFontFamily,
          documentColor: userCertificateData.certificateId.documentColor,
          documentItalic: userCertificateData.certificateId.documentItalic,
          documentBold: userCertificateData.certificateId.documentBold,
          
          // Coordenadas y estilos para el nombre del curso
          courseNameX: userCertificateData.certificateId.courseNameX,
          courseNameY: userCertificateData.certificateId.courseNameY,
          courseNameFontSize: userCertificateData.certificateId.courseNameFontSize,
          courseNameFontFamily: userCertificateData.certificateId.courseNameFontFamily,
          courseNameColor: userCertificateData.certificateId.courseNameColor,
          courseNameItalic: userCertificateData.certificateId.courseNameItalic,
          courseNameBold: userCertificateData.certificateId.courseNameBold,
          
          // Coordenadas y estilos para la fecha
          dateX: userCertificateData.certificateId.dateX,
          dateY: userCertificateData.certificateId.dateY,
          dateFontSize: userCertificateData.certificateId.dateFontSize,
          dateFontFamily: userCertificateData.certificateId.dateFontFamily,
          dateColor: userCertificateData.certificateId.dateColor,
          dateItalic: userCertificateData.certificateId.dateItalic,
          dateBold: userCertificateData.certificateId.dateBold,
          
          // Otros campos
          widthR: userCertificateData.certificateId.widthR,
          heightR: userCertificateData.certificateId.heightR,
          state: userCertificateData.certificateId.state,
          reqScore: userCertificateData.certificateId.reqScore,
          createDate: userCertificateData.certificateId.createDate,
          
          // Campos legacy para compatibilidad
          fontsize: userCertificateData.certificateId.fontsize,
          fontFamily: userCertificateData.certificateId.fontFamily,
          color: userCertificateData.certificateId.color,
          italic: userCertificateData.certificateId.italic,
        },
        courseId: userCertificateData.courseId,
        studentName: userCertificateData.studentName,
        studentDocument: userCertificateData.studentDocument,
        courseName: userCertificateData.courseName,
        issuedDate: userCertificateData.issuedDate,
      }
    });
  } catch (error) {
    console.log('Error en getUserCertificate:', error);

    res.status(500).json({
      error: 'Error al obtener el certificado del usuario'
    });
  }
}

export {
  getUserCertificate
}