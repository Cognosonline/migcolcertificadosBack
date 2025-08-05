import UserCertificate from '../models/userCertificate.model.js';

const userCertificate = {}

// Obtener emisión por usuario y curso
const getByUserAndCourse = async (userId, courseId) => {
  try {
    const issue = await UserCertificate.findOne({ 
      userId: userId, 
      courseId: courseId
    }).populate('certificateId');
    return issue;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Crear nueva emisión (solo si no existe)
const createIssue = async (userId, courseId, certificateId, studentName, studentDocument, courseName) => {
  try {
    // Verificar si ya existe una emisión
    const existingIssue = await getByUserAndCourse(userId, courseId);
    if (existingIssue) {
      return existingIssue;
    }

    const newIssue = new UserCertificate({
      userId: userId,
      certificateId: certificateId,
      courseId: courseId,
      studentName: studentName,
      studentDocument: studentDocument,
      courseName: courseName
    });

    const savedIssue = await newIssue.save();
    return await UserCertificate.findById(savedIssue._id).populate('certificateId');
  } catch (err) {
    console.log('Error creating certificate issue:', err);
    return null;
  }
};

userCertificate.getByUserAndCourse = getByUserAndCourse;
userCertificate.createIssue = createIssue;

export default userCertificate;
