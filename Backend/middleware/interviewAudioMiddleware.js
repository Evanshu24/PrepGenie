import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Uploads/");
    },

    filename: (req, file, cb) => {
        cb(
            null,
            `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`
        );
    },
});

const fileFilter = (req, file, cb) => {
    console.log("FILE MIME TYPE:", file.mimetype);
    console.log("FILE NAME:", file.originalname);
    if (file.mimetype === "audio/webm" || file.mimetype === "audio/webm;codecs=opus" || file.mimetype === "video/webm"){
        cb(null, true);
    } else {
        cb(new Error("Only WebM audio/video files are allowed"), false);
    }
};

const uploadInterviewAudio = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 25 * 1024 * 1024,
    },
});

export default uploadInterviewAudio;