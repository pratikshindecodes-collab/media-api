import { Readable } from "stream";

import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (
    fileBuffer,
    folder = "media-api/products"
) => {
    return new Promise(
        (resolve, reject) => {
            const uploadStream =
                cloudinary.uploader.upload_stream(
                    {
                        folder,

                        resource_type:
                            "image",

                            public_id:
                                undefined
                    },

                    (error, result) => {
                        if (error) {
                            return reject(
                                error
                            );
                        }

                        resolve(result);
                    }
                );

                Readable
                    .from(fileBuffer)
                    .pipe(uploadStream);
        }
    );
};


export default uploadToCloudinary;

