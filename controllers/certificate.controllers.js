import { uploadFile, getFiles, getFile, downloadFile, getFileURL } from '../s3.js'
import certificate from '../repositories/certificate.repository.js'
import fs from 'fs'
import axios from 'axios'

const getCertificates = async (req, res) => {
    await getFiles()
    res.send('lista de objetos')
}

const getCertificate = async (req, res) => {

    const imageUrl = await getFileURL(req.params.filename)
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    //console.log('image: ',base64Image);
    res.json({ image: `data:image/png;base64,${base64Image}` });
    /*res.json({
        url: imageUrl
    })*/
}

const uploadCertificate = async (req, res) => {
    //console.log('cer:',req.files)
    try {
        await uploadFile(req.files.certificado);
        

        Object.values(req.files).forEach(file => {
            fs.unlinkSync(file.tempFilePath);
        });

        const fileCourse = await certificate.getOne(req.body.courseId)

        if (fileCourse) {

            await certificate.update(fileCourse, req.files.certificado.name);
            res.json({
                menssage: 'ok'
            })
        } else {
            console.log('el curso no tiene certificado')
            const infoCertificate = await certificate.insert(req.files.certificado.name, req.body.courseId)
            res.json({
                message: 'archivo resivido',
                name: req.files.certificado,
                info: infoCertificate
            });
        }
    } catch (error) {
        console.log('error al cargar certificado', error)
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

    //console.log(req.body)

    try {
        const fileCourse = await certificate.getOne(req.body.courseId)

        let nameX = req.body.nameX
        let nameY = req.body.nameY
        let documentX = req.body.documentX
        let documentY = req.body.documentY
        let { fontsize, fontFamily, color, italic } = req.body


        await certificate.updateCoords(fileCourse,
            nameX, nameY,
            documentX, documentY,
            fontsize, fontFamily, color, italic);
        
        const result = await certificate.getOne(req.body.courseId)
        
        res.json({
            payload: result
        })

    } catch (error) {
        console.log('error al actualizar parametros del certificado', error)
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