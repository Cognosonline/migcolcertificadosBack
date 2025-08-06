import mongoose from "mongoose";

const Schema = mongoose.Schema

const userCertificateSchema = new Schema({
  userId: { type: String, required: true },
  certificateId: { type: Schema.Types.ObjectId, ref: 'certificate', required: true },
  courseId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentDocument: { type: String, required: true },
  courseName: { type: String, required: true },
  issuedDate: { type: Date, default: Date.now() },
  createDate : { type: Date, default: Date.now()}
});

// Índice único para evitar duplicados por usuario y curso
userCertificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('userCertificate', userCertificateSchema);