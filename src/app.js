import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";

//defining express app 
const app = express()

// cors use for cross origin as middleware
//defining origin and credentials
app.use(cors({
    origin:process.env.CORS_ORIGIN,
     credentials:true
}))

// json file limit set
app.use(express.json({
    limit:"16kb"
}))


// // data from url
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))

// //image folder static
app.use(express.static("public"))

// //set cookie on server
app.use(cookieParser())


//routes import
import userRouter from './routes/user.route.js'
import videoRouter from './routes/video.routes.js'


//routes declaration
app.use("/test",userRouter)
app.use("/video",videoRouter)



 export default app 

