import Certificate from '../models/certificate.model.js';

const certificate = {}

const getId = async (id) => {
    try {
        const certificate = await Certificate.findOne({ _id: id })
        return certificate
    } catch (err) {
        return console.log(err)
    }
};


const getOne = async (courseId) => {
    try {
        const certificate = await Certificate.findOne({ courseId: courseId })
        
        return certificate
    } catch (err) {
        return console.log(err)
    }
};

const update = async (fileCourse, fileName) => {
    try {
        const fileUpdate = await Certificate.findByIdAndUpdate(fileCourse._id,
            {
                fileName: fileName
            })

        if (fileUpdate) {
            console.log('actualizado')
        } else {
            console.log('no actualizado')
        }

    } catch (error) {
        return console.log(error)
    }
}

const updateCoords = async (fileCourse, 
    nameX, nameY,
    documentX, documentY,
    courseNameX, courseNameY,
    dateX, dateY,
    fontsize, fontFamily, color, italic) => {
    try {
        const updateData = {
            fontsize: fontsize,
            fontFamily: fontFamily,
            color: color,
            italic: italic,
            nameX: nameX,
            nameY: nameY,
            documentX: documentX,
            documentY: documentY
        };

        // Solo actualizar coordenadas de curso y fecha si se proporcionan
        if (courseNameX !== undefined) updateData.courseNameX = courseNameX;
        if (courseNameY !== undefined) updateData.courseNameY = courseNameY;
        if (dateX !== undefined) updateData.dateX = dateX;
        if (dateY !== undefined) updateData.dateY = dateY;

        const fileUpdate = await Certificate.findByIdAndUpdate(fileCourse._id, updateData, { new: true });

        if (fileUpdate) {
            console.log('Coordenadas actualizadas correctamente');
            return fileUpdate;
        } else {
            console.log('No se pudo actualizar');
            return null;
        }

    } catch (error) {
        console.log('Error actualizando coordenadas:', error);
        return null;
    }
}

const insert = async (fileName, courseId) => {
    try {
        const newCertificate = new Certificate({
            "fileName": `${fileName}`,
            "courseId": `${courseId}`
        })

        const certificate = await newCertificate.save();
        
        return certificate

    } catch (err) {
        return console.log(err)
    }
};


const deleted = async (fileCourse) => {
    
    await Certificate.findByIdAndDelete(fileCourse._id)
    return true
}


const updateScore = async (fileCourse, score) => {
  try {
    await Certificate.findByIdAndUpdate(fileCourse._id, {
        reqScore: score
    })

  } catch (error) {
    console.log(error)
  }
}


certificate.getId = getId
certificate.getOne = getOne
certificate.insert = insert
certificate.update = update
certificate.deleted = deleted
certificate.updateCoords = updateCoords
certificate.updateScore = updateScore

export default certificate;