import { Router } from "express";
import {oauthGetToken} from '../controllers/auth.controller.js';

const router = Router();

router.post('/oauth/token',oauthGetToken);


export default router;