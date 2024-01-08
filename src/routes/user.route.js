import {Router}  from "express";
import {registerUser, loginUser, logoutUser, refreshAccessToken} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

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

    router.route('/login').post(loginUser)

    //secured route
    router.route("/logout").post(verifyJwt,logoutUser)
    router.route("/refreshtoken").post(refreshAccessToken)


export default router