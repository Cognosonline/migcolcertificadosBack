//import 'dotenv/config';
import axios from 'axios';

const loginB = async (req, res, next) => {
    try {
        const authEndpoint = process.env.AUTH_CODE_URI;

        const queryParams = new URLSearchParams({
            response_type: 'code',
            client_id: process.env.CLIENT_ID,
            redirect_uri: process.env.REDIRECT_URI
        });

        const authUrl = `${authEndpoint}?${queryParams}`;

        res.redirect(authUrl);
    } catch (error) {
        console.error('Error al redirigir al usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const oauthGetToken = async (req, res, next) => {

    try {
        const { code } = req.body;

        const tokenEndpoint = process.env.TOKEN_INFO_URI;

        const authString = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');

        const options = {
            method: 'post',
            url: tokenEndpoint,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${authString}`
            },
            data: new URLSearchParams({
                grant_type:'authorization_code',
                code,
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                redirect_uri: process.env.REDIRECT_URI
            })
        };

        const response = await axios(options);

        return res.json({
            payload:{
                token:response.data.access_token,
                expireToken: response.data.expires_in,
                userId : response.data.user_id
            }
        })
    } catch (error) {
        console.error('Error al autenticar al usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

export { loginB, oauthGetToken };
