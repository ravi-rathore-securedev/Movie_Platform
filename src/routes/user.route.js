import {Router}  from "express";
import registerUser from "../controllers/user.controller.js";
import { upload, uploadMultiple } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1,
        },
        {
            name:"coverImage",
            maxCount:1,
        }
    ]),
    // uploadMultiple,
    registerUser)



export default router