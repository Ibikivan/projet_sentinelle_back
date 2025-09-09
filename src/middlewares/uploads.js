const path = require('path');
const { createFileIfDosntExist } = require('../utils/functions');
const multer = require('multer');
const { ValidationError } = require('../utils/errors.classes');

const FILE_TYPES = {
    image: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    audio: ['audio/mpeg', 'audio/wave', 'audio/mp3', 'audio/x-m4a'],
    documents: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
};

const maxFileSize = parseInt(process.env.MAX_UPLOADS_FILES_SIZE, 10);
const UPLOADS_BASE = path.join(__dirname, '../../uploads');

function createUpload({ folder, allowedTypes, multiple=false, maxCount=5 }) {
    const targetDir = path.join(UPLOADS_BASE, folder);
    createFileIfDosntExist(targetDir);

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, targetDir);
        },
        filename: function(req, file, cb) {
            const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
            cb(null, uniqueName);
        }
    })

    const fileFilter = (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Type de fichier non pris en charge`, false));
        }
    }

    const upload = multer({
        storage: storage,
        fileFilter,
        limits: { fileSize: maxFileSize * 1024 * 1024 }
    });

    const handler = multiple ? upload.array(folder, maxCount) : upload.single(folder);

    return (req, res, next) => {
        handler(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE')
                    return new ValidationError(`Max file size on ${maxFileSize}Mo exceded`);
                if (err.code === 'LIMIT_UNEXPECTED_FILE')
                    return new ValidationError(`Too many files sended`);
                return new ValidationError(`Upload error: ${err?.message}`);
            } else if (err) {
                return new ValidationError(err?.message);
            }
            next();
        });
    };
}

module.exports = { createUpload, FILE_TYPES };
