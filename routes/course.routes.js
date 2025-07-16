import Router from 'express';
import {getCourse, getCourses} from '../controllers/course.controllers.js';

const router = Router();

router.get('/courses/:id', getCourses );
router.get('/course/:id', getCourse);



export default router;