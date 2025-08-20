import fetch from 'node-fetch';
import jsw from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import user from '../repositories/user.repository.js';

const getUSer = async (req, res) => {

    // console.log('enviando data de user a blackboard')
    const userName = `uuid:${req.params.userId}`;
    try {
        let authUser = req.headers.authorization;
        const userUrl = `${process.env.URL}/v1/users/${userName}`;

        const response = await fetch(userUrl, {
            method: 'GET',
            headers: {
                'Authorization': authUser
            }
        })

        if (response.status === 429) {
            return res.status(429).json({
                message: 'Demasiadas solicitudes. Por favor, inténtalo de nuevo más tarde.',
                error: 'RATE_LIMIT_EXCEEDED',
                code: response.status
            });
        }

        const data = await response.json(); 

        if (data.status === 404) {
            res.json({
                payload:
                {
                    message: 'no'
                }

            })
        } else {
            res.json({
                payload:
                {
                    id: data.id,
                    nombre: data.name,
                    cedula: data.userName,
                    rol: data.institutionRoleIds
                }

            })
        }

    } catch (error) {
        console.log(error)
    }

}

const verificateUser = async (req, res) => {

    try {
        const userName = req.body.user;
        const pass = req.body.pass

        const userLog = await user.getOne(userName);
        // console.log(userLog)
        const passEncrypt = await bcrypt.compare(pass, userLog.password);

        /// console.log('passEncrypt', passEncrypt)
        if (passEncrypt) {
            res.json({
                payload: true,
                message: 'usuario existe'
            })
        } else {
            res.json({
                payload: false,
                message: 'usuario no existe'
            })
        }
    } catch (error) {
        // console.log('usuario no existente', error)
        res.json({
            payload: false,
            message: 'usuario no existente'
        })
    }


}

const getScoreCourseUser = async (req, res) => {
    const courseId = req.params.id;
    const userId = req.params.id;
    const authUser = req.headers.authorization;

    const userName = `userName:${userId}`; 	


    const url = `${process.env.URL}/v2/courses/${courseId}/gradebook/columns/finalGrade/users/${userName}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': authUser
            }
        })

        const dataGradebook = response.json();
        res.json({
            score: dataGradebook.displayGrade
        })

    } catch (error) {
        console.log('error al obttener calificación final del usuario')
    }
}

export { getUSer, verificateUser, getScoreCourseUser };