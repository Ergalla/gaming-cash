import express from "express";
import multer from "multer";
import { updateUser } from "../controllers/user-controller.js";

const router = express.Router();

const destination = "uploads";

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });

router.put("/:id", uploads.single("avatar"), updateUser);

export default router;
