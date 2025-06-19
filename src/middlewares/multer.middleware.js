import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("*********** Multer Colled **********");
    cb(null, "./public/temp");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
