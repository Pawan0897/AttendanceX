const multer = require('multer')
const path = require('path')
// *******************************
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'upload/')
    },

    filename: (req, file, cb) => {

        const uniqueName = `${Date.now()}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

// *******************************
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Sirf image upload karo (jpg, png, webp)'), false)
    }
}
// *******************************
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }  // 2MB max
})

module.exports = upload