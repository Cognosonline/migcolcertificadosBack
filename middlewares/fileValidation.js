export const validateCertificateFile = (req, res, next) => {
    try {
        if (!req.files || !req.files.certificado) {
            return res.status(400).json({
                error: 'No se ha enviado ningún archivo de certificado',
                field: 'certificado'
            });
        }

        const certificateFile = req.files.certificado;

        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        const allowedExtensions = ['.png', '.jpg', '.jpeg'];

        const fileExtension = certificateFile.name.toLowerCase().substring(certificateFile.name.lastIndexOf('.'));

        if (!allowedMimeTypes.includes(certificateFile.mimetype) || !allowedExtensions.includes(fileExtension)) {
            cleanupTempFile(certificateFile);

            return res.status(400).json({
                error: 'Formato de archivo no válido. Solo se permiten archivos PNG y JPG',
                allowedFormats: ['PNG', 'JPG', 'JPEG'],
                receivedFormat: fileExtension || 'desconocido'
            });
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (certificateFile.size > maxSize) {
            cleanupTempFile(certificateFile);

            return res.status(400).json({
                error: 'El archivo es demasiado grande. Tamaño máximo permitido: 10MB',
                fileSize: `${(certificateFile.size / (1024 * 1024)).toFixed(2)}MB`,
                maxSize: '10MB'
            });
        }

        req.validatedFile = {
            file: certificateFile,
            extension: fileExtension,
            sizeInMB: (certificateFile.size / (1024 * 1024)).toFixed(2)
        };

        next();
    } catch (error) {
        console.log('Error en validación de archivo:', error);

        if (req.files) {
            Object.values(req.files).forEach(file => {
                cleanupTempFile(file);
            });
        }

        return res.status(500).json({
            error: 'Error interno del servidor durante la validación del archivo'
        });
    }
};

export const validateCourseId = (req, res, next) => {
    if (!req.body.courseId || req.body.courseId.trim() === '') {
        return res.status(400).json({
            error: 'courseId es requerido y no puede estar vacío',
            field: 'courseId'
        });
    }

    next();
};