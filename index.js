import 'dotenv/config'
import'./configs/db.js';
import './configs/configs3.js';
import express from 'express';
//import serverless from 'serverless-http';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';

import logsRoutes from './routes/logs.routes.js';
import userRoutes from './routes/user.routes.js';
import coursesRoutes from './routes/course.routes.js';
import certificate from './routes/certificate.routes.js';
import oauthRoutes from './routes/oauth.routes.js';

import { loginB } from './controllers/auth.controller.js';

const app = express();

app.set('trust proxy', 1);

const corsOptions = {
  origin: 'http://localhost:5173', // dominio frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.options('*', cors(corsOptions));

app.use(session({
  secret: process.env.CLIENT_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: './certificados'
}));


app.set('port', process.env.PORT || 3000);


// Initialize routes and middleware
app.get('/', (req, res) => res.send('api certificados cognosonline'));
app.get('/loginBB', loginB);

app.use('/api', userRoutes);
app.use('/api', logsRoutes);
app.use('/api', coursesRoutes);
app.use('/api', certificate);
app.use('/api', oauthRoutes);


app.get('/otra-ruta', (req, res) => {
  res.send('Otra ruta prueba logins, proxy');
});

app.get('*', (req, res) => {
  res.status(404).send('Ruta no encontrada');
});


app.listen(app.get('port'), () => {
   console.log(`Server on port ${app.get('port')}`);

})

// Export the handler for Lambda
//export const handler = serverless(app);
