import jsw from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import user from '../repositories/user.repository.js';
//import { sendEmail } from '../config/emails.js';

const register = async (req, res) => {

    try {

        const name = req.body.name;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const userName = req.body.user;
        const hash = await bcrypt.hash(req.body.password, 10);

        await user.insert(name, lastName, email, userName, hash);
        const data = await user.getOne(userName);

        return res.json({
            payload: {
                message: 'ok'
            }
        })

    } catch (error) {
        console.log(error);
        res.redirect('/api/register')
    }

};

const login = async (req, res) => {

    const uidUser = req.body.user

    res.redirect(`/api/user/${uidUser}`);
    /*console.log('linea 34 authApp',req.body)
    const userName = req.body.user;
    const password = req.body.password;

    try {
        const userLog = await user.getOne(userName);
        console.log('usuario: ',userLog)
        const passEncrypt = await bcrypt.compare(password, userLog.password);

        if (passEncrypt) {
            const id = userLog._id;

            const token = jsw.sign({ id: id }, process.env.SECRET_WORD, {
                expiresIn: process.env.EXPIRE_TOKEN
            });

            const cookieOption = {
                expire: new Date(Date.now() + 60),
                httpOnly: true
            }

            req.session.userId = userLog.user;
            res.cookie('userId', userLog.user, cookieOption)
            res.cookie('token', token, cookieOption);
            


        } else {
            res.redirect('/log');
        }
    } catch (error) {
        res.status(300).json({
            payload: {
                message: 'usuario no encontrado'
            }
        })
        return console.log(error)
    }*/
}

const authenticateApp = async (req, res, next) => {
    const { token } = req.cookies;
    if (token != null) {
        const decode = await jwt.verify(token, process.env.SECRET_WORD);
        const userLog = await user.getId(decode.id);
        if (userLog) {
            req.decode = decode;
            return next();
        }
    } else {
        return res.redirect('/api/log');
    }
};

const logout = ((req, res) => {

    res.clearCookie('token');
    return res.redirect('./log');
});


const authTokenVerificate = (req, res, next) => {
    const { timesTampLog } = req.cookies;
    try {
        const { accessToken, expireToken } = req.session;

        if (!accessToken) {
            return res.status(401).json({ message: 'No access token provided' });
        }


        
        const currentTime = Date.now();
        const expireTime = timesTampLog + (expireToken * 1000);

        if (currentTime < expireTime) {
            return next();
        } else {
            return res.status(401).json({ message: 'Token has expired' });
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


/*const forPass = async (req, res) => {
    const userName = req.body.userName
    try {
        const data = await user.getOne(userName)
        console.log(data.email)
        sendEmail(data.email)
        return res.json({
            payload: true,
            message: ' Habilitado para cambio de contraseña, correo electronico enviado!!'
        })
    } catch (error) {
        return res.json({
            payload: false
        })
    }

}*/


export {
    register,
    login,
    authenticateApp,
    logout,
    authTokenVerificate
    //forPass
};