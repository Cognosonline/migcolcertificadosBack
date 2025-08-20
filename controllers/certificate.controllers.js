import axios from 'axios'
import fs from 'fs'

import { uploadFile, getFiles, downloadFile, getFileURL } from '../s3.js'

import certificate from '../repositories/certificate.repository.js'
import userCertificate from '../repositories/userCertificate.repository.js'

const getCertificates = async (req, res) => {
    await getFiles()
    res.send('lista de objetos')
}

const getCertificate = async (req, res) => {
    const imageUrl = await getFileURL(req.params.filename)
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const base64Image = Buffer.from(response.data, "binary").toString("base64");

    res.json({ image: `data:image/png;base64,${base64Image}` });
}

const uploadCertificate = async (req, res) => {
    try {
        const certificateFile = req.validatedFile.file;

        await uploadFile(certificateFile);

        Object.values(req.files).forEach(file => {
            if (file.tempFilePath && fs.existsSync(file.tempFilePath)) {
                fs.unlinkSync(file.tempFilePath);
            }
        });

        const fileCourse = await certificate.getOne(req.body.courseId);

        if (fileCourse) {
            // Actualizar certificado existente
            await certificate.update(fileCourse, certificateFile.name);
            res.json({
                message: 'Certificado actualizado correctamente',
                fileName: certificateFile.name,
                courseId: req.body.courseId,
                fileInfo: {
                    size: `${req.validatedFile.sizeInMB}MB`,
                    format: req.validatedFile.extension.toUpperCase().substring(1)
                }
            });
        } else {
            console.log('El curso no tiene certificado, creando nuevo...');

            const infoCertificate = await certificate.insert(certificateFile.name, req.body.courseId);
            res.json({
                message: 'Certificado creado correctamente',
                fileName: certificateFile.name,
                courseId: req.body.courseId,
                certificateInfo: infoCertificate,
                fileInfo: {
                    size: `${req.validatedFile.sizeInMB}MB`,
                    format: req.validatedFile.extension.toUpperCase().substring(1)
                }
            });
        }

    } catch (error) {
        console.log('Error al cargar certificado:', error);

        if (req.files) {
            Object.values(req.files).forEach(file => {
                if (file.tempFilePath && fs.existsSync(file.tempFilePath)) {
                    try {
                        fs.unlinkSync(file.tempFilePath);
                    } catch (cleanupError) {
                        console.log('Error limpiando archivo temporal:', cleanupError);
                    }
                }
            });
        }

        res.status(500).json({
            error: 'Error interno del servidor al procesar el certificado'
        });
    }
}

const downloadCertificate = async (req, res) => {
    await downloadFile(req.params.filename)
    res.json({
        message: 'Archivo descargado'
    })
}

