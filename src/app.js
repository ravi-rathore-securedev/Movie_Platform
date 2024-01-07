import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";

//express app 
const app = express()

// cors use
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


//routes
import userRouter from './routes/user.route.js'


//routes declaration
app.use("/test",userRouter)




 export default app 

