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


        res.json({
            payload: result
        })

    } catch (error) {
        console.log(error)
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

        let nameX = req.body.nameX
        let nameY = req.body.nameY
        let documentX = req.body.documentX
        let documentY = req.body.documentY
        let courseNameX = req.body.courseNameX
        let courseNameY = req.body.courseNameY
        let dateX = req.body.createdAtX
        let dateY = req.body.createdAtY

        let { fontsize, fontFamily, color, italic } = req.body

        const updatedCertificate = await certificate.updateCoords(
            fileCourse,

            nameX, nameY,
            documentX, documentY,
            courseNameX, courseNameY,
            dateX, dateY,
            fontsize, fontFamily, color, italic
        );

        if (updatedCertificate) {
            res.json({
                message: 'Coordenadas actualizadas correctamente',
                payload: updatedCertificate
            });
        } else {
            res.status(500).json({
                error: 'Error al actualizar coordenadas'
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