const getCertificateCourseId = async (req, res) => {

    try {
        const result = await certificate.getOne(req.params.courseId)

        if (!result) {
            return res.status(404).json({
                error: 'Certificado no encontrado para este curso'
            });
        }

        res.json({
            payload: {
                fileName: result.fileName === 'null' ? null : result.fileName,
                courseId: result.courseId,
                
                // Coordenadas y estilos para el nombre
                nameX: result.nameX,
                nameY: result.nameY,
                nameFontSize: result.nameFontSize,
                nameFontFamily: result.nameFontFamily,
                nameColor: result.nameColor,
                nameItalic: result.nameItalic,
                nameBold: result.nameBold,
                
                // Coordenadas y estilos para el documento
                documentX: result.documentX,
                documentY: result.documentY,
                documentFontSize: result.documentFontSize,
                documentFontFamily: result.documentFontFamily,
                documentColor: result.documentColor,
                documentItalic: result.documentItalic,
                documentBold: result.documentBold,
                
                // Coordenadas y estilos para el nombre del curso
                courseNameX: result.courseNameX,
                courseNameY: result.courseNameY,
                courseNameFontSize: result.courseNameFontSize,
                courseNameFontFamily: result.courseNameFontFamily,
                courseNameColor: result.courseNameColor,
                courseNameItalic: result.courseNameItalic,
                courseNameBold: result.courseNameBold,
                
                // Coordenadas y estilos para la fecha
                dateX: result.dateX,
                dateY: result.dateY,
                dateFontSize: result.dateFontSize,
                dateFontFamily: result.dateFontFamily,
                dateColor: result.dateColor,
                dateItalic: result.dateItalic,
                dateBold: result.dateBold,
                
                // Otros campos
                widthR: result.widthR,
                heightR: result.heightR,
                state: result.state,
                reqScore: result.reqScore,
                createDate: result.createDate,
                
                // Campos legacy para compatibilidad
                fontsize: result.fontsize,
                fontFamily: result.fontFamily,
                color: result.color,
                italic: result.italic
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
}

const deletedCertificate = async (req, res) => {
    try {

        const fileCourse = await certificate.getOne(req.body.courseId)

        await certificate.deleted(fileCourse)

        res.json({
            mesagge: 'ok'
        })

    } catch (e) {
        console.log(e)
    }
}

const updateCoords = async (req, res) => {
    try {        
        const fileCourse = await certificate.getOne(req.body.courseId)

        if (!fileCourse) {
            return res.status(404).json({
                error: 'Certificado no encontrado para este curso'
            });
        }

        // Función helper para validar números
        const validateNumber = (value, fieldName) => {
            if (value !== undefined && value !== null && value !== '') {
                const num = parseFloat(value);
                if (isNaN(num)) {
                    throw new Error(`${fieldName} debe ser un número válido`);
                }
                return num;
            }
            return undefined;
        };

        // Función helper para validar colores
        const validateColor = (value, fieldName) => {
            if (value !== undefined && value !== null && value !== '') {
                const decodedColor = decodeURIComponent(value);
                if (!/^#[0-9A-Fa-f]{6}$/.test(decodedColor)) {
                    throw new Error(`${fieldName} debe ser un color hexadecimal válido (ej: #000000)`);
                }
                return decodedColor;
            }
            return undefined;
        };

        // Función helper para validar booleanos
        const validateBoolean = (value, fieldName) => {
            if (value !== undefined && value !== null && value !== '') {
                if (value !== 'true' && value !== 'false' && value !== true && value !== false) {
                    throw new Error(`${fieldName} debe ser true o false`);
                }
                return value === 'true' || value === true;
            }
            return undefined;
        };

        // Validar los datos recibidos
        try {
            // Validar coordenadas y estilos del nombre
            validateNumber(req.body.nameX, 'nameX');
            validateNumber(req.body.nameY, 'nameY');
            validateNumber(req.body.nameFontSize, 'nameFontSize');
            validateColor(req.body.nameColor, 'nameColor');
            validateBoolean(req.body.nameItalic, 'nameItalic');
            validateBoolean(req.body.nameBold, 'nameBold');

            // Validar coordenadas y estilos del documento
            validateNumber(req.body.documentX, 'documentX');
            validateNumber(req.body.documentY, 'documentY');
            validateNumber(req.body.documentFontSize, 'documentFontSize');
            validateColor(req.body.documentColor, 'documentColor');
            validateBoolean(req.body.documentItalic, 'documentItalic');
            validateBoolean(req.body.documentBold, 'documentBold');

            // Validar coordenadas y estilos del nombre del curso
            validateNumber(req.body.courseNameX, 'courseNameX');
            validateNumber(req.body.courseNameY, 'courseNameY');
            validateNumber(req.body.courseNameFontSize, 'courseNameFontSize');
            validateColor(req.body.courseNameColor, 'courseNameColor');
            validateBoolean(req.body.courseNameItalic, 'courseNameItalic');
            validateBoolean(req.body.courseNameBold, 'courseNameBold');

            // Validar coordenadas y estilos de la fecha
            validateNumber(req.body.dateX, 'dateX');
            validateNumber(req.body.dateY, 'dateY');
            validateNumber(req.body.dateFontSize, 'dateFontSize');
            validateColor(req.body.dateColor, 'dateColor');
            validateBoolean(req.body.dateItalic, 'dateItalic');
            validateBoolean(req.body.dateBold, 'dateBold');

            // Validar campos legacy
            validateNumber(req.body.fontsize, 'fontsize');
            validateColor(req.body.color, 'color');
            validateBoolean(req.body.italic, 'italic');

        } catch (validationError) {
            return res.status(400).json({
                error: `Error de validación: ${validationError.message}`
            });
        }

        // Actualizar certificado con los datos del formulario
        const updatedCertificate = await certificate.updateCoords(fileCourse, req.body);

        if (updatedCertificate) {
            res.json({
                message: 'Coordenadas y estilos actualizados correctamente',
                payload: {
                    courseId: updatedCertificate.courseId,
                    name: {
                        x: updatedCertificate.nameX,
                        y: updatedCertificate.nameY,
                        fontSize: updatedCertificate.nameFontSize,
                        fontFamily: updatedCertificate.nameFontFamily,
                        color: updatedCertificate.nameColor,
                        italic: updatedCertificate.nameItalic,
                        bold: updatedCertificate.nameBold
                    },
                    document: {
                        x: updatedCertificate.documentX,
                        y: updatedCertificate.documentY,
                        fontSize: updatedCertificate.documentFontSize,
                        fontFamily: updatedCertificate.documentFontFamily,
                        color: updatedCertificate.documentColor,
                        italic: updatedCertificate.documentItalic,
                        bold: updatedCertificate.documentBold
                    },
                    courseName: {
                        x: updatedCertificate.courseNameX,
                        y: updatedCertificate.courseNameY,
                        fontSize: updatedCertificate.courseNameFontSize,
                        fontFamily: updatedCertificate.courseNameFontFamily,
                        color: updatedCertificate.courseNameColor,
                        italic: updatedCertificate.courseNameItalic,
                        bold: updatedCertificate.courseNameBold
                    },
                    date: {
                        x: updatedCertificate.dateX,
                        y: updatedCertificate.dateY,
                        fontSize: updatedCertificate.dateFontSize,
                        fontFamily: updatedCertificate.dateFontFamily,
                        color: updatedCertificate.dateColor,
                        italic: updatedCertificate.dateItalic,
                        bold: updatedCertificate.dateBold
                    },
                    // Campos legacy para compatibilidad
                    legacy: {
                        fontsize: updatedCertificate.fontsize,
                        fontFamily: updatedCertificate.fontFamily,
                        color: updatedCertificate.color,
                        italic: updatedCertificate.italic
                    }
                }
            });
        } else {
            res.status(500).json({
                error: 'Error al actualizar coordenadas y estilos'
            });
        }
    } catch (error) {
        console.log('Error al actualizar parámetros del certificado:', error)

        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
}

const updateReqScore = async (req, res) => {

    try {
        const fileCourse = await certificate.getOne(req.body.courseId)
        const reqScore = req.body.reqScore
        const result = await certificate.updateScore(fileCourse, reqScore)
        res.json({
            payload: result
        })
    } catch (error) {
        console.log(error);
    }
}

const getReqScore = async (req, res) => {

    try {

        const fileCourse = await certificate.getOne(req.params.courseId)

        res.json({
            payload: fileCourse.reqScore
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    getCertificates,
    uploadCertificate,
    getCertificate,
    downloadCertificate,
    getCertificateCourseId,
    deletedCertificate,
    updateCoords,
    updateReqScore,
    getReqScore
}