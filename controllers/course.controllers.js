import fetch from 'node-fetch';

import certificate from '../repositories/certificate.repository.js';

const getCourse = async (req, res) => {

    const courseId = req.params.id;
    const authUser = req.headers.authorization;
    const url = `${process.env.URL}/v3/courses/${courseId}`;

    try {

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': authUser
            }
        })

        const data = await response.json();

        try {
            let allGrades = [];
            let nextPage = `/v2/courses/${courseId}/gradebook/columns/finalGrade/users?limit=200&includeUnpostedGrades=true&includeDisabledMemberships=true`;
            const baseUrl = process.env.URL.replace(/\/$/, ''); // Asegurar que no termine con "/"

            while (nextPage) {
                try {
                    // Evitar que `learn/api/public` se duplique en la URL
                    const fullUrl = nextPage.startsWith('http')
                        ? nextPage
                        : `${baseUrl}${nextPage.replace(/^\/learn\/api\/public\//, '/')}`;



                    const responseGrandbook = await fetch(fullUrl, {
                        method: 'GET',
                        headers: {
                            'Authorization': authUser
                        }
                    });

                    const dataStudents = await responseGrandbook.json();


                    allGrades = allGrades.concat(dataStudents.results);

                    if (allGrades.length > 201) {
                        break
                    }

                    if (dataStudents.paging?.nextPage) {
                        // Corregir `nextPage` para evitar duplicados
                        nextPage = dataStudents.paging.nextPage.startsWith('http')
                            ? dataStudents.paging.nextPage
                            : `${baseUrl}${dataStudents.paging.nextPage.replace(/^\/learn\/api\/public\//, '/')}`;


                    } else {
                        console.log('No hay más páginas disponibles.');
                        nextPage = null;
                    }

                } catch (error) {
                    console.error('Error al obtener las calificaciones:', error);
                    nextPage = null;
                }
            }


            /*const dataStudents = await responseGrandbook.json();
            console.log(dataStudents)*/
            const arrStudents = await Promise.all(allGrades.map(async (element) => {

                const urlC = `${process.env.URL}/v1/users/`;

                try {
                    const responseStudent = await fetch(urlC + element.userId, {
                        method: 'GET',
                        headers: {
                            'Authorization': authUser
                        }
                    })

                    const studentInfo = await responseStudent.json();
                    
                    return {
                        user: {
                            id: studentInfo.id,
                            externalId: studentInfo.userName,
                            institutionRoleIds: studentInfo.institutionRoleIds,
                            name: studentInfo.name.given + " " + (studentInfo.name.middle ? studentInfo.name.middle : "") + " " + studentInfo.name.family
                        },
                        score: (element.displayGrade ? element.displayGrade : 0)
                    }

                } catch (e) {
                    console.log(e)
                    res.json({
                        payload: {
                            course: {
                                id: data.id,
                                courseId: data.courseId,
                                externalAccessUrl: data.externalAccessUrl,
                                name: data.name,
                                idCourse: courseId
                            },
                            students: null
                        }
                    })

                }

            }));

            res.json({
                payload: {
                    course: {
                        id: data.id,
                        courseId: data.courseId,
                        externalAccessUrl: data.externalAccessUrl,
                        name: data.name,
                        idCourse: courseId
                    },
                    students: arrStudents
                }
            })

        } catch (e) {
            // console.log('libro de califiaciones vacio');
            res.json({
                payload: {
                    course: {
                        id: data.id,
                        courseId: data.courseId,
                        externalAccessUrl: data.externalAccessUrl,
                        name: data.name,
                        idCourse: courseId
                    },
                    students: null
                }
            })
        }

    } catch (error) {
        console.log(error)
    }
}

