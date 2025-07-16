import Router from 'express';
import { getScoreCourseUser, getUSer, verificateUser } from '../controllers/user.controllers.js';

const router = Router();


router.get('/user/:userId', getUSer);
router.get('/user/gradebook/score/:userId/:courseId',getScoreCourseUser )
router.post('/user/verificateUser', verificateUser)

export default router;