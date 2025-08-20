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
        // const certificates = await Certificate.find({});
        // console.log('Retrieved certificates:', certificates);

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

const updateCoords = async (fileCourse, formData) => {
    try {
        const updateData = {};

        // Función helper para convertir string a número
        const parseNumber = (value) => {
            if (value === undefined || value === null || value === '') return undefined;
            const num = parseFloat(value);
            return isNaN(num) ? undefined : num;
        };

        // Función helper para convertir string a boolean
        const parseBoolean = (value) => {
            if (value === undefined || value === null || value === '') return undefined;
            return value === 'true' || value === true;
        };

        // Función helper para decodificar color URL
        const decodeColor = (value) => {
            if (value === undefined || value === null || value === '') return undefined;
            return decodeURIComponent(value);
        };

        // Actualizar coordenadas y estilos para el nombre
        if (formData.nameX !== undefined) updateData.nameX = parseNumber(formData.nameX);
        if (formData.nameY !== undefined) updateData.nameY = parseNumber(formData.nameY);
        if (formData.nameFontSize !== undefined) updateData.nameFontSize = parseNumber(formData.nameFontSize);
        if (formData.nameFontFamily !== undefined) updateData.nameFontFamily = formData.nameFontFamily;
        if (formData.nameColor !== undefined) updateData.nameColor = decodeColor(formData.nameColor);
        if (formData.nameItalic !== undefined) updateData.nameItalic = parseBoolean(formData.nameItalic);
        if (formData.nameBold !== undefined) updateData.nameBold = parseBoolean(formData.nameBold);

        // Actualizar coordenadas y estilos para el documento
        if (formData.documentX !== undefined) updateData.documentX = parseNumber(formData.documentX);
        if (formData.documentY !== undefined) updateData.documentY = parseNumber(formData.documentY);
        if (formData.documentFontSize !== undefined) updateData.documentFontSize = parseNumber(formData.documentFontSize);
        if (formData.documentFontFamily !== undefined) updateData.documentFontFamily = formData.documentFontFamily;
        if (formData.documentColor !== undefined) updateData.documentColor = decodeColor(formData.documentColor);
        if (formData.documentItalic !== undefined) updateData.documentItalic = parseBoolean(formData.documentItalic);
        if (formData.documentBold !== undefined) updateData.documentBold = parseBoolean(formData.documentBold);

        // Actualizar coordenadas y estilos para el nombre del curso
        if (formData.courseNameX !== undefined) updateData.courseNameX = parseNumber(formData.courseNameX);
        if (formData.courseNameY !== undefined) updateData.courseNameY = parseNumber(formData.courseNameY);
        if (formData.courseNameFontSize !== undefined) updateData.courseNameFontSize = parseNumber(formData.courseNameFontSize);
        if (formData.courseNameFontFamily !== undefined) updateData.courseNameFontFamily = formData.courseNameFontFamily;
        if (formData.courseNameColor !== undefined) updateData.courseNameColor = decodeColor(formData.courseNameColor);
        if (formData.courseNameItalic !== undefined) updateData.courseNameItalic = parseBoolean(formData.courseNameItalic);
        if (formData.courseNameBold !== undefined) updateData.courseNameBold = parseBoolean(formData.courseNameBold);

        // Actualizar coordenadas y estilos para la fecha
        if (formData.dateX !== undefined) updateData.dateX = parseNumber(formData.dateX);
        if (formData.dateY !== undefined) updateData.dateY = parseNumber(formData.dateY);
        if (formData.dateFontSize !== undefined) updateData.dateFontSize = parseNumber(formData.dateFontSize);
        if (formData.dateFontFamily !== undefined) updateData.dateFontFamily = formData.dateFontFamily;
        if (formData.dateColor !== undefined) updateData.dateColor = decodeColor(formData.dateColor);
        if (formData.dateItalic !== undefined) updateData.dateItalic = parseBoolean(formData.dateItalic);
        if (formData.dateBold !== undefined) updateData.dateBold = parseBoolean(formData.dateBold);

        // Mantener compatibilidad con campos legacy
        if (formData.fontsize !== undefined) updateData.fontsize = parseNumber(formData.fontsize);
        if (formData.fontFamily !== undefined) updateData.fontFamily = formData.fontFamily;
        if (formData.color !== undefined) updateData.color = decodeColor(formData.color);
        if (formData.italic !== undefined) updateData.italic = parseBoolean(formData.italic);

        const fileUpdate = await Certificate.findByIdAndUpdate(fileCourse._id, updateData, { new: true });

        if (fileUpdate) {
            console.log('Coordenadas y estilos actualizados correctamente');
            return fileUpdate;
        } else {
            console.log('No se pudo actualizar');
            return null;
        }

    } catch (error) {
        console.log('Error actualizando coordenadas y estilos:', error);
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