const getCourses = async (req, res) => {


    const userId = `userName:${req.params.id}`


    let authUser = req.headers.authorization;

    const url = `${process.env.URL}/v1/users/${userId}/courses`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': authUser
            }
        })

        const data = await response.json();

        const courses = data.results


        const arrCourses = await Promise.all(courses.map(async (element) => {

            const urlC = `${process.env.URL}/v3/courses/`

            try {
                const responseCourses = await fetch(urlC + element.courseId, {
                    method: 'GET',
                    headers: {
                        'Authorization': authUser
                    }
                })

                const courseInfo = await responseCourses.json();

                const urlGradebook = `${process.env.URL}/v2/courses/${courseInfo.id}/gradebook/columns/finalGrade/users/${userId}`;
                const gradeBook = await fetch(urlGradebook, {
                    method: 'GET',
                    headers: {
                        'Authorization': authUser
                    }
                })
                const resultGradebook = await gradeBook.json();

                await validateAndCreateCertificate(courseInfo.id, courseInfo.name);

                return {
                    courseInfo: {
                        id: courseInfo.id,
                        courseId: courseInfo.courseId,
                        name: courseInfo.name,
                        score: resultGradebook.displayGrade?resultGradebook.displayGrade: null
                    },
                    role: element.courseRoleId
                }



            } catch (e) {
                console.log(e)
            }

        }));

        res.json({
            payload: arrCourses
        });

    } catch (e) {
        console.log(e)
    }
}


/*const getGradeBook = async (req, res) => {
    
    const courseId = req.params.id;
    const authUser = `Bearer ${req.session.accessToken}`;
    const url = `${process.env.URL}/v2/courses/${courseId}/gradebook/columns`;

    try {
        const response = await fetch(url,{
            method:'GET',
            headers: {
                'Authorization': authUser
            }
        });

        const data = await response.json();

        res.json({
            payload: data
        });
        
    } catch (error) {
        console.log(error)
    }

}*/

const validateAndCreateCertificate = async (courseId, courseName) => {
    try {
        // Buscar si ya existe un certificado para este curso
        const existingCertificate = await certificate.getOne(courseId);
        
        if (existingCertificate) {
            return {
                exists: true,
                certificate: existingCertificate,
                action: 'found'
            };
        } else {
            // Crear un nuevo certificado con valores por defecto
            const newCertificate = await certificate.insert(null, courseId);
            console.log(`✓ Nuevo certificado creado para: ${courseName} (ID: ${courseId})`);
            
            return {
                exists: false,
                certificate: newCertificate,
                action: 'created'
            };
        }
    } catch (error) {
        console.error(`✗ Error al validar/crear certificado para ${courseName}:`, error);
        return {
            exists: false,
            certificate: null,
            action: 'error',
            error: error.message
        };
    }
};

const validateCourseCertificates = async (req, res) => {
    const userId = `userName:${req.params.id}`;
    let authUser = req.headers.authorization;
    const url = `${process.env.URL}/v1/users/${userId}/courses`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': authUser
            }
        });

        const data = await response.json();
        const courses = data.results;

        console.log(`🔍 Iniciando validación de certificados para ${courses.length} cursos del usuario: ${req.params.id}`);

        const validationResults = await Promise.all(courses.map(async (element) => {
            const urlC = `${process.env.URL}/v3/courses/`;

            try {
                const responseCourses = await fetch(urlC + element.courseId, {
                    method: 'GET',
                    headers: {
                        'Authorization': authUser
                    }
                });

                const courseInfo = await responseCourses.json();
                const certificateValidation = await validateAndCreateCertificate(courseInfo.id, courseInfo.name);

                return {
                    courseId: courseInfo.id,
                    courseName: courseInfo.name,
                    certificateValidation
                };

            } catch (e) {
                console.error(`Error procesando curso ${element.courseId}:`, e);
                return {
                    courseId: element.courseId,
                    courseName: 'Error al obtener información',
                    certificateValidation: {
                        exists: false,
                        certificate: null,
                        action: 'error',
                        error: e.message
                    }
                };
            }
        }));

        const summary = {
            total: validationResults.length,
            found: validationResults.filter(r => r.certificateValidation.action === 'found').length,
            created: validationResults.filter(r => r.certificateValidation.action === 'created').length,
            errors: validationResults.filter(r => r.certificateValidation.action === 'error').length
        };

        console.log(`✅ Validación completada - Total: ${summary.total}, Encontrados: ${summary.found}, Creados: ${summary.created}, Errores: ${summary.errors}`);

        res.json({
            message: 'Validación de certificados completada',
            userId: req.params.id,
            summary,
            results: validationResults
        });

    } catch (error) {
        console.error('Error en validación de certificados:', error);
        res.status(500).json({
            error: 'Error interno del servidor durante la validación de certificados',
            details: error.message
        });
    }
};

export { getCourse, getCourses, validateAndCreateCertificate, validateCourseCertificates }