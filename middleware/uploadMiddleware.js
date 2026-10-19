
import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp"
]);

const fileFilter = (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
        return cb(
            new Error(
                "Only JPEG, PNG and WebP images are allowed"
            )
        );
    }

    cb(null, true);
};

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 5,
        fields: 10,
        parts: 15
    },
    fileFilter
});

export default upload;
