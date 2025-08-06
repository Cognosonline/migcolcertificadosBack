import UserCertificate from '../models/userCertificate.model.js';

const userCertificate = {}

// Obtener emisión por usuario y curso
const getByUserAndCourse = async (userId, courseId) => {
  try {
    // Buscar primero por el userId como string (nombre de usuario)
    const userByUsername = await import('../repositories/user.repository.js')
      .then(module => module.default.getOne(userId));
    
    const mongoUserId = userByUsername ? userByUsername._id : null;
    
    const issue = await UserCertificate.findOne({ 
      userId: mongoUserId, 
      courseId: courseId
    }).populate('certificateId');
    return issue;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Crear nueva emisión (solo si no existe)
const createIssue = async (userId, certificateId, courseId, studentName, studentDocument, courseName) => {
  try {
    // Verificar si ya existe una emisión directamente por userId (ObjectId) y courseId
    const existingIssue = await UserCertificate.findOne({
      userId: userId,
      courseId: courseId
    }).populate('certificateId');
    
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
