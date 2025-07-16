import Router from 'express';
import {
     downloadCertificate,
     getCertificate,
     getCertificates,
     uploadCertificate,
     getCertificateCourseId,
     deletedCertificate,
     updateCoords,
     updateReqScore,
     getReqScore
} from '../controllers/certificate.controllers.js';

const router = Router();


router.get('/certificates', getCertificates);
router.get('/certificate/:filename', getCertificate);
router.get('/certificateCourse/:courseId', getCertificateCourseId);
router.get('/downloadCertificate/:filename', downloadCertificate);
router.get('/reqScore/:courseId', getReqScore);

router.post('/certificate', uploadCertificate);
router.post('/coords', updateCoords);
router.post('/reqScore', updateReqScore);

router.delete('/certificate', deletedCertificate);

export default router;