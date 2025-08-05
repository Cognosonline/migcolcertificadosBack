import userRepo from '../repositories/user.repository.js';
import certificateRepo from '../repositories/certificate.repository.js';
import userCertificate from '../repositories/userCertificate.repository.js';

const createUserCertificate = async (req, userId, courseId) => {
  try {
    const user = await userRepo.getId(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const certificate = await certificateRepo.getOne(courseId);
    if (!certificate) {
      throw new Error('Certificado no encontrado para este curso');
    }

    const authUser = req.headers.authorization;
    const url = `${process.env.URL}/v3/courses/${courseId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authUser
      }
    })

    const course = await response.json();

    const studentName = `${user.name} ${user.lastName || ''}`.trim();
    const studentDocument = user.externalId;
    const courseName = course.name;

    // Crear issue
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
    const { userId, courseId } = req.params;

    let userCertificateData = await userCertificate.getByUserAndCourse(userId, courseId);

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
        ...userCertificateData,
        certificateUrl: 'url test',
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