import { Router } from "express";
import { oauthGetToken } from "../controllers/auth.controller.js";
import {
    register,
    login,
    logout,
    authTokenVerificate,
    //forPass
} from '../controllers/authApp.controller.js';

const route = Router();

route.get('/log', oauthGetToken, (req, res) => {
    res.redirect('https://master.d1jucbpkspz3zd.amplifyapp.com/signin/');
});

route.get('/register', (req, res) => {
    res.send('pagina de registro');
});

route.post('/logout', logout);
route.post('/log', login);
route.post('/register', register);
//route.post('/forgotPass', forPass);


export default route;