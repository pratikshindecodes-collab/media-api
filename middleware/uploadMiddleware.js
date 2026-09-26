import multer from "multer";
import { randomUUID } from "crypto";

const storage = multer.diskStorage({
    destination: "uploads/",

    filename: (req, file, cb) => {

        const extension =
            file.originalname
                .toLowerCase()
                .slice(
                    file.originalname.lastIndexOf(".")
                );

        const uniqueName = 
            `${randomUUID()}${extension}`;

        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {

    console.log("File MIME type:", file.mimetype);
    console.log("Original filename:", file.originalname);

    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ];

    const extension = file.originalname
        .toLowerCase()
        .slice(file.originalname.lastIndexOf("."));

    // Normal MIME type
    if (allowedMimeTypes.includes(file.mimetype)) {
        return cb(null, true);
    }

    // Some clients send images as application/octet-stream
    // so check the file extension as a fallback.
    if (
        file.mimetype === "application/octet-stream" &&
        allowedExtensions.includes(extension)
    ) {
        return cb(null, true);
    }

    cb(
        new Error(
            "Only JPEG, PNG and WebP images are allowed"
        ),
        false
    );
};

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter
});

export default upload;

